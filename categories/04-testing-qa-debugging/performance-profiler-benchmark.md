# Skill: Performance Profiler & Load Benchmark
`id`: `kbcodedev/performance-profiler-benchmark`  
`category`: `04-testing-qa-debugging`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Profiling CPU bottlenecks, memory allocation leaks, event loop lag, and stress-testing HTTP/gRPC services under simulated concurrency.
- **Triggers**: High latency alerts (p95 > 500ms), memory leaks (OOM crashes), pre-launch capacity planning.
- **Prerequisites**: Profiler instrumentation (0x, pprof, clinic.js, Py-Spy), load testing tool (k6, autocannon, locust).

---

## 2. Core Mental Model & Invariant Principles
1. **Measure Percentiles, Never Averages**: Always evaluate $p50$, $p90$, $p95$, and $p99$ latency. Averages hide tail-latency starvation.
2. **Step Load Profiling**: Ramp up virtual users (VUs) gradually ($10 \rightarrow 100 \rightarrow 1000$) to identify the exact breaking point and saturation knee.
3. **Resource Saturation (USE Method)**: Measure Utilization, Saturation, and Errors for CPU, Memory, Disk I/O, and Network sockets.

4. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[Target Service / API Endpoint]
               │
               ▼
┌──────────────────────────────┐
│ Phase 1: Baseline Load Test  │ ── k6 script simulating realistic user load
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ Phase 2: CPU & Memory Flame  │ ── Capture flamegraphs during peak stress
│          Graph Capture       │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ Phase 3: Bottleneck Analysis │ ── Identify blocking sync calls, alloc churn, slow SQL
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ Phase 4: Verification Run    │ ── Re-run load test to prove p99 latency reduction
└──────────────────────────────┘
```

### Verification Gate
- Run this domain's own check against the real artefact before claiming success — the project's test/build/lint command, a schema or spec validator, a render or screenshot/diff inspection, or a dry run — whichever the project actually provides. Report the exact command and its result.
- Written, drafted, generated or merely executed is NOT verified; only the check passing is. If no such check exists or none can be run, say so plainly and deliver the claim as unverified.
- On failure: stop, keep the diagnostic output, name the actual failure, and retry only after something changed.
- Never report a result the check did not produce.

---

## 4. Input / Output Contracts

### Input Contract (k6 Load Test Script)
```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 50 },  // Ramp up
    { duration: '1m', target: 200 },   // Sustained peak
    { duration: '30s', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<300', 'p(99)<600'], // SLA
    http_req_failed: ['rate<0.01'],                 // Error rate < 1%
  },
};

export default function () {
  const res = http.get('https://api.example.com/v1/products?category=electronics');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 300ms': (r) => r.timings.duration < 300,
  });
  sleep(1);
}
```

### Output Contract
```markdown
# Performance Benchmark Report

## 1. Summary Metrics
- **Virtual Users (VUs)**: 200 concurrent
- **Total Requests**: 14,280
- **Throughput**: 238 req/sec
- **Error Rate**: 0.00%

## 2. Latency Distribution
- **p50 (Median)**: 48ms
- **p90**: 112ms
- **p95**: 185ms (Threshold: < 300ms - PASSED)
- **p99 (Tail)**: 290ms (Threshold: < 600ms - PASSED)

## 3. Bottlenecks Identified
- Heavy JSON serialization overhead in `products.service.ts` resolved via fast-json-stringify (35% CPU savings).
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Testing from Localhost with Zero Network Latency**: Running load tests entirely on `127.0.0.1` ignoring TCP connection overhead and DNS.
- ❌ **Ignoring Cold Starts & JIT Warmup**: Measuring metrics during the first 5 seconds of JVM/V8 startup before JIT compiler warms up.
- ❌ **Under-Provisioned Load Generator**: Running load generator on a machine that hits 100% CPU, artificially distorting client-side latency.

---

## 6. Real-World Production Example

```markdown
**Flamegraph Insight**:
- Profiler showed 60% of CPU time in `jwt.verify()` for every API request.
- Optimization: Implemented LRU cache for decoded JWT verification results with 60s TTL. CPU load dropped from 88% to 14%.
```
