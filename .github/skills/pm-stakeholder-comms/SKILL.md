---
name: pm-stakeholder-comms
description: >
  Draft stakeholder updates tailored to audience — executives, engineering,
  customers, or cross-functional partners — using structured templates and
  the ROAM risk framework.
  Use this skill when writing status updates, launch announcements, risk
  communications, or decision documentation.
---

# PM Stakeholder Communications

## When to Use

- Writing a weekly, monthly, or ad-hoc status update for any audience.
- Drafting a launch announcement or feature release communication.
- Communicating risks using the ROAM framework (Resolved / Owned / Accepted /
  Mitigated).
- Documenting product decisions as Architecture Decision Records (ADRs).
- Facilitating or preparing for stand-ups, planning sessions, retrospectives,
  or stakeholder reviews.

## Process

1. **Determine update type and audience** — choose the format based on:
   - **Executives / leadership** — high-level, outcome-focused, under 300 words.
   - **Engineering team** — technical detail, priorities, blockers, decisions.
   - **Cross-functional partners** — focus on shared goals, dependencies, and asks.
   - **Customers / external** — benefits-focused, no internal jargon.

2. **Apply Green / Yellow / Red status** — reflect genuine assessment, not
   optimism. Yellow is not a failure; it is good risk management. Move to Yellow
   at the first sign of risk; move to Red only when escalation is needed.

3. **Structure the content**:
   - Lead with the conclusion, not the journey.
   - Asks must be specific and actionable (e.g., "decision on X by Friday").
   - For risks, use ROAM: state the risk, quantify the impact, assess likelihood,
     present the mitigation, and make the specific ask.

4. **For decision documentation** — write an Architecture Decision Record (ADR)
   for strategic product decisions, significant technical choices, controversial
   decisions, and decisions that constrain future options.

5. **Review before sending** — confirm the most important point is first, status
   colour reflects reality, and all asks are specific and have deadlines.

## Output Format

### Executive Update

```markdown
Status: [Green / Yellow / Red]

TL;DR: <One sentence — the most important thing to know.>

Progress:
- <Outcome achieved, tied to goal / OKR>

Risks:
- <Risk>: <Mitigation>. <Ask if needed.>

Decisions needed:
- <Decision>: <Options with recommendation>. Need by <date>.

Next milestones:
- <Milestone> — <Date>
```

### Engineering Update

```markdown
Shipped:
- <Feature / fix> — <Link>. <Impact if notable.>

In progress:
- <Item> — <Owner>. <Expected completion>. <Blockers if any.>

Decisions:
- <Decision made>: <Rationale>.
- <Decision needed>: <Context>. <Options>. <Recommendation>.

Coming up:
- <Next items> — <Context on why these are next>
```

### ADR

```markdown
# <Decision Title>

## Status
[Proposed / Accepted / Deprecated / Superseded by ADR-XXX]

## Context
<What situation requires a decision and what forces are at play?>

## Decision
<What was decided?>

## Consequences
- Positive: …
- Negative / trade-offs accepted: …

## Alternatives Considered
- <Option>: <Why rejected>
```

## Best Practices

- Lead with the most important thing — the most common mistake in stakeholder
  updates is burying the lead.
- Match the length to the audience's attention. Executives get a few bullets;
  engineering gets the details they need.
- Status colours should reflect reality. Yellow is not a failure — it is good
  risk management.
- Write ADRs close to when the decision is made; future readers will not have
  today's context.
- For risks, always pair the risk with a mitigation plan. A risk without a plan
  is just an alarm.
- If there is bad news, lead with it. Do not hide it after good news.
