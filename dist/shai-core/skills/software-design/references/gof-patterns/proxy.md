# Proxy

> **Structural Pattern** — Provides a substitute or placeholder for another object,
> controlling access to the original.

---

## Intent

Proxy is a structural design pattern that lets you provide a stand-in for another
object. The proxy controls access to the original, allowing you to perform actions
**before** or **after** the request reaches the real service object — without
changing the service's code.

---

## Problem

You have a massive object that consumes significant system resources (e.g., a
database connection). You need it occasionally, but not always.

**Lazy initialization** would help — create the object only when it's actually
needed. But implementing that in every client duplicates code. And if the class
is in a third-party library, you may not be able to modify it at all.

---

## Solution

Create a **proxy** class with the same interface as the original service. Update
the app so that all clients receive the proxy instead of the real service.

When the proxy receives a request, it creates (or retrieves) the real service
object and **delegates** the work to it. The proxy can execute logic before or after
delegation — lazy init, access control, logging, caching, etc.

Since the proxy implements the same interface as the service, it can be passed to
any client expecting the real object.

### Real-world analogy

A **credit card** is a proxy for a bank account, which is a proxy for cash. All
three implement the same interface: "make a payment." The consumer doesn't carry
cash; the shop doesn't risk robbery — the proxy manages the complexity.

---

## Structure

| #   | Role                  | Responsibility                                                                                                                                                     |
| --- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | **Service Interface** | The interface both the service and proxy implement. Allows the proxy to disguise itself as the service.                                                            |
| 2   | **Service**           | The class with useful business logic.                                                                                                                              |
| 3   | **Proxy**             | Has a reference to the service. Manages the service lifecycle (creation, caching, access control, logging). Delegates actual work to the service after processing. |
| 4   | **Client**            | Works with services and proxies through the same interface. Can receive a proxy transparently.                                                                     |

---

## Proxy Variants

| Variant                               | Purpose                                                                             | Example                                          |
| ------------------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------ |
| **Virtual Proxy** (lazy init)         | Defers creation of a heavyweight object until it's actually needed.                 | A database connector created on first query.     |
| **Protection Proxy** (access control) | Allows only authorized clients to use the service.                                  | Check credentials before forwarding requests.    |
| **Remote Proxy**                      | Represents an object on a remote server. Handles network communication.             | A local stub for an RPC service.                 |
| **Logging Proxy**                     | Logs each request before forwarding to the service.                                 | Audit trail for sensitive operations.            |
| **Caching Proxy**                     | Caches results of recurring requests. Manages cache lifecycle.                      | Cache API responses keyed by request parameters. |
| **Smart Reference**                   | Dismisses a heavyweight object when no clients reference it. Tracks active clients. | Resource pool manager.                           |

---

## Pseudocode

A caching proxy for a YouTube integration library:

```text
// Service Interface
interface ThirdPartyYouTubeLib
    method listVideos()
    method getVideoInfo(id)
    method downloadVideo(id)

// Service — real implementation (makes network requests)
class ThirdPartyYouTubeClass implements ThirdPartyYouTubeLib
    method listVideos()
        // Send API request to YouTube.
    method getVideoInfo(id)
        // Get metadata about a video.
    method downloadVideo(id)
        // Download a video file.

// Proxy — caching wrapper
class CachedYouTubeClass implements ThirdPartyYouTubeLib
    private field service: ThirdPartyYouTubeLib
    private field listCache, videoCache
    field needReset

    constructor CachedYouTubeClass(service: ThirdPartyYouTubeLib)
        this.service = service

    method listVideos()
        if (listCache == null || needReset)
            listCache = service.listVideos()
        return listCache

    method getVideoInfo(id)
        if (videoCache == null || needReset)
            videoCache = service.getVideoInfo(id)
        return videoCache

    method downloadVideo(id)
        if (!downloadExists(id) || needReset)
            service.downloadVideo(id)

// Client — unaware of proxy vs real service
class YouTubeManager
    protected field service: ThirdPartyYouTubeLib

    constructor YouTubeManager(service: ThirdPartyYouTubeLib)
        this.service = service

    method renderVideoPage(id)
        info = service.getVideoInfo(id)
        // Render the video page.

    method renderListPanel()
        list = service.listVideos()
        // Render list of video thumbnails.

// Application — wires proxy at startup
class Application
    method init()
        aYouTubeService = new ThirdPartyYouTubeClass()
        aYouTubeProxy = new CachedYouTubeClass(aYouTubeService)
        manager = new YouTubeManager(aYouTubeProxy)
        manager.reactOnUserInput()
```

