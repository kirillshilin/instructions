Each task is a separate Markdown file: `docs/tasks/{slug}.task.md`

```markdown
---
id: T-001
storyId: S-001
type: feature
layer: fullstack
effort: M
status: 🔴
dependencies: []
---

# {Task title}

> {One-sentence summary of what this task delivers and why it matters.}

## What to Do

- {Concrete implementation step 1}
- {Concrete implementation step 2}
- {Concrete implementation step 3}

## Acceptance Criteria

- [ ] {Observable, testable criterion 1}
- [ ] {Observable, testable criterion 2}
- [ ] {Observable, testable criterion 3}

## PR Template

**Title**: `{type}({scope}): {short description}`

**Description**:
> {2-3 sentence PR description explaining the change, why it's needed, and what it enables.}
>
> Story: S-001 — {story title}
> Task: T-001

## Notes

- {Technical consideration, gotcha, or dependency detail — optional}
```
