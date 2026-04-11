# Factory Method

> **Also known as:** Virtual Constructor
> **Category:** Creational
> **Source:** [refactoring.guru/design-patterns/factory-method](https://refactoring.guru/design-patterns/factory-method)

---

## Intent

Factory Method is a creational design pattern that provides an interface for
creating objects in a superclass, but allows subclasses to alter the type of
objects that will be created.

Instead of calling a constructor directly, a dedicated "factory method" is
responsible for object instantiation. Subclasses override this method to
change the concrete class of the product being created.

---

## Problem

Consider a logistics management application whose first version only handles
transportation by trucks. Most of the code lives inside the `Truck` class.

When sea-transportation companies request support for ships, adding a `Ship`
class is not straightforward — the rest of the codebase is tightly coupled to
`Truck`. Every addition of a new transport type would ripple through the
entire program, leading to code riddled with conditionals that switch behavior
based on the concrete transport class.

**Core tension:** direct use of `new ConcreteClass()` throughout the code
makes the system rigid, hard to extend, and violates the Open/Closed
Principle.

---

## Solution

Replace direct construction calls (`new Truck()`, `new Ship()`) with calls to
a **factory method** declared in a base creator class. Subclasses override
this method to return the appropriate product.

Key constraints:

- All products must share a **common interface** (e.g., `Transport`).
- The factory method's return type is declared as that interface.
- Client code works with the abstract product type, never with concrete
  classes.

### Logistics example

```
Creator hierarchy         Product hierarchy
─────────────────         ──────────────────
Logistics (abstract)      «interface» Transport
  ├─ RoadLogistics            ├─ Truck
  └─ SeaLogistics             └─ Ship
```

- `RoadLogistics.createTransport()` → returns `Truck`
- `SeaLogistics.createTransport()` → returns `Ship`
- Client code calls `transport.deliver()` without knowing the concrete type.

---

## Structure

The pattern involves four roles:

1. **Product (interface / abstract class)**
   Declares the interface common to all objects the factory method can
   produce. Example: `Transport` with a `deliver()` method.

2. **Concrete Products**
   Different implementations of the Product interface.
   Examples: `Truck`, `Ship`.

3. **Creator (abstract class)**
   Declares the factory method that returns a `Product`. May also contain
   core business logic that uses products. The factory method can be abstract
   (forcing subclasses to implement it) or provide a default implementation.
   Despite its name, the creator's primary job is *not* creating products —
   it usually has its own domain logic that depends on them.

4. **Concrete Creators**
   Override the factory method to return a specific Concrete Product.
   The method does not have to create a new instance every time — it may
   return cached objects, pooled objects, etc.

---

## Pseudocode

A cross-platform UI dialog example:

```text
// --- Creator ---
class Dialog
    abstract method createButton(): Button

    method render()
        Button okButton = createButton()   // factory call
        okButton.onClick(closeDialog)
        okButton.render()

// --- Concrete Creators ---
class WindowsDialog extends Dialog
    method createButton(): Button
        return new WindowsButton()

class WebDialog extends Dialog
    method createButton(): Button
        return new HTMLButton()

// --- Product interface ---
interface Button
    method render()
    method onClick(f)

// --- Concrete Products ---
class WindowsButton implements Button
    method render(a, b)   // Render in Windows style
    method onClick(f)     // Bind native OS click event

class HTMLButton implements Button
    method render(a, b)   // Return HTML representation
    method onClick(f)     // Bind web browser click event

// --- Client ---
class Application
    field dialog: Dialog

    method initialize()
        config = readApplicationConfigFile()
        if config.OS == "Windows" then
            dialog = new WindowsDialog()
        else if config.OS == "Web" then
            dialog = new WebDialog()
        else
            throw new Exception("Unknown OS")

    method main()
        this.initialize()
        dialog.render()
```

The conditional that selects the creator lives in **one place** (the
bootstrap). After that, all code works through the abstract `Dialog` /
`Button` interfaces.

---

## Applicability

Use Factory Method when:

1. **You don't know exact types ahead of time.**
   The pattern separates product construction from usage, so adding new
   product types only requires a new creator subclass — existing code stays
   untouched.

2. **You want library / framework users to extend internal components.**
   Users subclass the creator and override the factory method to inject
   their own product classes (e.g., replacing `SquareButton` with
   `RoundButton` in a UI framework).

3. **You want to reuse existing objects instead of always creating new ones.**
   A factory method can manage an object pool: check for a free object,
   return it, or create a new one if none is available — unlike a
   constructor, which must always return a new instance.

---

## How to Implement

1. Make all products follow the **same interface** with methods that make
   sense in every product.

2. Add an **empty factory method** in the creator class whose return type
   matches the product interface.

3. Replace all direct constructor calls in the creator with calls to the
   factory method. You may need a temporary parameter to control which
   product is returned.

4. Create a **creator subclass** for each product type. Override the factory
   method to instantiate the appropriate product.

5. If the product taxonomy is too large for one-subclass-per-type, reuse a
   **control parameter** in the base factory method (e.g.,
   `GroundMail.create(type)` can return `Truck` or `Train`).

6. If the base factory method becomes empty after extraction, make it
   `abstract`. Otherwise, keep the remaining logic as a default.

---

## Pros

- **Avoids tight coupling** between creator and concrete products.
- **Single Responsibility Principle** — product creation code is
  concentrated in one place.
- **Open/Closed Principle** — new product types can be introduced without
  modifying existing client code.

## Cons

- **Can increase complexity** because each new product type usually demands
  a new creator subclass. Best applied when there is already a hierarchy of
  creator classes to hook into.

---

## Relations with Other Patterns

| Pattern              | Relationship                                                                                                                                                            |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Abstract Factory** | Often built on top of a set of Factory Methods. Factory Method is simpler and more customizable via subclasses; Abstract Factory is more flexible but more complicated. |
| **Prototype**        | Not inheritance-based, so avoids its drawbacks, but requires complex initialization of the cloned object.                                                               |
| **Builder**          | Designs often evolve from Factory Method → Abstract Factory / Prototype / Builder as flexibility needs grow.                                                            |
| **Iterator**         | Factory Method can let collection subclasses return different iterator types compatible with those collections.                                                         |
| **Template Method**  | Factory Method is a specialization of Template Method — a factory method can serve as one step inside a larger template method.                                         |

---

## When to Prefer Other Creational Patterns

- **Abstract Factory** — when you need to create *families* of related
  products (e.g., Chair + Sofa + Table for a "Victorian" or "Modern"
  style).
- **Builder** — when construction involves many optional steps or complex
  configuration.
- **Prototype** — when the cost of creating an object from scratch is high
  and cloning is cheaper.
- **Singleton** — when only one instance of a class should exist
  system-wide.

---

## Key Takeaways

1. Factory Method **delegates instantiation** to subclasses — the core
   pattern is one abstract method that returns a product interface.
2. The creator's main responsibility is **business logic**, not object
   creation; the factory method is a hook point.
3. It enforces programming **to an interface**, keeping client code oblivious
   to concrete product types.
4. It is the simplest creational pattern and often the starting point before
   migrating to heavier patterns like Abstract Factory or Builder.
