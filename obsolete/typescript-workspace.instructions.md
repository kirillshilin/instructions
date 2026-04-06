---
name: TypeScript Workspace
description: Monorepo workspace setup with shared TypeScript, ESLint, and Prettier configuration across backend, frontend, and Firebase packages
applyTo: "**/package.json"
---

# Workspace Structure

Use npm workspaces to manage multiple packages in a single repository, avoiding duplicate installs of shared dependencies.

```
my-workspace/
├── package.json           # Root workspace config (private, no publish)
├── tsconfig.base.json     # Shared TypeScript base config
├── eslint.config.js       # Shared ESLint flat config
├── .prettierrc            # Shared Prettier config
├── .prettierignore
├── packages/
│   └── shared/            # Shared utilities, types, constants
│       ├── package.json
│       ├── tsconfig.json
│       └── src/
├── apps/
│   ├── backend/           # Node.js/Express or Fastify API
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   ├── frontend-react/    # React + Vite (optional)
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   ├── frontend-angular/  # Angular (optional)
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   └── firebase/          # Firebase Functions (optional)
│       ├── package.json
│       ├── tsconfig.json
│       └── src/
```

# Root package.json

- Set `"private": true` to prevent accidental publish.
- Declare all packages in the `"workspaces"` array.
- Place all shared `devDependencies` (TypeScript, ESLint, Prettier, Jest) at the root so they are installed once.
- Root scripts delegate to all workspaces via `--workspaces --if-present`.

```json
{
  "name": "my-workspace",
  "private": true,
  "workspaces": ["packages/*", "apps/*"],
  "scripts": {
    "build": "npm run build --workspaces --if-present",
    "dev": "npm run dev --workspaces --if-present",
    "test": "npm run test --workspaces --if-present",
    "test:coverage": "npm run test:coverage --workspaces --if-present",
    "lint": "npm run lint --workspaces --if-present",
    "lint:fix": "npm run lint:fix --workspaces --if-present",
    "format": "prettier --write \"**/*.{ts,tsx,js,json,md}\"",
    "format:check": "prettier --check \"**/*.{ts,tsx,js,json,md}\""
  },
  "devDependencies": {
    "typescript": "latest",
    "eslint": "latest",
    "@eslint/js": "latest",
    "typescript-eslint": "latest",
    "eslint-config-prettier": "latest",
    "prettier": "latest"
  }
}
```

# Shared TypeScript Config (tsconfig.base.json)

Place at the workspace root. All packages extend this file.

```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitOverride": true,
    "exactOptionalPropertyTypes": true
  }
}
```

# Package tsconfig.json

Each package has its own `tsconfig.json` that extends the root base config and sets package-specific paths.

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## React Frontend tsconfig.json

Extend the base and add React JSX support.

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## Angular Frontend tsconfig.json

Angular CLI generates its own `tsconfig.json`; ensure it extends the workspace base.

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "bundler",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "useDefineForClassFields": false,
    "lib": ["ES2022", "DOM"],
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "angularCompilerOptions": {
    "enableI18nLegacyMessageIdFormat": false,
    "strictInjectionParameters": true,
    "strictInputAccessModifiers": true,
    "strictTemplates": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## Firebase Functions tsconfig.json

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "target": "ES2022",
    "module": "CommonJS",
    "moduleResolution": "node",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

# Shared ESLint Config (eslint.config.js)

Use the new flat config format. Place at the workspace root. Each package can extend or override by adding its own `eslint.config.js`.

```js
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  eslintConfigPrettier,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    ignores: ["**/dist/**", "**/node_modules/**", "**/*.js"],
  }
);
```

# Shared Prettier Config (.prettierrc)

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "tabWidth": 2,
  "printWidth": 100,
  "endOfLine": "lf"
}
```

# Package-Level Package Scripts

Each workspace package must define its own scripts so root `--workspaces` delegation works.

```json
{
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "test": "jest",
    "test:coverage": "jest --coverage",
    "lint": "eslint src --max-warnings 0",
    "lint:fix": "eslint src --fix"
  }
}
```

# Sharing Code Between Packages

- Reference sibling packages by their `name` field in `package.json`.
- Add the sibling as a dependency using the `workspace:*` protocol (or `*` for npm workspaces).

```json
{
  "dependencies": {
    "@my-workspace/shared": "*"
  }
}
```

- Import from the shared package using its package name, not a relative path:
  ```typescript
  import { someUtil } from '@my-workspace/shared';
  ```

# Package Versioning

- Always use `latest` for `devDependencies` in the root `package.json` and run `npm install` to resolve the actual version.
- Pin exact versions in production `dependencies` after initial install.
- Use `npm outdated` and `npm update` regularly to keep packages current.

# Firebase Considerations

- Place Firebase Functions under `apps/firebase/`.
- Use the `firebase-functions` and `firebase-admin` packages only in that workspace package.
- Keep Firebase-specific environment config (`.env`, `serviceAccountKey.json`) out of version control.
- Set `"engines": { "node": "20" }` in `apps/firebase/package.json` to match the Cloud Functions runtime.

# Workspace Tips

- Run a command in a single package: `npm run build --workspace=apps/backend`.
- Add a dependency to a specific package: `npm install express --workspace=apps/backend`.
- All shared `devDependencies` (TypeScript, ESLint, Prettier, testing) belong at the root to avoid duplication.
- Package-specific runtime `dependencies` belong in each package's own `package.json`.
