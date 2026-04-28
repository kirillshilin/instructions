
# React Component Conventions

Conventions for React component architecture, file organization, and composition patterns. Components are thin display layers — all logic lives in custom hooks.

These rules **do not apply** to shadcn components in `src/components/ui/` — those follow shadcn's own conventions and should be left intact.

For general coding standards see [shai-coding](./shai-coding.instructions.md). For TypeScript specifics see [shai-typescript](./shai-typescript.instructions.md). For component testing patterns see [shai-react-testing](./shai-react-testing.instructions.md).

## Rules

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


### Hook Delegation

Move data loading, state, transformations, side effects, and handler logic
into custom hooks.

#### Rule

Keep a component body trivial:

- Call hooks
- Destructure results
- Return JSX

Move `if` chains, `.map().filter()`, and `try/catch` blocks into a hook.

**Preferred:**

```tsx
// hooks/useOrders.hook.ts
export const useOrders = (userId: string) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders(userId).then(setOrders).finally(() => setIsLoading(false));
  }, [userId]);

  const pendingOrders = useMemo(
    () => orders.filter((o) => o.status === "pending"),
    [orders]
  );

  return { orders, pendingOrders, isLoading };
};

// OrderList.tsx
const OrderList = ({ userId }: OrderListProps) => {
  const { pendingOrders, isLoading } = useOrders(userId);

  if (isLoading) return <Skeleton />;

  return (
    <ul>
      {pendingOrders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </ul>
  );
};
```

**Avoid:**

```tsx
// OrderList.tsx — logic leaked into component
const OrderList = ({ userId }: OrderListProps) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders(userId).then(setOrders).finally(() => setIsLoading(false));
  }, [userId]);

  const pendingOrders = orders.filter((o) => o.status === "pending");

  if (isLoading) return <Skeleton />;

  return (
    <ul>
      {pendingOrders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </ul>
  );
};
```

Why: logic in the component is harder to test, reuse, and replace.

#### What belongs in hooks

| Concern                      | Where                            | Example hook                        |
| ---------------------------- | -------------------------------- | ----------------------------------- |
| Data fetching / loading      | `hooks/useOrders.hook.ts`        | `useOrders`, `useUserProfile`       |
| Complex state management     | `hooks/useCheckout.hook.ts`      | `useCheckout`, `useCartState`       |
| Form logic / validation      | `hooks/useLoginForm.hook.ts`     | `useLoginForm`, `useSearchForm`     |
| Data transformations         | `hooks/useFilteredItems.hook.ts` | `useFilteredItems`, `useSortedList` |
| Side effects / subscriptions | `hooks/useWebSocket.hook.ts`     | `useWebSocket`, `useInterval`       |
| Event handlers with logic    | `hooks/useKeyboardNav.hook.ts`   | `useKeyboardNav`, `useDragDrop`     |

#### What stays in the component

- Destructure hook results
- Return loading and error states
- Wire hook callbacks to JSX
- Render simple conditionals
- Keep trivial derived values only

#### Hook file naming convention

- File name: `useSomething.hook.ts`
- Export name: `useSomething`
- Location: `hooks/` subfolder co-located with the component, or top-level
  `src/hooks/` for shared hooks

#### No helper functions in components

Do not keep standalone helper functions in component files. Extract them to:

