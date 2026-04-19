# Stories Index Format

After writing all story files, create or update `docs/stories/stories.md` — a reference index listing all stories.

```markdown
# Stories

Index of all user stories.

| ID    | Story         | Feature        | Feature ID | Priority | Status | File                                           |
| ----- | ------------- | -------------- | ---------- | -------- | ------ | ---------------------------------------------- |
| S-001 | {Story title} | {Feature name} | F-001      | Must     | 🔴      | [{brief-name}.story.md]({brief-name}.story.md) |
| S-002 | {Story title} | {Feature name} | F-001      | Must     | 🔴      | [{brief-name}.story.md]({brief-name}.story.md) |
| ...   |               |                |            |          |        |                                                |

**Total stories**: {N} ({Must count} Must, {Should count} Should, {Could count} Could) **Features covered**: {N} of {total features}
```

If `stories.md` already exists, append new rows to the existing table — don't overwrite previous entries.
