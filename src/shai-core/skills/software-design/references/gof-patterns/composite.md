# Composite (Object Tree)

> **Structural Pattern** — Composes objects into tree structures and lets you work
> with these structures as if they were individual objects.

---

## Intent

Composite is a structural design pattern that lets you build **tree-shaped**
hierarchies of objects and then treat individual objects and compositions of objects
uniformly through a common interface.

---

## Problem

You have two kinds of objects — **Products** and **Boxes**. A Box can contain Products
and other Boxes, which in turn can hold more Products and Boxes, forming an
arbitrarily nested structure.

You need to calculate the total price of an order. The order can contain standalone
products, or boxes stuffed with products and smaller boxes.

### The core tension

- You'd have to know the concrete class of every element.
- You'd have to track nesting levels and recurse manually.
- The direct approach — unwrap everything, loop over products — becomes "too
  awkward or even impossible" in a real program.

---

## Solution

Work with Products and Boxes through a **common interface** that declares a
`totalPrice()` method:

- **Product** simply returns its price.
- **Box** iterates over its children, asks each for its price, and sums the
  results. If a child is another Box, it recurses further.

The client never needs to know whether it's dealing with a simple product or a
complex box — it calls the same method on everything.

### Real-world analogy

Military hierarchy: an army consists of divisions → brigades → platoons → squads →
soldiers. Orders flow from the top and cascade recursively down each level.

---

## Structure

| #   | Role                      | Responsibility                                                                                                                                                                   |
| --- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Component**             | Common interface for both simple and complex elements.                                                                                                                           |
| 2   | **Leaf**                  | A basic element with no sub-elements. Performs the actual work.                                                                                                                  |
| 3   | **Container (Composite)** | Has sub-elements (leaves or other containers). Delegates work to children, aggregates results. Doesn't know children's concrete classes — works through the Component interface. |
| 4   | **Client**                | Works with all elements via the Component interface. Can treat simple and complex elements identically.                                                                          |

---

## Pseudocode

A graphical editor with stackable geometric shapes:

```text
// Component interface
interface Graphic
    method move(x, y)
    method draw()

// Leaf
class Dot implements Graphic
    field x, y

    constructor Dot(x, y)
    method move(x, y)
        this.x += x
        this.y += y
    method draw()
        // Draw a dot at X and Y.

class Circle extends Dot
    field radius

    constructor Circle(x, y, radius)
    method draw()
        // Draw a circle at X and Y with radius R.

// Composite
class CompoundGraphic implements Graphic
    field children: array of Graphic

    method add(child: Graphic)
        // Add child to the array.

    method remove(child: Graphic)
        // Remove child from the array.

    method move(x, y)
        foreach (child in children) do
            child.move(x, y)

    method draw()
        // 1. For each child: draw it.
        // 2. Update the bounding rectangle.
        // 3. Draw a dashed rectangle using bounding coords.

// Client
class ImageEditor
    field all: CompoundGraphic

    method load()
        all = new CompoundGraphic()
        all.add(new Dot(1, 2))
        all.add(new Circle(5, 3, 10))

    method groupSelected(components: array of Graphic)
        group = new CompoundGraphic()
        foreach (component in components) do
            group.add(component)
            all.remove(component)
        all.add(group)
        all.draw()
```

### Key observations

- `Dot` and `Circle` are **leaves** — they do real drawing work.
- `CompoundGraphic` is the **composite** — it delegates `draw()` and `move()` to
  all children recursively.
- `ImageEditor` (client) works through the `Graphic` interface and can group/
  ungroup shapes freely.

---

## Applicability

| Use when …                                                               | Why                                                                                                                            |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| You need to implement a **tree-like** object structure.                  | Composite provides two element types (leaves and containers) sharing a common interface, enabling nested recursive structures. |
| You want client code to treat simple and complex elements **uniformly**. | All elements share a common interface — the client doesn't need to know the concrete class.                                    |

---

## How to Implement

1. Verify that your domain model can be represented as a **tree** of simple
   elements and containers.
2. **Declare** the Component interface with methods meaningful for both simple and
   complex elements.
3. **Create** leaf class(es) for simple elements.
4. **Create** a container class with:
   - An array field declared with the Component interface type.
   - `add()` / `remove()` methods for child management.
   - Methods that delegate to children and aggregate results.
5. Optionally, declare `add()` / `remove()` on the Component interface itself.
   This violates the Interface Segregation Principle (leaves ignore these) but
   gives the client the ability to treat all nodes uniformly when composing the tree.

---

## Pros and Cons

### Pros

| Principle                    | Benefit                                                             |
| ---------------------------- | ------------------------------------------------------------------- |
| **Polymorphism + recursion** | Complex tree structures can be traversed and manipulated elegantly. |
| **Open/Closed**              | New element types can be introduced without breaking existing code. |

### Cons

| Drawback                                                                                                                                                     |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Providing a truly common interface can be difficult when leaf and composite behaviors differ significantly. Over-generalizing the interface reduces clarity. |

---

## Relations with Other Patterns

| Pattern                     | Relationship                                                                                                                                                                                                                                     |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Builder**                 | Useful for constructing complex Composite trees step by step — construction can be programmed recursively.                                                                                                                                       |
| **Chain of Responsibility** | Often used with Composite — a leaf passes a request up through parent components to the root.                                                                                                                                                    |
| **Iterator**                | Can traverse Composite trees.                                                                                                                                                                                                                    |
| **Visitor**                 | Can execute an operation over an entire Composite tree.                                                                                                                                                                                          |
| **Flyweight**               | Shared leaf nodes of a Composite tree can be implemented as Flyweights to save RAM.                                                                                                                                                              |
| **Decorator**               | Similar structure (both use recursive composition). Key difference: Decorator adds responsibilities to one child; Composite sums up results of many children. They can cooperate — Decorator can extend a specific object in the Composite tree. |
| **Prototype**               | Designs heavy on Composite + Decorator benefit from Prototype — clone complex structures instead of rebuilding.                                                                                                                                  |

---

## Key Takeaways

- Composite models **part-whole hierarchies** as trees, letting clients treat
  individual objects and compositions uniformly.
- The pattern relies on a common **Component interface** that both leaves and
  containers implement.
- Recursion is the engine: containers delegate to children, which may themselves
  be containers.
- Child-management methods (`add`/`remove`) can live on the Component (easier for
  clients) or only on the Container (safer by ISP) — this is the classic
  Composite design tradeoff.
- Composite is most powerful when paired with Iterator (traversal), Visitor
  (operations), or Builder (construction).
