# Backend

The backend is an ASP.NET Core Web API located in the `Real_Estate.server.api` project.

## Prerequisites

- [.NET SDK 8.0](https://dotnet.microsoft.com/download) or newer
- SQL Server or a compatible database instance if you plan to use the persistence layer locally

## Setup

```bash
cd backend
dotnet restore
```

To run the API locally use:

```bash
dotnet run --project Real_Estate.server.api/Real_Estate.server.api.csproj
```

The default launch settings are configured for local development. Update `appsettings.json` if you need to point to a different database or configure environment specific variables.

## Project structure

- `Controllers/` – HTTP endpoints
- `services/` – Domain/business logic services
- `Data/` – Database context and migrations
- `Models/` & `DTOs/` – Persistence and transport models
- `Helpers/` – Cross-cutting utilities

## Testing

Add automated tests under a sibling `tests/` folder when the test suite is introduced. Until then, prefer unit testing new services and controllers via xUnit or NUnit.
