using Microsoft.EntityFrameworkCore;
using Supplier.Application.Suppliers;
using Supplier.Application.Suppliers.CreateSupplier;
using Supplier.Infrastructure.Persistence;
using Supplier.Application.Suppliers.GetSuppliers;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<SupplierDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("SupplierDatabase")));

builder.Services.AddScoped<ISupplierRepository, SupplierRepository>();
builder.Services.AddScoped<CreateSupplierService>();
builder.Services.AddScoped<GetSuppliersService>();

builder.Services.AddControllers();

var app = builder.Build();

app.MapControllers();

app.Run();