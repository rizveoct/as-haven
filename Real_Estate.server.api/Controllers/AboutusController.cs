using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Real_Estate.server.api.Data;
using Real_Estate.server.api.Models;
using System.Diagnostics;

namespace Real_Estate.server.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AboutusController : ControllerBase
    {
        private readonly ApplicationDbContext context;
        private readonly IWebHostEnvironment webHostEnvironment;

        public AboutusController(ApplicationDbContext context, IWebHostEnvironment webHostEnvironment)
        {
            this.context = context;
            this.webHostEnvironment = webHostEnvironment;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var model = await context.Aboutus.ToListAsync();
            return Ok(model);
        }


        [HttpPost]
        [Route("create")]
        public async Task<IActionResult> Create([FromForm] AboutusModel model)
        {
            var newModel = new Aboutus();

            newModel.Id = Guid.CreateVersion7().ToString();

            if (model.ownerImage != null && model.ownerImage.Length > 0)
            {
                var extension = Path.GetExtension(model.ownerImage.FileName);
                var fileName = DateTime.UtcNow.ToString("ddMMyyyHHmmssffffff") + extension;
                string Rootpath = webHostEnvironment.ContentRootPath;
                string fileUploadRoot = Rootpath + "/assets/images";
                Debug.WriteLine(fileUploadRoot);
                using (var stream = new FileStream(Path.Combine(fileUploadRoot, fileName), FileMode.Create))
                {
                    await model.ownerImage.CopyToAsync(stream);
                }
                newModel.OwnerImage = fileName;
            }

            newModel.Vision = model.vision;
            newModel.Mission = model.mission;
            newModel.OwnerSpeech = model.ownerSpeech;
            newModel.OwnerName = model.ownerName;
            newModel.History = model.history;
            newModel.Facebook = model.facebook;
            newModel.LinkedIn = model.linkedIn;
            newModel.Twitter = model.twitter;
            newModel.OwnerDesignation = model.ownerDesignation;
            if (model.ownerImage != null && model.ownerImage.Length > 0)
            {
                var extension = Path.GetExtension(model.ownerImage.FileName);
                var fileName = DateTime.UtcNow.ToString("ddMMyyyHHmmssffffff") + extension;
                string Rootpath = webHostEnvironment.ContentRootPath;
                string fileUploadRoot = Rootpath + "/assets/images";
                Debug.WriteLine(fileUploadRoot);
                using (var stream = new FileStream(Path.Combine(fileUploadRoot, fileName), FileMode.Create))
                {
                    await model.ownerImage.CopyToAsync(stream);
                }
                newModel.OwnerImage = fileName;
            }

            if (model.visionImage != null && model.visionImage.Length > 0)
            {
                var extension = Path.GetExtension(model.visionImage.FileName);
                var fileName = DateTime.UtcNow.ToString("ddMMyyyHHmmssffffff") + extension;
                string Rootpath = webHostEnvironment.ContentRootPath;
                string fileUploadRoot = Rootpath + "/assets/images";
                Debug.WriteLine(fileUploadRoot);
                using (var stream = new FileStream(Path.Combine(fileUploadRoot, fileName), FileMode.Create))
                {
                    await model.visionImage.CopyToAsync(stream);
                }
                newModel.VisionImage = fileName;
            }

            if (model.missionImage != null && model.missionImage.Length > 0)
            {
                var extension = Path.GetExtension(model.missionImage.FileName);
                var fileName = DateTime.UtcNow.ToString("ddMMyyyHHmmssffffff") + extension;
                string Rootpath = webHostEnvironment.ContentRootPath;
                string fileUploadRoot = Rootpath + "/assets/images";
                Debug.WriteLine(fileUploadRoot);
                using (var stream = new FileStream(Path.Combine(fileUploadRoot, fileName), FileMode.Create))
                {
                    await model.missionImage.CopyToAsync(stream);
                }
                newModel.MissionImage = fileName;
            }

            await context.Aboutus.AddAsync(newModel);
            await context.SaveChangesAsync();
            return Ok("Item has been created.");
        }

        [HttpPost]
        [Route("edit")]
        public async Task<IActionResult> Edit(AboutusModel model)
        {
            var exModel = await context.Aboutus.Where(e => e.Id == model.id).FirstOrDefaultAsync();
            if (exModel != null)
            {
                exModel.Vision = model.vision;
                exModel.Mission = model.mission;
                exModel.OwnerSpeech = model.ownerSpeech;
                exModel.OwnerName = model.ownerName;
                exModel.OwnerDesignation = model.ownerDesignation;
                exModel.History = model.history;
                exModel.Facebook = model.facebook;
                exModel.Twitter = model.twitter;
                exModel.LinkedIn = model.linkedIn;
                if (model.ownerImage != null && model.ownerImage.Length > 0)
                {
                    var extension = Path.GetExtension(model.ownerImage.FileName);
                    var fileName = DateTime.UtcNow.ToString("ddMMyyyHHmmssffffff") + extension;
                    string Rootpath = webHostEnvironment.ContentRootPath;
                    string fileUploadRoot = Rootpath + "/assets/images";
                    Debug.WriteLine(fileUploadRoot);
                    using (var stream = new FileStream(Path.Combine(fileUploadRoot, fileName), FileMode.Create))
                    {
                        await model.ownerImage.CopyToAsync(stream);
                    }
                    exModel.OwnerImage = fileName;
                }

                if (model.visionImage != null && model.visionImage.Length > 0)
                {
                    var extension = Path.GetExtension(model.visionImage.FileName);
                    var fileName = DateTime.UtcNow.ToString("ddMMyyyHHmmssffffff") + extension;
                    string Rootpath = webHostEnvironment.ContentRootPath;
                    string fileUploadRoot = Rootpath + "/assets/images";
                    Debug.WriteLine(fileUploadRoot);
                    using (var stream = new FileStream(Path.Combine(fileUploadRoot, fileName), FileMode.Create))
                    {
                        await model.visionImage.CopyToAsync(stream);
                    }
                    exModel.VisionImage = fileName;
                }

                if (model.missionImage != null && model.missionImage.Length > 0)
                {
                    var extension = Path.GetExtension(model.missionImage.FileName);
                    var fileName = DateTime.UtcNow.ToString("ddMMyyyHHmmssffffff") + extension;
                    string Rootpath = webHostEnvironment.ContentRootPath;
                    string fileUploadRoot = Rootpath + "/assets/images";
                    Debug.WriteLine(fileUploadRoot);
                    using (var stream = new FileStream(Path.Combine(fileUploadRoot, fileName), FileMode.Create))
                    {
                        await model.missionImage.CopyToAsync(stream);
                    }
                    exModel.MissionImage = fileName;
                }

                context.Entry(exModel).State = EntityState.Modified;
                await context.SaveChangesAsync();
                return Ok("Item has been updated.");
            }

            return Ok("Data not found.");
        }


        [HttpPost]
        [Route("delete")]
        public async Task<IActionResult> Delete(string? id)
        {
            var data = await context.Aboutus.Where(e => e.Id == id).FirstOrDefaultAsync();
            if (data == null) return Ok("Data not found.");
            context.Aboutus.Remove(data);
            await context.SaveChangesAsync();
            return Ok("Item has been deleted.");
        }

    }
    

    public class AboutusModel
    {
        public string? id { get; set; }
        public string? vision { get; set; }
        public string? mission { get; set; }
        public string? ownerName { get; set; }
        public string? ownerDesignation { get; set; }
        public string? ownerSpeech { get; set; }
        public string? history { get; set; }
        public string? facebook { get; set; }
        public string? twitter { get; set; }
        public string? linkedIn { get; set; }
        public IFormFile? ownerImage { get; set; }
        public IFormFile? visionImage { get; set; }
        public IFormFile? missionImage { get; set; }
    }
}
