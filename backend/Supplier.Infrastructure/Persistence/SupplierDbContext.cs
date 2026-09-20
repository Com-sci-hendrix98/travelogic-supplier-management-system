using Microsoft.EntityFrameworkCore;
using SupplierEntity = Supplier.Domain.Entities.Supplier;
using ServiceEntity = Supplier.Domain.Entities.Service;

namespace Supplier.Infrastructure.Persistence;

public class SupplierDbContext : DbContext
{
    public SupplierDbContext(DbContextOptions<SupplierDbContext> options)
        : base(options)
    {
    }

    public DbSet<SupplierEntity> Suppliers => Set<SupplierEntity>();

    public DbSet<ServiceEntity> Services => Set<ServiceEntity>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(SupplierDbContext).Assembly);

        base.OnModelCreating(modelBuilder);
    }
}