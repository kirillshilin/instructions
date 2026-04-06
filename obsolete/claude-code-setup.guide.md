# 🤖 Claude Code – Efficient .NET Development Setup

> A practical guide to configuring Claude Code for maximum productivity on .NET projects — covering installation, CLAUDE.md, MCP servers, custom agents, skills, VS Code integration, and further customisation.

---

## 📋 Overview

Claude Code is Anthropic's agentic CLI coding tool that runs directly in your terminal and operates autonomously on your codebase. Unlike a chat assistant, it reads files, writes code, runs tests, and executes shell commands in a continuous loop — making it ideal for the build/test/fix cycle common in .NET development.

This guide walks you through the full setup:

1. [Prerequisites & Installation](#1-prerequisites--installation)
2. [Project CLAUDE.md — Your AI Constitution](#2-project-claudemd--your-ai-constitution)
3. [Global User Configuration](#3-global-user-configuration)
4. [MCP Servers — Extending Claude's Reach](#4-mcp-servers--extending-claudes-reach)
5. [Custom Agents for .NET](#5-custom-agents-for-net)
6. [Skills & Reusable Workflows](#6-skills--reusable-workflows)
7. [VS Code + Claude Code Integration](#7-vs-code--claude-code-integration)
8. [.NET-Specific Instructions & Conventions](#8-net-specific-instructions--conventions)
9. [Hooks & Automation](#9-hooks--automation)
10. [Further Customisation](#10-further-customisation)

---

## 1. Prerequisites & Installation

### Required
- **Node.js 18+** — Claude Code is distributed as an npm package
- **.NET SDK 8+** — the toolchain Claude Code will invoke
- **Git** — Claude Code uses git heavily for context and diffs

### Install Claude Code
```bash
npm install -g @anthropic-ai/claude-code
```

Verify:
```bash
claude --version
```

### Authenticate
```bash
claude
```
Follow the browser-based OAuth flow on first launch. Your API key is stored in `~/.claude/credentials.json`.

### Recommended: Set a default model
```bash
# In ~/.claude/settings.json or via the /model command inside a session
claude config set model claude-opus-4-5   # best for complex refactors
claude config set model claude-sonnet-4-5  # faster for routine tasks
```

---

## 2. Project CLAUDE.md — Your AI Constitution

`CLAUDE.md` is the single most impactful file you can create. Claude Code reads it automatically at the start of every session and uses it to understand your project, standards, and constraints.

Place it at the **repository root** (and optionally in sub-folders for monorepos).

### Minimal .NET CLAUDE.md template

```markdown
# Project: <YourProjectName>

## Tech Stack
- .NET 8 / ASP.NET Core
- C# 12
- xUnit + FluentAssertions + Moq for tests
- Entity Framework Core 8 (PostgreSQL / SQL Server)
- MediatR for CQRS
- Serilog for structured logging

## Solution Structure
- `src/` — production code
- `tests/` — unit and integration tests (mirrors `src/` folder structure)
- `docs/` — architecture decision records

## Build & Test Commands
```bash
dotnet build
dotnet test --logger "console;verbosity=minimal"
dotnet test --filter Category=Unit
```

## Code Conventions
- Follow C# coding guidelines from `.github/instructions/csharp-project.instructions.md`
- All test methods follow `Should_ExpectedBehavior_WhenCondition` naming
- Use `partial` classes to keep files under 200 lines
- Never suppress nullable warnings without a comment explaining why
- Always run `dotnet format` before committing

## Architecture Rules
- Domain layer has zero infrastructure dependencies
- Queries and commands live in separate `Queries/` and `Commands/` folders
- All public APIs must have XML doc comments

## Things Claude Should Never Do
- Delete migration files
- Modify `*.csproj` files without explicit permission
- Change connection strings in `appsettings.json`
```

### Tips for a great CLAUDE.md
- **Keep it < 500 lines.** Claude Code reads the whole file on every task.
- **List exact commands.** "Run `dotnet test`" beats "run the tests".
- **Declare what's off-limits.** Prevents accidental changes to sensitive files.
- **Update it when conventions change.** Treat it like living documentation.

---

## 3. Global User Configuration

Claude Code supports a global settings file at `~/.claude/settings.json` and a global memory file at `~/.claude/CLAUDE.md`.

### ~/.claude/settings.json
```json
{
  "model": "claude-sonnet-4-5",
  "permissions": {
    "allow": [
      "Bash(dotnet:*)",
      "Bash(git:*)",
      "Bash(cat:*)",
      "Bash(find:*)"
    ],
    "deny": [
      "Bash(rm -rf:*)"
    ]
  },
  "env": {
    "DOTNET_CLI_TELEMETRY_OPTOUT": "1"
  }
}
```

### ~/.claude/CLAUDE.md (global memory)
Put personal preferences that apply across all projects here:
```markdown
## My Global Preferences
- Always use `var` for local variables when the type is obvious
- Prefer expression-bodied members for single-line methods
- Use `ArgumentNullException.ThrowIfNull` instead of manual null checks
- Prefer `required` properties over constructor injection in DTOs
- When adding a NuGet package, check it on NuGet.org first
```

---

## 4. MCP Servers — Extending Claude's Reach

**Model Context Protocol (MCP)** servers give Claude Code access to external tools and data sources beyond the local filesystem. Think of them as plugins.

### Installing MCP servers
```bash
# Project-level (stored in .mcp.json, commit to repo)
claude mcp add <server-name> -- <command> [args]

# User-level (stored in ~/.claude/mcp.json, personal use)
claude mcp add --scope user <server-name> -- <command> [args]
```

### Essential MCP servers for .NET development

| MCP Server | Purpose | Install |
|---|---|---|
| **@modelcontextprotocol/server-filesystem** | Safe read/write access to project files | `npx -y @modelcontextprotocol/server-filesystem .` |
| **@modelcontextprotocol/server-github** | Read PRs, issues, commits, run searches | `npx -y @modelcontextprotocol/server-github` |
| **@modelcontextprotocol/server-git** | Rich git history queries | `npx -y @modelcontextprotocol/server-git --repository .` |
| **mcp-dotnet** | Run dotnet CLI commands through MCP | `npx -y mcp-dotnet` |
| **@modelcontextprotocol/server-brave-search** | Web search for docs / NuGet packages | Requires Brave API key |
| **@modelcontextprotocol/server-memory** | Persistent knowledge graph across sessions | `npx -y @modelcontextprotocol/server-memory` |
| **mcp-nuget** | Search and resolve NuGet packages | `npx -y mcp-nuget` |

### Example .mcp.json for a .NET project
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "."]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    }
  }
}
```

### Where to find MCP servers
- **Official registry:** [modelcontextprotocol.io/servers](https://modelcontextprotocol.io/servers)
- **mcp.so** — community-curated MCP server marketplace
- **GitHub topic `mcp-server`** — search GitHub for community servers
- **npm** — search `@modelcontextprotocol` or `mcp-server-` prefix

---

## 5. Custom Agents for .NET

Custom agents are pre-configured Claude Code personas with specialised instructions, tools, and workflows. They live in `.claude/agents/` (project) or `~/.claude/agents/` (global).

### Agent file format
```markdown
---
name: dotnet-architect
description: Expert .NET solution architect. Use for design decisions, 
             architecture reviews, and adding new services.
tools: Read, Write, Bash, Glob, Grep
---

You are a senior .NET architect specialising in clean architecture and DDD.

When designing new features:
1. Start with the domain model — entities, value objects, aggregates
2. Define repository interfaces in the Domain layer
3. Implement use cases as MediatR handlers in the Application layer
4. Wire up infrastructure in the Infrastructure layer

Always check existing patterns in the codebase before introducing new ones.
Prefer extending existing abstractions over creating new ones.
```

### Recommended agents for .NET projects

#### 🏗️ `dotnet-architect.md`
- **Use for:** designing new services, reviewing architecture, domain modelling
- **Tools:** Read, Write, Glob, Grep, Bash(dotnet build)
- **Focus:** Clean Architecture, CQRS, DDD patterns, dependency rules

#### 🧪 `dotnet-tester.md`
- **Use for:** writing unit and integration tests, finding gaps in coverage
- **Tools:** Read, Write, Bash(dotnet test), Glob, Grep
- **Focus:** xUnit, FluentAssertions, Moq/NSubstitute, AAA pattern, Should_ naming

#### 🔄 `dotnet-migrator.md`
- **Use for:** EF Core migrations, schema changes, data migrations
- **Tools:** Read, Write, Bash(dotnet ef:*), Bash(dotnet build)
- **Focus:** safe migration authoring, rollback strategies, idempotent scripts

#### 🐛 `dotnet-debugger.md`
- **Use for:** investigating failing tests, runtime errors, performance issues
- **Tools:** Read, Bash(dotnet test), Bash(dotnet run), Grep
- **Focus:** root-cause analysis, minimal reproductions, log analysis

#### 📦 `dotnet-packager.md`
- **Use for:** NuGet package management, dependency upgrades, security audits
- **Tools:** Read, Write, Bash(dotnet list package:*), Bash(dotnet add package:*)
- **Focus:** versioning, transitive dependencies, `dotnet outdated`, CVE scanning

### Creating an agent quickly

```bash
# Create project-level agent
mkdir -p .claude/agents
cat > .claude/agents/dotnet-tester.md << 'EOF'
---
name: dotnet-tester
description: Writes and improves xUnit tests for .NET projects following 
             Should_ naming and AAA pattern. Use when writing or fixing tests.
tools: Read, Write, Bash, Glob, Grep
---

You are a .NET testing expert. Follow these rules strictly:
- Test method names: `Should_<ExpectedBehavior>_When<Condition>`
- Use xUnit [Fact] for single cases, [Theory] + [InlineData] for parameterised tests
- Structure: Arrange / Act / Assert with blank lines between sections
- Use FluentAssertions: `result.Should().Be(expected)`
- Mock with Moq: `var mock = new Mock<IService>()`
- Mirror the src/ folder structure in the tests/ folder
EOF
```

---

## 6. Skills & Reusable Workflows

Skills are step-by-step workflow documents that Claude Code follows for recurring tasks. They are invoked on demand and keep complex multi-step procedures consistent.

### Where skills live
```
.claude/
  skills/
    add-feature/
      SKILL.md        # The skill instructions
    add-migration/
      SKILL.md
    code-review/
      SKILL.md
```

### Example: `add-migration` skill

```markdown
# Add EF Core Migration

## When to use
When a domain model change requires a new database migration.

## Steps
1. Verify there are no pending uncommitted model changes: `git diff -- "*.cs"`
2. Build the solution to confirm it compiles: `dotnet build`
3. Generate the migration:
   ```bash
   dotnet ef migrations add <MigrationName> --project src/Infrastructure --startup-project src/Api
   ```
4. Review the generated migration file — check `Up()` and `Down()` for correctness
5. Apply locally to verify: `dotnet ef database update --project src/Infrastructure --startup-project src/Api`
6. Run integration tests: `dotnet test --filter Category=Integration`
7. Report what changed and any risks identified
```

### Example: `add-feature` skill

```markdown
# Add a New Feature (CQRS + Clean Architecture)

## Steps
1. Define the use case: create `Commands/<Name>Command.cs` or `Queries/<Name>Query.cs`
2. Create the MediatR handler in `Application/`
3. Add domain logic to the relevant aggregate if needed
4. Add the EF Core repository method if new data access is required
5. Create the API endpoint in `Presentation/`
6. Write unit tests covering the handler
7. Run `dotnet build && dotnet test` to verify
8. Run `dotnet format` to enforce style
```

### Invoking a skill in a session
```
Use the add-migration skill to add a migration for the new OrderItem entity.
```

---

## 7. VS Code + Claude Code Integration

Claude Code is terminal-first, but the VS Code extension gives you the best of both worlds.

### Install the extension
Search **"Claude Code"** in the VS Code Extensions Marketplace (publisher: `anthropic`), or:
```bash
code --install-extension anthropic.claude-code
```

### Recommended companion extensions for .NET

| Extension | Purpose |
|---|---|
| **C# Dev Kit** (`ms-dotnettools.csdevkit`) | Full .NET IDE experience: IntelliSense, debugger, test runner |
| **C#** (`ms-dotnettools.csharp`) | Base C# language support (required by Dev Kit) |
| **NuGet Package Manager GUI** (`aliasadidev.nugetpackagemanagergui`) | Visual NuGet management |
| **.NET Install Tool** (`ms-dotnettools.vscode-dotnet-runtime`) | Manages .NET SDK versions |
| **GitLens** (`eamodio.gitlens`) | Enriches git history — useful alongside Claude Code's git operations |
| **REST Client** (`humao.rest-client`) | Test APIs with `.http` files |
| **Thunder Client** (`rangav.vscode-thunder-client`) | Lightweight Postman alternative |
| **SonarLint** (`sonarsource.sonarlint-vscode`) | Real-time static analysis for C# |
| **Error Lens** (`usernamehakobyan.error-lens`) | Inline diagnostic display |

### VS Code settings for .NET development
Add to `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "[csharp]": {
    "editor.defaultFormatter": "ms-dotnettools.csharp"
  },
  "dotnet.defaultSolution": "YourSolution.sln"
}
```

> 💡 If you also use **GitHub Copilot** alongside Claude Code, add these settings to activate `.instructions.md` files (see [.NET-Specific Instructions](#8-net-specific-instructions--conventions)):
> ```json
> {
>   "github.copilot.chat.codeGeneration.useInstructionFiles": true,
>   "chat.includeApplyingInstructions": true
> }
> ```

---

## 8. .NET-Specific Instructions & Conventions

Copy instruction files from this repository into your project to give Claude Code precise, automatic guidance when editing C# files.

### Setup
```bash
mkdir -p .github/instructions

# Core C# conventions
cp csharp-project.instructions.md .github/instructions/
cp csharp-unit-tests.instructions.md .github/instructions/
cp readme-style.instructions.md .github/instructions/
```

### Additional .NET instructions to create

#### `.github/instructions/dotnet-async.instructions.md`
```markdown
---
name: .NET Async Patterns
description: Async/await conventions for .NET projects
applyTo: "**/*.cs"
---

# Async Conventions
- All async methods MUST be suffixed with `Async`
- Always pass `CancellationToken` as the last parameter in public async methods
- Never use `.Result` or `.Wait()` — always `await`
- Use `ConfigureAwait(false)` in library code
- Prefer `ValueTask` over `Task` for hot paths that often complete synchronously
```

#### `.github/instructions/dotnet-exceptions.instructions.md`
```markdown
---
name: .NET Exception Handling
description: Exception handling and error patterns for .NET projects
applyTo: "**/*.cs"
---

# Exception Handling
- Use custom exception types derived from a base `DomainException`
- Never catch `Exception` unless re-throwing or at the application boundary
- Use `ArgumentNullException.ThrowIfNull(param)` for null guards
- Use `ArgumentOutOfRangeException.ThrowIfNegative` and similar guard helpers
- Log exceptions at the boundary, not deep in domain logic
```

#### `.github/instructions/dotnet-efcore.instructions.md`
```markdown
---
name: EF Core Conventions
description: Entity Framework Core patterns and conventions
applyTo: "**/*.cs"
---

# EF Core
- Configure entities in `IEntityTypeConfiguration<T>` classes, not in `OnModelCreating`
- Never expose `DbContext` outside the Infrastructure layer
- Repository methods must accept `CancellationToken`
- Use `.AsNoTracking()` for read-only queries
- Migrations go in `src/Infrastructure/Migrations/`
- Never edit a migration file after it has been applied to any environment
```

---

## 9. Hooks & Automation

Hooks let you run commands automatically before or after Claude Code's tool calls, enabling guardrails and automation.

### Configure hooks in `settings.json`
```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "echo \"[Hook] Running: $CLAUDE_TOOL_INPUT\""
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "dotnet format --include \"$CLAUDE_FILE_PATH\" --verify-no-changes 2>/dev/null || dotnet format --include \"$CLAUDE_FILE_PATH\""
          }
        ]
      }
    ]
  }
}
```

### Useful hooks for .NET

| Hook | Trigger | Action |
|---|---|---|
| **Auto-format** | After any `.cs` file write | Run `dotnet format` on the changed file |
| **Build check** | After Write on `*.cs` | Run `dotnet build` to catch compile errors early |
| **Test guard** | Before `Bash(rm)` | Warn before deletion of test files |
| **Migration guard** | Before Write on `Migrations/` | Block edits to applied migration files |

---

## 10. Further Customisation

### Slash commands (custom)
Create custom `/commands` in `.claude/commands/`:
```markdown
<!-- .claude/commands/review-pr.md -->
Review the current git diff as if you were a senior .NET engineer doing a 
pull request review. Focus on:
1. Architecture violations (e.g., infrastructure leaking into domain)
2. Missing null checks or async anti-patterns
3. Test coverage gaps
4. Naming inconsistencies with the rest of the codebase

