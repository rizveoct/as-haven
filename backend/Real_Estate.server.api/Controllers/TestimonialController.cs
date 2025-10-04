using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Real_Estate.server.api.Data;
using Real_Estate.server.api.Models;
using System.Diagnostics;

namespace Real_Estate.server.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestimonialController : ControllerBase
    {
        private readonly ApplicationDbContext context;
        private readonly IWebHostEnvironment webHostEnvironment;

        public TestimonialController(ApplicationDbContext context, IWebHostEnvironment webHostEnvironment)
        {
            this.context = context;
            this.webHostEnvironment = webHostEnvironment;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var model = await context.Testimonials.AsNoTracking().OrderBy(e => e.Order).ToListAsync();
            return Ok(model);
        }

        [HttpGet]
        [Route("active")]
        public async Task<IActionResult> GetAllActive()
        {
            var model = await context.Testimonials.Where(t=>t.IsActive).OrderBy(e => e.Order).ToListAsync();
            return Ok(model);
        }


        [HttpPost]
        [Route("create")]
        public async Task<IActionResult> Create(TestimonialModel model)
        {
            var newModel = new Testimonial();

            newModel.Id = Guid.CreateVersion7().ToString();
            if (model.contentType == "Image" || model.contentType == "Video")
            {
                if (model.content != null && model.content.Length > 0)
                {
                    var extension = Path.GetExtension(model.content.FileName);
                    var fileName = DateTime.UtcNow.ToString("ddMMyyyHHmmssffffff") + extension;
                    string Rootpath = webHostEnvironment.ContentRootPath;
                    string fileUploadRoot = Rootpath + "/assets/images";
                    Debug.WriteLine(fileUploadRoot);
                    using (var stream = new FileStream(Path.Combine(fileUploadRoot, fileName), FileMode.Create))
                    {
                        await model.content.CopyToAsync(stream);
                    }
                    newModel.Content = fileName;
                }
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
                newModel.Image = fileName;
            }
            newModel.ContentType = model.contentType;
            newModel.IsActive = true;
            newModel.Order = model.order;
            newModel.Name = model.name;
            newModel.Description = model.description;
            newModel.CustomerType = model.customerType;


            await context.Testimonials.AddAsync(newModel);
            await context.SaveChangesAsync();
            return Ok("Item has been created.");
        }

        [HttpPost]
        [Route("edit")]
        public async Task<IActionResult> Edit(TestimonialModel model)
        {
            var exModel = await context.Testimonials.Where(e => e.Id == model.id).FirstOrDefaultAsync();
            if (exModel != null)
            {
                exModel.Name = model.name;
                exModel.Description = model.description;
                exModel.Order = model.order;
                exModel.ContentType = model.contentType;
                exModel.CustomerType = model.customerType;

                if (model.content != null && model.content.Length > 0)
                {
                    var extension = Path.GetExtension(model.content.FileName);
                    var fileName = DateTime.UtcNow.ToString("ddMMyyyHHmmssffffff") + extension;
                    string Rootpath = webHostEnvironment.ContentRootPath;
                    string fileUploadRoot = Rootpath + "/assets/images";
                    Debug.WriteLine(fileUploadRoot);
                    using (var stream = new FileStream(Path.Combine(fileUploadRoot, fileName), FileMode.Create))
                    {
                        await model.content.CopyToAsync(stream);
                    }
                    exModel.Content = fileName;
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
            var data = await context.Testimonials.Where(e => e.Id == id).FirstOrDefaultAsync();
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
            var data = await context.Testimonials.Where(e => e.Id == id).FirstOrDefaultAsync();
            if (data == null) return Ok("Data not found.");
            context.Testimonials.Remove(data);
            await context.SaveChangesAsync();
            return Ok("Item has been deleted.");
        }


    }

    public class TestimonialModel
    {
        public string? id { get; set; }
        public string? name { get; set; }
        public string? description { get; set; }
        public IFormFile? image { get; set; }
        /// <summary>
        /// Image,Video
        /// </summary>
        public string? contentType { get; set; }
        public IFormFile? content { get; set; }
        public int order { get; set; }
        public string? customerType { get; set; }
    }
}
