# Adapter (Wrapper)

> **Structural Pattern** — Allows objects with incompatible interfaces to collaborate.

---

## Intent

Adapter is a structural design pattern that converts the interface of one class into
another interface that clients expect. It lets classes work together that couldn't
otherwise because of incompatible interfaces.

The pattern is also known as **Wrapper** because an adapter "wraps" one object to make
it look like something else entirely.

---

## Problem

Imagine you're building a stock-market monitoring app that downloads data in XML
and renders charts. You now want to integrate a third-party analytics library, but it
only accepts JSON.

You can't change the library (it's third-party), and you can't change your existing
XML pipeline without risking breakage throughout the app. You're stuck with two
systems that speak different "languages."

### The core tension

- **Your code** produces XML.
- **The library** consumes JSON.
- Neither side can be changed independently without cascading side effects.

---

## Solution

Create an **adapter** — a special object that converts the interface of one object so
that another object can understand it.

### How it works

1. The adapter implements an interface compatible with one of the existing objects
   (the **client interface**).
2. The existing object calls the adapter's methods via that interface.
3. The adapter translates the call into a format the second object understands and
   forwards it.

For the stock-market app, you create XML-to-JSON adapters for each analytics class.
Your code communicates with the library exclusively through these adapters. When an
adapter receives a call it translates XML into JSON and delegates to the wrapped
analytics object.

### Real-world analogy

A power-plug adapter: your US laptop plug doesn't fit a European wall socket. The
adapter sits between the two, exposing a US-style socket on one end and a European
plug on the other.

---

## Structure

### Object Adapter (composition-based — most common)

| #   | Role                 | Responsibility                                                           |
| --- | -------------------- | ------------------------------------------------------------------------ |
| 1   | **Client**           | Contains the existing business logic.                                    |
| 2   | **Client Interface** | A protocol other classes must follow to collaborate with the client.     |
| 3   | **Service**          | A useful but incompatible class (often third-party or legacy).           |
| 4   | **Adapter**          | Implements the client interface; wraps the service and translates calls. |

The client code is decoupled from the concrete adapter — it interacts only through
the client interface. New adapters can be introduced without touching client code.

### Class Adapter (inheritance-based)

Uses multiple inheritance to inherit from both client and service classes
simultaneously. The adaptation happens inside overridden methods. This variant is
limited to languages with multiple inheritance (e.g., C++).

---

## Pseudocode

A "square peg vs. round hole" example.

```text
class RoundHole
    constructor RoundHole(radius)
    method getRadius()
    method fits(peg: RoundPeg)
        return this.getRadius() >= peg.getRadius()

class RoundPeg
    constructor RoundPeg(radius)
    method getRadius()

class SquarePeg                          // Incompatible class
    constructor SquarePeg(width)
    method getWidth()

class SquarePegAdapter extends RoundPeg  // The Adapter
    private field peg: SquarePeg

    constructor SquarePegAdapter(peg: SquarePeg)
        this.peg = peg

    method getRadius()
        // Calculate the minimum circle that fits the square.
        return peg.getWidth() * Math.sqrt(2) / 2

// Client code
hole = new RoundHole(5)
rpeg = new RoundPeg(5)
hole.fits(rpeg)                          // true

small_sqpeg = new SquarePeg(5)
large_sqpeg = new SquarePeg(10)

// hole.fits(small_sqpeg)               // Won't compile — type mismatch

small_adapter = new SquarePegAdapter(small_sqpeg)
large_adapter = new SquarePegAdapter(large_sqpeg)
hole.fits(small_adapter)                 // true
hole.fits(large_adapter)                 // false
```

### Key observations

- `SquarePegAdapter` extends `RoundPeg`, so it "is-a" round peg from the type
  system's perspective.
- Internally it holds a `SquarePeg` and converts its geometry to a radius
  equivalent.
- The client (`RoundHole`) never knows it's dealing with a square peg.

---

## Applicability

| Use when …                                                                                                  | Why                                                                                                   |
| ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| You want to use an existing class whose interface is incompatible with the rest of your code.               | The adapter creates a middle-layer translator between your code and the legacy / third-party class.   |
| You want to reuse several existing subclasses that lack common functionality you can't add to a superclass. | Wrap the objects in an adapter that supplies the missing features dynamically (similar to Decorator). |

---

## How to Implement

1. **Identify** at least two classes with incompatible interfaces — a useful
   **service** you can't change and one or more **clients** that would benefit from
   the service.
2. **Declare** the client interface — describe how clients communicate with the
   service.
3. **Create** the adapter class that implements the client interface. Leave methods
   empty initially.
4. **Add** a field in the adapter to store a reference to the service object.
   Initialize via the constructor (or pass at call time).
5. **Implement** all client-interface methods in the adapter. The adapter should
   delegate actual work to the service, handling only interface / data-format
   conversion.
6. **Clients** should use the adapter via the client interface — this allows swapping
   adapters without modifying client code.

---

## Pros and Cons

### Pros

| Principle                 | Benefit                                                               |
| ------------------------- | --------------------------------------------------------------------- |
| **Single Responsibility** | Conversion logic is separated from primary business logic.            |
| **Open/Closed**           | New adapters can be introduced without changing existing client code. |

### Cons

| Drawback                                                                    |
| --------------------------------------------------------------------------- |
| Overall code complexity increases due to new interfaces and classes.        |
| Sometimes it's simpler to just change the service class to match your code. |

---

## Relations with Other Patterns

| Pattern                     | Relationship                                                                                                                                                      |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Bridge**                  | Designed up-front to let parts evolve independently. Adapter is added after the fact to make incompatible classes work together.                                  |
| **Decorator**               | Keeps or extends the same interface; supports recursive composition. Adapter provides a completely different interface.                                           |
| **Proxy**                   | Same interface as the service. Adapter uses a different interface. Decorator uses an enhanced interface.                                                          |
| **Facade**                  | Defines a *new* simplified interface for a subsystem. Adapter makes an *existing* interface usable. Facade wraps a subsystem; Adapter typically wraps one object. |
| **Bridge, State, Strategy** | All are composition-based with similar structures, but each solves a different problem.                                                                           |

---

## Key Takeaways

- Adapter is a "translator" that lets two incompatible interfaces collaborate
  without modifying either side.
- Prefer the **object adapter** (composition) over the class adapter (multiple
  inheritance) for broader language compatibility and flexibility.
- The pattern shines when integrating third-party libraries, legacy systems, or
  any code you cannot change.
- Adapter, Decorator, and Proxy all wrap objects but differ in *intent*: Adapter
  changes the interface, Decorator adds behavior, Proxy controls access.
- Applied correctly, Adapter respects both the Single Responsibility Principle
  (conversion is isolated) and the Open/Closed Principle (new adapters don't
  break existing code).
