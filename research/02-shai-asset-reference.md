# SHAI — Asset Reference & Table of Contents

> Personal AI coding assistant plugin system for VS Code / GitHub Copilot.
> Designed for Claude Code portability (compatible naming/structure, dual build later).

## Distribution Model

**Format**: VS Code Agent Plugins (git-based)
**Architecture**: Modular plugins per stack — install only what you need
**Marketplace**: This repository acts as the plugin marketplace index
**Install method**: `Chat: Install Plugin From Source` → repo URL, or via marketplace discovery

```
shai/                               ← marketplace repo
├── plugins/
│   ├── shai-core/                  ← cross-cutting standards & workflows
│   ├── shai-typescript/            ← TypeScript conventions
│   ├── shai-react/                 ← React + Tailwind + shadcn
│   ├── shai-angular/               ← Angular conventions
│   ├── shai-dotnet/                ← .NET / C# ecosystem
│   ├── shai-node/                  ← Node.js / Express
│   ├── shai-firebase/              ← Firebase ecosystem
│   └── shai-playwright/            ← E2E testing with Playwright
```

Each plugin contains a `plugin.json` + any combination of:
- `skills/` — portable capabilities with scripts & resources
- `agents/` — specialized personas with tool restrictions
- `hooks/` — lifecycle automation (JSON)
- `.mcp.json` — external tool integrations (if needed)

> **Note on prompts**: In the plugin format, prompt-like behaviors are delivered as **skills** (invocable via `/slash-command`). Standalone `.prompt.md` files are for workspace-level use; within plugins, prefer skills.

---

## Legend

| Column       | Meaning                                                                                 |
| ------------ | --------------------------------------------------------------------------------------- |
| **Type**     | `instruction` · `skill` · `agent` · `hook` · `prompt`                                   |
| **Priority** | `Must` essential · `Should` high-value · `Could` nice-to-have · `Won't` deferred/future |
| **Status**   | 🔴 not started · 🟡 has legacy draft in `obsolete/` · 🟢 done                              |
| **Plugin**   | which shai plugin module it belongs to                                                  |

---

## 1. shai-core

Cross-cutting coding standards, general-purpose agents, and universal workflows.
Every project should install this.

> **copilot-instructions note**: Security basics (never hardcode secrets, validate inputs at boundaries, OWASP awareness) belong in the global `copilot-instructions.md`, not as a standalone instruction file. The `security-audit` skill handles deeper analysis on demand.

### 1.1 Instructions

| #     | Asset Name                      | Type        | applyTo   | Priority | Status | Purpose                                                                                                       | Example                                                                      |
| ----- | ------------------------------- | ----------- | --------- | -------- | ------ | ------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| C-I01 | `shai-general-coding-standards` | instruction | `**`      | Must     | 🟡      | Naming conventions (PascalCase types, camelCase vars, `_private`), comment style, constants, imports ordering | "Use `_name` for private fields, no `#private`, ALL_CAPS for const"          |
| C-I02 | `shai-error-handling`           | instruction | `**`      | Should   | 🔴      | Try/catch patterns, error boundaries, logging errors with context, custom error classes                       | "Always log errors with contextual info, use typed error classes"            |
| C-I03 | `shai-documentation-standards`  | instruction | `**/*.md` | Should   | 🟡      | README structure (title, brief, quick start, use cases), inline docs policy, JSDoc/XMLDoc rules               | "READMEs must have: title, brief, quick start, use cases"                    |
| C-I04 | `shai-logging-conventions`      | instruction | `**`      | Could    | 🔴      | Structured logging levels, what to log, PII rules, correlation IDs                                            | "Use structured logging with contextId, never log PII"                       |
| C-I05 | `shai-git-conventions`          | instruction | `**`      | Should   | 🔴      | Branch naming, commit message format, PR description template                                                 | "Conventional commits: feat(scope): description"                             |

### 1.2 Agents

