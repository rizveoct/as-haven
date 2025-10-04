using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Real_Estate.server.api.Data;
using Real_Estate.server.api.Models;
using System.Diagnostics;
using System.Net;

namespace Real_Estate.server.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectController : ControllerBase
    {
        private readonly ApplicationDbContext context;
        private readonly IWebHostEnvironment webHostEnvironment;

        public ProjectController(ApplicationDbContext context, IWebHostEnvironment webHostEnvironment)
        {
            this.context = context;
            this.webHostEnvironment = webHostEnvironment;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var projects = await context.Projects.OrderBy(e => e.Order).ToListAsync();
            return Ok(projects);
        }


        [HttpGet]
        [Route("active")]
        public async Task<IActionResult> GetAllActive()
        {
            var projects = await context.Projects.Where(p => p.IsActive).OrderBy(e => e.Order).ToListAsync();
            return Ok(projects);
        }



        [HttpGet("{id}")]
        public async Task<IActionResult> GetProject(string id)
        {
            if (string.IsNullOrEmpty(id))
                return BadRequest("Project ID is required.");

            var project = await context.Projects.FirstOrDefaultAsync(e => e.Id == id);
            if (project == null)
                return NotFound("Project not found.");

            return Ok(project);
        }

        [HttpPost]
        [Route("create")]
        public async Task<IActionResult> Create(ProjectModel model)
        {
            var project = new Project()
            {
                Id = Guid.CreateVersion7().ToString(),
                Name = model.name,
                Description = model.description,
                CreateDate = DateTime.UtcNow,
                IsActive = true,
                NoOfMotorParking = model.NoOfMotorParking,
                Address = model.address,
                OfferTile = model.offerTile,
                LandArea = model.landArea,
                BuiltUpArea = model.builtUpArea,
                Height = model.height,
                NumberOfApartments = model.numberOfApartments,
                NumberOfParking = model.numberOfParking,
                UnitPerFloors = model.unitPerFloors,
                SizeOfEachApartment = model.sizeOfEachApartment,
                Category = model.category,
                Type = model.type,
                ContentType = model.contentType,
                MapLink = model.mapLink,
                VideoLink = model.videoLink,
                Order = model.order

            };
            if (model.thumbnail != null && model.thumbnail.Length > 0)
            {
                var extension = Path.GetExtension(model.thumbnail.FileName);
                var fileName = DateTime.UtcNow.ToString("ddMMyyyHHmmssffffff") + extension;
                string Rootpath = webHostEnvironment.ContentRootPath;
                string fileUploadRoot = Path.Combine(Rootpath, "assets", "images");
                // Ensure the directory exists
                Directory.CreateDirectory(fileUploadRoot);
                if (!Directory.Exists(fileUploadRoot))
                    Directory.CreateDirectory(fileUploadRoot);
                using (var stream = new FileStream(Path.Combine(fileUploadRoot, fileName), FileMode.Create))
                {
                    await model.thumbnail.CopyToAsync(stream);
                }
                project.Thumbnail = fileName;
            }

            if (model.content != null && model.content.Length > 0)
            {
                var extension = Path.GetExtension(model.content.FileName);
                var fileName = DateTime.UtcNow.ToString("ddMMyyyHHmmssffffff") + extension;
                string Rootpath = webHostEnvironment.ContentRootPath;
                string fileUploadRoot = Path.Combine(Rootpath, "assets", "images");
                if (!Directory.Exists(fileUploadRoot))
                    Directory.CreateDirectory(fileUploadRoot);
                using (var stream = new FileStream(Path.Combine(fileUploadRoot, fileName), FileMode.Create))
                {
                    await model.content.CopyToAsync(stream);
                }
                project.Content = fileName;
            }

            if (model.pdfFile != null && model.pdfFile.Length > 0)
            {
                var extension = Path.GetExtension(model.pdfFile.FileName);
                var fileName = DateTime.UtcNow.ToString("ddMMyyyHHmmssffffff") + extension;
                string Rootpath = webHostEnvironment.ContentRootPath;
                string fileUploadRoot = Path.Combine(Rootpath, "assets", "pdfs");
                if (!Directory.Exists(fileUploadRoot))
                    Directory.CreateDirectory(fileUploadRoot);
                using (var stream = new FileStream(Path.Combine(fileUploadRoot, fileName), FileMode.Create))
                {
                    await model.pdfFile.CopyToAsync(stream);
                }
                project.pdfFile = fileName;
            }

            if (model.offerDateTime != null)
            {
                project.OfferDateTime = model.offerDateTime;
            }

            await context.Projects.AddAsync(project);
            await context.SaveChangesAsync();
            return Ok("Project has been created.");
        }

        [HttpPost]
        [Route("edit")]
        public async Task<IActionResult> Edit(ProjectModel model)
        {
            var exModel = await context.Projects.Where(e => e.Id == model.id).FirstOrDefaultAsync();
            if (exModel != null)
            {
                exModel.Name = model.name;
                exModel.Description = model.description;
                exModel.Address = model.address;
                exModel.OfferTile = model.offerTile;
                exModel.NoOfMotorParking = model.NoOfMotorParking;
                exModel.LandArea = model.landArea;
                exModel.BuiltUpArea = model.builtUpArea;
                exModel.Height = model.height;
                exModel.NumberOfApartments = model.numberOfApartments;
                exModel.NumberOfParking = model.numberOfParking;
                exModel.UnitPerFloors = model.unitPerFloors;
                exModel.SizeOfEachApartment = model.sizeOfEachApartment;
                exModel.Category = model.category;
                exModel.Type = model.type;
                exModel.MapLink = model.mapLink;
                exModel.VideoLink = model.videoLink;
                exModel.Order = model.order;

                if (model.thumbnail != null && model.thumbnail.Length > 0)
                {
                    var extension = Path.GetExtension(model.thumbnail.FileName);
                    var fileName = DateTime.UtcNow.ToString("ddMMyyyHHmmssffffff") + extension;
                    string Rootpath = webHostEnvironment.ContentRootPath;
                    string fileUploadRoot = Path.Combine(Rootpath, "assets", "images");
                    // Ensure the directory exists
                    Directory.CreateDirectory(fileUploadRoot);
                    if (!Directory.Exists(fileUploadRoot))
                        Directory.CreateDirectory(fileUploadRoot);
                    using (var stream = new FileStream(Path.Combine(fileUploadRoot, fileName), FileMode.Create))
                    {
                        await model.thumbnail.CopyToAsync(stream);
                    }
                    exModel.Thumbnail = fileName;
                }

                if (model.content != null && model.content.Length > 0)
                {
                    var extension = Path.GetExtension(model.content.FileName);
                    var fileName = DateTime.UtcNow.ToString("ddMMyyyHHmmssffffff") + extension;
                    string Rootpath = webHostEnvironment.ContentRootPath;
                    string fileUploadRoot = Path.Combine(Rootpath, "assets", "images");
                    if (!Directory.Exists(fileUploadRoot))
                        Directory.CreateDirectory(fileUploadRoot);
                    using (var stream = new FileStream(Path.Combine(fileUploadRoot, fileName), FileMode.Create))
                    {
                        await model.content.CopyToAsync(stream);
                    }
                    exModel.Content = fileName;
                    exModel.ContentType = model.contentType;
                }
                if (model.pdfFile != null && model.pdfFile.Length > 0)
                {
                    var extension = Path.GetExtension(model.pdfFile.FileName);
                    var fileName = DateTime.UtcNow.ToString("ddMMyyyHHmmssffffff") + extension;
                    string Rootpath = webHostEnvironment.ContentRootPath;
                    string fileUploadRoot = Path.Combine(Rootpath, "assets", "pdfs");
                    if (!Directory.Exists(fileUploadRoot))
                        Directory.CreateDirectory(fileUploadRoot);
                    using (var stream = new FileStream(Path.Combine(fileUploadRoot, fileName), FileMode.Create))
                    {
                        await model.pdfFile.CopyToAsync(stream);
                    }
                    exModel.pdfFile = fileName;
                }

                if (model.offerDateTime != null)
                {
                    exModel.OfferDateTime = model.offerDateTime;
                }

                context.Entry(exModel).State = EntityState.Modified;
                await context.SaveChangesAsync();
                return Ok("Project has been updated.");
            }

            return NotFound("Data not found.");
        }

        [HttpPost]
        [Route("itemactiveinactive")]
        public async Task<IActionResult> ItemActiveInactive(string id, bool value)
        {
            var data = await context.Projects.Where(e => e.Id == id).FirstOrDefaultAsync();
            if (data == null) return NotFound("Data not found.");
            data.IsActive = value;
            context.Entry(data).State = EntityState.Modified;
            await context.SaveChangesAsync();
            return Ok("Item has been updated.");
        }

        [HttpPost]
        [Route("delete")]
        public async Task<IActionResult> Delete(string? id)
        {
            var data = await context.Projects.Where(e => e.Id == id).FirstOrDefaultAsync();
            if (data == null) return NotFound("Data not found.");
            context.Projects.Remove(data);
            await context.SaveChangesAsync();
            return Ok("Item has been deleted.");
        }

        [HttpGet]
        [Route("downloadpdf/{fileName}")]
        public IActionResult DownloadPdf(string fileName)
        {
            if (string.IsNullOrEmpty(fileName))
                return BadRequest("File name is required.");

            string Rootpath = webHostEnvironment.ContentRootPath;
            string filePath = Path.Combine(Rootpath, "assets", "pdfs", fileName);

            if (!System.IO.File.Exists(filePath))
                return NotFound("File not found.");

            var contentType = "application/pdf";
            var fileBytes = System.IO.File.ReadAllBytes(filePath);
            return File(fileBytes, contentType, fileName);
        }

        // Gallery Part
        [HttpGet]
        [Route("getgallery")]
        public async Task<IActionResult> GetGallery(string projectId)
        {
            try
            {
                if (string.IsNullOrEmpty(projectId))
                    return BadRequest("Missing projectId");

                var data = await context.ProjectGalleries
                    .AsNoTracking()
                    .Where(e => e.ProjectId == projectId)
                    .ToListAsync();

                return Ok(data);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Gallery fetch error: " + ex.Message);
                return StatusCode(500, "Server error");
            }
        }

        [HttpPost]
        [Route("gallerycreate")]
        public async Task<IActionResult> GalleryCreate(ProjectGalleryModel model)
        {
            if (model.projectId == null || model.projectId == "")
            {
                return BadRequest("Select Project ID");
            }

            ProjectGallery newModel = new ProjectGallery();
            newModel.Id = Guid.CreateVersion7().ToString();
            newModel.Order = model.order;
            newModel.IsActive = true;
            newModel.ProjectId = model.projectId;
            newModel.ContentType = model.contentType;
            if (model.content != null && model.content.Length > 0)
            {
                var extension = Path.GetExtension(model.content.FileName);
                var fileName = DateTime.UtcNow.ToString("ddMMyyyHHmmssffffff") + extension;
                string Rootpath = webHostEnvironment.ContentRootPath;
                string fileUploadRoot = Path.Combine(Rootpath, "assets", "images");
                if (!Directory.Exists(fileUploadRoot))
                    Directory.CreateDirectory(fileUploadRoot);
                using (var stream = new FileStream(Path.Combine(fileUploadRoot, fileName), FileMode.Create))
                {
                    await model.content.CopyToAsync(stream);
                }
                newModel.Content = fileName;
            }

            await context.ProjectGalleries.AddAsync(newModel);
            await context.SaveChangesAsync();
            return Ok("Item has been created.");
        }

        [HttpPost]
        [Route("galleryactiveinactive")]
        public async Task<IActionResult> GalleryActiveInactive(string id, bool value)
        {
            var data = await context.ProjectGalleries.Where(e => e.Id == id).FirstOrDefaultAsync();
            if (data == null) return NotFound("Data not found.");
            data.IsActive = value;
            context.Entry(data).State = EntityState.Modified;
            await context.SaveChangesAsync();
            return Ok("Item has been updated.");
        }

        [HttpPost]
        [Route("gallerydelete")]
        public async Task<IActionResult> GalleryDelete(string? id)
        {
            var data = await context.ProjectGalleries.Where(e => e.Id == id).FirstOrDefaultAsync();
            if (data == null) return NotFound("Data not found.");
            context.ProjectGalleries.Remove(data);
            await context.SaveChangesAsync();
            return Ok("Item has been deleted.");
        }

        // Feature Part
        [HttpGet]
        [Route("getfeature")]
        public async Task<IActionResult> GetFeature(string projectId)
        {
            var data = await context.ProjectFeatures.AsNoTracking().Where(e => e.ProjectId == projectId).ToListAsync();
            return Ok(data);
        }

        [HttpPost]
        [Route("featurecreate")]
        public async Task<IActionResult> FeatureCreate(ProjectFeatureModel model)
        {
            if (model.projectId == null || model.projectId == "")
            {
                return BadRequest("Select Project ID");
            }

            ProjectFeature newModel = new ProjectFeature();
            newModel.Id = Guid.CreateVersion7().ToString();
            newModel.Order = model.order;
            newModel.ProjectId = model.projectId;
            newModel.Description = model.description;
            newModel.Title = model.title;
            if (model.icon != null && model.icon.Length > 0)
            {
                var extension = Path.GetExtension(model.icon.FileName);
                var fileName = DateTime.UtcNow.ToString("ddMMyyyHHmmssffffff") + extension;
                string Rootpath = webHostEnvironment.ContentRootPath;
                string fileUploadRoot = Path.Combine(Rootpath, "assets", "images");
                if (!Directory.Exists(fileUploadRoot))
                    Directory.CreateDirectory(fileUploadRoot);
                using (var stream = new FileStream(Path.Combine(fileUploadRoot, fileName), FileMode.Create))
                {
                    await model.icon.CopyToAsync(stream);
                }
                newModel.Icon = fileName;
            }

            await context.ProjectFeatures.AddAsync(newModel);
            await context.SaveChangesAsync();
            return Ok("Item has been created.");
        }

        [HttpPost]
        [Route("featuredelete")]
        public async Task<IActionResult> FeatureDelete(string? id)
        {
            var data = await context.ProjectFeatures.Where(e => e.Id == id).FirstOrDefaultAsync();
            if (data == null) return NotFound("Data not found.");
            context.ProjectFeatures.Remove(data);
            await context.SaveChangesAsync();
            return Ok("Item has been deleted.");
        }
    }

    public class ProjectModel
    {
        public string? id { get; set; }
        public string? name { get; set; }
        public int order { get; set; }
        public string? description { get; set; }
        public IFormFile? thumbnail { get; set; }
        public string? address { get; set; }
        public string? offerTile { get; set; }
        public bool isActive { get; set; }
        public string? contentType { get; set; }
        public IFormFile? content { get; set; }
        public string? landArea { get; set; }
        public string? builtUpArea { get; set; }
        public string? height { get; set; }
        public int numberOfApartments { get; set; }
        public int numberOfParking { get; set; }
        public string? unitPerFloors { get; set; }
        public string? sizeOfEachApartment { get; set; }
        public string? category { get; set; }
        public string? videoLink { get; set; }
        public string? type { get; set; }
        public string? mapLink { get; set; }
        public int? NoOfMotorParking { get; set; }
        public IFormFile? pdfFile { get; set; }
        public DateTime? offerDateTime { get; set; }
    }

    public class ProjectGalleryModel
    {
        public string? id { get; set; }
        public string? contentType { get; set; }
        public IFormFile? content { get; set; }
        public int order { get; set; }
        public string? projectId { get; set; }
    }

    public class ProjectFeatureModel
    {
        public string? id { get; set; }
        public string? title { get; set; }
        public string? description { get; set; }
        public IFormFile? icon { get; set; }
        public int order { get; set; }
        public string? projectId { get; set; }
    }
}