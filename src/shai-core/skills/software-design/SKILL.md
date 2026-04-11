---
name: software-design
description: >
  Software design advisor: proposes component structures, applies SOLID principles, selects GoF design patterns, and enforces KISS (Keep It Smart Simple)/DRY/YAGNI. Use this skill when the user asks how to design a module, class, or system within a single application; wants to choose a design pattern; needs to refactor toward SOLID; asks about composition vs inheritance; or when the shai-architect agent needs design guidance for a new feature, service, or architectural boundary. For system design questions (how services interact), use a system design skill instead.
---

# software-design

Guides high-quality software design decisions. Given a problem or codebase context, this skill applies SOLID principles, selects appropriate GoF design patterns, and produces a concrete structural proposal with clear reasoning.

Designed to be invoked directly (`/software-design`) or called by the [shai-architect](../../agents/shai-architect.agent.md) agent as a sub-skill during design sessions.

## Scope: Software Design vs System Design

This skill covers **software design** — how classes, modules, and components within a single application are structured and interact with each other.

If the question is about **system design** — how separate services, applications, or distributed systems communicate with each other (APIs, message queues, microservices, data pipelines) — use a system design skill instead.

> Examples of system design questions: "how should our microservices communicate?", "where should we put the message queue?", "how do we handle distributed transactions across services?" — those are out of scope here.

## When to Use

- User asks "how should I design this module/class/service?"
- User wants to choose between design patterns for a problem
- Code review surfaces SOLID violations or tight coupling
- Refactoring an inheritance hierarchy into a compositional model
- Designing a new feature's internal structure before implementation
- Architect agent needs design pattern selection and principle enforcement

## Workflow

{../../../shared/\_progress.partial.md}

### Step 1: Understand the Problem

Ask (or infer from context):

- What **behavior** must this component provide?
- What are the expected **variation axes** — what is likely to change?
- What **constraints** exist (language, framework, performance, team size)?
- Is this a new design or a refactor of existing code?

Briefly confirm understanding before proceeding.

### Step 2: Apply Design Principles as a Filter

Run through the core principles to identify design pressure points.

Read [references/design-principles.md](references/design-principles.md) for the full principle reference. Apply in this order:

1. **SRP** — does each proposed class/module have a single reason to change?
2. **OCP** — can new behavior be added without modifying existing code?
3. **LSP** — if inheritance is used, do subtypes honor the parent's contract?
4. **ISP** — are interfaces focused? Is any consumer forced to depend on methods it doesn't use?
5. **DIP** — do high-level modules depend on abstractions, not concretions?
6. **KISS** — is this the smartest, simplest design that solves the problem?
7. **DRY** — is there duplicated logic that should be extracted?
8. **YAGNI** — is any proposed complexity solving a hypothetical future problem?

**Produce a list of pressure points:** e.g., "SRP violated — PaymentService handles both validation and processing", "OCP opportunity — new payment methods should be addable without touching existing code."

### Step 3: Select Design Pattern(s)

Use the decision table below to match pressure points to candidate patterns. Read [references/pattern-selection.md](references/pattern-selection.md) for the full selection guide with per-pattern tradeoffs and a full index of all 23 GoF patterns with links to deep-dive descriptions.

**Before selecting any pattern — check whether a pattern is needed at all:**

- If there is only one current concrete case with no known variation axis, a plain function or direct method call is better than a pattern (YAGNI)
- If the team would need to learn the pattern to read the code, and the benefit is marginal, skip it
- If you can't name the specific structural pressure the pattern relieves, don't apply it

