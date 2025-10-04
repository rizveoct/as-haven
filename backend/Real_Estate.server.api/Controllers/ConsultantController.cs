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
    public class ConsultantController : ControllerBase
    {
        private readonly ApplicationDbContext context;
        private readonly IWebHostEnvironment webHostEnvironment;

        public ConsultantController(ApplicationDbContext context, IWebHostEnvironment webHostEnvironment)
        {
            this.context = context;
            this.webHostEnvironment = webHostEnvironment;
        }


        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var model = await context.Consultants                
                .ToListAsync();

            return Ok(model);
        }       
        


        [HttpPost]
        [Route("create")]
        public async Task<IActionResult> Create(ConsultantModel model)
        {
            var newModel = new Consultant();
            

            if (model.image != null && model.image.Length > 0)
            {
                var extension = Path.GetExtension(model.image.FileName);
                var fileName = DateTime.UtcNow.ToString("ddMMyyyHHmmssffffff") + extension;
                string Rootpath = webHostEnvironment.ContentRootPath;
                string fileUploadRoot = Rootpath + "/assets/images";
                Directory.CreateDirectory(fileUploadRoot);
                Debug.WriteLine(fileUploadRoot);
                using (var stream = new FileStream(Path.Combine(fileUploadRoot, fileName), FileMode.Create))
                {
                    await model.image.CopyToAsync(stream);
                }
                newModel.Image = fileName;
            }
            newModel.Name = model.name;
            newModel.location = model.location;
            newModel.IsInterior = model.IsInterior;

            await context.Consultants.AddAsync(newModel);
            await context.SaveChangesAsync();
            return Ok("Item has been created.");
        }

        [HttpPost]
        [Route("edit")]
        public async Task<IActionResult> Edit(ConsultantModel model)
        {
            var exModel = await context.Consultants.Where(e => e.Id == model.id).FirstOrDefaultAsync();
            if (exModel != null)
            {
                exModel.Name = model.name;
                exModel.location = model.location;
                exModel.IsInterior = model.IsInterior;
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
        [Route("delete")]
        public async Task<IActionResult> Delete(int? id)
        {
            var data = await context.Consultants.Where(e => e.Id == id).FirstOrDefaultAsync();
            if (data == null) return Ok("Data not found.");
            context.Consultants.Remove(data);
            await context.SaveChangesAsync();
            return Ok("Item has been deleted.");
        }
    }

    public class ConsultantModel
    {
        public int? id { get; set; }
        public string? name { get; set; }
        public string? location { get; set; }       
        public IFormFile? image { get; set; }
        public int? IsInterior { get; set; }
    }
}
