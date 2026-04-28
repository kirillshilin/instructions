---
id: R-I01-r04
priority: must
status: done
related: [R-I01]
---
### Constants and Data

Do not keep inline data in component files.

Import strings, numbers, configuration objects, and option arrays.

#### No inline data in components

**Preferred:**

```tsx
// constants/order-status.ts
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  shipped: "Shipped",
  delivered: "Delivered",
};

export const ORDER_STATUS_OPTIONS: SelectOption[] = [
  { value: "pending", label: "Pending" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
];
```

```tsx
// OrderFilter.tsx
import { ORDER_STATUS_OPTIONS } from "@/constants/order-status";

const OrderFilter = ({ onFilter }: OrderFilterProps) => {
  return (
    <Select options={ORDER_STATUS_OPTIONS} onChange={onFilter} />
  );
};
```

**Avoid:**

```tsx
// OrderFilter.tsx — inline data
const OrderFilter = ({ onFilter }: OrderFilterProps) => {
  const options = [
    { value: "pending", label: "Pending" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
  ];

  return <Select options={options} onChange={onFilter} />;
};
```

Why: inline data recreates on each render and mixes non-UI concerns into the
component.

#### Where constants live

| Scope              | Location                     | Example                     |
| ------------------ | ---------------------------- | --------------------------- |
| Application-wide   | `src/constants/{domain}.ts`  | `src/constants/routes.ts`   |
| Feature-specific   | `src/{feature}/constants.ts` | `src/checkout/constants.ts` |
| Enum-like mappings | `src/constants/{domain}.ts`  | `src/constants/status.ts`   |

#### Naming

- Use `ALL_CAPS` for primitive constants: `MAX_ITEMS`, `API_TIMEOUT`
- Use `PascalCase` or `ALL_CAPS` for object/array constants:
  `ORDER_STATUS_OPTIONS`, `ROUTES`
- Never name a constant `data`, `values`, `items`, or `list` — be specific

#### Default prop values

Extract default prop objects to module-level constants, not inline:

**Preferred:**

```tsx
const DEFAULT_PAGINATION: PaginationConfig = { page: 1, pageSize: 20 };

const DataTable = ({ pagination = DEFAULT_PAGINATION }: DataTableProps) => {
  // ...
};
```

**Avoid:**

```tsx
const DataTable = ({ pagination = { page: 1, pageSize: 20 } }: DataTableProps) => {
  // ...
};
```

Why: inline default objects create a new reference on each render and can
trigger unnecessary child re-renders.
