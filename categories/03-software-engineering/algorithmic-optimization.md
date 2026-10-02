# Skill: Algorithmic Optimization & Complexity Profiler
`id`: `kbcodedev/algorithmic-optimization`  
`category`: `03-software-engineering`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Optimizing hot paths, reducing asymptotic time/space complexity ($O(N^2) \rightarrow O(N \log N) \rightarrow O(N)$), eliminating memory leaks, and improving cache locality.
- **Triggers**: High CPU utilization spikes, latency bottlenecks, large data batch slowness, memory allocation pressure.
- **Prerequisites**: Profiler data (flamegraph, CPU profile), benchmark harness, representative test datasets.

---

## 2. Core Mental Model & Invariant Principles
1. **Profile Before Optimizing**: Never guess where bottlenecks are—measure with flamegraphs and allocation profilers.
2. **Asymptotic Dominance**: An $O(N)$ algorithm will always eventually outperform an $O(N^2)$ algorithm regardless of micro-optimizations.
3. **Data Structure Suitability**: Pick the exact data structure fitting the access pattern (Hash Map for $O(1)$ lookups, Ring Buffer for fixed streaming, Trie for prefix search, Bitset for boolean flags).

---

## 3. High-Signal Execution Workflow

```
[Bottleneck Hot Path Detected]
              │
              ▼
┌────────────────────────────┐
│ Phase 1: Benchmark Harness │ ── Measure baseline p50, p95, p99 latency & memory ops
└────────────┬───────────────┘
              ▼
┌────────────────────────────┐
│ Phase 2: Algorithmic &     │ ── 1. Replace nested loops with Hash Maps/Sets
│          Data Structure    │ ── 2. Avoid redundant allocations & copies
│          Optimization      │ ── 3. Utilize vectorization / SIMD where applicable
└────────────┬───────────────┘
              ▼
┌────────────────────────────┐
│ Phase 3: Differential      │ ── Compare Benchmark(Before) vs Benchmark(After)
│          Benchmarking      │    Verify exact numeric output equivalence
└────────────────────────────┘
```

### Key Asymptotic Transformation Matrix
- **Nested Loop Lookup**: $O(N \times M) \rightarrow O(N + M)$ by building an index map for $M$ first.
- **Repeated Subarray Sums**: $O(N \times K) \rightarrow O(1)$ per query via Prefix Sum Arrays.
- **Sliding Window Max/Min**: $O(N \times K) \rightarrow O(N)$ using Monotonic Deque.
- **Frequent String Concatenation**: $O(N^2)$ reallocation overhead $\rightarrow O(N)$ via `StringBuilder` or pre-allocated byte buffers.

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "problem": "Deduplicate and reconcile 500,000 transaction records against 1,000,000 ledger entries",
  "naive_code": "for tx in transactions: for entry in ledger: if tx.id == entry.tx_id: match()",
  "current_runtime": "45 minutes (O(N * M))"
}
```

### Output Contract
```python
# Optimized High-Throughput Reconciliation Engine (O(N + M))
def reconcile_transactions(transactions: list[Transaction], ledger: list[LedgerEntry]) -> list[ReconciliationResult]:
    # 1. Build fast O(1) hash index on ledger (O(M) time, O(M) space)
    ledger_index: dict[str, LedgerEntry] = {
        entry.tx_id: entry for entry in ledger
    }

    results: list[ReconciliationResult] = []
    
    # 2. Single-pass linear scan over transactions (O(N) time)
    for tx in transactions:
        matched_entry = ledger_index.get(tx.id)
        if matched_entry:
            results.append(ReconciliationResult(tx=tx, ledger=matched_entry, status="MATCHED"))
        else:
            results.append(ReconciliationResult(tx=tx, ledger=None, status="UNMATCHED"))
            
    return results

# Runtime dropped from 45 minutes to 1.8 seconds (1500x speedup).
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Premature Micro-Optimization**: Obscuring readable code with bitwise tricks before establishing that the section is actually a bottleneck.
- ❌ **Hidden $O(N)$ Operations Inside Loops**: Calling `.includes()`, `.indexOf()`, or `list.remove()` inside a loop creating unintended $O(N^2)$ complexity.
- ❌ **Excessive Garbage Collection Pressure**: Creating millions of short-lived objects in hot loops instead of reusing buffers or object pools.

---

## 6. Real-World Production Example

```markdown
**Scenario**: Search query autocomplete prefix matching on 200,000 terms.
- Naive: `array.filter(item => item.startsWith(query))` took 180ms per keystroke ($O(N)$ full scan).
- Optimized: Implemented in-memory Trie (Prefix Tree).
- Result: Lookup dropped to 0.12ms ($O(L)$ where $L$ is query length) with zero UI lag.
```
