# Skill: Google XYZ Impact Bullet Formulator
`id`: `kbcodedev/google-xyz-impact-bullets`  
`category`: `10-communication-humanizer-career`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Formulating high-impact, executive-level resume bullets, performance self-evaluations, promotion packets, and project accomplishment summaries.
- **Triggers**: Resume bullet polishing, quarterly engineering reviews, annual promotion document authoring.
- **Prerequisites**: Raw task or project description, estimated or exact metrics (latency, revenue, cost, scale).

---

## 2. Core Mental Model & Invariant Principles
1. **The Google XYZ Formula**:
   $$\text{Accomplished } [X] \text{ as measured by } [Y] \text{ by doing } [Z]$$
2. **Action Verb Supremacy**: Begin every bullet with a strong, definitive past-tense action verb (*Architected, Spearheaded, Engineered, Overhauled, Eliminated, Automated*). Never start with *"Helped"*, *"Worked on"*, or *"Assisted"*.
3. **Triple-Metric Density**: Combine technical metrics (latency, throughput), financial metrics (cost savings, revenue), and operational metrics (deployment frequency, MTTR).

---

## 3. High-Signal Execution Workflow

```
[Raw Engineering Task / Project Description]
                     │
                     ▼
┌────────────────────────────────────────────┐
│ Step 1: Identify Accomplishment [X]        │ ── What was built, fixed, or delivered?
└────────────────────┬───────────────────────┘
                     ▼
┌────────────────────────────────────────────┐
│ Step 2: Quantify Measurement [Y]           │ ── What metric moved? (% speedup, $ saved)
└────────────────────┬───────────────────────┘
                     ▼
┌────────────────────────────────────────────┐
│ Step 3: Detail Technical Action [Z]        │ ── What specific technology/architecture was used?
└────────────────────┬───────────────────────┘
                     ▼
┌────────────────────────────────────────────┐
│ Step 4: Synthesize Golden XYZ Bullet       │ ── Polish with high-impact power verbs
└────────────────────────────────────────────┘
```

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "task": "I rewrote the search service in Go because Python was slow. We saved server money.",
  "metrics": "Latency dropped from 300ms to 25ms. Server count went from 50 to 8."
}
```

### Output Contract
```markdown
# Formulated Google XYZ Bullets

- **Option 1 (Performance & Cost Focus - Recommended)**:
  > *Overhauled core search indexing service, reducing p99 query latency by 91% (from 300ms to 25ms) and saving $72k annually by migrating from Python to Go and deploying on a 6-node Kubernetes cluster.*

- **Option 2 (Scale & Throughput Focus)**:
  > *Scaled search query capacity by 12x to handle 100,000 req/sec during peak traffic events by architecting an in-memory inverted index in Go with zero memory allocation hot paths.*
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Weak Action Verbs**: Using passive phrases like *"Was responsible for..."* or *"Participated in meetings about..."*.
- ❌ **Zero Numbers or Metrics**: Writing bullets with no percentages, dollar amounts, time savings, or scale quantities.
- ❌ **Metric Without Method**: Claiming *"Increased revenue by 50%"* without explaining the technical mechanism $[Z]$ used to achieve it.

---

## 6. Real-World Production Example

```markdown
**Bullet Transformations**:
- Weak: *"Fixed bugs in CI/CD pipeline."*
- Golden XYZ: *"Accelerated pull-request verification cycles by 88% (from 7m40s to 52s) by engineering a parallel GitHub Actions matrix pipeline with multi-tier lockfile caching."*
```
