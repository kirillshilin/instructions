# Plain Node.js App Boilerplate

Folder structure and starter files for a plain TypeScript library, script, or utility.

## Target Structure

```
{project}/
├── src/
│   ├── lib/
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
export { /* re-export your public API */ } from "./lib/index.js";
```

> For a **script** (not a library), replace with:
>
> ```typescript
> async function main() {
>   console.log("Hello from {project}");
> }
>
> main().catch((error) => {
>   console.error(error);
>   process.exitCode = 1;
> });
> ```

## Other Barrels

**`src/lib/index.ts`**, **`src/types/index.ts`** — create as empty barrel files:

```typescript
// Re-export as modules are created
```

## Default .env

```
# Configuration
# Add environment variables as needed
```

## Starter Test

**`src/lib/index.test.ts`**:

```typescript
describe("{project}", () => {
  it("should be set up correctly", () => {
    expect(true).toBe(true);
  });
});
```

## Notes

- **Library vs. script** — if the project is a library (consumed by other packages), set `"main": "dist/index.js"` and `"types": "dist/index.d.ts"` in `package.json`. For scripts, these fields are optional.
- **Exports field** — for modern packages, also add `"exports"` to `package.json`:
  ```json
  {
    "exports": {
      ".": {
        "import": "./dist/index.js",
        "types": "./dist/index.d.ts"
      }
    }
  }
  ```
- **Keep it minimal** — the plain template is intentionally bare. Add folders (`services/`, `models/`, etc.) only as the project grows.
