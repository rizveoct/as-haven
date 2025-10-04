using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using Real_Estate.server.api.Models;

namespace Real_Estate.server.api.Data.EntityConfig
{
    public class ProjectFeatureEntityConfig : IEntityTypeConfiguration<ProjectFeature>
    {
        public void Configure(EntityTypeBuilder<ProjectFeature> builder)
        {
            builder.HasOne(e => e.Project)
              .WithMany(e => e.ProjectFeatures)
              .HasForeignKey(e => e.ProjectId)
              .OnDelete(DeleteBehavior.ClientSetNull);
        }
    }
}