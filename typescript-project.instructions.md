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
- Each model should have its own file named after the model (e.g., `User.ts`, `Product.ts`).
- Export models using named exports.
- Use PascalCase for model/interface/type names.
- Use camelCase for properties.

# Barrel Exports
- Create an `index.ts` file in every folder to re-export all modules from that folder.
- Use barrel files to simplify imports and provide a clean public API.
- Example barrel file (`models/index.ts`):
  ```typescript
  export * from './User';
  export * from './Product';
  ```
- Import from barrels: `import { User, Product } from './models';` instead of individual files.

# Type Safety
- Prefer interfaces for object shapes.
- Use type aliases for unions and complex types.
- Avoid using `any` type.
- Properly type function parameters and return values.
- Use readonly for immutable properties.