| #     | Asset Name           | Type  | Tools                                                       | Priority | Status | Purpose                                                                                                                            | Example trigger                                                       |
| ----- | -------------------- | ----- | ----------------------------------------------------------- | -------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| C-A01 | `shai-architect`     | agent | `search/codebase`, `web/fetch`, `search/usages` (read-only) | Must     | 🟡      | High-level software design: system structure, component boundaries, tech stack decisions, design patterns. Handoff → `implementer` | "Design an event-driven architecture for the order processing module" |
| C-A02 | `shai-planner`       | agent | `search/codebase`, `web/fetch` (read-only)                  | Must     | 🔴      | Generates implementation plans from feature descriptions. Breaks into tasks. Handoff → `agent`                                     | "Plan the implementation of user authentication with OAuth2"          |
| C-A03 | `shai-code-reviewer` | agent | `search/codebase`, `search/usages` (read-only)              | Should   | 🟡      | Security, performance, maintainability review. Outputs issues by severity                                                          | "Review the changes in the auth module for security issues"           |
| C-A04 | `shai-scaffolder`    | agent | `edit`, `terminal`, `search/codebase`                       | Should   | 🔴      | Orchestrates project/component scaffolding using appropriate tech-specific skills. Asks clarifying questions about stack, features | "Scaffold a new microservice for user management"                     |
| C-A05 | `shai-doc-writer`    | agent | `search/codebase`, `edit`, `web/fetch`                      | Could    | 🔴      | Writes & updates documentation: READMEs, API docs, architecture decision records                                                   | "Write the README for this project following our standards"           |
| C-A06 | `shai-orchestrator`  | agent | `agent` (subagent access to all others)                     | Won't    | 🔴      | Meta-agent that coordinates workflows: plan → scaffold → implement → test → review. Uses subagents                                 | "Build the login feature end-to-end"                                  |

### 1.3 Skills

| #     | Asset Name                | Type  | Priority | Status | Purpose                                                                                                                 | Example invocation                                |
| ----- | ------------------------- | ----- | -------- | ------ | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| C-S01 | `shai-code-review`        | skill | Should   | 🟡      | Step-by-step code review workflow: check architecture, security, performance, style. Includes review checklist template | `/shai-code-review for the auth module`           |
| C-S02 | `shai-tdd-feature`        | skill | Should   | 🔴      | TDD workflow: write failing tests → implement → refactor. Includes test-first templates per framework                   | `/shai-tdd-feature add discount code to checkout` |
| C-S03 | `shai-add-feature`        | skill | Should   | 🟡      | Feature implementation workflow: understand requirements → find relevant code → implement → test → document             | `/shai-add-feature user profile page`             |
| C-S04 | `shai-scaffold-component` | skill | Should   | 🔴      | Generic component/class scaffolding: creates files, tests, barrel exports. Delegates to framework-specific patterns     | `/shai-scaffold-component UserCard`               |
| C-S05 | `shai-setup-tailwind`     | skill | Could    | 🔴      | Install & configure Tailwind CSS in an existing project. Config file, PostCSS, purge settings                           | `/shai-setup-tailwind`                            |
| C-S06 | `shai-setup-shadcn`       | skill | Could    | 🔴      | Install shadcn/ui library, configure components.json, add initial components                                            | `/shai-setup-shadcn`                              |
| C-S07 | `shai-create-skill`       | skill | Could    | 🟡      | Meta-skill: creates new SKILL.md files following the agent skills spec                                                  | `/shai-create-skill for database migration`       |
| C-S08 | `shai-create-agent`       | skill | Could    | 🟡      | Meta-skill: creates new .agent.md files with proper frontmatter, tools, handoffs                                        | `/shai-create-agent security-reviewer`            |
| C-S09 | `shai-pr-preparation`     | skill | Should   | 🔴      | Prepares PR: generates description, checks diff, suggests reviewers, validates CI readiness                             | `/shai-pr-preparation`                            |
| C-S10 | `shai-research-docs`      | skill | Could    | 🔴      | Looks up official documentation on the web for a given library/framework, summarizes relevant parts                     | `/shai-research-docs react-hook-form validation`  |
| C-S11 | `shai-security-audit`     | skill | Should   | 🔴      | Security review: OWASP top 10 checks, secret detection, input validation audit, auth pattern review                     | `/shai-security-audit for the auth module`        |
| C-S12 | `shai-software-design`    | skill | Must     | 🟢      | Propose software design, select GoF patterns, enforce SOLID/KISS/DRY/YAGNI, composition over inheritance. Usable by `shai-architect` | `/shai-software-design for the payment module` |

