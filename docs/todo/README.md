# SHAI Improvement Backlog

Actionable tasks from the instruction-set analysis. Files are numbered in **recommended execution order**, not priority — earlier tasks unblock later ones.

| #   | Task                                                                                 | Effort | Impact |
| --- | ------------------------------------------------------------------------------------ | ------ | ------ |
| 01  | [Add structured frontmatter to all assets](01-add-asset-frontmatter.md)              | S      | High   |
| 02  | [Generate reference.md from frontmatter](02-generate-reference-doc.md)               | M      | High   |
| 03  | [Enforce instruction size budget (≤120 lines)](03-instruction-size-budget.md)        | M      | High   |
| 04  | [Split oversized instructions into lite + skill](04-split-oversized-instructions.md) | M      | High   |
| 05  | [Tighten applyTo globs](05-tighten-applyto-globs.md)                                 | S      | Med    |
| 06  | [Fix naming, numbering, and orphan partials](06-fix-naming-and-orphans.md)           | S      | Med    |
| 07  | [Define shai-coding vs language-plugin boundary](07-coding-vs-language-boundary.md)  | S      | Med    |
| 08  | [Add cross-linking "Related" sections](08-add-related-cross-links.md)                | S      | Med    |
| 09  | [Add build-time validation (`npm run check`)](09-build-time-validation.md)           | M      | High   |
| 10  | [Populate plugin.json asset arrays](10-populate-plugin-json-arrays.md)               | S      | Med    |
| 11  | [Bias growth toward skills over instructions](11-skills-over-instructions.md)        | —      | Policy |
| 12  | [Cleanups (asset-rules schema, empty plugins)](12-misc-cleanups.md)                  | S      | Low    |
