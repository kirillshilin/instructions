---
name: shai-create-asset
description: >
  Creates individual shai assets (instructions, skills, agents, hooks, prompts)
  following the shai plugin system plan in 02-shai-asset-reference.md. Use this
  skill whenever the user wants to create, build, scaffold, or implement any
  shai asset — whether referenced by ID (like T-I01, C-A03, D-S02) or by name
  (like shai-typescript-conventions, shai-architect, shai-code-review). Also use
  when the user says "build the next asset", "create asset", "implement
  [asset name]", or references any asset from the shai asset reference document.
  Even if the user just says an asset ID like "C-I01" with no other context,
  this skill applies.
---

# Create SHAI Asset

Build a single asset for the SHAI plugin system — the user's personal AI coding
assistant for VS Code / GitHub Copilot. Each asset is part of a modular plugin
architecture defined in the [asset reference](../../../research/02-shai-asset-reference.md).

The SHAI system has 76 assets across 8 plugins. This skill builds them one at a
time, ensuring each asset is high-quality, consistent, and enriched with the
user's coding philosophy.

## Step 1: Resolve the Asset

Parse the user's input to identify which asset to create.

**Accept either format:**
- Asset ID: `T-I01`, `C-A03`, `D-S02`, `R-S01`
- Asset name: `shai-typescript-conventions`, `shai-architect`, `shai-code-review`

**Lookup procedure:**
1. Read [research/02-shai-asset-reference.md](../../../research/02-shai-asset-reference.md)
2. Find the matching row in the asset tables
3. Extract: asset ID, name, type, plugin, priority, status, purpose, example, and any type-specific fields (applyTo, tools, event)

If the asset is not found or ambiguous, show the user the closest matches and ask for clarification.

**Display to the user:**
```
Asset: {ID} — {name}
Type: {type} | Plugin: {plugin} | Priority: {priority} | Status: {status}
Purpose: {purpose}
```

## Step 2: Load Type-Specific Reference

Based on the asset type, read the corresponding reference file. These contain
the full format spec, templates, and writing patterns for each type.

| Asset type  | Reference file                                         |
| ----------- | ------------------------------------------------------ |
| instruction | [references/instruction.md](references/instruction.md) |
| skill       | [references/skill.md](references/skill.md)             |
| agent       | [references/agent.md](references/agent.md)             |
| hook        | [references/hook.md](references/hook.md)               |
| prompt      | [references/prompt.md](references/prompt.md)           |

Read the reference file before proceeding — it contains the format spec, frontmatter
fields, templates, and asset-specific writing guidance.

## Step 3: Research Phase

Run these research steps in parallel where possible. The goal is to arrive at the
interview step with concrete proposals, not blank questions.

