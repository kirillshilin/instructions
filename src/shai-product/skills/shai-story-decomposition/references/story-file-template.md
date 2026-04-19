# Story File Template

Use this template for every story file at `docs/stories/{brief-name}.story.md`.

## Full Template

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

> Optional - include only when architect findings or technical constraints are relevant.

- {Architecture decision or constraint from `@shai-architect`}
- {Technical dependency or integration note}
- {Reference to architecture document if available}
```

## Metadata Fields

| Field       | Required | Description                                                       |
| ----------- | -------- | ----------------------------------------------------------------- |
| `id`        | Yes      | Sequential ID: S-001, S-002... Global counter across all features |
| `subject`   | Yes      | Parent feature name from the feature map                          |
| `featureId` | Yes      | Reference to the feature ID (F-001) from feature-mapping          |
| `status`    | Yes      | 🔴 Not started · 🟡 In progress · 🟢 Done                            |
| `priority`  | Yes      | Inherited from the parent feature's MoSCoW: Must / Should / Could |

## File Naming

The filename `{brief-name}` should be:

- Lowercase, hyphenated slug
- 2-5 words describing the user action
- Examples: `create-board.story.md`, `filter-by-date.story.md`, `invite-collaborator.story.md`
