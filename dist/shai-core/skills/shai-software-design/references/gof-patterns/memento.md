# Memento

> **Also known as:** Snapshot  
> **Category:** Behavioral · **Complexity:** ★★★  
> **Source:** [refactoring.guru](https://refactoring.guru/design-patterns/memento)

---

## Intent

**Memento** is a behavioral design pattern that lets you save and restore the
previous state of an object without revealing the details of its implementation.

---

## Problem

You're building a text editor with undo functionality. The straightforward
approach is to record the state of all objects before each operation and save it.

But there are fundamental problems:

1. **Encapsulation barriers** — most objects hide significant data in private
   fields. You can't simply iterate over fields and copy values from the outside.

2. **Fragile snapshots** — if you make fields public to enable copying, every
   change to the editor class (adding, removing, or renaming fields) would
   require updating all snapshot classes. Other classes become dependent on every
   internal change.

3. **Snapshot container bloat** — container objects to hold snapshot data would
   need to mirror the editor's fields. Making those fields public exposes the
   editor's internal state to all dependent classes.

You reach a dead end: expose internals (fragile) or restrict access (impossible
to snapshot).

---

## Solution

The Memento pattern delegates snapshot creation to the **originator** — the
object whose state is being saved. Only the originator has full access to its own
state, so only it can produce a meaningful snapshot.

The pattern stores the copy in a special object called a **memento**. The
memento's contents are inaccessible to any other object except the originator
that created it. Other objects interact with the memento through a limited
interface that exposes only metadata (creation time, operation name), not the
actual state data.

A **caretaker** (often a command history stack) stores mementos. Since it works
with the memento only through the restricted interface, it can't tamper with the
stored state. When undo is requested, the caretaker passes the memento back to
the originator, which uses it to restore its state.

---

## Structure

### Implementation 1: Nested Classes (C++, C#, Java)

```
┌─────────────────────────────────────┐
│            Originator               │
│  ─────────────────────────────────  │
│  - state                            │
│  + createSnapshot(): Memento        │
│  + restore(m: Memento)              │
│                                     │
│  ┌──────────────────────────────┐   │
│  │      Memento (nested)        │   │
│  │  ──────────────────────────  │   │
│  │  - state (private)           │   │
│  │  + getMetadata()             │   │
│  └──────────────────────────────┘   │
└─────────────────────────────────────┘
          ▲ stores
┌─────────┴───────────────────────────┐
│         Caretaker                   │
│  ─────────────────────────────────  │
│  - history: stack of Memento        │
│  + doSomething()                    │
│  + undo()                           │
└─────────────────────────────────────┘
```

The memento is nested inside the originator — the originator accesses private
fields, but the caretaker only sees the restricted interface.

### Implementation 2: Intermediate Interface (PHP, Python)

For languages without nested classes, use a public memento class behind an
interface. The originator works with the concrete memento directly; caretakers
work through the interface (metadata only).

### Implementation 3: Strict Encapsulation

Each memento stores a reference to the originator that created it. The
`restore()` method lives in the memento, which calls setter methods on the
originator. This variant supports multiple originator types.

---

## Pseudocode

Text editor with undo. Command objects act as caretakers — they capture a
memento before executing and use it to restore state on undo.

```
class Editor
    private field text, curX, curY, selectionWidth

    method setText(text)
        this.text = text
    method setCursor(x, y)
        this.curX = x
        this.curY = y
    method setSelectionWidth(width)
        this.selectionWidth = width

    // Saves current state inside a memento
    method createSnapshot(): Snapshot
        return new Snapshot(this, text, curX, curY, selectionWidth)

class Snapshot
    private field editor: Editor
    private field text, curX, curY, selectionWidth

    constructor Snapshot(editor, text, curX, curY, selectionWidth)
        this.editor = editor
        this.text = text
        this.curX = curX
        this.curY = curY
        this.selectionWidth = selectionWidth

    method restore()
        editor.setText(text)
        editor.setCursor(curX, curY)
        editor.setSelectionWidth(selectionWidth)

class Command
    private field backup: Snapshot

    method makeBackup()
        backup = editor.createSnapshot()

    method undo()
        if backup != null
            backup.restore()
```

The `Snapshot` (memento) is immutable — all state is set via the constructor.
The `Command` (caretaker) stores the snapshot and triggers restore on undo.

---

## Applicability

- **Object state snapshots** — you need to produce snapshots to enable
  undo/redo, transactions, or rollback on error.

- **Encapsulation preservation** — direct access to an object's fields, getters,
  or setters would violate encapsulation. Memento lets the object itself control
  what gets snapshotted.

---

## How to Implement

1. Determine which class is the **originator** (the object whose state you need
   to capture).
2. Create the **memento class** with fields that mirror the originator's state.
3. Make the memento **immutable** — accept data only via the constructor, no
   setters.
4. If the language supports nested classes, nest the memento inside the
   originator. Otherwise, use an interface to restrict caretaker access.
5. Add `createSnapshot()` to the originator — pass all state to the memento's
   constructor.
6. Add `restore(memento)` to the originator — accept a memento and overwrite
   the originator's state with the memento's values.
7. The **caretaker** (command, history, etc.) decides when to capture and when to
   restore. It stores mementos but never accesses their internal state.
8. Optionally, move the `restore()` into the memento itself (strict
   encapsulation variant), linking the memento to its originator.

---

## Pros and Cons

### Pros
- **Encapsulation preserved** — snapshots are produced by the originator itself.
- **Simplified originator** — the caretaker manages history, keeping the
  originator focused on its primary responsibility.

### Cons
- **RAM consumption** — frequent mementos of large objects consume significant
  memory. Consider incremental snapshots or purging old mementos.
- **Caretaker lifecycle management** — caretakers must track the originator's
  lifecycle to destroy obsolete mementos.
- **Dynamic language limitations** — PHP, Python, and JavaScript can't guarantee
  that memento state stays untouched by external code.

---

## Relations with Other Patterns

- **Command + Memento** — commands perform operations; mementos snapshot state
  before execution. Together they provide robust undo/redo.

- **Memento + Iterator** — capture iteration state and roll back if needed.

- **Prototype vs. Memento** — Prototype can be a simpler alternative when the
  object's state is straightforward and has no external resource links. Just
  clone the whole object instead of managing mementos.

---

## Key Takeaways

1. Memento's core principle: **only the originator can create and read
   snapshots** — external objects interact through a restricted interface.

2. The pattern naturally pairs with Command for undo/redo: the command captures
   a memento before execution and restores it on undo.

3. Mementos should be immutable — set all state in the constructor, provide no
   setters.

4. Watch for memory overhead: each snapshot is a full copy of the originator's
   state. For large objects, consider differential/incremental snapshots.

5. Three implementation variants exist (nested class, intermediate interface,
   strict encapsulation) — choose based on language capabilities and how many
   originator types you have.

6. The Caretaker is the key to lifecycle management — it decides when to save,
   how many mementos to keep, and when to discard old ones.
