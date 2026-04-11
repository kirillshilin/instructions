# Template Method

> **Category:** Behavioral · **Complexity:** ★☆☆  
> **Source:** [refactoring.guru](https://refactoring.guru/design-patterns/template-method)

---

## Intent

**Template Method** is a behavioral design pattern that defines the skeleton of
an algorithm in the superclass but lets subclasses override specific steps of
the algorithm without changing its structure.

---

## Problem

You're building a data mining application that processes corporate documents in
various formats: PDF, DOC, CSV. Each format requires different parsing code, but
the processing and analysis steps are nearly identical across all three.

You end up with three classes containing a lot of duplicate code for the shared
steps (open, extract, parse, analyze, compose report, close). The format-specific
code (reading DOC vs. PDF vs. CSV) is different, but everything else is copy-
pasted.

There's also a client-side problem: the code uses conditionals to pick the right
processing class. If all three shared a common interface or base class, the
client could use polymorphism instead.

---

## Solution

Break the algorithm into a series of **steps**, turn each step into a method,
and put the sequence of calls inside a single **template method** in a base
class.

Steps can be:

1. **Abstract steps** — must be implemented by every subclass (format-specific
   parsing).
2. **Optional steps** (with default implementations) — can be overridden if
   needed.
3. **Hooks** — optional steps with empty bodies, placed before/after crucial
   steps, providing extension points.

Subclasses can override abstract and optional steps but **cannot override the
template method itself** — it locks in the algorithm's structure.

For the data mining app: the base class defines the algorithm skeleton
(open → extract → parse → analyze → compose report → close). Subclasses
implement format-specific steps (open, extract, parse). Shared steps (analyze,
compose report) live in the base class.

---

## Real-World Analogy

Mass housing construction uses a standard architectural plan (the template
method). The plan defines the building steps: foundation, framing, walls,
plumbing, wiring. Each step can be slightly adjusted to personalize the house —
but the overall sequence is fixed.

---

## Structure

```
┌─────────────────────────────────────┐
│     AbstractClass                   │
│  ─────────────────────────────────  │
│  + templateMethod()                 │
│    → step1()                        │
│    → step2()                        │
│    → hook1()                        │
│    → step3()                        │
│  + step1()           // default     │
│  + step2()           // abstract    │
│  + step3()           // abstract    │
│  + hook1()           // empty body  │
└──────────┬──────────────────────────┘
           │ extends
┌──────────┴──────────────────────────┐
│    ConcreteClassA                   │
│    ConcreteClassB                   │
│  ─────────────────────────────────  │
│  + step2() // own implementation    │
│  + step3() // own implementation    │
│  + hook1() // optional override     │
└─────────────────────────────────────┘
```

### Participants

1. **Abstract Class** — declares the template method and the steps. The template
   method calls steps in a fixed order. Steps may be abstract or have defaults.
2. **Concrete Classes** — override all abstract steps and optionally override
   default steps and hooks. They **do not** override the template method itself.

---

## Pseudocode

AI classes for a strategy video game. All races share the same turn structure
but differ in how they build structures, train units, and deploy forces.

```
class GameAI
    // Template method — defines the turn skeleton
    method turn()
        collectResources()
        buildStructures()
        buildUnits()
        attack()

    // Default implementation
    method collectResources()
        foreach s in this.builtStructures
            s.collect()

    // Abstract steps — must be implemented by subclasses
    abstract method buildStructures()
    abstract method buildUnits()

    // Another template method with default logic
    method attack()
        enemy = closestEnemy()
        if enemy == null
            sendScouts(map.center)
        else
            sendWarriors(enemy.position)

    abstract method sendScouts(position)
    abstract method sendWarriors(position)

class OrcsAI extends GameAI
    method buildStructures()
        if there are some resources
            // Build farms, then barracks, then stronghold

    method buildUnits()
        if there are plenty of resources
            if there are no scouts
                // Build peon, add to scouts group
            else
                // Build grunt, add to warriors group

    method sendScouts(position)
        if scouts.length > 0
            // Send scouts to position

    method sendWarriors(position)
        if warriors.length > 5
            // Send warriors to position

class MonstersAI extends GameAI
    method collectResources()
        // Monsters don't collect resources (override default)

    method buildStructures()
        // Monsters don't build structures

    method buildUnits()
        // Monsters don't build units
```

The `turn()` template method enforces a consistent AI loop across all races.
Each race provides its own implementations for the customizable steps.

---

## Applicability

- **Extensible algorithm skeleton** — let clients extend specific steps of an
  algorithm without changing the overall structure.

- **Near-identical algorithms** — several classes contain almost the same
  algorithm with minor differences. Pulling shared code into a base class
  eliminates duplication; variant code remains in subclasses.

---

## How to Implement

1. Analyze the algorithm; identify which steps are common and which vary.
2. Create the abstract base class. Declare the template method and all step
   methods. Outline the algorithm in the template method. Consider making it
   `final` to prevent subclass override.
3. Steps that have sensible defaults get a default implementation; others are
   declared abstract.
4. Add **hooks** (empty-bodied optional methods) before/after crucial steps as
   extension points.
5. For each algorithm variation, create a concrete subclass. Implement all
   abstract steps; optionally override default steps and hooks.

---

## Pros and Cons

### Pros
- **Controlled extension** — clients override specific parts without affecting
  the overall algorithm structure.
- **Code deduplication** — pull shared logic into the superclass.

### Cons
- **Client restrictions** — some clients may be limited by the rigid skeleton.
- **Liskov Substitution risk** — subclasses that suppress default steps may
  violate LSP.
- **Maintenance burden** — template methods with many steps are harder to
  maintain.

---

## Relations with Other Patterns

- **Factory Method ⊂ Template Method** — Factory Method is a specialization of
  Template Method. A Factory Method can also serve as one step within a larger
  Template Method.

- **Template Method vs. Strategy**:
  - Template Method: **inheritance** — alter parts of an algorithm by extending
    steps in subclasses. Works at the **class level** (static).
  - Strategy: **composition** — alter behavior by supplying different strategy
    objects. Works at the **object level** (dynamic, runtime-switchable).

---

## Key Takeaways

1. Template Method enforces **"don't call us, we'll call you"** (Hollywood
   Principle) — the base class controls the algorithm flow and calls subclass
   steps at the right time.

2. It's the only behavioral pattern that relies primarily on **inheritance**
   rather than composition.

3. Three types of steps: **abstract** (must override), **default** (can
   override), and **hooks** (empty extension points).

4. Mark the template method `final`/`sealed` to prevent subclasses from changing
   the algorithm structure — only the steps should be customizable.

5. The main trade-off is rigidity: the algorithm skeleton is fixed in the base
   class. If you need to swap entire algorithms at runtime, use Strategy
   instead.

6. Template Method is ideal when the high-level algorithm is stable but
   individual steps need to vary by subclass (data processing pipelines, game
   loops, test frameworks).
