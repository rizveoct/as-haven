# Architecture overview

## High-level design

AS Haven follows a classic client-server architecture:

- **Frontend** – Angular SPA responsible for presenting real estate listings and interacting with the backend via REST APIs.
- **Backend** – ASP.NET Core Web API providing authentication, listing management and domain services.
- **Database** – Configured through Entity Framework Core in the backend. Connection details live in `appsettings*.json`.

## Environments

| Environment | Frontend command         | Backend command                                                          |
|-------------|--------------------------|-------------------------------------------------------------------------|
| Local       | `npm run start`          | `dotnet run --project backend/Real_Estate.server.api/Real_Estate.server.api.csproj` |
| Production  | `npm run build` (serve) | `dotnet publish` then deploy the generated artifacts                    |

## Development workflow

1. Start the backend API so the Angular app can communicate with it.
2. Start the Angular development server and configure environment variables (`environment.ts`) to point to the API base URL.
3. Implement features vertically: update DTOs/models in the backend, expose endpoints, then consume them in the frontend.
4. Add automated tests where possible before opening a pull request.

## Folder conventions

- Shared documentation and diagrams belong in `docs/`.
- Backend extensions (e.g. workers, migrations) should live under `backend/` as sibling projects to the existing API.
- Additional client experiences (e.g. mobile) should live under `frontend/` in their own workspace folders.

Keep this document updated as the system evolves to maintain a single source of truth.
