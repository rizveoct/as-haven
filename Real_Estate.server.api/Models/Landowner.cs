namespace Real_Estate.server.api.Models
{
    public class Landowner
    {
        public string Id { get; set; }  = Guid.CreateVersion7().ToString();
        //landowner
        public string? Name { get; set; }
        public string? ContactPerson { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public string? Message { get; set; }
        public DateTime CreateDate { get; set; }

        //landinfo
        public string? Locality { get; set; }
        public string? Address { get; set; }
        public string? FrontRoadWidth { get; set; }
        public string? LandCategory { get; set; }
        public string? Facing { get; set; }
        public string? AttractiveBenefits { get; set; }

    }
}
