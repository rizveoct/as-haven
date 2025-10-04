namespace Real_Estate.server.api.Models
{
    public class Blog
    {
        public string Id { get; set; }=Guid.CreateVersion7().ToString();
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Image { get; set; }
        public bool IsActive { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? PostedDate { get; set; }
        public DateTime? OfferDateTime { get; set; }
        public string? UserId { get; set; }
        public ApplicationUser? User { get; set; }

    }
}
