
# Documentation Standards

Write docs that are easy to scan, easy to maintain, and accurate to the current codebase.

## Philosophy

- **Start flat, grow when needed**: begin with `README.md`; extract sections only after ~300 lines.
- **README is the index**: every docs folder has a `README.md` with links to deeper files.
- **Document reality**: describe current behavior; use `<!-- TODO: ... -->` for gaps.
- **Optimize for scanning**: use headings, short bullets, and tables.
- **Use numbered files for order**: `01-`, `02-`, `03-` defines reading flow.

## File Organization

Keep project docs in `docs/`.

```
docs/
├── README.md
├── 01-getting-started.md
├── 02-data-structure.md
├── 03-user-flows.md
└── adr/
    └── README.md
```

### Naming rules

- Use two-digit prefixes for ordered docs: `01-`, `02-`, `03-`.
- Use kebab-case after the prefix: `04-business-flow.md`.
- `README.md` is the only unnumbered filename.
- Keep filenames short; put long titles in headings.

### When to extract from README

Extract a section into its own file when both are true:

1. `README.md` is around or above 300 lines.
2. The section is self-contained.

After extraction, leave a one-line summary and link:

```markdown
## Data Structure

Overview of database models, entities, and relationships. → [02-data-structure.md](02-data-structure.md)
```

### Subfolder conventions

- Each subfolder (`docs/adr/`, `docs/api/`) has its own `README.md`.
- Numbering inside a subfolder is local to that folder.

## README.md Structure

Use this skeleton for `docs/README.md`. Include only sections that apply.

```markdown
# {Project Name}

> {One-sentence purpose statement.}

## Overview

{2-3 paragraphs: what this project does, who it's for, and why it exists. Include key features as a bullet list when there are more than three.}

## Quick Start

{Minimal steps to run the project locally — clone, install, run.}

## Documentation

| #   | Document                                 | Description                          |
| --- | ---------------------------------------- | ------------------------------------ |
| 01  | [Getting Started](01-getting-started.md) | Setup, prerequisites, first run      |
| 02  | [Data Structure](02-data-structure.md)   | Database schema, models, entities    |
| 03  | [User Flows](03-user-flows.md)           | Key user journeys through the system |

{Only list documents that actually exist. Add rows as docs are created.}
```

If `README.md` covers everything, skip the Documentation table.

## Application Documentation

Applications usually need both product context and technical behavior.

### Core sections

| Section                        | When to include                    | Covers                                                           |
| ------------------------------ | ---------------------------------- | ---------------------------------------------------------------- |
| **Purpose & Audience**         | Always                             | What the app does, key features, who it's for                    |
| **Data Structure**             | When there's a database or models  | Database schema, entities, relationships, Firebase doc structure |
| **Business / Process Flow**    | When there are non-trivial flows   | Core business processes, state machines, approval chains         |
| **User Flows**                 | When there are distinct user paths | Key user journeys — step-by-step through the UI                  |
| **Data Flow**                  | When data moves between systems    | Sources, transformations, mutations, integrations                |
| **Implementation & Technical** | When architecture isn't obvious    | Stack, directory structure, key modules, deployment, config      |

### Writing guidance per section

- **Purpose & Audience**: lead with the problem. Name audience and 3-5 key features.
- **Data Structure**: use schema tables. Include real field names and types.
- **Business / Process Flow**: use ordered steps or states. Use Mermaid for complex flows.
- **User Flows**: describe user actions and outcomes, not implementation internals.
- **Data Flow**: show source, transforms, destination, and external integrations.
- **Implementation & Technical**: include stack table, top-level structure, deployment, and required env vars.

## Library Documentation

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


## Gotchas

- Don't create empty placeholder files.
- Don't duplicate the same content in multiple docs.
- Avoid deep nesting that mirrors source folders.
- Avoid hardcoded versions unless explicitly maintained.
