namespace Real_Estate.server.api.Models
{
    public class CompanyInfo
    {
        public string Id { get; set; }=Guid.CreateVersion7().ToString();
        public string? Address { get; set; }
        public string? Email { get; set; }
        public string? PhoneTilte { get; set; }
        public string? Phone { get; set; }
        public string? Latitude { get; set; }
        public string? Longitude { get; set; }
    }
}