### 1.4 Hooks

| #     | Asset Name                     | Type | Event                   | Priority | Status | Purpose                                                                           |
| ----- | ------------------------------ | ---- | ----------------------- | -------- | ------ | --------------------------------------------------------------------------------- |
| C-H01 | `shai-format-on-edit`          | hook | `PostToolUse`           | Should   | 🔴      | Runs formatter (Prettier/dotnet format) after every file edit by the agent        |
| C-H02 | `shai-lint-on-edit`            | hook | `PostToolUse`           | Could    | 🔴      | Runs linter after file edit, feeds warnings back as system message                |
| C-H03 | `shai-dangerous-command-guard` | hook | `PreToolUse`            | Should   | 🔴      | Blocks destructive terminal commands (`rm -rf`, `DROP TABLE`, `git push --force`) |
| C-H04 | `shai-session-audit-log`       | hook | `SessionStart` / `Stop` | Won't    | 🔴      | Logs session start/end with timestamp, files touched, commands run                |

### 1.5 Prompts (workspace-level, not in plugin)

| #     | Asset Name              | Type   | Priority | Status | Purpose                                                                                      |
| ----- | ----------------------- | ------ | -------- | ------ | -------------------------------------------------------------------------------------------- |
| C-P01 | `shai-quick-plan`       | prompt | Should   | 🔴      | Lightweight: "generate a 5-bullet implementation plan for this feature" (ask mode, no edits) |
| C-P02 | `shai-explain-codebase` | prompt | Could    | 🔴      | "Explain the architecture and key patterns of this project" (read-only)                      |
| C-P03 | `shai-fix-ci`           | prompt | Could    | 🔴      | "Analyze the CI failure and suggest a fix" (uses GitHub Actions skill if available)          |

---

## 2. shai-typescript

TypeScript-specific conventions and workflows. Install alongside shai-core for any TS project.

### 2.1 Instructions

| #     | Asset Name                    | Type        | applyTo                     | Priority | Status | Purpose                                                                                                                     | Example                                                                      |
| ----- | ----------------------------- | ----------- | --------------------------- | -------- | ------ | --------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| T-I01 | `shai-typescript-conventions` | instruction | `**/*.ts,**/*.tsx`          | Must     | 🟡      | Strict TS rules: prefer `interface` over `type` for objects, use discriminated unions, no `any`, barrel files, path aliases | "Use `interface` for data shapes, `type` for unions/intersections"           |
| T-I02 | `shai-typescript-testing`     | instruction | `**/*.spec.ts,**/*.test.ts` | Should   | 🟢      | Test file structure, naming (`describe/it`), mocking patterns, assertion style                                              | "Arrange-Act-Assert pattern, descriptive test names"                         |
| T-I03 | `shai-tsconfig-standards`     | instruction | `**/tsconfig*.json`         | Could    | 🔴      | Strict mode, path aliases, module resolution, recommended compiler options                                                  | "Always enable strict, noUncheckedIndexedAccess, exactOptionalPropertyTypes" |

### 2.2 Skills

| #     | Asset Name                 | Type  | Priority | Status | Purpose                                                                                  |
| ----- | -------------------------- | ----- | -------- | ------ | ---------------------------------------------------------------------------------------- |
| T-S01 | `shai-scaffold-ts-project` | skill | Should   | 🟡      | Scaffold a TypeScript project: tsconfig, eslint, prettier, jest/vitest, folder structure |
| T-S02 | `shai-unit-testing-ts`     | skill | Should   | 🟢      | Write unit tests for TS code: mocking strategy, test utilities, coverage targets         |

