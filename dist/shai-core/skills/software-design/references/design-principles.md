# Design Principles Reference

Detailed guide for the principles enforced by `shai-software-design`.
Load this file when evaluating a design against SOLID, KISS, DRY, or YAGNI.

---

## SOLID Principles

SOLID is an acronym for five object-oriented design principles introduced by
Robert C. Martin. Each principle addresses a specific source of fragility in
software designs. Apply them together — they reinforce each other.

---

### S — Single Responsibility Principle (SRP)

> **"A class should have only one reason to change."**

A class/module owns one cohesive piece of behavior. If two different actors
(teams, use-cases, or change drivers) might request changes to the same class
independently, it has two responsibilities and should be split.

**Common violations:**
- A `UserService` that handles authentication, profile management, *and* email
  sending
- A `Report` class that both generates data *and* formats it for print/PDF

**Violation indicators (code smells):**
- **Constructor over-injection**: more than 3–4 constructor parameters is a
  strong signal the class has too many responsibilities. Each dependency added
  to a constructor represents a responsibility the class is taking on.
  *Exception: orchestrators and facades legitimately coordinate many
  collaborators — evaluate intent before splitting.*
- The class name contains "And", "Manager", "Processor", or "Handler" and
  does multiple unrelated things
- The class has methods that clearly belong to different conceptual groups
  (e.g., `save()` + `sendEmail()` + `generatePDF()`)
- Unit tests for the class need many different kinds of mocks

**How to apply:**
1. List every *reason to change* the class has
2. If there are more than one, extract each into its own class
3. Compose the original behavior through dependencies

**Example:**
```typescript
// ❌ Two reasons to change: user logic + notification logic
class UserService {
  register(data: RegisterInput): User { /* ... */ }
  sendWelcomeEmail(user: User): void { /* ... */ }
}

// ✅ One reason each
class UserService {
  register(data: RegisterInput): User { /* ... */ }
}
class NotificationService {
  sendWelcomeEmail(user: User): void { /* ... */ }
}
```

---

### O — Open/Closed Principle (OCP)

> **"Software entities should be open for extension, but closed for modification."**

Adding new behavior should not require changing existing, tested code.
Achieve this by depending on abstractions, not concretions.

**Common violations:**
- A long `switch` statement or chain of `if/else if` that grows each time a
  new variant is added
- A class that must be modified every time a new type of payment/report/
  notification is added

**Violation indicators (code smells):**
- A `switch` or `if/else if` on a type/kind field that is modified whenever a
  new type is introduced
- Git blame shows the same file edited every time a new variant ships
- Tests require modification in the "core" class when adding a new variant

**How to apply:**
1. Identify the axis of change (what varies)
2. Extract that variation behind an interface or abstract class
3. New variants implement the interface; existing code is untouched

**Example:**
```typescript
// ❌ Must modify every time a new discount type is added
function applyDiscount(type: string, price: number): number {
  if (type === 'percent') return price * 0.9;
  if (type === 'fixed') return price - 10;
  // ... add more here forever
}

// ✅ New discount types extend, never modify
interface DiscountStrategy {
  apply(price: number): number;
}
class PercentDiscount implements DiscountStrategy {
  apply(price: number) { return price * 0.9; }
}
class FixedDiscount implements DiscountStrategy {
  apply(price: number) { return price - 10; }
}
```

---

### L — Liskov Substitution Principle (LSP)

> **"Subtypes must be substitutable for their base types."**

If `S` is a subtype of `T`, any code that works with `T` must continue to
work correctly when given an `S`. Violations make polymorphism unreliable.

**Common violations:**
- A subclass throws `NotImplementedException` for a method the parent defines
- A subclass strengthens preconditions or weakens postconditions
- The classic "Square extends Rectangle" where `setWidth` breaks the contract

**Violation indicators (code smells):**
- Code contains `if (obj instanceof SubclassName)` to special-case a subtype's
  behavior — callers should not need to know the concrete type
- A subclass overrides a method with an empty body or a `throw`
- Subclass tests must disable or skip assertions that apply to the parent
- The parent's contract comment says "subclasses may override" but one subclass
  returns `null` where the parent guarantees a value
1. Check that every override respects the parent's invariants
2. If a subclass must "opt out" of a method, inheritance is wrong — use
   composition instead
