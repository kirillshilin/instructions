# 📚 Copilot Instructions Templates

> A collection of reusable VS Code custom instructions for GitHub Copilot that enforce common project patterns and conventions.

## 📋 Overview

This repository contains standardized VS Code custom instructions files (`.instructions.md`) that can be used with GitHub Copilot in VS Code. These templates help maintain consistency in coding standards, project structure, and development practices across your projects.

Each file follows the [VS Code custom instructions format](https://code.visualstudio.com/docs/copilot/customization/custom-instructions) with YAML frontmatter and includes `applyTo` patterns for automatic application to relevant files.

## ✨ Available Templates

### 1. 📘 [TypeScript Project](typescript-project.instructions.md)
Strict TypeScript configuration and project structure guidelines, including model organization patterns.

### 2. 📦 [Package.json Scripts](package-json-scripts.instructions.md)
Standard NPM script conventions for development, testing, linting, and deployment.

### 3. 🔷 [C# Project](csharp-project.instructions.md)
C# project organization with partial class file splitting, generic class naming, and nested class file organization.

### 4. 🧪 [C# Unit Tests](csharp-unit-tests.instructions.md)
C# testing conventions with `Should_` naming pattern and region-based test organization.

### 5. 🧪 [TypeScript Tests](typescript-tests.instructions.md)
TypeScript/JavaScript testing conventions using describe blocks for test organization.

### 6. 🚀 [Node.js Scaffolding](nodejs-scaffold.instructions.md)
Complete setup instructions for new Node.js projects with Jest, TypeScript, ESLint, and Prettier (Windows CRLF).

### 7. 📝 [README Style Guide](readme-style.instructions.md)
README formatting guidelines with emoji conventions for better readability.

### 8. ⚛️ [React Components](react-components.instructions.md)
React component guidelines with 50-60 line code limit and component composition patterns.

### 9. 🅰️ [Angular Components](angular-components.instructions.md)
Angular component guidelines with 50-60 line code limit and component composition patterns.

## 💻 Usage

### 🚀 Quick Start

#### For a TypeScript Project

1. **Create the instructions folder:**
   ```bash
   mkdir -p .github/instructions
   ```

2. **Copy relevant instruction files:**
   ```bash
   # For TypeScript project
   cp typescript-project.instructions.md .github/instructions/
   cp typescript-tests.instructions.md .github/instructions/
   cp package-json-scripts.instructions.md .github/instructions/
   cp readme-style.instructions.md .github/instructions/
   ```

3. **Enable in VS Code settings** (`.vscode/settings.json`):
   ```json
   {
     "github.copilot.chat.codeGeneration.useInstructionFiles": true,
     "chat.includeApplyingInstructions": true
   }
   ```

#### For a React Project

```bash
cp typescript-project.instructions.md .github/instructions/
cp react-components.instructions.md .github/instructions/
cp typescript-tests.instructions.md .github/instructions/
cp package-json-scripts.instructions.md .github/instructions/
cp readme-style.instructions.md .github/instructions/
```

#### For an Angular Project

```bash
cp typescript-project.instructions.md .github/instructions/
cp angular-components.instructions.md .github/instructions/
cp typescript-tests.instructions.md .github/instructions/
cp package-json-scripts.instructions.md .github/instructions/
cp readme-style.instructions.md .github/instructions/
```

#### For a C# Project

```bash
cp csharp-project.instructions.md .github/instructions/
cp csharp-unit-tests.instructions.md .github/instructions/
cp readme-style.instructions.md .github/instructions/
```

### 📝 How It Works

When you work on a file, Copilot automatically applies matching instructions:

- **Editing `User.ts`** → TypeScript Project instructions apply
- **Editing `Button.tsx`** → React Components + TypeScript Project instructions apply
- **Editing `app.component.ts`** → Angular Components instructions apply
- **Editing `UserService.cs`** → C# Project instructions apply
- **Editing `UserTests.cs`** → C# Unit Tests instructions apply
- **Editing `README.md`** → README Style instructions apply
- **Editing `package.json`** → Package.json Scripts instructions apply

### 🔍 Verify Instructions Are Active

1. Open VS Code Command Palette (`Ctrl+Shift+P`)
2. Type: **Chat: Configure Instructions**
3. See all loaded instruction files
4. Check which files have `applyTo` patterns matching your current work

### 💡 Tips

- Start with a few instructions and add more as needed
- Customize the instructions for your specific project requirements
- Share instructions with your team by committing them to version control
- Use the **Diagnostics** view in Copilot Chat to troubleshoot if instructions aren't applying

## ⚙️ Required VS Code Settings

Add these settings to your `settings.json`:

```json
{
  "github.copilot.chat.codeGeneration.useInstructionFiles": true,
  "chat.includeApplyingInstructions": true
}
```

## 📂 File Structure

Each `.instructions.md` file includes:
- **YAML frontmatter** with `name`, `description`, and `applyTo` glob pattern
- **Clear instructions** in Markdown format
- **Automatic application** when working with matching files

Example structure:
```markdown
---
name: TypeScript Project
description: Strict TypeScript configuration
applyTo: "**/*.ts"
---

# Instructions here
- Rule 1
- Rule 2
```

## 🤝 Contributing

Feel free to add more instruction templates or improve existing ones to cover additional use cases and project patterns.

## 📝 License

Use these templates freely in your projects.
