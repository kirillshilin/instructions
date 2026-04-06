---
name: requirements-documentation
description: >
  Structure, summarise, and format product requirements into well-organised
  markdown files. Use this skill when you need to write requirement documents,
  build a requirement map, generate summaries, or organise requirements into
  a file structure inside the repository.
---

# Requirements Documentation

## When to Use

- Requirements need to be written up or formalised into documents.
- A requirement map or hierarchy diagram is needed.
- Existing requirements need to be summarised or expanded.
- Requirements should be organised into a folder/file structure in the repo.

## Process

1. **Determine scope** — confirm which requirements or product area to document.
2. **Choose artefact type** — decide whether to produce:
   - A single requirements document.
   - A requirements map (hierarchy view).
   - A summary table.
   - Individual requirement files in a directory structure.
3. **Apply template** — use the templates below to ensure consistency.
4. **Write content** — fill in descriptions, acceptance criteria, and metadata.
5. **Organise files** — if structuring into files, follow the directory layout
   below.

## Recommended File Structure

```
docs/
└── requirements/
    ├── README.md              # Overview and summary table
    ├── functional/
    │   ├── REQ-001.md
    │   └── REQ-002.md
    ├── non-functional/
    │   └── REQ-003.md
    └── technical/
        └── REQ-004.md
```

## Templates

### Full Requirement Document

```markdown
## REQ-<ID>: <Title>

| Field | Value |
|---|---|
| **Priority** | Must / Should / Could / Won't |
| **Category** | Functional / Non-Functional / Technical |
| **Source** | <user story, stakeholder, research> |
| **Status** | Draft / Reviewed / Approved |

### Description

<Clear, concise description of the requirement.>

### Acceptance Criteria

- [ ] <criterion 1>
- [ ] <criterion 2>

### Dependencies

- REQ-<other-id> (if any)

### Notes

<Additional context, links, or open questions.>
```

### Requirements Summary (README)

```markdown
# Requirements — <Product / Feature>

| ID | Title | Priority | Category | Status |
|----|-------|----------|----------|--------|
| REQ-001 | … | Must | Functional | Draft |
| REQ-002 | … | Should | Non-Functional | Draft |
```

### Requirements Map

```markdown
# Requirements Map — <Product / Feature>

## <Category A>
- REQ-001: <Title> [Must]
  - REQ-002: <Sub-requirement> [Should]

## <Category B>
- REQ-003: <Title> [Could]
```

## Best Practices

- Use consistent IDs (e.g., `REQ-001`) across all documents.
- Keep one requirement per file when using the directory structure.
- Always include acceptance criteria — they define "done".
- Update the summary README whenever individual requirement files change.
- Use links between files to show dependencies and traceability.