3. Use behavioral contracts (Liskov's preconditions/postconditions/invariants)
   as a mental checklist

**Red flag:** If code contains `if (obj instanceof Subclass)` to special-case
behavior, LSP is likely violated.

---

### I — Interface Segregation Principle (ISP)

> **"Clients should not be forced to depend on interfaces they do not use."**

A fat interface that bundles unrelated methods forces implementing classes to
stub or throw for methods they don't need. Prefer small, focused interfaces.

**Common violations:**
- A `IRepository` with `find`, `save`, `delete`, `bulkImport`, and `export`
  where most consumers only need `find` + `save`
- A `IWorker` with `work()` and `eat()` implemented by a `Robot` that must
  stub `eat()`

**Violation indicators (code smells):**
- An interface implementation throws `UnsupportedOperationException` or returns
  a stub `null` / `[]` for methods it doesn't need
- A consumer imports an interface but only calls 1–2 of its 6+ methods
- Adding a method to an interface forces updates to many implementing classes
  that have no use for the new method

**How to apply:**
1. Group interface methods by *which client uses them*
2. Split into separate interfaces per use-case (read vs. write, query vs.
   command)
3. Compose multiple interfaces when an implementation legitimately needs all

**Example:**
```typescript
// ❌ Forces every consumer to depend on all methods
interface IRepository<T> {
  find(id: string): T;
  save(entity: T): void;
  delete(id: string): void;
  bulkImport(items: T[]): void;
}

// ✅ Segregated by use-case
interface IReader<T> { find(id: string): T; }
interface IWriter<T> { save(entity: T): void; }
interface IDeleter   { delete(id: string): void; }
```

---

### D — Dependency Inversion Principle (DIP)

> **"High-level modules should not depend on low-level modules. Both should
> depend on abstractions."**

Business logic should not know about database drivers, HTTP clients, or file
systems. Introduce an interface at the boundary; both sides depend on it.

**Common violations:**
- A service class that `new`s up a database connection directly
- Business logic that imports and calls `fs.readFile` or `fetch` directly
- Hard-coded class dependencies that prevent test doubles

**Violation indicators (code smells):**
- A business-logic class `import`s (or `require`s) a concrete infrastructure
  class (e.g., `PostgresRepository`, `SendGridMailer`, `StripeClient`) directly
- A class creates its own dependencies with `new` inside methods rather than
  receiving them through the constructor
- Unit tests require a real database, network, or file system because the
  dependency cannot be replaced with a test double
- The class is hard to instantiate in isolation (test setup is 30+ lines just
  to create the object under test)

**How to apply:**
1. Identify the boundary between business logic and infrastructure
2. Introduce an interface (or abstract class) owned by the business layer
3. Inject the concrete implementation at composition root (constructor injection
   preferred)

**Example:**
```typescript
// ❌ Business logic hard-depends on infrastructure
class OrderService {
  private _db = new PostgresDatabase();  // ← low-level, untestable
  placeOrder(order: Order) { this._db.save(order); }
}

// ✅ Both depend on the abstraction
interface IOrderRepository { save(order: Order): Promise<void>; }
class OrderService {
  constructor(private _repo: IOrderRepository) {}
  placeOrder(order: Order) { this._repo.save(order); }
}
```

---

## Complementary Principles

### KISS — Keep It Smart Simple

> **Prefer the smartest design that is also the simplest one that correctly
> solves the problem.**

The goal is not naive simplicity — it's *smart* simplicity: a design that is
elegant, intentional, and easy to understand without being dumbed down. Avoid
accidental complexity (complexity that crept in without purpose), not essential
complexity (complexity that is genuinely demanded by the problem).

Complexity is the primary enemy of maintainability. Every level of abstraction,
every design pattern, every framework integration is a complexity cost that must
pay for itself.

**Rules:**
- Don't introduce abstraction until you have at least two concrete cases that
  share the abstraction
- If a new developer can't understand the design in < 5 minutes, it's too complex
- Favor readable over clever
- Methods should fit on a screen; classes should have one screen of methods
- Prefer a well-named function over a comment that explains what complex code does

**Test:** Can you explain the design to a new team member in 2 sentences?

---

### DRY — Don't Repeat Yourself

> **Every piece of knowledge must have a single, unambiguous representation
> in the system.**

Duplication is not just copy-pasted code — it also means duplicated *logic*,
*intent*, or *data*. When the same fact is expressed twice, changes require
multiple edits and drift is guaranteed.

**Common violations:**
- Same validation logic in the controller *and* the service
- Status codes as raw strings in multiple places instead of an enum/constant
- Schema defined in the model *and* again in the migration *and* again in the
  DTO class

**Application:**
- Extract shared logic to a single source of truth
- Use constants/enums for repeated values
- Use shared types/schemas where possible
- *Exception*: incidental similarity (two snippets that look alike but will
  diverge over time) should NOT be unified — wait for the pattern to solidify

**Shared / utils / extensions folders:**
All `utils/`, `helpers/`, `extensions/`, `shared/`, and similar common folders
**must contain a `README.md`** that indexes the reusable units (functions,
classes, hooks, extensions) they export — with a one-line description of each.

Before implementing a new helper, utility, or shared element: **read the
relevant folder's README.md first** to check whether something equivalent
already exists. Duplication in shared code is especially harmful because it
creates competing implementations that drift apart silently.

```
utils/
├── README.md       ← index of all utilities + one-line descriptions
├── format-date.ts
├── debounce.ts
└── parse-query.ts
```

---

### YAGNI — You Aren't Gonna Need It

> **Don't implement functionality until it is actually required.**

Building for imagined future requirements adds complexity without current
benefit. Most anticipated features are never needed, or when they arrive they
look different than predicted.

**Rules:**
- Do not add extension points, plugin systems, or generics for single-use cases
- Do not parameterize where a constant would do
- Do not build a framework when a function would suffice

**Tension with OCP:** OCP says design for extension; YAGNI says don't extend
until needed. Resolution: *design for the variations you* know *are coming
(OCP); don't pre-build the variations you're* guessing *at (YAGNI).*

---

## Composition over Inheritance

> Prefer composing behaviors from small, focused objects over building deep
> inheritance hierarchies.

Inheritance creates tight coupling between parent and child. Changes to the
parent ripple through all subclasses (fragile base class problem). Composition
lets you assemble behavior at runtime and change it independently.

**When inheritance is appropriate:**
- True "is-a" relationship that won't change
- Depth ≤ 2 levels
- Subclasses genuinely extend (not override) parent behavior

**When to prefer composition:**
- "Has-a" or "uses-a" relationships
- When you'd otherwise override methods to no-op or throw
- When you need to combine behaviors from multiple sources
- When you need to swap behavior at runtime (combine with Strategy)

---

## Applying Principles Together

The principles reinforce each other in a predictable order:

1. **SRP** tells you *what to split*
2. **DIP** tells you *how to decouple the split pieces*
3. **OCP** tells you *how to extend without breaking*
4. **LSP** ensures *polymorphism stays correct*
5. **ISP** keeps *interfaces narrow and composable*
6. **KISS/YAGNI** keep you from *over-engineering the result*
