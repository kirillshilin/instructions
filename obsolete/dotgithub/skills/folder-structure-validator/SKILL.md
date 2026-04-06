---
description: Validates and assesses folder structure compliance after AI-generated code changes, ensuring components are placed in the correct folders according to Atomic Design principles
rules:
  - Automatically invoked after creating or moving components, pages, organisms, layouts, or hooks
  - Checks compliance with project architecture defined in .github/ARCHITECTURE.md
  - Reports misplaced files and suggests corrections
tools:
  - file_search
  - read_file
  - grep_search
  - replace_string_in_file
  - run_in_terminal
---

# Folder Structure Validator Skill

## Purpose

This skill validates that the project folder structure adheres to the **Atomic Design** architecture defined in `.github/ARCHITECTURE.md`. It assesses whether files created or modified by AI are placed in the correct folders and follows project conventions.

## When to Invoke

Automatically invoke this skill when:

1. **Creating new components** - Validate they're in the right folder (components/, organisms/, layouts/, pages/)
2. **Moving or refactoring files** - Ensure new locations are correct
3. **After batch component generation** - Verify entire structure compliance
4. **User explicitly requests validation** - "Check folder structure", "Validate architecture"
5. **Before marking a feature complete** - Final validation step

## Validation Rules

### 1. Component Classification

Read `.github/ARCHITECTURE.md` for full definitions. Quick reference:

**Atoms → `src/components/`**

- Buttons, inputs, labels, icons (atoms)
- ❌ Should NOT contain business logic
- ❌ Should NOT manage complex state
- ✅ Should be highly reusable

**Molecules → `src/elements/`**

- Simple functional groups: search bars, form fields (molecules)
- Combination of 2-5 atoms
- ❌ Should NOT contain business logic
- ❌ Should NOT manage complex state
- ✅ Should be reusable across contexts

**Organisms → `src/organisms/`**

- Complex components with business logic
- Complete UI sections (headers, sidebars, forms with validation)
- ✅ Can manage internal state
- ✅ Can connect to contexts/APIs
- ✅ Can be feature-specific

**Layouts → `src/layouts/`**

- Page structure definitions
- Reusable templates (AuthLayout, ShellLayout)
- ✅ Define layout and content zones
- ❌ Should NOT contain specific page content

**Pages → `src/pages/`**

- Route-bound components
- Data fetching and orchestration
- ✅ Compose layouts + organisms
- ✅ Handle routing and navigation

**Hooks → `src/hooks/`**

- Reusable React hooks
- Shared logic extraction
- No UI components

**Elements → `src/elements/`**

- Molecular components (simple groups of atoms)
- Reusable functional units
- Follow Single Responsibility Principle

**Contexts → `src/contexts/`**

- React Context providers
- App-wide state management

**Routes → `src/routes/`**

- Route definitions
- Router configuration

**Models → `src/models/`**

- TypeScript types and interfaces
- Data models

### 2. Path Alias Usage

All imports MUST use path aliases:

```typescript
✅ import { Button } from '@components'
✅ import { FormField } from '@elements'
✅ import { Shell } from '@organisms'
✅ import { ShellLayout } from '@layouts'
✅ import { useEntity } from '@hooks'

❌ import { Button } from '../../components/button'
❌ import { FormField } from '../elements/form-field'
❌ import { Shell } from '../organisms/shell'
```

Available aliases:

- `@components` → `src/components/`
- `@elements` → `src/elements/`
- `@organisms` → `src/organisms/`
- `@layouts` → `src/layouts/`
- `@hooks` → `src/hooks/`
- `@contexts` → `src/contexts/`
- `@routes` → `src/routes/`
- `@pages` → `src/pages/`
- `@models` → `src/models/`
- `@framework` → framework-wide import

### 3. Folder Organization

**Sub-folders allowed in:**

- `pages/` - Group by feature (e.g., `pages/auth/`, `pages/admin/`)
- `organisms/` - For complex organisms with sub-components (e.g., `organisms/shell/`)
- `components/` - For grouping related atoms (optional)
- `elements/` - For grouping related molecules (optional)

