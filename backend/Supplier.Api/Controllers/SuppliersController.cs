using Microsoft.AspNetCore.Mvc;
using Supplier.Application.Suppliers.CreateSupplier;
using Supplier.Application.Suppliers.GetSuppliers;

namespace Supplier.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SuppliersController : ControllerBase
{
    private readonly GetSuppliersService _getSuppliersService;
    private readonly CreateSupplierService _createSupplierService;

    public SuppliersController(
        GetSuppliersService getSuppliersService,
        CreateSupplierService createSupplierService)
    {
        _getSuppliersService = getSuppliersService;
        _createSupplierService = createSupplierService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        CancellationToken cancellationToken)
    {
        var suppliers = await _getSuppliersService.ExecuteAsync(
            cancellationToken);

        return Ok(suppliers);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(
        int id,
        CancellationToken cancellationToken)
    {
        var supplier = await _getSuppliersService.ExecuteByIdAsync(
            id,
            cancellationToken);

        if (supplier is null)
        {
            return NotFound();
        }

        return Ok(supplier);
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        CreateSupplierRequest request,
        CancellationToken cancellationToken)
    {
        var supplierId = await _createSupplierService.ExecuteAsync(
            request,
            cancellationToken);

        return CreatedAtAction(
            nameof(GetById),
            new { id = supplierId },
            new { id = supplierId });
    }
}