---
id: R-I01-r03
priority: must
status: done
related: [R-I01]
---
### Hook Delegation

Move data loading, state, transformations, side effects, and handler logic
into custom hooks.

#### Rule

Keep a component body trivial:

- Call hooks
- Destructure results
- Return JSX

Move `if` chains, `.map().filter()`, and `try/catch` blocks into a hook.

**Preferred:**

```tsx
// hooks/useOrders.hook.ts
export const useOrders = (userId: string) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders(userId).then(setOrders).finally(() => setIsLoading(false));
  }, [userId]);

  const pendingOrders = useMemo(
    () => orders.filter((o) => o.status === "pending"),
    [orders]
  );

  return { orders, pendingOrders, isLoading };
};

// OrderList.tsx
const OrderList = ({ userId }: OrderListProps) => {
  const { pendingOrders, isLoading } = useOrders(userId);

  if (isLoading) return <Skeleton />;

  return (
    <ul>
      {pendingOrders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </ul>
  );
};
```

**Avoid:**

```tsx
// OrderList.tsx — logic leaked into component
const OrderList = ({ userId }: OrderListProps) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders(userId).then(setOrders).finally(() => setIsLoading(false));
  }, [userId]);

  const pendingOrders = orders.filter((o) => o.status === "pending");

  if (isLoading) return <Skeleton />;

  return (
    <ul>
      {pendingOrders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </ul>
  );
};
```

Why: logic in the component is harder to test, reuse, and replace.

#### What belongs in hooks

| Concern                      | Where                            | Example hook                        |
| ---------------------------- | -------------------------------- | ----------------------------------- |
| Data fetching / loading      | `hooks/useOrders.hook.ts`        | `useOrders`, `useUserProfile`       |
| Complex state management     | `hooks/useCheckout.hook.ts`      | `useCheckout`, `useCartState`       |
| Form logic / validation      | `hooks/useLoginForm.hook.ts`     | `useLoginForm`, `useSearchForm`     |
| Data transformations         | `hooks/useFilteredItems.hook.ts` | `useFilteredItems`, `useSortedList` |
| Side effects / subscriptions | `hooks/useWebSocket.hook.ts`     | `useWebSocket`, `useInterval`       |
| Event handlers with logic    | `hooks/useKeyboardNav.hook.ts`   | `useKeyboardNav`, `useDragDrop`     |

#### What stays in the component

- Destructure hook results
- Return loading and error states
- Wire hook callbacks to JSX
- Render simple conditionals
- Keep trivial derived values only

#### Hook file naming convention

- File name: `useSomething.hook.ts`
- Export name: `useSomething`
- Location: `hooks/` subfolder co-located with the component, or top-level
  `src/hooks/` for shared hooks

#### No helper functions in components

Do not keep standalone helper functions in component files. Extract them to:

- A custom hook (if they use React state or effects)
- A utility module in `src/utilities/` (if they're pure functions)
