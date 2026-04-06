---
name: add-feature
description: >
  Step-by-step workflow for adding a new feature to a .NET project following
  Clean Architecture and CQRS with MediatR. Use this skill when implementing a
  new use case, endpoint, or business capability.
---

# Add a New Feature (Clean Architecture + CQRS)

## When to Use

- Adding a new user-facing feature or business capability to a .NET solution.
- Implementing a new command (write) or query (read) use case with MediatR.
- Extending an existing bounded context with new behaviour.

## Process

1. **Clarify the use case** — confirm: what action is the user performing, what
   data is required, what the expected outcome is, and which bounded context
   it belongs to.

2. **Model the domain change** — determine if new or updated domain entities,
   value objects, or domain events are needed. Update or create them in
   `src/Domain/`.

3. **Create the command or query** — add a record in the appropriate folder:
   - Write operation: `src/Application/<Feature>/Commands/<Name>Command.cs`
   - Read operation: `src/Application/<Feature>/Queries/<Name>Query.cs`

   ```csharp
   public sealed record PlaceOrderCommand(Guid CustomerId, IReadOnlyList<OrderLineDto> Lines)
       : IRequest<Guid>;
   ```

4. **Create the handler** — implement `IRequestHandler<TRequest, TResponse>` in
   the same folder as the command/query. Inject only interfaces defined in
   `Domain` or `Application`.

   ```csharp
   internal sealed class PlaceOrderCommandHandler(IOrderRepository orders)
       : IRequestHandler<PlaceOrderCommand, Guid>
   {
       public async Task<Guid> Handle(PlaceOrderCommand request, CancellationToken ct)
       {
           var order = Order.Create(request.CustomerId, request.Lines);
           await orders.AddAsync(order, ct);
           return order.Id;
       }
   }
   ```

5. **Add repository / infrastructure** — if new data access is required:
   - Define the interface method in `src/Domain/Repositories/I<Name>Repository.cs`.
   - Implement it in `src/Infrastructure/Repositories/<Name>Repository.cs`.
   - Add the EF Core entity configuration in `src/Infrastructure/Configurations/`.

6. **Add the API endpoint** — create or update the controller or minimal API
   endpoint in `src/Presentation/`:
   - Keep the endpoint thin: map request DTO → command/query → response DTO.
   - Add route, HTTP method, and summary attributes.

7. **Register dependencies** — add any new registrations to the relevant
   `DependencyInjection.cs` or extension method in `Infrastructure`.

8. **Write unit tests** — use the **unit-testing** skill to write tests for the
   handler. Mirror the folder structure in `tests/`.

9. **Build and test** — run `dotnet build && dotnet test` to verify everything
   passes before finishing.

10. **Format** — run `dotnet format` to enforce code style.

## Output Format

```
## Feature: <Name>

**Bounded context:** <name>
**Type:** Command | Query

### Files created
- `src/Domain/...`
- `src/Application/<Feature>/Commands/<Name>Command.cs`
- `src/Application/<Feature>/Commands/<Name>CommandHandler.cs`
- `src/Infrastructure/Repositories/<Name>Repository.cs`
- `src/Presentation/Controllers/<Name>Controller.cs`
- `tests/Application/<Feature>/Commands/<Name>CommandHandlerTests.cs`

### Build result
✅ `dotnet build` — succeeded
✅ `dotnet test` — all tests pass
```

## Best Practices

- Never add business logic to controllers or handlers — keep logic in domain
  entities and domain services.
- Commands should return only an ID or void; queries return DTOs, never domain
  entities.
- Pass `CancellationToken` as the last parameter on every async method.
- Keep handlers under 40 lines; extract helper methods to domain objects or
  domain services if they grow larger.
- Run `dotnet format` before finishing to keep diffs clean in code review.
