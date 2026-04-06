---
name: requirements-prioritization
description: >
  Prioritise and rank product requirements using established frameworks such as
  MoSCoW, RICE, or Kano. Use this skill when you have a list of requirements
  and need to decide which ones to tackle first based on impact, effort, risk,
  and strategic alignment.
---

# Requirements Prioritisation

## When to Use

- A set of requirements exists but they are not yet ranked.
- The user asks to evaluate trade-offs between requirements.
- Sprint or release planning requires a priority-ordered backlog.

## Supported Frameworks

| Framework | Best For |
|-----------|----------|
| **MoSCoW** | Quick categorical ranking (Must / Should / Could / Won't) |
| **RICE** | Data-driven scoring (Reach × Impact × Confidence ÷ Effort) |
| **Kano** | Understanding user satisfaction vs. investment |
| **Value vs. Effort** | Simple 2×2 matrix for small requirement sets |

## Process

1. **Collect requirements** — gather the full list from existing files or user input.
2. **Select framework** — choose the framework that fits the context (default: MoSCoW).
3. **Score each requirement** — apply the framework criteria and assign a
   priority value.
4. **Rank** — sort requirements by priority, breaking ties with strategic
   alignment or risk.
5. **Present** — output a prioritised markdown table and optionally a visual
   matrix.

## Output Format

### MoSCoW Table

```markdown
# Prioritised Requirements — <Product / Feature>

## Must Have
| ID | Title | Rationale |
|----|-------|-----------|
| REQ-001 | … | … |

## Should Have
| ID | Title | Rationale |
|----|-------|-----------|
| REQ-002 | … | … |

## Could Have
| ID | Title | Rationale |
|----|-------|-----------|
| REQ-003 | … | … |

## Won't Have (this time)
| ID | Title | Rationale |
|----|-------|-----------|
| REQ-004 | … | … |
```

### RICE Score Table

```markdown
# RICE Prioritisation — <Product / Feature>

| ID | Title | Reach | Impact | Confidence | Effort | Score |
|----|-------|-------|--------|------------|--------|-------|
| REQ-001 | … | … | … | … | … | … |
```

## Best Practices

- Involve stakeholders — priority is a business decision, not just a technical one.
- Re-prioritise regularly as new information emerges.
- Document the rationale for each priority assignment so decisions are transparent.