---

## 3. shai-react

React + TypeScript + Tailwind + shadcn patterns. Depends on shai-typescript.

### 3.1 Instructions

| #     | Asset Name                    | Type        | applyTo                       | Priority | Status | Purpose                                                                                                         | Example                                                                     |
| ----- | ----------------------------- | ----------- | ----------------------------- | -------- | ------ | --------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| R-I01 | `shai-react-components`       | instruction | `**/*.tsx`                    | Must     | 🟡      | Functional components, hooks rules, prop types, composition patterns, CSS modules vs Tailwind                   | "Use `React.FC` sparingly, prefer explicit props interface, no `any` props" |
| R-I02 | `shai-react-state-management` | instruction | `**/*.tsx,**/*.ts`            | Should   | 🔴      | State management patterns: useState/useReducer for local, context or zustand for shared, react-query for server | "Colocate state, lift only when needed, use react-query for API data"       |
| R-I03 | `shai-react-testing`          | instruction | `**/*.test.tsx,**/*.spec.tsx` | Should   | 🔴      | React Testing Library patterns, what to test (behavior not implementation), accessibility queries               | "Prefer getByRole over getByTestId, test user interactions"                 |

### 3.2 Skills

| #     | Asset Name                    | Type  | Priority | Status | Purpose                                                                                |
| ----- | ----------------------------- | ----- | -------- | ------ | -------------------------------------------------------------------------------------- |
| R-S01 | `shai-scaffold-react-app`     | skill | Must     | 🟡      | Scaffold React+Vite+TS+Tailwind+shadcn app: folder structure, routing, base components |
| R-S02 | `shai-create-react-component` | skill | Should   | 🟡      | Create a React component: component file, tests, story (optional), barrel export       |
| R-S03 | `shai-setup-react-testing`    | skill | Could    | 🔴      | Set up React Testing Library + Vitest, configure MSW for API mocking                   |

---

## 4. shai-angular

Angular-specific conventions and workflows. Depends on shai-typescript.

### 4.1 Instructions

| #     | Asset Name                | Type        | applyTo                          | Priority | Status | Purpose                                                                                     | Example                                                          |
| ----- | ------------------------- | ----------- | -------------------------------- | -------- | ------ | ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| A-I01 | `shai-angular-components` | instruction | `**/*.component.ts`              | Must     | 🟡      | Component architecture: smart/dumb, OnPush change detection, signals, standalone components | "Prefer standalone components, use OnPush, signals for state"    |
| A-I02 | `shai-angular-services`   | instruction | `**/*.service.ts`                | Should   | 🔴      | Service patterns: providedIn root vs module, injection tokens, rxjs operators               | "Use `inject()` over constructor injection, pure pipes"          |
| A-I03 | `shai-angular-testing`    | instruction | `**/*.spec.ts` (Angular context) | Should   | 🔴      | TestBed setup, component harnesses, service mocking, marble testing                         | "Use component test harnesses, mock services with jasmine spies" |

### 4.2 Skills

| #     | Asset Name                      | Type  | Priority | Status | Purpose                                                                               |
| ----- | ------------------------------- | ----- | -------- | ------ | ------------------------------------------------------------------------------------- |
| A-S01 | `shai-scaffold-angular-app`     | skill | Should   | 🟡      | Scaffold Angular app with CLI: routing, lazy loading, shared module structure         |
| A-S02 | `shai-create-angular-component` | skill | Should   | 🔴      | Create Angular component: standalone, OnPush, signals, test file, module registration |

---

## 5. shai-dotnet

.NET / C# ecosystem. Clean Architecture, DDD, CQRS patterns.

### 5.1 Instructions

