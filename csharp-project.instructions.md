---
name: C# Project
description: C# project organization and class structure guidelines
applyTo: "**/*.cs"
---

# Class Organization

- Large classes should be split into separate partial files, grouped logically.
- Use the `partial` keyword to split a class across multiple files.
- Group related functionality together (e.g., properties, methods, events).
- Each partial file should have a clear purpose or logical grouping.

# Generic Class File Naming

- Classes that have both generic and non-generic versions MUST be split into separate files.
- Non-generic version: Use the class name as-is (e.g., `Class.cs`).
- Generic version: Append a backtick to the file name (e.g., ``Class`.cs``).
- Example:
  - `Result.cs` - Contains the non-generic `Result` class
  - ``Result`.cs`` - Contains the generic `Result<T>` class

# Nested Classes and Private Classes

- Private comparers or private nested classes MUST go into dot-separated files.
- Parent class: `Parent.cs`
- Nested/inner class: `Parent.Child.cs`
- Example:
  - `UserService.cs` - Contains the main `UserService` class
  - `UserService.UserComparer.cs` - Contains the private `UserComparer` nested class
- This applies to:
  - Private comparers (e.g., `IEqualityComparer<T>`, `IComparer<T>`)
  - Private nested classes
  - Private helper classes specific to the parent class

# File Organization

- Keep related partial files together in the same folder.
- Use consistent naming conventions for partial files.
- Consider naming partial files with descriptive suffixes when helpful (e.g., `MyClass.Properties.cs`, `MyClass.Methods.cs`).
