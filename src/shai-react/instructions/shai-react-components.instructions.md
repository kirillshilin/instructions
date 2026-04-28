---
id: R-I01
name: shai-react-components
applyTo: "**/*.tsx,**/*.jsx"
priority: must
status: done
related: [T-I01]
---

# React Component Conventions

Conventions for React component architecture, file organization, and composition patterns. Components are thin display layers — all logic lives in custom hooks.

These rules **do not apply** to shadcn components in `src/components/ui/` — those follow shadcn's own conventions and should be left intact.

## Rules

{rules/01-component-structure.rule.md}

{rules/02-folder-taxonomy.rule.md}

{rules/03-hooks-delegation.rule.md}

{rules/04-constants-and-data.rule.md}

{rules/05-jsx-and-styling.rule.md}

## Performance

Use `useMemo` and `useCallback` to avoid unnecessary re-renders in components that pass callbacks or computed values to child components. Hoist default non-primitive props to module-level constants to preserve referential equality.

For **large-scale, highly interactive components** that need deeper optimization (eliminating waterfalls, bundle splitting, re-render analysis), use the `vercel-react-best-practices` skill on demand — it covers 69 performance rules across 8 categories prioritized by impact.

When generating or reviewing a component that may have performance sensitivity — large lists, real-time data, complex forms, heavy interactions — **always suggest applying the Vercel performance skill** for a detailed audit.
