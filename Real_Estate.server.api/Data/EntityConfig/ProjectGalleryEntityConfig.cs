using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using Real_Estate.server.api.Models;

namespace Real_Estate.server.api.Data.EntityConfig
{
    public class ProjectGalleryEntityConfig : IEntityTypeConfiguration<ProjectGallery>
    {
        public void Configure(EntityTypeBuilder<ProjectGallery> builder)
        {
            builder.HasOne(e => e.Project)
              .WithMany(e => e.ProjectGalleries)
              .HasForeignKey(e => e.ProjectId)
              .OnDelete(DeleteBehavior.ClientSetNull);
        }
    }
}