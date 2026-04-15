## Hook Delegation

Components are for **displaying data and capturing user input**. All logic —
data loading, state management, transformations, side effects — lives in custom
hooks. This is the single most important architectural rule.

### The principle

A component's body should be trivial: call hooks, destructure results, return
JSX. If you're writing an `if` chain, a `.map().filter()`, or a `try/catch`
inside a component — move it to a hook.

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

Why: The component is now coupled to the data-fetching implementation. You can't
test the filtering logic without rendering the component. You can't reuse the
data-fetching in another component.

### What belongs in hooks

| Concern                      | Where                            | Example hook                        |
| ---------------------------- | -------------------------------- | ----------------------------------- |
| Data fetching / loading      | `hooks/useOrders.hook.ts`        | `useOrders`, `useUserProfile`       |
| Complex state management     | `hooks/useCheckout.hook.ts`      | `useCheckout`, `useCartState`       |
| Form logic / validation      | `hooks/useLoginForm.hook.ts`     | `useLoginForm`, `useSearchForm`     |
| Data transformations         | `hooks/useFilteredItems.hook.ts` | `useFilteredItems`, `useSortedList` |
| Side effects / subscriptions | `hooks/useWebSocket.hook.ts`     | `useWebSocket`, `useInterval`       |
| Event handlers with logic    | `hooks/useKeyboardNav.hook.ts`   | `useKeyboardNav`, `useDragDrop`     |

### What stays in the component

- Destructuring hook results
- Early returns for loading / error states
- Event handler wiring (passing hook callbacks to JSX)
- Simple conditional rendering (ternary, `&&`)
- Trivial derived values (a single `!isOpen` toggle — no need for a hook)

### Hook file naming convention

- File name: `useSomething.hook.ts`
- Export name: `useSomething`
- Location: `hooks/` subfolder co-located with the component, or top-level
  `src/hooks/` for shared hooks

### No helper functions in components

Component files must not contain standalone helper functions. Extract them to:

- A custom hook (if they use React state or effects)
- A utility module in `src/utilities/` (if they're pure functions)
