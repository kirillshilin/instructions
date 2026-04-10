# Strategy

> **Category:** Behavioral · **Complexity:** ★☆☆  
> **Source:** [refactoring.guru](https://refactoring.guru/design-patterns/strategy)

---

## Intent

**Strategy** is a behavioral design pattern that lets you define a family of
algorithms, put each of them into a separate class, and make their objects
interchangeable.

---

## Problem

You're building a navigation app. The first version only supported driving
routes. Then you added walking routes, then public transport, then cycling, then
tourist attraction routes.

Each new algorithm doubled the size of the main navigator class. Any bug fix or
adjustment in one algorithm risked breaking others. Teamwork suffered because
everyone edited the same massive class, causing merge conflicts.

---

## Solution

The Strategy pattern extracts each algorithm into its own class (a **strategy**).
The original class (the **context**) stores a reference to a strategy and
delegates the work to it.

The context isn't responsible for selecting the algorithm — the **client** passes
the desired strategy to the context. The context works with all strategies
through the same generic interface, which exposes a single method for triggering
the encapsulated algorithm.

This makes the context independent of concrete strategies. You can add new
algorithms or modify existing ones without changing the context or other
strategies.

In the navigation example, each routing algorithm is extracted to its own class
with a `buildRoute(origin, destination)` method. The navigator doesn't care
which algorithm is selected — it just renders the resulting checkpoints on the
map.

---

## Real-World Analogy

To get to the airport, you can catch a bus, order a cab, or ride your bicycle.
These are your transportation **strategies**. You pick one based on factors like
budget and time constraints.

---

## Structure

```
┌─────────────────────────────────────┐
│            Context                  │
│  ─────────────────────────────────  │
│  - strategy: Strategy               │
│  + setStrategy(s: Strategy)         │
│  + doWork()                         │
│    → strategy.execute()             │
└─────────────────────────────────────┘
           ▲ delegates to
┌──────────┴──────────────────────────┐
│      <<interface>>                  │
│        Strategy                     │
│  ─────────────────────────────────  │
│  + execute(data)                    │
└──────────┬──────────────────────────┘
           │ implements
┌──────────┼──────────────────────────┐
│   ConcreteStrategyA                 │
│   ConcreteStrategyB                 │
│   ConcreteStrategyC                 │
│  ─────────────────────────────────  │
│  + execute(data)                    │
└─────────────────────────────────────┘
```

### Participants

1. **Context** — maintains a reference to a strategy and delegates work via the
   strategy interface. Provides a setter for runtime strategy swapping.
2. **Strategy Interface** — common to all strategies, declares the method the
   context calls.
3. **Concrete Strategies** — implement different variants of the algorithm.
4. The context calls the strategy's method each time it needs to run the
   algorithm. It doesn't know which concrete strategy it works with.
5. **Client** — creates a specific strategy and passes it to the context.

---

## Pseudocode

Arithmetic operations as interchangeable strategies.

```
interface Strategy
    method execute(a, b)

class ConcreteStrategyAdd implements Strategy
    method execute(a, b)
        return a + b

class ConcreteStrategySubtract implements Strategy
    method execute(a, b)
        return a - b

class ConcreteStrategyMultiply implements Strategy
    method execute(a, b)
        return a * b

class Context
    private strategy: Strategy

    method setStrategy(Strategy strategy)
        this.strategy = strategy

    method executeStrategy(int a, int b)
        return strategy.execute(a, b)

class ExampleApplication
    method main()
        // Create context
        context = new Context()

        // Read input
        Read first number
        Read last number
        Read desired action from user

        if action == addition
            context.setStrategy(new ConcreteStrategyAdd())
        if action == subtraction
            context.setStrategy(new ConcreteStrategySubtract())
        if action == multiplication
            context.setStrategy(new ConcreteStrategyMultiply())

        result = context.executeStrategy(firstNumber, secondNumber)
        Print result
```

The context delegates computation to whichever strategy the client selects. New
operations can be added without touching the context or existing strategies.

---

## Applicability

- **Runtime algorithm switching** — need to use different algorithm variants
  within an object and switch between them at runtime.

- **Similar classes differing only in behavior** — many classes differ only in
  how they execute the same operation. Strategy extracts the varying behavior.

- **Isolate business logic from algorithm details** — keep the context focused on
  its core responsibility; move algorithm details into strategy classes.

- **Massive conditional for algorithm selection** — a large `switch`/`if` block
  selects among algorithm variants. Extract each branch into its own strategy.

---

## How to Implement

1. Identify the algorithm that's prone to frequent changes or has multiple
   variants in the context class.
2. Declare the strategy interface common to all variants.
3. Extract each algorithm variant into its own class implementing the interface.
4. Add a strategy reference field and a setter to the context. The context works
   with the strategy only through the interface. Optionally define an interface
   for the strategy to access context data.
5. Clients associate the context with the appropriate strategy.

---

## Pros and Cons

### Pros
- **Runtime swapping** — change algorithms inside an object at runtime.
- **Isolation** — separate algorithm implementation details from consuming code.
- **Composition over inheritance** — replace algorithm inheritance hierarchies
  with strategy composition.
- **OCP** — add new strategies without changing the context.

### Cons
- **Over-engineering** — if you have only a couple of algorithms that rarely
  change, the extra classes add unnecessary complexity.
- **Client awareness** — clients must understand differences between strategies
  to select the right one.
- **Functional alternatives** — many modern languages support lambdas/closures
  that achieve the same effect without extra classes.

---

## Relations with Other Patterns

- **Bridge, State, Strategy, Adapter** — structurally similar (composition-based
  delegation). State allows concrete states to know each other and trigger
  transitions; Strategy keeps strategies independent.

- **Command vs. Strategy** — both parameterize an object with an action:
  - Command encapsulates a complete request (receiver + params), enabling
    queueing, history, and undo.
  - Strategy describes different ways to do the same thing within a single
    context.

- **Decorator** changes the *skin* (wrapping additional behavior); Strategy
  changes the *guts* (swapping the core algorithm).

- **Template Method vs. Strategy**:
  - Template Method: inheritance-based, static, class-level. Alter parts of an
    algorithm by overriding steps in subclasses.
  - Strategy: composition-based, dynamic, object-level. Swap entire algorithms
    at runtime by supplying different strategy objects.

- **State ≈ extended Strategy** — State lets concrete states drive transitions.
  Strategy keeps strategies unaware of each other.

---

## Key Takeaways

1. Strategy encapsulates "the how" — different ways to accomplish the same task
   — behind a unified interface.

2. The context remains clean: it delegates to the strategy without knowing
   which concrete algorithm is running.

3. Runtime flexibility is Strategy's main advantage — strategies can be swapped
   without recompilation or code changes.

4. In modern languages, anonymous functions and lambdas often replace simple
   strategy classes — achieving the same decoupling without the class ceremony.

5. Strategy and State are structurally identical twins. The difference is
   semantic: strategies are independent and client-selected; states are
   interconnected and self-transitioning.

6. Use Strategy when the algorithm truly varies and is selected by the client.
   If behavior changes based on internal object state, prefer the State pattern.
