# Skill Asset Reference

Format spec and writing guide for Agent Skills (SKILL.md) in the SHAI plugin system.

> **Source documentation:** For the full VS Code spec, read [vscode-docs/05-agent-skill.md](vscode-docs/05-agent-skill.md) — covers the open standard, discovery, installation, and runtime behavior. For the agentskills.io format spec, see the [agentskills.io specification](https://agentskills.io).

## Directory Structure

```
{skill-name}/
├── SKILL.md          # Required — metadata + instructions
├── scripts/          # Optional — executable code for repeatable tasks
├── references/       # Optional — detailed docs loaded on demand
└── assets/           # Optional — templates, fixtures, static resources
```

## SKILL.md Format

```markdown
---
name: skill-name # Required. Lowercase, hyphens, max 64 chars
description: > # Required. Max 1024 chars. What + when
  Does X and Y. Use this skill when the user asks about Z, mentions W, or needs to accomplish Q — even if they don't explicitly name this skill.
---

# Skill Title

## Instructions

...
```

## Frontmatter Fields

| Field           | Required | Constraints                                                         |
| --------------- | -------- | ------------------------------------------------------------------- |
| `name`          | Yes      | 1-64 chars, lowercase + hyphens, no `--`, must match directory name |
| `description`   | Yes      | 1-1024 chars, include WHAT it does and WHEN to use                  |
| `license`       | No       | License name or reference to bundled license file                   |
| `compatibility` | No       | 1-500 chars, environment requirements                               |
| `metadata`      | No       | Key-value map for custom properties                                 |

### Writing effective descriptions

The description is the primary trigger mechanism. Make it "pushy" — include specific contexts and phrases that should activate the skill:

**Good:**

```yaml
description: >
  Step-by-step code review workflow: architecture, security, performance, and style checks with a review checklist template. Use this skill when the user asks for a code review, wants to review changes, mentions reviewing a PR, or asks about code quality — even for a quick sanity check.
```

**Too vague:**

```yaml
description: Reviews code.
```

## Progressive Disclosure

Keep SKILL.md under 500 lines (~5000 tokens). Use this three-tier model:

1. **Metadata** (~100 tokens): `name` + `description` — always in context
2. **SKILL.md body** (< 5000 tokens): Core workflow — loaded when skill triggers
3. **Bundled resources** (unlimited): reference files, scripts, assets — loaded on demand

Point clearly to reference files with loading conditions:

```markdown
Read [references/react-patterns.md](references/react-patterns.md) when creating React components. Read [references/testing.md](references/testing.md) when the asset involves test patterns.
```

## File Location

Within a plugin: `{plugin}/skills/{skill-name}/SKILL.md` In staging: `src/{plugin}/skills/{skill-name}/SKILL.md`

## Creating Skills — Use /find-skills and /skill-creator

When the asset being created is itself a skill:

1. **Use `/find-skills`** to search for existing community skills in the same domain. Read their full SKILL.md — not just the search summary — and extract reusable assets: workflow steps, templates, checklists, gotchas.

   Two proven reference skills for VS Code customization tasks:
   - **`vscode-copilot-customization`** (danielsitek) — decision matrix, templates per type
   - **`custom-agent-creator`** (prulloac) — validation checklist, concrete agent examples

2. **Delegate to `/skill-creator`** for the actual SKILL.md authoring. The skill-creator handles:
   - Capturing intent and interviewing
   - Writing the SKILL.md draft
   - Creating test prompts
   - Evaluating and iterating

Apply the shai-create-asset workflow (research, legacy analysis, user interview) FIRST, then hand the context to skill-creator for the actual writing.

## Writing Patterns

### Explain the WHY

```markdown
## Commit message format

Use conventional commits because they enable automated changelog generation, make git history searchable by category, and help reviewers understand the scope of changes at a glance.

**Example:** Input: Added user authentication with JWT tokens Output: feat(auth): implement JWT-based authentication
```

### Procedures over declarations

Teach the model HOW to approach a class of problems, not WHAT to produce for a specific instance. The approach should generalize.

### Gotchas section

Include concrete corrections to mistakes the model will make without being told:

```markdown
## Gotchas

- The `users` table uses soft deletes — always include `WHERE deleted_at IS NULL`
- User ID is `user_id` in DB, `uid` in auth, and `accountId` in billing API
```

### Defaults over menus

Pick one recommended approach, mention alternatives briefly:

```markdown
Use pdfplumber for text extraction. For scanned PDFs requiring OCR, use pdf2image with pytesseract instead.
```

## Interview Questions for Skills

Ask the user:

1. "What's the core workflow — what steps should this skill walk through?"
2. "Who is the target user? What level of guidance do they need?"
3. "Should this skill bundle any scripts for repeatable/deterministic tasks?"
4. "What reference files would be useful to load on demand?"
5. "What are the common edge cases or failure modes?"
6. "Should this skill trigger automatically or only when explicitly invoked?"
7. "Are there existing skills (community or legacy) whose patterns we should adopt?"
8. "What should the output look like — files created, terminal output, report?"

## Template

```markdown
---
name: { skill-name }
description: >
  {What it does}. Use this skill when {trigger conditions}, {additional trigger phrases}, or when {related contexts}.
---

# {Skill Title}

{One paragraph explaining the skill's purpose and the problem it solves.}

## When to Use

- {Trigger condition 1}
- {Trigger condition 2}
- {Trigger condition 3}

## Workflow

### Step 1: {Name}

{Instructions}

### Step 2: {Name}

{Instructions}

## Output Format

{Description or template of expected output}

## Gotchas

- {Non-obvious fact}
- {Common mistake}
```
