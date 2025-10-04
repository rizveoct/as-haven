namespace Real_Estate.server.api.Models
{
    public class Consultant
    {
        public int Id { get; set; } 
        public string? Name { get; set; }
        public string? location { get; set; }
        public string? Image { get; set; }    
        public int? IsInterior { get; set; }
    }
}
