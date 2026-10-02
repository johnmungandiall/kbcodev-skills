# Skill: Staff Engineer Architectural Review & Risk Audit
`id`: `kbcodedev/staff-eng-architect-review`  
`category`: `08-strategic-product-leadership`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Performing Staff/Principal Engineer level architectural reviews on technical design documents, RFCs, database schema overhauls, and cross-cutting systems.
- **Triggers**: Architectural RFC review, high-risk technical design proposals, tech debt evaluation, scalability bottlenecks.
- **Prerequisites**: Technical design document / RFC, system dependency graph, non-functional requirements (throughput, latency, availability).

---

## 2. Core Mental Model & Invariant Principles
1. **Blast Radius & Reversibility (Two-Way vs One-Way Doors)**: Distinguish between easily reversible decisions (choice of library) and hard-to-reverse architectural commitments (database engine, primary key schema, public API shape).
2. **Failure Domain Segregation**: Every new dependency must have a defined failure mode. If service $X$ goes down, does our system gracefully degrade or crash entirely?
3. **Simplicity Over Cleverness**: The best architecture is the simplest one that solves the business requirement with zero unnecessary moving parts.

---

## 3. High-Signal Execution Workflow

```
[Technical Design RFC]
           │
           ▼
┌───────────────────────────┐
│ Phase 1: Data Model &     │ ── Indexing, write amplification, transaction boundaries
│          Storage Audit    │
└──────────┬────────────────┘
           ▼
┌───────────────────────────┐
│ Phase 2: Scalability &    │ ── Concurrency bottlenecks, thundering herds, N+1 queries
│          Bottleneck Probe │
└──────────┬────────────────┘
           ▼
┌───────────────────────────┐
│ Phase 3: Failure Domain & │ ── Circuit breakers, timeouts, fallback modes, data loss
│          Resilience Gate  │
└──────────┬────────────────┘
           ▼
┌───────────────────────────┐
│ Phase 4: Staff Verdict    │ ── Approved / Changes Requested with specific code fixes
└───────────────────────────┘
```

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "rfc_title": "Real-Time Collaborative Document Editing via WebSocket Synchronization",
  "proposed_tech": "Central Redis Pub/Sub + In-Memory Node.js State",
  "expected_scale": "50,000 concurrent active documents"
}
```

### Output Contract
```markdown
# Staff Engineer Architectural Review

## Status: CHANGES REQUESTED (Critical Failure Domain Identified)

## 1. Critical Architectural Risks
1. **Split-Brain State Loss on Container Restart**:
   - Storing document state exclusively in Node.js process memory means a Kubernetes pod restart will drop unsaved in-flight user keystrokes.
   - *Requirement*: Adopt Conflict-Free Replicated Data Types (CRDTs) with periodic snapshotting to durable storage (PostgreSQL/S3) via write-ahead logging.

2. **Redis Pub/Sub Fanout Saturation**:
   - Global Redis Pub/Sub with 50,000 active rooms will hit Redis single-threaded event loop CPU ceiling.
   - *Requirement*: Partition rooms using Redis Cluster or consistent hashing ring.

## 2. Required Invariants Before Merge
- [ ] Implement exponential backoff on client WebSocket reconnects with jitter to prevent Thundering Herd on server restarts.
- [ ] Add client-side optimistic operational transforms to maintain responsiveness under 200ms mobile network latency.
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Resume-Driven Development (RDD)**: Introducing complex distributed consensus algorithms (Raft) or unproven databases when PostgreSQL handles the scale easily.
- ❌ **Ignoring Blast Radius**: Designing migrations that lock entire multi-gigabyte production tables during peak business hours.
- ❌ **Missing SLO / Alert Thresholds**: Launching services without defining p99 latency alerts and error budgets.

---

## 6. Real-World Production Example

```markdown
**Staff Eng Intervention**:
- A team proposed a microservice architecture splitting 1 CRUD entity across 4 separate HTTP services.
- Staff Review: Rejected. Proved that network overhead and distributed transaction latency would degrade p99 from 20ms to 400ms. Kept as modular monolith with clean domain boundaries.
```
