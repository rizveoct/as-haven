using Microsoft.AspNetCore.Identity;

namespace Real_Estate.server.api.Models
{
    public class UserRole : IdentityUserRole<string>
    {
        public ApplicationUser ApplicationUser { get; set; }
        public ApplicationRole ApplicationRole { get; set; }
    }
}
