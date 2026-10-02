# Skill: Observability, OpenTelemetry & Structured Telemetry
`id`: `kbcodedev/observability-logging-telemetry`  
`category`: `06-devops-sre-release`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Instrumenting distributed microservices with OpenTelemetry (OTel), distributed tracing, structured JSON logging, Prometheus metrics, and alert thresholds.
- **Triggers**: Observability gap remediation, tracking inter-service latency bottlenecks, configuring alert rules, standardizing log formats.
- **Prerequisites**: OpenTelemetry SDK / Collector, metrics backend (Prometheus/DataDog/Grafana), centralized log pipeline (Loki/Elasticsearch).

---

## 2. Core Mental Model & Invariant Principles
1. **The Three Pillars Unified**: Metrics tell you *that* a problem exists; Traces pinpoint *where* in the distributed chain it occurred; Logs reveal *why* it failed.
2. **Correlation Context Propagation (W3C TraceContext)**: Always propagate `traceparent` (`trace_id`, `span_id`) across HTTP and message queue headers.
3. **Structured JSON Logs Only**: Plain text string logs (`console.log("user logged in")`) are prohibited; emit structured JSON objects with indexed fields (`{"event": "user.login", "user_id": "123", "trace_id": "..."}`).

4. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[Inbound Request with Trace Header]
                  │
                  ▼
┌─────────────────────────────────┐
│ Phase 1: Span Creation &        │ ── Extract W3C TraceContext, start active root span
│          Context Injection      │
└─────────────────┬───────────────┘
                  ▼
┌─────────────────────────────────┐
│ Phase 2: Structured Logging     │ ── Automatically attach trace_id and span_id to logs
└─────────────────┬───────────────┘
                  ▼
┌─────────────────────────────────┐
│ Phase 3: Prometheus Metrics     │ ── Increment counters (http_requests_total),
│          Collection             │    record latency histograms (http_duration_seconds)
└─────────────────┬───────────────┘
                  ▼
┌─────────────────────────────────┐
│ Phase 4: Span Export            │ ── Batch export spans to OTel Collector on finish
└─────────────────────────────────┘
```

### Verification Gate
- Run this domain's own check against the real artefact before claiming success — the project's test/build/lint command, a schema or spec validator, a render or screenshot/diff inspection, or a dry run — whichever the project actually provides. Report the exact command and its result.
- Written, drafted, generated or merely executed is NOT verified; only the check passing is. If no such check exists or none can be run, say so plainly and deliver the claim as unverified.
- On failure: stop, keep the diagnostic output, name the actual failure, and retry only after something changed.
- Never report a result the check did not produce.

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "service": "billing-service",
  "telemetry_needs": ["OpenTelemetry Tracing", "Pino Structured Logging", "Prometheus Metrics"]
}
```

### Output Contract
```typescript
import { trace, context } from '@opentelemetry/api';
import pino from 'pino';
import { Counter, Histogram } from 'prom-client';

const tracer = trace.getTracer('billing-service');

// Structured Logger with Trace Correlation
export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  formatters: {
    log(object) {
      const activeSpan = trace.getSpan(context.active());
      if (activeSpan) {
        const spanContext = activeSpan.spanContext();
        return {
          ...object,
          trace_id: spanContext.traceId,
          span_id: spanContext.spanId,
        };
      }
      return object;
    },
  },
});

// Prometheus Metrics
export const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
});
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **High Cardinality Metrics Labels**: Adding `user_id` or raw UUIDs as Prometheus metric labels, blowing up time-series database memory.
- ❌ **Unstructured String Logging**: Logging `console.log("Error processing " + orderId + " with error " + err)` preventing regex parsing and aggregation.
- ❌ **Un-Sampled Tracing at Scale**: Sampling 100% of traces at 50,000 req/sec, incurring massive network bandwidth and cloud storage costs.

---

## 6. Real-World Production Example

```markdown
**Distributed Trace Diagnosis**:
- Trace revealed a 1.4-second checkout request spent 1.25 seconds blocked on an unindexed serial call to an external tax calculation API.
- Fix: Cached tax rate tables in memory with 1-hour invalidation. Request duration dropped to 45ms.
```