| #     | Asset Name                 | Type        | applyTo                                     | Priority | Status | Purpose                                                                                                                   | Example                                                                   |
| ----- | -------------------------- | ----------- | ------------------------------------------- | -------- | ------ | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| D-I01 | `shai-csharp-conventions`  | instruction | `**/*.cs`                                   | Must     | 🟡      | C# naming (PascalCase public, `_camelCase` private), nullable reference types, records vs classes, file-scoped namespaces | "Enable nullable, use `_name` for private fields, file-scoped namespaces" |
| D-I02 | `shai-dotnet-architecture` | instruction | `**/*.cs`                                   | Must     | 🟡      | Clean Architecture layers, DDD aggregates/entities/value objects, CQRS with MediatR                                       | "Domain layer has no dependencies, use Value Objects for identifiers"     |
| D-I03 | `shai-dotnet-testing`      | instruction | `**/*Tests.cs,**/*Test.cs`                  | Should   | 🟡      | xUnit conventions, FluentAssertions, NSubstitute, test naming (`Method_Scenario_Expected`), test containers               | "Use FluentAssertions, NSubstitute, Arrange-Act-Assert"                   |
| D-I04 | `shai-dotnet-di`           | instruction | `**/Startup.cs,**/Program.cs,**/*Module.cs` | Could    | 🔴      | DI registration conventions, Autofac modules, keyed services, health checks                                               | "Register via modules, interface → implementation, prefer scoped"         |
| D-I05 | `shai-dotnet-api-design`   | instruction | `**/*Controller.cs,**/*Endpoint.cs`         | Could    | 🔴      | REST API patterns: minimal APIs or controllers, versioning, error responses (ProblemDetails), validation                  | "Use ProblemDetails for errors, FluentValidation for request validation"  |

### 5.2 Agents

| #     | Asset Name              | Type  | Tools                                 | Priority | Status | Purpose                                                                                         |
| ----- | ----------------------- | ----- | ------------------------------------- | -------- | ------ | ----------------------------------------------------------------------------------------------- |
| D-A01 | `shai-dotnet-architect` | agent | read-only                             | Must     | 🟡      | .NET architecture design: solution structure, layer boundaries, NuGet packages. Handoff → agent |
| D-A02 | `shai-dotnet-tester`    | agent | `edit`, `terminal`, `search/codebase` | Should   | 🟡      | Writes and debugs .NET unit tests. Runs tests, analyzes failures                                |
| D-A03 | `shai-dotnet-debugger`  | agent | `terminal`, `search/codebase`         | Could    | 🟡      | .NET debugging: reads logs, analyzes stack traces, suggests breakpoints                         |
| D-A04 | `shai-dotnet-migrator`  | agent | `edit`, `terminal`, `search/codebase` | Could    | 🟡      | .NET migration: framework upgrades, breaking change analysis, refactoring strategies            |

### 5.3 Skills

| #     | Asset Name                 | Type  | Priority | Status | Purpose                                                                               |
| ----- | -------------------------- | ----- | -------- | ------ | ------------------------------------------------------------------------------------- |
| D-S01 | `shai-scaffold-dotnet-app` | skill | Must     | 🟡      | Scaffold .NET solution: Clean Architecture layers, projects, base classes, DI wiring  |
| D-S02 | `shai-unit-testing-dotnet` | skill | Should   | 🟡      | Write .NET unit tests: fixture setup, mocking, assertion patterns, test data builders |
| D-S03 | `shai-add-migration`       | skill | Should   | 🟡      | EF Core migration workflow: create migration, review SQL, update database             |
| D-S04 | `shai-dotnet-package`      | skill | Could    | 🟡      | Package & publish NuGet: versioning, csproj config, CI integration                    |

---

## 6. shai-node

Node.js / Express backend patterns.

### 6.1 Instructions

