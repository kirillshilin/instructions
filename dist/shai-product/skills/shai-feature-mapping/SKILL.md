
# Feature Mapping

Take raw product capabilities — from a `idea-evaluation` report or a standalone idea description — and map them into a structured, domain-grouped feature set. The output is a `docs/features/{name}.features.md` reference index plus individual `docs/features/{feature-name}.feature.md` files for each feature, ready for `story-decomposition` (V-S03).

This skill sits in the middle of the shai-product discovery pipeline:

```
idea-evaluation → [feature-mapping] → story-decomposition → task-breakdown
```

The goal is to turn vague capabilities into features that are concrete enough to decompose into stories, but not so detailed that they prescribe implementation. Think "what the product does" — not "how the code works."

## When to Use

- User has raw capabilities from `idea-evaluation` and wants to formalize them
- User describes a product idea and wants to map its features directly
- User asks "what features do we need for X?"
- User wants to organize capabilities into domain areas
- User wants to prioritize features with RICE scoring
- User wants a dependency graph between features
- As the second step in the shai-product pipeline (after `idea-evaluation`, before `story-decomposition`)

## Workflow

<!-- missing: ../../../shared/\_progress.partial.md -->

### Step 1: Ingest the Input

Determine the input source and load context.

**Option A — Pipeline input (`.idea.md` file):** Read the idea evaluation report from `docs/product/`. Check `docs/product/ideas.md` for available evaluations if the user doesn't specify a file. Extract:

- Core Concept (problem, solution, why now)
- Target personas — read from `docs/product/personas.md` (the shared persona reference produced by `idea-evaluation`). Fall back to the `.idea.md` "Target Audience" section if `personas.md` doesn't exist.
- User Journey Map
- Capabilities list (the raw material)
- MoSCoW priorities (initial signal, not final)
- Competitive landscape and killer feature
- Technical feasibility signals

Confirm with the user:

> "I've loaded the idea evaluation for **{idea name}**. It lists {N} capabilities across {M} domains. Let me review these with you before mapping."

**Option B — Standalone input (description or conversation):** If no `.idea.md` is provided, gather the essentials:

- What's the product idea? (one-liner)
- Who are the primary users? (1-2 personas)
- What are the must-have capabilities? (brainstorm list)

Use `vscode/askQuestions` for structured choices where helpful.

### Step 2: Interview — Validate & Expand

This is a full conversation round to validate the input and surface features the user hasn't thought of yet. Ask at least 10 questions, drawn from these categories. Adapt based on answers — don't just fire a list.

**Capability validation:**

| #   | Question |
| --- | -------- |

**Domain discovery:**

| #   | Question                                                                                                      |
| --- | ------------------------------------------------------------------------------------------------------------- |
| 4   | "How would you naturally group these capabilities? What 'areas' of the product do you see?"                   |
| 5   | "Is there a domain that feels underrepresented — something the idea evaluation missed?"                       |
| 6   | "Are there administrative or operational features (settings, billing, analytics) that need their own domain?" |

**Gap analysis:**

| #   | Question                                                                                                |
| --- | ------------------------------------------------------------------------------------------------------- |
| 7   | "What does the user do on their very first visit? Is there an onboarding domain?"                       |
| 8   | "How do users collaborate or share? Is there a social/collaboration domain?"                            |
| 9   | "What happens when things go wrong — errors, edge cases, abuse? Do we need a safety/moderation domain?" |

**Competitive edge:**

| #   | Question                                                                                                                  |
| --- | ------------------------------------------------------------------------------------------------------------------------- |
| 10  | "Which feature would make a competitor's user switch to your product? What's the 'can't-get-this-anywhere-else' feature?" |
| 11  | "Are there features that competitors have that you deliberately want to skip? What's your 'anti-feature'?"                |

**Cross-cutting concerns:**

| #   | Question                                                                                                         |
| --- | ---------------------------------------------------------------------------------------------------------------- |
| 12  | "Are there cross-cutting capabilities (auth, notifications, search, analytics) that multiple domains depend on?" |
| 13  | "Does the product need an API or integration layer for third-party tools?"                                       |

After the interview, summarize what changed:

> "Based on our conversation, I'm adding {N} new features, moving {M} to a later phase, and creating a new **{domain}** domain. Here's the updated scope."

### Step 3: Domain Mapping

Group all validated capabilities into domain areas. A domain is a cohesive area of the product that owns a set of related features.

**Guidelines for domain boundaries:**

- Domains should be recognizable to a non-technical stakeholder
- Cross-cutting concerns (auth, notifications, search) get their own domain
- Use names that describe what the domain does, not how it's built
  - ✅ "Collaboration", "Content Management", "Analytics"
  - ❌ "WebSocket Module", "Database Layer", "API Gateway" Present the domain map to the user for feedback before proceeding:

````
## Domain Map


**What to look for per domain:**

- Do leading products in this space have similar features?
- Are there standard patterns or table-stakes features we're missing?
- Are there innovative approaches we should consider?
- What are common pitfalls in this domain?

Keep research focused — 1-2 searches per domain, not a full market study. Summarize findings briefly in each domain's section of the output.

### Step 5: Feature Cards

For each feature, create a structured card saved as its own file: `docs/features/{id}-{feature-name}.feature.md`. Features get sequential IDs (F-001, F-002, ...) assigned in domain order.

The filename combines the lowercase ID and a hyphenated slug (2-5 words). Examples: `f-001-auth-identity.feature.md`, `f-002-real-time-collaboration.feature.md`, `f-003-content-editor.feature.md`.

**Feature file format:**

Before writing feature files, read this reference first:

- `references/feature.template.md`

### Feature file metadata fields

