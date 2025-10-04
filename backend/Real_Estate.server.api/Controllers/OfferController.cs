using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Real_Estate.server.api.Data;
using Real_Estate.server.api.Models;
using System.Diagnostics;

namespace Real_Estate.server.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OfferController : ControllerBase
    {
        private readonly ApplicationDbContext context;
        private readonly IWebHostEnvironment webHostEnvironment;

        public OfferController(ApplicationDbContext context, IWebHostEnvironment webHostEnvironment)
        {
            this.context = context;
            this.webHostEnvironment = webHostEnvironment;
        }
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var model = await context.Offers.AsNoTracking().ToListAsync();
            return Ok(model);
        }

        [HttpGet]
        [Route("active")]
        public async Task<IActionResult> GetAllActive()
        {
            var model = await context.Offers.Where(o => o.IsActive).ToListAsync();
            return Ok(model);
        }


        [HttpPost]
        [Route("create")]
        public async Task<IActionResult> Create(OfferModel model)
        {
            var newModel = new Offer();

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
                newModel.Picture = fileName;
            }
            newModel.IsActive = true;
            newModel.Title = model.title;
            newModel.Description = model.description;
            newModel.StartDate = model.startDate;
            newModel.EndDate = model.endDate;

            await context.Offers.AddAsync(newModel);
            await context.SaveChangesAsync();
            return Ok("Item has been created.");
        }

        [HttpPost]
        [Route("edit")]
        public async Task<IActionResult> Edit(OfferModel model)
        {
            var exModel = await context.Offers.Where(e => e.Id == model.id).FirstOrDefaultAsync();
            if (exModel != null)
            {
                exModel.Title = model.title;
                exModel.Description = model.description;             
                if (model.startDate != null)
                {
                    exModel.StartDate = model.startDate;
                }          
                if(model.endDate != null)
                {
                    exModel.EndDate = model.endDate;
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
                    exModel.Picture = fileName;
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
            var data = await context.Offers.Where(e => e.Id == id).FirstOrDefaultAsync();
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
            var data = await context.Offers.Where(e => e.Id == id).FirstOrDefaultAsync();
            if (data == null) return Ok("Data not found.");
            context.Offers.Remove(data);
            await context.SaveChangesAsync();
            return Ok("Item has been deleted.");
        }


    }

    public class OfferModel
    {
        public string? id { get; set; }
        public IFormFile? image { get; set; }
        public string? title { get; set; }
        public string? description { get; set; }
        public DateTime? startDate { get; set; }
        public DateTime? endDate { get; set; }
    }
}
