# Skill: Blameless Post-Mortem & Incident Retrospective
`id`: `kbcodedev/post-mortem-incident-retro`  
`category`: `08-strategic-product-leadership`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Conducting blameless post-mortem reviews after production outages, security incidents, major data inconsistencies, or deployment failures.
- **Triggers**: Sev-1 / Sev-2 production incidents, SLA breaches, data loss events, major release rollbacks.
- **Prerequisites**: Incident timeline logs, monitoring graphs, engineer retrospective input.

---

## 2. Core Mental Model & Invariant Principles
1. **Blameless Culture**: Focus on systemic, process, and architectural failures—never blame individuals. If a human made a mistake, the system allowed that mistake to reach production unchecked.
2. **Accurate Chronological Timeline**: Reconstruct events second-by-second (Time of Outage, Time of Detection, Time of Triage, Time of Fix, Time of Full Recovery).
3. **Actionable Preventive Items (Action Items)**: Every post-mortem must produce concrete engineering tickets with assigned owners to ensure the specific failure mode can never recur.

---

## 3. High-Signal Execution Workflow

```
[Production Outage Resolved]
               │
               ▼
┌──────────────────────────────┐
│ Phase 1: Incident Summary    │ ── Impact: Downtime minutes, affected users, data loss
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ Phase 2: Chronology Timeline │ ── Timestamped sequence of events and response actions
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ Phase 3: Root Cause Analysis │ ── 5-Whys analysis of technical & process failures
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ Phase 4: Action Items (Jira) │ ── Preventive code fixes, monitors, CI guardrails
└──────────────────────────────┘
```

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "incident_title": "Payment Processing Outage on Cyber Monday",
  "start_time": "2026-10-02T10:14:00Z",
  "end_time": "2026-10-02T10:48:00Z",
  "symptom": "500 errors on /api/v1/checkout for all EU customers",
  "cause": "Database connection pool exhausted due to unindexed query in new promotion feature"
}
```

### Output Contract
```markdown
# Blameless Incident Post-Mortem: Payment Gateway Outage

## 1. Incident Overview
- **Date & Duration**: Oct 2, 2026 (10:14 - 10:48 UTC, 34 minutes)
- **Severity**: SEV-1
- **User Impact**: ~4,200 European shoppers received checkout errors. ~$120k in delayed transactions.
- **Data Loss**: Zero data corruption; all pending orders reconciled.

## 2. Incident Timeline (UTC)
- **10:14**: Deploy of release `v2.14.0` (included new coupon discount lookup).
- **10:18**: PagerDuty fires: `checkout_5xx_rate > 5%`.
- **10:22**: On-call engineer identifies Postgres connection pool at 100% capacity (500/500 active connections).
- **10:28**: DBA identifies `SELECT * FROM coupons WHERE code = $1` executing sequential table scan (missing index).
- **10:34**: Rollback initiated to `v2.13.4`.
- **10:42**: Rollback completed; connection pool returns to normal (24 connections).
- **10:48**: Synthetic health probes green. Incident resolved.

## 3. Root Cause Analysis (5-Whys)
- DB connection pool exhausted because coupon queries took 4.2 seconds instead of 2ms.
- Coupon table grew to 8M rows without a database index on the `code` column.
- CI pipeline ran tests on a local SQLite database with only 10 mock rows, masking the missing index.

## 4. Preventive Action Items
- [ ] **AI-01 (P0 - DBA)**: Add concurrent index `idx_coupons_code` on PostgreSQL production.
- [ ] **AI-02 (P0 - Infra)**: Add EXPLAIN plan linter in CI to fail builds on sequential scans over production-scale tables.
- [ ] **AI-03 (P1 - SRE)**: Configure automated canary rollback trigger on DB connection saturation > 80%.
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Finger-Pointing**: Writing *"Developer X forgot to add an index"* instead of *"CI test harness lacked production-scale query validation"*.
- ❌ **Vague Action Items**: Recording action items like *"Be more careful with database queries"* instead of specific programmatic tickets.
- ❌ **Post-Mortem Abandonment**: Writing the report but never scheduling or completing the preventive action items.

---

## 6. Real-World Production Example

```markdown
**Post-Mortem Action Item Impact**:
- Added an automated CI query analyzer following an incident.
- 3 weeks later, the analyzer caught and blocked an unindexed query on the `orders` table before it ever reached staging, preventing a major outage.
```
