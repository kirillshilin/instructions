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
- Use CSS modules only when explicitly requested or for complex animations
  that don't map well to utility classes.
- For conditional classes, use `clsx` or `cn`:
  `className={cn("text-sm", isActive && "font-bold")}`
- Extract repeated class combinations into component abstractions, not into
  CSS files.

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
