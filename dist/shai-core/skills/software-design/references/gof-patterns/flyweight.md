# Flyweight (Cache)

> **Structural Pattern** — Fits more objects into available RAM by sharing common
> parts of state between multiple objects instead of duplicating data.

---

## Intent

Flyweight is a structural design pattern that lets you support a **huge number** of
fine-grained objects efficiently by extracting shared state into a small set of
shared objects (flyweights) and passing the unique state externally.

---

## Problem

You built a particle system for a video game — bullets, missiles, shrapnel fly
across the map. Each `Particle` object stores sprite, color, coordinates, vector,
and speed. The game runs fine on your machine, but crashes on a friend's computer
after a few minutes because of **insufficient RAM**.

### The core tension

- Every particle is a separate object with lots of data.
- Most particles share the same sprite and color (e.g., all bullets look alike).
- The unique data (position, velocity) is small, but the shared data (texture,
  color) is large and duplicated thousands of times.

---

## Solution

Separate an object's state into two categories:

| Category    | Name                | Where it lives                                                      | Characteristics                                     |
| ----------- | ------------------- | ------------------------------------------------------------------- | --------------------------------------------------- |
| Shared data | **Intrinsic state** | Inside the flyweight object                                         | Read-only, immutable, identical across many objects |
| Unique data | **Extrinsic state** | Outside the flyweight — in a context object or passed as parameters | Changes per instance, per frame                     |

Instead of thousands of full `Particle` objects, you maintain just a few
**flyweight** objects (one per particle *type*: bullet, missile, shrapnel) and many
tiny **context** objects holding only the extrinsic state plus a reference to the
flyweight.

### Flyweight immutability

Because the same flyweight is shared across many contexts, its state must be
**immutable** — initialized once via the constructor, no setters, no public fields.

### Flyweight factory

A factory method manages a pool of existing flyweights. Given the desired intrinsic
state, it returns an existing matching flyweight or creates a new one. This
ensures that duplicates are never created.

---

## Structure

| #   | Role                  | Responsibility                                                                                                                                |
| --- | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | *(Prerequisite)*      | Confirm you actually have a RAM problem from too many similar objects.                                                                        |
| 2   | **Flyweight**         | Stores the intrinsic (shared) state. Immutable. Can be used in many contexts.                                                                 |
| 3   | **Context**           | Stores the extrinsic (unique) state. Holds a reference to a flyweight. Together they represent the full state of the original object.         |
| 4   | **Client**            | Calculates or stores extrinsic state. From the client's perspective, the flyweight is a template configured at runtime via method parameters. |
| 5   | **Flyweight Factory** | Manages a pool of flyweights. Returns existing ones or creates new ones. Ensures no duplicates.                                               |

Behavior can remain in the flyweight class (extrinsic state passed as method
parameters) or be moved to the context class (flyweight treated as a data object).

---

## Pseudocode

Rendering millions of trees on a forest canvas:

```text
// Flyweight — shared state (texture, color, name)
class TreeType
    field name
    field color
    field texture

    constructor TreeType(name, color, texture)

    method draw(canvas, x, y)
        // 1. Create a bitmap from type, color, texture.
        // 2. Draw it on canvas at (x, y).

// Flyweight Factory
class TreeFactory
    static field treeTypes: collection of TreeType

    static method getTreeType(name, color, texture)
        type = treeTypes.find(name, color, texture)
        if (type == null)
            type = new TreeType(name, color, texture)
            treeTypes.add(type)
        return type

// Context — unique state (coordinates) + flyweight reference
class Tree
    field x, y
    field type: TreeType

    constructor Tree(x, y, type)

    method draw(canvas)
        type.draw(canvas, this.x, this.y)

// Client
class Forest
    field trees: collection of Tree

    method plantTree(x, y, name, color, texture)
        type = TreeFactory.getTreeType(name, color, texture)
        tree = new Tree(x, y, type)
        trees.add(tree)

    method draw(canvas)
        foreach (tree in trees) do
            tree.draw(canvas)
```

### Key observations

- **Millions** of `Tree` objects exist, but they share only a handful of
  `TreeType` flyweights.
- Each `Tree` is tiny: two ints (x, y) and one reference.
- The heavy data (texture bitmaps, color palettes) exists once per type, not once
  per tree.
- `TreeFactory.getTreeType()` ensures no duplicate flyweights are created.

---

## Applicability

| Use when …                                                                             | Why                                                                     |
| -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Your program must support a **huge number** of similar objects that barely fit in RAM. | Flyweight shares common state, dramatically reducing per-object memory. |
| Objects contain **duplicate state** that can be extracted and shared.                  | Intrinsic state moves into flyweights; extrinsic state stays external.  |

### Pre-conditions

- The application needs to spawn a huge number of similar objects.
- This drains available RAM on the target device.
- The objects contain duplicate state that can be extracted.

---

## How to Implement

1. **Divide** the class's fields into:
   - **Intrinsic** — unchanging, duplicated across many objects → stays in the
     flyweight, made immutable.
   - **Extrinsic** — contextual, unique per object → moved outside.
2. Leave intrinsic fields in the class. Remove setters; initialize only via the
   constructor.
3. For each method that uses extrinsic fields, add corresponding **parameters**
   instead.
4. Create a **Flyweight Factory** that manages a pool. It checks for an existing
   match before creating a new flyweight.
5. Clients store or calculate extrinsic state and pass it when calling flyweight
   methods. Optionally, move extrinsic state + flyweight reference into a
   separate **Context** class.

---

## Pros and Cons

### Pros

| Benefit                                                  |
| -------------------------------------------------------- |
| Massive RAM savings when there are many similar objects. |

### Cons

| Drawback                                                                                         |
| ------------------------------------------------------------------------------------------------ |
| RAM savings traded for CPU cycles — extrinsic state may need recalculation on every method call. |
| Code complexity increases significantly — new team members may be confused by the split state.   |

---

## Relations with Other Patterns

| Pattern       | Relationship                                                                                                                                                                                                                   |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Composite** | Shared leaf nodes of a Composite tree can be Flyweights to save RAM.                                                                                                                                                           |
| **Facade**    | Flyweight makes lots of *little* objects; Facade makes *one* object representing an entire subsystem.                                                                                                                          |
| **Singleton** | Similar at a glance, but fundamentally different: a Singleton has *one* instance, period. Flyweight can have *multiple* instances with different intrinsic states. Singletons can be mutable; Flyweights are always immutable. |

---

## Key Takeaways

- Flyweight is purely an **optimization** — apply it only when profiling
  confirms a memory problem with many similar objects.
- The pattern separates state into **intrinsic** (shared, immutable) and
  **extrinsic** (unique, external).
- A **Flyweight Factory** is essential to manage the pool and prevent duplicate
  flyweight creation.
- Flyweight objects must be **immutable** — they're shared across contexts.
- The tradeoff is RAM for CPU: recalculating or passing extrinsic state adds
  runtime overhead.
- Common application domains: text editors (character rendering), game engines
  (particles, trees, terrain tiles), and any system with massive numbers of
  similar objects.
