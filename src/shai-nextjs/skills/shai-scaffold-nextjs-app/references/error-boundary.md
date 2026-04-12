# error-boundary.tsx

Reusable error boundary component at `src/components/error-boundary.tsx`.
Must be a Client Component.

```tsx
"use client";

export function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="text-gray-500">{error.message}</p>
      <button
        onClick={reset}
        className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Try again
      </button>
    </main>
  );
}
```

Re-export as root error boundary at `src/app/error.tsx`:

```tsx
"use client";

export { ErrorBoundary as default } from "@/components/error-boundary";
```
