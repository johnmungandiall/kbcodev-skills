# Skill: Zero-Downtime Ship Pipeline & Release Gate
`id`: `kbcodedev/zero-downtime-ship-pipeline`  
`category`: `06-devops-sre-release`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Orchestrating zero-downtime software releases, blue-green deployments, rolling updates, database schema migrations, and production readiness gates.
- **Triggers**: Release requests, production deployments, landing features to live traffic, rollback coordination.
- **Prerequisites**: Health check endpoints, backward-compatible database migrations, load balancer routing control.

---

## 2. Core Mental Model & Invariant Principles
1. **Expand and Contract (Database Migrations)**: Never make breaking database changes in a single deploy. Phase 1: Expand (Add nullable columns/tables), Phase 2: Deploy code writing to both, Phase 3: Contract (Drop old columns).
2. **Readiness vs Liveness Probes**: Liveness tells Kubernetes to restart a crashed container; Readiness tells the load balancer whether the container is warm and ready to receive live user traffic.
3. **Automated Rollback on Error Threshold**: If 5xx error spikes occur immediately post-switchover, abort and revert load balancer traffic instantly.

4. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[Release Candidate Tag (v2.14.0)]
                │
                ▼
┌───────────────────────────────┐
│ Step 1: Pre-Flight Gate Checks│ ── All CI tests green, zero high CVEs, git clean
└───────────────┬───────────────┘
                ▼
┌───────────────────────────────┐
│ Step 2: Backward-Compatible   │ ── Run non-blocking DB migrations first
│         Schema Migration      │
└───────────────┬───────────────┘
                ▼
┌───────────────────────────────┐
│ Step 3: Blue-Green Deployment │ ── Spin up Green cluster (v2.14.0) alongside Blue (v2.13.4)
└───────────────┬───────────────┘
                ▼
┌───────────────────────────────┐
│ Step 4: Synthetic Warmup &    │ ── Hit Green /healthz and /ready endpoints
│         Traffic Switchover    │ ── Shift DNS / ALB traffic: 0% -> 100%
└───────────────┬───────────────┘
                ▼
┌───────────────────────────────┐
│ Step 5: Post-Deploy Sanity    │ ── Monitor 5xx rates; decommission Blue after 30 min
└───────────────────────────────┘
```

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "release_version": "v2.14.0",
  "service": "order-api",
  "deployment_strategy": "blue-green",
  "rollback_criteria": "5xx error rate > 0.5% over 2 minutes"
}
```

### Output Contract
```markdown
# Zero-Downtime Release Manifest

## Pre-Flight Verification
- CI Build #4829: Passed (142 unit + 28 integration tests)
- Security Scan: 0 Critical / 0 High vulnerabilities
- Database Migration: `0042_add_order_discount.sql` applied successfully (0 locks held)

## Deployment Execution
1. Green fleet provisioned (4 pods, v2.14.0).
2. Health probes confirmed: `GET /healthz` -> 200 OK (Average warmup: 4.2s).
3. Traffic routing shifted via AWS Target Group: 100% directed to Green.
4. Blue fleet retained in idle standby for 30 minutes before termination.

## Post-Deploy Verification
- Live Error Rate: 0.01% (Baseline: 0.02%)
- p95 Latency: 48ms
- Status: **RELEASE COMPLETED SUCCESSFULLY**
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Breaking Database Schema Deploys**: Renaming a live column before new application code is deployed, crashing active instances.
- ❌ **Missing Warmup Windows**: Routing traffic to freshly launched Node.js/JVM instances before JIT compilation and database connection pools warm up.
- ❌ **Terminating Previous Fleet Immediately**: Killing old instances immediately without retaining a 15-minute rollback safety window.

---

## 6. Real-World Production Example

```markdown
**Zero-Downtime Migration in Action**:
- Needed to rename `user.name` to `user.full_name`.
- Step 1: Added `full_name` column (nullable).
- Step 2: Deployed app version writing to both `name` and `full_name`, reading from `name`.
- Step 3: Backfilled historical rows from `name` to `full_name`.
- Step 4: Deployed app version reading from `full_name`.
- Step 5: Dropped legacy `name` column in subsequent release. Zero downtime throughout.
```
