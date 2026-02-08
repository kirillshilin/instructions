---
name: Package.json Scripts
description: Standard NPM scripts for development, testing, linting, and deployment
applyTo: "**/package.json"
---

# Standard NPM Scripts

All projects should prefer to use these standard scripts:

- `dev` - Start development server (alias for start).
- `start` - Start development server with hot reload.
- `build` - Build the project for production.
- `test` - Run tests once.
- `test:watch` - Run tests in watch mode.
- `test:coverage` - Run tests with coverage report.
- `lint` - Check for linting errors.
- `lint:fix` - Fix linting errors automatically.
- `format` - Format code using formatter (e.g., Prettier).
- `deploy` - Deploy application.

# Script Naming Conventions

- Use kebab-case for multi-word script names.
- Use colon `:` to namespace related scripts (e.g., `test:watch`, `test:coverage`).
- Keep script names concise and descriptive.
