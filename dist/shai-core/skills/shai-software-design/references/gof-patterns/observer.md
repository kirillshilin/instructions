# Observer

> **Also known as:** Event-Subscriber, Listener  
> **Category:** Behavioral · **Complexity:** ★★☆  
> **Source:** [refactoring.guru](https://refactoring.guru/design-patterns/observer)

---

## Intent

**Observer** is a behavioral design pattern that lets you define a subscription
mechanism to notify multiple objects about any events that happen to the object
they're observing.

---

## Problem

You have a `Customer` and a `Store`. The customer wants to know when a product
becomes available.

- **Polling approach:** The customer visits the store every day. Most trips are
  pointless if the product hasn't arrived.
- **Push approach:** The store emails all customers whenever any new product
  arrives — useful for some, spam for others.

Either the customer wastes time polling or the store wastes resources pushing
irrelevant notifications.

---

## Solution

The Observer pattern introduces a **subscription mechanism** in the
**publisher** (the object with interesting state). Subscribers can join or leave
the notification list at any time.

The mechanism consists of:

1. An array field storing references to subscriber objects.
2. Public methods for adding/removing subscribers from the list.

When an important event occurs, the publisher iterates over subscribers and
calls the notification method on each one.

All subscribers implement the same **subscriber interface** (typically a single
`update()` method). The publisher communicates with subscribers only through this
interface, so it's decoupled from concrete classes.

For multiple publisher types, extract a common publisher interface with
`subscribe()`, `unsubscribe()`, and `notify()`. Subscribers can observe any
publisher that implements this interface.

---

## Real-World Analogy

If you subscribe to a newspaper, you no longer need to go to the store. The
publisher sends new issues to your mailbox after publication. The publisher
maintains a subscriber list and knows which magazines each subscriber wants.
Subscribers can cancel their subscription at any time.

---

## Structure

```
┌─────────────────────────────────────┐
│           Publisher                  │
│  ─────────────────────────────────  │
│  - subscribers: list                │
│  - mainState                        │
│  + subscribe(s: Subscriber)         │
│  + unsubscribe(s: Subscriber)       │
│  + notifySubscribers()              │
│    → for each s: s.update(this)     │
│  + mainBusinessLogic()              │
│    → changes state → notify         │
└─────────────────────────────────────┘
           ▲ depends on
┌──────────┴──────────────────────────┐
│      <<interface>>                  │
│       Subscriber                    │
│  ─────────────────────────────────  │
│  + update(context)                  │
└──────────┬──────────────────────────┘
           │ implements
┌──────────┴──────────────────────────┐
│    ConcreteSubscriberA              │
│    ConcreteSubscriberB              │
│  ─────────────────────────────────  │
│  + update(context)                  │
│    → react to event                 │
└─────────────────────────────────────┘
```

### Participants

1. **Publisher** — issues events. Contains subscription infrastructure
   (subscribe, unsubscribe, notify). When state changes, it notifies subscribers.
2. **Subscriber Interface** — declares the `update()` method. May include
   parameters to let the publisher pass event details.
3. **Concrete Subscribers** — perform actions in response to notifications. All
   implement the same interface so the publisher stays decoupled.
4. **Client** — creates publishers and subscribers separately, then registers
   subscribers with publishers.

---

## Pseudocode

A text editor notifies other objects (logger, email alerter) about file events.

```
class EventManager
    private field listeners: hash map of event types → listeners

    method subscribe(eventType, listener)
        listeners.add(eventType, listener)

    method unsubscribe(eventType, listener)
        listeners.remove(eventType, listener)

    method notify(eventType, data)
        foreach listener in listeners.of(eventType)
            listener.update(data)

class Editor
    public field events: EventManager
    private field file: File

    constructor Editor()
        events = new EventManager()

    method openFile(path)
        this.file = new File(path)
        events.notify("open", file.name)

    method saveFile()
        file.write()
        events.notify("save", file.name)

interface EventListener
    method update(filename)

class LoggingListener implements EventListener
    private field log: File
    private field message: string

    constructor LoggingListener(log_filename, message)
        this.log = new File(log_filename)
        this.message = message

    method update(filename)
        log.write(replace('%s', filename, message))

class EmailAlertsListener implements EventListener
    private field email: string
    private field message: string

    constructor EmailAlertsListener(email, message)
        this.email = email
        this.message = message

    method update(filename)
        system.email(email, replace('%s', filename, message))

class Application
    method config()
        editor = new Editor()

        logger = new LoggingListener(
            "/path/to/log.txt",
            "Someone has opened the file: %s")
        editor.events.subscribe("open", logger)

        emailAlerts = new EmailAlertsListener(
            "admin@example.com",
            "Someone has changed the file: %s")
        editor.events.subscribe("save", emailAlerts)
```

The `EventManager` is extracted into a helper so any class can become a
publisher via composition. Subscribers register per event type.

---

## Applicability

- **State changes affect unknown objects** — changes to one object may require
  updating others, and you don't know which objects or how many at design time.

- **Temporary observation** — some objects need to observe others only for a
  limited time or under specific conditions. The dynamic subscription list
  handles this naturally.

---

## How to Implement

1. Break business logic into two parts: the core functionality (publisher) and
   the dependent reactions (subscriber classes).
2. Declare the subscriber interface with a single `update()` method.
3. Declare the publisher interface with `subscribe()`, `unsubscribe()`, and
   `notify()` methods.
4. Put the subscription list and method implementations in a base class or a
   composition-based helper object (like `EventManager`).
5. Create concrete publishers. On important state changes, call `notify()`.
6. Implement `update()` in concrete subscribers. Most need context data — pass
   it as arguments or let subscribers pull data from the publisher reference.
7. The client registers subscribers with appropriate publishers.

---

## Pros and Cons

### Pros
- **OCP** — add new subscriber classes without changing publisher code (and vice
  versa with a publisher interface).
- **Runtime relationships** — establish and tear down observation links
  dynamically.

### Cons
- **Notification order is undefined** — subscribers are notified in whatever
  order they appear in the list. Don't rely on a specific sequence.

---

## Relations with Other Patterns

- **CoR, Command, Mediator, Observer** — four sender-receiver patterns:
  - CoR: sequential chain, first handler wins.
  - Command: unidirectional sender → receiver.
  - Mediator: central hub for indirect communication.
  - Observer: dynamic pub/sub subscriptions.

- **Mediator vs. Observer** — blurry distinction. Mediator eliminates mutual
  dependencies via a central hub. Observer creates one-way connections. A common
  Mediator implementation uses Observer internally (mediator = publisher,
  components = subscribers).

---

## Key Takeaways

1. Observer implements a **one-to-many dependency**: when the publisher changes,
   all subscribers are notified and updated automatically.

2. The subscription mechanism is the pattern's core — it makes the set of
   observers dynamic, not hardcoded.

3. All subscribers share the same interface, keeping the publisher decoupled
   from concrete subscriber classes.

4. Extract the subscription infrastructure into a reusable helper (like
   `EventManager`) so any class can become a publisher via composition.

5. Modern implementations often support **event types** (channels/topics),
   letting subscribers register only for specific events they care about.

6. Watch out for notification ordering — don't build logic that depends on
   subscribers being called in a specific sequence.

7. In languages with first-class functions, you can simplify the pattern by
   using callback functions instead of subscriber objects.
