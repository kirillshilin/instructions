---
name: TypeScript Project
description: Strict TypeScript configuration and model organization
applyTo: "**/*.ts"
---

# TypeScript Configuration

- Use the most strict TypeScript settings with `strict: true` in tsconfig.json.
- Enable `noImplicitAny`, `strictNullChecks`, `strictFunctionTypes`, `strictBindCallApply`, `strictPropertyInitialization`, `noImplicitThis`, and `alwaysStrict`.
- Use `noUnusedLocals` and `noUnusedParameters` to catch unused variables.

# Model Organization

- All data models must be saved to separate files under the `models/` folder.
- Each model should have its own file named after the model (e.g., `user.ts`, `product.ts`).
- Export models using named exports.
- Use PascalCase for model/interface/type names.
- Use camelCase for properties.

# File Naming Conventions

- Use descriptive suffixes in filenames to indicate the type of content.
- Follow these naming patterns:
  - Services: `*.service.ts` (e.g., `user.service.ts`, `auth.service.ts`)
  - Utilities/Helpers: `*.util.ts` or `*.helper.ts` (e.g., `date.util.ts`, `string.helper.ts`)
  - Hooks (React/Vue): `*.hook.ts` or `use*.ts` (e.g., `auth.hook.ts`, `useAuth.ts`)
  - Controllers: `*.controller.ts` (e.g., `user.controller.ts`)
  - Middleware: `*.middleware.ts` (e.g., `auth.middleware.ts`)
  - Guards: `*.guard.ts` (e.g., `role.guard.ts`)
  - Validators: `*.validator.ts` (e.g., `email.validator.ts`)
  - Constants: `*.constants.ts` (e.g., `api.constants.ts`)
  - Types/Interfaces: `*.types.ts` or `*.interface.ts` (e.g., `api.types.ts`)
  - Tests: `*.test.ts` or `*.spec.ts` (e.g., `user.service.test.ts`)
- Use kebab-case or camelCase consistently within your project for file names.
- Models in the `models/` folder should use PascalCase without additional suffixes (e.g., `User.ts`, `Product.ts`).

# Barrel Exports

- Create an `index.ts` file in every folder to re-export all modules from that folder.
- Use barrel files to simplify imports and provide a clean public API.
- Example barrel file (`models/index.ts`):
  ```typescript
  export * from "./User";
  export * from "./Product";
  ```
- Import from barrels: `import { User, Product } from './models';` instead of individual files.

# Type Safety

- Prefer interfaces for object shapes.
- Use type aliases for unions and complex types.
- Avoid using `any` type.
- Properly type function parameters and return values.
- Use readonly for immutable properties.
