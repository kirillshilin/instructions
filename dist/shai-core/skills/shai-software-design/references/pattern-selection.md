# Pattern Selection Guide

Extended reference for `shai-software-design`. Load this file when selecting
GoF design patterns or comparing pattern tradeoffs.

> Full per-pattern detail is in [`gof-patterns/`](gof-patterns/README.md) —
> read the specific pattern file when you need intent, structure, code examples,
> or tradeoffs for a particular pattern. Always check there before recommending
> a pattern to ensure you're citing the correct intent and constraints.

## Pattern Index (quick navigation)

| Pattern                 | Category   | Deep-dive file                                                            |
| ----------------------- | ---------- | ------------------------------------------------------------------------- |
| Factory Method          | Creational | [gof-patterns/factory-method.md](gof-patterns/factory-method.md)         |
| Abstract Factory        | Creational | [gof-patterns/abstract-factory.md](gof-patterns/abstract-factory.md)     |
| Builder                 | Creational | [gof-patterns/builder.md](gof-patterns/builder.md)                       |
| Prototype               | Creational | [gof-patterns/prototype.md](gof-patterns/prototype.md)                   |
| Singleton               | Creational | [gof-patterns/singleton.md](gof-patterns/singleton.md)                   |
| Adapter                 | Structural | [gof-patterns/adapter.md](gof-patterns/adapter.md)                       |
| Bridge                  | Structural | [gof-patterns/bridge.md](gof-patterns/bridge.md)                         |
| Composite               | Structural | [gof-patterns/composite.md](gof-patterns/composite.md)                   |
| Decorator               | Structural | [gof-patterns/decorator.md](gof-patterns/decorator.md)                   |
| Facade                  | Structural | [gof-patterns/facade.md](gof-patterns/facade.md)                         |
| Flyweight               | Structural | [gof-patterns/flyweight.md](gof-patterns/flyweight.md)                   |
| Proxy                   | Structural | [gof-patterns/proxy.md](gof-patterns/proxy.md)                           |
| Chain of Responsibility | Behavioral | [gof-patterns/chain-of-responsibility.md](gof-patterns/chain-of-responsibility.md) |
| Command                 | Behavioral | [gof-patterns/command.md](gof-patterns/command.md)                       |
| Iterator                | Behavioral | [gof-patterns/iterator.md](gof-patterns/iterator.md)                     |
| Mediator                | Behavioral | [gof-patterns/mediator.md](gof-patterns/mediator.md)                     |
| Memento                 | Behavioral | [gof-patterns/memento.md](gof-patterns/memento.md)                       |
| Observer                | Behavioral | [gof-patterns/observer.md](gof-patterns/observer.md)                     |
| State                   | Behavioral | [gof-patterns/state.md](gof-patterns/state.md)                           |
| Strategy                | Behavioral | [gof-patterns/strategy.md](gof-patterns/strategy.md)                     |
| Template Method         | Behavioral | [gof-patterns/template-method.md](gof-patterns/template-method.md)       |
| Visitor                 | Behavioral | [gof-patterns/visitor.md](gof-patterns/visitor.md)                       |

When a pattern shortlist is ambiguous, load the relevant deep-dive file(s) to
resolve. Each file contains: intent, structure diagram, when to use/avoid,
implementation notes, and real-world examples.

---

## Category Overview

| Category    | Focus                              | Key Patterns                                                               |
| ----------- | ---------------------------------- | -------------------------------------------------------------------------- |
| Creational  | *How objects are created*          | Factory Method, Abstract Factory, Builder, Prototype, Singleton            |
| Structural  | *How objects are composed*         | Adapter, Bridge, Composite, Decorator, Facade, Flyweight, Proxy            |
| Behavioral  | *How objects communicate and vary* | Chain of Responsibility, Command, Iterator, Mediator, Memento, Observer, State, Strategy, Template Method, Visitor |

---

## Behavioral Patterns — Selection Guide

### Strategy
**Problem:** Multiple interchangeable algorithms or behaviors for the same operation.
**Solution:** Define a family of algorithms behind a common interface; inject the
chosen one at runtime.
**SOLID link:** OCP (new strategies don't modify the context), DIP (context depends
on the abstraction).
**Use when:**
- Same operation has multiple implementations that may change independently
- Behavior needs to be swappable at runtime
- Conditionals (`if/switch`) select algorithms and grow with new variants

**Don't use when:** There is only one algorithm now and no clear variation axis.

---

### Observer
**Problem:** One object's state changes and multiple others need to react, but the
subject shouldn't know about its observers.
**Solution:** Subject publishes events; observers subscribe and react independently.
**SOLID link:** OCP (add observers without changing the subject), DIP (subject
depends on observer interface, not concretions), SRP (observer logic stays in
each observer, not in the subject).
**Use when:**
- One-to-many event broadcasting
- Decoupling UI updates from business logic
- Domain events that trigger side effects

