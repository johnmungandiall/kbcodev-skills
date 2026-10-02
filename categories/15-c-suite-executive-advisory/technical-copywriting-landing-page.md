# Skill: Technical Copywriting & Developer Landing Page Engine
`id`: `kbcodedev/technical-copywriting-landing-page`  
`category`: `15-c-suite-executive-advisory`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Writing high-converting, developer-focused landing page copy, Hero headlines, feature benefit cards, comparison matrices, and technical documentation headers.
- **Triggers**: Developer tool landing page redesign, conversion rate drop-offs, product messaging repositioning.
- **Prerequisites**: Target developer persona, product differentiation advantages.

---

## 2. Core Mental Model & Invariant Principles
1. **Developers Hate Marketing Fluff**: Never use vague corporate buzzwords (*"Accelerate your digital synergy"*). State the exact technical capability and benefit in plain words (*"Deploy zero-downtime PostgreSQL migrations in 1 click"*).
2. **The 5-Second Hero Rule**: A visiting developer must understand within 5 seconds: (1) What it is, (2) What problem it eliminates, and (3) The exact terminal command to install it.
3. **Show Real Code in the Hero**: Replace generic stock photos or 3D cartoon illustrations with real, copyable syntax-highlighted code snippets or interactive terminal animations.

4. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[Developer Tool Capability / Value Proposition]
                       │
                       ▼
┌──────────────────────────────────────────────┐
│ Phase 1: The 5-Second Hero Section           │ ── Clear H1 + Subheading + 1-line curl install
└──────────────────────┬───────────────────────┘
                       ▼
┌──────────────────────────────────────────────┐
│ Phase 2: The "Old Way vs New Way" Comparison │ ── Painful legacy steps vs 1-line solution
└──────────────────────┬───────────────────────┘
                       ▼
┌──────────────────────────────────────────────┐
│ Phase 3: 3 Concrete Architecture Pillars     │ ── Fast, Secure, Extensible with code snippets
└──────────────────────┬───────────────────────┘
                       ▼
┌──────────────────────────────────────────────┐
│ Phase 4: Social Proof & Open Source Stats    │ ── GitHub Stars, SOC2 badges, enterprise users
└──────────────────────────────────────────────┘
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
  "product": "Distributed Database Sharding Proxy",
  "audience": "Staff Backend Engineers & DBAs",
  "pain": "Manual Postgres sharding takes 6 months of custom application code"
}
```

### Output Contract
```markdown
# Developer Landing Page Copy

## HERO SECTION
- **Badge**: 🚀 Open Source v2.0 Released
- **Headline (H1)**: Scale PostgreSQL to 1,000,000 QPS Without Changing a Line of Code
- **Subheadline**: An intelligent database proxy that handles transparent sharding, connection pooling, and distributed query routing out of the box.
- **Terminal CTA**:
  ```bash
  npm install -g @db-proxy/cli && db-proxy init
  ```
- **Secondary CTA**: `View on GitHub (★ 14.2k)` | `Read Documentation`

---

## THE PROBLEM (OLD WAY vs NEW WAY)

| Legacy Manual Sharding | With DB-Proxy |
|---|---|
| ❌ 6 months of rewriting application ORM queries | ✅ Zero application code changes; connect via standard port 5432 |
| ❌ Complex multi-node failure recovery scripts | ✅ Automated master failover with < 2-second recovery |
| ❌ Expensive bespoke enterprise licensing | ✅ 100% open-source Apache 2.0 license |

---

## 3 ARCHITECTURAL PILLARS
1. **Sub-Millisecond Routing**: Written in Rust for maximum memory efficiency with < 0.2ms latency overhead.
2. **ACID Distributed Transactions**: Two-Phase Commit (2PC) engine guarantees serializable consistency across all database shards.
3. **Built-in PgBouncer Pooling**: Handles 50,000 concurrent serverless connections without exhausting database RAM.
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Marketing Slogans Without Substance**: Headlines like *"The Future of Development is Here"* that tell the user nothing about what the product actually does.
- ❌ **Hiding Pricing Behind "Contact Sales" for Dev Tools**: Forcing developers to schedule a 30-minute sales call before seeing transparent pricing.
- ❌ **No Interactive Code or CLI Command**: Landing pages with zero code snippets, leaving engineers skeptical of the tool's capabilities.

---

## 6. Real-World Production Example

```markdown
**Landing Page Copy Overhaul**:
- Replaced corporate marketing headline with: *"Automated SQLite replication to S3 in 1 line of Go"*.
- Developer sign-up conversion rate increased from 2.1% to 8.4% in 7 days.
```
