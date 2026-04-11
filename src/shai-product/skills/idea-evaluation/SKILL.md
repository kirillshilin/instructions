---
name: idea-evaluation
description: >
  Evaluate and expand a raw software product idea through structured questioning, competitor research, persona building, and user journey mapping. Produces a comprehensive evaluation report with core concept, killer feature, delight score, and MoSCoW prioritization. Use this skill when the user has a product idea to evaluate, wants to brainstorm a software concept, needs to validate an app idea, mentions idea evaluation, product discovery, concept exploration, or wants to assess whether an idea is worth building — even for a quick gut check.
---

# Idea Evaluation

Evaluate a raw software product idea and produce a structured report that feeds directly into `feature-mapping` (V-S02). The goal is to turn a vague idea into a clear concept with identified personas, user journeys, competitive gaps, and prioritized capabilities — while keeping it fun.

Ideas mostly focus on building software applications. The output should feel exciting and actionable, not like a corporate feasibility study.

## When to Use

- User has a raw product idea and wants to explore it
- User wants to brainstorm a software application concept
- User asks "is this idea worth building?"
- User wants to discover what makes an idea unique or interesting
- User mentions product discovery, idea validation, or concept exploration
- As the first step in the shai-product pipeline (before `feature-mapping`)

## Workflow

{../../../shared/\_progress.partial.md}

### Step 1: Capture the Idea

Get the raw idea from the user's input. If they provide just a phrase like "real-time collaborative whiteboard" — that's enough to start. Don't force formality.

Restate the idea back in one sentence to confirm understanding:

> "So the idea is: **{one-liner restatement}**. Let me dig into this."

### Step 2: Round 1 — Core Concept Questions

Ask 5-7 questions to understand the idea's foundation. Adapt your questioning style to the user's energy — mix Socratic challenges, supportive expansion, and devil's advocate probes based on context.

