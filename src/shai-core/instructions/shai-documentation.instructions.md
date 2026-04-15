---
applyTo: "docs/**/*.md"
---

# Documentation Standards

Guidelines for project documentation in `docs/`. The goal: give humans and AI a quick introduction to what we're building and a navigable reference to key aspects. Documentation is a living mechanism — it evolves with the codebase.

## Philosophy

- **Start flat, grow as needed** — begin with a single `README.md` per folder. Extract sections to numbered files only when a README exceeds ~300 lines.
- **README is the entry point** — every `docs/` folder has a `README.md` that orients the reader and links to detailed docs when they exist.
- **Document what exists** — describe the actual system, not aspirational architecture. Flag gaps with `<!-- TODO: ... -->` rather than inventing content.
- **Serve two audiences** — humans skim for context, AI agents parse for structure. Use headings, tables, and links — not walls of prose.
- **Numbering = reading order** — prefixed files (NN-name.md) tell the reader which doc to read first, second, third.

## File Organization

All project documentation lives in `docs/` at the repository root.

```
docs/
├── README.md                     ← entry point, links to everything
├── 01-getting-started.md         ← extracted when README grew too long
├── 02-data-structure.md
├── 03-user-flows.md
└── adr/                          ← subfolder (also has its own README.md)
    └── README.md
```

### Naming rules

- Prefix files with two-digit numbers: `01-`, `02-`, `03-` — this sets reading order.
- Use lowercase kebab-case after the prefix: `04-business-flow.md`, not `04 Business Flow.md`.
- `README.md` is the only exception — no number prefix, always PascalCase.
- Keep names short and descriptive. The heading inside the file carries the full title.

### When to extract from README

A section in `README.md` should be extracted to its own numbered file when:

1. The README exceeds ~300 lines total, AND
2. The section being extracted is self-contained (can be read independently).

After extraction, replace the section in `README.md` with a one-line summary and a link:

```markdown
## Data Structure

Overview of database models, entities, and relationships. → [02-data-structure.md](02-data-structure.md)
```

### Subfolder conventions

- Each subfolder (`docs/adr/`, `docs/api/`) gets its own `README.md` as entry point.
- Numbered files within subfolders use their own sequence (01-, 02-) independent of the parent.

## README.md Structure

Every `docs/README.md` follows this skeleton. Include only sections that apply to the project's current maturity — don't add empty placeholder sections.

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

When the project is small enough that README.md covers everything, skip the Documentation table entirely. Add it when you create the first extracted file.

## Application Documentation

Applications need documentation that covers both the "what" and the "how." Include these sections based on the project's maturity — start with the first two and expand as the application grows.

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

**Purpose & Audience** — lead with the problem being solved, not the tech. List 3-5 key features. Name the target audience explicitly.

**Data Structure** — use tables for schema. For relational databases, show tables and relationships. For Firebase/NoSQL, show collection structure and document shapes as nested code blocks. Always include the actual field names and types from the codebase.

**Business / Process Flow** — describe the core business processes as numbered steps or state transitions. Use Mermaid diagrams for complex flows when the tool supports rendering them.

**User Flows** — describe what the user does, not how the code works. "User submits the form → sees confirmation → receives email" not "Component calls API → saga dispatches → reducer updates."

**Data Flow** — trace where data originates, how it's transformed, and where it's persisted or sent. Name the actual services, APIs, and data stores.

**Implementation & Technical** — stack table (layer / technology / version), annotated directory tree (top 2 levels), deployment process, environment variables needed.

## Library Documentation

{rules/library-documentation.rule.md}

## Numbered File Guidelines

Suggested numbering for common documentation sections. Adapt to your project — these are starting points, not mandates.

### Application projects

| Number | Section         | Typical content                                |
| ------ | --------------- | ---------------------------------------------- |
| 01     | Getting Started | Prerequisites, install, first run              |
| 02     | Data Structure  | Database, models, entities, document structure |
| 03     | Business Flow   | Core processes, state machines                 |
| 04     | User Flows      | Key user journeys                              |
| 05     | Data Flow       | Sources, transforms, mutations                 |
| 06     | Implementation  | Architecture, stack, directory, deployment     |

### Library projects

| Number | Section         | Typical content                             |
| ------ | --------------- | ------------------------------------------- |
| 01     | Getting Started | Install, basic usage, quick example         |
| 02     | API Reference   | Public API with signatures, params, returns |
| 03     | Examples        | Real-world usage patterns                   |
| 04     | Migration Guide | Breaking changes between versions           |

## shai-product Integration

When the project uses shai-product discovery tools, their outputs live alongside documentation:

```
docs/
├── README.md
├── product/                     ← idea evaluations, personas
│   └── *.idea.md
├── features/                    ← feature maps
│   └── *.feature.md
├── stories/                     ← user stories with BDD criteria
│   └── *.story.md
└── tasks/                       ← PR-scoped dev tasks
    └── *.task.md
```

When these assets exist, consider adding a "Product Discovery" section to `docs/README.md` that links to the relevant index files. This helps new contributors understand not just what the system does, but why it was built that way.

## Gotchas

- Don't create empty placeholder docs — a `02-data-structure.md` with just a heading and "TODO" adds noise, not value. Keep it in README until there's real content to extract.
- Don't duplicate content across docs — if the same info appears in README.md and a numbered file, one of them is already stale. Pick one location and link from the other.
- Avoid deep nesting — `docs/api/v2/internal/utils/README.md` is a sign the docs mirror code structure too closely. Docs should mirror concepts, not directories.
- Version numbers in docs go stale fast — reference `package.json` or lock files instead of hardcoding versions, or flag them with a comment: `<!-- keep in sync with package.json -->`.