**Watch out for:** Undefined notification order, memory leaks from unregistered
observers, cascading update chains.

---

### Command
**Problem:** Need to parameterize objects with operations, support undo/redo, or
queue / log operations.
**Solution:** Encapsulate each request as an object with an `execute()` method.
**SOLID link:** SRP (each command owns one operation), OCP (new commands don't
modify invokers).
**Use when:**
- Undo/redo is required
- Operations need to be queued or scheduled
- Actions need to be logged or audited
- UI buttons/menu items need to be decoupled from business logic

---

### State
**Problem:** An object changes behavior significantly depending on its internal
state, and state transitions need to be explicit.
**Solution:** Represent each state as a class; the object delegates behavior to
its current state object.
**SOLID link:** OCP (add new states without modifying the context), SRP (state
logic stays in state classes).
**Use when:**
- Large `switch` / `if/else if` blocks on a state field
- State transitions are non-trivial and need to be modeled explicitly
- Behavior differs substantially across states

**Distinguish from Strategy:** Both delegate to an interchangeable object. State
objects know about each other and trigger transitions; Strategy objects are
independent and don't trigger switches.

---

### Template Method
**Problem:** Multiple classes share an algorithm's skeleton but differ in specific
steps.
**Solution:** Define the skeleton in a base class with abstract steps; subclasses
override only the varying steps.
**SOLID link:** OCP (add new variants by subclassing, not modifying the template).
**Use when:**
- Multiple classes implement the same process with minor variations
- You want to enforce a fixed sequence of steps

**Prefer Strategy instead when:** You need runtime swapping or when subclassing
creates undesirable coupling.

---

### Chain of Responsibility
**Problem:** Multiple handlers might process a request; the sender shouldn't know
which one will handle it.
**Solution:** Chain handlers; each handler decides to process the request or pass
it to the next.
**SOLID link:** OCP (add handlers without modifying the chain), SRP (each handler
owns one processing rule).
**Use when:**
- Middleware pipelines (authentication, logging, rate limiting)
- Fallback chains (try cache → try DB → try API)
- Configurable multi-step processing where handlers vary at runtime

---

### Mediator
**Problem:** Many objects communicate directly, creating a complex dependency web.
**Solution:** Introduce a mediator that routes communication; objects only talk to
the mediator.
**SOLID link:** SRP (components focus on their logic; mediator handles routing),
OCP (add new components without changing existing ones).
**Use when:**
- Multiple components tightly coupled through cross-references
- Chat systems, form field interactions, flight controllers
- Reducing the M×N dependency problem to M+N

**Watch out for:** The mediator can become a God Object. Keep it as a routing
hub, not a business logic container.

---

### Memento
**Problem:** Need to capture an object's state and restore it later without
exposing its internals.
**Solution:** The originator creates a memento (opaque state snapshot); the
caretaker stores and restores it.
**Use when:**
- Undo/redo history
- Snapshot-based rollback
- Transactional state management

---

### Visitor
**Problem:** Need to perform many distinct operations on a class hierarchy without
polluting those classes with unrelated logic.
**Solution:** Define operations externally in visitor classes; elements accept
visitors via double dispatch.
**Use when:**
- Many operations on a stable hierarchy (AST processing, document traversal)
- Operations come from different concerns that change independently

**Watch out for:** Adding a new element class requires updating all visitors.
Only use when the hierarchy is stable and operations are expected to grow.

---

## Structural Patterns — Selection Guide

### Decorator
**Problem:** Need to add behavior to individual objects without affecting other
instances of the same class.
**Solution:** Wrap an object in a decorator that implements the same interface and
adds behavior before/after delegating.
**SOLID link:** OCP (extend behavior without modifying), SRP (each decorator adds
one concern).
**Use when:**
- Adding cross-cutting concerns (caching, logging, retry, compression) without
  subclassing
- Behaviors need to be composed dynamically at runtime
- Inheritance would produce a combinatorial explosion of subclasses

---

### Adapter
**Problem:** Existing code has an incompatible interface.
**Solution:** A wrapper class translates the target interface to the adaptee's
interface.
**Use when:**
- Integrating third-party libraries or legacy code with different interfaces
- Making incompatible classes collaborate without modifying either

---

### Facade
**Problem:** A complex subsystem is difficult to use directly.
**Solution:** Provide a simplified interface over the subsystem.
**SOLID link:** ISP (clients depend only on the simplified facade, not the full
subsystem).
**Use when:**
- Simplifying an API for common use cases
- Hiding subsystem complexity from client code
- Layering: the facade is the "public API" of a module

**Don't use when:** The client needs fine-grained subsystem control — a facade
trades power for simplicity.

---

