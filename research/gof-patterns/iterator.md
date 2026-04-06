# Iterator

> **Category:** Behavioral · **Complexity:** ★★☆  
> **Source:** [refactoring.guru](https://refactoring.guru/design-patterns/iterator)

---

## Intent

**Iterator** is a behavioral design pattern that lets you traverse elements of a
collection without exposing its underlying representation (list, stack, tree,
etc.).

---

## Problem

Collections are among the most common data types. They can be stored as simple
lists, but also as stacks, trees, graphs, and other complex structures.
Regardless of structure, there must be a way to access elements so other code
can use them.

For a simple list you just loop, but how do you sequentially traverse a tree?
One day you need depth-first traversal, the next breadth-first, the next random
access. Adding traversal algorithms directly to the collection blurs its primary
responsibility (efficient data storage) and bloats the class.

Client code that works with many collection types gets coupled to specific
collection classes because each provides different access mechanisms.

---

## Solution

Extract the traversal behavior into a separate object called an **iterator**.
The iterator encapsulates all traversal details: current position, elements
remaining, traversal algorithm.

Multiple iterators can traverse the same collection simultaneously and
independently — each maintains its own state.

All iterators implement the same interface (`getNext()`, `hasMore()`), making
client code compatible with any collection type or traversal algorithm. To add a
new traversal strategy, create a new iterator class — no changes to the
collection or client.

---

## Real-World Analogy

You visit Rome and want to see all the sights. You could wander randomly, use a
smartphone navigator app, or hire a local guide. All three approaches are
"iterators" over the collection of city attractions — each provides a different
traversal strategy over the same data set.

---

## Structure

```
┌─────────────────────────────┐       ┌─────────────────────────────┐
│      <<interface>>          │       │      <<interface>>          │
│     IterableCollection      │       │        Iterator             │
│  ─────────────────────────  │       │  ─────────────────────────  │
│  + createIterator()         │──────>│  + getNext(): Element       │
└──────────┬──────────────────┘       │  + hasMore(): bool          │
           │ implements               └──────────┬──────────────────┘
┌──────────┴──────────────────┐                  │ implements
│    ConcreteCollection       │       ┌──────────┴──────────────────┐
│  ─────────────────────────  │       │    ConcreteIterator          │
│  + createIterator()         │       │  ─────────────────────────   │
│    → new ConcreteIterator() │       │  - collection                │
└─────────────────────────────┘       │  - currentPosition           │
                                      │  + getNext()                 │
                                      │  + hasMore()                 │
                                      └─────────────────────────────┘
```

### Participants

1. **Iterator Interface** — declares traversal operations: `getNext()`,
   `hasMore()`, optionally `reset()` and `currentPosition()`.
2. **Concrete Iterator** — implements a specific traversal algorithm. Tracks its
   own state independently.
3. **Collection Interface** — declares `createIterator()` returning an iterator.
4. **Concrete Collection** — returns a new concrete iterator instance per call.
5. **Client** — works through interfaces only, decoupled from concrete classes.

---

## Pseudocode

Traversing Facebook's social graph. Two iterators — "friends" and "coworkers" —
traverse profiles of a given user in different ways.

```
interface SocialNetwork
    method createFriendsIterator(profileId): ProfileIterator
    method createCoworkersIterator(profileId): ProfileIterator

class Facebook implements SocialNetwork
    method createFriendsIterator(profileId)
        return new FacebookIterator(this, profileId, "friends")
    method createCoworkersIterator(profileId)
        return new FacebookIterator(this, profileId, "coworkers")

interface ProfileIterator
    method getNext(): Profile
    method hasMore(): bool

class FacebookIterator implements ProfileIterator
    private field facebook: Facebook
    private field profileId, type: string
    private field currentPosition: int
    private field cache: array of Profile

    constructor FacebookIterator(facebook, profileId, type)
        this.facebook = facebook
        this.profileId = profileId
        this.type = type

    private method lazyInit()
        if cache == null
            cache = facebook.socialGraphRequest(profileId, type)

    method getNext()
        if hasMore()
            result = cache[currentPosition]
            currentPosition++
            return result

    method hasMore()
        lazyInit()
        return currentPosition < cache.length

// Client — works through interfaces only
class SocialSpammer
    method send(iterator: ProfileIterator, message: string)
        while iterator.hasMore()
            profile = iterator.getNext()
            System.sendEmail(profile.getEmail(), message)

class Application
    field network: SocialNetwork
    field spammer: SocialSpammer

    method config()
        if working with Facebook
            this.network = new Facebook()
        if working with LinkedIn
            this.network = new LinkedIn()
        this.spammer = new SocialSpammer()

    method sendSpamToFriends(profile)
        iterator = network.createFriendsIterator(profile.getId())
        spammer.send(iterator, "Very important message")

    method sendSpamToCoworkers(profile)
        iterator = network.createCoworkersIterator(profile.getId())
        spammer.send(iterator, "Very important message")
```

The client (`SocialSpammer`) doesn't know whether it's iterating over Facebook
or LinkedIn profiles — it works entirely through the `ProfileIterator` interface.

---

## Applicability

- **Complex internal structure** — collection has a complex data structure
  (trees, graphs) but you want to hide that complexity from clients.

- **Reduce traversal code duplication** — nontrivial iteration algorithms are
  bulky; extracting them into iterators keeps business logic lean.

- **Uniform traversal of unknown types** — need code that works with various
  collection types or data structures whose types aren't known beforehand.

---

## How to Implement

1. Declare the iterator interface with at least `getNext()` and `hasMore()`.
2. Declare the collection interface with `createIterator()` returning the
   iterator interface type.
3. Implement concrete iterators linked to a single collection instance (via
   constructor). Each iterator tracks its own position.
4. Implement the collection interface — the factory method returns a new concrete
   iterator, passing `this` to its constructor.
5. Replace all direct collection traversal code in the client with iterator usage.

---

## Pros and Cons

### Pros
- **SRP** — extract bulky traversal code into separate classes.
- **OCP** — add new collection types and iterators without breaking existing code.
- **Parallel iteration** — each iterator has its own state, enabling concurrent
  traversal.
- **Lazy iteration** — delay computation and continue when ready.

### Cons
- **Overkill for simple collections** — a plain loop may suffice.
- **Less efficient** than direct access for some specialized collection types.

---

## Relations with Other Patterns

- **Iterator + Composite** — use iterators to traverse Composite trees.
- **Factory Method + Iterator** — collection subclasses return different iterator
  types compatible with the collection.
- **Iterator + Memento** — capture the current iteration state and roll back if
  needed.
- **Iterator + Visitor** — traverse a complex structure with an iterator and
  execute an operation on each element via a visitor.

---

## Key Takeaways

1. Iterator separates the **how** of traversal from the **what** of storage,
   keeping both concerns clean and independently extensible.

2. Multiple iterators can traverse the same collection simultaneously — each
   maintains its own position and state.

3. The pattern is built into most modern languages (`IEnumerable`/`IEnumerator`
   in C#, `Iterable`/`Iterator` in Java, `__iter__`/`__next__` in Python,
   `Symbol.iterator` in JavaScript).

4. Lazy initialization of the cache (as in the Facebook example) is a common
   optimization — data is fetched only when iteration actually begins.

5. Iterators decouple client code from concrete collection types, enabling
   polymorphic traversal across lists, trees, graphs, and external APIs alike.
