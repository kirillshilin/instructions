# Visitor

> **Category:** Behavioral · **Complexity:** ★★★  
> **Source:** [refactoring.guru](https://refactoring.guru/design-patterns/visitor)

---

## Intent

**Visitor** is a behavioral design pattern that lets you separate algorithms
from the objects on which they operate.

---

## Problem

Your team develops an app working with geographic data structured as a colossal
graph. Nodes represent cities, industries, sightseeing areas, etc. Each node
type has its own class.

You get a task to export the graph into XML. The straightforward approach — add
an `export()` method to each node class — has problems:

1. **Risk of breaking production code** — the system architect refuses to alter
   existing, stable node classes.
2. **Alien behavior** — XML export doesn't belong in classes whose primary job is
   geodata processing.
3. **Ongoing changes** — marketing will likely request more export formats later,
   forcing repeated modifications to the fragile node classes.

---

## Solution

Place the new behavior into a separate class called a **visitor**. The original
object that needs the behavior is passed to one of the visitor's methods as an
argument, giving the method access to all necessary data.

Since the behavior may differ across node types, the visitor defines a **set of
methods** — one per concrete element class:

```
class ExportVisitor
    method doForCity(City c) { ... }
    method doForIndustry(Industry f) { ... }
    method doForSightSeeing(SightSeeing ss) { ... }
```

The problem: how to call the right method? The methods have different
signatures, so you can't use simple polymorphism. Method overloading won't help
either because the exact class of a node is unknown at compile time.

### Double Dispatch

The solution uses a technique called **Double Dispatch**. Instead of the client
selecting the method, each element "accepts" a visitor and calls the correct
visiting method on it:

```
// Client code
foreach node in graph
    node.accept(exportVisitor)

// Inside City
class City
    method accept(Visitor v)
        v.doForCity(this)   // City knows it's a City

// Inside Industry
class Industry
    method accept(Visitor v)
        v.doForIndustry(this)
```

Each element tells the visitor its own type — the visitor then runs the
appropriate method. The element classes need only a trivial `accept()` method,
and after that, new behaviors can be added as new visitor classes without ever
touching the elements again.

---

## Real-World Analogy

An insurance agent visits buildings in a neighborhood. Depending on the
building type, he offers different policies:

- Residential building → medical insurance.
- Bank → theft insurance.
- Coffee shop → fire and flood insurance.

The agent (visitor) adapts his behavior to the type of building (element)
he visits.

---

## Structure

```
┌─────────────────────────────────────┐
│      <<interface>>                  │
│        Element                      │
│  ─────────────────────────────────  │
│  + accept(v: Visitor)               │
└──────────┬──────────────────────────┘
           │ implements
┌──────────┼──────────────────────────┐
│   ConcreteElementA                  │
│     method accept(v: Visitor)       │
│       → v.visitA(this)              │
│   ConcreteElementB                  │
│     method accept(v: Visitor)       │
│       → v.visitB(this)              │
└──────────┬──────────────────────────┘
           │ dispatches to
┌──────────┴──────────────────────────┐
│      <<interface>>                  │
│        Visitor                      │
│  ─────────────────────────────────  │
│  + visitA(e: ElementA)              │
│  + visitB(e: ElementB)              │
└──────────┬──────────────────────────┘
           │ implements
┌──────────┴──────────────────────────┐
│    ConcreteVisitor1                  │
│    ConcreteVisitor2                  │
│  ─────────────────────────────────  │
│  + visitA(e: ElementA)              │
│  + visitB(e: ElementB)              │
└─────────────────────────────────────┘
```

### Participants

1. **Visitor Interface** — declares visiting methods for each concrete element
   class. In overloading-capable languages they may share the same name with
   different parameter types.
2. **Concrete Visitors** — implement the visiting methods for each element type.
   Can accumulate state while traversing a structure.
3. **Element Interface** — declares `accept(visitor)`.
4. **Concrete Elements** — implement `accept()` by calling the matching visitor
   method. Even if a base class provides a default, subclasses must override to
   dispatch correctly.
5. **Client** — usually works with a collection or Composite tree. Iterates over
   elements and calls `accept()` with a visitor.

---

## Pseudocode

Adding XML export to a shape hierarchy via a visitor.

```
interface Shape
    method move(x, y)
    method draw()
    method accept(v: Visitor)

class Dot implements Shape
    method accept(v: Visitor)
        v.visitDot(this)

class Circle implements Shape
    method accept(v: Visitor)
        v.visitCircle(this)

class Rectangle implements Shape
    method accept(v: Visitor)
        v.visitRectangle(this)

class CompoundShape implements Shape
    method accept(v: Visitor)
        v.visitCompoundShape(this)

interface Visitor
    method visitDot(d: Dot)
    method visitCircle(c: Circle)
    method visitRectangle(r: Rectangle)
    method visitCompoundShape(cs: CompoundShape)

class XMLExportVisitor implements Visitor
    method visitDot(d: Dot)
        // Export dot's ID and center coordinates
    method visitCircle(c: Circle)
        // Export circle's ID, center, and radius
    method visitRectangle(r: Rectangle)
        // Export rectangle's ID, left-top, width, height
    method visitCompoundShape(cs: CompoundShape)
        // Export shape's ID and list of children's IDs

class Application
    field allShapes: array of Shape

    method export()
        exportVisitor = new XMLExportVisitor()
        foreach shape in allShapes
            shape.accept(exportVisitor)
```

Each shape delegates to the visitor via `accept()`. The visitor knows the exact
element type and can access its data to produce the XML output.

---

## Applicability

- **Operations on complex structures** — need to perform an operation on all
  elements of a complex object structure (e.g., an object tree) that have
  different classes.

- **Clean up auxiliary behaviors** — make primary classes focused on their main
  job by extracting unrelated behaviors into visitor classes.

- **Behavior relevant to only some classes** — a behavior makes sense only for
  some classes in a hierarchy. Extract it into a visitor and implement only the
  relevant visiting methods; leave others empty.

---

## How to Implement

1. Declare the visitor interface with one visiting method per concrete element
   class.
2. Declare the element interface with an `accept(visitor)` method.
3. Implement `accept()` in all concrete elements — simply redirect to the
   matching visitor method: `visitor.visitX(this)`.
4. Element classes should work with visitors only via the visitor interface.
   Visitors must be aware of all concrete element classes (as parameter types).
5. For each new behavior, create a new concrete visitor class implementing all
   visiting methods. If a visitor needs private element data, either make fields
   public or nest the visitor inside the element class.
6. The client creates visitor objects and passes them to elements via `accept()`.

---

## Pros and Cons

### Pros
- **OCP** — introduce new behaviors without changing element classes.
- **SRP** — move multiple behavior versions into one visitor class.
- **Accumulate state** — a visitor can collect information while traversing a
  complex structure (useful for analysis, reporting, transformation).

### Cons
- **All visitors must update** — adding or removing an element class forces
  changes to every existing visitor.
- **Access limitations** — visitors may lack access to private fields/methods of
  elements.

---

## Relations with Other Patterns

- **Visitor ≈ powerful Command** — Visitor objects can execute operations over
  various objects of different classes, like a Command dispatched per element
  type.

- **Visitor + Composite** — use Visitor to execute an operation over an entire
  Composite tree.

- **Visitor + Iterator** — traverse a complex data structure with an Iterator
  and execute operations on each element via a Visitor.

---

## Key Takeaways

1. Visitor separates **algorithms from data structures** — add new operations
   without modifying the classes they operate on.

2. **Double dispatch** is the core technique: the element's `accept()` redirects
   to the correct visitor method based on the element's actual type.

3. The trade-off: it's easy to add new operations (new visitors) but hard to add
   new element types (all visitors must be updated).

4. Visitor is most powerful with stable element hierarchies and frequently
   changing operations — the exact opposite of standard OOP extension.

5. Visitors can accumulate state during traversal — making them ideal for
   analysis, serialization, transformation, and reporting over heterogeneous
   object graphs.

6. The `accept()` method in elements is trivial but critical — it enables the
   type-safe dispatch that makes the whole pattern work.

7. Pairs naturally with Composite (tree traversal) and Iterator (sequential
   traversal) for navigating complex structures.
