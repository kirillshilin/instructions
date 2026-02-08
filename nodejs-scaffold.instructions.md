---
name: Node.js Project Scaffold
description: Complete Node.js project setup with Jest, TypeScript, ESLint, and Prettier
---

# Required Dependencies

When scaffolding a new Node.js project, include:

- TypeScript for type-safe JavaScript.
- Jest for testing framework.
- ESLint for code linting.
- Prettier for code formatting.

# TypeScript Configuration (tsconfig.json)

- Target ES2020 or later.
- Module: CommonJS or ESNext.
- Enable strict mode.
- Enable source maps.
- Set output directory to `dist/` or `build/`.

# Jest Configuration (jest.config.js)

- Use ts-jest for TypeScript support.
- Enable coverage.
- Set test match patterns for `.test.ts` or `.spec.ts` files.

# ESLint Configuration

- Extend recommended TypeScript rules.
- Integrate with Prettier.
- Use @typescript-eslint parser.

# Prettier Configuration (.prettierrc)

- **Line endings: CRLF** (for Windows compatibility).
- Quote style: single quotes.
- Trailing comma: es5.
- Tab width: 2.
- Semicolons: true.

# Project Structure

Create folders: `src/`, `src/models/` and `dist/`.

# Package.json Scripts

Include standard scripts: `start`, `test`, `test:watch`, `lint`, `lint:fix`, and `deploy`.