### Key observations

- `CachedYouTubeClass` implements the same interface as `ThirdPartyYouTubeClass`.
- `YouTubeManager` doesn't know (or care) whether it's talking to a real service
  or a cached proxy.
- The proxy controls when to delegate to the real service vs. return cached data.

---

## Applicability

| Use when …                                                                 | Why                                                             |
| -------------------------------------------------------------------------- | --------------------------------------------------------------- |
| **Lazy initialization** — heavyweight objects should be created on demand. | Virtual Proxy defers creation until the first real request.     |
| **Access control** — only certain clients may use the service.             | Protection Proxy checks credentials before forwarding.          |
| **Remote service** — the service runs on a different machine.              | Remote Proxy handles network details transparently.             |
| **Logging** — you want a history of requests to the service.               | Logging Proxy records each request before delegating.           |
| **Caching** — results are expensive and often repeated.                    | Caching Proxy stores results keyed by request parameters.       |
| **Smart reference** — dismiss a heavyweight object when no clients use it. | Proxy tracks the reference count and frees resources when idle. |

---

## How to Implement

1. If no service interface exists, **create one** to make proxy and service
   interchangeable. If extracting an interface isn't feasible, make the proxy a
   **subclass** of the service.
2. **Create** the proxy class with a field for storing a reference to the service.
   Usually the proxy manages the service's full lifecycle.
3. **Implement** proxy methods according to their purpose. In most cases, after
   doing its work the proxy delegates to the service.
4. Consider a **creation method** (static factory or full factory method) that
   decides whether the client gets a proxy or a real service.
5. Consider **lazy initialization** for the service object itself.

---

## Pros and Cons

### Pros

| Benefit                                                                      |
| ---------------------------------------------------------------------------- |
| Control the service object transparently — clients are unaware of the proxy. |
| Manage the service lifecycle independently of clients.                       |
| Works even when the service isn't ready or available.                        |
| **Open/Closed**: introduce new proxies without changing service or clients.  |

### Cons

| Drawback                                                       |
| -------------------------------------------------------------- |
| Code complexity increases — many new classes.                  |
| Response time may increase due to the extra indirection layer. |

---

## Relations with Other Patterns

| Pattern       | Relationship                                                                                                                                                    |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Adapter**   | Changes the interface. Proxy keeps the *same* interface. Decorator *enhances* the interface.                                                                    |
| **Facade**    | Both buffer complex entities. Facade provides a *different*, simplified interface; Proxy provides the *same* interface and is interchangeable with the service. |
| **Decorator** | Similar structure but different intent. Proxy manages the service **lifecycle** on its own. Decorator composition is **client-controlled**.                     |

---

## Key Takeaways

- Proxy interposes a stand-in object with the **same interface** as the service,
  enabling transparent access control, caching, lazy init, logging, or remote
  access.
- The six common variants (virtual, protection, remote, logging, caching, smart
  reference) all share the same structural recipe but differ in *purpose*.
- Proxy vs. Decorator: both wrap objects, but Proxy owns the lifecycle while
  Decorator defers composition to the client.
- Proxy vs. Facade: Proxy has the same interface (interchangeable); Facade
  provides a new simplified interface.
- The deciding factor for Proxy: you need to add a cross-cutting concern (access,
  lifecycle, caching, logging) without modifying the service class or its
  clients.
