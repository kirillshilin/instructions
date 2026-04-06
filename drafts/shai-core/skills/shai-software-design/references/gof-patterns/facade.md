# Facade

> **Structural Pattern** — Provides a simplified interface to a library, framework,
> or any other complex set of classes.

---

## Intent

Facade is a structural design pattern that hides the complexity of a subsystem
behind a single, easy-to-use class. It doesn't add new functionality — it curates
the subsystem's features into a convenient API that covers the most common use
cases.

---

## Problem

Your code must work with dozens of objects from a sophisticated library or
framework. You need to initialize them, track dependencies, execute methods in the
correct order, and so on.

The result: your business logic becomes **tightly coupled** to third-party
implementation details, making the code hard to understand, maintain, and test.

---

## Solution

Create a **facade** — a class that provides a simple interface to a complex
subsystem. The facade may offer limited functionality compared to using the
subsystem directly, but it includes exactly the features clients actually need.

### Example

An app that uploads cat videos to social media could potentially use a
professional video-conversion library with dozens of classes. All the app needs
is `encode(filename, format)`. A `VideoConverter` facade wraps the library and
exposes just that one method.

### Real-world analogy

Ordering by phone: the operator is your facade to the ordering system, payment
gateways, and delivery services. You don't interact with each of those systems
directly — the operator handles the coordination behind a simple voice interface.

---

## Structure

| #   | Role                  | Responsibility                                                                                                                                    |
| --- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Facade**            | Provides convenient access to a particular part of the subsystem. Knows where to direct requests and how to orchestrate moving parts.             |
| 2   | **Additional Facade** | Optional extra facades for related but distinct areas — prevents one facade from becoming a god object. Can be used by clients and other facades. |
| 3   | **Complex Subsystem** | Dozens of classes with intricate initialization, ordering, and formatting requirements. Unaware of the facade's existence.                        |
| 4   | **Client**            | Uses the facade instead of calling subsystem objects directly.                                                                                    |

---

## Pseudocode

A simplified video conversion facade wrapping a complex framework:

```text
// Complex subsystem classes (third-party)
class VideoFile          // ...
class OggCompressionCodec    // ...
class MPEG4CompressionCodec  // ...
class CodecFactory       // ...
class BitrateReader      // ...
class AudioMixer         // ...

// The Facade
class VideoConverter
    method convert(filename, format): File
        file = new VideoFile(filename)
        sourceCodec = (new CodecFactory).extract(file)
        if (format == "mp4")
            destinationCodec = new MPEG4CompressionCodec()
        else
            destinationCodec = new OggCompressionCodec()
        buffer = BitrateReader.read(filename, sourceCodec)
        result = BitrateReader.convert(buffer, destinationCodec)
        result = (new AudioMixer()).fix(result)
        return new File(result)

// Client code
class Application
    method main()
        convertor = new VideoConverter()
        mp4 = convertor.convert("funny-cats-video.ogg", "mp4")
        mp4.save()
```

### Key observations

- The client interacts with **one class** and **one method** instead of six
  framework classes.
- The subsystem classes don't know the facade exists — they work with each other
  directly.
- Upgrading or swapping the framework only requires changing the facade's
  internals.

---

## Applicability

| Use when …                                                                   | Why                                                                                                                                         |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| You need a **limited but straightforward** interface to a complex subsystem. | Facade provides a shortcut to the most-used features, shielding clients from subsystem complexity.                                          |
| You want to **layer** a subsystem.                                           | Define facades as entry-points for each layer. Subsystems communicate through facades, reducing inter-layer coupling (similar to Mediator). |

---

## How to Implement

1. **Check** whether you can provide a simpler interface than the subsystem already
   offers. You're on the right track if this interface makes client code
   independent from most subsystem classes.
2. **Declare and implement** the facade class. It should redirect calls to
   appropriate subsystem objects, handling initialization and lifecycle management
   unless the client already does so.
3. **Route** all client code through the facade. This protects clients from
   subsystem changes — when the subsystem upgrades, only the facade needs
   updating.
4. If the facade grows **too big**, extract parts of its behavior into additional,
   more specialized facades.

---

## Pros and Cons

### Pros

| Benefit                                                                      |
| ---------------------------------------------------------------------------- |
| Isolates your code from subsystem complexity.                                |
| Reduces coupling between client code and third-party libraries / frameworks. |
| Simplifies common use cases to a single entry point.                         |

### Cons

| Drawback                                                                                        |
| ----------------------------------------------------------------------------------------------- |
| A facade can become a **god object** coupled to every class in the app if not carefully scoped. |

---

## Relations with Other Patterns

| Pattern              | Relationship                                                                                                                                                                                   |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Adapter**          | Adapter makes an *existing* interface usable by wrapping one object. Facade defines a *new* simplified interface for an entire subsystem.                                                      |
| **Abstract Factory** | Can substitute for Facade when you only need to hide how subsystem objects are created.                                                                                                        |
| **Flyweight**        | Flyweight makes *lots of little objects*; Facade makes *one object representing an entire subsystem*.                                                                                          |
| **Mediator**         | Similar in that both organize collaboration among tightly coupled classes. Facade simplifies access (subsystem is unaware); Mediator centralizes communication (components know the mediator). |
| **Singleton**        | A Facade can often be a Singleton — a single facade object usually suffices.                                                                                                                   |
| **Proxy**            | Both buffer a complex entity. Facade provides a *different*, simplified interface; Proxy provides the *same* interface as the service.                                                         |

---

## Key Takeaways

- Facade provides a **simplified** API over a complex subsystem — it doesn't add
  functionality; it curates and orchestrates.
- The subsystem remains fully accessible for clients that need fine-grained
  control; the facade is an optional convenience.
- Facade is one of the most commonly applied patterns, especially when
  integrating third-party libraries or legacy systems.
- Guard against the god-object anti-pattern: keep facades focused. Split into
  Additional Facades when scope grows.
- Facade ≠ Adapter: Adapter converts an existing interface; Facade creates a new,
  simplified one. Facade ≠ Proxy: Proxy has the same interface as the service.
