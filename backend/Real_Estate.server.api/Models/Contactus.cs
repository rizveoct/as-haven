namespace Real_Estate.server.api.Models
{
    public class Contactus
    {
        public string Id { get; set; } = Guid.CreateVersion7().ToString();
        public string? Name { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Subject { get; set; }
        public string? Message { get; set; }
        public DateTime? Date { get; set; }
    }
}
