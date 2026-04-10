# Bridge

> **Structural Pattern** — Splits a large class (or closely related classes) into two
> separate hierarchies — abstraction and implementation — that can be developed
> independently.

---

## Intent

Bridge is a structural design pattern that decouples an **abstraction** from its
**implementation** so that the two can vary independently. It replaces heavy
inheritance hierarchies with object composition: one hierarchy for the "control"
logic and another for the platform-specific work.

---

## Problem

You have a `Shape` class with subclasses `Circle` and `Square`. Now you want to add
colors — `Red` and `Blue`. With plain inheritance you'd need `RedCircle`,
`BlueCircle`, `RedSquare`, `BlueSquare` — **4 classes**. Adding a triangle means 2
more subclasses; adding a new color means 3 more.

The class hierarchy grows in **geometric progression** because you're extending it
along two independent dimensions (form × color) simultaneously.

### The core tension

- Each new dimension multiplies the number of classes.
- Changes in one dimension (e.g., adding a shape) require touching the other
  dimension's code.
- The codebase becomes a tangled monolith of conditionals or a combinatorial
  explosion of subclasses.

---

## Solution

Switch from inheritance to **composition**. Extract one of the dimensions into a
separate class hierarchy and hold a reference to it from the original class.

For the shapes example:

1. Extract color into its own hierarchy (`Color` → `Red`, `Blue`).
2. Give `Shape` a reference field of type `Color`.
3. `Shape` delegates color-related work to the linked `Color` object.

Adding new shapes or new colors no longer requires combinatorial subclassing.

### Abstraction and Implementation (GoF terminology)

| Term               | Meaning                                                              | Example      |
| ------------------ | -------------------------------------------------------------------- | ------------ |
| **Abstraction**    | High-level control layer. Delegates real work to the implementation. | GUI layer    |
| **Implementation** | Low-level platform-specific work. Defined by a common interface.     | OS-level API |

A GUI app might have several GUIs (regular, admin) and support several OS APIs
(Windows, Linux, macOS). Bridge lets these two hierarchies evolve independently:

- **Abstraction hierarchy**: RemoteControl → AdvancedRemoteControl
- **Implementation hierarchy**: Device → TV, Radio

### Real-world analogy

A remote control (abstraction) and electronic devices (implementation). The same
remote interface works across different device types. Adding a new remote feature
or a new device type doesn't require changing the other side.

---

## Structure

| #   | Role                        | Responsibility                                                                                              |
| --- | --------------------------- | ----------------------------------------------------------------------------------------------------------- |
| 1   | **Abstraction**             | High-level control logic. Relies on the implementation for low-level work.                                  |
| 2   | **Implementation**          | Common interface for all concrete implementations. The abstraction communicates only through these methods. |
| 3   | **Concrete Implementation** | Platform-specific code (e.g., Windows API, Linux API).                                                      |
| 4   | **Refined Abstraction**     | Variants of control logic that extend the base abstraction.                                                 |
| 5   | **Client**                  | Links an abstraction object with an implementation object and works through the abstraction.                |

The abstraction may declare higher-level operations that rely on many primitive
operations declared by the implementation.

---

## Pseudocode

Remote controls and devices:

```text
// Abstraction
class RemoteControl
    protected field device: Device

    constructor RemoteControl(device: Device)
        this.device = device

    method togglePower()
        if device.isEnabled() then
            device.disable()
        else
            device.enable()

    method volumeDown()
        device.setVolume(device.getVolume() - 10)

    method volumeUp()
        device.setVolume(device.getVolume() + 10)

    method channelDown()
        device.setChannel(device.getChannel() - 1)

    method channelUp()
        device.setChannel(device.getChannel() + 1)

// Refined Abstraction
class AdvancedRemoteControl extends RemoteControl
    method mute()
        device.setVolume(0)

// Implementation interface
interface Device
    method isEnabled()
    method enable()
    method disable()
    method getVolume()
    method setVolume(percent)
    method getChannel()
    method setChannel(channel)

// Concrete Implementations
class Tv implements Device
    // ...

class Radio implements Device
    // ...

// Client code
tv = new Tv()
remote = new RemoteControl(tv)
remote.togglePower()

radio = new Radio()
remote = new AdvancedRemoteControl(radio)
```

### Key observations

- `RemoteControl` holds a `Device` reference — the "bridge."
- You can add new devices without touching remote classes, and vice versa.
- `AdvancedRemoteControl` adds features without subclassing `Device`.

---

## Applicability

| Use when …                                                                                      | Why                                                                                                                 |
| ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| You want to divide and organize a monolithic class with several variants of some functionality. | Bridge splits independent dimensions into separate hierarchies, simplifying maintenance and reducing breakage risk. |
| You need to extend a class in several **orthogonal** (independent) dimensions.                  | Each dimension gets its own hierarchy; the original class delegates to objects in those hierarchies.                |
| You need to switch implementations at runtime.                                                  | The abstraction holds a reference to an implementation object; swapping it is as simple as reassigning the field.   |

> **Bridge vs. Strategy**: Both use composition-based delegation. Bridge
> separates *structural* dimensions; Strategy separates *behavioral algorithms*.
> The pattern communicates the *problem* being solved, not just the class structure.

---

## How to Implement

1. **Identify orthogonal dimensions** in your classes (e.g., abstraction/platform,
   domain/infrastructure, front-end/back-end).
2. **Define** the base abstraction class with operations the client needs.
3. **Declare** the implementation interface with primitive operations the
   abstraction requires.
4. **Create concrete implementation** classes for each platform.
5. **Add** a reference field (of the implementation interface type) in the
   abstraction.
6. **Create refined abstractions** for each variant of high-level logic.
7. **Client code** passes an implementation to the abstraction's constructor and
   then works exclusively through the abstraction.

---

## Pros and Cons

### Pros

| Principle                 | Benefit                                                               |
| ------------------------- | --------------------------------------------------------------------- |
| **Platform independence** | Classes and apps become platform-agnostic.                            |
| **Client isolation**      | Client code works with high-level abstractions, not platform details. |
| **Open/Closed**           | New abstractions and implementations can be introduced independently. |
| **Single Responsibility** | High-level logic and platform details live in separate classes.       |

### Cons

| Drawback                                                                                                            |
| ------------------------------------------------------------------------------------------------------------------- |
| May over-complicate code when applied to a highly cohesive class that doesn't actually have independent dimensions. |

---

## Relations with Other Patterns

| Pattern                        | Relationship                                                                                                                    |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| **Adapter**                    | Adapter retrofits compatibility; Bridge is designed up-front for independent evolution.                                         |
| **State, Strategy, (Adapter)** | Similar structures (composition + delegation) but solve different problems.                                                     |
| **Abstract Factory**           | Can be combined with Bridge when certain abstractions only work with specific implementations — AF encapsulates those pairings. |
| **Builder**                    | Can be combined — the Director acts as the abstraction and different Builders serve as implementations.                         |

---

## Key Takeaways

- Bridge prevents the combinatorial explosion of subclasses when a class varies
  along two or more independent dimensions.
- It replaces inheritance with composition: the abstraction *has-a*
  implementation rather than *is-a* implementation.
- The pattern is typically designed up-front (unlike Adapter, which is a
  retrofit).
- Bridge, State, Strategy, and Adapter share similar structures but differ in
  intent — always communicate the problem you're solving, not just the
  structural recipe.
- The key indicator for Bridge: when you find yourself reaching for multiple
  inheritance or a deep class hierarchy with orthogonal concerns.
