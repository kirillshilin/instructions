# Chain of Responsibility (CoR)

> **Also known as:** Chain of Command  
> **Category:** Behavioral · **Complexity:** ★★☆  
> **Source:** [refactoring.guru](https://refactoring.guru/design-patterns/chain-of-responsibility)

---

## Intent

**Chain of Responsibility** is a behavioral design pattern that lets you pass
requests along a chain of handlers. Upon receiving a request, each handler
decides either to process the request or to pass it to the next handler in the
chain.

---

## Problem

Imagine you're building an online ordering system. You need sequential checks:
authentication, authorization, input validation, throttling, and caching. Each
check was originally implemented as nested conditionals inside a single method.

As new checks were added, the code became bloated and unmaintainable. Changing
one check could break others. Worse, when you tried to reuse the checks in
other parts of the system, you had to duplicate code because different
components needed different subsets of checks.

The system became hard to comprehend and expensive to maintain.

---

## Solution

The Chain of Responsibility pattern transforms each check into a standalone
object called a **handler**. Each handler has a single method that performs the
check and decides whether to process the request or pass it along.

Handlers are linked into a chain. Each handler stores a reference to the next
handler. When a request arrives, it travels through the chain until a handler
processes it or the chain ends.

### Two Variants

1. **Process-or-forward** — each handler either processes the request *or*
   forwards it. Used in sequential validation pipelines (authentication →
   authorization → validation → throttling → caching).

2. **Process-and-stop** — only one handler actually processes the request; once
   handled, propagation stops. Common in GUI event systems where a button click
   event bubbles up through containers until a component intercepts it.

Both variants rely on all handlers implementing the same interface, with a
single `handle(request)` or `execute()` method. This lets you compose chains at
runtime without coupling code to concrete handler classes.

---

## Real-World Analogy

You call tech support. The autoresponder offers generic solutions; if those fail,
you're forwarded to a live operator; if the operator can't help, you're forwarded
to an engineer. Each level decides whether it can handle the issue or must
escalate. Your call travels the chain until someone resolves it.

---

## Structure

```
┌─────────────────────────────────┐
│          <<interface>>          │
│            Handler              │
│  ───────────────────────────    │
│  + setNext(handler: Handler)   │
│  + handle(request)             │
└──────────────┬──────────────────┘
               │ implements
    ┌──────────┴──────────┐
    │    BaseHandler       │
    │  ────────────────    │
    │  - next: Handler     │
    │  + setNext(h)        │
    │  + handle(request)   │ → if next ≠ null: next.handle(request)
    └──────────┬───────────┘
               │ extends
    ┌──────────┴───────────────┐
    │     ConcreteHandlerA     │    ┌─────────────────────┐
    │     ConcreteHandlerB     │    │      Client          │
    │     ConcreteHandlerC     │    │  builds the chain    │
    └──────────────────────────┘    └─────────────────────┘
```

### Participants

1. **Handler** — declares the common interface with `handle(request)` and
   optionally `setNext(handler)`.
2. **BaseHandler** — optional abstract class that stores a `next` reference and
   implements the default forwarding behavior.
3. **Concrete Handlers** — contain the actual processing logic. Each decides
   whether to handle the request and whether to forward it.
4. **Client** — composes the chain (once or dynamically) and sends requests to
   any handler in the chain.

---

## Pseudocode

GUI contextual help: when the user presses F1, the request bubbles up from the
component under the cursor through container elements until one can display help.

```
interface ComponentWithContextualHelp
    method showHelp()

abstract class Component implements ComponentWithContextualHelp
    field tooltipText: string
    protected field container: Container

    method showHelp()
        if tooltipText != null
            // Show tooltip
        else
            container.showHelp()

abstract class Container extends Component
    protected field children: array of Component

    method add(child)
        children.add(child)
        child.container = this

class Button extends Component
    // uses default showHelp() — tooltip or forward

class Panel extends Container
    field modalHelpText: string

    method showHelp()
        if modalHelpText != null
            // Show modal help window
        else
            super.showHelp()

class Dialog extends Container
    field wikiPageURL: string

    method showHelp()
        if wikiPageURL != null
            // Open wiki page
        else
            super.showHelp()

// Client
class Application
    method createUI()
        dialog = new Dialog("Budget Reports")
        dialog.wikiPageURL = "http://..."
        panel = new Panel(0, 0, 400, 800)
        panel.modalHelpText = "This panel does..."
        ok = new Button(250, 760, 50, 20, "OK")
        ok.tooltipText = "This is an OK button that..."
        cancel = new Button(320, 760, 50, 20, "Cancel")
        panel.add(ok)
        panel.add(cancel)
        dialog.add(panel)

    method onF1KeyPress()
        component = this.getComponentAtMouseCoords()
        component.showHelp()
```

The chain forms naturally from the GUI object tree. The request (showHelp)
propagates from Button → Panel → Dialog until a component provides help content.

---

## Applicability

- **Different request types, unknown order** — your program must process various
  kinds of requests but the types and sequences are unknown beforehand.
- **Mandatory sequential execution** — handlers must execute in a specific order,
  and you can link them in any arrangement.
- **Dynamic handler set** — the set of handlers and their order should change at
  runtime via setters on handler reference fields.

---

## How to Implement

1. Declare the handler interface with a `handle(request)` method. Decide how the
   client passes request data (object vs. method arguments).
2. Create an abstract base handler with a `next` field and default forwarding.
   Consider making it immutable, or provide a setter for runtime chain mutation.
3. Create concrete handler subclasses. Each must decide:
   - Whether to process the request.
   - Whether to forward it to the next handler.
4. The client assembles chains or receives pre-built chains from factories.
5. The client can trigger any handler in the chain, not just the first.
6. Be ready for: single-link chains, unhandled requests, and requests that never
   reach the end.

---

## Pros and Cons

### Pros
- **Control processing order** — you decide the sequence of handlers.
- **Single Responsibility Principle** — decouple invoking classes from processing
  classes.
- **Open/Closed Principle** — add new handlers without modifying existing code.

### Cons
- **Unhandled requests** — some requests may fall through with no handler
  processing them.

---

## Relations with Other Patterns

- **CoR + Command + Mediator + Observer** — four ways to connect senders and
  receivers: CoR uses a dynamic chain; Command uses direct unidirectional links;
  Mediator uses a central hub; Observer uses dynamic subscriptions.

- **CoR + Composite** — leaf components pass requests up through parent
  containers, forming a natural chain from the object tree.

- **CoR handlers as Commands** — handlers can be implemented as Command objects.
  Execute different operations over the same context (request). Alternatively,
  the request itself can be a Command executed across chained contexts.

- **CoR vs. Decorator** — both use recursive composition through a series of
  objects. But CoR handlers can stop propagation and execute independently;
  Decorators extend behavior while keeping the same interface and cannot break
  the flow.

---

## Key Takeaways

1. Chain of Responsibility decouples the sender of a request from its receivers
   by giving multiple objects a chance to handle the request.

2. Two flavors: **pipeline** (all handlers process in sequence) and **exclusive**
   (first capable handler processes, rest are skipped).

3. The chain is typically built from an existing object tree (like GUI component
   hierarchy) or assembled explicitly at runtime.

4. Handlers should be self-contained and immutable when possible — accept all
   necessary data via constructor.

5. Always plan for the case when no handler processes the request: provide a
   default handler at the end of the chain or return an error/fallback.

6. Combines naturally with Composite (tree-based chains) and Command (handlers
   as command objects).
