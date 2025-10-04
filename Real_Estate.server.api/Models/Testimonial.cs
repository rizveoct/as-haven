namespace Real_Estate.server.api.Models
{
    public class Testimonial
    {
        public string Id { get; set; } = Guid.CreateVersion7().ToString();
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? Image { get; set; }
        /// <summary>
        /// Image,Video
        /// </summary>
        public string? ContentType { get; set; }
        public string? Content { get; set; }
        public bool IsActive { get; set; }
        public int Order { get; set; }
        public string? CustomerType { get; set; }
    }
}
