### Component Structure

#### One component per file

Each `.tsx` / `.jsx` file exports **one** component. No sibling components,
no helper functions, no constants — just the component and its types.

```
// user-card.tsx → exports UserCard
// checkout-form.tsx → exports CheckoutForm
```

Why: single-export files are easier to find, review, and tree-shake.

#### Target size: 50–70 lines

A component should fit in one editor viewport, roughly **50–70 lines** including imports, types, and JSX. If it grows past ~70 lines, decompose it.

**How to shrink an oversized component:**

1. Extract a visual section into a child component
2. Move logic into a custom hook (`hooks/useSomething.hook.ts`)
3. Move constants out of the file or simplify rendering with early returns

**Exception:** A component at 80–90 lines can stay intact if it is mostly declarative JSX and splitting would hurt readability.

#### Single responsibility

A component should have one reason to change.

Good signals:

- You can describe the component's job in one sentence without "and"
- All props relate to the same concern
- The component name is specific, not generic (`UserAvatar` not `Display`)

Bad signals:

- The component fetches data **and** renders it (split: hook + display)
- It handles two unrelated user interactions
- Props span multiple domains (user data + cart state + theme)

#### shadcn components — leave intact

Components in `src/components/ui/` are shadcn primitives. Do not refactor,
split, or restructure them. Treat them as an external library in-tree.
