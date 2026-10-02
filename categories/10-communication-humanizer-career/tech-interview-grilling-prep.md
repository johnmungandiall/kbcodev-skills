# Skill: Technical Interview Defense & System Design Grilling Prep
`id`: `kbcodedev/tech-interview-grilling-prep`  
`category`: `10-communication-humanizer-career`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Preparing candidates for rigorous Staff/Senior technical interviews, system design interrogations, trade-off defenses, and behavioral STAR stories.
- **Triggers**: System design interview practice, mock interview defense, behavioral question formulation.
- **Prerequisites**: Target company engineering level, architecture topic (e.g. Design YouTube / Uber / Distributed Rate Limiter).

---

## 2. Core Mental Model & Invariant Principles
1. **Radio Interview Pacing**: Do not talk uninterrupted for 15 minutes; check in with the interviewer every 2-3 minutes (*"Does this high-level topology align with your expectations, or should we dive into the storage layer?"*).
2. **Back-of-the-Envelope Math Grounding**: Always calculate QPS, storage requirements, and network bandwidth upfront before drawing boxes.
3. **Explicit Trade-Off Ownership**: There are no perfect solutions in distributed systems, only trade-offs (CAP Theorem, Consistency vs Latency, Memory vs CPU).

---

## 3. High-Signal Execution Workflow

```
[System Design Question: "Design a Global Distributed Rate Limiter"]
                               │
                               ▼
┌──────────────────────────────────────────────────────────────┐
│ Phase 1: Clarify Scope & Functional Requirements (3 min)     │
│ - Global vs Per-User? Hard limit vs Soft limit? Latency SLA? │
└──────────────────────────────┬───────────────────────────────┘
                               ▼
┌──────────────────────────────────────────────────────────────┐
│ Phase 2: Back-of-the-Envelope Capacity Estimation (3 min)    │
│ - 1 Billion Users * 100 req/day = 1.15M QPS. Storage: 20GB.  │
└──────────────────────────────┬───────────────────────────────┘
                               ▼
┌──────────────────────────────────────────────────────────────┐
│ Phase 3: High-Level Architecture & Core Data Flow (10 min)   │
│ - API Gateway -> Redis Cluster (Sliding Window Log / Token)  │
└──────────────────────────────┬───────────────────────────────┘
                               ▼
┌──────────────────────────────────────────────────────────────┐
│ Phase 4: Deep Dive & Grilling Defense (15 min)               │
│ - Race conditions? Multi-region sync? Redis failure mode?    │
└──────────────────────────────────────────────────────────────┘
```

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "interviewer_question": "What happens if your Redis cluster holding the rate limiter counters crashes?",
  "candidate_goal": "Demonstrate Staff-level failure domain resilience"
}
```

### Output Contract
```markdown
# Grilling Defense Strategy: Rate Limiter Failure Mode

## Candidate Response Framework
> *"That's a critical failure domain. In our design, we implement a **Fail-Open with Local Fallback** strategy:*

1. **Local In-Memory Token Bucket Fallback**:
   - Each API Gateway instance maintains a local in-memory token bucket configured for conservative local limits (e.g., max 50 req/sec per instance).
   - If Redis is unreachable within a 15ms circuit-breaker timeout, the gateway falls back to local throttling.

2. **Graceful Degradation (Fail-Open for Critical Services)**:
   - For Tier-1 endpoints (Checkout, Login), we fail open to prevent blocking legitimate revenue transactions.
   - For Tier-2 endpoints (Analytics, Export), we fail closed with a `429 Too Many Requests` retry header.

3. **Redis Cluster Health Recovery**:
   - Redis Sentinel / Cluster auto-failover promotes replica within 3 seconds. The circuit breaker half-opens and resumes distributed sync.*"
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Jumping Directly to Drawing Boxes**: Drawing database diagrams before asking what the required QPS or data retention period is.
- ❌ **Claiming a Solution Has Zero Trade-Offs**: Saying *"This design has 100% availability and strict instant ACID consistency across 5 continents"* (violates CAP theorem).
- ❌ **Defensiveness Under Grilling**: Arguing with the interviewer instead of acknowledging boundary constraints and walking through trade-offs.

---

## 6. Real-World Production Example

```markdown
**System Design Mastery**:
- Candidate answered *"Design URL Shortener"* by deriving 100M URLs/month -> 7-character Base62 hash ($62^7 \approx 3.5 \text{ Trillion}$ combinations) -> Pre-generating key ranges in Zookeeper to avoid distributed collision locks. Scored Top 1% rating.
```
