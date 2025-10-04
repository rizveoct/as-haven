# Frontend

The frontend is an Angular application located in the `ashaven-ui` workspace.

## Prerequisites

- [Node.js 18 LTS](https://nodejs.org/) (which includes npm)
- Angular CLI (`npm install -g @angular/cli`) for local tooling convenience

## Setup

```bash
cd frontend/ashaven-ui
npm install
```

## Development server

Run the Angular development server on `http://localhost:4200`:

```bash
npm run start
```

## Production build

```bash
npm run build
```

Build artefacts are emitted to `dist/` and can be served by any static host.

## Testing

Unit tests can be added with Jasmine/Karma and executed with `npm run test`. End-to-end test tooling should live alongside the application under `e2e/` when introduced.
