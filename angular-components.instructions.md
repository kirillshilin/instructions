---
name: Angular Components
description: Angular component guidelines with 50-60 line code limit
applyTo: "**/*.component.ts"
---

# Component Size

- Components should target **50-60 lines of code**.
- If a component exceeds this limit, split it into separate components.
- Break down complex components into smaller, reusable sub-components.
- Each component should have a single, well-defined responsibility.

# Component Structure

- Use Angular CLI to generate components: `ng generate component component-name`.
- Follow Angular style guide naming conventions.
- Use kebab-case for component selectors.
- Use PascalCase for component class names.
- One component per file.

# Best Practices

- Keep template logic minimal.
- Move complex logic to services.
- Use signals for component communication.
- Implement `OnInit`, `OnDestroy`, and other lifecycle hooks as needed.
- Use `ChangeDetectionStrategy.OnPush` when appropriate.
- Make components standalone if they don't require Angular modules.
- When using observable use takeUntil or async pipe to manage subscriptions and prevent memory leaks.

# File Organization

- Keep components in feature-specific folders.
- Co-locate related components.
- Use shared components folder for reusable components.

# Template Guidelines

- Extract large templates into separate components.
- Use `ng-container` for structural directives without extra DOM elements.
- Prefer @let and signal based syntax over `async` pipe for observable subscriptions in templates.
- Keep templates clean and readable.