**Questions to draw from** (pick the most relevant, don't ask all):

| Category                | Question                                                                                              |
| ----------------------- | ----------------------------------------------------------------------------------------------------- |
| **Problem**             | "What specific pain point does this solve? Who feels that pain daily?"                                |
| **Why Now**             | "What changed recently (tech shift, behavior shift, regulation) that makes this idea newly possible?" |
| **Audience**            | "Who is the primary user? Paint me a picture — their role, their typical day, their frustration."     |
| **Existing solutions**  | "How do people solve this problem today? What's broken about those solutions?"                        |
| **Personal connection** | "What's your personal connection to this problem? Have you experienced it firsthand?"                 |
| **Scale**               | "Is this a 'nice to have' for 1,000 people or a 'need to have' for 100,000?"                          |
| **Delight**             | "What would make someone say 'this is _so cool_' the first time they use it?"                         |

Use `vscode/askQuestions` for structured choices when it helps (e.g., target audience type), and inline chat for open-ended exploration.

### Step 3: Competitor Research

Search the web for 2-3 existing products in the same space.

**What to look for:**

- Direct competitors (solve the same problem)
- Adjacent products (solve a related problem, could expand)
- What they do well and what users complain about (reviews, forums)

**Gap analysis:** For each competitor, identify what they lack. The killer feature lives in the gaps — the thing users want but nobody provides yet.

Format findings as a quick competitor table in the report.

### Step 4: Round 2 — Deepening Questions

Based on what you learned from Round 1 and the competitor research, ask 3-5 follow-up questions. This round is more targeted:

- "Competitor X does {thing}. How would yours be different?"
- "You mentioned {pain point}. How painful is it — 'annoying' or 'I'd pay to make it go away'?"
- "What's the simplest version of this that would still be useful? What's the one feature that can't be missing?"
- "Who would _not_ be a user? What makes this irrelevant to some people?"
- "If you had to pick one word that describes the feeling of using this app, what would it be?"

### Step 5: Round 3 — Expand & Stress-Test (Optional)

If the idea has legs after Round 2, run a brief stress-test round:

- "What could go wrong? What's the biggest risk?"
- "What would make you abandon this idea?"
- "What assumption, if proven wrong, kills the whole concept?"
- "Could this be a feature inside an existing product instead of a standalone app?"

Skip this round if the user signals they have enough clarity, or if the idea is already well-defined.

### Step 6: Build the Evaluation Report

Compile everything into a structured Markdown file saved as `{name}.idea.md` (where `{name}` is a slug derived from the idea). The user can then pass this report to `feature-mapping`.

## Report Template

Use this structure for the output file. Every section is mandatory.

```markdown
# {Idea Name} — Idea Evaluation

> {One-liner pitch: what it is, who it's for, why it matters.}

## Core Concept

**Problem**: {What pain point does this solve?} **Solution**: {How does the product solve it — in 2-3 sentences?} **Why Now**: {What makes this idea timely — tech shift, behavior change, market gap?} **Core Concept in One Line**: {The elevator pitch.}

## Target Audience

### Persona 1: {Name}

- **Role**: {Job title / life role}
- **Pain Points**: {3 specific frustrations}
- **Primary Goal**: {What success looks like for them}

### Persona 2: {Name}

_(Add 1-2 more if the idea serves distinct user types.)_

## User Journey Map

| Stage          | User Action                               | Emotion                         | Touchpoint          |
| -------------- | ----------------------------------------- | ------------------------------- | ------------------- |
| **Discovery**  | {How they find the product}               | {Curious / skeptical / excited} | {Channel}           |
| **First Use**  | {What they do first}                      | {Feeling}                       | {Screen/feature}    |
| **Core Loop**  | {The repeated action that delivers value} | {Feeling}                       | {Feature}           |
| **Aha Moment** | {When they realize "this is it"}          | {Delight / relief}              | {Trigger}           |
| **Retention**  | {Why they come back}                      | {Habit / dependency}            | {Hook}              |
| **Advocacy**   | {Why they tell others}                    | {Pride / excitement}            | {Sharing mechanism} |

## Competitive Landscape

| Product        | What it does well | What it lacks | Gap opportunity |
| -------------- | ----------------- | ------------- | --------------- |
| {Competitor 1} |                   |               |                 |
| {Competitor 2} |                   |               |                 |
| {Competitor 3} |                   |               |                 |

**Sources**: {URLs of competitor products or review pages}

## Killer Feature

**What**: {The one feature that makes this product stand out} **Why it's a gap**: {What competitors lack that makes this possible} **Why users care**: {The pain it relieves or delight it creates}

## Delight Score

**Score**: {1-10} — {One-sentence reasoning}

| Factor                     | Rating | Why                                                        |
| -------------------------- | ------ | ---------------------------------------------------------- |
| **Fun to build**           | {1-5}  | {Is the tech interesting? Will developers enjoy this?}     |
| **Fun to use**             | {1-5}  | {Does interacting with it spark joy, not just utility?}    |
| **"Show a friend" factor** | {1-5}  | {Would a user demo this at dinner? Share on social?}       |
| **Novelty**                | {1-5}  | {Is this genuinely new or a reskin of something existing?} |

## Capabilities

Brainstormed features grouped by domain. These are raw capabilities — the downstream `feature-mapping` skill will refine, group, and formalize them.

### {Domain 1: e.g., Collaboration}

- {Capability 1}
- {Capability 2}

### {Domain 2: e.g., Content Management}

- {Capability 1}
- {Capability 2}

_(Add as many domains as needed.)_

## Prioritization (MoSCoW)

| Capability     | Priority   | Horizon     | Reasoning                                           |
| -------------- | ---------- | ----------- | --------------------------------------------------- |
| {Capability 1} | **Must**   | MVP / Day 1 | {Why it must exist for the product to work}         |
| {Capability 2} | **Should** | Day 1–2     | {Why it significantly improves the core experience} |
| {Capability 3} | **Could**  | Day 2+      | {Why it adds value but isn't essential to launch}   |
| {Capability 4} | **Won't**  | Not now     | {Why it's out of scope for initial versions}        |

## Risk Assessment

| Risk     | Likelihood     | Impact         | Mitigation                  |
| -------- | -------------- | -------------- | --------------------------- |
| {Risk 1} | {Low/Med/High} | {Low/Med/High} | {How to reduce or validate} |
| {Risk 2} |                |                |                             |

**Assumptions to validate first:**

1. {Most critical assumption}
2. {Second most critical}

## Technical Feasibility Signals

- **Stack hints**: {What technologies seem natural for this? Why?}
- **Complexity**: {Is the core technically simple, moderate, or ambitious?}
- **Third-party dependencies**: {Any critical APIs, services, or data sources?}
- **Known hard problems**: {Real-time sync? ML model? Payments? Etc.}

## Monetization Hints

- **Model candidates**: {Freemium / subscription / usage-based / marketplace?}
- **Who pays**: {The user, their employer, or a third party?}
- **Pricing signal**: {What similar products charge — rough range}

## Review Perspectives

Brief evaluations from three lenses:

- **Product Manager**: {Is the value proposition clear? Is the market real?}
- **Designer**: {Is the UX straightforward? What's the onboarding challenge?}
- **Engineer**: {Is this buildable? What's the hard part technically?}

## Next Steps

This report is ready for **`/feature-mapping`** — pass it as input to map these capabilities into a structured feature set.

For technical architecture decisions, consult **`@shai-architect`** (C-A01).
```

## Gotchas

- **Don't skip the interview.** The report quality depends entirely on how much you draw out of the user. A lazy Round 1 produces a generic report. Push for specifics — "who exactly feels this pain?" not "what's the target audience?"
- **2-3 competitors max.** The user doesn't need a market research firm. Find the most relevant competitors, identify gaps, move on. If you can't find direct competitors, look for adjacent solutions.
- **Killer feature ≠ most complex feature.** It's the one that makes users say "finally, someone built this." Often it's surprisingly simple.
- **Delight Score is subjective.** That's OK. The point is to force an explicit conversation about whether the idea sparks excitement, not to be scientific.
- **Don't front-load web research.** Ask the user questions first (Step 2). Their answers shape what you research. Searching blind wastes time.
- **MoSCoW is for capabilities, not features.** At this stage we're listing broad capabilities. `feature-mapping` handles the formal feature decomposition.
- **Ideas should be fun.** If the evaluation makes the idea feel boring, you're doing it wrong. Highlight what's exciting, not just what's viable.
- **Adapt questioning rounds.** Two rounds is the minimum. If the user's idea is already well-articulated, Round 3 is optional. If it's vague, you might need an extra round. Read the room.
