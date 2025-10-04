using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;

[AllowAnonymous]
[Route("api/[controller]")]
[ApiController]
public class AttachmentController : ControllerBase
{
    private readonly string _imagesPath;
    private readonly FileExtensionContentTypeProvider _types = new();

    public AttachmentController(IConfiguration cfg, IWebHostEnvironment env)
    {
        // Prefer configured absolute path; fallback to <WebRoot>/assets/images or <ContentRoot>/assets/images
        _imagesPath = cfg["FileStorage:ImagesPath"]
                      ?? (env.WebRootPath is not null ? Path.Combine(env.WebRootPath, "assets", "images")
                                                      : Path.Combine(env.ContentRootPath, "assets", "images"));
    }

    [HttpGet("get/{fileName}")]
    public IActionResult GetImage(string fileName)
    {
        var safe = Path.GetFileName(fileName);
        var full = Path.Combine(_imagesPath, safe);

        HttpContext.RequestServices.GetRequiredService<ILogger<AttachmentController>>()
            .LogWarning("Serve file: {f}", full);

        if (!System.IO.File.Exists(full)) return NotFound();

        if (!_types.TryGetContentType(full, out var contentType))
            contentType = "application/octet-stream";

        return PhysicalFile(full, contentType);
    }
}
