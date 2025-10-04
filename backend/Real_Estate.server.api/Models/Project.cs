namespace Real_Estate.server.api.Models
{
    public class Project
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public int Order { get; set; }
        public string? Description { get; set; }
        public string? Thumbnail { get; set; }
        public string? Address { get; set; }
        public string? OfferTile { get; set; }
        public DateTime CreateDate { get; set; }
        public bool IsActive { get; set; }
        //Image,Video
        public string? ContentType { get; set; }
        public string? Content { get; set; }
        //At a Glance
        public string? LandArea { get; set; }
        public string? BuiltUpArea { get; set; }
        public string? Height { get; set; }
        public int NumberOfApartments { get; set; } 
        public int NumberOfParking { get; set; } 
        public string? UnitPerFloors { get; set; } 
        public string? SizeOfEachApartment { get; set; } 
        public string? Category { get; set; } 
        public string? Type { get; set; }
        public string? pdfFile { get; set; }
        public string? MapLink { get; set; }
        public string? VideoLink { get; set; }
        public int? NoOfMotorParking { get; set; }
        //public string? Longitude { get; set; }
        public DateTime? OfferDateTime { get; set; }
        public ICollection<ProjectGallery>? ProjectGalleries { get; set; }
        public ICollection<ProjectFeature>? ProjectFeatures { get; set; }

    }
}
