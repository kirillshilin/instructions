# Prototype

> **Also known as:** Clone
> **Category:** Creational
> **Source:** [refactoring.guru/design-patterns/prototype](https://refactoring.guru/design-patterns/prototype)

---

## Intent

Prototype is a creational design pattern that lets you **copy existing objects**
without making your code dependent on their classes.

Instead of constructing a new object from scratch and wiring up all its
fields, you clone a fully configured prototype.

---

## Problem

You have an object and want to create an exact copy. The obvious approach:

1. Create a new object of the same class.
2. Go through all fields of the original and copy their values.

**Problems with this approach:**

- **Private fields** — some fields may not be visible from outside the
  object, making external copying impossible.
- **Class dependency** — you must know the object's concrete class to
  call its constructor, creating a hard dependency.
- **Interface-only knowledge** — sometimes you only know the interface
  an object implements (e.g., a method parameter accepts `Shape`), not
  its concrete class, so you can't even determine which constructor
  to call.

---

## Solution

The Prototype pattern delegates cloning to the objects themselves.

1. Declare a **common interface** (or base class) with a single `clone()`
   method.
2. Each class implements `clone()` by creating a new instance of itself
   and copying all field values — including private ones (most languages
   allow objects to access private fields of same-class instances).

An object that supports cloning is called a **prototype**.

### Pre-built prototypes

You create a set of objects configured in various ways. When you need an
object like one you've already configured, you clone the matching prototype
instead of constructing a new one from scratch.

### Real-world analogy

Mitotic cell division: the original cell acts as a prototype and takes an
active role in producing the copy. The result is a pair of identical cells.

---

## Structure

### Basic implementation

1. **Prototype (interface)** — Declares the `clone()` method. In most
   cases, this is a single method.

2. **Concrete Prototype** — Implements `clone()`. Creates a new instance
   of its own class and copies all field values. May also handle edge
   cases such as cloning linked objects or untangling recursive
   dependencies.

3. **Client** — Produces a copy of any object that follows the prototype
   interface, without depending on the concrete class.

### Prototype Registry

An optional component that provides easy access to frequently-used
prototypes. Stores pre-built objects ready to be copied in a
`name → prototype` hash map (or more advanced search structure).

```
Prototype (interface)
  └─ clone(): Prototype

ConcretePrototypeA implements Prototype
ConcretePrototypeB implements Prototype

PrototypeRegistry
  ├─ items: Map<string, Prototype>
  ├─ put(name, prototype)
  └─ get(name): Prototype   // returns prototype.clone()
```

---

## Pseudocode

Cloning geometric shapes:

```text
// --- Base prototype ---
abstract class Shape
    field X: int
    field Y: int
    field color: string

    constructor Shape()
        // Regular constructor

    // Copy constructor — initializes from existing object
    constructor Shape(source: Shape)
        this()
        this.X = source.X
        this.Y = source.Y
        this.color = source.color

    abstract method clone(): Shape

// --- Concrete prototypes ---
class Rectangle extends Shape
    field width: int
    field height: int

    constructor Rectangle(source: Rectangle)
        super(source)
        this.width = source.width
        this.height = source.height

    method clone(): Shape
        return new Rectangle(this)

class Circle extends Shape
    field radius: int

    constructor Circle(source: Circle)
        super(source)
        this.radius = source.radius

    method clone(): Shape
        return new Circle(this)

// --- Client ---
class Application
    field shapes: array of Shape

    constructor Application()
        Circle circle = new Circle()
        circle.X = 10
        circle.Y = 10
        circle.radius = 20
        shapes.add(circle)

        Circle anotherCircle = circle.clone()
        shapes.add(anotherCircle)
        // anotherCircle is an exact copy of circle

        Rectangle rectangle = new Rectangle()
        rectangle.width = 10
        rectangle.height = 20
        shapes.add(rectangle)

    method businessLogic()
        Array shapesCopy = new Array of Shape
        // Clone without knowing concrete types
        foreach (s in shapes) do
            shapesCopy.add(s.clone())
        // shapesCopy contains exact duplicates
```

The key insight: `s.clone()` dispatches polymorphically — the correct
concrete `clone()` runs even though the variable is typed as `Shape`.

---

## Applicability

Use Prototype when:

1. **Your code shouldn't depend on concrete classes of objects you need
   to copy.** This is common when working with objects passed via
   interfaces from third-party code.

2. **You want to reduce the number of subclasses that only differ in
   initialization.** Instead of creating subclasses for each common
   configuration, create pre-configured prototypes and clone them.

---

## How to Implement

1. **Create the prototype interface** with a `clone()` method (or add it
   to all classes in an existing hierarchy).

2. Define an **alternative constructor** (copy constructor) that accepts
   an object of the same class and copies all fields — including private
   ones. Subclasses must call `super(source)` to let parents copy their
   private fields.

3. The `clone()` method is typically **one line**: `return new MyClass(this)`.
   Each class must override it with its own class name.

4. Optionally, create a **prototype registry** — a factory/map that stores
   frequently-used prototypes and returns clones on demand.

---

## Pros

- Clone objects **without coupling** to their concrete classes.
- Eliminate repeated initialization code — clone **pre-built prototypes**.
- Produce complex objects **more conveniently** than constructing from
  scratch.
- Get an **alternative to inheritance** for configuration presets.

## Cons

- Cloning objects with **circular references** can be very tricky.
- Deep cloning vs. shallow cloning decisions must be made carefully.

---

## Relations with Other Patterns

| Pattern                   | Relationship                                                                                                                                                                                |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Factory Method**        | Not inheritance-based (no drawbacks of inheritance), but requires complex initialization of cloned objects. Factory Method is based on inheritance but doesn't need an initialization step. |
| **Abstract Factory**      | Can use Prototype to compose factory methods instead of subclassing.                                                                                                                        |
| **Command**               | Prototype helps when you need to save copies of commands into history.                                                                                                                      |
| **Composite / Decorator** | Designs heavy on Composite and Decorator benefit from Prototype — clone complex structures instead of re-constructing them.                                                                 |
| **Memento**               | Prototype can be a simpler alternative to Memento for straightforward objects without external resource links.                                                                              |
| **Singleton**             | Abstract Factories, Builders, and Prototypes can all be implemented as Singletons.                                                                                                          |

---

## Key Takeaways

1. Prototype lets you **clone objects polymorphically** — the client
   calls `clone()` on an interface without knowing the concrete type.
2. The copy constructor pattern ensures **private fields** are properly
   copied through the class hierarchy.
3. A **prototype registry** provides a catalog of pre-configured objects
   ready to be cloned, reducing initialization boilerplate.
4. Prototype avoids subclass explosion for configuration variants and
   decouples client code from concrete product classes.
