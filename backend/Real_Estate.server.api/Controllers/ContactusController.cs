using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Real_Estate.server.api.Data;
using Real_Estate.server.api.Models;
using System.Diagnostics;

namespace Real_Estate.server.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactusController : ControllerBase
    {
        private readonly ApplicationDbContext context;

        public ContactusController(ApplicationDbContext context)
        {
            this.context = context;
        }
     

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var model = await context.Contactus.AsNoTracking().ToListAsync();
            return Ok(model);
        }


        [HttpPost]
        [Route("create")]
        public async Task<IActionResult> Create(ContactusModel model)
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
            return Ok(new { message = "Form Successfully Submitted." });
        }
    }

    public class ContactusModel
    {
        public string? id { get; set; }
        public string? name { get; set; }
        public string? email { get; set; }
        public string? phone { get; set; }
        public string? subject { get; set; }
        public string? message { get; set; }
    }
}
