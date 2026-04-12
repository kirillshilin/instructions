# Express App Boilerplate

Folder structure and starter files for an Express REST API.

## Target Structure

```
{project}/
├── src/
│   ├── routes/
│   │   ├── health.route.ts
│   │   └── index.ts
│   ├── middleware/
│   │   ├── error-handler.middleware.ts
│   │   └── index.ts
│   ├── services/
│   │   └── index.ts
│   ├── models/
│   │   └── index.ts
│   ├── lib/
│   │   ├── config.ts
│   │   └── index.ts
│   ├── types/
│   │   └── index.ts
│   └── index.ts
├── dist/
├── .env
├── .env.example
├── .gitignore
├── tsconfig.json
├── jest.config.ts
├── package.json
└── README.md
```

## Entry Point

**`src/index.ts`**:

```typescript
import { app } from "./app.js";
import { config } from "./lib/config.js";

const port = config.PORT;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
```

**`src/app.ts`** — separated from `index.ts` for testability:

```typescript
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import { routes } from "./routes/index.js";
import { errorHandler } from "./middleware/error-handler.middleware.js";

export const app = express();

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api", routes);
app.use(errorHandler);
```

## Routes

**`src/routes/index.ts`** (barrel):

```typescript
import { Router } from "express";
import { healthRouter } from "./health.route.js";

export const routes = Router();

routes.use("/health", healthRouter);
```

**`src/routes/health.route.ts`**:

```typescript
import { Router } from "express";

export const healthRouter = Router();

healthRouter.get("/", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});
```

## Middleware

**`src/middleware/index.ts`** (barrel):

```typescript
export { errorHandler } from "./error-handler.middleware.js";
```

**`src/middleware/error-handler.middleware.ts`**:

```typescript
import type { Request, Response, NextFunction } from "express";

interface AppError extends Error {
  statusCode?: number;
}

export function errorHandler(err: AppError, _req: Request, res: Response, _next: NextFunction) {
  const statusCode = err.statusCode ?? 500;
  const message = statusCode === 500 ? "Internal server error" : err.message;

  console.error(`[${statusCode}] ${err.message}`, err.stack);

  res.status(statusCode).json({
    error: { message, statusCode },
  });
}
```

## Lib

**`src/lib/index.ts`** (barrel):

```typescript
export { config } from "./config.js";
```

**`src/lib/config.ts`**:

```typescript
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function optionalEnv(name: string, fallback: string): string {
  return process.env[name] ?? fallback;
}

export const config = {
  PORT: parseInt(optionalEnv("PORT", "3000"), 10),
  NODE_ENV: optionalEnv("NODE_ENV", "development"),
} as const;
```

> Add user-requested env variables to the `config` object. Use `requireEnv()` for mandatory keys (like API keys) and `optionalEnv()` for keys with sensible defaults.

## Other Barrels

**`src/services/index.ts`**, **`src/models/index.ts`**, **`src/types/index.ts`** — create as empty barrel files:

```typescript
// Re-export services as they are created
```

## package.json Scripts (Express-specific)

Override the `start` script to use `--env-file`:

```json
{
  "scripts": {
    "start": "node --env-file=.env dist/index.js",
    "dev": "tsx watch --env-file=.env src/index.ts"
  }
}
```

## Default .env

```
PORT=3000
NODE_ENV=development
```

## Starter Test

**`src/routes/health.route.test.ts`**:

```typescript
import request from "supertest";
import { app } from "../app.js";

describe("GET /api/health", () => {
  it("returns status ok", async () => {
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ status: "ok" });
    expect(response.body.timestamp).toBeDefined();
  });
});
```

Install test dependency:

```bash
npm install -D supertest @types/supertest
```
