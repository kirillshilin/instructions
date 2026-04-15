## JSX and Styling

Keep JSX clean, declarative, and styled with Tailwind CSS utility classes.

### JSX patterns

- Use `<>...</>` fragments to avoid unnecessary wrapper `<div>` elements
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

Why: Early returns flatten the component logic, making it easier to read and
trace. Nested ternaries are hard to follow beyond one level.

### Styling with Tailwind

- **Tailwind utility classes are the default** styling approach. Prefer
  composing utilities directly on JSX elements.
- Use CSS modules only when explicitly requested or for complex animations
  that don't map well to utility classes.
- For conditional classes, use `clsx` or `cn` (shadcn's `cn` utility):
  `className={cn("text-sm", isActive && "font-bold")}`
- Extract repeated class combinations into component abstractions, not into
  CSS files.

### Prop types

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

- Use explicit props interfaces — do not use `React.FC` (it adds implicit
  `children` prop and obscures the signature)
- Use discriminated unions for components with mutually exclusive prop sets
- Avoid `any` in props — use `unknown` or proper generics

### Component export

- Use **named exports**, not default exports — matches the one-component-per-file rule and improves refactoring support:

```tsx
// Preferred
export const UserCard = ({ user }: UserCardProps) => { ... };

// Avoid
export default function UserCard({ user }: UserCardProps) { ... }
```
