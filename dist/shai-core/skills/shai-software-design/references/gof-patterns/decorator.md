# Decorator (Wrapper)

> **Structural Pattern** — Attaches new behaviors to objects by placing them inside
> wrapper objects that contain those behaviors.

---

## Intent

Decorator is a structural design pattern that lets you add new responsibilities to
an object dynamically by wrapping it in a special **decorator** object. It provides a
flexible alternative to subclassing for extending functionality.

---

## Problem

You're building a notification library. The initial design has a `Notifier` class
that sends emails. Users soon request SMS, Facebook, and Slack notifications too.

You create subclasses — `SMSNotifier`, `FacebookNotifier`, `SlackNotifier`. But now
a user asks: "Why can't I use *several* notification types at once?" Combining
them requires subclasses for every permutation: `SMS+Slack`, `SMS+Facebook`,
`Email+SMS+Slack`, etc.

### The core tension

- **Inheritance is static** — you can't alter behavior of a live object at
  runtime; you must replace the whole object.
- **Single parent** — most languages don't allow multiple inheritance.
- The number of combination subclasses grows **exponentially**.

---

## Solution

Use **composition** instead of inheritance. A "wrapper" (decorator) holds a
reference to a wrapped object and implements the same interface. It forwards
requests to the wrapped object and may add behavior before or after.

Because the wrapper implements the same interface, you can nest wrappers
recursively — creating a **stack** of decorators that layers behaviors on top of
each other.

### How it works for notifications

1. Leave base email behavior in the `Notifier` class.
2. Turn SMS, Facebook, and Slack into **decorators** that wrap a `Notifier`.
3. Stack them: `Slack(Facebook(SMS(Notifier)))` — each passes the message along
   and adds its own channel.

### Real-world analogy

Clothing: a sweater wraps your body, a jacket wraps the sweater, a raincoat wraps
the jacket. Each "extends" your behavior (warmth, waterproofing) without becoming
part of you, and you can remove any layer at any time.

---

## Structure

| #   | Role                   | Responsibility                                                                                                 |
| --- | ---------------------- | -------------------------------------------------------------------------------------------------------------- |
| 1   | **Component**          | Common interface for wrappers and wrapped objects.                                                             |
| 2   | **Concrete Component** | The object being wrapped. Defines base behavior.                                                               |
| 3   | **Base Decorator**     | Has a field referencing a wrapped object (typed as Component). Delegates all operations to the wrapped object. |
| 4   | **Concrete Decorator** | Extends the base decorator. Adds extra behavior before or after calling the parent method.                     |
| 5   | **Client**             | Can wrap components in multiple layers; works through the Component interface.                                 |

---

## Pseudocode

Data-source decorators that add encryption and compression transparently:

```text
// Component interface
interface DataSource
    method writeData(data)
    method readData(): data

// Concrete Component
class FileDataSource implements DataSource
    constructor FileDataSource(filename)
    method writeData(data)
        // Write data to file.
    method readData(): data
        // Read data from file.

// Base Decorator
class DataSourceDecorator implements DataSource
    protected field wrappee: DataSource

    constructor DataSourceDecorator(source: DataSource)
        wrappee = source

    method writeData(data)
        wrappee.writeData(data)

    method readData(): data
        return wrappee.readData()

// Concrete Decorator — Encryption
class EncryptionDecorator extends DataSourceDecorator
    method writeData(data)
        // 1. Encrypt data.
        // 2. Pass to wrappee.writeData().

    method readData(): data
        // 1. Get data from wrappee.readData().
        // 2. Decrypt if encrypted.
        // 3. Return result.

// Concrete Decorator — Compression
class CompressionDecorator extends DataSourceDecorator
    method writeData(data)
        // 1. Compress data.
        // 2. Pass to wrappee.writeData().

    method readData(): data
        // 1. Get data from wrappee.readData().
        // 2. Decompress if compressed.
        // 3. Return result.
```

### Client usage — simple assembly

