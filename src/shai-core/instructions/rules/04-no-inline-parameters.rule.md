---
id: C-I01-r04
priority: must
status: done
related: [C-I01]
---
### No Inline Parameters

Extract method arguments into named variables before calling the method. The
call site should read like a sentence — `service.Process(command)`, not
`service.Process(new ProcessCommand(id, items, DateTime.UtcNow))`.

```csharp
// ✅ Good
var command = new ProcessCommand(id, items, DateTime.UtcNow);
var result = service.Process(command);

// ❌ Bad — inlining hides what's being passed
var result = service.Process(new ProcessCommand(id, items, DateTime.UtcNow));
```

```typescript
// ✅ Good
const options = { retries: 3, timeout: 5000 };
const result = await fetchData(url, options);

// ❌ Bad
const result = await fetchData(url, { retries: 3, timeout: 5000 });
```

**When inlining is acceptable:**
- Single primitive argument whose meaning is obvious: `list.Contains(id)`
- Fluent builder chains: `new UserBuilder().WithName("Alice").Build()`
