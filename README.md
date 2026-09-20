# Travelogic Supplier Management System

A full-stack supplier management application built for the Travelogic technical assessment.

The application allows tourism suppliers to be created with their associated services and provides a dashboard for viewing all suppliers and their services.

## Features

- Create tourism suppliers
- Add multiple services to a supplier
- View all suppliers and their services
- View an individual supplier
- Server-side request validation
- SQL Server persistence
- Entity Framework Core migrations
- React frontend
- ASP.NET Core API
- Docker-based SQL Server setup

## Tech Stack

### Backend

- C#
- .NET 10
- ASP.NET Core Web API
- Entity Framework Core
- SQL Server

### Frontend

- React
- Vite
- JavaScript
- CSS

### Infrastructure

- Docker
- Docker Compose

## Architecture

The backend is structured as a single independently deployable API with separated application, domain, and infrastructure concerns.

```text
React Frontend
      |
      | HTTP / JSON
      v
Supplier.Api
      |
      v
Supplier.Application
      |
      v
Supplier.Domain
      ^
      |
Supplier.Infrastructure
      |
      v
Entity Framework Core
      |
      v
SQL Server

The API project acts as the composition root, wiring the application services, repository implementation, database context, and other dependencies together.

travelogic-supplier-management-system/
├── frontend/
├── backend/
│   ├── Supplier.Api/
│   │   ├── Controllers/
│   │   ├── Program.cs
│   │   └── appsettings.json
│   ├── Supplier.Application/
│   │   └── Suppliers/
│   ├── Supplier.Domain/
│   │   └── Entities/
│   ├── Supplier.Infrastructure/
│   │   └── Persistence/
│   │       ├── Configurations/
│   │       └── Migrations/
│   └── SupplierManagement.slnx
├── README.md
└── docker-compose.yml

Layer Responsibilities

Supplier.Api

HTTP boundary for the application. Handles routing, HTTP requests, responses, and dependency injection configuration.

Supplier.Application

Contains application use cases and contracts such as supplier creation, retrieval, request/response models, and the repository abstraction.

Supplier.Domain

Contains the core business entities and their relationships without dependencies on infrastructure technologies.

Supplier.Infrastructure

Contains technical implementations such as Entity Framework Core, SQL Server persistence, repository implementations, entity configurations, and migrations.

Data Model

A supplier can have multiple services.

Supplier
   |
   | 1
   |
   | *
   v
Service

The Services table contains SupplierId as a foreign key referencing Suppliers.Id.

The database enforces this relationship and uses cascade delete so that services belonging to a supplier are removed when that supplier is deleted.

API Endpoints
Get all suppliers
GET /api/suppliers

Returns all suppliers including their associated services.

Get supplier by ID
GET /api/suppliers/{id}

Returns a single supplier including its services.

Create supplier
POST /api/suppliers

Creates a supplier and its associated services.

Example request:

{
  "name": "Ocean Breeze Adventures",
  "description": "Coastal excursions and guided marine experiences.",
  "location": "Durban, South Africa",
  "contactEmail": "info@oceanbreeze.example",
  "services": [
    {
      "name": "Dolphin Boat Tour",
      "description": "Guided coastal dolphin viewing experience.",
      "serviceType": "Tour",
      "price": 750,
      "currency": "ZAR"
    }
  ]
}
Validation

Validation is performed on the API request models using ASP.NET Core validation attributes.

The API validates required fields, string lengths, email format, service requirements, non-negative prices, and three-character currency codes.

Frontend validation is also included for user experience, but server-side validation remains the authoritative boundary because API requests can be made without using the frontend.

Request and Response Models

The API does not bind HTTP requests directly to database entities.

Request models provide a dedicated contract for incoming API data and prevent clients from controlling internal or database-managed properties.

Response models provide a controlled API response shape rather than exposing the Entity Framework entity graph directly.

This also prevents circular JSON serialization caused by the bidirectional Supplier and Service navigation properties.

Database

SQL Server runs through Docker Compose.

The database schema is managed using Entity Framework Core migrations located in:

backend/Supplier.Infrastructure/Persistence/Migrations/

The current database contains:

Suppliers
Services
__EFMigrationsHistory
Running the Application
Prerequisites
.NET 10 SDK
Node.js
Docker Desktop
Git
1. Start SQL Server

From the repository root:

docker compose up -d

The SQL Server container uses the MSSQL_SA_PASSWORD value from the local .env file.

The .env file is intentionally excluded from Git because it contains local credentials.

2. Configure the API connection string

The API expects the SupplierDatabase connection string through the environment:

export 'ConnectionStrings__SupplierDatabase=Server=localhost,1433;Database=SupplierManagement;User Id=sa;Password=your-local-password;TrustServerCertificate=True;'

Replace your-local-password with the SQL Server password configured in .env.

3. Apply database migrations

From the backend directory:

dotnet ef database update \
  --project Supplier.Infrastructure \
  --startup-project Supplier.Api
4. Start the API

From the backend directory:

dotnet run --project Supplier.Api

The API will be available at:

http://localhost:5177
5. Start the frontend

From the frontend directory:

npm install
npm run dev

The frontend will be available at the Vite development URL, normally:

http://localhost:5173

The Vite development server proxies /api requests to the ASP.NET Core API.

Architectural Decisions
Separate application and infrastructure concerns

The application layer defines the repository abstraction while infrastructure provides the Entity Framework Core implementation.

This keeps persistence technology-specific concerns out of the application use cases.

Separate request and response models

API contracts are separated from persistence entities to prevent accidental exposure of internal fields and to control the shape of data crossing the HTTP boundary.

Explicit Entity Framework configuration

Entity configuration is kept in dedicated configuration classes rather than relying entirely on EF Core conventions.

This makes database constraints such as required fields, maximum lengths, decimal precision, and relationships explicit and easier to maintain.

One API with separated code layers

The assessment only requires a supplier API, so the solution uses one independently deployable API rather than splitting the system into multiple services prematurely.

The internal separation allows the API to be incorporated into a larger microservice architecture later without introducing unnecessary operational complexity for the current requirements.

Future Extension

The architecture leaves room for additional technical concerns such as scheduled reporting, external supplier integrations, or background processing without placing those infrastructure-specific concerns directly into the API or domain layer.
