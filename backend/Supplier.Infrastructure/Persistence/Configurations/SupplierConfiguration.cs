using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SupplierEntity = Supplier.Domain.Entities.Supplier;

namespace Supplier.Infrastructure.Persistence.Configurations;

public class SupplierConfiguration : IEntityTypeConfiguration<SupplierEntity>
{
    public void Configure(EntityTypeBuilder<SupplierEntity> builder)
    {
        builder.HasKey(supplier => supplier.Id);
        builder.Property(supplier => supplier.Id)
    .ValueGeneratedOnAdd();

        builder.Property(supplier => supplier.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(supplier => supplier.Description)
            .IsRequired()
            .HasMaxLength(1000);

        builder.Property(supplier => supplier.Location)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(supplier => supplier.ContactEmail)
            .IsRequired()
            .HasMaxLength(320);

        builder.Property(supplier => supplier.CreatedAt)
            .IsRequired();
    }
}