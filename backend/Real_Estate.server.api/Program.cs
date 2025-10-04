using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using Real_Estate.server.api.Data;
using Real_Estate.server.api.Models;
using Real_Estate.server.api.services.Implementations;
using Real_Estate.server.api.services.Interfaces;
using Serilog;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// --- CORS ---
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontendApp", policy =>
        policy.WithOrigins(
            "http://localhost:4200",
            "http://primehousingraj.com",
            "https://primehousingraj.com",
            "http://www.primehousingraj.com",
            "https://www.primehousingraj.com"
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()
    );
});

//builder.Services.AddCors(options =>
//{
//    options.AddPolicy("AllowFrontendApp", policy =>
//        policy.WithOrigins(
//            "http://localhost:4200",
//            "https://triconproperty.com",
//            "http://triconproperty.com",
//            "http://www.triconproperty.com",
//            "https://www.triconproperty.com"
//            )
//            .AllowAnyHeader()
//            .AllowAnyMethod()
//            .AllowCredentials()
//    );
//});

// --- Serilog (minimal, keep your existing if you want) ---
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Warning()
    .WriteTo.Console()
    .WriteTo.File("logs/log-.txt", rollingInterval: RollingInterval.Day, retainedFileCountLimit: 31)
    .CreateLogger();
builder.Host.UseSerilog();

// --- EF Core / Identity / JWT (unchanged) ---
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("Default"), opt =>
    {
        opt.CommandTimeout((int)TimeSpan.FromMinutes(5).TotalSeconds);
        opt.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery);
    }));

builder.Services.AddIdentity<ApplicationUser, ApplicationRole>(options =>
{
    options.Stores.MaxLengthForKeys = 128;
    options.Password.RequireDigit = false;
    options.Password.RequireLowercase = false;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequiredLength = 6;
    options.Password.RequiredUniqueChars = 1;
    options.SignIn.RequireConfirmedEmail = true;
    options.Lockout.MaxFailedAccessAttempts = 5;
    options.Lockout.AllowedForNewUsers = true;
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(10);
})
.AddDefaultTokenProviders()
.AddEntityFrameworkStores<ApplicationDbContext>();

builder.Services.AddScoped<IDbInitializer, DbInitializer>();
builder.Services.AddScoped<IFaqServices, FaqRepository>();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
    };
});

builder.Services.AddControllers();
builder.Services.AddOpenApi();

var app = builder.Build();

// --- Seed (unchanged) ---
using (var scope = app.Services.CreateScope())
{
    try
    {
        var service = scope.ServiceProvider.GetRequiredService<IDbInitializer>();
        await service.InitializeDB();
        await service.InitializeRoles();
        await service.InitializeUsers();
    }
    catch (Exception ex)
    {
        Log.Warning(ex, "Seeding failed");
    }
}

// --- Pipeline ---
app.UseCors("AllowFrontendApp");
app.UseHttpsRedirection();

// 1) Serve default wwwroot (if present)
app.UseStaticFiles();

// 2) Serve your images folder from a CONFIGURED physical path (safe cross-OS)
var imagesPath = app.Configuration["FileStorage:ImagesPath"]; // set this per environment!
try
{
    if (!string.IsNullOrWhiteSpace(imagesPath) && Directory.Exists(imagesPath))
    {
        app.UseStaticFiles(new StaticFileOptions
        {
            FileProvider = new PhysicalFileProvider(imagesPath),
            RequestPath = "/assets/images" // URL prefix
        });
        app.Logger.LogWarning("Static map OK → {Req} -> {Phys}", "/assets/images", imagesPath);
    }
    else
    {
        app.Logger.LogWarning("ImagesPath missing or not found: {p}", imagesPath ?? "(null)");
    }
}
catch (Exception ex)
{
    app.Logger.LogError(ex, "Failed to map static images");
    // Do NOT rethrow; keep app running
}

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// quick diagnostics
app.Logger.LogWarning("ContentRoot: {c}", app.Environment.ContentRootPath);
app.Logger.LogWarning("WebRoot    : {w}", app.Environment.WebRootPath);
app.Logger.LogWarning("ImagesPath : {p}", imagesPath ?? "(null)");

app.Run();
