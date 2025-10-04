# AS Haven Monorepo

AS Haven is structured as a two-tier real estate platform composed of a .NET API and an Angular client. This repository is organised as a monorepo so shared workflows, tooling and documentation can evolve together.

## Repository layout

```
├── backend/           # ASP.NET Core solution and API implementation
├── frontend/          # Angular single-page application
├── docs/              # Living documentation for maintainers and contributors
├── .gitignore
├── LICENSE
└── README.md
```

Each top-level folder contains its own README with technology-specific setup and troubleshooting guidance.

## Getting started

1. Clone the repository and install the prerequisites for both the backend (.NET 8 SDK or later) and the frontend (Node.js 18 LTS and npm).
2. Follow the setup steps in [`backend/README.md`](backend/README.md) and [`frontend/README.md`](frontend/README.md) to restore dependencies and run the local development servers.
3. Consult [`docs/architecture.md`](docs/architecture.md) for an overview of the solution and common development workflows.

## Contribution guidelines

* Follow the existing coding style of the component you are modifying.
* Keep commits focused and include context in commit messages.
* Update or extend automated tests where applicable.
* Reflect noteworthy architectural decisions in `docs/` so future contributors understand the rationale behind changes.

## Support

Please open an issue when you run into bugs or have suggestions for improving the developer experience. Pull requests are welcome!
