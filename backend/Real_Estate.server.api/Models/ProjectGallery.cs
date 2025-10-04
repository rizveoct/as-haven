namespace Real_Estate.server.api.Models
{
    public class ProjectGallery
    {
        public string? Id { get; set; } = Guid.CreateVersion7().ToString();    
        /// <summary>
        /// Image,Video
        /// </summary>
        public string? ContentType { get; set; }
        public string? Content { get; set; }
        public bool? IsActive { get; set; }
        public int Order { get; set; }
        public string? ProjectId { get; set; }
        public Project? Project { get; set; }
    }
}
