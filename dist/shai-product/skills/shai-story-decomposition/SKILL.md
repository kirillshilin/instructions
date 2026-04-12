---
name: shai-story-decomposition
description: >
  Decompose product features into user stories with BDD acceptance criteria. Takes features from a feature-mapping output or standalone user input and produces individual story files with YAML metadata, user story descriptions, and GIVEN/WHEN/THEN scenarios. Use this skill when the user wants to break features into stories, write user stories, create acceptance criteria, decompose requirements, do story mapping, or when passing output from feature-mapping to task-breakdown. Also triggers on: user stories, story decomposition, BDD scenarios, acceptance criteria, story writing, "break this feature into stories", or "what stories do we need?"
---

# Story Decomposition

Take product features — from a `feature-mapping` output or a standalone description — and decompose them into user stories. Each story captures one small user action with a clear user story statement and 2-3 BDD acceptance criteria in GIVEN/WHEN/THEN format.

This skill sits in the shai-product discovery pipeline:

```
idea-evaluation → feature-mapping → [story-decomposition] → task-breakdown
```

Each story gets its own `{brief-name}.story.md` file in `docs/stories/`, ready for `task-breakdown` (V-S04).

## When to Use

- User has a feature map (`.features.md`) and wants to decompose features into stories
- User describes a feature directly and wants user stories for it
- User asks "what stories do we need for this feature?"
- User wants to write acceptance criteria in BDD format
- User wants to prepare stories for sprint planning or task breakdown
- As the third step in the shai-product pipeline (after `feature-mapping`, before `task-breakdown`)

## Story File Format

Each story is a separate Markdown file: `docs/stories/{brief-name}.story.md`

```markdown
---
id: S-001
subject: "{Parent feature name}"
featureId: F-001
status: 🔴
priority: Must
---

# {Story title}

As a **{role/persona}**, I want to **{goal/need}** so that **{value/benefit}**.

## Acceptance Criteria

**Scenario 1: {Happy path description}**

- **GIVEN** {initial context or precondition}
- **WHEN** {action the user takes}
- **THEN** {expected observable outcome}

**Scenario 2: {Edge case or alternative path}**

- **GIVEN** {context}
- **WHEN** {action}
- **THEN** {outcome}

## Implementation Details

> Optional — include only when architect findings or technical constraints are relevant.

- {Architecture decision or constraint from `@shai-architect`}
- {Technical dependency or integration note}
- {Reference to architecture document if available}
```

### Metadata Fields

| Field       | Required | Description                                                       |
| ----------- | -------- | ----------------------------------------------------------------- |
| `id`        | Yes      | Sequential ID: S-001, S-002... Global counter across all features |
| `subject`   | Yes      | Parent feature name from the feature map                          |
| `featureId` | Yes      | Reference to the feature ID (F-001) from feature-mapping          |
| `status`    | Yes      | 🔴 Not started · 🟡 In progress · 🟢 Done                         |
| `priority`  | Yes      | Inherited from the parent feature's MoSCoW: Must / Should / Could |

### Naming Convention

The filename `{brief-name}` should be:

- Lowercase, hyphenated slug
- 2-5 words describing the user action
- Examples: `create-board.story.md`, `filter-by-date.story.md`, `invite-collaborator.story.md`

## Workflow

### Progress Reporting (mandatory)

At the start of each workflow step, output a progress indicator in bold blue:

**🔹 Step M/N — {Step title}**

where M is the current step number and N is the total number of steps in the workflow. This is mandatory for every step — never skip it.

### Step 1: Ingest the Input

Determine the input source and load context.

**Option A — Pipeline input (`.features.md` + `.feature.md` files):** Read the feature map index from `docs/features/`. Check `docs/features/features.md` for available feature maps if the user doesn't specify a file. Extract:

- Feature reference table from the `{name}.features.md` index (IDs, names, domains, MoSCoW, dependencies)
- Individual feature details by reading each `{id}-{feature-name}.feature.md` file (descriptions, acceptance signals, dependencies)
- Domain groupings and industry context from the index
- Implementation roadmap (build order)

Load persona information from `docs/product/personas.md` — the shared persona reference produced by `idea-evaluation`. This contains all personas with roles, goals, and pain points that feed directly into the "As a **{role}**" part of stories. If `personas.md` doesn't exist, fall back to reading the corresponding `.idea.md` from `docs/product/` and extracting the "Target Audience" section.

