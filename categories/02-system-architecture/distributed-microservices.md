# Skill: Distributed Microservices & Resilience Patterns
`id`: `kbcodedev/distributed-microservices`  
`category`: `02-system-architecture`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Architecting, scaling, and hardening distributed microservices against network partitions, cascading failures, latency spikes, and data inconsistency.
- **Triggers**: High availability requirements, service-to-service communication design, SLA/SLO definition, failure domain isolation.
- **Prerequisites**: Domain-Driven Design (DDD) bounded contexts, service registry, distributed tracing setup.

---

## 2. Core Mental Model & Invariant Principles
1. **Design for Failure**: Assume every network call will eventually timeout, fail, or return corrupt data.
2. **Idempotency Everywhere**: All mutation endpoints and event handlers must accept idempotency keys (`X-Idempotency-Key`) to prevent duplicate processing.
3. **Failure Isolation**: Implement Circuit Breakers, Bulkheads, and Rate Limiters to prevent localized outages from cascading across the entire cluster.

4. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[Inbound Client Request]
           │
           ▼
┌─────────────────────────┐
│ API Gateway / Ingress   │ ── Rate Limiter & Token Bucket
└──────────┬──────────────┘
           ▼
┌─────────────────────────┐
│ Service A (Caller)      │ ── Idempotency Check & Correlation ID Injection
└──────────┬──────────────┘
           ▼
┌─────────────────────────┐
│ Circuit Breaker Guard   │ ── Closed (Normal) / Open (Fallback) / Half-Open (Probe)
└──────────┬──────────────┘
           ▼
┌─────────────────────────┐
│ Service B (Callee)      │ ── Process with Timeout & Outbox Pattern
└─────────────────────────┘
```

### Core Resilience Patterns

#### 1. Circuit Breaker State Machine
- **Closed**: Requests flow normally. If error rate exceeds 25% over 10s window, transition to **Open**.
- **Open**: Fail fast immediately with fallback response; do not hit downstream service.
- **Half-Open**: After 30s cooldown, allow 3 probe requests. If successful, reset to **Closed**; if failed, revert to **Open**.

#### 2. Transactional Outbox Pattern
- When mutating local database state, write outgoing domain events into an `outbox_events` table within the same ACID transaction.
- An asynchronous relay worker tails the outbox table and publishes events to Kafka/RabbitMQ, guaranteeing at-least-once delivery.

#### 3. Idempotency Guard Implementation
- Store `(idempotency_key, request_hash, status, response_payload)` in Redis with a 24-hour TTL.
- If key exists in `IN_PROGRESS` status, return `409 Conflict`. If `COMPLETED`, return cached response immediately.

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "service_name": "BillingService",
  "downstream_dependency": "PaymentGatewayAPI",
  "sla_target": "99.99% availability, p99 latency < 250ms",
  "failure_modes": ["Timeout", "500 Internal Server Error", "Network Partition"]
}
```

### Output Contract
```typescript
// Production Resilience Policy Specification
export const resilienceConfig = {
  timeoutMs: 3000,
  retryPolicy: {
    maxAttempts: 3,
    backoff: "exponential_jitter",
    initialDelayMs: 200,
    maxDelayMs: 2000,
    retryableStatusCodes: [502, 503, 504, 429]
  },
  circuitBreaker: {
    failureThresholdPercentage: 25,
    minimumRequests: 20,
    samplingWindowMs: 10000,
    openStateCooldownMs: 30000
  },
  idempotencyHeader: "X-Idempotency-Key",
  correlationHeader: "X-Correlation-ID"
};
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Distributed Monolith**: Microservices sharing a single global relational database, coupling deployments and schemas.
- ❌ **Synchronous HTTP Chains**: Deep call chains (`A -> B -> C -> D -> E`) multiplying failure probabilities and latency.
- ❌ **Unbounded Retries**: Retrying without exponential backoff and jitter, creating self-inflicted Distributed Denial of Service (Thundering Herd).

---

## 6. Real-World Production Example

```markdown
**Scenario**: User clicks "Pay $99" twice on a slow mobile connection.

**Execution Flow**:
1. Request 1 arrives with `X-Idempotency-Key: ord_9921_abc`.
2. BillingService sets Redis key `ord_9921_abc` -> `PENDING`. Dispatches payment to Stripe.
3. Request 2 arrives with identical key -> Redis returns `PENDING` -> Returns `409 Processing`.
4. Stripe succeeds. Request 1 updates Redis key to `SUCCESS` + response payload.
5. If Request 2 retries 5s later, Redis returns the original `200 OK` receipt payload without re-charging the card.
```
