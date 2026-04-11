# Builder

> **Category:** Creational
> **Source:** [refactoring.guru/design-patterns/builder](https://refactoring.guru/design-patterns/builder)

---

## Intent

Builder is a creational design pattern that lets you construct complex objects
**step by step**. The pattern allows you to produce different types and
representations of an object using the same construction code.

Unlike other creational patterns that produce the product in one shot, Builder
gives fine-grained control over the construction process.

---

## Problem

Consider a complex object — like a `House` — that requires laborious,
step-by-step initialization of many fields and nested objects. The naive
approaches both have serious drawbacks:

### Approach 1 — Subclass explosion

Create a subclass for every possible configuration: `HouseWithGarage`,
`HouseWithPool`, `HouseWithGarageAndPool`, etc. The number of subclasses
grows combinatorially with every new feature.

### Approach 2 — Telescoping constructor

Create a giant constructor with all possible parameters:

```text
House(windows, doors, rooms, hasGarage, hasPool, hasStatue, hasGarden, ...)
```

Most parameters are unused most of the time, making constructor calls ugly
and hard to read. This is known as the **telescoping constructor** anti-pattern.

---

## Solution

Extract the construction code into separate objects called **builders**.

The pattern organizes construction into a set of steps (`buildWalls`,
`buildDoor`, `buildRoof`, etc.). To create an object, you execute only the
steps you need — you don't have to call all of them.

### Multiple builders

Different builder classes can implement the same interface but build in
different ways. For example:
- `WoodHouseBuilder` — builds everything from wood and glass.
- `StoneHouseBuilder` — builds everything from stone and iron.
- `GoldHouseBuilder` — builds everything from gold and diamonds.

Calling the same set of steps produces different results.

### Director

A **Director** defines the order in which to execute building steps. It
encapsulates specific construction routines (e.g., "build a sports car",
"build an SUV") so they can be reused. The director is optional — the
client can call building steps directly.

```
Builder (interface)
  ├─ reset()
  ├─ buildStepA()
  ├─ buildStepB()
  └─ buildStepC()

ConcreteBuilder1 implements Builder  → produces Product1
ConcreteBuilder2 implements Builder  → produces Product2

Director
  └─ construct(builder)  // calls steps in a specific order
```

---

## Structure

1. **Builder (interface)** — Declares construction steps common to all
   builder types (`reset`, `buildWalls`, `buildDoor`, etc.).

2. **Concrete Builders** — Provide different implementations of the
   construction steps. May produce products that don't share a common
   interface (e.g., `Car` vs. `Manual`).

3. **Products** — The resulting objects. Products from different builders
   don't need to belong to the same class hierarchy.

4. **Director** — Defines the order of construction steps. Creates and
   reuses specific configurations. Knows nothing about concrete builders
   or products.

5. **Client** — Associates a builder with the director, triggers
   construction, and retrieves the result from the builder (not the
   director, since products may have different types).

---

## Pseudocode

Building cars and their corresponding user manuals:

```text
// --- Products (no common interface needed) ---
class Car
    // GPS, trip computer, seats, engine, etc.

class Manual
    // Describes every feature of the car

// --- Builder interface ---
interface Builder
    method reset()
    method setSeats(...)
    method setEngine(...)
    method setTripComputer(...)
    method setGPS(...)

// --- Concrete Builders ---
class CarBuilder implements Builder
    private field car: Car

    constructor CarBuilder()
        this.reset()

    method reset()
        this.car = new Car()

    method setSeats(...)      // Install seats
    method setEngine(...)     // Install engine
    method setTripComputer(.) // Install trip computer
    method setGPS(...)        // Install GPS

    method getProduct(): Car
        product = this.car
        this.reset()
        return product

class CarManualBuilder implements Builder
    private field manual: Manual

    constructor CarManualBuilder()
        this.reset()

    method reset()
        this.manual = new Manual()

    method setSeats(...)      // Document seat features
    method setEngine(...)     // Add engine instructions
    method setTripComputer(.) // Add trip computer instructions
    method setGPS(...)        // Add GPS instructions

    method getProduct(): Manual
        // Return manual and reset

// --- Director ---
class Director
    method constructSportsCar(builder: Builder)
        builder.reset()
        builder.setSeats(2)
        builder.setEngine(new SportEngine())
        builder.setTripComputer(true)
        builder.setGPS(true)

    method constructSUV(builder: Builder)
        // ... different configuration

// --- Client ---
class Application
    method makeCar()
        director = new Director()

        CarBuilder builder = new CarBuilder()
        director.constructSportsCar(builder)
        Car car = builder.getProduct()

        CarManualBuilder manualBuilder = new CarManualBuilder()
        director.constructSportsCar(manualBuilder)
        Manual manual = manualBuilder.getProduct()
```

The same director and same step sequence produce a `Car` from one builder
and a `Manual` from another.

---

## Applicability

Use Builder when:

1. **You want to eliminate a "telescoping constructor."**
   Builder lets you construct objects step by step, using only the steps
   you need. No more cramming dozens of parameters into constructors.

2. **You want to create different representations of some product.**
   The base builder interface defines all possible steps; concrete
   builders implement them differently. A director guides the order.

3. **You need to construct Composite trees or other complex objects.**
   Builder lets you defer or recursively call construction steps,
   building an object tree piece by piece without exposing the
   unfinished product.

---

## How to Implement

1. Define **common construction steps** for all product representations.
2. Declare these steps in a **base Builder interface**.
3. Create a **concrete builder** for each product representation.
   Include a `getResult()` method — it can't go in the interface if
   products don't share a common type.
4. Consider creating a **Director class** to encapsulate common
   construction routines.
5. The **client** creates a builder, optionally passes it to a director,
   triggers construction, then retrieves the result from the builder.
6. The result is fetched from the **builder** (not the director), since
   the director doesn't know about concrete product types.

---

## Pros

- **Step-by-step construction** — defer steps, run them conditionally,
  or call them recursively.
- **Same construction code** can produce different representations.
- **Single Responsibility Principle** — complex construction logic is
  isolated from business logic.

## Cons

- **Increased complexity** — the pattern introduces multiple new classes
  (builder interface, concrete builders, optional director).

---

## Relations with Other Patterns

| Pattern              | Relationship                                                                                                          |
| -------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **Factory Method**   | Designs often start with Factory Method and evolve toward Builder as complexity grows.                                |
| **Abstract Factory** | Abstract Factory creates families of related objects immediately; Builder constructs one complex object step by step. |
| **Composite**        | Builder is useful for constructing complex Composite trees because steps can work recursively.                        |
| **Bridge**           | Director plays the abstraction role; different builders act as implementations.                                       |
| **Singleton**        | Builders can be implemented as Singletons.                                                                            |

---

## Builder vs. Other Creational Patterns

| Aspect             | Builder                                         | Abstract Factory                 | Factory Method                       |
| ------------------ | ----------------------------------------------- | -------------------------------- | ------------------------------------ |
| **Focus**          | Step-by-step construction of one complex object | Families of related objects      | Single product via subclass override |
| **Product return** | After all steps complete                        | Immediately                      | Immediately                          |
| **Product types**  | Products can be completely unrelated            | Products share family interfaces | Products share a common interface    |

---

## Key Takeaways

1. Builder separates **construction** from **representation** — the same
   process can create different products.
2. The Director is **optional** but useful for encapsulating reusable
   construction recipes.
3. The `getResult()` method lives on the **builder**, not the director,
   because different builders may produce unrelated product types.
4. Builder shines when objects have **many optional parts** or require
   a specific **sequence of initialization steps**.
