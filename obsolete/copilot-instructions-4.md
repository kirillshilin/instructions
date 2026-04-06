# Copilot Instructions

## Project Architecture

This project follows **Atomic Design** methodology. See [ARCHITECTURE.md](./ARCHITECTURE.md) for the complete guide.

**Quick Reference:**
- **Atoms** → `components/` (buttons, inputs, labels, icons)
- **Molecules** → `elements/` (simple groups of atoms)
- **Organisms** → `organisms/` (complex components with business logic)
- **Templates** → `layouts/` (page structure definitions)
- **Pages** → `pages/` (route-bound components)

Before creating new components, consult ARCHITECTURE.md to ensure correct folder placement.

## Import Paths

- Always import atoms using the `@components` path alias (e.g. `import { Button } from '@components'`), not relative paths like `'../components/button'`.
- Always import molecules using the `@elements` path alias (e.g. `import { FormField } from '@elements'`).
- Always import organisms using the `@organisms` path alias (e.g. `import { Shell } from '@organisms'`).
- Always import layouts using the `@layouts` path alias (e.g. `import { ShellLayout } from '@layouts'`).
- To import from the entire framework, use the `@framework` path alias (e.g. `import { Button, Shell } from '@framework'`).