**Track every source.** As you work through 3a–3d, mentally note which sources you
consulted, what you extracted (or didn't), and why. You'll report this in the
Resource Provenance Summary at the end — the user needs to see exactly where the
asset's content came from.

### 3a. Check for legacy drafts

Check the asset's Status column in the reference doc:
- 🟡 = legacy draft exists in `obsolete/`. Read the mapped file, extract reusable
  patterns, naming conventions, and any content worth preserving.
- 🔴 = no existing draft. Skip this step.

The reference doc's "Legacy Drafts Mapping" table (near the bottom) maps asset
IDs to their legacy filenames.

### 3b. Search for existing skills online

**Use the `/find-skills` skill** to discover relevant community skills. This is
critical for EVERY asset type — not just when creating skills. The skills
ecosystem is the richest source of AI-friendly, battle-tested content. Even when
creating an instruction or agent, find an existing skill that covers the same
domain and extract patterns, checklists, or templates from it.

**The pattern: find skill → convert to any asset type.**
A community skill about "React best practices" can feed an instruction file.
A skill about "code review workflows" can feed an agent persona. A skill about
"testing strategies" can feed both an instruction and a skill. Always search.

The find-skills workflow:
1. Check the [skills.sh leaderboard](https://skills.sh/) first for well-known skills
2. Run `npx -y skills find "<relevant keywords for this asset>"` for broader search
3. Verify quality: prefer 1K+ installs, known sources (`vercel-labs`, `anthropics`, `microsoft`)
4. For promising finds, install the skill locally to read the full SKILL.md:
   `npx -y skills add https://github.com/{owner}/{repo} --skill {skill-name}`
   Then read the installed SKILL.md from `.agents/skills/{skill-name}/SKILL.md`

**Proven reference skills for VS Code customization:**
- **`vscode-copilot-customization`** (danielsitek) — decision matrix for choosing
  asset types, templates per type, file naming conventions, settings references.
  Install: `npx -y skills add https://github.com/danielsitek/skills --skill vscode-copilot-customization`
  Read from: `.agents/skills/vscode-copilot-customization/SKILL.md`
- **`custom-agent-creator`** (prulloac) — 6-step agent creation workflow, validation
  checklist (5 categories), concrete examples (security reviewer, docs writer, etc).
  Install: `npx -y skills add https://github.com/prulloac/agent-skills --skill custom-agent-creator`
  Read from: `.agents/skills/custom-agent-creator/SKILL.md`

When using these as sources, always read their full SKILL.md. For any other
domain-specific asset, search for skills in that domain too.

If a relevant skill is found:
1. Read its full SKILL.md content (not just the search result summary)
2. Extract: structure, writing patterns, templates, checklists, decision matrices
3. Adapt the content to the target asset type (skill content → instruction rules,
   skill workflow → agent guidelines, skill checklist → quality criteria)
4. Prepare a summary for the user showing what was borrowed and how it was adapted

### 3c. Analyze the workspace codebase

If the asset relates to a specific technology (React, .NET, Angular, etc.),
search the user's current workspace for existing patterns:
- Look for existing config files, conventions already in use
- Check for existing tests, component patterns, project structure
- Note any framework versions in use

### 3d. Check web documentation

For framework/library-specific assets, fetch the official documentation for the
latest stable version to ensure the asset reflects current best practices.

## Step 4: Interview the User

This is the most important step. The user's preferences and coding philosophy
drive the asset's content. Use a mix of structured questions (via
`vscode/askQuestions` for choices) and inline chat (for open-ended topics).

### Universal questions (ask for every asset)

1. **Scope confirmation**: "I found [asset details]. Is this what you want to build?"
2. **Legacy content**: If legacy draft exists — "Here's what the legacy draft covers: [summary]. What should we keep, adapt, or discard?"
3. **Existing skills**: If community skills found — "I found [skill name] with [X installs]. Here's what it does well: [summary]. Should we incorporate any patterns from it?"
4. **Cross-references**: "This asset relates to [other assets]. Should we add explicit references/links?"
5. **ApplyTo pattern**: For instructions — always ask the user to confirm or adjust the glob pattern from the reference doc.

### Type-specific questions

Read the reference file for the specific question templates per asset type.

### Philosophy questions

Ask about preferences that shape the asset's tone and approach:

- **Prescriptiveness**: "Should this be strict rules or flexible guidelines? Which patterns are critical enough for strict enforcement?"
- **Example depth**: "Do you want minimal examples or comprehensive show-don't-tell patterns?"
- **Edge cases**: "Any gotchas or anti-patterns you've encountered that this asset should warn about?"
- **Team context**: "Is this for solo use or team conventions? Should it accommodate different experience levels?"

### Summary proposal

After the interview, present a structured proposal:

```
## What we'll create
- File: {output path}
- Content summary: {brief outline}

## Borrowed from existing skills
- {pattern from community skill}

## Preserved from legacy
- {content from obsolete/}

## New content from your preferences
- {philosophy-driven additions}

## Cross-references
- Links to: {related assets}
```

Wait for user approval before drafting.

## Step 5: Draft the Asset

### 5a. Generate first draft

Write the asset following:
- The format spec from the type-specific reference file
- The user's preferences from the interview
- Content borrowed from legacy drafts and community skills
- The user's coding philosophy (see below)

### 5b. Apply the user's coding philosophy

These principles should permeate every asset:

- **Pragmatic over dogmatic**: Rules should have escape hatches. "Prefer X because Y" over "ALWAYS do X"
- **Composition over inheritance**: Favor composable patterns in code examples
- **Explain the WHY**: Every rule includes its reasoning — models make better decisions when they understand purpose
- **Progressive complexity**: Start with the simple case, add complexity only when needed
- **Minimalism**: Less is more. Cut anything that doesn't pull its weight
- **Fail fast**: Surface errors immediately, don't silently swallow them
- **Strict for critical, flexible for style**: Critical patterns (security, data integrity) get strict rules; style choices get guidelines

### 5c. Self-critique and improve

Before showing the user, review the draft against these questions:
1. Would a model follow these instructions without ambiguity?
2. Are the examples realistic and non-trivial?
3. Does every rule explain its reasoning?
4. Is there anything the model already knows that we're over-explaining?
5. Are cross-references to related assets included?
6. Is the prescriptiveness level appropriate (strict for critical, flex for style)?

Revise based on your own critique, then show the user.

## Step 6: Quality Review

Read [references/quality-checklist.md](references/quality-checklist.md) and run
through the validation checklist. This includes:

- Frontmatter validation (YAML syntax, required fields, naming constraints)
- Content completeness (all expected sections present)
- Cross-reference check (linked assets exist in the reference doc)
- Consistency check (naming conventions match across references)
- Type-specific validation (see the checklist for details)

Report the checklist results to the user with any issues found.

## Step 7: Write Output

### Output location

Write the generated asset to the `drafts/` folder at the repository root:

```
drafts/
└── {plugin-name}/
    └── {asset-type-folder}/
        └── {asset-file-or-folder}
```

Examples:
- `drafts/shai-core/instructions/shai-general-coding-standards.instructions.md`
- `drafts/shai-core/skills/shai-code-review/SKILL.md`
- `drafts/shai-core/agents/shai-architect.agent.md`
- `drafts/shai-core/hooks/shai-format-on-edit.json`
- `drafts/shai-core/prompts/shai-quick-plan.prompt.md`

### Plugin scaffolding

If the plugin folder doesn't exist yet, auto-scaffold it:

```
drafts/{plugin-name}/
├── plugin.json
├── skills/
├── agents/
├── hooks/
└── prompts/
```

Generate `plugin.json` from the plugin metadata in the reference doc.

### For skill assets specifically

When creating a skill, use the `/skill-creator` methodology:
1. Follow the SKILL.md writing guide from the skill-creator
2. Apply the agentskills.io specification for frontmatter
3. Use progressive disclosure (SKILL.md < 500 lines, details in references/)
4. Create a "pushy" description that triggers on relevant user phrases
5. Consider bundling scripts in `scripts/` if the skill involves repeatable steps

### Post-creation

After writing the file:
1. Display the full generated content to the user
2. Show the **Resource Provenance Summary** (see below)
3. Report the quality checklist results
4. Ask: "Ready to finalize, or do you want to adjust anything?"
5. Update the asset's status in the reference doc from 🔴 to 🟢 (or 🟡 to 🟢) once the user approves

### Resource Provenance Summary

Always show this summary after presenting the generated asset. It gives the user
full visibility into what shaped the output — which sources contributed content
and which were consulted but didn't make the cut. This matters because the user
needs to trust and verify the asset's origins, not wonder where things came from.

Use exactly this format:

```
## Resource Provenance Summary

### What was done
- {1-3 sentence summary of the overall creation process for this specific asset}

### Sources

| #   | Source                                   | Status                      | Details                                         |
| --- | ---------------------------------------- | --------------------------- | ----------------------------------------------- |
| 1   | **Legacy draft** (`obsolete/{file}`)     | ✅ Used / ⏭️ Not available    | What was extracted or why skipped               |
| 2   | **Community skills** (`npx skills find`) | ✅ Used / ⏭️ No relevant hits | Skill name, what patterns were borrowed         |
| 3   | **Web documentation** (fetched URL)      | ✅ Used / ⏭️ Skipped          | What was fetched and what it contributed        |
| 4   | **User recommendations** (interview)     | ✅ Used / ⏭️ No input         | Key preferences that shaped the asset           |
| 5   | **Workspace analysis**                   | ✅ Used / ⏭️ Not applicable   | Conventions or patterns found in codebase       |
| 6   | **Other**                                | ✅ Used / ⏭️ N/A              | Any additional sources (reference skills, etc.) |
```

**Rules for the summary:**
- Every row must appear — show `⏭️` with the reason if a source wasn't used.
  The user should see what *wasn't* consulted, not just what was.
- For "Community skills", list the actual skill names and install counts found
  via `npx skills find`. If skills were found but not used, explain why (e.g.
  low quality, irrelevant domain, outdated).
- For "Web documentation", list the actual URLs fetched. If no fetch was needed,
  say why (e.g. "asset is framework-agnostic").
- For "Legacy draft", name the specific file from `obsolete/` or state that the
  reference doc marked the asset as 🔴 (no legacy).
- For "User recommendations", summarize the key decisions from the interview
  that influenced the output (scope, prescriptiveness, patterns kept/discarded).
- For "Other", include reference skills like `vscode-copilot-customization` or
  `custom-agent-creator` if consulted, cross-referenced assets, or any source
  not covered above.
- Keep each Details cell to 1-2 sentences. Link to files/URLs where possible.

## Gotchas

- **Name field constraints (skills)**: The `name` in SKILL.md frontmatter must be lowercase, hyphens only, no consecutive hyphens, must match the parent directory name. Max 64 chars.
- **`_private` convention**: The user prefers `_name` for private fields, not `#private`. Enforce this in any code examples.
- **Plugin format**: Within plugins, prompt-like behaviors should be delivered as skills (invocable via slash command), not as standalone .prompt.md files. Standalone prompts are for workspace-level use only.
- **Security basics**: Security fundamentals (never hardcode secrets, validate inputs at boundaries, OWASP awareness) belong in `copilot-instructions.md`, not in individual instruction files.
- **Don't over-explain**: Models know what PDFs are, how HTTP works, what a database migration does. Focus on what the model wouldn't know without this instruction.
- **Test philosophy**: AAA pattern + pragmatic coverage. Tests are NOT required during scaffolding or on non-stable architecture. Prefer functional (use-case) tests that test 2-3 subsystems together. Declarative test cases in JSONs. Start with basic functionality, grow incrementally.
- **dotnet sln add**: Avoid running `dotnet sln add` via terminal — it rewrites large sections of .sln files. Add project references manually only when explicitly required.
