using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using Real_Estate.server.api.Models;

namespace Real_Estate.server.api.Data.EntityConfig
{
    public class BlogEntityConfig : IEntityTypeConfiguration<Blog>
    {
        public void Configure(EntityTypeBuilder<Blog> builder)
        {
            builder.HasOne(e => e.User)
              .WithMany(e => e.Blogs)
              .HasForeignKey(e => e.UserId)
              .OnDelete(DeleteBehavior.ClientSetNull);
        }
    }
}