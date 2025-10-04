using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Real_Estate.server.api.Data;
using Real_Estate.server.api.Models;
using System.Diagnostics;

namespace Real_Estate.server.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CompanyInfoController : ControllerBase
    {
        private readonly ApplicationDbContext context;

        public CompanyInfoController(ApplicationDbContext context)
        {
            this.context = context;
        }
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var model = await context.CompanyInfos.AsNoTracking().ToListAsync();
            return Ok(model);
        }

        [HttpPost]
        [Route("create")]
        public async Task<IActionResult> Create(CompanyInfoModel model)
        {
            var newModel = new CompanyInfo();

            newModel.Id = Guid.CreateVersion7().ToString();
            newModel.PhoneTilte = model.title;
            newModel.Phone = model.phone;
            newModel.Address = model.address;
            newModel.Email = model.email;
            newModel.Latitude = model.latitude;
            newModel.Longitude = model.longitude;

            await context.CompanyInfos.AddAsync(newModel);
            await context.SaveChangesAsync();
            return Ok("Item has been created.");
        }

        [HttpPost]
        [Route("edit")]
        public async Task<IActionResult> Edit(CompanyInfoModel model)
        {
            var exModel = await context.CompanyInfos.Where(e => e.Id == model.id).FirstOrDefaultAsync();
            if (exModel != null)
            {
                exModel.PhoneTilte = model.title;
                exModel.Phone = model.phone;
                exModel.Address = model.address;
                exModel.Email = model.email;
                exModel.Latitude = model.latitude;
                exModel.Longitude = model.longitude;
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
            var data = await context.CompanyInfos.Where(e => e.Id == id).FirstOrDefaultAsync();
            if (data == null) return Ok("Data not found.");
            context.CompanyInfos.Remove(data);
            await context.SaveChangesAsync();
            return Ok("Item has been deleted.");
        }

    }

    public class CompanyInfoModel
    {
        public string? id { get; set; }
        public string? address { get; set; }
        public string? email { get; set; }
        public string? title { get; set; }
        public string? phone { get; set; }
        public string? latitude { get; set; }
        public string? longitude { get; set; }
    }
}
