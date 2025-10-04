using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Real_Estate.server.api.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Real_Estate.server.api.Controllers.Admin
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IConfiguration _configuration;

        public AuthenticationController(UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            IConfiguration configuration)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginApiModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _userManager.FindByNameAsync(model.email);
            if (user == null || user.IsBlocked )
                return Unauthorized();

            var res = await _signInManager.CheckPasswordSignInAsync(user, model.password, false);
            if (!res.Succeeded)
                return Unauthorized();

            var token = GenerateJwtToken(user);
            return Ok(token);
        }

        [Authorize]
        [HttpPost("refreshtoken")]
        public async Task<IActionResult> RefreshToken()
        {
            var userId = User.FindFirst("id")?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return Unauthorized();

            var token = GenerateJwtToken(user);
            return Ok(token);
        }

        // --------------------- New Endpoint ---------------------
        [Authorize]
        [HttpPost("changecredentials")]
        public async Task<IActionResult> ChangeCredentials([FromBody] ChangeCredentialsModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = User.FindFirst("id")?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return Unauthorized();

            }
            else
            {
                user.UserName = model.NewUsername;
                var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                var passwordChangeResult = await _userManager.ResetPasswordAsync(user, token, model.NewPassword);
                if (!passwordChangeResult.Succeeded)
                    return BadRequest(passwordChangeResult.Errors);
            }

            // Change username if provided
            //if (!string.IsNullOrWhiteSpace(model.NewUsername))
            //{
            //    var existingUser = await _userManager.FindByNameAsync(model.NewUsername);
            //    if (existingUser != null)
            //        return BadRequest("Username already taken.");

            //    user.UserName = model.NewUsername;
            //}

            //// Change password if provided
            //if (!string.IsNullOrWhiteSpace(model.NewPassword))
            //{
                
            //}

            var updateResult = await _userManager.UpdateAsync(user);
            if (!updateResult.Succeeded)
                return BadRequest(updateResult.Errors);

            return Ok(new { success = true, message = "Credentials updated successfully" });
        }

        // --------------------- Helper ---------------------
        private object GenerateJwtToken(ApplicationUser user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName),
                new Claim("id", user.Id),
            };

            var token = new JwtSecurityToken(
                _configuration["Jwt:Issuer"],
                _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: creds
            );

            return new
            {
                token = new JwtSecurityTokenHandler().WriteToken(token),
                expiration = token.ValidTo,
                id = user.Id,
                email = user.Email
            };
        }
    }

    public class LoginApiModel
    {
        public string email { get; set; }
        public string password { get; set; }
    }

    public class ChangeCredentialsModel
    {
        public string? NewUsername { get; set; }
        public string? NewPassword { get; set; }
    }
}
