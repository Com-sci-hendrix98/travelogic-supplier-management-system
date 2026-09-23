using System.ComponentModel.DataAnnotations;

namespace Supplier.Application.Suppliers.CreateSupplier;

public class CreateSupplierRequest
{
    [Required]
    [StringLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [StringLength(1000)]
    public string Description { get; set; } = string.Empty;

    [Required]
    [StringLength(200)]
    public string Location { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [StringLength(320)]
    public string ContactEmail { get; set; } = string.Empty;

    [MinLength(1)] 
    public List<CreateSupplierServiceRequest> Services { get; set; } = [];
}

public class CreateSupplierServiceRequest
{
    [Required]
    [StringLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [StringLength(1000)]
    public string Description { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string ServiceType { get; set; } = string.Empty;

    [Range(0, double.MaxValue)]
    public decimal Price { get; set; }

    [Required]
    [StringLength(3, MinimumLength = 3)]
    public string Currency { get; set; } = string.Empty;
}