| #     | Asset Name                | Type        | applyTo                                   | Priority | Status | Purpose                                                                                     | Example                                                            |
| ----- | ------------------------- | ----------- | ----------------------------------------- | -------- | ------ | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| N-I01 | `shai-nodejs-conventions` | instruction | `**/*.js,**/*.mjs,**/*.ts` (Node context) | Must     | 🟡      | Project structure, ES modules, environment config, package.json scripts, folder conventions | "Use ES modules, env vars via dotenv, scripts for build/test/lint" |
| N-I02 | `shai-express-patterns`   | instruction | `**/routes/**,**/middleware/**`           | Should   | 🔴      | Express middleware, router structure, error handling middleware, request validation         | "Centralized error handler, validation middleware with Joi/Zod"    |

### 6.2 Skills

| #     | Asset Name               | Type  | Priority | Status | Purpose                                                                        |
| ----- | ------------------------ | ----- | -------- | ------ | ------------------------------------------------------------------------------ |
| N-S01 | `shai-scaffold-node-app` | skill | Should   | 🟡      | Scaffold Node.js/Express API: folder structure, middleware, env config, Docker |

---

## 7. shai-firebase

Firebase ecosystem: Cloud Functions, Firestore, Hosting, security rules, emulators.

### 7.1 Instructions

| #     | Asset Name                  | Type        | applyTo                                      | Priority | Status | Purpose                                                                                       | Example                                                                    |
| ----- | --------------------------- | ----------- | -------------------------------------------- | -------- | ------ | --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| F-I01 | `shai-firebase-conventions` | instruction | `**/functions/**,**/firestore*,**/firebase*` | Must     | 🔴      | Firebase project structure, Cloud Functions patterns, Firestore data modeling, security rules | "Use Firebase Admin SDK, typed Firestore references, security rules first" |
| F-I02 | `shai-firestore-modeling`   | instruction | `**/firestore*,**/models/**`                 | Should   | 🔴      | Firestore data modeling: denormalization, subcollections, composite keys, converters          | "Use typed converters, design for query patterns not normalization"        |

### 7.2 Skills

| #     | Asset Name                   | Type  | Priority | Status | Purpose                                                                         |
| ----- | ---------------------------- | ----- | -------- | ------ | ------------------------------------------------------------------------------- |
| F-S01 | `shai-scaffold-firebase-app` | skill | Should   | 🟡      | Scaffold Firebase project: functions, hosting, Firestore rules, emulator config |
| F-S02 | `shai-setup-firebase`        | skill | Could    | 🔴      | Add Firebase to an existing project: init, config, emulators                    |
| F-S03 | `shai-deploy-firebase`       | skill | Could    | 🔴      | Firebase deployment workflow: build → test → deploy functions/hosting/rules     |

---

## 8. shai-playwright

End-to-end testing with Playwright. Cross-framework, works with any frontend.

### 8.1 Instructions

| #     | Asset Name                    | Type        | applyTo                             | Priority | Status | Purpose                                                                              | Example                                                                |
| ----- | ----------------------------- | ----------- | ----------------------------------- | -------- | ------ | ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------- |
| P-I01 | `shai-playwright-conventions` | instruction | `**/*.spec.ts` (Playwright context) | Must     | 🟡      | Test structure, locator strategy (prefer role-based), POM pattern, test independence | "Use role-based locators, Page Object Model, atomic independent tests" |
| P-I02 | `shai-playwright-config`      | instruction | `**/playwright.config.ts`           | Could    | 🔴      | Config best practices: parallel workers, retries, reporters, projects for browsers   | "Configure retries=2, parallel, HTML reporter, multi-browser projects" |

### 8.2 Agents

| #     | Asset Name                  | Type  | Tools                                 | Priority | Status | Purpose                                                                          |
| ----- | --------------------------- | ----- | ------------------------------------- | -------- | ------ | -------------------------------------------------------------------------------- |
| P-A01 | `shai-playwright-architect` | agent | read-only + `web/fetch`               | Should   | 🟡      | E2E test strategy: test plan design, POM structure, critical path identification |
| P-A02 | `shai-playwright-tester`    | agent | `edit`, `terminal`, `search/codebase` | Should   | 🟡      | Writes Playwright tests: creates specs, page objects, fixtures                   |
| P-A03 | `shai-playwright-debugger`  | agent | `terminal`, `search/codebase`         | Could    | 🟡      | Debugs failing E2E tests: reads traces, screenshots, suggests fixes              |

