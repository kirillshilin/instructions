---
name: pm-metrics-tracking
description: >
  Define, track, and analyse product metrics using frameworks for goal setting,
  OKRs, and dashboard design.
  Use this skill when setting up OKRs, building metrics dashboards, running
  metrics reviews, identifying trends, or choosing the right metrics for a
  product area.
---

# PM Metrics Tracking

## When to Use

- Defining a product metrics hierarchy (North Star, L1 health indicators, L2
  diagnostic metrics).
- Setting OKRs or metric targets for a product area.
- Running a weekly, monthly, or quarterly metrics review.
- Designing a product dashboard or alerting strategy.
- Analysing trends, anomalies, or cohort behaviour.

## Process

1. **Define the metrics hierarchy**:
   - **North Star** — the single metric that best captures core product value
     delivered to users. Must be value-aligned, leading, actionable, and
     understandable.
   - **L1 metrics** — 5–7 health indicators covering the user lifecycle:
     acquisition, activation, engagement, retention, monetisation, satisfaction.
   - **L2 metrics** — diagnostic metrics used to investigate changes in L1
     metrics (funnel steps, segment breakdowns, feature-level usage).

2. **Set goals using OKRs**:
   - **Objectives** — qualitative, aspirational, time-bound (quarterly or annual).
   - **Key Results** — 2–4 quantitative, outcome-based measures per objective.
   - Set targets that are ambitious but achievable; 70% completion is the
     target for stretch OKRs.

3. **Establish review cadences**:
   - **Weekly** (15–30 min) — North Star, key L1 metrics, active experiments,
     anomalies.
   - **Monthly** (30–60 min) — full L1 scorecard, OKR progress, cohort
     analysis, feature adoption.
   - **Quarterly** (60–90 min) — OKR scoring, trend analysis, year-on-year
     comparisons, strategic assessment.

4. **Design the dashboard** — start with the decision the dashboard supports.
   Place the North Star prominently; show L1 metrics with current value,
   comparison (previous period / target / benchmark), and trend direction.
   Limit to 5–10 metrics on any single dashboard.

5. **Set up alerting** — define threshold alerts, trend alerts, and anomaly
   alerts. Every alert must be actionable and have a named owner.

## Output Format

```markdown
# Metrics Review — <Product / Time Period>

## Summary

<2–3 sentences: overall health, most notable changes, key callout.>

## Metric Scorecard

| Metric    | Current | Previous | Change | Target | Status          |
|-----------|---------|----------|--------|--------|-----------------|
| [Metric]  | …       | …        | +/- %  | …      | On Track / Risk |

## Trend Analysis

### [Metric Name]
- **What happened**: …
- **Likely cause**: …
- **Sustained or one-time**: …

## Bright Spots

- …

## Areas of Concern

- …

## Recommended Actions

1. …
```

## Best Practices

- Always show comparisons — a number without context (previous period, target,
  benchmark) is meaningless.
- Trend matters more than absolute value. Is the metric growing, flat, or
  declining?
- Segment before concluding — aggregate metrics can mask diverging behaviour
  in different user types.
- Be careful about attribution: correlation is not causation. Acknowledge
  uncertainty when assigning reasons to metric changes.
- OKR Key Results should measure outcomes (user behaviour, business results),
  not outputs (features shipped, tasks completed).
- Metrics reviews should drive decisions. If the review does not lead to at
  least one action, it was not useful.
- Avoid vanity metrics — metrics that always go up but do not indicate product
  health (total signups ever, total page views).
