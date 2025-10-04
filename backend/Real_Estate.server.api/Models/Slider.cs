namespace Real_Estate.server.api.Models
{
    public class Slider
    {
        public string Id { get; set; } = Guid.CreateVersion7().ToString();
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Image { get; set; }
        public bool IsActive { get; set; }
        public int Order { get; set; }
    }
}
