# Structural Design Patterns — Overview

> **Category:** Structural
> **Source:** [refactoring.guru/design-patterns/structural-patterns](https://refactoring.guru/design-patterns/structural-patterns)

---

## What Are Structural Patterns?

Structural design patterns explain how to **assemble objects and classes
into larger structures** while keeping those structures **flexible and
efficient**.

They deal with relationships between entities — how classes inherit from
each other, how objects are composed, and how interfaces are adapted or
simplified. The goal is to ensure that changes in one part of the system
don't cascade through everything else.

---

## The Seven Structural Patterns

### 1. Adapter

> Allows objects with **incompatible interfaces** to collaborate.

- Acts as a translator/wrapper between two interfaces.
- Converts the interface of one class into an interface the client expects.
- Useful when integrating legacy code, third-party libraries, or systems
  with mismatched APIs.
- Two flavors: **class adapter** (multiple inheritance) and
  **object adapter** (composition/delegation).

**When to use:** You need to use an existing class but its interface
doesn't match what your code expects.

---

### 2. Bridge

> Splits a large class or a set of closely related classes into two
> separate hierarchies — **abstraction** and **implementation** — which
> can be developed independently.

- Decouples an abstraction from its implementation so both can vary.
- Replaces inheritance-based binding with composition-based binding.
- The "abstraction" defines the high-level control logic; the
  "implementation" provides the platform-specific work.

**When to use:** You want to divide and organize a monolithic class that
has several variants of some functionality (e.g., supporting multiple
platforms or databases).

---

### 3. Composite

> Lets you compose objects into **tree structures** and then work with
> these structures as if they were individual objects.

- Defines a common interface shared by both leaf objects and containers.
- Containers delegate work to their children recursively.
- Classic example: a file system where files (leaves) and directories
  (composites) share the same interface.

**When to use:** The core model of your app can be represented as a tree,
and you want clients to treat individual objects and compositions
uniformly.

---

### 4. Decorator

> Lets you attach **new behaviors** to objects by placing these objects
> inside special wrapper objects that contain the behaviors.

- Provides a flexible alternative to subclassing for extending
  functionality.
- Decorators implement the same interface as the wrapped object and
  delegate to it, adding behavior before or after delegation.
- Multiple decorators can be stacked (layered wrapping).

**When to use:** You need to add responsibilities to objects dynamically,
without affecting other objects of the same class.

---

### 5. Facade

> Provides a **simplified interface** to a library, a framework, or any
> other complex set of classes.

- Acts as a high-level entry point that hides subsystem complexity.
- Does not add new functionality — it reorganizes access to existing
  functionality behind a convenient API.
- Does not prevent direct access to the subsystem if needed.

**When to use:** You need a simple interface to a complex subsystem, or
you want to structure a subsystem into layers.

---

### 6. Flyweight

> Lets you fit **more objects into the available amount of RAM** by
> sharing common parts of state between multiple objects instead of
> keeping all data in each object.

- Separates object state into **intrinsic** (shared, immutable) and
  **extrinsic** (unique, context-dependent) parts.
- Intrinsic state is stored in shared flyweight objects; extrinsic state
  is passed in by the client or stored externally.
- Useful when an application needs a huge number of similar objects.

**When to use:** Your application creates a massive number of objects
that consume all available RAM, and much of their state can be shared.

---

### 7. Proxy

> Provides a **substitute or placeholder** for another object. A proxy
> controls access to the original object, allowing you to perform
> something before or after the request gets through.

- The proxy and the real object share the same interface, so they are
  interchangeable from the client's perspective.
- Common proxy types:
  - **Virtual proxy** — lazy initialization / on-demand loading.
  - **Protection proxy** — access control / permission checks.
  - **Remote proxy** — represents an object in a different address space.
  - **Logging proxy** — logs requests before passing them through.
  - **Caching proxy** — caches results of expensive operations.

**When to use:** You need to control or augment access to an object
without modifying the object itself.

---

## Comparison Matrix

| Pattern       | Primary purpose                          | Mechanism                                  | Key relationship                    |
| ------------- | ---------------------------------------- | ------------------------------------------ | ----------------------------------- |
| **Adapter**   | Interface compatibility                  | Wraps one interface to match another       | Existing class ↔ expected interface |
| **Bridge**    | Decouple abstraction from implementation | Separate hierarchies joined by composition | Abstraction ↔ Implementation        |
| **Composite** | Uniform treatment of tree structures     | Recursive composition                      | Container ↔ Leaf                    |
| **Decorator** | Dynamic behavior extension               | Recursive wrapping with same interface     | Core object ↔ Wrapper layers        |
| **Facade**    | Simplify complex subsystem access        | Single entry-point class                   | Client ↔ Subsystem                  |
| **Flyweight** | Memory optimization via sharing          | Separate intrinsic/extrinsic state         | Shared state ↔ Unique context       |
| **Proxy**     | Controlled/augmented access              | Same-interface stand-in                    | Client ↔ Real object                |

---

## How Structural Patterns Relate to Each Other

- **Adapter vs. Bridge:** Adapter makes unrelated interfaces work
  together after the fact; Bridge is designed up-front to let
  abstraction and implementation vary independently.
- **Adapter vs. Decorator:** Both wrap objects, but Adapter changes the
  interface while Decorator enhances behavior without changing it.
- **Composite + Decorator:** Often used together — Decorator can wrap
  components of a Composite tree.
- **Facade vs. Proxy:** Facade simplifies a complex interface; Proxy
  provides the same interface but adds control logic.
- **Flyweight + Composite:** Flyweight saves memory in large Composite
  trees by sharing leaf nodes.

---

## Key Takeaways

1. Structural patterns are about **organizing class and object
   relationships** — composition, wrapping, simplification, sharing.
2. **Adapter, Decorator, and Proxy** all wrap objects but with different
   intents: compatibility, enhancement, and access control respectively.
3. **Bridge** is a design-time decision; **Adapter** is a fix for
   after-the-fact incompatibilities.
4. **Composite** and **Flyweight** often appear together in tree-heavy
   domains.
5. **Facade** makes complexity manageable without removing the ability
   to access the full subsystem when needed.
