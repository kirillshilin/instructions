# GoF Design Patterns — Reference Summaries

Index of summarized Gang of Four design patterns, sourced from [refactoring.guru](https://refactoring.guru/design-patterns).

## Creational Patterns

| #   | Pattern          | File                                       | Description                                                                                                        |
| --- | ---------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| 1   | Factory Method   | [factory-method.md](factory-method.md)     | Provides an interface for creating objects in a superclass, letting subclasses decide which class to instantiate.  |
| 2   | Abstract Factory | [abstract-factory.md](abstract-factory.md) | Lets you produce families of related objects without specifying their concrete classes.                            |
| 3   | Builder          | [builder.md](builder.md)                   | Lets you construct complex objects step by step, producing different types and representations with the same code. |
| 4   | Prototype        | [prototype.md](prototype.md)               | Lets you copy existing objects without making your code dependent on their classes.                                |
| 5   | Singleton        | [singleton.md](singleton.md)               | Ensures a class has only one instance while providing a global access point to it.                                 |

## Structural Patterns

| #   | Pattern   | File                                             | Description                                                                                              |
| --- | --------- | ------------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| —   | Overview  | [structural-patterns.md](structural-patterns.md) | Overview of all 7 structural patterns: Adapter, Bridge, Composite, Decorator, Facade, Flyweight, Proxy.  |
| 1   | Adapter   | [adapter.md](adapter.md)                         | Allows objects with incompatible interfaces to collaborate via a translator wrapper.                     |
| 2   | Bridge    | [bridge.md](bridge.md)                           | Splits a class into abstraction and implementation hierarchies that evolve independently.                |
| 3   | Composite | [composite.md](composite.md)                     | Composes objects into tree structures and treats individual and composite objects uniformly.             |
| 4   | Decorator | [decorator.md](decorator.md)                     | Attaches new behaviors to objects dynamically by wrapping them in layered decorator objects.             |
| 5   | Facade    | [facade.md](facade.md)                           | Provides a simplified interface to a complex subsystem of classes.                                       |
| 6   | Flyweight | [flyweight.md](flyweight.md)                     | Saves RAM by sharing common state between many similar objects instead of duplicating it.                |
| 7   | Proxy     | [proxy.md](proxy.md)                             | Provides a substitute that controls access to another object (lazy init, caching, access control, etc.). |

## Behavioral Patterns

_None yet._
