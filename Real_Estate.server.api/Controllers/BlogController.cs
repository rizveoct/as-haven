using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Real_Estate.server.api.Data;
using Real_Estate.server.api.Models;
using System.Diagnostics;
using System.Security.Claims;

namespace Real_Estate.server.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlogController : ControllerBase
    {
        private readonly ApplicationDbContext context;
        private readonly IWebHostEnvironment webHostEnvironment;

        public BlogController(ApplicationDbContext context, IWebHostEnvironment webHostEnvironment)
        {
            this.context = context;
            this.webHostEnvironment = webHostEnvironment;
        }
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var model = await context.Blogs.AsNoTracking().ToListAsync();
            return Ok(model);
        }


        [HttpPost]
        [Route("create")]
        public async Task<IActionResult> Create(BlogModel model)
        {
            var newModel = new Blog();
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            newModel.Id = Guid.CreateVersion7().ToString();

            if (model.image != null && model.image.Length > 0)
            {
                var extension = Path.GetExtension(model.image.FileName);
                var fileName = DateTime.UtcNow.ToString("ddMMyyyHHmmssffffff") + extension;
                string Rootpath = webHostEnvironment.ContentRootPath;
                string fileUploadRoot = Rootpath + "/assets/images";
                Debug.WriteLine(fileUploadRoot);
                using (var stream = new FileStream(Path.Combine(fileUploadRoot, fileName), FileMode.Create))
                {
                    await model.image.CopyToAsync(stream);
                }
                newModel.Image = fileName;
            }
            newModel.IsActive = true;
            newModel.Title = model.title;
            newModel.Description = model.description;
            newModel.PostedDate = model.postedDate;
            newModel.CreatedDate = DateTime.UtcNow;
            newModel.UserId = userId;
            if (model.offerDateTime != null)
            {
                newModel.OfferDateTime = model.offerDateTime;
            }

            await context.Blogs.AddAsync(newModel);
            await context.SaveChangesAsync();
            return Ok("Item has been created.");
        }

        [HttpPost]
        [Route("edit")]
        public async Task<IActionResult> Edit(BlogModel model)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var exModel = await context.Blogs.Where(e => e.Id == model.id).FirstOrDefaultAsync();
            if (exModel != null)
            {
                exModel.Title = model.title;
                exModel.Description = model.description;
                exModel.UserId = userId;
                if (model.postedDate != null)
                {
                    exModel.PostedDate = model.postedDate;
                }
                if (model.offerDateTime != null)
                {
                    exModel.OfferDateTime = model.offerDateTime;
                }
               
                if (model.image != null && model.image.Length > 0)
                {
                    var extension = Path.GetExtension(model.image.FileName);
                    var fileName = DateTime.UtcNow.ToString("ddMMyyyHHmmssffffff") + extension;
                    string Rootpath = webHostEnvironment.ContentRootPath;
                    string fileUploadRoot = Rootpath + "/assets/images";
                    Debug.WriteLine(fileUploadRoot);
                    using (var stream = new FileStream(Path.Combine(fileUploadRoot, fileName), FileMode.Create))
                    {
                        await model.image.CopyToAsync(stream);
                    }
                    exModel.Image = fileName;
                }
                context.Entry(exModel).State = EntityState.Modified;
                await context.SaveChangesAsync();
                return Ok("Item has been updated.");
            }

            return Ok("Data not found.");
        }

        [HttpPost]
        [Route("itemactiveinactive")]
        public async Task<IActionResult> ItemActiveInactive(string id, bool value)
        {
            var data = await context.Blogs.Where(e => e.Id == id).FirstOrDefaultAsync();
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
            var data = await context.Blogs.Where(e => e.Id == id).FirstOrDefaultAsync();
            if (data == null) return Ok("Data not found.");
            context.Blogs.Remove(data);
            await context.SaveChangesAsync();
            return Ok("Item has been deleted.");
        }


    }

    public class BlogModel
    {
        public string? id { get; set; }
        public IFormFile? image { get; set; }
        public string? title { get; set; }
        public string? description { get; set; }
        public DateTime? postedDate { get; set; }
        public DateTime? offerDateTime { get; set; }
    }
}
