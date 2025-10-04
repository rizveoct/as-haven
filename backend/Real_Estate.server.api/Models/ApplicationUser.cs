using Microsoft.AspNetCore.Identity;

namespace Real_Estate.server.api.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string FullName { get; set; }
        public bool IsBlocked { get; set; } = true;
        public DateTime RegistrationDate { get; set; }
        public string? Picture { get; set; } = "default_picture.png";

        public ICollection<UserRole> UserRoles { get; set; }
        public ICollection<Blog>? Blogs { get; set; }

    }
}