**Index files required:**

- Each folder should export through `index.ts`
- Public API should be clearly defined

### 4. File Naming

- Components: PascalCase (e.g., `Button.tsx`, `LoginForm.tsx`)
- Hooks: camelCase starting with `use` (e.g., `useEntity.ts`)
- Contexts: kebab-case or camelCase (e.g., `meta.context.ts`)
- Types/Models: PascalCase or kebab-case (e.g., `meta.ts`, `query.ts`)

## Validation Workflow

When invoked, perform these steps:

### Step 1: Identify Recent Changes

Use `get_changed_files` or file_search to identify recently created/modified files:

```typescript
// Search for new component files
file_search: '**/*.tsx';
// Filter by recent modifications
```

### Step 2: Classify Each Component

For each `.tsx` file in `src/`:

1. **Read the file content**
2. **Analyze to determine classification:**
   - Does it export a component function?
   - Does it contain business logic? (state management, API calls, validation)
   - Does it manage complex state? (`useState`, `useReducer`, custom hooks)
   - Does it connect to contexts?
   - Is it bound to a route?
   - Does it compose multiple components?
   - Is it a simple, reusable element?

3. **Determine correct folder:**

```
Has route binding OR data fetching logic?
  → pages/

Defines page structure/layout?
  → layouts/

Has business logic OR complex state OR forms complete UI section?
  → organisms/

Simple functional group (2-5 atoms)?
  → elements/

Primitive UI element (single atom)?
  → components/
```

### Step 3: Check Current Location

Compare actual location vs. expected location:

```typescript
// Example checks
const filePath = 'src/components/LoginForm.tsx';
const expectedPath = 'src/organisms/LoginForm.tsx';

if (filePath !== expectedPath) {
	reportMisplacement(filePath, expectedPath, reason);
}
```

### Step 4: Validate Imports

Search for import statements in recently changed files:

```bash
grep_search: "import .* from ['\"]\.\./"
```

Report any relative imports that should use aliases.

### Step 5: Check Index Files

Verify that new components are exported from appropriate `index.ts`:

```typescript
// src/organisms/index.ts should export LoginForm
grep_search: 'export.*LoginForm' in 'src/organisms/index.ts';
```

### Step 6: Generate Report

Provide a structured report:

````markdown
## Folder Structure Validation Report

### ✅ Correctly Placed Files

- `src/components/Button.tsx` - Atom, correctly placed
- `src/organisms/Shell.tsx` - Organism, correctly placed

### ⚠️ Misplaced Files

#### `src/components/LoginForm.tsx`

**Issue:** Contains business logic and state management (organism characteristics)
**Current location:** `src/components/LoginForm.tsx`
**Suggested location:** `src/organisms/LoginForm.tsx`
**Reason:** Component manages form validation, API calls, and complex state

**Evidence:**

- Lines 15-20: Form validation logic
- Lines 25-30: API submission handler
- Uses `useState`, `useNavigate`, and context

**Action:** Move to organisms/ folder

---

#### `src/pages/FormField.tsx`

**Issue:** Simple reusable component (molecule) in pages/
**Current location:** `src/pages/FormField.tsx`
**Suggested location:** `src/elements/FormField.tsx`
**Reason:** No route binding, simple composition of label + input + error (molecule)

**Action:** Move to elements/ folder

---

### ⚠️ Import Issues

#### `src/organisms/LoginForm.tsx` (Line 3)

```typescript
import { Button } from '../../components/button';
```
````

**Should be:**

```typescript
import { Button } from '@components';
```

---

### ℹ️ Missing Index Exports

- `LoginForm` organism not exported from `src/organisms/index.ts`
- `FormField` molecule not exported from `src/elements/index.ts`

---

## Summary

- **Total Files Checked:** 12
- **Correctly Placed:** 8
- **Misplaced:** 2
- **Import Issues:** 3
- **Missing Exports:** 2

## Recommendations

1. Move `LoginForm` to `organisms/`
2. Move `FormField` to `elements/`
3. Update imports to use path aliases
4. Add missing exports to index files

