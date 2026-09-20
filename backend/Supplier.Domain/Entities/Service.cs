namespace Supplier.Domain.Entities;

public class Service
{
    public int Id { get; set; }

    public int SupplierId { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string ServiceType { get; set; } = string.Empty;

    public decimal Price { get; set; }

    public string Currency { get; set; } = string.Empty;

    public DateTimeOffset CreatedAt { get; set; }

    public Supplier Supplier { get; set; } = null!;
}