```text
source = new FileDataSource("somefile.dat")
source.writeData(salaryRecords)
// File contains plain data.

source = new CompressionDecorator(source)
source.writeData(salaryRecords)
// File contains compressed data.

source = new EncryptionDecorator(source)
// source is now: Encryption > Compression > FileDataSource
source.writeData(salaryRecords)
// File contains compressed AND encrypted data.
```

### Client usage — runtime configuration

```text
class ApplicationConfigurator
    method configurationExample()
        source = new FileDataSource("salary.dat")
        if (enabledEncryption)
            source = new EncryptionDecorator(source)
        if (enabledCompression)
            source = new CompressionDecorator(source)

        logger = new SalaryManager(source)
        salary = logger.load()
```

### Key observations

- Each decorator wraps a `DataSource` and *is* a `DataSource`.
- Decorators can be stacked in any order at runtime.
- `SalaryManager` doesn't know or care if data is encrypted, compressed, or raw.

---

## Applicability

| Use when …                                                                                    | Why                                                                  |
| --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| You need to assign extra behaviors at **runtime** without breaking code that uses the object. | Decorators layer behaviors via composition, configurable at runtime. |
| It's awkward or impossible to extend behavior via **inheritance** (e.g., `final` classes).    | Decorator wraps the object instead of subclassing.                   |

---

## How to Implement

1. Verify your domain can be modeled as a primary component with optional layers.
2. **Declare** the Component interface with methods common to the base and all
   layers.
3. **Create** a Concrete Component with base behavior.
4. **Create** a Base Decorator with a field for the wrapped object (typed as
   Component). Delegate all operations to the wrappee.
5. Ensure all classes implement the Component interface.
6. **Create Concrete Decorators** — execute their behavior before or after
   calling the parent's method (which delegates to the wrappee).
7. Client code creates and composes decorators as needed.

---

## Pros and Cons

### Pros

| Benefit                                                        |
| -------------------------------------------------------------- |
| Extend behavior without subclassing.                           |
| Add or remove responsibilities at runtime.                     |
| Combine multiple behaviors by stacking decorators.             |
| **Single Responsibility**: each decorator handles one concern. |

### Cons

| Drawback                                                          |
| ----------------------------------------------------------------- |
| Hard to remove a *specific* wrapper from the middle of the stack. |
| Behavior may depend on the decorator stacking order.              |
| Initial configuration code can be verbose and ugly.               |

---

## Relations with Other Patterns

| Pattern                     | Relationship                                                                                                                                                                                                        |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Adapter**                 | Changes the interface entirely. Decorator keeps or extends the same interface. Decorator supports recursive composition; Adapter does not.                                                                          |
| **Proxy**                   | Similar structure but different intent. Proxy manages the service lifecycle. Decorator composition is controlled by the client.                                                                                     |
| **Chain of Responsibility** | Similar class structure (both use recursive delegation). CoR handlers can stop the chain independently; Decorators can't break the flow.                                                                            |
| **Composite**               | Both use recursive composition. Decorator wraps *one* child and adds behavior; Composite wraps *many* children and aggregates results. They cooperate: use Decorator to extend a specific node in a Composite tree. |
| **Prototype**               | Helpful when Composite + Decorator structures are complex — clone instead of rebuild.                                                                                                                               |
| **Strategy**                | Strategy changes the *guts* (algorithm); Decorator changes the *skin* (wrapping).                                                                                                                                   |

---

## Key Takeaways

- Decorator layers additional behavior onto objects at runtime via composition,
  not inheritance.
- The wrapper implements the same interface as the wrappee — making them
  interchangeable from the client's perspective.
- Stacking is the key mechanism: `D2(D1(Component))` combines both decorators'
  behaviors transparently.
- Decorator vs. Adapter vs. Proxy: all wrap objects, but Decorator adds behavior,
  Adapter converts interfaces, Proxy controls access.
- The pattern trades exploding subclass hierarchies for explicit wrapper
  assembly, which can itself become verbose but is far more flexible.
