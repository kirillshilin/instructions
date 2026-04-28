### Library Documentation

Libraries need documentation that helps consumers adopt them quickly. The focus shifts from "what the app does" to "what the API offers."

#### README.md for libraries

Library `docs/README.md` emphasizes quick adoption:

```markdown
# {Library Name}

> {One-sentence: what problem this library solves.}

## Install

{Package manager command.}

## Quick Example

{10-20 lines of code showing the primary use case.}

## API Overview

{Brief table of the main exports — name, purpose, link to details.}

## Documentation

| #   | Document                                 | Description                   |
| --- | ---------------------------------------- | ----------------------------- |
| 01  | [Getting Started](01-getting-started.md) | Install, setup, first example |
| 02  | [API Reference](02-api-reference.md)     | Full public API documentation |
| 03  | [Examples](03-examples.md)               | Real-world usage patterns     |
```

#### API Reference format

Document every public export. For each function, class, or type:

```markdown
### `functionName(param1, param2)`

{One-sentence description of what it does.}

**Parameters:**

| Name   | Type      | Required | Description        |
| ------ | --------- | -------- | ------------------ |
| param1 | `string`  | Yes      | What this param is |
| param2 | `Options` | No       | Configuration      |

**Returns:** `ResultType` — {brief description}

**Example:**
```typescript
const result = functionName('input', { timeout: 5000 });
```
```

#### Changelog conventions

- Keep a `CHANGELOG.md` at the repository root (not in `docs/`).
- Group entries by version, newest first.
- Use categories: **Added**, **Changed**, **Deprecated**, **Removed**, **Fixed**.
- Reference the PR or issue number for each entry when available.
- Follow [Keep a Changelog](https://keepachangelog.com/) format.