### 8.3 Skills

| #     | Asset Name               | Type  | Priority | Status | Purpose                                                                    |
| ----- | ------------------------ | ----- | -------- | ------ | -------------------------------------------------------------------------- |
| P-S01 | `shai-setup-playwright`  | skill | Must     | 🟡      | Set up Playwright in a project: install, config, base fixtures, first test |
| P-S02 | `shai-write-e2e-test`    | skill | Should   | 🟡      | Write E2E tests: scenario → page objects → spec file → run & verify        |
| P-S03 | `shai-debug-e2e-test`    | skill | Should   | 🟡      | Debug failing E2E test: analyze trace, identify root cause, fix            |
| P-S04 | `shai-page-object-model` | skill | Should   | 🟡      | Create/refactor Page Object Model classes with proper locators and actions |

---

## Summary

### Asset counts by plugin

| Plugin              | Instructions | Agents | Skills | Hooks | Prompts | Total  |
| ------------------- | ------------ | ------ | ------ | ----- | ------- | ------ |
| **shai-core**       | 5            | 6      | 12     | 4     | 3       | **30** |
| **shai-typescript** | 3            | —      | 2      | —     | —       | **5**  |
| **shai-react**      | 3            | —      | 3      | —     | —       | **6**  |
| **shai-angular**    | 3            | —      | 2      | —     | —       | **5**  |
| **shai-dotnet**     | 5            | 4      | 4      | —     | —       | **13** |
| **shai-node**       | 2            | —      | 1      | —     | —       | **3**  |
| **shai-firebase**   | 2            | —      | 3      | —     | —       | **5**  |
| **shai-playwright** | 2            | 3      | 4      | —     | —       | **9**  |
| **TOTAL**           | **25**       | **13** | **31** | **4** | **3**   | **76** |

### Asset counts by priority (MoSCoW)

| Priority   | Count | Description                                                                                    |
| ---------- | ----- | ---------------------------------------------------------------------------------------------- |
| **Must**   | ~18   | Essential: core standards, primary agents, key scaffolding — system doesn't work without these |
| **Should** | ~35   | High-value: testing, reviews, feature workflows — expected for a complete experience           |
| **Could**  | ~18   | Nice-to-have: advanced config, deployment, utility skills — included if time permits           |
| **Won't**  | ~5    | Deferred: orchestrator, audit logging — planned for future phases, not this iteration          |

### Assets with existing legacy drafts (🟡)

The following assets have prior work in the `obsolete/` folder that can be used as starting points:

