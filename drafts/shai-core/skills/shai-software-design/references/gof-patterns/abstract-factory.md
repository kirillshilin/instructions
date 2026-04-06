# Abstract Factory

> **Category:** Creational
> **Source:** [refactoring.guru/design-patterns/abstract-factory](https://refactoring.guru/design-patterns/abstract-factory)

---

## Intent

Abstract Factory is a creational design pattern that lets you produce
**families of related objects** without specifying their concrete classes.

Where Factory Method deals with creating one product through inheritance,
Abstract Factory deals with creating **multiple related products** through
object composition.

---

## Problem

Imagine a furniture shop simulator. Your code has:

- A family of related products: `Chair`, `Sofa`, `CoffeeTable`.
- Several variants of each family: `Modern`, `Victorian`, `ArtDeco`.

You need to create furniture objects that **match each other** within a
family — a Modern chair should come with a Modern sofa and a Modern coffee
table. Customers get upset when they receive mismatched furniture.

Additionally, you don't want to modify existing code every time a new
product or family is added — furniture vendors update their catalogs often.

Direct construction with conditionals leads to tight coupling and an
explosion of `if/switch` statements scattered across the codebase.

---

## Solution

1. **Declare interfaces** for each distinct product in the family
   (e.g., `Chair`, `Sofa`, `CoffeeTable`). All variants implement these
   interfaces.

2. **Declare the Abstract Factory** — an interface with creation methods
   for every product in the family (`createChair()`, `createSofa()`,
   `createCoffeeTable()`).

3. **Create concrete factory classes**, one per variant. Each factory only
   produces products of its variant:
   - `ModernFurnitureFactory` → `ModernChair`, `ModernSofa`, `ModernCoffeeTable`
   - `VictorianFurnitureFactory` → `VictorianChair`, `VictorianSofa`, …

4. **Client code** works exclusively through abstract interfaces — both for
   factories and products. The concrete factory is selected once at
   initialization time, and from that point on all products are guaranteed
   to be compatible.

```
AbstractFactory (interface)
  ├─ createChair(): Chair
  ├─ createSofa(): Sofa
  └─ createCoffeeTable(): CoffeeTable

ModernFurnitureFactory implements AbstractFactory
VictorianFurnitureFactory implements AbstractFactory
ArtDecoFurnitureFactory implements AbstractFactory
```

---

## Structure

The pattern involves five roles:

1. **Abstract Products** — Interfaces for each distinct product type
   (`Chair`, `Sofa`, `CoffeeTable`).

2. **Concrete Products** — Variant-specific implementations grouped by
   family. Each abstract product must be implemented in every variant
   (`ModernChair`, `VictorianChair`, etc.).

3. **Abstract Factory (interface)** — Declares creation methods for all
   abstract products.

4. **Concrete Factories** — Each implements the abstract factory and
   produces only products of one variant. Guarantees compatibility within
   the family.

5. **Client** — Works with factories and products via abstract interfaces.
   Can work with any concrete factory/product variant without changes.

---

## Pseudocode

Cross-platform UI elements example:

```text
// --- Abstract Factory ---
interface GUIFactory
    method createButton(): Button
    method createCheckbox(): Checkbox

// --- Concrete Factories ---
class WinFactory implements GUIFactory
    method createButton(): Button
        return new WinButton()
    method createCheckbox(): Checkbox
        return new WinCheckbox()

class MacFactory implements GUIFactory
    method createButton(): Button
        return new MacButton()
    method createCheckbox(): Checkbox
        return new MacCheckbox()

// --- Abstract Products ---
interface Button
    method paint()

interface Checkbox
    method paint()

// --- Concrete Products ---
class WinButton implements Button
    method paint()  // Render Windows-style button

class MacButton implements Button
    method paint()  // Render macOS-style button

class WinCheckbox implements Checkbox
    method paint()  // Render Windows-style checkbox

class MacCheckbox implements Checkbox
    method paint()  // Render macOS-style checkbox

// --- Client ---
class Application
    private field factory: GUIFactory
    private field button: Button

    constructor Application(factory: GUIFactory)
        this.factory = factory

    method createUI()
        this.button = factory.createButton()

    method paint()
        button.paint()

// --- Bootstrap ---
class ApplicationConfigurator
    method main()
        config = readApplicationConfigFile()
        if config.OS == "Windows" then
            factory = new WinFactory()
        else if config.OS == "Mac" then
            factory = new MacFactory()
        else
            throw new Exception("Unknown OS")
        Application app = new Application(factory)
```

---

## Applicability

Use Abstract Factory when:

1. **Your code needs to work with families of related products** but you
   don't want it to depend on concrete classes — they may be unknown
   in advance or you want future extensibility.

2. **A class has a set of Factory Methods that blur its primary
   responsibility.** Extract them into a standalone factory or full
   Abstract Factory implementation (Single Responsibility Principle).

---

## How to Implement

1. Map out a **matrix** of product types vs. product variants.
2. Declare **abstract product interfaces** for all product types.
3. Declare the **abstract factory interface** with creation methods for
   each abstract product.
4. Implement **one concrete factory** per product variant.
5. Create **factory initialization code** somewhere in the app — select
   the factory based on configuration or environment.
6. Scan the code for **direct constructor calls** and replace them with
   calls to the appropriate factory method.

---

## Pros

- Products from a factory are **guaranteed compatible** with each other.
- **Avoids tight coupling** between concrete products and client code.
- **Single Responsibility Principle** — product creation is centralized.
- **Open/Closed Principle** — new product variants can be added without
  breaking existing client code.

## Cons

- **Increased complexity** — a lot of new interfaces and classes are
  introduced alongside the pattern.
- Adding a **new product type** (not variant) requires changing the
  abstract factory interface and all concrete factories.

---

## Relations with Other Patterns

| Pattern            | Relationship                                                                                                                                         |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Factory Method** | Many designs start with Factory Method and evolve toward Abstract Factory. Abstract Factory classes are often based on a set of Factory Methods.     |
| **Builder**        | Builder constructs complex objects step by step; Abstract Factory creates families of related objects and returns products immediately.              |
| **Prototype**      | You can use Prototype to compose methods on Abstract Factory classes instead of subclassing.                                                         |
| **Facade**         | Abstract Factory can replace Facade when you want to hide subsystem object creation from client code.                                                |
| **Bridge**         | Useful pairing when some abstractions defined by Bridge can only work with specific implementations — Abstract Factory encapsulates those relations. |
| **Singleton**      | Abstract Factories, Builders, and Prototypes can all be implemented as Singletons.                                                                   |

---

## Abstract Factory vs. Factory Method

| Aspect          | Factory Method                              | Abstract Factory                                            |
| --------------- | ------------------------------------------- | ----------------------------------------------------------- |
| **Scope**       | Creates a single product                    | Creates families of related products                        |
| **Mechanism**   | Inheritance (subclass overrides one method) | Composition (factory object with multiple creation methods) |
| **Flexibility** | Add new products via new creator subclasses | Add new variants via new factory classes                    |
| **Complexity**  | Simpler                                     | More complex                                                |

---

## Key Takeaways

1. Abstract Factory is about producing **families of compatible objects**
   so the client never mixes products from different variants.
2. The factory is selected **once at initialization**; after that, all
   creation goes through the abstract interface.
3. It enforces **consistency** within a product family while allowing
   easy substitution of the entire family.
4. It naturally evolves from Factory Method when you need to create more
   than one kind of related product.
