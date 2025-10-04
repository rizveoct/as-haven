using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Real_Estate.server.api.Data;
using Real_Estate.server.api.Models;

namespace Real_Estate.server.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LandownerController : ControllerBase
    {
        private readonly ApplicationDbContext context;

        public LandownerController(ApplicationDbContext context)
        {
            this.context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var model = await context.Landowners.AsNoTracking().ToListAsync();
            return Ok(model);
        }


        [HttpPost]
        [Route("create")]
        public async Task<IActionResult> Create(LandownerModel model)
        {
            var newModel = new Landowner();
            newModel.Id = Guid.CreateVersion7().ToString();
            newModel.Name = model.name;
            newModel.Email = model.email;
            newModel.ContactPerson = model.contactPerson;
            newModel.Phone = model.phone;
            newModel.Message = model.message;
            newModel.Locality = model.locality;
            newModel.Address = model.address;
            newModel.FrontRoadWidth = model.frontRoadWidth;
            newModel.LandCategory = model.landCategory;
            newModel.Facing = model.facing;
            newModel.AttractiveBenefits = model.attractiveBenefits;
            newModel.CreateDate = DateTime.UtcNow;
            await context.Landowners.AddAsync(newModel);
            await context.SaveChangesAsync();
            return Ok("Form Successfully Submited.");
        }

    }

    public class LandownerModel
    {
        public string? id { get; set; }
        //landowner
        public string? name { get; set; }
        public string? contactPerson { get; set; }
        public string? phone { get; set; }
        public string? email { get; set; }
        public string? message { get; set; }

        //landinfo
        public string? locality { get; set; }
        public string? address { get; set; }
        public string? frontRoadWidth { get; set; }
        public string? landCategory { get; set; }
        public string? facing { get; set; }
        public string? attractiveBenefits { get; set; }

    }
}
