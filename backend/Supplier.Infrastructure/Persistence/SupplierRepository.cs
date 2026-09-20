using Microsoft.EntityFrameworkCore;
using Supplier.Application.Suppliers;
using SupplierEntity = Supplier.Domain.Entities.Supplier;

namespace Supplier.Infrastructure.Persistence;

public class SupplierRepository : ISupplierRepository
{
    private readonly SupplierDbContext _dbContext;

    public SupplierRepository(SupplierDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task AddAsync(
        SupplierEntity supplier,
        CancellationToken cancellationToken)
    {
        await _dbContext.Suppliers.AddAsync(
            supplier,
            cancellationToken);

        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task<SupplierEntity?> GetByIdAsync(
    int id,
    CancellationToken cancellationToken)
    {
    return await _dbContext.Suppliers
        .Include(supplier => supplier.Services)
        .AsNoTracking()
        .FirstOrDefaultAsync(
            supplier => supplier.Id == id,
            cancellationToken);
    }

    public async Task<IReadOnlyList<SupplierEntity>> GetAllAsync(
        CancellationToken cancellationToken)
    {
        return await _dbContext.Suppliers
            .Include(supplier => supplier.Services)
            .AsNoTracking()
            .ToListAsync(cancellationToken);
    }
}