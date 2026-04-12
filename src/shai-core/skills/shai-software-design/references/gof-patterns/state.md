# State

> **Category:** Behavioral · **Complexity:** ★☆☆  
> **Source:** [refactoring.guru](https://refactoring.guru/design-patterns/state)

---

## Intent

**State** is a behavioral design pattern that lets an object alter its behavior
when its internal state changes. It appears as if the object changed its class.

---

## Problem

The State pattern is closely related to the concept of **Finite-State Machines
(FSM)**. At any given moment, a program is in one of a finite number of states.
Within each state, it behaves differently. Switching between states is governed
by **transitions** — rules that are also finite and predetermined.

Consider a `Document` class with three states: `Draft`, `Moderation`, and
`Published`. The `publish()` method behaves differently in each:

- **Draft** → moves to Moderation.
- **Moderation** → makes public (only if user is admin).
- **Published** → does nothing.

The naive implementation uses conditional statements (`if`/`switch`) to select
behavior based on the current state. As states and state-dependent behaviors
multiply, methods fill with monstrous conditionals. Any change to transition
logic requires updating conditionals in every affected method. The code becomes
very difficult to maintain and predict.

---

## Solution

Create new classes for every possible state and extract all state-specific
behavior into those classes.

The original object (the **context**) stores a reference to one of the state
objects and delegates all state-related work to it. To transition, replace the
active state object with another one.

This works because all state classes follow the same **interface**. The context
interacts with the state object only through that interface.

### State vs. Strategy

The structure looks identical to Strategy, but there's a key semantic
difference: in the State pattern, **states may be aware of each other** and
initiate transitions from one state to another. In Strategy, strategies are
completely independent.

---

## Real-World Analogy

Smartphone buttons behave differently based on device state:

- **Unlocked** — pressing buttons executes various functions.
- **Locked** — any button press leads to the unlock screen.
- **Low battery** — any button press shows the charging screen.

---

## Structure

```
┌─────────────────────────────────────┐
│            Context                  │
│  ─────────────────────────────────  │
│  - state: State                     │
│  + changeState(s: State)            │
│  + request()                        │
│    → state.handle(this)             │
└─────────────────────────────────────┘
           ▲ delegates to
┌──────────┴──────────────────────────┐
│      <<interface>>                  │
│          State                      │
│  ─────────────────────────────────  │
│  + handle(context)                  │
└──────────┬──────────────────────────┘
           │ implements
┌──────────┼──────────────────────────┐
│   ConcreteStateA                    │
│   ConcreteStateB                    │
│   ConcreteStateC                    │
│  ─────────────────────────────────  │
│  + handle(context)                  │
│    → context.changeState(new ...)   │
└─────────────────────────────────────┘
```

### Participants

1. **Context** — stores a reference to a concrete state object. Communicates
   with states via the state interface. Exposes a setter for replacing the
   current state.
2. **State Interface** — declares state-specific methods. These should make sense
   for all concrete states (no useless methods).
3. **Concrete States** — provide their own implementations. May store a
   backreference to the context to fetch information and trigger transitions.
4. Both the context *and* concrete states can set the next state and perform the
   actual transition.

---

## Pseudocode

A media player with three states: Locked, Ready, and Playing.

```
class AudioPlayer
    field state: State
    field UI, volume, playlist, currentSong

    constructor AudioPlayer()
        this.state = new ReadyState(this)
        UI = new UserInterface()
        UI.lockButton.onClick(this.clickLock)
        UI.playButton.onClick(this.clickPlay)
        UI.nextButton.onClick(this.clickNext)
        UI.prevButton.onClick(this.clickPrevious)

    method changeState(state: State)
        this.state = state

    method clickLock()
        state.clickLock()
    method clickPlay()
        state.clickPlay()
    method clickNext()
        state.clickNext()
    method clickPrevious()
        state.clickPrevious()

    method startPlayback() // ...
    method stopPlayback()  // ...
    method nextSong()      // ...
    method previousSong()  // ...
    method fastForward(time) // ...
    method rewind(time)    // ...

abstract class State
    protected field player: AudioPlayer
    constructor State(player)
        this.player = player
    abstract method clickLock()
    abstract method clickPlay()
    abstract method clickNext()
    abstract method clickPrevious()

class LockedState extends State
    method clickLock()
        if player.playing
            player.changeState(new PlayingState(player))
        else
            player.changeState(new ReadyState(player))
    method clickPlay()    // do nothing
    method clickNext()    // do nothing
    method clickPrevious() // do nothing

class ReadyState extends State
    method clickLock()
        player.changeState(new LockedState(player))
    method clickPlay()
        player.startPlayback()
        player.changeState(new PlayingState(player))
    method clickNext()
        player.nextSong()
    method clickPrevious()
        player.previousSong()

class PlayingState extends State
    method clickLock()
        player.changeState(new LockedState(player))
    method clickPlay()
        player.stopPlayback()
        player.changeState(new ReadyState(player))
    method clickNext()
        if event.doubleclick
            player.nextSong()
        else
            player.fastForward(5)
    method clickPrevious()
        if event.doubleclick
            player.previous()
        else
            player.rewind(5)
```

Each state defines what happens for every user action, and which state to
transition to next.

---

## Applicability

- **State-dependent behavior** — the object behaves differently depending on
  current state, there are many states, and state-specific code changes
  frequently.

- **Conditional pollution** — the class is polluted with massive conditionals
  that select behavior based on field values.

- **Duplicate code across states** — similar code exists in multiple states and
  transitions of a condition-based state machine.

---

## How to Implement

1. Decide which class is the **context** — the class with state-dependent code.
2. Declare the **state interface** with methods for all state-specific behavior.
3. For each actual state, create a **concrete state class** deriving from the
   interface. Extract all state-specific code from the context into these classes.
   Deal with private member access via public methods, composition, or nested
   classes.
4. In the context, add a state interface reference field and a public setter.
5. Replace conditionals in the context with calls to the state object's methods.
6. To switch state, create a new state object and pass it to the context's
   setter. This can happen in the context, in state objects, or in client code.

---

## Pros and Cons

### Pros
- **SRP** — organize state-specific code into separate classes.
- **OCP** — add new states without changing existing state classes or the context.
- **Eliminates conditionals** — replace bloated `if`/`switch` with polymorphism.

### Cons
- **Overkill** — if the state machine has only a few states or rarely changes,
  the pattern adds unnecessary complexity.

---

## Relations with Other Patterns

- **Bridge, State, Strategy, Adapter** — structurally similar (all use
  composition to delegate work). They solve different problems: Bridge separates
  abstraction from implementation; State manages stateful behavior; Strategy
  swaps algorithms; Adapter adapts interfaces.

- **State ≈ Extended Strategy** — both use composition to change behavior via
  delegation. State allows dependencies between concrete states (states trigger
  transitions). Strategy makes objects independent and unaware of each other.

---

## Key Takeaways

1. State pattern replaces sprawling conditionals with polymorphism — each state
   knows what to do and which state comes next.

2. The context delegates behavior to the current state object and provides a
   setter for state transitions. The context itself stays clean.

3. Unlike Strategy, state objects are **aware of each other** and drive
   transitions. This is the key semantic difference.

4. State classes can store a backreference to the context, enabling them to read
   context data and trigger transitions on the context.

5. Consider the number of states: if you have only 2–3 states with simple
   logic, a `switch` statement may be more appropriate than the full pattern.

6. State hierarchies can reduce duplication — use abstract intermediate classes
   to share common behavior among related states.
