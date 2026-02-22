# Migration Plan: Claude Instructions → GitHub Copilot `.github/` Format

## Context

**Source**: `research/claude-instructions/` — Anthropic-flavoured agent definitions for three domains: **data**, **marketing**, and **product-management**.  
**Target**: `.github/agents/` and `.github/skills/` following this repository's existing conventions (see `agent-builder.agent.md`, `create-agent/SKILL.md`, `create-skill/SKILL.md`).

### Current `.github/` Inventory

| Type  | File                                          | Notes                                    |
| ----- | --------------------------------------------- | ---------------------------------------- |
| Agent | `agents/agent-builder.agent.md`               | Meta-agent for scaffolding agents/skills |
| Agent | `agents/requirements-research.agent.md`       | Requirements discovery                   |
| Skill | `skills/create-agent/SKILL.md`                | How to scaffold an agent                 |
| Skill | `skills/create-skill/SKILL.md`                | How to scaffold a skill                  |
| Skill | `skills/requirements-documentation/SKILL.md`  | Requirements docs                        |
| Skill | `skills/requirements-prioritization/SKILL.md` | MoSCoW / RICE / Kano                     |
| Skill | `skills/requirements-research/SKILL.md`       | Problem-space research                   |

### Source Material Inventory (Claude)

| Domain             | Type          | File                                      | Content                                                     |
| ------------------ | ------------- | ----------------------------------------- | ----------------------------------------------------------- |
| product-management | Connector ref | `CONNECTORS.md`                           | Tool placeholder mappings (~~chat, ~~project tracker, etc.) |
| product-management | Command       | `commands/competitive-brief.md`           | Competitive analysis brief workflow                         |
| product-management | Command       | `commands/metrics-review.md`              | Metrics review & trend analysis                             |
| product-management | Command       | `commands/roadmap-update.md`              | Roadmap create/update/reprioritise                          |
| product-management | Command       | `commands/stakeholder-update.md`          | Audience-tailored status updates                            |
| product-management | Command       | `commands/synthesize-research.md`         | User-research synthesis                                     |
| product-management | Command       | `commands/write-spec.md`                  | PRD / feature spec writing                                  |
| product-management | Skill         | `skills/competitive-analysis/SKILL.md`    | Feature matrices, positioning, win/loss                     |
| product-management | Skill         | `skills/feature-spec/SKILL.md`            | PRD structure, user stories, MoSCoW                         |
| product-management | Skill         | `skills/metrics-tracking/SKILL.md`        | Metrics hierarchy, OKRs, dashboards                         |
| product-management | Skill         | `skills/roadmap-management/SKILL.md`      | RICE/ICE, dependency mapping, capacity                      |
| product-management | Skill         | `skills/stakeholder-comms/SKILL.md`       | Update templates, G/Y/R, ROAM, ADRs                         |
| product-management | Skill         | `skills/user-research-synthesis/SKILL.md` | Thematic analysis, affinity mapping                         |
| data               | —             | `.claude-plugin/`                         | Empty — placeholder only                                    |
| marketing          | —             | (empty directory)                         | Empty — placeholder only                                    |

---

## Migration Strategy

### Key Mapping: Claude Concepts → GitHub Copilot Concepts

| Claude Concept      | Copilot Equivalent                             | Notes                                                      |
| ------------------- | ---------------------------------------------- | ---------------------------------------------------------- |
| Plugin directory    | Agent `.agent.md`                              | One agent per domain                                       |
| `CONNECTORS.md`     | `tools:` frontmatter + Guidelines section      | Copilot uses explicit tool declarations                    |
| `commands/*.md`     | Agent **Capabilities** / **Workflow** sections | Commands become callable workflows within the agent prompt |
| `skills/*/SKILL.md` | `.github/skills/<name>/SKILL.md`               | Direct 1:1 mapping; adapt frontmatter format               |

### Naming Convention Decisions

Skills will be **namespaced by domain** to keep them navigable as the repo grows:

```
.github/skills/
├── create-agent/                      # existing
├── create-skill/                      # existing
├── requirements-documentation/        # existing
├── requirements-prioritization/       # existing
├── requirements-research/             # existing
├── pm-competitive-analysis/           # NEW ← product-management
├── pm-feature-spec/                   # NEW
├── pm-metrics-tracking/               # NEW
├── pm-roadmap-management/             # NEW
├── pm-stakeholder-comms/              # NEW
├── pm-user-research-synthesis/        # NEW
├── data-analysis/                     # NEW ← data (placeholder)
└── marketing-strategy/               # NEW ← marketing (placeholder)
```

---

## Phase 1 — Migrate Product-Management Skills (6 skills)

Adapt each Claude `SKILL.md` to this repo's skill format:

- Add YAML frontmatter with `name:` and `description: >` (multi-line block)
- Include a "Use this skill when…" sentence in `description`
- Restructure body into: **When to Use**, **Process**, **Output Format**, **Best Practices**
- Remove `~~tool` placeholder references — replace with generic phrasing or omit
- Remove Claude-specific frontmatter (`argument-hint`, etc.)

### Files to Create

| #   | File                                                 | Source                                                       |
| --- | ---------------------------------------------------- | ------------------------------------------------------------ |
| 1   | `.github/skills/pm-competitive-analysis/SKILL.md`    | `product-management/skills/competitive-analysis/SKILL.md`    |
| 2   | `.github/skills/pm-feature-spec/SKILL.md`            | `product-management/skills/feature-spec/SKILL.md`            |
| 3   | `.github/skills/pm-metrics-tracking/SKILL.md`        | `product-management/skills/metrics-tracking/SKILL.md`        |
| 4   | `.github/skills/pm-roadmap-management/SKILL.md`      | `product-management/skills/roadmap-management/SKILL.md`      |
| 5   | `.github/skills/pm-stakeholder-comms/SKILL.md`       | `product-management/skills/stakeholder-comms/SKILL.md`       |
| 6   | `.github/skills/pm-user-research-synthesis/SKILL.md` | `product-management/skills/user-research-synthesis/SKILL.md` |

### Overlap Check

| Claude Skill | Existing Skill | Action |
| --- | --- | --- |
| `feature-spec` | `requirements-documentation` | **Keep both** — `feature-spec` is product-focused (PRDs); `requirements-documentation` is format/structure-focused |
| `roadmap-management` (RICE/ICE) | `requirements-prioritization` (RICE/MoSCoW/Kano) | **Keep both** — roadmap management is broader (capacity, dependencies, comms); prioritization is framework-focused |
| `competitive-analysis` | `requirements-research` | **Keep both** — competitive analysis is specialized; requirements research is general discovery |

No skills need to be merged; they are complementary.

---

## Phase 2 — Create 3 Agent Profiles

Each agent consolidates the Claude **commands** as Copilot agent **Capabilities / Workflows**.

### Agent 1: `product-management.agent.md`

| Field | Value |
| --- | --- |
| **Name** | Product Management |
| **Description** | Assist with product management tasks including writing specs, running metrics reviews, managing roadmaps, crafting stakeholder updates, synthesizing research, and producing competitive briefs. Use this agent for any product-management workflow. |
| **Tools** | `fetch`, `search`, `githubRepo`, `editFiles` |
| **Skills referenced** | `pm-competitive-analysis`, `pm-feature-spec`, `pm-metrics-tracking`, `pm-roadmap-management`, `pm-stakeholder-comms`, `pm-user-research-synthesis` |

**Capabilities table** (derived from the 6 Claude commands):

| Capability              | Source Command           | Description                                             |
| ----------------------- | ------------------------ | ------------------------------------------------------- |
| **Write Spec**          | `write-spec.md`          | Write a feature spec or PRD from a problem statement    |
| **Metrics Review**      | `metrics-review.md`      | Review product metrics with trend analysis and insights |
| **Roadmap Update**      | `roadmap-update.md`      | Create, update, or reprioritise the product roadmap     |
| **Stakeholder Update**  | `stakeholder-update.md`  | Generate audience-tailored status updates               |
| **Synthesize Research** | `synthesize-research.md` | Synthesize user research into structured insights       |
| **Competitive Brief**   | `competitive-brief.md`   | Produce a competitive analysis brief                    |

**Workflow sections**: One `## <Capability Name>` section per command, containing the step-by-step process adapted from the Claude command file (with `~~tool` references replaced by Copilot tool references or generic language).

### Agent 2: `data-analysis.agent.md`

| Field | Value |
| --- | --- |
| **Name** | Data Analysis |
| **Description** | Assist with data exploration, analysis, and visualization tasks. Use this agent when working with datasets, building queries, interpreting results, or creating data-driven reports. |
| **Tools** | `fetch`, `search`, `githubRepo`, `editFiles`, `terminalLastCommand` |
| **Skills referenced** | `data-analysis` (placeholder skill) |

**Note**: The Claude `data/` directory is empty (only a `.claude-plugin/` placeholder). This agent will be scaffolded with a sensible default structure covering:

| Capability         | Description                                                     |
| ------------------ | --------------------------------------------------------------- |
| **Explore Data**   | Profile a dataset — shape, types, distributions, missing values |
| **Write Query**    | Generate SQL or data-processing code for a given question       |
| **Analyse Trends** | Identify patterns, outliers, and trends in data                 |
| **Visualise**      | Suggest or generate chart specifications and code               |
| **Summarise**      | Produce a narrative summary of data findings                    |

