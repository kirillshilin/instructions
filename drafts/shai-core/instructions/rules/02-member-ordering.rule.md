---
applyTo: "**"
---

## Member Ordering

Consistent ordering makes classes scannable — public API at the top, internals
at the bottom.

### Ordering

Public members first, private members last. Within each visibility level, group
by kind: fields → constructors → methods.

```
1. Public static fields / constants
2. Public fields / properties
3. Constructor(s)
4. Public methods
5. Protected methods
6. Private fields
7. Private methods
```

Why: readers care about the public API first. Private implementation details are
relevant only when digging deeper. Top-to-bottom matches how consumers discover
a class.

### One Item Per File

One class, interface, or component per file — a strong convention in .NET.

**TypeScript exception:** private helper models used only by the main export may co-locate. Extract when the helper grows or is referenced elsewhere.

**Preferred:**

```csharp
UserService.cs          → contains UserService
UserRepository.cs       → contains IUserRepository + UserRepository (interface + impl is OK in .NET)
```

```typescript
user-service.ts         → contains UserService
user.model.ts           → contains User interface
```

**Avoid:**
```
Models.cs               → contains User, Order, Product, Address
helpers.ts              → contains 12 unrelated utility functions
```
Why: multi-item files become dumping grounds. Single-item files are easier to
find, rename, move, and review in diffs.
