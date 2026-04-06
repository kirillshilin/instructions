---
name: pm-feature-spec
description: >
  Write structured product requirements documents (PRDs) with problem statements,
  user stories, prioritised requirements, and success metrics.
  Use this skill when speccing a new feature, writing a PRD, defining acceptance
  criteria, or documenting product decisions.
---

# PM Feature Spec

## When to Use

- Writing a feature specification or PRD from a problem statement or idea.
- Defining user stories and acceptance criteria for a new capability.
- Prioritising requirements using MoSCoW (Must / Should / Could / Won't).
- Documenting goals, non-goals, and success metrics for a product initiative.
- Preventing scope creep by explicitly stating what is out of scope.

## Process

1. **Clarify the problem** — confirm the user problem, who experiences it,
   how often, and the cost of not solving it. Ground in evidence: user
   research, support data, metrics, or customer feedback.

2. **Define goals and non-goals** — write 3–5 specific, measurable outcomes
   (goals) and 3–5 things this feature explicitly will not do (non-goals).
   Goals should be outcomes, not outputs.

3. **Write user stories** — use the format:
   "As a [user type], I want [capability] so that [benefit]."
   Cover primary users, edge cases, and error states. Order by priority.

4. **Categorise requirements using MoSCoW**:
   - **Must-Have (P0)** — the feature cannot ship without these.
   - **Should-Have (P1)** — improves the experience but not required for launch.
   - **Could-Have (P2)** — desirable if time permits.
   - **Won't-Have** — explicitly out of scope; document why.
   For each requirement, include acceptance criteria in Given/When/Then format
   or as a checklist.

5. **Define success metrics** — specify leading indicators (change quickly:
   adoption rate, activation rate, task completion) and lagging indicators
   (change over time: retention, revenue, NPS). Set specific targets with
   measurement method and evaluation timeframe.

6. **Capture open questions** — list unresolved questions tagged with who
   should answer (engineering, design, legal, data). Distinguish blocking
   from non-blocking questions.

7. **Note timeline considerations** — hard deadlines, dependencies on other
   teams, and suggested phasing if the feature is too large for one release.

## Output Format

```markdown
# Feature Spec: <Feature Name>

## Problem Statement

<2–3 sentences: user problem, who is affected, cost of not solving it.>

## Goals

1. <Specific, measurable outcome>
2. …

## Non-Goals

- <Out-of-scope item> — <brief rationale>
- …

## User Stories

- As a [user type], I want [capability] so that [benefit].
- …

## Requirements

### Must-Have (P0)

- **[Requirement]**: <description>
  - Given … / When … / Then …

### Should-Have (P1)

- …

### Could-Have (P2)

- …

## Success Metrics

| Metric | Baseline | Target | Measurement | Evaluate By |
|--------|----------|--------|-------------|-------------|
| …      | …        | …      | …           | …           |

## Open Questions

| Question | Owner | Blocking? |
|----------|-------|-----------|
| …        | …     | Yes / No  |

## Timeline Considerations

- <Hard deadlines, dependencies, phasing notes>
```

## Best Practices

- Be ruthless about P0s — the tighter the must-have list, the faster you ship
  and learn. If everything is P0, nothing is P0.
- Non-goals are as important as goals; they prevent scope creep during
  implementation and set stakeholder expectations.
- Success metrics should be specific and measurable, not vague ("improve UX").
- Write acceptance criteria for every P0 requirement before engineering starts.
- If the user's idea is too large for one spec, suggest phasing and spec the
  first phase.
- Review the spec against the original problem statement before finalising —
  does every requirement serve it?
