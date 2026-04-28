# 10 — Populate `plugin.json` asset arrays

## Problem

`copilot-instructions.md` documents `instructions: []` and `skills: []` arrays in `plugin.json`, but most current `plugin.json` files only have metadata + `keywords`. The installer (`bin/install.js`) has to scan the filesystem; it can't easily honor an asset whitelist.

## Example (current `shai-core/plugin.json`)

```json
{
  "name": "shai-core",
  "displayName": "SHAI Core",
  "description": "...",
  "version": "0.1.0",
  "publisher": "kirillshilin",
  "license": "MIT",
  "keywords": ["coding-standards", "code-review", "tdd", "architecture", "security"]
}
```

## Target

```json
{
  "name": "shai-core",
  "displayName": "SHAI Core",
  "description": "...",
  "version": "0.1.0",
  "publisher": "kirillshilin",
  "license": "MIT",
  "keywords": ["..."],
  "instructions": [
    "instructions/shai-coding.instructions.md",
    "instructions/shai-package-json.instructions.md",
    "instructions/shai-documentation.instructions.md"
  ],
  "skills": [
    "skills/shai-software-design",
    "skills/shai-tdd-feature"
  ],
  "agents": [],
  "hooks": []
}
```

## Acceptance criteria

- [ ] Every `plugin.json` lists its assets explicitly.
- [ ] `bin/install.js` reads the arrays instead of scanning (or scans and validates against the array).
- [ ] Build check fails if a listed file is missing or an unlisted asset exists in the folder.
- [ ] Empty arrays are explicit (e.g. `"agents": []`) so empty plugins don't silently no-op.
