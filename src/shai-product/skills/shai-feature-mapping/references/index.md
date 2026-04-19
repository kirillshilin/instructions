```markdown
# {Idea Name} — Feature Map

> {One-liner: what features this product needs and how they're organized.}

## Feature Reference

| ID    | Feature                           | Domain   | MoSCoW | RICE    | Depends On | Status |
| ----- | --------------------------------- | -------- | ------ | ------- | ---------- | ------ |
| F-001 | [{name}](f-001-{slug}.feature.md) | {domain} | Must   | {score} | —          | 🔴      |
| F-002 | [{name}](f-002-{slug}.feature.md) | {domain} | Must   | {score} | F-001      | 🔴      |
| F-003 | [{name}](f-003-{slug}.feature.md) | {domain} | Should | {score} | F-001      | 🔴      |
| ...   |                                   |          |        |         |            |        |

**Total features**: {N} ({Must count} Must, {Should count} Should, {Could count} Could, {Won't count} Won't)

## Domain: {Domain Name}

> {1-2 sentence domain description. What area of the product this covers and why it exists as a distinct domain.}

**Industry context**: {Brief web-research insight — what leading products do in this domain, or common patterns to be aware of.}

**Features:**
- [{F-001: Feature Name}](f-001-{slug}.feature.md)
- [{F-002: Feature Name}](f-002-{slug}.feature.md)

## Domain: {Domain Name 2}

...

_(Repeat for all domains.)_

## Dependency Graph

{Mermaid diagram showing feature dependencies.}

**Enabler features** (many others depend on these — build first):

- F-001: {name} — depended on by {N} features
- F-00N: {name} — depended on by {N} features

**Blocked features** (waiting on dependencies):

- F-00N: {name} — blocked by {list}

## Implementation Roadmap

Suggested build order based on dependency chains and RICE scores.

### Phase 1: Foundation (Must-have enablers)

| Order | ID    | Feature | RICE    | Rationale              |
| ----- | ----- | ------- | ------- | ---------------------- |
| 1     | F-001 | {name}  | {score} | {Why build this first} |
| 2     | F-00N | {name}  | {score} | {Why}                  |

### Phase 2: Core Experience (Must-haves)

| Order | ID  | Feature | RICE | Rationale |
| ----- | --- | ------- | ---- | --------- |
| ...   |     |         |      |           |

### Phase 3: Differentiation (Should-haves with high RICE)

| Order | ID  | Feature | RICE | Rationale |
| ----- | --- | ------- | ---- | --------- |
| ...   |     |         |      |           |

### Phase 4: Polish (Could-haves)

| Order | ID  | Feature | RICE | Rationale |
| ----- | --- | ------- | ---- | --------- |
| ...   |     |         |      |           |

## Next Steps

This feature map is ready for **`/story-decomposition`** — pass it as input to break features into user stories.

For architecture decisions on technically complex features, consult **`@shai-architect`** (C-A01).
```
