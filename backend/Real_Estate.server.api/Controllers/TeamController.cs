using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Real_Estate.server.api.Data;
using Real_Estate.server.api.Models;
using System.Diagnostics;

namespace Real_Estate.server.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TeamController : ControllerBase
    {
        private readonly ApplicationDbContext context;
        private readonly IWebHostEnvironment webHostEnvironment;

        public TeamController(ApplicationDbContext context, IWebHostEnvironment webHostEnvironment)
        {
            this.context = context;
            this.webHostEnvironment = webHostEnvironment;
        }
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var model = await context.Teams.OrderBy(e => e.Order).ToListAsync();
            return Ok(model);
        }

        [HttpGet]
        [Route("active")]
        public async Task<IActionResult> GetAllActive()
        {
            var model = await context.Teams.Where(t => t.IsActive).OrderBy(e => e.Order).ToListAsync();
            return Ok(model);
        }


        [HttpPost]
        [Route("create")]
        public async Task<IActionResult> Create(TeamModel model)
        {
            var newModel = new Team();

            newModel.Id = Guid.CreateVersion7().ToString();
            
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
            newModel.IsActive = true;
            newModel.Order = model.order;
            newModel.Name = model.name;
            newModel.Designation = model.designation;
            newModel.Description = model.description;
            newModel.Facebook = model.facebook;
            newModel.Twiter = model.twiter;
            newModel.Linkthen = model.linkedIn;

            await context.Teams.AddAsync(newModel);
            await context.SaveChangesAsync();
            return Ok("Item has been created.");
        }

        [HttpPost]
        [Route("edit")]
        public async Task<IActionResult> Edit(TeamModel model)
        {
            var exModel = await context.Teams.Where(e => e.Id == model.id).FirstOrDefaultAsync();
            if (exModel != null)
            {
                exModel.Name = model.name;
                exModel.Designation = model.designation;
                exModel.Description = model.description;              
                exModel.Facebook = model.facebook;              
                exModel.Twiter = model.twiter;              
                exModel.Linkthen = model.linkedIn;              
                exModel.Order = model.order;              
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
            var data = await context.Teams.Where(e => e.Id == id).FirstOrDefaultAsync();
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
            var data = await context.Teams.Where(e => e.Id == id).FirstOrDefaultAsync();
            if (data == null) return Ok("Data not found.");
            context.Teams.Remove(data);
            await context.SaveChangesAsync();
            return Ok("Item has been deleted.");
        }


    }

    public class TeamModel
    {
        public string? id { get; set; }
        public string? name { get; set; }
        public string? designation { get; set; }
        public string? description { get; set; }
        public string? facebook { get; set; }
        public string? twiter { get; set; }
        public string? linkedIn { get; set; }
        public IFormFile? image { get; set; }
        public int order { get; set; }
    }
}
