using Microsoft.AspNetCore.Identity;

namespace Real_Estate.server.api.Models
{
    public class ApplicationRole : IdentityRole
    {
        public ICollection<UserRole> UserRoles { get; set; }

        public ApplicationRole() : base()
        {

        }

        public ApplicationRole(string roleName) : base(roleName)
        {

        }
    }
}
