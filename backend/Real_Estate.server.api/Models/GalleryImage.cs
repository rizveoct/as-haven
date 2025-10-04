using System.ComponentModel.DataAnnotations;

namespace Real_Estate.server.api.Models
{
    public class GalleryImage
    {
        [Required]
        public string Id { get; set; } = Guid.CreateVersion7().ToString();
        public DateTime CreateDate { get; set; }
        public bool IsActive { get; set; }
        public string? ContentType { get; set; }
        [Required]
        public string ContentName { get; set; } = string.Empty;
        public int Order { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
    }
}
