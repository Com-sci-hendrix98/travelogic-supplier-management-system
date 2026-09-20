using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Supplier.Domain.Entities;

namespace Supplier.Infrastructure.Persistence.Configurations;

public class ServiceConfiguration : IEntityTypeConfiguration<Service>
{
    public void Configure(EntityTypeBuilder<Service> builder)
    {
        builder.HasKey(service => service.Id);
        builder.Property(service => service.Id)
    .ValueGeneratedOnAdd();

        builder.Property(service => service.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(service => service.Description)
            .IsRequired()
            .HasMaxLength(1000);

        builder.Property(service => service.ServiceType)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(service => service.Price)
            .IsRequired()
            .HasPrecision(18, 2);

        builder.Property(service => service.Currency)
            .IsRequired()
            .HasMaxLength(3);

        builder.Property(service => service.CreatedAt)
            .IsRequired();

        builder.HasOne(service => service.Supplier)
            .WithMany(supplier => supplier.Services)
            .HasForeignKey(service => service.SupplierId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}