- A custom hook (if they use React state or effects)
- A utility module in `src/utilities/` (if they're pure functions)


### Constants and Data

Do not keep inline data in component files.

Import strings, numbers, configuration objects, and option arrays.

#### No inline data in components

**Preferred:**

```tsx
// constants/order-status.ts
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  shipped: "Shipped",
  delivered: "Delivered",
};

export const ORDER_STATUS_OPTIONS: SelectOption[] = [
  { value: "pending", label: "Pending" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
];
```

```tsx
// OrderFilter.tsx
import { ORDER_STATUS_OPTIONS } from "@/constants/order-status";

const OrderFilter = ({ onFilter }: OrderFilterProps) => {
  return (
    <Select options={ORDER_STATUS_OPTIONS} onChange={onFilter} />
  );
};
```

**Avoid:**

```tsx
// OrderFilter.tsx — inline data
const OrderFilter = ({ onFilter }: OrderFilterProps) => {
  const options = [
    { value: "pending", label: "Pending" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
  ];

  return <Select options={options} onChange={onFilter} />;
};
```

Why: inline data recreates on each render and mixes non-UI concerns into the
component.

#### Where constants live

| Scope              | Location                     | Example                     |
| ------------------ | ---------------------------- | --------------------------- |
| Application-wide   | `src/constants/{domain}.ts`  | `src/constants/routes.ts`   |
| Feature-specific   | `src/{feature}/constants.ts` | `src/checkout/constants.ts` |
| Enum-like mappings | `src/constants/{domain}.ts`  | `src/constants/status.ts`   |

#### Naming

- Use `ALL_CAPS` for primitive constants: `MAX_ITEMS`, `API_TIMEOUT`
- Use `PascalCase` or `ALL_CAPS` for object/array constants:
  `ORDER_STATUS_OPTIONS`, `ROUTES`
- Never name a constant `data`, `values`, `items`, or `list` — be specific

#### Default prop values

Extract default prop objects to module-level constants, not inline:

**Preferred:**

```tsx
const DEFAULT_PAGINATION: PaginationConfig = { page: 1, pageSize: 20 };

const DataTable = ({ pagination = DEFAULT_PAGINATION }: DataTableProps) => {
  // ...
};
```

**Avoid:**

```tsx
const DataTable = ({ pagination = { page: 1, pageSize: 20 } }: DataTableProps) => {
  // ...
};
```

Why: inline default objects create a new reference on each render and can
trigger unnecessary child re-renders.


### JSX and Styling

#### JSX patterns

- Use fragments instead of wrapper `<div>` elements
- Prefer ternary for simple conditionals: `{isOpen ? <Panel /> : null}`
- Use early returns for loading/error states instead of nested ternaries
- Arrays: always provide a stable, unique `key` prop — never use index as key
  unless the list is static and will never reorder

**Preferred:**

```tsx
const UserProfile = ({ user, isLoading }: UserProfileProps) => {
  if (isLoading) return <Skeleton />;
  if (!user) return <EmptyState message="User not found" />;

  return (
    <div className="flex flex-col gap-4">
      <Avatar src={user.avatar} alt={user.name} />
      <h2 className="text-lg font-semibold">{user.name}</h2>
    </div>
  );
};
```

**Avoid:**

```tsx
const UserProfile = ({ user, isLoading }: UserProfileProps) => {
  return (
    <div>
      {isLoading ? (
        <Skeleton />
      ) : !user ? (
        <EmptyState message="User not found" />
      ) : (
        <div className="flex flex-col gap-4">
          <Avatar src={user.avatar} alt={user.name} />
          <h2 className="text-lg font-semibold">{user.name}</h2>
        </div>
      )}
    </div>
  );
};
```

Why: early returns flatten control flow. Nested ternaries become hard to scan.

#### Styling with Tailwind

- Tailwind utilities are the default. Compose them directly on JSX elements.
- Use CSS modules only when explicitly requested or for complex animations that don't map well to utility classes.
- For conditional classes, use `clsx` or `cn`: `className={cn("text-sm", isActive && "font-bold")}`
- Extract repeated class combinations into component abstractions, not into CSS files.

#### Prop types

- Define props with a `{ComponentName}Props` interface in the same file,
  above the component:

```tsx
interface UserCardProps {
  user: User;
  onSelect?: (userId: string) => void;
  variant?: "compact" | "detailed";
}

const UserCard = ({ user, onSelect, variant = "compact" }: UserCardProps) => {
  // ...
};
```

- Use explicit props interfaces. Do not use `React.FC`.
- Use discriminated unions for components with mutually exclusive prop sets
- Avoid `any` in props — use `unknown` or proper generics

#### Component export

- Use named exports, not default exports. This matches the one-component-per-file
  rule and improves refactoring support.

```tsx
// Preferred
export const UserCard = ({ user }: UserCardProps) => { ... };

// Avoid
export default function UserCard({ user }: UserCardProps) { ... }
```


## Performance

Use `useMemo` and `useCallback` to avoid unnecessary re-renders in components that pass callbacks or computed values to child components. Hoist default non-primitive props to module-level constants to preserve referential equality.

For **large-scale, highly interactive components** that need deeper optimization (eliminating waterfalls, bundle splitting, re-render analysis), use the `vercel-react-best-practices` skill on demand — it covers 69 performance rules across 8 categories prioritized by impact.

When generating or reviewing a component that may have performance sensitivity — large lists, real-time data, complex forms, heavy interactions — **always suggest applying the Vercel performance skill** for a detailed audit.
