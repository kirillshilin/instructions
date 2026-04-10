# Behavioral Design Patterns — Overview

> **Category:** Behavioral · **Source:** [refactoring.guru](https://refactoring.guru/design-patterns/behavioral-patterns)

---

## What Are Behavioral Patterns?

Behavioral design patterns are concerned with **algorithms** and the **assignment
of responsibilities between objects**. They describe not just the objects or
classes but the patterns of communication between them. These patterns characterize
complex control flow that is difficult to follow at runtime, shifting focus away
from flow of control to the way objects are interconnected.

Where creational patterns focus on *instantiation* and structural patterns on
*composition*, behavioral patterns focus on **how objects distribute work**, how a
request travels through a system, and how to define flexible communication
protocols that are easy to extend.

---

## The 10 Behavioral Patterns at a Glance

| #   | Pattern                 | Intent                                                                                      |
| --- | ----------------------- | ------------------------------------------------------------------------------------------- |
| 1   | Chain of Responsibility | Pass a request along a dynamic chain of handlers until one processes it.                    |
| 2   | Command                 | Encapsulate a request as an object, enabling undo, queuing, and logging of operations.      |
| 3   | Iterator                | Traverse elements of a collection without exposing its underlying representation.           |
| 4   | Mediator                | Reduce chaotic dependencies by forcing objects to communicate only via a mediator.          |
| 5   | Memento                 | Save and restore an object's previous state without revealing implementation details.       |
| 6   | Observer                | Define a subscription mechanism to notify multiple objects about events.                    |
| 7   | State                   | Let an object alter its behavior when its internal state changes (appears to change class). |
| 8   | Strategy                | Define a family of algorithms, encapsulate each, and make them interchangeable.             |
| 9   | Template Method         | Define the skeleton of an algorithm in a superclass; subclasses override specific steps.    |
| 10  | Visitor                 | Separate algorithms from the objects on which they operate using double dispatch.           |

---

## Grouping by Concern

### Sender–Receiver Communication

Four patterns address different ways of **connecting senders and receivers** of
requests:

| Pattern                 | How It Connects                                                       |
| ----------------------- | --------------------------------------------------------------------- |
| Chain of Responsibility | Passes a request sequentially along a dynamic chain until handled.    |
| Command                 | Establishes unidirectional connections between senders and receivers. |
| Mediator                | Eliminates direct connections; objects talk only through a mediator.  |
| Observer                | Receivers dynamically subscribe to and unsubscribe from events.       |

### Encapsulating What Varies

| Pattern         | What It Encapsulates                                          |
| --------------- | ------------------------------------------------------------- |
| Strategy        | Interchangeable algorithms behind a common interface.         |
| State           | State-dependent behavior in separate state classes.           |
| Command         | A request as a first-class object (params, receiver, action). |
| Template Method | Variant steps within a fixed algorithmic skeleton.            |

### Traversal & Operations on Structures

| Pattern  | Role                                                                       |
| -------- | -------------------------------------------------------------------------- |
| Iterator | Provides sequential access to a collection's elements.                     |
| Visitor  | Executes operations over elements of a structure without changing classes. |

---

## Comparison Matrix

| Criterion             | CoR | Cmd | Itr | Med | Mem | Obs | Sta | Str | TM  | Vis |
| --------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Encapsulates request  |     | ✓   |     |     |     |     |     |     |     |     |
| Decouples sender/recv | ✓   | ✓   |     | ✓   |     | ✓   |     |     |     |     |
| Supports undo/redo    |     | ✓   |     |     | ✓   |     |     |     |     |     |
| Uses inheritance      |     |     |     |     |     |     |     |     | ✓   |     |
| Uses composition      | ✓   | ✓   | ✓   | ✓   |     | ✓   | ✓   | ✓   |     | ✓   |
| Runtime flexibility   | ✓   | ✓   | ✓   |     |     | ✓   | ✓   | ✓   |     | ✓   |
| Object tree traversal | ✓   |     | ✓   |     |     |     |     |     |     | ✓   |
| SRP benefit           | ✓   | ✓   | ✓   | ✓   |     |     | ✓   |     |     | ✓   |
| OCP benefit           | ✓   | ✓   | ✓   | ✓   |     | ✓   | ✓   | ✓   |     | ✓   |

> **CoR** = Chain of Responsibility · **Cmd** = Command · **Itr** = Iterator ·
> **Med** = Mediator · **Mem** = Memento · **Obs** = Observer · **Sta** = State ·
> **Str** = Strategy · **TM** = Template Method · **Vis** = Visitor

---

## Common Relationships & Combinations

1. **Command + Memento** — Commands perform operations while mementos snapshot
   state before execution, enabling robust undo/redo.

2. **Iterator + Visitor** — Iterator traverses a complex structure; Visitor
   executes an operation on each element, even across different classes.

3. **Iterator + Composite** — Iterators naturally traverse Composite trees.

4. **Mediator ≈ Observer (implementation)** — A popular Mediator implementation
   uses the Observer pattern internally (mediator as publisher, components as
   subscribers).

5. **State ≈ Strategy (structure)** — Both use composition to delegate behavior.
   Strategy objects are independent; State objects can trigger transitions.

6. **Template Method ↔ Strategy** — Template Method uses inheritance (static,
   class-level). Strategy uses composition (dynamic, object-level).

7. **Chain of Responsibility + Composite** — Leaf components pass requests up
   through parent components in the object tree.

8. **Command + Strategy** — Both parameterize an object with an action, but
   Command encapsulates a complete request (including receiver) while Strategy
   swaps algorithms within a single context.

---

## When to Choose Which Pattern

| You Need To…                                             | Consider                |
| -------------------------------------------------------- | ----------------------- |
| Process requests through a dynamic pipeline              | Chain of Responsibility |
| Turn operations into queueable / undoable objects        | Command                 |
| Abstract traversal of custom data structures             | Iterator                |
| Eliminate a web of cross-dependencies                    | Mediator                |
| Capture and restore object state (snapshots)             | Memento                 |
| Broadcast events to dynamically changing subscribers     | Observer                |
| Change behavior based on internal state transitions      | State                   |
| Swap algorithms at runtime behind a common interface     | Strategy                |
| Define an algorithm skeleton with customizable steps     | Template Method         |
| Add operations to a class hierarchy without modifying it | Visitor                 |

---

## Common Pitfalls

- **Overusing Mediator** — it can become a God Object that knows too much.
- **Chain without a fallback** — requests may reach the end of the chain
  unhandled; always plan a default handler or error path.
- **Memento RAM overhead** — frequent snapshots of large objects consume memory
  quickly; consider incremental snapshots or inverse commands.
- **Observer ordering** — subscribers are typically notified in undefined order;
  don't build logic that depends on notification sequence.
- **Template Method rigidity** — steps locked in a base class can violate LSP if
  subclasses suppress or fundamentally change a step.
- **Visitor element changes** — adding a new element class forces changes to
  every visitor implementation.

---

## Key Takeaways

1. Behavioral patterns focus on **communication protocols** between objects,
   defining who sends, who receives, and how messages flow.

2. The **four sender–receiver patterns** (CoR, Command, Mediator, Observer) are
   the most commonly confused — each provides a distinct communication topology.

3. **State and Strategy** are structurally identical; the difference is semantic
   (state transitions vs. algorithm selection).

4. **Template Method** is the only behavioral pattern that relies primarily on
   **inheritance**; all others favor **composition**.

5. **Visitor** is the most powerful but most rigid — it trades ease of adding
   operations for difficulty in adding new element types.

6. Many behavioral patterns combine naturally (Command + Memento for undo,
   Iterator + Visitor for tree operations, Mediator via Observer).

7. Choose based on the axis of change: *what varies* (Strategy), *what state
   you're in* (State), *who handles the request* (CoR), or *what operation to
   perform* (Command/Visitor).
