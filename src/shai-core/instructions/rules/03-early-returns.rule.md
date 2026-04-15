## Early Returns

Prefer early returns and guard clauses to reduce nesting — validate preconditions
at the top, then proceed with the main logic unindented.

```typescript
// preferred
function process(input: string | null): Result {
  if (!input) return Result.empty();
  if (!isValid(input)) throw new InvalidInputError(input);

  // main logic, no nesting
  return transform(input);
}
```
