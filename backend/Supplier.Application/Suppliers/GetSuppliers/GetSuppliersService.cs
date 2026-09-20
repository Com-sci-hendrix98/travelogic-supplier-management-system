using Supplier.Application.Suppliers;

namespace Supplier.Application.Suppliers.GetSuppliers;

public class GetSuppliersService
{
    private readonly ISupplierRepository _supplierRepository;

    public GetSuppliersService(ISupplierRepository supplierRepository)
    {
        _supplierRepository = supplierRepository;
    }

    public async Task<IReadOnlyList<SupplierResponse>> ExecuteAsync(
        CancellationToken cancellationToken)
    {
        var suppliers = await _supplierRepository.GetAllAsync(
            cancellationToken);

        return suppliers
            .Select(MapToResponse)
            .ToList();
    }

    public async Task<SupplierResponse?> ExecuteByIdAsync(
        int id,
        CancellationToken cancellationToken)
    {
        var supplier = await _supplierRepository.GetByIdAsync(
            id,
            cancellationToken);

        return supplier is null
            ? null
            : MapToResponse(supplier);
    }

    private static SupplierResponse MapToResponse(
        Supplier.Domain.Entities.Supplier supplier)
    {
        return new SupplierResponse
        {
            Id = supplier.Id,
            Name = supplier.Name,
            Description = supplier.Description,
            Location = supplier.Location,
            ContactEmail = supplier.ContactEmail,
            CreatedAt = supplier.CreatedAt,
            Services = supplier.Services
                .Select(service => new ServiceResponse
                {
                    Id = service.Id,
                    Name = service.Name,
                    Description = service.Description,
                    ServiceType = service.ServiceType,
                    Price = service.Price,
                    Currency = service.Currency,
                    CreatedAt = service.CreatedAt
                })
                .ToList()
        };
    }
}