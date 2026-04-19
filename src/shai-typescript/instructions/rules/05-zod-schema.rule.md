## Zod Schema Naming and Layout

Use short model names and keep each schema in `/schemas/{modelName}.schema.ts`.

- Export exactly two primary symbols from each schema file.
- `export const {ModelName}Schema = z.object({...})`
- `export type {ModelName} = z.infer<typeof {ModelName}Schema>`
- Keep names concise and domain-specific (`User`, `Post`, `ProcessVariantParameter`).

**Preferred:**
```typescript
import { z } from "zod";
import { VariantSchema } from "./variant.schema";

export const ProcessVariantParameterSchema = z.object({
  variant: VariantSchema,
  postId: z.string().min(1),
  playlistId: z.string().min(1),
});

export type ProcessVariantParameter = z.infer<typeof ProcessVariantParameterSchema>;
```

**Avoid:**
```typescript
export const processVariantParameterValidation = z.object({ ... });
export type ProcessVariantParameterData = any;
```
Why: inconsistent naming and `any` weaken schema discoverability and type safety.
