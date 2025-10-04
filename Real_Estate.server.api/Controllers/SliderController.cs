using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Real_Estate.server.api.Data;
using Real_Estate.server.api.Models;
using System.Diagnostics;

namespace Real_Estate.server.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SliderController : ControllerBase
    {
        private readonly ApplicationDbContext context;
        private readonly IWebHostEnvironment webHostEnvironment;

        public SliderController(ApplicationDbContext context,IWebHostEnvironment webHostEnvironment)
        {
            this.context = context;
            this.webHostEnvironment = webHostEnvironment;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var data = await context.Sliders.OrderBy(e => e.Order).ToListAsync();
            return Ok(data);
        }


        [HttpPost]
        [Route("create")]
        public async Task<IActionResult> Create(SlideModel model)
        {
            if (model.image == null)
            {
                return Ok("Please select a file.");
            }
            var newModel = new Slider()
            {
                Id = Guid.CreateVersion7().ToString(),
                Title = model.title,
                Description = model.description,
                IsActive = true,
                Order = model.order
            };

            if (model.image.Length > 0)
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

            await context.Sliders.AddAsync(newModel);
            await context.SaveChangesAsync();
            return Ok("Item has been created.");
        }

        [HttpPost]
        [Route("edit")]
        public async Task<IActionResult> Edit(SlideModel model)
        {
            var exModel = await context.Sliders.Where(e => e.Id == model.id).FirstOrDefaultAsync();
            if (exModel != null)
            {
                exModel.Title = model.title;
                exModel.Description = model.description;
                exModel.Order = model.order;

                if (model.image !=null && model.image.Length > 0)
                {
                    var extension = Path.GetExtension(model.image.FileName);
                    var fileName = DateTime.UtcNow.ToString("ddMMyyyHHmmssffffff") + extension;
                    string Rootpath = webHostEnvironment.WebRootPath;
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
                return Ok("Item has been created.");
            }

            return Ok("Data not found!.");
        }

        [HttpPost]
        [Route("itemactiveinactive")]
        public async Task<IActionResult> ItemActiveInactive(string id, bool value)
        {
            var data = await context.Sliders.Where(e => e.Id == id).FirstOrDefaultAsync();
            if(data == null) return Ok("Data not found.");
            data.IsActive = value;
            context.Entry(data).State = EntityState.Modified;
            await context.SaveChangesAsync();
            return Ok("Item has been updated.");
        }

        [HttpPost]
        [Route("delete")]
        public async Task<IActionResult>Delete(string? id)
        {
            var data = await context.Sliders.Where(e => e.Id == id).FirstOrDefaultAsync();
            if (data == null) return Ok("Data not found.");
            context.Sliders.Remove(data);
            await context.SaveChangesAsync();
            return Ok("Item has been deleted.");
        }

    }

    public class SlideModel
    {
        public string? id { get; set; }
        public string? title { get; set; }
        public string? description { get; set; }
        public IFormFile? image { get; set; }
        public bool? isActive { get; set; }
        public int order { get; set; }
    }
}
