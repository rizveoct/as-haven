namespace Real_Estate.server.api.Models
{
    public class Aboutus
    {
        public string Id { get; set; } = Guid.CreateVersion7().ToString();
        public string? Vision { get; set; }
        public string? Mission { get; set; }
        public string? OwnerName { get; set; }
        public string? OwnerDesignation { get; set; }
        public string? OwnerSpeech { get; set; }
        public string? Facebook { get; set; }
        public string? Twitter { get; set; }
        public string? LinkedIn { get; set; }
        public string? History { get; set; }
        public string? OwnerImage { get; set; }
        public string? VisionImage { get; set; }
        public string? MissionImage { get; set; }
    }
}