### Bridge
**Problem:** A class hierarchy would explode due to multiple independent variation
axes (e.g., shape × rendering platform).
**Solution:** Split into abstraction and implementation hierarchies; abstraction
holds a reference to the implementation.
**SOLID link:** OCP, SRP — the two hierarchies can vary independently.
**Use when:**
- Two independent dimensions of variation both need subclassing
- Switching implementations at runtime is needed
- You want to avoid a Cartesian product of subclasses

---

### Composite
**Problem:** Clients need to treat individual objects and compositions uniformly
(tree structures).
**Solution:** Both leaf and composite nodes implement the same interface; composite
delegates to children.
**Use when:**
- File systems, UI component trees, organization hierarchies
- Recursive data structures where operations apply uniformly at all levels

---

### Proxy
**Problem:** Need to control access to an object (lazy loading, caching, access
control, logging).
**Solution:** A proxy implements the same interface and intercepts calls to the
real object.
**Use when:**
- Lazy initialization of expensive objects
- Remote proxy for network resources
- Protection proxy for access control
- Caching proxy for expensive operations

---

## Creational Patterns — Selection Guide

### Factory Method
**Problem:** A class needs to create objects but shouldn't specify their exact
class.
**Solution:** Delegate creation to a virtual factory method that subclasses override.
**SOLID link:** OCP (new product types via new factories), DIP (creator depends
on product interface).
**Use when:**
- The exact type of the product to create is determined by subclasses
- A class wants its subclasses to specify the objects it creates
- You need to extend a library class without subclassing it

---

### Abstract Factory
**Problem:** Need to create families of related objects that must be used together.
**Solution:** Define a factory interface for creating each member of the family;
implementations produce a consistent family.
**Use when:**
- UI toolkit families (Windows / macOS buttons, dialogs, scrollbars)
- Data access families (SQL Server / PostgreSQL repositories)
- Multiple product families that must be compatible within a family

---

### Builder
**Problem:** Constructing a complex object requires many steps, optional parts,
or different representations.
**Solution:** Separate construction steps into a Builder; a Director orchestrates
the steps.
**Use when:**
- Object construction is multi-step or order-sensitive
- The same construction process should produce different representations
- Constructor would have too many parameters (telescoping constructor smell)

---

### Singleton
**Problem:** Only one instance of a class should exist globally.
**Solution:** Private constructor + static instance.
**Warning:** Creates hidden global state, makes testing difficult, violates SRP
(manages its own lifecycle). **Prefer dependency injection of a single shared
instance** instead. Use Singleton only when truly necessary (e.g., a logging
infrastructure object or a hardware interface wrapper).

---

## When NOT to Use Design Patterns

Patterns add indirection. Indirection increases cognitive complexity — the
mental effort needed to trace what the code does. A pattern is worth applying
only when the flexibility it provides clearly outweighs its reading cost.

**Skip patterns when:**
- The problem has exactly one current variant with no imminent variation axis
  (YAGNI applies — don't abstract a single case)
- The codebase is small or short-lived (a script, a prototype, a one-off tool)
- The team would need to learn the pattern to read the code, and the benefit
  doesn't justify the onboarding cost
- A plain function, a simple `if/else`, or a direct method call solves it —
  patterns are not inherently superior to straightforward code
- The pattern would be applied "by the book" without a real structural pressure
  it relieves (pattern-for-pattern's-sake)

> **Rule of thumb:** If you can't name the specific problem the pattern solves
> in one sentence, don't apply it. Patterns are solutions to named problems,
> not decorations.

---

## Anti-Pattern Checklist

Before recommending any pattern, verify:

- [ ] The pattern solves a **real, present problem** — not a hypothetical one
- [ ] The problem cannot be solved more simply without the pattern
- [ ] The team is familiar with the pattern (or the learning cost is justified)
- [ ] The indirection cost (extra classes, interfaces) is outweighed by the
      flexibility gained
- [ ] The pattern does **not increase cognitive complexity** unnecessarily —
      a reader unfamiliar with the pattern can still trace the code's intent
- [ ] The pattern is not being used to add complexity that signals "engineering"
      to reviewers (resume-driven development)

---

## Pattern Combinations That Work Well

| Combination                    | When to Use                                                     |
| ------------------------------ | --------------------------------------------------------------- |
| Strategy + Factory Method      | Select and create the right strategy for a context             |
| Decorator + Composite          | Add behavior to tree nodes uniformly                           |
| Command + Memento              | Undo/redo: commands execute, mementos snapshot state           |
| Observer + Mediator            | Mediator implemented as a publisher-subscriber hub             |
| Abstract Factory + Builder     | Factory creates builders; builders construct complex products  |
| Facade + Adapter               | Facade over an adapted (incompatible) subsystem                |
| Template Method → Strategy     | Refactor when inheritance becomes too rigid                    |
