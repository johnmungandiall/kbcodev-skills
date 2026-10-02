# Skill: Technical RFC & Architectural Decision Record (ADR) Co-Author
`id`: `kbcodedev/technical-rfc-doc-coauthor`  
`category`: `09-document-media-synthesis`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Authoring high-density technical Requests for Comments (RFCs), Architectural Decision Records (ADRs), system migration blueprints, and technical whitepapers.
- **Triggers**: Architectural changes, choosing between new database/framework technologies, proposing cross-team engineering standards.
- **Prerequisites**: Clear technical problem definition, list of considered alternative approaches.

---

## 2. Core Mental Model & Invariant Principles
1. **Decision Context & Trade-Off Honesty**: An ADR is not an advertisement for the chosen approach—it must document the disadvantages and rejected alternatives with equal rigor.
2. **Immutability of Decision Records**: ADRs are append-only. If a past decision is reversed, create a new ADR (e.g., `ADR-0012-replace-dynamodb-with-postgres.md`) that supersedes `ADR-0004`.
3. **Structured RFC Taxonomy**: Summary -> Context & Motivation -> Proposed Architecture -> Alternatives Considered -> Migration & Rollback Strategy -> Open Questions.

4. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[Technical Decision Opportunity]
                │
                ▼
┌───────────────────────────────┐
│ Section 1: Context & Problem  │ ── Why does this decision need to be made now?
└───────────────┬───────────────┘
                ▼
┌───────────────────────────────┐
│ Section 2: Proposed Solution  │ ── Technical design, schema, API contracts
└───────────────┬───────────────┘
                ▼
┌───────────────────────────────┐
│ Section 3: Alternatives Matrix│ ── Option A vs Option B vs Option C (Pros & Cons)
└───────────────┬───────────────┘
                ▼
┌───────────────────────────────┐
│ Section 4: Rollback & Risks   │ ── What happens if this fails? How do we back out?
└───────────────┬───────────────┘
                ▼
┌───────────────────────────────┐
│ Section 5: Decision Consensus │ ── Approved / Superseded status badge
└───────────────────────────────┘
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
  "decision_topic": "Adopting PostgreSQL instead of DynamoDB for Core Billing Ledger",
  "key_drivers": ["ACID compliance required", "Complex multi-table reconciliation queries", "Team expertise"]
}
```

### Output Contract
```markdown
# ADR-0008: Adopt PostgreSQL for Core Billing Ledger Service

- **Status**: ACCEPTED
- **Date**: 2026-10-02
- **Deciders**: Staff Architect, Lead DBA, Principal Billing Engineer

## 1. Context & Problem Statement
Our billing service currently processes $4.2M/mo across 14 currencies. We require strict ACID guarantees across multi-item transactions and complex reconciliation queries between internal ledgers and Stripe webhooks. DynamoDB's eventual consistency model has resulted in reconciliation drift requiring manual cron repair jobs.

## 2. Decision
We will adopt **PostgreSQL 16 (AWS Aurora)** as the primary relational datastore for the Billing Ledger service.

## 3. Evaluated Alternatives

| Alternative | Advantages | Disadvantages | Verdict |
|---|---|---|---|
| **DynamoDB** | Infinite horizontal scale, zero maintenance | Eventual consistency, no multi-table JOINs, expensive multi-item transactions | **REJECTED** |
| **CockroachDB**| Distributed SQL, multi-region write scalability | High infrastructure cost, operational complexity for current scale | **REJECTED** |
| **PostgreSQL 16**| Mature ACID transactions, rich JSONB & Window functions, battle-tested tooling | Requires vertical scaling / connection pooling (PgBouncer) | **ACCEPTED** |

## 4. Consequences & Trade-Offs
- **Positive**: 100% strict serializable ACID transactions eliminate reconciliation drift.
- **Negative**: Must manage connection pooling via AWS RDS Proxy / PgBouncer to prevent connection exhaustion.
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **One-Sided Proposals**: Presenting only the pros of the favored technology while ignoring its operational complexity, memory overhead, or cost.
- ❌ **Unstated Rollback Strategy**: Proposing massive database migrations without a defined plan for how to abort if latency spikes occur.
- ❌ **Rewriting History**: Editing past accepted ADRs in place instead of creating a new superseding record.

---

## 6. Real-World Production Example

```markdown
**ADR Longevity**:
- Documented `ADR-0002: Use UUIDv7 for Primary Keys`.
- 18 months later, new engineers onboarding to the team understood immediately why integer auto-increments were avoided without having to re-debate the decision.
```
