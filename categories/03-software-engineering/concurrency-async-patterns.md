# Skill: Concurrency & Asynchronous Patterns
`id`: `kbcodedev/concurrency-async-patterns`  
`category`: `03-software-engineering`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Managing concurrent execution, thread pools, async event loops, race condition elimination, deadlocks, and worker worker pools.
- **Triggers**: Async I/O operations, parallel data processing, mutex/locking requirements, preventing race conditions under high concurrent load.
- **Prerequisites**: Target concurrency model (Node.js event loop, Go goroutines/channels, Python asyncio, Java/Rust threads).

---

## 2. Core Mental Model & Invariant Principles
1. **Share Memory by Communicating**: Prefer message passing (channels, queues) over shared mutable state protected by locks whenever possible.
2. **Lock Ordering Discipline**: Always acquire multiple locks in a strict global deterministic order to mathematically prevent deadlocks.
3. **Bounded Concurrency**: Never fire unbounded `Promise.all()` or spawn unlimited goroutines over large datasets—always use worker pools with concurrency limits (e.g. `p-limit`).

4. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[N Independent Async Tasks]
             │
             ▼
┌────────────────────────────┐
│ Step 1: Concurrency Cap    │ ── Set concurrency limit (e.g., max 5 in flight)
└────────────┬───────────────┘
             ▼
┌────────────────────────────┐
│ Step 2: Thread/Worker Pool │ ── Dispatch tasks through bounded queue
└────────────┬───────────────┘
             ▼
┌────────────────────────────┐
│ Step 3: Error Isolation    │ ── Promise.allSettled / structured error collection
└────────────┬───────────────┘
             ▼
┌────────────────────────────┐
│ Step 4: Graceful Drain     │ ── Flush remaining tasks before exit
└────────────────────────────┘
```

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "task": "Fetch metadata for 10,000 URLs without crashing network or exceeding socket limits",
  "concurrency_limit": 10,
  "timeout_ms": 5000
}
```

### Output Contract
```typescript
// Production Bounded Concurrency Worker Pool
export async function processInBatches<T, R>(
  items: T[],
  workerFn: (item: T) => Promise<R>,
  concurrencyLimit: number = 10
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let currentIndex = 0;

  async function worker(): Promise<void> {
    while (currentIndex < items.length) {
      const index = currentIndex++;
      const item = items[index];
      results[index] = await workerFn(item);
    }
  }

  const workers = Array.from(
    { length: Math.min(concurrencyLimit, items.length) }, 
    () => worker()
  );

  await Promise.all(workers);
  return results;
}
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Unbounded `Promise.all`**: Running `Promise.all(urls.map(fetch))` on 50,000 items, exhausting memory and socket descriptors (`EMFILE` error).
- ❌ **Async Function in `forEach`**: Using `array.forEach(async (item) => { ... })` which ignores promises and fires all iterations in un-awaited background execution.
- ❌ **Deadlock via Circular Locks**: Thread A locks $L_1$ and waits for $L_2$; Thread B locks $L_2$ and waits for $L_1$.

---

## 6. Real-World Production Example

```markdown
**Goroutine Leak Prevention in Go**:
- Problem: An HTTP request handler spawned a goroutine sending to an unbuffered channel without a context cancellation listener. When the client disconnected, the goroutine blocked forever.
- Fix: Passed `ctx context.Context` into the goroutine and monitored `<-ctx.Done()` to guarantee immediate resource release upon timeout or client disconnect.
```
