namespace Real_Estate.server.api.Models
{
    public class Team
    {
        public string Id { get; set; } = Guid.CreateVersion7().ToString();
        public string? Name { get; set; }
        public string? Designation { get; set; }
        public string? Description { get; set; }
        public string? Facebook { get; set; }
        public string? Twiter { get; set; }
        public string? Linkthen { get; set; }
        public string? Image { get; set; }
        public bool IsActive { get; set; }
        public int Order { get; set; }
    }
}
