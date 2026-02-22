---
name: pm-roadmap-management
description: >
  Plan and prioritise product roadmaps using frameworks like RICE, MoSCoW,
  and ICE, with dependency mapping and capacity planning.
  Use this skill when creating a roadmap, reprioritising features, mapping
  dependencies, choosing a roadmap format, or presenting roadmap trade-offs
  to stakeholders.
---

# PM Roadmap Management

## When to Use

- Creating a new product roadmap or updating an existing one.
- Reprioritising features or initiatives based on new information.
- Choosing a roadmap format (Now/Next/Later, quarterly themes, OKR-aligned,
  or timeline/Gantt).
- Mapping and managing dependencies between initiatives.
- Planning team capacity and identifying overcommitment.
- Communicating roadmap changes to stakeholders.

## Process

1. **Choose a roadmap format** based on the audience and context:
   - **Now / Next / Later** — best for most teams; avoids false precision on dates.
   - **Quarterly themes** — for showing strategic alignment to OKRs.
   - **OKR-aligned** — maps every initiative to a Key Result.
   - **Timeline / Gantt** — for engineering execution planning; not for external
     communication.

2. **Prioritise initiatives** using an appropriate framework:
   - **RICE** — (Reach × Impact × Confidence) ÷ Effort. Use when you need a
     quantitative, defensible prioritisation across a large backlog.
   - **MoSCoW** — Must / Should / Could / Won't. Use when scoping a release or
     negotiating with stakeholders about what fits.
   - **ICE** — Impact × Confidence × Ease. Use for quick prioritisation of a
     feature backlog.
   - **Value vs. Effort matrix** — 2×2 for visual planning sessions.

3. **Map dependencies** — for each initiative, identify technical dependencies,
   team dependencies (cross-functional work), external dependencies (vendor,
   partner), and sequential dependencies (must ship A before B). Assign an owner
   and "need-by" date to each dependency.

4. **Plan capacity** — estimate available engineering time, subtracting meetings,
   on-call, interviews, and holidays. Apply a healthy split: ~70% planned
   features, ~20% technical health, ~10% buffer for unplanned work.

5. **Generate the roadmap view** — produce a status overview, itemised roadmap
   with owners and timelines, risks and dependencies section, and (for updates)
   a summary of what changed.

6. **Communicate changes** — when the roadmap changes, acknowledge the change
   directly, explain the reason (new information, strategy shift, resource
   change), show the trade-off, present the new plan, and acknowledge the
   impact on affected stakeholders.

## Output Format

```markdown
# Product Roadmap — <Team / Period>

## Status Overview

<X items in progress, Y completed, Z at risk.>

## Now

| Initiative | Description | Owner | Status | Dependencies |
|------------|-------------|-------|--------|-------------|
| …          | …           | …     | On Track | … |

## Next

| Initiative | Description | Owner | Target | Dependencies |
|------------|-------------|-------|--------|-------------|
| …          | …           | …     | Q[n]   | … |

## Later

| Initiative | Description | Strategic Rationale |
|------------|-------------|---------------------|
| …          | …           | …                   |

## Risks and Dependencies

- **[Dependency]** — Owner: … / Need by: … / Status: …

## Changes This Update

- Added: …
- Removed / deprioritised: …
- Timeline shifts: …
```

## Best Practices

- A roadmap is a communication tool, not a project plan — keep it at the right
  altitude (themes and outcomes, not tasks).
- When adding something to the roadmap, always ask what comes off. Roadmaps are
  zero-sum against capacity.
- Priority shifts should be driven by new information, not whim. Document why
  priorities changed.
- Dependencies are the highest-risk items on any roadmap — surface them early
  and build buffer around them.
- Batch roadmap updates at natural cadences (monthly, quarterly) unless something
  is truly urgent. Frequent changes signal unclear strategy.
- Be honest about capacity — do not solve overcommitment by expecting people to
  work more. Solve it by cutting scope.
