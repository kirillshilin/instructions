---
name: React Components
description: React component guidelines with 50-60 line code limit
applyTo: "**/*.{jsx,tsx}"
---

# Component Size

- Components should target **50-60 lines of code maximum**.
- If a component exceeds this limit, split it into separate components.
- Break down complex components into smaller, reusable sub-components.
- Each component should have a single, well-defined responsibility.

# Component Structure

- Prefer functional components with hooks over class components.
- Use PascalCase for component names.
- Use camelCase for prop names.
- One component per file (unless creating tightly coupled sub-components).

# Best Practices

- Keep JSX logic minimal and readable.
- Extract complex logic into custom hooks.
- Use props for component communication.
- Implement proper prop validation with TypeScript interfaces or PropTypes.
- Use `memo` for performance optimization when needed.
- Handle side effects in `useEffect` with proper cleanup.

# Custom Hooks

- Move ALL business logic to separate custom hooks in dedicated files.
- Components should ONLY bring data from hooks and capture user input.
- Logic in components should be trivial - no complex calculations or data transformations.
- Store custom hooks in separate files (e.g., `useUserData.ts`, `useFormValidation.ts`).
- Hook files should be co-located with components or in a `hooks/` folder.
- Example:

  ```typescript
  // useUserData.ts
  export const useUserData = () => {
    // All logic here
    return { data, isLoading, error };
  };

  // UserComponent.tsx
  const UserComponent = () => {
    const { data, isLoading } = useUserData();
    return <div>{data}</div>;
  };
  ```

# File Organization

- Keep components in feature-specific folders.
- Co-locate related components.
- Use shared/common folder for reusable components.
- Consider atomic design principles (atoms, molecules, organisms).

# JSX Guidelines

- Extract large JSX blocks into separate components.
- Keep conditional rendering simple.
- Use fragments (`<>...</>`) to avoid unnecessary wrapper elements.
- Map arrays to components with proper `key` props.
- Keep inline styles minimal, prefer CSS modules or styled-components.

# State Management

- Use `useState` for local component state.
- Lift state up when shared between components.
- Consider context API or state management libraries for global state.
- Keep state minimal and derived values computed.