Confirm with the user:

> "I've loaded the feature map for **{product name}**. It has {N} features across {M} domains. I'll also use the personas from the idea evaluation. Which features should I decompose — all of them, or a specific subset?"

**Option B — Standalone input (description or conversation):** If no `.features.md` is provided, gather the essentials:

- What's the feature or capability? (description)
- Who are the users/roles? (at least one persona)
- What's the priority? (Must/Should/Could)

Use `vscode/askQuestions` for structured choices where helpful.

### Step 2: Interview — Personas & Scope

Even with pipeline input, validate the personas and scope before writing stories.

**Persona validation:**

| #   | Question                                                                                                                  |
| --- | ------------------------------------------------------------------------------------------------------------------------- |
| 1   | "I loaded these personas from `personas.md`: {list}. Are these the right roles for stories, or should we add/modify any?" |
| 2   | "Are there internal roles (admin, moderator, support agent) that also need stories?"                                      |
| 3   | "For multi-role features, which persona's perspective is primary?"                                                        |

**Scope calibration:**

| #   | Question                                                                                                                                              |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| 4   | "Each story should capture one small user action (e.g., 'filter results by date'). Does that granularity feel right, or do you want broader stories?" |
| 5   | "Should infrastructure features (auth, notifications, error handling) get user-facing stories, or skip them for now?"                                 |
| 6   | "For features with dependencies (F-003 depends on F-001) — should the stories reference those dependencies, or keep them independent?"                |

**BDD calibration:**

| #   | Question                                                                                                                  |
| --- | ------------------------------------------------------------------------------------------------------------------------- |
| 7   | "Each story gets 2-3 BDD scenarios. Typically: happy path + one edge case or error case. Want a different mix?"           |
| 8   | "Should BDD scenarios be high-level (business language) or include UI-specific details (button clicks, page navigation)?" |

After the interview, summarize what changed:

> "Based on our conversation, I'm adding {N} personas, adjusting scope to {description}, and using {business/UI-level} BDD language."

### Step 3: Decompose Features into Stories

For each feature in scope, identify the user stories. Think about the feature from each relevant persona's perspective.

**Decomposition heuristic — the CRUD+ lens:**

For each feature, ask:

1. **Create** — Can the user create/start something? → story
2. **Read** — Can the user view/browse/search something? → story
3. **Update** — Can the user edit/modify something? → story
4. **Delete** — Can the user remove/archive something? → story
5. **Share** — Can the user share/export/invite? → story
6. **Configure** — Can the user set preferences/settings? → story

Not every feature maps to all six — use the lens to ensure you don't miss obvious stories, not to force them.

**Story sizing check:** Each story should represent one small user action or screen interaction. If a story feels like it needs more than 3 acceptance criteria, it's too big — split it.

Present the story list per feature before writing full stories:

```
## Feature: F-001 — {Feature Name}

Stories identified:
1. S-001: {Title} — As a {role}, I want to {goal}...
2. S-002: {Title} — As a {role}, I want to {goal}...
3. S-003: {Title} — As a {role}, I want to {goal}...
```

Ask the user to confirm, add, or remove stories before writing the full files.

### Step 4: Write Story Files

For each confirmed story, generate the `.story.md` file.

**Writing the user story statement:**

Use the format: "As a **{role/persona}**, I want to **{goal/need}** so that **{value/benefit}**."

