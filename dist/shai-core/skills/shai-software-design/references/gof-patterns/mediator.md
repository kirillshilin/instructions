# Mediator

> **Also known as:** Intermediary, Controller  
> **Category:** Behavioral · **Complexity:** ★★☆  
> **Source:** [refactoring.guru](https://refactoring.guru/design-patterns/mediator)

---

## Intent

**Mediator** is a behavioral design pattern that lets you reduce chaotic
dependencies between objects. The pattern restricts direct communications between
objects and forces them to collaborate only via a mediator object.

---

## Problem

Consider a dialog for editing customer profiles — text fields, checkboxes,
buttons. These form elements interact with each other: selecting "I have a dog"
reveals a hidden text field; the submit button validates all fields before saving.

When this logic lives inside the form elements, they become tightly coupled.
The checkbox knows about the text field, the button knows about every field it
validates. You can't reuse the checkbox in another form because it's bound to a
specific text field. You either use all the classes together or none at all.

---

## Solution

The Mediator pattern suggests ceasing all direct communication between
components. Instead, components call a special **mediator object** that redirects
calls to the appropriate recipients.

In the profile dialog example, the dialog class itself acts as the mediator.
It already knows all its sub-elements — no new dependencies required.

Components become dependent only on the single mediator interface, not on
dozens of colleagues. When a button is clicked, it notifies the mediator, which
decides what to do (validate, show/hide fields, etc.).

You can go further by extracting a common mediator interface. Then any component
can work with any mediator implementation, enabling reuse across different
contexts.

---

## Real-World Analogy

Aircraft near an airport don't communicate directly with each other. Instead,
all communication goes through the **air traffic control tower** (the mediator).
The tower doesn't control the entire flight — it only manages constraints in
the terminal area where the number of actors would overwhelm any individual pilot.
Without the tower, every pilot would need to be aware of every other nearby plane.

---

## Structure

```
┌─────────────────────────────┐
│      <<interface>>          │
│        Mediator             │
│  ─────────────────────────  │
│  + notify(sender, event)    │
└──────────┬──────────────────┘
           │ implements
┌──────────┴──────────────────┐
│    ConcreteMediator         │
│  ─────────────────────────  │
│  - componentA               │
│  - componentB               │
│  - componentC               │
│  + notify(sender, event)    │
│    → routes to components   │
└─────────────────────────────┘
           ▲ references
┌──────────┴──────────────────┐
│      Component              │
│  ─────────────────────────  │
│  - mediator: Mediator       │
│  + operationA()             │
│    → mediator.notify(this,  │
│        "eventA")            │
└─────────────────────────────┘
```

### Participants

1. **Components** — various classes with business logic. Each holds a reference
   to the mediator (declared via the mediator interface). Components don't know
   the actual mediator class — they're reusable with different mediators.
2. **Mediator Interface** — declares methods of communication (usually a single
   `notify(sender, event)` method).
3. **Concrete Mediator** — encapsulates relationships between components. Often
   stores references to all components it manages, sometimes managing their
   lifecycle.
4. Components are unaware of each other. From a component's perspective,
   everything is a black box: sender doesn't know the receiver, receiver doesn't
   know the sender.

---

## Pseudocode

An authentication dialog mediates between a checkbox, text fields, and buttons.

```
interface Mediator
    method notify(sender: Component, event: string)

class AuthenticationDialog implements Mediator
    private field title: string
    private field loginOrRegisterChkBx: Checkbox
    private field loginUsername, loginPassword: Textbox
    private field registrationUsername, registrationPassword,
                  registrationEmail: Textbox
    private field okBtn, cancelBtn: Button

    constructor AuthenticationDialog()
        // Create all component objects, passing `this`
        // as the mediator to establish links.

    method notify(sender, event)
        if sender == loginOrRegisterChkBx and event == "check"
            if loginOrRegisterChkBx.checked
                title = "Log in"
                // Show login form components
                // Hide registration form components
            else
                title = "Register"
                // Show registration form components
                // Hide login form components

        if sender == okBtn and event == "click"
            if loginOrRegister.checked
                // Try to find user using login credentials
                if !found
                    // Show error message above login field
            else
                // Create user account from registration fields
                // Log that user in

// Components communicate with the mediator, not each other
class Component
    field dialog: Mediator
    constructor Component(dialog)
        this.dialog = dialog
    method click()
        dialog.notify(this, "click")
    method keypress()
        dialog.notify(this, "keypress")

class Button extends Component
    // ...

class Textbox extends Component
    // ...

class Checkbox extends Component
    method check()
        dialog.notify(this, "check")
```

The dialog centralizes all form interaction logic. Components are simple and
reusable — they only know how to send notifications.

---

## Applicability

- **Tightly coupled classes** — classes are hard to change because they depend on
  dozens of others. The mediator isolates changes to a specific component.

- **Non-reusable components** — a component can't be used in a different program
  because it depends on too many other components. With a mediator, just provide
  a new mediator class.

- **Subclass explosion** — you're creating too many component subclasses to reuse
  basic behavior in various contexts. The mediator contains all relations, so
  new collaboration patterns just need a new mediator class.

---

## How to Implement

1. Identify tightly coupled classes that would benefit from independence.
2. Declare the mediator interface — usually a single `notify(sender, event)`
   method.
3. Implement the concrete mediator. Store references to all components. Consider
   making the mediator create and destroy components (resembling a Factory or
   Facade).
4. Components store a reference to the mediator (passed via constructor).
5. Change component code to call `mediator.notify()` instead of calling other
   components directly. Extract inter-component logic into the mediator.

---

## Pros and Cons

### Pros
- **SRP** — extract all inter-component communication into a single place.
- **OCP** — introduce new mediators without changing components.
- **Reduced coupling** — components know only the mediator.
- **Reusability** — individual components can be used in different contexts.

### Cons
- **God Object risk** — the mediator can grow into an all-knowing controller if
  not carefully maintained.

---

## Relations with Other Patterns

- **CoR, Command, Mediator, Observer** — four sender-receiver patterns:
  CoR chains handlers; Command links sender→receiver; Mediator centralizes
  communication; Observer uses pub/sub.

- **Facade vs. Mediator** — both organize collaboration among tightly coupled
  classes. Facade provides a simplified interface but doesn't add new
  functionality; the subsystem is unaware of the facade. Mediator centralizes
  mutual communication; components know the mediator and use it.

- **Mediator vs. Observer** — the distinction is subtle:
  - Mediator eliminates mutual dependencies (components → single mediator).
  - Observer establishes dynamic one-way connections (subordinate → publisher).
  - A popular Mediator implementation uses Observer internally (mediator as
    publisher, components as subscribers).
  - You can also implement Mediator without Observer — permanently linking all
    components to the same mediator object.

---

## Key Takeaways

1. Mediator transforms a many-to-many web of dependencies into a star topology:
   all components talk only to the mediator.

2. The pattern is most beneficial when the number of inter-component relations
   is large and growing — it prevents the dependency graph from becoming
   unmanageable.

3. The main risk is the mediator becoming a God Object. Mitigate this by
   splitting into specialized mediators or using Observer internally.

4. Dialogs, form controllers, and event dispatchers are natural mediators — they
   already know their child components and coordinate their behavior.

5. Components become truly reusable: swap the mediator, keep the components.

6. Mediator is structurally similar to Facade but differs in intent: Facade
   simplifies an interface, Mediator manages complex bidirectional communication.
