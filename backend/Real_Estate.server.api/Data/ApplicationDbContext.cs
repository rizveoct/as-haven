using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Real_Estate.server.api.Models;
using Microsoft.EntityFrameworkCore;
using Real_Estate.server.api.Data.EntityConfig;

namespace Real_Estate.server.api.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, string,
       IdentityUserClaim<string>, UserRole, IdentityUserLogin<string>,
       IdentityRoleClaim<string>, IdentityUserToken<string>>
    {

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {

        }

        public DbSet<Project> Projects { get; set; }
        public DbSet<ProjectGallery> ProjectGalleries { get; set; }
        public DbSet<ProjectFeature> ProjectFeatures { get; set; }
        public DbSet<Landowner> Landowners { get; set; }
        public DbSet<GalleryImage> GalleryImages { get; set; }
        public DbSet<Slider> Sliders { get; set; }
        public DbSet<Testimonial> Testimonials { get; set; }
        public DbSet<Contactus> Contactus { get; set; }
        public DbSet<Consultant> Consultants { get; set; }

        public DbSet<Team> Teams { get; set; }
        public DbSet<Offer> Offers { get; set; }
        public DbSet<CompanyInfo> CompanyInfos { get; set; }
        public DbSet<Aboutus> Aboutus { get; set; }
        public DbSet<Blog> Blogs { get; set; }
        public DbSet<Faq> Faqers { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.ApplyConfiguration(new UserRoleEntityConfig());
            builder.ApplyConfiguration(new ProjectFeatureEntityConfig());
            builder.ApplyConfiguration(new ProjectGalleryEntityConfig());
            builder.ApplyConfiguration(new BlogEntityConfig());
        }
    }
}