### Agent 3: `marketing.agent.md`

| Field | Value |
| --- | --- |
| **Name** | Marketing |
| **Description** | Assist with marketing strategy, content creation, campaign planning, and messaging. Use this agent when drafting marketing copy, planning campaigns, analysing positioning, or creating go-to-market materials. |
| **Tools** | `fetch`, `search`, `githubRepo`, `editFiles` |
| **Skills referenced** | `marketing-strategy` (placeholder skill) |

**Note**: The Claude `marketing/` directory is empty. This agent will be scaffolded with:

| Capability           | Description                                                   |
| -------------------- | ------------------------------------------------------------- |
| **Draft Copy**       | Write marketing copy for web, email, social, or ads           |
| **Campaign Plan**    | Structure a campaign with goals, channels, timeline, and KPIs |
| **Positioning**      | Define or refine product positioning and messaging            |
| **Go-to-Market**     | Create GTM plans for launches or feature releases             |
| **Content Strategy** | Plan content calendars and editorial priorities               |

---

## Phase 3 — Create Placeholder Skills for Data & Marketing

### Skill: `data-analysis`

| Field           | Value                                                                                                                                                                       |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Path**        | `.github/skills/data-analysis/SKILL.md`                                                                                                                                     |
| **Name**        | `data-analysis`                                                                                                                                                             |
| **Description** | Explore, query, and analyse datasets to extract insights. Use this skill when profiling data, writing analytical queries, identifying trends, or summarising data findings. |
| **Sections**    | When to Use, Process (placeholder steps), Output Format, Best Practices                                                                                                     |

### Skill: `marketing-strategy`

| Field | Value |
| --- | --- |
| **Path** | `.github/skills/marketing-strategy/SKILL.md` |
| **Name** | `marketing-strategy` |
| **Description** | Plan and execute marketing activities including positioning, campaigns, and content. Use this skill when drafting copy, planning campaigns, defining positioning, or creating go-to-market materials. |
| **Sections** | When to Use, Process (placeholder steps), Output Format, Best Practices |

---

## Phase 4 — Cleanup & Cross-References

1. **Update `README.md`** — add a section listing all agents and skills with descriptions
2. **Cross-reference skills in agents** — each agent prompt body should mention its skills by name so Copilot loads them when the agent is invoked
3. **Verify no Claude-specific syntax remains** — grep for `~~`, `argument-hint`, `.claude-plugin` in new files
4. **Remove or archive source** — optionally move `research/claude-instructions/` to a `research/archive/` after migration is validated

---

## Execution Checklist

| #   | Task                                          | Status |
| --- | --------------------------------------------- | ------ |
| 1   | Create `pm-competitive-analysis` skill        | ⬜     |
| 2   | Create `pm-feature-spec` skill                | ⬜     |
| 3   | Create `pm-metrics-tracking` skill            | ⬜     |
| 4   | Create `pm-roadmap-management` skill          | ⬜     |
| 5   | Create `pm-stakeholder-comms` skill           | ⬜     |
| 6   | Create `pm-user-research-synthesis` skill     | ⬜     |
| 7   | Create `product-management.agent.md`          | ⬜     |
| 8   | Create `data-analysis.agent.md`               | ⬜     |
| 9   | Create `marketing.agent.md`                   | ⬜     |
| 10  | Create `data-analysis` placeholder skill      | ⬜     |
| 11  | Create `marketing-strategy` placeholder skill | ⬜     |
| 12  | Update README with agent/skill index          | ⬜     |
| 13  | Final validation (no Claude-specific syntax)  | ⬜     |

---

## Final Directory Structure After Migration

```
.github/
├── agents/
│   ├── agent-builder.agent.md          # existing
│   ├── requirements-research.agent.md  # existing
│   ├── product-management.agent.md     # NEW
│   ├── data-analysis.agent.md          # NEW
│   └── marketing.agent.md             # NEW
└── skills/
    ├── create-agent/SKILL.md                   # existing
    ├── create-skill/SKILL.md                   # existing
    ├── requirements-documentation/SKILL.md     # existing
    ├── requirements-prioritization/SKILL.md    # existing
    ├── requirements-research/SKILL.md          # existing
    ├── pm-competitive-analysis/SKILL.md        # NEW
    ├── pm-feature-spec/SKILL.md                # NEW
    ├── pm-metrics-tracking/SKILL.md            # NEW
    ├── pm-roadmap-management/SKILL.md          # NEW
    ├── pm-stakeholder-comms/SKILL.md           # NEW
    ├── pm-user-research-synthesis/SKILL.md     # NEW
    ├── data-analysis/SKILL.md                  # NEW (placeholder)
    └── marketing-strategy/SKILL.md             # NEW (placeholder)
```
