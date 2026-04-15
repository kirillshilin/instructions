## Component Structure

Each React component is a focused, single-responsibility unit that fits on one
screen. Smaller components are easier to read, test, and refactor.

### One component per file

Each `.tsx` / `.jsx` file exports **one** component. No sibling components,
no helper functions, no constants — just the component and its types.

```
// user-card.tsx → exports UserCard
// checkout-form.tsx → exports CheckoutForm
```

Why: Single-export files are discoverable by filename, produce clean git blame,
and allow bundlers to tree-shake effectively.

### Target size: 50–70 lines

A component should fit in a single editor viewport — roughly **50–70 lines**
including imports, types, and JSX. If it exceeds ~70 lines, that's a signal to
decompose.

**How to shrink an oversized component:**

1. Extract a visual section into a child component
2. Move logic into a custom hook (`hooks/useSomething.hook.ts`)
3. Move constants to a separate file
4. Simplify conditional rendering with early returns

**Exception:** A component at 80–90 lines that is purely declarative JSX (a
form with many fields, a data table) can stay intact if splitting would harm
readability. Use judgment — but default to splitting.

### Single responsibility

A component should have **one reason to change**. If you need to modify a
component for two unrelated reasons, it's doing too much.

Good signals:

- You can describe the component's job in one sentence without "and"
- All props relate to the same concern
- The component name is specific, not generic (`UserAvatar` not `Display`)

Bad signals:

- The component fetches data **and** renders it (split: hook + display)
- It handles two unrelated user interactions
- Props span multiple domains (user data + cart state + theme)

### shadcn components — leave intact

Components in `src/components/ui/` are **shadcn design-system primitives**.
Do not refactor, split, or restructure them. They follow shadcn's conventions,
not ours. Treat them as an external library that happens to live in-tree.