> For detailed guidance, see [When NOT to Use Design Patterns](references/pattern-selection.md#when-not-to-use-design-patterns).

**Quick decision table:**

| Design Pressure                                          | Candidate Pattern(s)             |
| -------------------------------------------------------- | -------------------------------- |
| Swap algorithms / strategies at runtime                  | Strategy                         |
| React to state changes in another object                 | Observer                         |
| Create objects without specifying exact class            | Factory Method, Abstract Factory |
| Build complex objects step by step                       | Builder                          |
| Add behavior without modifying the class                 | Decorator                        |
| Simplify a complex subsystem                             | Facade                           |
| Route requests through a processing pipeline             | Chain of Responsibility          |
| Alter behavior based on internal state transitions       | State                            |
| Represent requests as objects (undo, queue, log)         | Command                          |
| Compose part-whole tree structures                       | Composite                        |
| Adapt an incompatible interface                          | Adapter                          |
| Decouple abstraction from implementation                 | Bridge                           |
| Reduce cross-class dependencies via a central hub        | Mediator                         |
| Snapshot and restore object state                        | Memento                          |
| Add operations to a class hierarchy without modifying it | Visitor                          |
| Single shared instance (use sparingly)                   | Singleton                        |

**Pattern selection rules:**

- Prefer **behavioral patterns** (Strategy, Observer, Command, State) when the axis of change is _behavior or algorithms_.
- Prefer **structural patterns** (Decorator, Adapter, Facade, Bridge) when the axis of change is _relationships between objects or interfaces_.
- Prefer **creational patterns** (Factory Method, Builder, Abstract Factory) when the axis of change is _object creation logic or families of objects_.
- Do not apply a pattern just because the problem shape vaguely fits — require a clear benefit before adding the indirection.

For each selected pattern, state:

1. **Why this pattern** — the specific pressure point it resolves
2. **What changes** — classes/interfaces added or modified
3. **Tradeoffs** — added complexity vs. gained flexibility

### Step 4: Propose the Design

Produce a structured design proposal:

```
## Design Proposal: {ComponentName}

### Principles Applied
- SRP: {what was split and why}
- OCP: {what was made extensible and how}
- DIP: {what abstraction was introduced}

### Pattern(s) Selected
- **{Pattern}**: {one-line reason}

### Component Structure
{ASCII diagram or class list with responsibilities}

### Key Interfaces / Abstractions
- `{InterfaceName}` — {what it defines}

### What Changes From Current Design (if refactoring)
- {Before} → {After}

### Tradeoffs
- {Benefit}: {explanation}
- {Cost}: {explanation}

### Recommended Next Step
{One concrete action to start implementation}
```

### Step 5: Validate the Proposal

Before presenting, self-check:

- Does each class have one primary reason to change? (SRP)
- Can new behavior be added via extension, not modification? (OCP)
- Is composition used where inheritance would be brittle? (Composition over inheritance)
- Is the design the _simplest_ one that satisfies the requirements? (KISS)
- Would a developer unfamiliar with patterns understand the structure? (Minimalism)
- Are there any abstractions that exist only to satisfy a hypothetical future? (YAGNI)

If any check fails, revise the proposal before presenting.

## Output Format

Present the design proposal using the template in Step 4. After the proposal:

- Offer to generate code stubs for the proposed interfaces and classes
- Offer to link to relevant GoF pattern details in the references

## Gotchas

- **Pattern overuse**: A simple problem with 2 variations does not need a Strategy pattern. Apply patterns when they _relieve a real pressure_, not to demonstrate pattern knowledge.
- **Inheritance depth**: More than 2 levels of inheritance is a smell. Offer composition alternatives when you see this.
- **God classes**: A class with more than 3-4 distinct responsibilities almost always violates SRP. Split it before adding features.
- **Interface segregation in dynamic languages**: In JavaScript/TypeScript, ISP often manifests as "you only use 2 of these 8 methods" — split the interface or use duck typing with narrower types.
- **DIP without DI containers**: Introducing interfaces satisfies DIP; a DI container helps wire them but is not required. Don't prescribe a specific DI framework unless the user's stack already uses one.
- **YAGNI vs extensibility**: The tension between YAGNI (don't build it until needed) and OCP (design for extension) is real. Default to YAGNI unless the variation axis is _known_ and _imminent_.
- **Singleton is almost always wrong**: It creates hidden global state and makes testing hard. Prefer dependency injection of a single shared instance instead of the Singleton pattern.
