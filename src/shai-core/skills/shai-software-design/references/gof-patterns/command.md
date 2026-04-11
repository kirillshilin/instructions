# Command

> **Also known as:** Action, Transaction  
> **Category:** Behavioral · **Complexity:** ★☆☆  
> **Source:** [refactoring.guru](https://refactoring.guru/design-patterns/command)

---

## Intent

**Command** is a behavioral design pattern that turns a request into a
stand-alone object containing all information about the request. This
transformation lets you pass requests as method arguments, delay or queue a
request's execution, and support undoable operations.

---

## Problem

You're building a text-editor app with a toolbar full of buttons. You create a
neat `Button` class, but each button needs different behavior on click.

The naive approach — creating a subclass per button placement — leads to an
enormous number of subclasses. GUI code becomes tightly coupled to volatile
business logic. Worse, operations like copy/paste must work from buttons, context
menus, *and* keyboard shortcuts. Placing logic in button subclasses forces you to
either duplicate code or create awkward dependencies between menus and buttons.

---

## Solution

The Command pattern applies the **separation of concerns** principle between the
GUI layer and the business logic layer. Instead of GUI objects calling business
logic directly, extract every request into a **command object** with a single
`execute()` method.

### How It Works

1. **Extract** each operation (copy, cut, paste, undo) into its own command class.
2. Each command stores a reference to the **receiver** (business logic object)
   and the parameters needed to invoke the operation.
3. The GUI object (the **sender/invoker**) holds a reference to a command and
   triggers `execute()` when the user interacts with it.
4. Since all commands implement the same interface, the sender is decoupled from
   concrete command classes — you can swap commands at runtime.
5. Buttons, menu items, and shortcuts can all link to the same command instance,
   eliminating code duplication.

Commands become a convenient **middle layer** that reduces coupling between GUI
and business logic.

---

## Real-World Analogy

At a restaurant, you give your order to a waiter who writes it on a piece of
paper. The paper goes to the kitchen queue. The chef reads it and cooks the meal.
The paper order is the **command object** — it encapsulates the request, travels
through the system, and contains all information needed to fulfill it.

---

## Structure

```
┌──────────────┐       ┌─────────────────────────────┐
│    Sender     │──────>│      <<interface>>           │
│  (Invoker)    │       │        Command               │
│               │       │  ─────────────────────────   │
│  - command    │       │  + execute()                 │
└──────────────┘       └──────────┬──────────────────┘
                                  │ implements
                       ┌──────────┴──────────────────┐
                       │      ConcreteCommand         │
                       │  ─────────────────────────   │
                       │  - receiver: Receiver         │
                       │  - params                     │
                       │  + execute()                  │
                       │     → receiver.action(params) │
                       └──────────┬──────────────────┘
                                  │ calls
                       ┌──────────┴──────────────────┐
                       │        Receiver              │
                       │  ─────────────────────────   │
                       │  + action(params)            │
                       └─────────────────────────────┘
```

### Participants

1. **Sender (Invoker)** — stores a command reference and triggers it. Doesn't
   create commands; receives them from the client.
2. **Command Interface** — declares `execute()` (typically a single method).
3. **Concrete Commands** — implement `execute()` by calling the receiver. Store
   receiver reference and parameters. Can be made immutable.
4. **Receiver** — contains the actual business logic.
5. **Client** — creates concrete commands, configures them with receivers, and
   associates them with senders.

---

## Pseudocode

A text editor with undo support. Commands back up the editor's state before
execution. The command history is a stack; undo pops the latest command and
restores the backup.

```
abstract class Command
    protected field app: Application
    protected field editor: Editor
    protected field backup: text

    constructor Command(app, editor)
        this.app = app
        this.editor = editor

    method saveBackup()
        backup = editor.text

    method undo()
        editor.text = backup

    abstract method execute(): bool

class CopyCommand extends Command
    method execute()
        app.clipboard = editor.getSelection()
        return false   // doesn't change state → no history entry

class CutCommand extends Command
    method execute()
        saveBackup()
        app.clipboard = editor.getSelection()
        editor.deleteSelection()
        return true    // changes state → push to history

class PasteCommand extends Command
    method execute()
        saveBackup()
        editor.replaceSelection(app.clipboard)
        return true

class UndoCommand extends Command
    method execute()
        app.undo()
        return false

class CommandHistory
    private field history: array of Command
    method push(c: Command)
        // append
    method pop(): Command
        // remove & return last

class Application
    field clipboard: string
    field editors: array of Editor
    field activeEditor: Editor
    field history: CommandHistory

    method createUI()
        copy = function() { executeCommand(new CopyCommand(this, activeEditor)) }
        copyButton.setCommand(copy)
        shortcuts.onKeyPress("Ctrl+C", copy)

        cut = function() { executeCommand(new CutCommand(this, activeEditor)) }
        cutButton.setCommand(cut)
        shortcuts.onKeyPress("Ctrl+X", cut)

        paste = function() { executeCommand(new PasteCommand(this, activeEditor)) }
        pasteButton.setCommand(paste)
        shortcuts.onKeyPress("Ctrl+V", paste)

        undo = function() { executeCommand(new UndoCommand(this, activeEditor)) }
        undoButton.setCommand(undo)
        shortcuts.onKeyPress("Ctrl+Z", undo)

    method executeCommand(command)
        if command.execute()
            history.push(command)

    method undo()
        command = history.pop()
        if command != null
            command.undo()
```

---

## Applicability

- **Parameterize objects with operations** — pass commands as arguments, store
  them, switch them at runtime. Useful for configurable UI elements.

- **Queue, schedule, or execute remotely** — commands can be serialized to
  strings, stored in databases, sent over the network, and restored later.

- **Implement undo/redo** — store executed commands in a history stack along with
  state backups. Alternatively, implement inverse operations.

---

## How to Implement

1. Declare the command interface with a single `execute()` method.
2. Extract requests into concrete command classes with fields for the receiver
   and parameters. Initialize all fields via the constructor.
3. Identify sender classes. Add a command field. Senders communicate through the
   command interface only.
4. Change senders to trigger the command instead of calling the receiver directly.
5. The client wires everything: creates receivers → creates commands with
   receivers → assigns commands to senders.

---

## Pros and Cons

### Pros
- **SRP** — decouple invocation from execution.
- **OCP** — add new commands without breaking existing client code.
- **Undo/redo** support via command history.
- **Deferred execution** — queue commands for later.
- **Macro commands** — assemble simple commands into complex composite commands.

### Cons
- **Increased complexity** — introduces a new layer between senders and
  receivers.

---

## Relations with Other Patterns

- **CoR, Command, Mediator, Observer** — four sender-receiver topologies:
  - CoR: dynamic chain, first handler wins.
  - Command: unidirectional sender → receiver link.
  - Mediator: central hub eliminates direct connections.
  - Observer: dynamic pub/sub subscriptions.

- **Command + Memento** — commands perform operations; mementos snapshot state
  before execution. Together they enable robust undo.

- **Command vs. Strategy** — both parameterize objects with actions. Command
  encapsulates a complete request (receiver + params), enabling queueing and
  history. Strategy swaps algorithms within a single context.

- **Prototype + Command** — use Prototype to save copies of commands into history.

- **Visitor ≈ powerful Command** — Visitor executes operations over various
  objects of different classes (like a Command dispatched by element type).

- **CoR handlers as Commands** — handlers can be Command objects executing
  different operations over the same request context.

---

## Key Takeaways

1. Command turns a method call into a first-class object — storable, queueable,
   serializable, and undoable.

2. The pattern's power comes from **decoupling the "what" from the "when"** — you
   can defer, log, replay, or reverse any operation.

3. All commands share the same interface, making senders completely agnostic of
   the concrete operation they trigger.

4. For undo, commands either store a state backup (via Memento) or implement an
   inverse operation.

5. Macro commands (composite commands) let you build complex operations from
   simple building blocks.

6. The extra abstraction layer is the main trade-off — justified when you need
   undo, queuing, or remote execution; overkill for simple direct calls.
