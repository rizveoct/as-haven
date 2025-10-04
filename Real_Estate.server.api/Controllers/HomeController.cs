using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Real_Estate.server.api.Controllers
{

    [Route("api/[controller]")]

    [ApiController]
    [AllowAnonymous]
    public class HomeController : ControllerBase
    {
        public IActionResult Index()
        {
            return Ok(new { message = "server is running" });

        }
    }
}
