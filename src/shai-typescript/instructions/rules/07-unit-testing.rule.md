### Unit Test Structure — TypeScript

#### File Naming and Suite Layout

- Place the spec file next to the source file:  `something.service.ts` -> `something.service.spec.ts`.
- Use `.spec.ts` only. Do not create `.test.ts` files.
- Name the top-level suite with the source file name:  `describe("something.service.ts", ...)`.
- Create one nested `describe(...)` per public API entrypoint.
- Group class tests by public member. Do not group by private helpers.

#### Coverage Boundaries

- Test every public class method in its own nested `describe(...)` block.
- Test every exported function in its own nested `describe(...)` block.
- Do not test private methods or non-exported helpers directly.
- Cover private behavior through the public or exported API.
- If a public or exported API has branches, cover those branches explicitly.

#### Test Body Rules

- Every `it(...)` block must include:  `// arrange`, `// act`, `// assert`.
- Keep the act step to one invocation when practical.
- Prefer `testCase.name` or `should <behavior> when <condition>`.

#### Case-Based Tests

- Prefer a `testCases` array plus a `for ... of` loop for repeated shapes.
- Use this instead of duplicating similar `it(...)` blocks.
- Avoid `it.each(...)` by default. Use it only when the file already uses it
  or it is clearly clearer.

**Preferred:**

```typescript
describe("user.service.ts", () => {
  let service: UserService;

  beforeEach(() => {
    service = new UserService();
  });

  describe("findById", () => {
    const testCases = [
      { name: "should return user when id exists", input: "user-1" },
      { name: "should return null when id is missing", input: "missing-id" },
    ];

    for (const testCase of testCases) {
      it(testCase.name, async () => {
        // arrange

        // act
        const result = await service.findById(testCase.input);

        // assert
        expect(result).toBeDefined();
      });
    }
  });
});
```

**Avoid:**

```typescript
describe("UserService", () => {
  it.each([{ id: "user-1" }])("works", async ({ id }) => {
    const result = await service._findById(id);
    expect(result).toBeTruthy();
  });
});
```

Why: the root suite loses the file anchor, the test hits private API, and the
AAA structure is missing.