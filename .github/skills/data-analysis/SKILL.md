---
name: data-analysis
description: >
  Explore, query, and analyse datasets to extract insights, identify trends,
  and produce data-driven reports.
  Use this skill when profiling data, writing analytical queries, identifying
  trends, visualising results, or summarising data findings.
---

# Data Analysis

## When to Use

- Profiling a dataset to understand its shape, types, and quality.
- Writing SQL or data-processing code to answer a specific question.
- Identifying patterns, outliers, or trends in a dataset.
- Choosing and generating appropriate visualisations for data.
- Producing a narrative summary of analytical findings for stakeholders.

## Process

1. **Clarify the question** — confirm what decision or hypothesis the
   analysis should inform. The right question determines the approach.

2. **Profile the data** — before analysis, examine:
   - Shape: number of rows and columns.
   - Column types: numeric, categorical, datetime, boolean.
   - Missing values: count and percentage per column.
   - Distributions: min, max, mean, median for numeric columns.
   - Cardinality: unique value counts for categorical columns.

3. **Write the query or code** — produce SQL, pandas, or equivalent code
   with comments explaining each step. Validate logic against edge cases
   (nulls, duplicates, time zones).

4. **Analyse trends** — compute period-over-period changes, moving averages,
   and seasonal patterns. Flag outliers and step changes. Distinguish
   sustained trends from one-time events.

5. **Visualise findings** — choose chart types that match the question:
   line chart for trends, bar chart for comparisons, histogram for
   distributions, scatter plot for correlations. Annotate key data points.

6. **Summarise** — produce a narrative summary leading with the key finding,
   supported by evidence, followed by implications and recommended actions.
   Note data quality caveats and limitations explicitly.

## Output Format

```markdown
# Data Analysis — <Topic / Question>

## Data Source and Scope

- **Source**: <database / file / API>
- **Time period**: <date range>
- **Key assumptions**: <any filtering, cleaning, or transformation decisions>

## Key Findings

1. <Finding statement with supporting metric>
2. …

## Analysis Detail

<Tables, charts, or query output as appropriate.>

## Recommendations

1. <Action tied to a finding>

## Caveats and Limitations

- <Data quality issues, sample size limitations, or comparability notes>
```

## Best Practices

- Profile data before drawing conclusions — data quality issues invalidate analysis.
- Show your work: include the query or code so findings are reproducible.
- Distinguish description from interpretation — state what the data shows,
  then interpret separately.
- Every assertion should be backed by a specific number, not vague language.
- Note statistical significance and sample size when making comparisons.
- Separate signal from noise — not all patterns are meaningful.
