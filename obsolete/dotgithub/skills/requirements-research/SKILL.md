---
name: requirements-research
description: >
  Research and discover product requirements by analysing existing documentation,
  searching the web, and synthesising findings. Use this skill when you need to
  explore a problem space, identify user needs, or gather competitive and market
  context for a product or feature.
---

# Requirements Research

## When to Use

- The user asks to explore or brainstorm requirements for a new product or feature.
- You need to understand the problem space before formulating requirements.
- Competitive analysis, market research, or user-need discovery is requested.

## Process

1. **Clarify scope** — ask for the product name, target audience, and any
   known constraints.
2. **Gather context** — search the workspace for existing requirement files,
   READMEs, or design documents.
3. **Web research** — use `#tool:fetch` to look up industry best practices,
   competitor features, and relevant standards.
4. **Synthesise** — combine internal and external findings into a structured
   list of candidate requirements.
5. **Present findings** — output a markdown document with:
   - An executive summary of the research.
   - A categorised list of discovered requirements (functional, non-functional,
     technical).
   - Sources and references for each finding.

## Output Format

```markdown
# Research Findings — <Product / Feature>

## Executive Summary

<2–3 paragraph overview of the research.>

## Discovered Requirements

### Functional
- <requirement description> — _source: <link or reference>_

### Non-Functional
- <requirement description> — _source: <link or reference>_

### Technical
- <requirement description> — _source: <link or reference>_

## Sources

1. <URL or document reference>
2. …
```

## Best Practices

- Always cite sources so findings are verifiable.
- Separate facts from assumptions; label assumptions clearly.
- Keep the list actionable — each item should be convertible into a formal
  requirement.
