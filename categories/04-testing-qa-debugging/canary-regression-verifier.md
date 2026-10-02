# Skill: Canary Regression Verifier & Health Auditor
`id`: `kbcodedev/canary-regression-verifier`  
`category`: `04-testing-qa-debugging`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Post-deployment verification, canary release health auditing, synthetic probing, and automated rollback triggering.
- **Triggers**: Deploying new releases, post-migration sanity checks, monitoring live canary error rates.
- **Prerequisites**: Telemetry metrics (Prometheus/DataDog), synthetic health endpoints, rollback automation.

---

## 2. Core Mental Model & Invariant Principles
1. **Synthetic Probing**: Continuously test real user journeys (login, add to cart) against live canary instances using synthetic test accounts.
2. **Automated Rollback Thresholds**: If canary error rate exceeds 1% or latency increases by >20% compared to baseline over a 5-minute window, trigger instant rollback without human intervention.
3. **Traffic Gating**: Route traffic incrementally: $5\% \rightarrow 25\% \rightarrow 50\% \rightarrow 100\%$ with automated pause gates.

4. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[New Version Deployed to Canary (5% Traffic)]
                      │
                      ▼
┌─────────────────────────────────────────────┐
│ Phase 1: Synthetic Smoke Probes             │ ── Check /healthz, /ready, critical APIs
└─────────────────────┬───────────────────────┘
                      ▼
┌─────────────────────────────────────────────┐
│ Phase 2: Differential Metric Comparison     │ ── Error rate, p95 latency: Canary vs Baseline
└─────────────────────┬───────────────────────┘
                      ▼
            [Evaluation Decision]
          ┌───────────┴───────────┐
     [Healthy]                [Anomalous]
          ▼                       ▼
┌──────────────────┐    ┌──────────────────┐
│ Promote Traffic  │    │ Trigger Instant  │
│ (25% -> 100%)    │    │ Rollback to V(N) │
└──────────────────┘    └──────────────────┘
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
  "service": "checkout-service",
  "canary_version": "v2.14.0",
  "baseline_version": "v2.13.4",
  "metrics_window_minutes": 5,
  "canary_traffic_percent": 10
}
```

### Output Contract
```markdown
# Canary Health Audit Report

## Status: PROMOTED (100% Traffic Approved)

| Metric | Baseline (v2.13.4) | Canary (v2.14.0) | Delta | Threshold | Status |
|---|---|---|---|---|---|
| **Error Rate** | 0.04% | 0.02% | -0.02% | < 1.00% | ✅ PASS |
| **p95 Latency** | 142ms | 138ms | -4ms | < +20% | ✅ PASS |
| **p99 Latency** | 280ms | 275ms | -5ms | < +20% | ✅ PASS |
| **CPU Usage** | 42% | 39% | -3% | < +15% | ✅ PASS |
| **Synthetic Probes**| 120/120 | 120/120 | 0 fails | 100% | ✅ PASS |

**Recommendation**: Canary verified. Promote traffic to 100% and decommission old version.
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Shallow Health Checks**: Defining `/healthz` to return `200 OK` without checking database or cache connectivity.
- ❌ **Deploying 100% at Once**: Rolling out new versions directly to 100% of users without canary evaluation windows.
- ❌ **Ignoring Error Log Spikes**: Proceeding with deployment when error rate looks low, but logs reveal thousands of silent background worker crashes.

---

## 6. Real-World Production Example

```markdown
**Canary Abort Scenario**:
- Canary deployed to 5% traffic.
- Synthetic probe detected: `POST /checkout` returned `500 Internal Server Error` for currency conversions.
- Canary health engine triggered instant traffic cutover back to baseline in 12 seconds. Blast radius limited to 3 users.
```
