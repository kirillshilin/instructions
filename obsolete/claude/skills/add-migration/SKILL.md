---
name: add-migration
description: >
  Safe workflow for adding and applying an Entity Framework Core migration in a
  .NET project. Use this skill when a domain model change requires a new
  database schema migration.
---

# Add EF Core Migration

## When to Use

- A domain model change (new entity, new property, renamed column, dropped
  table) requires a corresponding database migration.
- You need to apply pending migrations to a local or test database.
- You want to review an auto-generated migration before applying it.

## Process

1. **Check for uncommitted model changes** — verify all relevant C# model
   changes are saved:
   ```bash
   git diff -- "*.cs"
   ```

2. **Build the solution** — a clean build is required before EF Core can
   generate a migration:
   ```bash
   dotnet build
   ```
   Fix any compile errors before continuing.

3. **Generate the migration** — use a descriptive PascalCase name that
   summarises the schema change (e.g., `AddOrderItemTable`,
   `RenameCustomerEmailColumn`):
   ```bash
   dotnet ef migrations add <MigrationName> \
     --project src/Infrastructure \
     --startup-project src/Api
   ```

4. **Review the generated file** — open
   `src/Infrastructure/Migrations/<Timestamp>_<MigrationName>.cs` and verify:
   - `Up()` creates / alters exactly the intended tables and columns.
   - `Down()` cleanly reverses every change in `Up()`.
   - Column types, nullability, lengths, and default values match the model.
   - No unintended table drops or data-loss operations are present.

5. **Apply to the local database**:
   ```bash
   dotnet ef database update \
     --project src/Infrastructure \
     --startup-project src/Api
   ```

6. **Run integration tests** — confirm the schema change works end-to-end:
   ```bash
   dotnet test --filter Category=Integration
   ```

7. **Report** — describe what changed and flag any risks (destructive changes,
   large tables, missing indexes).

## Output Format

```
## Migration: <MigrationName>

**Generated:** `src/Infrastructure/Migrations/<Timestamp>_<MigrationName>.cs`

### Schema changes
- <description of Up() changes>

### Rollback
- <description of Down() changes>

### Risks
- <None | description of any destructive or high-risk changes>

### Verification
- ✅ `dotnet build` — succeeded
- ✅ `dotnet ef database update` — applied successfully
- ✅ `dotnet test --filter Category=Integration` — all passed
```

## Best Practices

- Use PascalCase migration names that describe the schema change, not the
  ticket number (`AddShippingAddressToOrder`, not `JIRA-1234`).
- Keep each migration to one logical change — small migrations are easier to
  review and roll back.
- Never edit a migration file after it has been applied to any shared
  environment (staging, production).
- For data migrations (seeding, backfilling), use `migrationBuilder.Sql()` in a
  separate migration from schema changes.
- Always verify `Down()` is correct — EF Core sometimes generates an incomplete
  rollback for complex changes.
- Add an index in the same migration as the FK column it supports.