Output a structured review with: Summary, Issues (Critical/Major/Minor), Suggestions.
```

Invoke with: `/review-pr`

### Memory management
Use `/memory` in a session to persist facts across sessions:
```
/memory Add: This project uses NSubstitute, not Moq, for mocking.
/memory Add: The staging environment connection string is in Azure Key Vault, not appsettings.
```

These are stored in the MCP memory server (if configured) or in `~/.claude/CLAUDE.md`.

### .claudeignore — keep Claude focused
Create `.claudeignore` to exclude noisy files from Claude's context:
```
# Build output
bin/
obj/
*.user

# Generated files
**/Migrations/*.Designer.cs
**/*.g.cs
**/*.generated.cs

# Dependencies
node_modules/
packages/

# Secrets
appsettings.*.json
!appsettings.json
!appsettings.Development.json
```

### Multi-agent orchestration
For large features, decompose work across agents in a single session:
```
Use the dotnet-architect agent to design the OrderShipping bounded context.
Then use the dotnet-tester agent to write tests for the handlers it created.
Finally run dotnet build && dotnet test to verify everything passes.
```

### Recommended workflow for a new feature
```
1. /clear                          # fresh context
2. claude "Read CLAUDE.md and the 
   existing Orders/ feature, then 
   use the add-feature skill to 
   implement OrderCancellation"
3. Review changes with git diff
4. dotnet test --filter OrderCancellation
5. /review-pr                      # custom review command
```

---

## 🗂️ Recommended Project Layout

```
your-dotnet-project/
├── CLAUDE.md                          ← AI constitution (commit this!)
├── .mcp.json                          ← MCP server config (commit this!)
├── .claudeignore                      ← Files to exclude from context
├── .claude/
│   ├── agents/
│   │   ├── dotnet-architect.md
│   │   ├── dotnet-tester.md
│   │   ├── dotnet-migrator.md
│   │   └── dotnet-debugger.md
│   ├── skills/
│   │   ├── add-feature/SKILL.md
│   │   └── add-migration/SKILL.md
│   └── commands/
│       └── review-pr.md
├── .github/
│   └── instructions/
│       ├── csharp-project.instructions.md
│       ├── csharp-unit-tests.instructions.md
│       ├── dotnet-async.instructions.md
│       ├── dotnet-exceptions.instructions.md
│       └── dotnet-efcore.instructions.md
└── src/ tests/ ...
```

---

## 🚀 Quick Start Checklist

- [ ] Install Claude Code: `npm install -g @anthropic-ai/claude-code`
- [ ] Authenticate: `claude` (first run)
- [ ] Create `CLAUDE.md` at repo root with tech stack, commands, and conventions
- [ ] Create `~/.claude/CLAUDE.md` with personal preferences
- [ ] Add `.mcp.json` with filesystem, github, and memory MCP servers
- [ ] Copy `csharp-project.instructions.md` and `csharp-unit-tests.instructions.md` to `.github/instructions/`
- [ ] Create `.claude/agents/` with at minimum `dotnet-architect.md` and `dotnet-tester.md`
- [ ] Create `.claude/skills/add-feature/SKILL.md` and `add-migration/SKILL.md`
- [ ] Add `.claudeignore` to exclude `bin/`, `obj/`, generated files
- [ ] Install VS Code extension: **Claude Code** by Anthropic
- [ ] Install **C# Dev Kit** in VS Code

---

## 📚 Resources

- [Claude Code Documentation](https://docs.anthropic.com/en/docs/claude-code)
- [MCP Server Registry](https://modelcontextprotocol.io/servers)
- [mcp.so — Community MCP Marketplace](https://mcp.so)
- [Claude Code GitHub](https://github.com/anthropics/claude-code)
- [Model Context Protocol Spec](https://modelcontextprotocol.io)
- [.NET Coding Conventions (Microsoft)](https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/coding-style/coding-conventions)