- **Role**: Use the persona name or role from the idea evaluation, not generic "user"
  - ✅ "As a **project manager**" or "As a **free-tier user**"
  - ❌ "As a **user**" (too vague — unless there's genuinely one role)
- **Goal**: Specific, observable action — what the user does
  - ✅ "I want to **filter dashboard widgets by date range**"
  - ❌ "I want to **use the dashboard**" (too broad)
- **Value**: Business value or user benefit — why this matters
  - ✅ "so that **I can focus on this week's metrics without scrolling through historical data**"
  - ❌ "so that **it works**" (not a benefit)

**Writing BDD acceptance criteria:**

Each story gets 2-3 scenarios maximum. Follow these rules:

1. **First scenario = happy path.** The most common, successful interaction.
2. **Second scenario = error case or edge case.** What happens when something goes wrong or input is unusual.
3. **Third scenario (optional) = alternative path.** A valid but less common way to accomplish the goal.

BDD writing rules:

- **Declarative, not imperative.** Describe what, not how. "Given the user is logged in" not "Given the user types their password and clicks Login."
- **Business language.** Use domain terms, not UI elements. "When the user applies a date filter" not "When the user clicks the date picker dropdown."
- **One behavior per scenario.** If you're testing two things, write two scenarios.
- **Concrete examples over abstract rules.** "Given a cart total of $100" not "Given some items in the cart."

```markdown
**Scenario 1: Successfully filter by date range**

- **GIVEN** the user is on the analytics dashboard with 90 days of data
- **WHEN** the user applies a date filter for "Last 7 days"
- **THEN** only data from the last 7 days is displayed and the filter selection is persisted

**Scenario 2: Invalid date range**

- **GIVEN** the user is on the analytics dashboard
- **WHEN** the user sets a start date after the end date
- **THEN** a validation message explains the issue and the filter is not applied
```

**Writing implementation details (optional):**

Include this section only when there are relevant technical constraints or architect findings. Don't fabricate implementation details — leave the section out if there's nothing meaningful to say.

Sources for implementation details:

- Architecture decisions from `@shai-architect` (C-A01) consultations
- Technical dependencies identified in the feature map
- Infrastructure constraints (e.g., "requires WebSocket support", "depends on the search index")
- Cross-feature dependencies from the dependency graph

### Step 5: Generate Stories Index

After writing all story files, create or update `docs/stories/stories.md` — a reference index listing all stories.

```markdown
# Stories

Index of all user stories.

| ID    | Story         | Feature        | Feature ID | Priority | Status | File                                           |
| ----- | ------------- | -------------- | ---------- | -------- | ------ | ---------------------------------------------- |
| S-001 | {Story title} | {Feature name} | F-001      | Must     | 🔴     | [{brief-name}.story.md]({brief-name}.story.md) |
| S-002 | {Story title} | {Feature name} | F-001      | Must     | 🔴     | [{brief-name}.story.md]({brief-name}.story.md) |
| ...   |               |                |            |          |        |                                                |

**Total stories**: {N} ({Must count} Must, {Should count} Should, {Could count} Could) **Features covered**: {N} of {total features}
```

If `stories.md` already exists, append new rows to the existing table — don't overwrite previous entries.

### Step 6: Review & Handoff

Present the full output to the user:

1. Story count summary per feature
2. Full content of each `.story.md` file
3. The stories index

Ask:

> "Stories complete! {N} stories across {M} features. Ready to pass these to **`/shai-task-breakdown`**, or do you want to adjust anything?"

**Optional architect consult:**

> "Some stories touch complex technical territory. Want me to suggest calling **`@shai-architect`** (C-A01) to add implementation details to the riskier ones?"

## Gotchas

- **Stories ≠ tasks.** "User can filter by date" is a story. "Add date picker component" is a task. Stay at the user intent level — task breakdown comes next (V-S04).
- **2-3 BDD scenarios max.** If a story needs 5 scenarios, it's too big. Split it into smaller stories. Comprehensive edge case coverage belongs in the testing phase, not story definition.
- **Don't use generic "user" as the role.** Use the actual persona names from the idea evaluation. If there's genuinely only one role, use a descriptive term ("board creator", "viewer").
- **Declarative BDD, not imperative.** "Given the user has a premium account" not "Given the user clicks Settings, then clicks Upgrade, then enters payment...". Stories describe behavior, not UI steps.
- **Subject = feature name, not domain.** The `subject` metadata field is the parent feature name (e.g., "Real-Time Collaboration"), not the domain (e.g., "Collaboration"). This links stories directly to their feature card.
- **Implementation details are optional.** Only include them when architect findings or real technical constraints exist. Empty "Implementation Details" sections are worse than no section at all.
- **Story IDs are global.** S-001, S-002... across all features, not per-feature. This makes it easy to reference stories from task breakdown without ambiguity.
- **Pipeline personas are a starting point.** The `personas.md` entries are great defaults, but some features surface new roles (admin, moderator, API consumer) that weren't in the original evaluation. Add them during the interview — and update `docs/product/personas.md` with any new personas discovered.
- **Keep it fun.** Like feature mapping, this is product discovery. Be opinionated about which stories matter most, flag stories that feel like "checkbox features" vs. genuinely valuable ones.
