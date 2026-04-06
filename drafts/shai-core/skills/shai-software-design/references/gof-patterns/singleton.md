# Singleton

> **Category:** Creational
> **Source:** [refactoring.guru/design-patterns/singleton](https://refactoring.guru/design-patterns/singleton)

---

## Intent

Singleton is a creational design pattern that ensures a class has **only one
instance** while providing a **global access point** to that instance.

It is the simplest GoF pattern structurally, but also one of the most
controversial due to its impact on testability and coupling.

---

## Problem

The Singleton pattern solves two problems at the same time (which itself
violates the Single Responsibility Principle):

### 1. Ensure a single instance

Why limit instantiation? The most common reason is to control access to a
**shared resource** — a database connection, a file system handle, a
configuration registry, a logging service, etc.

With a regular constructor, calling `new` always creates a fresh object.
There is no built-in way to return an existing instance instead.

### 2. Provide a global access point

Like a global variable, a Singleton lets you access an object from anywhere
in the program. Unlike a global variable, a Singleton **protects the
instance from being overwritten** by other code.

---

## Solution

All Singleton implementations share two steps:

1. **Make the default constructor private** — prevents other code from
   using `new` with the Singleton class.

2. **Create a static creation method** (`getInstance()`) that acts as the
   constructor. Internally it calls the private constructor on the first
   call, caches the result in a static field, and returns the cached
   instance on every subsequent call.

```text
class Singleton
    private static field instance: Singleton

    private constructor Singleton()
        // initialization

    public static method getInstance(): Singleton
        if instance == null then
            instance = new Singleton()
        return instance
```

### Real-world analogy

A country's government: regardless of who the officials are, "The
Government of X" is a single global access point that identifies the group
in charge. You can't create a second government.

---

## Structure

1. **Singleton class** — Declares a **static method** `getInstance()`
   that returns the same instance of its own class every time.

2. The **constructor is private** — `getInstance()` is the only way to
   obtain the object.

That's it — the pattern has the simplest structure of all GoF patterns.

---

## Pseudocode

A database connection as a Singleton:

```text
class Database
    private static field instance: Database

    private constructor Database()
        // Actual connection to database server

    public static method getInstance(): Database
        if (Database.instance == null) then
            acquireThreadLock() and then
                // Double-checked locking
                if (Database.instance == null) then
                    Database.instance = new Database()
        return Database.instance

    public method query(sql)
        // All queries go through this method
        // Can add throttling or caching logic here

// --- Client ---
class Application
    method main()
        Database foo = Database.getInstance()
        foo.query("SELECT ...")

        Database bar = Database.getInstance()
        bar.query("SELECT ...")
        // foo and bar reference the SAME object
```

### Thread safety

Naive implementations break in multithreaded environments — two threads
can simultaneously pass the `null` check and create two instances. The
**double-checked locking** pattern (shown above) or **language-level
guarantees** (e.g., static initialization in C#/Java) solve this.

---

## Applicability

Use Singleton when:

1. **A class should have exactly one instance** available to all clients.
   For example, a single database object shared across the program.
   Singleton disables all other means of creating objects except
   `getInstance()`.

2. **You need stricter control over global variables.**
   Unlike a global variable, Singleton guarantees that nothing except
   the Singleton class itself can replace the cached instance. You can
   adjust the `getInstance()` method to allow a controlled number of
   instances if needed.

---

## How to Implement

1. Add a **private static field** to the class for storing the singleton
   instance.
2. Declare a **public static method** `getInstance()` for obtaining the
   singleton.
3. Implement **lazy initialization** inside the static method — create
   the object on first call, cache it, return the cache on subsequent
   calls.
4. Make the **constructor private**. The static method can still call it,
   but external code cannot.
5. Replace all direct `new` calls in client code with calls to
   `getInstance()`.

---

## Pros

- **Guaranteed single instance** of a class.
- **Global access point** to that instance.
- **Lazy initialization** — the object is created only when first needed.

## Cons

- **Violates the Single Responsibility Principle** — the class manages
  both its core purpose and its own lifetime/instantiation.
- **Can mask bad design** — components knowing too much about each other,
  tight coupling hidden behind a convenient global.
- **Multithreading issues** — requires special handling
  (double-checked locking, static initialization) to prevent multiple
  instances.
- **Difficult to unit test** — many test frameworks rely on inheritance
  to produce mocks, but the Singleton constructor is private and static
  methods can't be overridden in most languages.
- **Service Locator / DI alternative** — in modern applications,
  dependency injection containers often manage singletons more cleanly.

---

## Relations with Other Patterns

| Pattern                                    | Relationship                                                                                                                                                                          |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Facade**                                 | A Facade can often be made a Singleton since one facade is usually enough.                                                                                                            |
| **Flyweight**                              | Similar to Singleton but with key differences: Flyweight can have multiple instances with different intrinsic state; Flyweight objects are immutable while Singletons can be mutable. |
| **Abstract Factory / Builder / Prototype** | All three can be implemented as Singletons.                                                                                                                                           |

---

## Singleton in Modern Practice

Singleton is often considered an **anti-pattern** in modern software
engineering because:

- It introduces **hidden global state**.
- It makes **unit testing** hard (can't easily swap implementations).
- It tightly couples components to a **concrete class**.

### Preferred alternatives

| Approach                  | How it helps                                                                                                                                    |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **Dependency Injection**  | Register a service as "singleton-scoped" in a DI container; consumers receive it via constructor injection without coupling to a static method. |
| **Module-level instance** | In languages with module systems (Python, JS/TS), export a single instance from a module — the module system ensures it's created once.         |
| **Static class**          | If no instance state is needed, use a static/utility class instead.                                                                             |

Despite the criticism, Singleton remains valid for scenarios where:
- Only one instance **physically makes sense** (e.g., hardware driver).
- The overhead of a DI framework is unjustified.
- The codebase is small and testing concerns are minimal.

---

## Key Takeaways

1. Singleton = **private constructor** + **static getInstance()** method.
2. Thread safety must be explicitly handled in concurrent environments.
3. It solves a real problem (single instance + global access) but at the
   cost of testability and coupling.
4. Prefer **DI-managed singletons** in modern applications over the
   classic GoF Singleton when possible.