| Field      | Required | Description                                    |
| ---------- | -------- | ---------------------------------------------- |
| `name`     | Yes      | Human-readable feature name                    |
| `priority` | Yes      | MoSCoW priority: Must / Should / Could / Won't |
| `status`   | Yes      | 🔴 Not started · 🔵 In progress · 🟢 Done      |

**RICE scoring guide:**

| Factor         | Scale                  | Description                                                                |
| -------------- | ---------------------- | -------------------------------------------------------------------------- |
| **Reach**      | 1-10                   | How many users/sessions does this affect per quarter? (1=few, 10=everyone) |
| **Impact**     | 0.25 / 0.5 / 1 / 2 / 3 | How much does this move the needle per user? (0.25=minimal → 3=massive)    |
| **Confidence** | 0.5 / 0.8 / 1.0        | How sure are we about these estimates? (0.5=low → 1.0=high)                |
| **Effort**     | 1-10                   | Person-weeks of work (1=trivial → 10=quarter-long project)                 |

Formula: `(Reach × Impact × Confidence) / Effort`

Be opinionated about scores — don't hedge everything at "medium." If a feature is a game-changer, give it a 3 impact. If it's a nice-to-have, give it a 0.5.

### Step 6: Dependency Graph

After all features are defined, build an explicit dependency graph. This shows which features must exist before others can work.

**Format — Mermaid diagram:**

```mermaid
graph TD
    F-001[Auth & Identity] --> F-003[User Profiles]
    F-001 --> F-005[Collaboration]
    F-002[Content Editor] --> F-006[Sharing]
    F-003 --> F-005
````

**Rules for dependencies:**

- Only include true technical or logical dependencies, not "nice to have first"
- A feature depends on another if it literally cannot function without it
- Avoid circular dependencies — if you find one, the features need restructuring
- Cross-cutting features (auth, core data model) naturally sit at the root

After presenting the graph, flag any features that are "blocked" (have unmet dependencies) and any that are "enablers" (many features depend on them).

### Step 7: Assemble the Feature Map

By this point, individual `.feature.md` files have been written in Step 5. Now compile the overview into `docs/features/{name}.features.md`. Create the `docs/features/` directory if it doesn't exist. This file is the **reference index only** — it does not repeat feature details. The structure is:

1. **Feature Reference Table** — summary of all features with IDs, file links, domains, MoSCoW, RICE scores, and status
2. **Domain sections** — domain descriptions with industry context and links to feature files (no inline feature cards)
3. **Dependency graph** — the Mermaid diagram
4. **Implementation roadmap** — suggested build order based on dependencies and RICE scores

**Update the reference file:** After writing the `.features.md` file, update (or create) `docs/features/features.md` — a reference index that lists all feature maps. Use this format:

```markdown
# Features

Index of all product feature maps.

| Product     | File                                     | Date         | Features | Must    | Should  | Could   | Won't   |
| ----------- | ---------------------------------------- | ------------ | -------- | ------- | ------- | ------- | ------- |
| {Idea Name} | [{name}.features.md]({name}.features.md) | {YYYY-MM-DD} | {total}  | {count} | {count} | {count} | {count} |
```

Append a new row for each feature map. If `features.md` already exists, add the row to the existing table — don't overwrite previous entries.

Present the full output to the user and ask:

> "Feature map complete! Ready to pass this to **`/story-decomposition`**, or do you want to adjust anything?"

**Optional architect consult:**

> "Some features touch complex technical territory. Want me to suggest calling **`@shai-architect`** (C-A01) for technical feasibility on the riskier ones?"

## Output Templates

### Individual feature file: `docs/features/f-001-{feature-name}.feature.md`

To write the individual feature file or create `docs/features/f-001-{feature-name}.feature.md`, use this template:

- [references/feature.template.md](references/feature.template.md)

### Feature map index: `docs/features/{name}.features.md`

Before writing the feature map index, read this reference first:

- `references/index.md`

**Output location:** `docs/features/` — one `{name}.features.md` index + one `{id}-{feature-name}.feature.md` per feature

## Gotchas

- **One feature = one file.** Each feature gets its own `{id}-{feature-name}.feature.md` with YAML frontmatter (name, priority, status). The main `.features.md` is a reference index only — no inline feature details. This mirrors how stories get individual `.story.md` files.
- **Features ≠ implementation tasks.** "User can share a board via link" is a feature. "Set up WebSocket server" is a task. Stay at the user-facing level.
- **Don't inflate RICE scores.** Be honest. A feature that affects 50 users per quarter gets Reach 2, not 8. Overly optimistic scores defeat the purpose.
- **Domain count sweet spot is 4-7.** Fewer means you're lumping unrelated things together. More means you're splitting hairs. If you hit 8+ domains, reconsider boundaries.
- **Dependencies should be sparse.** If every feature depends on 3 others, the graph is too tangled. Most features should have 0-2 dependencies. If not, the feature boundaries need work.
- **MoSCoW from idea eval is a starting point, not gospel.** The interview may reveal that a "Could" is actually a "Must" (or vice versa). Re-evaluate.
- **Cross-cutting features are easy to forget.** Auth, error handling, notifications, search, settings — these don't come from user stories but everything depends on them. Ask about them explicitly.
- **Don't skip web research.** 5 minutes of validation per domain saves hours of building the wrong thing. Look for table-stakes features you're missing.
- **The dependency graph reveals build order.** Features with no dependencies and many dependents are your Phase 1. Features with many dependencies are your Phase 3+. Let the graph guide the roadmap, don't force it.
- **Keep it fun.** This is product discovery, not a compliance audit. Be opinionated, have opinions about which features are exciting vs. boring, and help the user see the shape of their product.

## Related

- Skill: `shai-idea-evaluation` (V-S01)
- Skill: `shai-story-decomposition` (V-S03)
