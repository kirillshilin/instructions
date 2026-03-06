# 📚 Copilot Instructions Templates

> A collection of reusable VS Code custom instructions for GitHub Copilot that enforce common project patterns and conventions.

## 📋 Overview

This repository contains standardized VS Code custom instructions files (`.instructions.md`) that can be used with GitHub Copilot in VS Code. These templates help maintain consistency in coding standards, project structure, and development practices across your projects.

Each file follows the [VS Code custom instructions format](https://code.visualstudio.com/docs/copilot/customization/custom-instructions) with YAML frontmatter and includes `applyTo` patterns for automatic application to relevant files.

## ✨ Available Templates

### 1. 📘 [TypeScript Project](typescript-project.instructions.md)
Strict TypeScript configuration and project structure guidelines, including model organization patterns.

### 2. 📦 [Package.json Scripts](package-json-scripts.instructions.md)
Standard NPM script conventions for development, testing, linting, and deployment.

### 3. 🔷 [C# Project](csharp-project.instructions.md)
C# project organization with partial class file splitting, generic class naming, and nested class file organization.

### 4. 🧪 [C# Unit Tests](csharp-unit-tests.instructions.md)
C# testing conventions with `Should_` naming pattern and region-based test organization.

### 5. 🧪 [TypeScript Tests](typescript-tests.instructions.md)
TypeScript/JavaScript testing conventions using describe blocks for test organization.

### 6. 🚀 [Node.js Scaffolding](nodejs-scaffold.instructions.md)
Complete setup instructions for new Node.js projects with Jest, TypeScript, ESLint, and Prettier (Windows CRLF).

### 7. 📝 [README Style Guide](readme-style.instructions.md)
README formatting guidelines with emoji conventions for better readability.

### 8. ⚛️ [React Components](react-components.instructions.md)
React component guidelines with 50-60 line code limit and component composition patterns.

### 9. 🅰️ [Angular Components](angular-components.instructions.md)
Angular component guidelines with 50-60 line code limit and component composition patterns.

### 10. 🗂️ [TypeScript Workspace](typescript-workspace.instructions.md)
Monorepo workspace setup with shared TypeScript, ESLint, and Prettier configuration across backend, frontend (React/Angular), and Firebase packages, with common root-level build/lint/test scripts.

## 📖 Guides

### 🤖 [Claude Code .NET Setup Guide](claude-code-setup.guide.md)
End-to-end guide for setting up the most efficient AI-assisted coding workflow with Claude Code, focused on .NET development. Covers CLAUDE.md, MCP servers, custom agents, skills, VS Code extensions, and further customisation.

### 🔗 [Sharing Instructions via Git Submodule](git-submodule-sharing.guide.md)
Step-by-step guide for including instructions, agents, and skills from this repository into any other repository using a git submodule, so edits can be committed back to this shared repo and all projects stay in sync.

## 💻 Usage

### 🚀 Quick Start

#### For a TypeScript Project

1. **Create the instructions folder:**
   ```bash
   mkdir -p .github/instructions
   ```

2. **Copy relevant instruction files:**
   ```bash
   # For TypeScript project
   cp typescript-project.instructions.md .github/instructions/
   cp typescript-tests.instructions.md .github/instructions/
   cp package-json-scripts.instructions.md .github/instructions/
   cp readme-style.instructions.md .github/instructions/
   ```

3. **Enable in VS Code settings** (`.vscode/settings.json`):
   ```json
   {
     "github.copilot.chat.codeGeneration.useInstructionFiles": true,
     "chat.includeApplyingInstructions": true
   }
   ```

#### For a React Project

```bash
cp typescript-project.instructions.md .github/instructions/
cp react-components.instructions.md .github/instructions/
cp typescript-tests.instructions.md .github/instructions/
cp package-json-scripts.instructions.md .github/instructions/
cp readme-style.instructions.md .github/instructions/
```

#### For an Angular Project

```bash
cp typescript-project.instructions.md .github/instructions/
cp angular-components.instructions.md .github/instructions/
cp typescript-tests.instructions.md .github/instructions/
cp package-json-scripts.instructions.md .github/instructions/
cp readme-style.instructions.md .github/instructions/
```

#### For a C# Project

```bash
cp csharp-project.instructions.md .github/instructions/
cp csharp-unit-tests.instructions.md .github/instructions/
cp readme-style.instructions.md .github/instructions/
```

#### For a TypeScript Workspace (Monorepo)

```bash
cp typescript-workspace.instructions.md .github/instructions/
cp typescript-project.instructions.md .github/instructions/
cp typescript-tests.instructions.md .github/instructions/
cp package-json-scripts.instructions.md .github/instructions/
cp readme-style.instructions.md .github/instructions/
# Add frontend-specific instructions as needed:
cp react-components.instructions.md .github/instructions/
cp angular-components.instructions.md .github/instructions/
```

### 📝 How It Works

When you work on a file, Copilot automatically applies matching instructions:

- **Editing `User.ts`** → TypeScript Project instructions apply
- **Editing `Button.tsx`** → React Components + TypeScript Project instructions apply
- **Editing `app.component.ts`** → Angular Components instructions apply
- **Editing `UserService.cs`** → C# Project instructions apply
- **Editing `UserTests.cs`** → C# Unit Tests instructions apply
- **Editing `README.md`** → README Style instructions apply
- **Editing `package.json`** → Package.json Scripts instructions apply

### 🔍 Verify Instructions Are Active

1. Open VS Code Command Palette (`Ctrl+Shift+P`)
2. Type: **Chat: Configure Instructions**
3. See all loaded instruction files
4. Check which files have `applyTo` patterns matching your current work

### 💡 Tips

- Start with a few instructions and add more as needed
- Customize the instructions for your specific project requirements
- Share instructions with your team by committing them to version control
- Use the **Diagnostics** view in Copilot Chat to troubleshoot if instructions aren't applying

## ⚙️ Required VS Code Settings

Add these settings to your `settings.json`:

```json
{
  "github.copilot.chat.codeGeneration.useInstructionFiles": true,
  "chat.includeApplyingInstructions": true
}
```

## 📂 File Structure

Each `.instructions.md` file includes:
- **YAML frontmatter** with `name`, `description`, and `applyTo` glob pattern
- **Clear instructions** in Markdown format
- **Automatic application** when working with matching files

Example structure:
```markdown
---
name: TypeScript Project
description: Strict TypeScript configuration
applyTo: "**/*.ts"
---

# Instructions here
- Rule 1
- Rule 2
```

## 💼 Microsoft 365 Copilot Agents — Change Management

Ready-to-use agent definitions for **Microsoft 365 Copilot**, located
in `Copilot/`. Copy the instructions from each file and paste them into
[Copilot Studio](https://copilotstudio.microsoft.com/) or the M365 Copilot
agent builder to deploy the agent.

| Agent | File | Description |
|-------|------|-------------|
| **Copilot Agent Builder** | [`Copilot/meta-agent.agent.md`](Copilot/meta-agent.agent.md) | Meta-agent that designs and writes new M365 Copilot agent definitions for change management consultants |
| **Presentation Planner** | [`Copilot/presentation-planner.agent.md`](Copilot/presentation-planner.agent.md) | Creates slide-by-slide presentation outlines with titles, theses, and speaker notes for stakeholder decks |
| **Event Planner** | [`Copilot/event-planner.agent.md`](Copilot/event-planner.agent.md) | Plans large-scale workshops with time-blocked agendas, run-of-show schedules, and participant cohort assignments |
| **Email Analyser and Action Planner** | [`Copilot/email-analyser.agent.md`](Copilot/email-analyser.agent.md) | Analyses an inbox snapshot and returns the top 5 action items, 5 draft responses, and a daily summary |

### 📋 How to Use

1. Open the desired `*.agent.md` file in `Copilot/`.
2. Copy the content below the YAML frontmatter (the `# Purpose` section
   onwards) into the **Instructions** field in Copilot Studio or the M365
   Copilot agent configuration panel.
3. Use the **Starter Prompts** section as conversation starters in the agent.
4. Optionally copy the `name` and `description` frontmatter fields into the
   corresponding fields in the Copilot Studio UI.

---

## 🤖 Copilot Agents

Custom agent profiles for GitHub Copilot, located in `.github/agents/`.

| Agent | Description |
|-------|-------------|
| [Agent Builder](`.github/agents/agent-builder.agent.md`) | Meta-agent for scaffolding new agents and skills in this repository |
| [Requirements Research](`.github/agents/requirements-research.agent.md`) | Investigate, plan, and structure product requirements |
| [Product Management](`.github/agents/product-management.agent.md`) | Write specs, run metrics reviews, manage roadmaps, craft stakeholder updates, synthesise research, and produce competitive briefs |
| [Data Analysis](`.github/agents/data-analysis.agent.md`) | Explore datasets, write queries, identify trends, and produce data-driven reports |
| [Marketing](`.github/agents/marketing.agent.md`) | Draft copy, plan campaigns, define positioning, and create go-to-market materials |

## 🧰 Copilot Skills

Reusable skill definitions for GitHub Copilot, located in `.github/skills/`.

| Skill | Description |
|-------|-------------|
| [create-agent](`.github/skills/create-agent/SKILL.md`) | Scaffold a new GitHub Copilot custom agent profile |
| [create-skill](`.github/skills/create-skill/SKILL.md`) | Scaffold a new GitHub Copilot skill definition |
| [requirements-documentation](`.github/skills/requirements-documentation/SKILL.md`) | Structure and format product requirements into organised markdown files |
| [requirements-prioritization](`.github/skills/requirements-prioritization/SKILL.md`) | Prioritise requirements using MoSCoW, RICE, or Kano frameworks |
| [requirements-research](`.github/skills/requirements-research/SKILL.md`) | Research and discover product requirements from documentation and the web |
| [pm-competitive-analysis](`.github/skills/pm-competitive-analysis/SKILL.md`) | Analyse competitors with feature matrices, positioning analysis, and win/loss methodology |
| [pm-feature-spec](`.github/skills/pm-feature-spec/SKILL.md`) | Write structured PRDs with problem statements, user stories, and success metrics |
| [pm-metrics-tracking](`.github/skills/pm-metrics-tracking/SKILL.md`) | Define, track, and analyse product metrics with OKRs and dashboard design |
| [pm-roadmap-management](`.github/skills/pm-roadmap-management/SKILL.md`) | Plan and prioritise product roadmaps using RICE, MoSCoW, and ICE frameworks |
| [pm-stakeholder-comms](`.github/skills/pm-stakeholder-comms/SKILL.md`) | Draft audience-tailored stakeholder updates using ROAM risk framework |
| [pm-user-research-synthesis](`.github/skills/pm-user-research-synthesis/SKILL.md`) | Synthesise user research into structured insights, themes, and opportunity areas |
| [data-analysis](`.github/skills/data-analysis/SKILL.md`) | Explore, query, and analyse datasets to extract insights and trends |
| [marketing-strategy](`.github/skills/marketing-strategy/SKILL.md`) | Plan marketing activities including positioning, campaigns, and go-to-market |

## 🤝 Contributing

Feel free to add more instruction templates or improve existing ones to cover additional use cases and project patterns.

## 📝 License

Use these templates freely in your projects.
