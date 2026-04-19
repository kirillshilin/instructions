# SHAI — Project Instructions

This repository is the **SHAI plugin system**: a modular collection of VS Code / GitHub Copilot customization tools (instructions, skills, agents, hooks, prompts) organized as installable plugins per technology stack.

## Purpose

SHAI (personal AI coding assistant) provides opinionated, composable coding standards and workflows for VS Code Copilot. Each plugin targets a specific stack (TypeScript, React, .NET, etc.) so users install only what they need. The `shai-core` plugin is universal — every project should include it.

## Repository Structure

```
instructions/
├── src/                        ← Source files (authored here)
│   ├── shai-core/              ← Cross-cutting standards & workflows
│   ├── shai-typescript/        ← TypeScript conventions
│   ├── shai-react/             ← React + Tailwind + shadcn
│   ├── shai-dotnet/            ← .NET / C# ecosystem
│   ├── shai-nextjs/            ← Next.js App Router
│   ├── shai-product/           ← Product discovery pipeline
│   └── shared/                 ← Reusable partials and assets
├── dist/                       ← Build output (resolved partials)
├── research/                   ← Reference docs, VS Code docs, GoF patterns
├── obsolete/                   ← Legacy drafts (source material for new tools)
├── .github/skills/             ← Meta-skills for this repo (shai-create-tool, etc.)
└── scripts/build.js            ← Build script: copies src/ → dist/, resolves partials
```

## Plugin Structure

Each plugin lives under `src/{plugin-name}/` and contains:

```
{plugin-name}/
├── plugin.json                          ← Plugin metadata (name, description, keywords, asset lists)
├── instructions/                        ← .instructions.md files with applyTo globs
│   └── {name}.instructions.md
├── skills/                              ← Agent skills (each in its own directory)
│   └── {skill-name}/
│       ├── SKILL.md                     ← Skill metadata + instructions
│       ├── references/                  ← Detailed docs loaded on demand
│       ├── scripts/                     ← Executable automation
│       └── assets/                      ← Templates, fixtures
├── agents/                              ← .agent.md persona files
├── hooks/                               ← Lifecycle hooks (JSON)
└── prompts/                             ← Workspace-level prompt files (rare)
```

### plugin.json

Declares the plugin's metadata and lists its assets:

```json
{
  "name": "shai-typescript",
  "displayName": "SHAI TypeScript",
  "description": "TypeScript-specific conventions and workflows.",
  "version": "0.1.0",
  "publisher": "kirillshilin",
  "license": "MIT",
  "keywords": ["typescript"],
  "instructions": ["instructions/typescript-coding-standards.instructions.md"],
  "skills": ["skills/scaffold-ts-project", "skills/unit-testing-ts"]
}
```

## Asset Types

| Type            | Format                                 | Purpose                                                      |
| --------------- | -------------------------------------- | ------------------------------------------------------------ |
| **Instruction** | `.instructions.md` with `applyTo` glob | Coding rules auto-applied when matching files are open       |
| **Skill**       | `SKILL.md` in a named directory        | Invocable workflows triggered via `/slash-command`           |
| **Agent**       | `.agent.md`                            | Specialized persona with tool restrictions                   |
| **Hook**        | `.json`                                | Lifecycle automation (pre/post tool use, session events)     |
| **Prompt**      | `.prompt.md`                           | Workspace-level prompt files (within plugins, prefer skills) |

## Partial / Composition System

Instructions use inline partial references to compose content from reusable fragments:

```markdown
{rules/01-naming.rule.md} {shared/\_eslint-prettier.partial.md}
```

- `*.rule.md` and `*.partial.md` files are **source-only** — excluded from build output
- `rules/` directories are excluded from `dist/`
- Partials resolve recursively (a partial can reference other partials)
- Paths are relative to the file containing the reference

Run `npm run build` to resolve all partials from `src/` into `dist/`.

## Asset Reference Document

[src/reference.md](../src/reference.md) is the **single source of truth** for all 84 tools across 10 plugins. It contains:

- Asset tree with IDs, names, types, priorities, and status (🔴 not started · 🟡 legacy draft · 🟢 done)
- Detailed tables per plugin with purpose, examples, applyTo patterns, and tool lists
- MoSCoW prioritization (Must / Should / Could / Won't)

**Every new or updated asset must be reflected in this document.** An asset that exists in `src/` but not in the reference doc is invisible to the workflow.

## Creating Tools — The `shai-create-tool` Skill

The primary workflow for building new tools is the `shai-create-tool` skill (`.github/skills/shai-create-tool/SKILL.md`). It handles the full lifecycle:

1. **Resolve** — Parse an asset ID (`T-I01`, `C-A03`) or name (`shai-typescript-coding-standards`) from the reference doc
2. **Load type reference** — Read the format spec from `.github/skills/shai-create-tool/references/{type}.md`
3. **Research** — Check legacy drafts in `obsolete/`, search community skills via `npx skills find`, analyze workspace patterns, read VS Code docs, fetch web docs
4. **Interview** — Confirm scope, review legacy content, discuss prescriptiveness level, validate applyTo patterns
5. **Draft** — Generate the asset following the format spec, user preferences, and coding philosophy
6. **Quality review** — Validate against the quality checklist
7. **Write** — Output to `src/{plugin}/` and update the reference doc status

### Trigger examples

- `"Build C-I01"` or `"Create shai-coding-standards"` — creates the specified asset
- `"Build the next asset"` — picks the highest-priority 🔴 asset
- `"Implement T-S01"` — scaffolds the TypeScript project scaffolding skill

## Coding Philosophy

These principles apply to all generated tools:

- **Pragmatic over dogmatic** — "Prefer X because Y." If the reason doesn't apply, the rule may not either
- **Composition over inheritance** — small, independently testable pieces
- **Explain the WHY** — every rule includes its reasoning
- **Minimalism** — cut anything that doesn't pull its weight; don't over-explain what models already know
- **Fail fast** — surface errors at the origin
- **Strict for critical, flexible for style** — security and data integrity get strict rules; style choices get guidelines

## Installing Plugins

The package ships a CLI at `bin/install.js` that copies built tools from `dist/` into the target project's `.vscode/` directory (instructions, skills, agents).

**Local development** (package not yet published — use `npm link` from this repo):

```bash
# Use the linked binary name directly
shai --all
shai shai-core shai-typescript
shai --all --dry-run
shai --list

# Or via npx with the linked package
npx @shai/instructions --all
npx @shai/instructions --all --dry-run
```

**After `npm publish`** — works anywhere without linking:

```bash
npx @shai/instructions --all              # Install all plugins
npx @shai/instructions shai-core shai-ts  # Install specific plugins
npx @shai/instructions --all --dry-run    # Preview without copying
npx @shai/instructions --list             # List available plugins
npx @shai/instructions shai-core --dir ../my-project  # Custom target
```

The installer reads each plugin's `plugin.json` to determine which tools to copy, then places them under `.vscode/{skills,instructions,agents}/` in the target project. Run `npm run build` in this repo first to ensure `dist/` is up to date.

## Conventions

- Private fields use `_name` convention (not `#private`)
- Exact dependency versions in package.json (no `~` or `^`)
- Skill descriptions must be "pushy" — include trigger phrases and contexts
- Instructions use hybrid style: rules with reasoning + preferred/avoided code examples
- Skills use progressive disclosure: SKILL.md < 500 lines, details in `references/`
- Within plugins, prompt-like behaviors are delivered as skills, not standalone `.prompt.md` files
- Security basics (no hardcoded secrets, input validation, OWASP) belong here in copilot-instructions, not in individual instruction files
