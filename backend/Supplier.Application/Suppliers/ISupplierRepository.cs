using SupplierEntity = Supplier.Domain.Entities.Supplier;

namespace Supplier.Application.Suppliers;

public interface ISupplierRepository
{
    Task AddAsync(
        SupplierEntity supplier,
        CancellationToken cancellationToken);

    Task<SupplierEntity?> GetByIdAsync(
        int id,
        CancellationToken cancellationToken);

    Task<IReadOnlyList<SupplierEntity>> GetAllAsync(
        CancellationToken cancellationToken);
}