| Asset ID | Name                          | Legacy source                                             |
| -------- | ----------------------------- | --------------------------------------------------------- |
| C-I01    | shai-general-coding-standards | `obsolete/dotgithub/copilot-instructions.md`              |
| C-I03    | shai-documentation-standards  | `obsolete/readme-style.instructions.md`                   |
| C-A01    | shai-architect                | `obsolete/claude/agents/dotnet-architect.md` (generalize) |
| C-A03    | shai-code-reviewer            | `obsolete/claude/skills/code-review/`                     |
| C-S01    | shai-code-review              | `obsolete/claude/skills/code-review/`                     |
| C-S03    | shai-add-feature              | `obsolete/claude/skills/add-feature/`                     |
| C-S07    | shai-create-skill             | `obsolete/dotgithub/skills/create-skill/`                 |
| C-S08    | shai-create-agent             | `obsolete/dotgithub/skills/create-agent/`                 |
| T-I01    | shai-typescript-conventions   | `obsolete/typescript-project.instructions.md`             |
| T-I02    | shai-typescript-testing       | ~~`obsolete/typescript-tests.instructions.md`~~ (deleted — consumed)  |
| T-S01    | shai-scaffold-ts-project      | `obsolete/typescript-workspace.instructions.md`           |
| T-S02    | shai-unit-testing-ts          | ~~`obsolete/typescript-tests.instructions.md`~~ (deleted — consumed)  |
| R-I01    | shai-react-components         | `obsolete/react-components.instructions.md`               |
| R-S01    | shai-scaffold-react-app       | `obsolete/react-components.instructions.md` (partial)     |
| A-I01    | shai-angular-components       | `obsolete/angular-components.instructions.md`             |
| D-I01    | shai-csharp-conventions       | `obsolete/csharp-project.instructions.md`                 |
| D-I02    | shai-dotnet-architecture      | `obsolete/claude/agents/dotnet-architect.md`              |
| D-I03    | shai-dotnet-testing           | `obsolete/csharp-unit-tests.instructions.md`              |
| D-A01–04 | shai-dotnet-* agents          | `obsolete/claude/agents/dotnet-*.md`                      |
| D-S01–04 | shai-dotnet-* skills          | `obsolete/claude/skills/`                                 |
| N-I01    | shai-nodejs-conventions       | `obsolete/nodejs-scaffold.instructions.md`                |
| N-S01    | shai-scaffold-node-app        | `obsolete/nodejs-scaffold.instructions.md`                |
| F-S01    | shai-scaffold-firebase-app    | `obsolete/nodejs-scaffold.instructions.md` (partial)      |
| P-I01    | shai-playwright-conventions   | `obsolete/claude/skills/write-e2e-test/`                  |
| P-A01–03 | shai-playwright-* agents      | `obsolete/claude/agents/playwright-*.md`                  |
| P-S01–04 | shai-playwright-* skills      | `obsolete/claude/skills/`                                 |

### MCP dependencies (external, not shai assets)

These are external MCP servers that shai skills/agents may reference as tools:

| MCP Server    | Used by         | Purpose                            |
| ------------- | --------------- | ---------------------------------- |
| `playwright`  | shai-playwright | Browser automation for E2E tests   |
| `shadcn`      | shai-react      | shadcn/ui component operations     |
| `angular-cli` | shai-angular    | Angular CLI operations             |
| `github`      | shai-core       | GitHub API: PRs, issues, workflows |
| `todoist`     | (future)        | Task management integration        |

---

## Recommended Build Order

### Phase 1 — Must Have
1. `shai-core` instructions (C-I01, C-I05 shai-git-conventions, C-I06 shai-software-design)
2. `shai-core` agents — `shai-architect` (C-A01), `shai-planner` (C-A02)
3. Framework instructions — one per active stack (T-I01, R-I01, A-I01, D-I01, D-I02, N-I01, F-I01, P-I01)
4. Key scaffolding skills (R-S01 shai-scaffold-react-app, D-S01 shai-scaffold-dotnet-app, P-S01 shai-setup-playwright)

### Phase 2 — Should Have
5. Testing instructions & skills across stacks
6. `shai-code-review` skill and `shai-code-reviewer` agent
7. `shai-tdd-feature` and `shai-add-feature` skills
8. `shai-scaffolder` agent + framework-specific component skills
9. `shai-pr-preparation` skill
10. `shai-security-audit` skill (C-S11)
11. Hooks: `shai-format-on-edit`, `shai-dangerous-command-guard`
12. Remaining framework-specific agents (shai-dotnet-tester, shai-playwright-tester/architect)

### Phase 3 — Could Have
13. Remaining instructions (logging, API design, advanced config)
14. Firebase deployment & setup skills (F-S02, F-S03)
15. Utility skills (shai-research-docs, shai-setup-tailwind, shai-setup-shadcn)
16. Hook: `shai-lint-on-edit`
17. Remaining agents (shai-doc-writer, shai-dotnet-debugger, shai-dotnet-migrator, shai-playwright-debugger)

### Phase 4 — Won't Have (this iteration)
18. `shai-orchestrator` meta-agent with subagent coordination
19. Audit hooks (shai-session-audit-log)
20. Claude Code dual-format export
21. Plugin marketplace publishing & documentation
