# Skill: Executive Internal Communications & Status Memos
`id`: `kbcodedev/executive-internal-comms`  
`category`: `10-communication-humanizer-career`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Drafting crisp executive status updates, cross-team announcements, blocker escalations, and 1-page engineering memos for leadership.
- **Triggers**: Weekly status reports, executive briefing requests, blocker escalations, cross-team dependency announcements.
- **Prerequisites**: Current project progress, timeline dates, blockers requiring resolution.

---

## 2. Core Mental Model & Invariant Principles
1. **BLUF (Bottom Line Up Front)**: The very first sentence must state the conclusion, project status (Green / Yellow / Red), or exact decision requested.
2. **Scannable in 30 Seconds**: Executives read on mobile devices between meetings; use bold key terms, bullet points, and zero dense narrative paragraphs.
3. **Specific Ask & Owner**: If requesting resources or decisions, state explicitly: (1) Who owns the decision, (2) Exactly what is needed, and (3) Deadline date.

4. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[Project Milestones / Blocker Situation]
                    │
                    ▼
┌───────────────────────────────────────┐
│ Step 1: BLUF Status Banner (🟢/🟡/🔴) │ ── Green (On track) / Yellow (Risk) / Red (Blocked)
└───────────────────┬───────────────────┘
                    ▼
┌───────────────────────────────────────┐
│ Step 2: 3 Key Accomplishments (Done)  │ ── High-impact deliverables shipped this week
└───────────────────┬───────────────────┘
                    ▼
┌───────────────────────────────────────┐
│ Step 3: Next Week Commitments         │ ── Upcoming milestones with assigned dates
└───────────────────┬───────────────────┘
                    ▼
┌───────────────────────────────────────┐
│ Step 4: Blockers & Explicit Asks      │ ── Specific decision requested with deadline
└───────────────────────────────────────┘
```

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "project": "Cloud Migration to AWS EKS",
  "status": "Yellow",
  "progress": "Completed database replica sync and 30 microservice Dockerfiles. Blocked on IAM role approval from Security team."
}
```

### Output Contract
```markdown
# Weekly Executive Update: AWS EKS Cloud Migration

**Status**: 🟡 **YELLOW** (Security Approval Blocker) | **Target Launch**: Nov 15, 2026

## 1. Executive Summary (BLUF)
Core database and containerization milestones are 100% complete. Production traffic cutover remains on track for Nov 15 provided IAM security roles are approved by Thursday, Oct 8.

## 2. Key Accomplishments This Week
- **Database Replication Complete**: Synchronized multi-region Aurora Postgres cluster with < 2ms replication lag across 4.2TB dataset.
- **Containerization Finished**: Built and security-scanned multi-stage Docker images for all 30 microservices (zero High/Critical CVEs).

## 3. Next Week Commitments
- Execute dry-run traffic cutover in staging environment (Oct 12).
- Deploy Prometheus / Grafana observability dashboards (Oct 14).

## 4. Blockers & Immediate Asks
- **Action Required**: Security Team sign-off on EKS Pod Identity IAM roles (`SEC-892`).
- **Decision Owner**: Chief Security Officer (CSO)
- **Deadline**: Thursday, Oct 8 at 17:00 UTC (delay pushes production launch by 1 week).
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Burying the Lede**: Putting a critical project delay on page 4 at the bottom of a paragraph.
- ❌ **Hiding Problems (Watermelon Projects)**: Reporting "Green" week after week until the project suddenly explodes into "Red" on launch day.
- ❌ **Unassigned Asks**: Writing *"Someone needs to look at this"* instead of naming the exact owner and deadline.

---

## 6. Real-World Production Example

```markdown
**Escalation Memo Efficacy**:
- Sent 6-line BLUF escalation to VP of Engineering naming specific blocked IAM ticket.
- Blocker unblocked in 22 minutes, preserving quarterly launch date.
```
