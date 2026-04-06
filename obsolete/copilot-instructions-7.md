# GitHub Copilot Instructions

## Development Environment

### Line Endings

- **ALWAYS use CRLF** (`\r\n`) line endings, not LF (`\n`)
- This project is developed on Windows and requires CRLF line endings
- Configure your editor to use CRLF for all files
- Git should be configured to preserve CRLF line endings: `git config core.autocrlf false`
- The `.gitattributes` file enforces CRLF line endings for all text files in the repository

### Editor Configuration

- Configure Prettier to use CRLF line endings: `"endOfLine": "crlf"` in `.prettierrc`
- Ensure your editor respects the `.prettierrc` configuration
- Run `npm run format` to ensure consistent formatting across all files

## Code Organization

### Folder Structure

- **`src/context/`** - React contexts only (use singular "context")
- **`src/hooks/`** - Custom React hooks only
- **`src/screens/`** - Screen components organized by module/feature
- **`src/components/`** - Reusable, general-purpose UI components only
  - Tool-specific layout components (like session lists) should be placed in their respective tool folders under `src/screens/{tool-name}/`
  - Only truly reusable components (like Button, Card, Loading) belong in `src/components/`

### Single Responsibility Principle

- Each file should have a single responsibility
- Component files should only contain the component
- Custom hooks should be in separate files in the `hooks/` folder
- Contexts and their providers should be in separate files in the `context/` folder

### Module Organization

- Screen components are organized by feature/module in subdirectories
- Each module (e.g., cloud-voting, contest) has its own directory under `screens/`
- Do not use suffixes like "Page" or "Screen" in component names
- Root-level screens (like Home, Login) can be in `screens/` directly or in appropriate subdirectories

### Example Structure

```
src/
├── context/
│   └── AuthContext.tsx           # Context and Provider only
├── hooks/
│   ├── useAuth.ts                # Custom hook only
│   └── useData.ts                # General-purpose data state hook
├── screens/
│   ├── Home.tsx                  # Root screen
│   ├── auth/
│   │   └── Login.tsx             # Auth-related screens
│   ├── cloud-voting/
│   │   ├── CloudVoting.tsx       # Create voting session
│   │   ├── Vote.tsx              # Voting interface
│   │   ├── Invite.tsx            # Invite participants
│   │   ├── Results.tsx           # View results
│   │   └── MyCloudVotingSessions.tsx  # Tool-specific component
│   └── contest/
│       ├── Contest.tsx           # Create contest
│       ├── Invite.tsx            # Share contest
│       ├── Participate.tsx       # Take contest
│       ├── Results.tsx           # View results
│       └── MyContests.tsx        # Tool-specific component
└── components/
    ├── Button.tsx                # Reusable general-purpose component
    ├── Card.tsx                  # Reusable general-purpose component
    └── Loading.tsx               # Reusable general-purpose component
```

## Naming Conventions

- Use PascalCase for components and contexts
- Use camelCase for hooks (starting with "use")
- Use singular names for folders (e.g., "context", "hook") unless multiple items of the same type

## Import Organization

1. React and third-party imports
2. Context imports
3. Hook imports
4. Component imports
5. Utility/helper imports
6. Type imports (using `type` keyword when applicable)

## TypeScript

- Use type-only imports for types: `import type { User } from 'firebase/auth'`
- Enable `verbatimModuleSyntax` compliance
- Define interfaces for props and context types

## Styling

- Use Tailwind CSS for styling
- Follow existing design patterns in the codebase
- Use HeadlessUI components for accessible UI elements

## Tech Talk Tool Principles

### Interactive Tool Pattern

Tech Talk Toolbox tools follow a consistent pattern for audience engagement:

1. **Create**: Host creates a session with a title/topic
2. **Share**: Session link or QR code is shared with participants
3. **Interact**: Audience participates (votes, answers, submits responses)
4. **Results**: Results are displayed either in real-time or after host action

### Tool Architecture

Each tool follows a modular structure:

- **Entry Point**: Main tool component for creating sessions (e.g., `CloudVoting.tsx`, `Contest.tsx`)
  - Located in `src/screens/{tool-name}/`
  - Handles session creation and initial setup
  - Navigates to appropriate sub-screens after creation

- **Sub-Screens**: Separate files for each tool phase
  - `Invite.tsx` - Share QR code and link with participants
  - `Vote.tsx` / `Participate.tsx` - Participant interaction interface
  - `Results.tsx` - Display aggregated results
  - `VotingSession.tsx` / Main session coordinator (if needed)

- **Sub-Components**: Reusable UI elements
  - Placed in `src/components/` for truly reusable, general-purpose components (Button, Card, Loading, ErrorMessage, etc.)
  - Tool-specific layout components (session lists, tool-specific displays) should stay in the tool folder under `src/screens/{tool-name}/`
  - Use this guideline: If a component is only used by one tool, keep it in that tool's folder

### Component Guidelines

**Keep Components Small and Focused**

- **Target size**: Components should ideally not exceed 100 lines
- **Single responsibility**: Each component should do one thing well
- **Extract logic**: Move business logic to custom hooks

**Separate Logic from UI**

- **Custom Hooks**: Extract all business logic to hooks in `src/hooks/`
  - State management logic
  - Data fetching and Firebase operations
  - Form validation logic
  - Complex calculations or transformations
  - Use general-purpose hooks like `useData` to manage common state patterns (data, loading, error)
  - Specific hooks (like `useUserVotingSessions`) should leverage general-purpose hooks

- **Components**: Keep components focused on UI rendering
  - Minimal inline logic
  - Use hooks to access state and actions
  - Focus on JSX structure and user interactions

**Example: Good Separation**

```tsx
// ❌ Bad: Everything in component
function CloudVoting() {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    // 30 lines of validation and Firebase logic...
  };

  return (/* JSX */);
}

// ✅ Good: Logic extracted to hook
function CloudVoting() {
  const { title, setTitle, error, handleSubmit, loading } = useCreateSession();

  return (/* JSX */);
}

// hooks/useCreateSession.ts
export function useCreateSession() {
  // All logic here
}
```

### Tool Implementation Checklist

When creating a new tool, follow this structure:

1. Create folder: `src/screens/{tool-name}/`
2. Create entry component: `{ToolName}.tsx` (creates session)
3. Create sub-screens:
   - `Invite.tsx` (share QR code/link)
   - `Participate.tsx` or `Vote.tsx` (user interaction)
   - `Results.tsx` (display results)
4. Extract logic to hooks in `src/hooks/`
5. Create reusable components in `src/components/` if needed
6. Add Firebase structure to README
7. Implement Firebase Cloud Functions for data processing (if needed)