```

### Step 7: Offer to Fix

Ask user if they want automatic fixes:

```

Would you like me to:

1. Move misplaced files to correct folders
2. Update imports to use path aliases
3. Add missing index exports
4. All of the above

````

## Classification Heuristics

Use these code patterns to classify components:

### Indicators of **Organism** (should be in `organisms/`):

```typescript
// Business logic indicators
- API calls: fetch(), axios, useMutation
- Form validation: yup, zod, custom validation
- Complex state: useReducer, multiple useState
- Context usage: useContext
- Side effects: useEffect with dependencies
- Event handlers with logic beyond prop passing

// Structure indicators
- Contains multiple molecules/atoms (>5 components)
- Forms complete UI sections
- Has internal component structure
- Feature-specific names (LoginForm, UserProfile, etc.)
````

### Indicators of **Component (Atom)**:

```typescript
// Atom indicators (components/)
- Single primitive element (button, input, label)
- No/minimal props processing
- Pure presentational
- No internal state
- Cannot be broken down further
```

### Indicators of **Element (Molecule)**:

```typescript
// Molecule indicators (elements/)
- Combines 2-5 atoms
- Props passed through
- Minimal logic (formatting, conditional rendering)
- Generic names (FormField, MenuItem, Card)
- Reusable functional unit
```

### Indicators of **Layout**:

```typescript
- Accepts children prop
- Defines page structure with slots
- Reusable across pages
- Names ending in "Layout"
- No data fetching
- No business logic
```

### Indicators of **Page**:

```typescript
- Located in pages/
- Used in route definitions
- Data fetching (useQuery, useEffect with API)
- Routing hooks (useNavigate, useParams)
- Composes layouts + organisms
- Page-level state management
```

## Example Analysis

```typescript
// File: src/components/LoginForm.tsx (WRONG LOCATION)

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@components'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  const validateForm = () => {
    // Validation logic
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      })
      navigate('/dashboard')
    } catch (error) {
      setErrors({ api: error.message })
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
    </form>
  )
}
```

**Analysis:**

- ❌ Contains business logic (validation)
- ❌ Makes API calls (fetch)
- ❌ Manages complex state (email, password, errors)
- ❌ Has navigation logic
- ❌ Contains error handling

**Classification:** ORGANISM
**Current Location:** `src/components/LoginForm.tsx`
**Correct Location:** `src/organisms/LoginForm.tsx`

## Tools & Commands

Use these tools during validation:

### File Discovery

```typescript
file_search({ query: 'src/**/*.tsx' });
file_search({ query: 'src/components/**/*.tsx' });
file_search({ query: 'src/elements/**/*.tsx' });
file_search({ query: 'src/organisms/**/*.tsx' });
```

### Content Analysis

```typescript
grep_search({
	query: 'useState|useContext|fetch|axios',
	includePattern: 'src/**/*.tsx',
	isRegexp: true,
});
```

### Import Validation

```typescript
grep_search({
	query: 'import.*from [\'"]\\.\\..*[\'"]',
	includePattern: 'src/**/*.tsx',
	isRegexp: true,
});
```

### Move Files

```typescript
run_in_terminal({
	command: 'Move-Item src/components/LoginForm.tsx src/organisms/LoginForm.tsx',
	explanation: 'Move LoginForm to correct organism folder',
});
```

## Success Criteria

Validation passes when:

1. ✅ All components in correct folders per classification
2. ✅ All imports use path aliases
3. ✅ All public components exported from index files
4. ✅ No business logic in `components/`
5. ✅ No primitive atoms in `organisms/`
6. ✅ Pages are route-bound
7. ✅ Layouts are structural only

## Notes

- **Be pragmatic:** Edge cases exist. If uncertain, prefer simpler classification (component over organism)
- **User preference:** Always present findings and ask before moving files
- **Preserve functionality:** Ensure all imports are updated when moving files
- **Test after changes:** Suggest running build/lint after restructuring

## References

- See `.github/ARCHITECTURE.md` for full architecture guide
- See `.github/copilot-instructions.md` for import path rules
