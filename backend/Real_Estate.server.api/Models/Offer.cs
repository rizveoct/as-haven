namespace Real_Estate.server.api.Models
{
    public class Offer
    {
        public string Id { get; set; } = Guid.CreateVersion7().ToString();
        public string? Picture { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public bool IsActive { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
       
    }
}
