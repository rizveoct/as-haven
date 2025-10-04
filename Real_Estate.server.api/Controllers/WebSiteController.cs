//using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Real_Estate.server.api.Data;
using Real_Estate.server.api.Models;

namespace Real_Estate.server.api.Controllers
{
    //[AllowAnonymous]
    [Route("api/[controller]")]
    [ApiController]
    public class WebSiteController : ControllerBase
    {
        private readonly ApplicationDbContext context;

        public WebSiteController(ApplicationDbContext context)
        {
            this.context = context;
        }

        [HttpGet]
        [Route("getprojects")]
        public async Task<IActionResult> GetProjects(string? category, string? type, string? location)
        {
            var query =  context.Projects.Where(e => e.IsActive == true).OrderByDescending(e => e.Name).AsQueryable();
            if (category != null && category != "all") {
                query = query.Where(e => e.Category.ToLower() == category.ToLower());
            }
            if (type != null && type != "all")
            {
                query = query.Where(e => e.Type.ToLower() == type.ToLower());
            }

            if (location != null && location != "all")
            {
                query = query.Where(e => e.Address.ToLower().Contains(location.ToLower()));
            }
            var projects = await query.ToListAsync();
            return Ok(projects);
        }

        [HttpGet]
        [Route("getsingleproject")]
        public async Task<IActionResult> Getsingleproject(string? projectId)
        {
            var data = await context.Projects.Where(e => e.Id == projectId).FirstOrDefaultAsync();            
            return Ok(data);
        }
         
       
        
        [HttpGet]
        [Route("getprojectfeatures")]
        public async Task<IActionResult> Getprojectfeatures(string? projectId)
        {
            var data = await context.ProjectFeatures.Where(e => e.ProjectId == projectId).ToListAsync();            
            return Ok(data);
        }
        
        [HttpGet]
        [Route("getgalleries")]
        public async Task<IActionResult> Getgalleries(string? projectId)
        {
            var data = await context.ProjectGalleries.Where(e => e.ProjectId == projectId && e.IsActive ==true).OrderBy(e => e.Order).ToListAsync();            
            return Ok(data);
        }
        [HttpGet]
        [Route("getsliders")]
        public async Task<IActionResult> Getsliders()
        {
            var data = await context.Sliders.Where(e => e.IsActive == true).OrderBy(e => e.Order).ToListAsync();            
            return Ok(data);
        }

        [HttpGet]
        [Route("getaboutus")]
        public async Task<IActionResult> GetAboutUs()
        {
            var data = await context.Aboutus.FirstOrDefaultAsync();
            return Ok(data);
        }

        [HttpGet]
        [Route("getcompanyinfo")]
        public async Task<IActionResult> Getcompanyinfo()
        {
            var data = await context.CompanyInfos.ToListAsync();
            return Ok(data);
        }

        [HttpGet]
        [Route("getgallery")]
        public async Task<IActionResult> Getgallery()
        {
            var data = await context.GalleryImages.Where(e => e.IsActive == true).OrderBy(e => e.Order).ToListAsync();
            return Ok(data);
        }

        [HttpGet]
        [Route("getoffers")]
        public async Task<IActionResult> Getoffers()
        {
            var data = await context.Offers.Where(e => e.IsActive == true).FirstOrDefaultAsync();
            return Ok(data);
        }

        [HttpGet]
        [Route("getteams")]
        public async Task<IActionResult> Getteams()
        {
            var data = await context.Teams.Where(e => e.IsActive == true).OrderBy(e => e.Order).ToListAsync();
            return Ok(data);
        }

        [HttpGet]
        [Route("gettestimonials")]
        public async Task<IActionResult> Gettestimonials()
        {
            var data = await context.Testimonials.Where(e => e.IsActive == true).ToListAsync();
            return Ok(data);
        }

        [HttpGet]
        [Route("getblogs")]
        public async Task<IActionResult>Getblogs()
        {
            var data = await context.Blogs.Where(e => e.IsActive == true).Include(e=>e.User).Select(e => new { Id=e.Id, Title=e.Title, Image=e.Image, Name=e.User.FullName, Picture = e.User.Picture, Description=e.Description, PostedDate=e.PostedDate, OfferDate=e.OfferDateTime }).ToListAsync();
            return Ok(data);
        }
        [HttpGet]
        [Route("getsingleblog")]
        public async Task<IActionResult> Getsingleblog(string? blogId)
        {
            var data = await context.Blogs.Where(e => e.Id == blogId).Include(e => e.User).Select(e => new { Id = e.Id, Title = e.Title, Image = e.Image, Name = e.User.FullName, Picture = e.User.Picture, Description = e.Description, PostedDate = e.PostedDate, OfferDate = e.OfferDateTime }).FirstOrDefaultAsync();
            return Ok(data);
        }

        [HttpPost]
        [Route("createcontactus")]
        public async Task<IActionResult> Createcontactus(ContactusModel2 model)
        {
            var newModel = new Contactus();
            newModel.Id = Guid.CreateVersion7().ToString();
            newModel.Name = model.name;
            newModel.Email = model.email;
            newModel.Phone = model.phone;
            newModel.Subject = model.subject;
            newModel.Message = model.message;
            newModel.Date = DateTime.UtcNow;
            await context.Contactus.AddAsync(newModel);
            await context.SaveChangesAsync();
            return Ok("Item has been created.");
        }

        [HttpPost]
        [Route("createlandowner")]
        public async Task<IActionResult> Createlandowner(LandownerModel2 model)
        {
            var newModel = new Landowner();
            newModel.Id = Guid.CreateVersion7().ToString();
            newModel.Name = model.name;
            newModel.Email = model.email;
            newModel.Phone = model.phone;
            newModel.Address = model.address;
            newModel.Message = model.message;
            newModel.Locality = model.locality;
            newModel.LandCategory = model.landCategory;
            newModel.FrontRoadWidth = model.frontRoadWidth;
            newModel.Facing = model.facing;
            newModel.CreateDate = DateTime.UtcNow;
            await context.Landowners.AddAsync(newModel);
            await context.SaveChangesAsync();
            return Ok("Item has been created.");
        }
    }
    public class ContactusModel2
    {
        public string? name { get; set; }
        public string? email { get; set; }
        public string? phone { get; set; }
        public string? subject { get; set; }
        public string? message { get; set; }
    }
    public class LandownerModel2
    {
        public string? name { get; set; }
        public string? phone { get; set; }
        public string? email { get; set; }
        public string? message { get; set; }

        //landinfo
        public string? locality { get; set; }
        public string? address { get; set; }
        public string? frontRoadWidth { get; set; }
        public string? landCategory { get; set; }
        public string? facing { get; set; }

    }
}
