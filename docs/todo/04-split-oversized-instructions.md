# 04 — Split oversized instructions into lite + skill

## Problem

Three files blow the 120-line budget significantly: `shai-react-components` (424), `shai-typescript` (243), `shai-tsconfig` (239), `shai-firebase-functions` (207).

## Pattern

For each oversized instruction:

1. Keep an **always-on lite version** with rules + one-line "why" each. No code blocks except minimal preferred-vs-avoided contrasts.
2. Move detailed examples, edge cases, and "deep" reference into a companion **skill** (`{name}-deep` or topic-specific).
3. Add a `## Related` link from the lite instruction to the skill.

## Targets

### shai-react-components (424 → ~100)

- Lite: component structure rules, folder taxonomy headlines, hook delegation rule.
- Skill `shai-react-components-deep`: full constants/JSX examples, hook file naming detail, default-prop patterns.

### shai-typescript (243 → ~100)

- Lite: naming, folder structure principles, one-unit-per-module rule, import rules.
- Skill `shai-typescript-deep`: utility function examples, logging examples, full preferred/avoided lists.

### shai-tsconfig (239)

- **Recommendation**: convert to a skill outright. People rarely edit `tsconfig.json`; auto-loading 239 lines on every TS turn is wasteful.
- Alternative: narrow `applyTo` to `**/tsconfig*.json` only (task 05) and trim to ≤120.

### shai-firebase-functions (207 → ~120)

- Lite: file naming, thin-facade rule, config import, validation rule, re-exports rule.
- Move full testing section to skill `shai-firebase-functions-testing`.

## Acceptance criteria

- [ ] All four instructions ≤ 120 lines built.
- [ ] Companion skills exist and are listed in their plugin's `plugin.json`.
- [ ] Lite instructions link to skills under `## Related`.
- [ ] No content was deleted — only relocated.
