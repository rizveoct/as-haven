namespace Real_Estate.server.api.Models
{
    public class ProjectFeature
    {
        public string? Id { get; set; }=Guid.CreateVersion7().ToString();
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Icon { get; set; }
        public int Order { get; set; }
        public string? ProjectId { get; set; }
        public Project? Project { get; set; }
    }
}
