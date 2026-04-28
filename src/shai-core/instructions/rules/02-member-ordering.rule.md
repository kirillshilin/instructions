---
id: C-I01-r02
priority: must
status: done
related: [C-I01]
---
### Member Ordering

Keep the public API at the top and internals at the bottom.

#### Ordering

Put public members first and private members last. Within each visibility
level, group by kind: fields → constructors → methods.

```
1. Public static fields / constants
2. Public fields / properties
3. Constructor(s)
4. Public methods
5. Protected methods
6. Private fields
7. Private methods
```

Why: readers look for the public API first. Private details matter later.

#### One Item Per File

One class, interface, or component per file — a strong convention in .NET.

**TypeScript exception:** private helper models used only by the main export may
co-locate. Extract them when they grow or are reused.

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
find and review.
