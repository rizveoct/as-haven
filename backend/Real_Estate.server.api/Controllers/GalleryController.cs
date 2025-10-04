using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Real_Estate.server.api.Data;
using Real_Estate.server.api.Models;
using System.Diagnostics;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Real_Estate.server.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GalleryController : ControllerBase
    {
        private readonly ApplicationDbContext context;
        private readonly IWebHostEnvironment webHostEnvironment;

        public GalleryController(ApplicationDbContext context, IWebHostEnvironment webHostEnvironment)
        {
            this.context = context;
            this.webHostEnvironment = webHostEnvironment;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var galleries = await context.GalleryImages.AsNoTracking().OrderBy(e => e.Order).ToListAsync();
            return Ok(galleries);
        }


        [HttpPost]
        [Route("create")]
        public async Task<IActionResult> Create(GalleryModel model)
        {
            if (model.contentname == null)
            {
                return Ok("Please select a file.");
            }
            var newModel = new GalleryImage();

            newModel.Id = Guid.CreateVersion7().ToString();
            if (model.type == "Image" || model.type == "Video")
            {
                if (model.contentname != null && model.contentname.Length > 0)
                {
                    var extension = Path.GetExtension(model.contentname.FileName);
                    var fileName = DateTime.UtcNow.ToString("ddMMyyyHHmmssffffff") + extension;
                    string rootPath = webHostEnvironment.ContentRootPath;
                    string fileUploadRoot = Path.Combine(rootPath, "assets", "images");

                    // Ensure the directory exists
                    Directory.CreateDirectory(fileUploadRoot);

                    using (var stream = new FileStream(Path.Combine(fileUploadRoot, fileName), FileMode.Create))
                    {
                        await model.contentname.CopyToAsync(stream);
                    }
                    newModel.ContentName = fileName;
                }
            }
            newModel.ContentType = model.type;
            newModel.CreateDate = DateTime.UtcNow;
            newModel.IsActive = true;
            newModel.Order = model.order;
            newModel.Title = model.title;
            newModel.Description = model.description;

            await context.GalleryImages.AddAsync(newModel);
            await context.SaveChangesAsync();
            return Ok(new { message = "Gallery has been created" });
        }

        [HttpPost]
        [Route("edit")]
        public async Task<IActionResult> Edit(GalleryModel model)
        {
            var exModel = await context.GalleryImages.Where(e => e.Id == model.id).FirstOrDefaultAsync();
            if (exModel != null)
            {
                exModel.Title = model.title;
                exModel.Description = model.description;
                exModel.Order = model.order;
                exModel.ContentType = model.type;
                if (model.contentname != null && model.contentname.Length > 0)
                {
                    var extension = Path.GetExtension(model.contentname.FileName);
                    var fileName = DateTime.UtcNow.ToString("ddMMyyyHHmmssffffff") + extension;
                    string rootPath = webHostEnvironment.ContentRootPath;
                    string fileUploadRoot = Path.Combine(rootPath, "assets", "images");

                    // Ensure the directory exists
                    Directory.CreateDirectory(fileUploadRoot);

                    using (var stream = new FileStream(Path.Combine(fileUploadRoot, fileName), FileMode.Create))
                    {
                        await model.contentname.CopyToAsync(stream);
                    }
                    exModel.ContentName = fileName;
                }
                context.Entry(exModel).State = EntityState.Modified;
                await context.SaveChangesAsync();
                return Ok(new { message = "Item has been updated." });
            }

            return Ok(new { message = "Data not found." });
        }

        [HttpPost]
        [Route("itemactiveinactive")]
        public async Task<IActionResult> ItemActiveInactive(string id, bool value)
        {
            var data = await context.GalleryImages.Where(e => e.Id == id).FirstOrDefaultAsync();
            if (data == null) return Ok("Data not found.");
            data.IsActive = value;
            context.Entry(data).State = EntityState.Modified;
            await context.SaveChangesAsync();
            return Ok("Item has been updated.");
        }

        [HttpPost]
        [Route("delete")]
        public async Task<IActionResult> Delete(string? id)
        {
            var data = await context.GalleryImages.Where(e => e.Id == id).FirstOrDefaultAsync();
            if (data == null) return Ok("Data not found.");
            context.GalleryImages.Remove(data);
            await context.SaveChangesAsync();
            return Ok(new { message = "Item has been deleted." });
        }

    }

    public class GalleryModel
    {
        public string? id { get; set; }
        public IFormFile? contentname { get; set; }
        public string? type { get; set; }
        public string? title { get; set; }
        public string? description { get; set; }
        public int order { get; set; }
    }
}
