# Skill: Modern Frontend Architecture & State Engineering
`id`: `kbcodedev/modern-frontend-architecture`  
`category`: `05-frontend-ui-ux`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Designing scalable frontend applications (React, Next.js, Vue, Svelte), state management, server components, data fetching, and bundle optimization.
- **Triggers**: New web app architecture, state management refactor, page load performance tuning, Next.js App Router design.
- **Prerequisites**: React/TypeScript expertise, browser rendering lifecycle knowledge, component modularity standards.

---

## 2. Core Mental Model & Invariant Principles
1. **Server-First by Default (RSC)**: Keep data fetching, heavy libraries, and business logic on the server; push client interactivity only to the leaves of the component tree (`'use client'`).
2. **State Localization**: Keep state as close as possible to where it is used. Avoid bloated global stores for state that only 1 component cares about.
3. **Optimistic UI Updates**: Instantly update the UI on user actions (e.g. liking a post), syncing in the background with rollback handling on error.

---

## 3. High-Signal Execution Workflow

```
[User Interaction / Data Fetching Need]
                   │
                   ▼
┌──────────────────────────────────────┐
│ Phase 1: Component Boundary Division │ ── Server Component vs Client Component
└──────────────────┬───────────────────┘
                   ▼
┌──────────────────────────────────────┐
│ Phase 2: State Taxonomy Allocation   │ ── URL State > Server Cache > Local State > Global Store
└──────────────────┬───────────────────┘
                   ▼
┌──────────────────────────────────────┐
│ Phase 3: Optimistic Mutation Flow    │ ── Apply immediate UI update -> Await API -> Reconcile
└──────────────────┬───────────────────┘
                   ▼
┌──────────────────────────────────────┐
│ Phase 4: Bundle & Tree-Shaking Audit │ ── Dynamic imports for heavy modals/charts
└──────────────────────────────────────┘
```

### State Taxonomy Matrix
- **URL State (Search Params)**: Filters, pagination, active tab (shareable, bookmarkable).
- **Server Cache (React Query / SWR / RSC)**: Remote server data, mutations, cache invalidation.
- **Local State (`useState` / `useReducer`)**: Form inputs, dropdown open/close, toggle switches.
- **Global Client Store (Zustand / Jotai)**: Authentication session, global audio player, theme toggle.

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "feature": "Real-time task list with status toggle and search filtering",
  "framework": "Next.js App Router + TypeScript + Tailwind CSS",
  "requirements": ["Optimistic updates", "URL search params for filters", "Server-rendered initial HTML"]
}
```

### Output Contract
```tsx
// Server Component (Page Shell)
import { Suspense } from 'react';
import { TaskListClient } from './TaskListClient';
import { getTasks } from '@/lib/api/tasks';

export default async function TasksPage({
  searchParams,
}: {
  searchParams: { filter?: string };
}) {
  const initialTasks = await getTasks(searchParams.filter);

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Project Tasks</h1>
      <Suspense fallback={<div className="animate-pulse h-64 bg-gray-100 rounded-lg" />}>
        <TaskListClient initialTasks={initialTasks} initialFilter={searchParams.filter} />
      </Suspense>
    </main>
  );
}
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **`'use client'` at the Root**: Marking top-level layout or page components with `'use client'`, disabling all Server Component benefits.
- ❌ **Prop Drilling 8 Levels Deep**: Passing callbacks through dozens of intermediate components instead of using composition or focused context.
- ❌ **Waterfalls in `useEffect`**: Fetching User -> then fetching Projects -> then fetching Tasks inside chained `useEffect` calls.

---

## 6. Real-World Production Example

```markdown
**Bundle Optimization in Dashboard**:
- Problem: Initial page bundle was 1.4MB due to Monaco Editor and Chart.js loaded upfront.
- Fix: Converted both to `dynamic(() => import('@/components/HeavyChart'), { ssr: false })`.
- Result: Initial JavaScript bundle size decreased by 68% (from 1.4MB to 440KB), First Contentful Paint (FCP) improved from 2.8s to 0.9s.
```
