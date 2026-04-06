# GitHub Copilot Instructions

## Code Style and Formatting

- **Line Endings**: Always use CRLF (Windows-style) line endings for all text files
- **Indentation**: Use 2 spaces for indentation (no tabs)
- **Quotes**: Use single quotes for strings in TypeScript/JavaScript
- **Semicolons**: Always include semicolons
- **Trailing Commas**: Use ES5-style trailing commas
- **Print Width**: Maximum line length of 100 characters
- **Arrow Functions**: Avoid parentheses around single parameter arrow functions

## TypeScript Guidelines

- Always use explicit return types for functions
- Avoid using `any` type - use proper typing
- Enable strict type checking
- Use interfaces for object shapes
- Use type aliases for unions and complex types

## Testing

- Write tests for all new functionality
- Use Jest as the testing framework
- Follow the existing test patterns in the codebase
- Test files should be named `*.test.ts`

## Project Structure

- Source code goes in `src/` directory
- Firebase functions go in `functions/src/` directory
- Type definitions go in `src/types/` directory
- Services go in `src/services/` directory

## Important Notes

- This is a Windows development environment - CRLF line endings are mandatory
- Always follow the project's ESLint and Prettier configurations
- Ensure code is properly formatted before committing
- Run tests before submitting code
