using SupplierEntity = Supplier.Domain.Entities.Supplier;
using ServiceEntity = Supplier.Domain.Entities.Service;

namespace Supplier.Application.Suppliers.CreateSupplier;

public class CreateSupplierService
{
    private readonly ISupplierRepository _supplierRepository;

    public CreateSupplierService(ISupplierRepository supplierRepository)
    {
        _supplierRepository = supplierRepository;
    }

    public async Task<int> ExecuteAsync(
        CreateSupplierRequest request,
        CancellationToken cancellationToken)
    {
        var supplier = new SupplierEntity
        {
            Name = request.Name,
            Description = request.Description,
            Location = request.Location,
            ContactEmail = request.ContactEmail,
            CreatedAt = DateTimeOffset.UtcNow
        };

        foreach (var serviceRequest in request.Services)
        {
            supplier.Services.Add(new ServiceEntity
            {
                Name = serviceRequest.Name,
                Description = serviceRequest.Description,
                ServiceType = serviceRequest.ServiceType,
                Price = serviceRequest.Price,
                Currency = serviceRequest.Currency,
                CreatedAt = DateTimeOffset.UtcNow
            });
        }

        await _supplierRepository.AddAsync(
            supplier,
            cancellationToken);

        return supplier.Id;
    }
}