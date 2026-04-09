# loading.tsx

Reusable loading spinner component at `src/components/loading.tsx`.

```tsx
export function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
    </main>
  );
}
```

Re-export as root loading state at `src/app/loading.tsx`:

```tsx
export { Loading as default } from "@/components/loading";
```
