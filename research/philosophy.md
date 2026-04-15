# Coding Philosophy

Personal coding philosophy and principles that shape how shai tools are written,
what they enforce, and what tone they adopt. These principles permeate every
instruction, skill, and agent in the shai plugin system.

---

## Core Values

### Smart Simplicity (KISS — Keep It Smart Simple)

> **Prefer the smartest design that is also the simplest one that correctly
> solves the problem.**

This is a deliberate restatement of the classic "Keep It Simple, Stupid." The
word *smart* matters: the goal is not naivety or dumbing things down — it's
*elegant* simplicity. A design should be:

- **Intentional**: every abstraction, every class, every indirection was added
  for a clear, named reason
- **Understandable**: a new team member can follow the logic without a tour
- **Non-trivial**: complexity that the problem genuinely demands is welcome;
  accidental complexity that crept in without purpose is the enemy

**In practice:**
- Prefer a well-named function over a comment explaining what convoluted code
  does
- Prefer a direct call over a pattern that adds two layers of indirection to
  solve a single case
- Prefer a small, readable class over a clever one-liner
- When in doubt: could you explain this to a peer in 2 sentences?

**What this is NOT:**
- An excuse to write trivial or thoughtless code
- A rejection of design patterns (they are welcome when they relieve real pressure)
- A preference for "quick and dirty" over "well-designed"

---

### Pragmatism Over Dogma

Rules and principles exist to prevent real problems, not to be followed
religiously. Every rule in the shai system comes with its *reason*. If the
reason doesn't apply to a situation, the rule may not either.

- "Prefer X because Y" is always better than "ALWAYS do X"
- Escape hatches are legitimate; acknowledge when and why they apply
- Adapt to team, project, and domain constraints without abandoning fundamentals

---

### Composition Over Inheritance

Build systems from small, focused, independently testable pieces. Favor
composing behavior through dependencies over building deep inheritance
hierarchies.

- Inheritance is appropriate for true "is-a" relationships up to 2 levels deep
- Beyond that, composition almost always produces a more flexible design
- Combine with Strategy, Decorator, and other compositional patterns when
  behavior needs to vary

---

### Fail Fast

Surface errors immediately at the point of origin. Don't silently swallow
failures, don't return ambiguous values (`null`, `undefined`, `-1`) where an
error is more appropriate, and don't defer validation to a point far from the
source.

---

### Don't Repeat Yourself (But Watch for False DRY)

Every piece of *knowledge* (logic, intent, data) should have one authoritative
representation. But not all code that looks similar represents the same
knowledge — incidental similarity should not be unified prematurely.

---

### YAGNI — Build for Now, Design for Change

Don't implement what you don't need yet. Build for the known, current
requirement. Design for *known* future variation axes (OCP). Don't
pre-build for *guessed* future requirements (YAGNI).

---

## Shared Code Conventions

All `utils/`, `helpers/`, `extensions/`, `shared/`, and similar folders that
contain reusable units **must include a `README.md`** that indexes every
exported function, class, hook, or component with a one-line description.

Before adding a new utility or shared element, **read the folder's README.md**
to check for an existing equivalent. Duplication in shared code is especially
costly because competing implementations drift apart silently.

---

## Prescriptiveness Calibration

| Domain                                         | Prescriptiveness |
| ---------------------------------------------- | ---------------- |
| Security (secrets, input validation, OWASP)    | **Strict**       |
| Data integrity (migrations, schema changes)    | **Strict**       |
| Core coding standards (naming, error handling) | **Firm**         |
| Design patterns and architectural choices      | **Flexible**     |
| Style preferences (formatting, line length)    | **Flexible**     |

---

## Test Philosophy

- **AAA pattern** (Arrange, Act, Assert) for all tests
- Prefer **functional / use-case tests** that exercise 2–3 subsystems together
  over pure unit tests that test a single class in complete isolation
- Tests are **not required** during scaffolding or on non-stable architecture
- Declarative test cases in JSON data files where feasible
- Start with basic functionality; grow coverage incrementally

---

## Private Fields Convention

Use `_camelCase` for private fields. Do not use `#name` (JavaScript private
class fields). This keeps the convention consistent across TypeScript and C#.

```typescript
class OrderService {
  private _repo: IOrderRepository;
  constructor(repo: IOrderRepository) {
    this._repo = repo;
  }
}
```
