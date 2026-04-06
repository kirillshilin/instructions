---
name: pm-user-research-synthesis
description: >
  Synthesise qualitative and quantitative user research into structured insights,
  themes, personas, and opportunity areas.
  Use this skill when analysing interview notes, survey responses, support
  tickets, or behavioural data to identify themes, build personas, or prioritise
  product opportunities.
---

# PM User Research Synthesis

## When to Use

- Synthesising interview notes, survey responses, usability test results, or
  support ticket data into structured findings.
- Identifying themes and patterns across multiple research sources.
- Building evidence-based personas from behavioural clusters.
- Sizing and prioritising product opportunities from research findings.
- Combining qualitative and quantitative data to strengthen or challenge
  a hypothesis.

## Process

1. **Gather and scope inputs** — collect research from interviews, surveys,
   usability tests, analytics, support tickets, or sales call notes. Clarify
   the research question and what decisions the synthesis will inform.

2. **Extract observations** — for each source, identify:
   - **Observations** — what users said, did, or experienced.
   - **Direct quotes** — verbatim statements; attribute to participant type
     (role / company size), not name.
   - **Behaviours vs. stated preferences** — note when what users do differs
     from what they say.
   - **Signals of intensity** — emotional language, frequency of the issue,
     workarounds, and impact of the problem.

3. **Apply thematic analysis**:
   1. Familiarise — read all the data before coding.
   2. Initial coding — tag each observation with descriptive codes.
   3. Theme development — group related codes into candidate themes.
   4. Theme review — check each theme has sufficient evidence and is distinct.
   5. Theme refinement — define and name each theme with a 1–2 sentence
      description.

4. **Triangulate findings** — strengthen conclusions by combining multiple
   data sources (methodological triangulation), multiple participant types
   (source triangulation), or data from different time periods (temporal
   triangulation). When sources disagree, note the contradiction and investigate.

5. **Build personas (if appropriate)** — identify behavioural clusters across
   participants. Define distinguishing variables (company size, technical skill,
   use case). For each cluster, produce a persona with goals, pain points,
   context, and representative quotes. Limit to 3–5 personas.

6. **Size opportunities** — for each finding, estimate addressable users,
   frequency of the issue, severity, and willingness to pay. Score by
   (users affected × frequency × severity) and compare against evidence
   strength and strategic alignment.

7. **Produce recommendations** — specific, actionable next steps tied back to
   findings. Prioritise by impact and feasibility.

## Output Format

```markdown
# Research Synthesis — <Topic / Research Question>

## Research Overview

- **Methodology**: <types of research, number of participants / sources>
- **Research question**: <what we set out to learn>
- **Timeframe**: <when research was conducted>

## Key Findings

### Finding 1: <One-sentence finding statement>
- **Evidence**: <quotes, data points, observations with source type>
- **Frequency**: <how many participants / sources support this>
- **Impact**: <how significantly this affects users or business>
- **Confidence**: High / Medium / Low

### Finding 2: …

## User Segments / Personas

### [Persona Name] — <one-line description>
- **Who they are**: <role, company, experience>
- **Goals**: …
- **Pain points**: …
- **Representative quote**: "…"

## Opportunity Areas

| Opportunity | Impact | Evidence Strength | Strategic Fit |
|-------------|--------|------------------|---------------|
| …           | High   | Strong           | Yes           |

## Recommendations

1. **<Action>** — <rationale, tied to finding>

## Open Questions

- <Gap in understanding that requires further research>
```

## Best Practices

- Let the data speak — do not force findings into a predetermined narrative.
- Distinguish between what users say and what they do; behavioural data is
  stronger evidence than stated preferences.
- Include verbatim quotes generously as evidence, attributed to participant type.
- Be explicit about confidence levels — a finding from two interviews is a
  hypothesis, not a conclusion.
- Contradictions in the data are interesting, not inconvenient; they often
  reveal distinct user segments.
- Resist synthesising too many themes — 5–8 strong findings are better than
  20 weak ones.
- Recommendations should be specific enough to act on: "add a progress
  indicator to the setup flow" not "improve onboarding".
