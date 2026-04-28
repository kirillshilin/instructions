---
id: R-I01-r02
priority: must
status: done
related: [R-I01]
---
### Folder Taxonomy

#### The five folders

| Folder              | Purpose                                                   | Examples                                     |
| ------------------- | --------------------------------------------------------- | -------------------------------------------- |
| `src/components/ui` | **shadcn design-system primitives.** Do not touch.        | `Button`, `Dialog`, `Input`, `Tabs`          |
| `src/components`    | **Atomic lego pieces.** Small, reusable building blocks   | `Card`, `Badge`, `Panel`, `Menu`             |
| `src/elements`      | **Mid-size functional components.** Domain-specific units | `UserCard`, `OrderSummary`, `ChatBubble`     |
| `src/organisms`     | **Large application-wide shells.** Layout and navigation  | `AppShell`, `Header`, `Sidebar`, `Footer`    |
| `src/pages`         | **Navigatable screens.** Tied to routes                   | `DashboardPage`, `SettingsPage`, `LoginPage` |

#### Placement rules

- **`src/components/ui`** — installed by shadcn. Never modify, never add custom components here. If you need to extend a shadcn primitive, wrap it in `src/components` instead.
- **`src/components`** — generic and reusable across features. No business logic. If a component is used in one place and carries domain meaning, move it to `src/elements`.
- **`src/elements`** — feature-specific components with domain knowledge. A `UserCard` knows what a user looks like; a `Card` in `src/components` does not.
- **`src/organisms`** — application structural components. Layout shells, navigation bars, sidebars, footers. These rarely change and are typically singleton.
- **`src/pages`** — one file per route. Pages compose organisms, elements, and components. They wire up data hooks and pass props down. Minimal logic.

#### Co-located hooks

Each component folder can have a `hooks/` subfolder for hooks specific to that
component or feature group:

```
src/elements/
├── UserCard.tsx
├── hooks/
│   └── useUserCard.hook.ts
```

Shared hooks live in `src/hooks/`.

#### Where NOT to put things

- **No `utils/` in component folders** — utility functions belong in a top-level `src/utilities/` or `src/lib/` folder.
- **No constants in component files** — move to `src/constants/` or a feature-specific `constants.ts` file.
- **No barrel files with logic** — `index.ts` re-exports only.
