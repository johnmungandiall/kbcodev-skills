# Skill: Paul Graham Founder Intuition & Startup Invariants
`id`: `kbcodedev/paul-graham-founder-intuition`  
`category`: `18-yc-tech-leaders-frameworks`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Evaluating startup ideas, overcoming "Schlep Blindness", finding organic startup problems, navigating founder psychology, and distilling core product value.
- **Triggers**: Startup ideation, evaluating feature complexity, pitch refinement, founder burnout, product pivot debates.
- **Prerequisites**: Product hypothesis, founder background.

---

## 2. Core Mental Model & Invariant Principles
1. **Live in the Future, Then Build What's Missing**: The best startup ideas are not conceived by brainstorming "business ideas"; they emerge organically when you work at the bleeding edge of technology and notice something that ought to exist.
2. **Schlep Blindness (Overcoming Tedious Problems)**: The most valuable startup opportunities are hidden behind tedious, unglamorous, difficult tasks ("schleps") that everyone else subconsciously avoids (e.g. Stripe solving payment banking rails).
3. **100 People Who Love You > 100,000 Who Kinda Like You**: It is vastly easier to expand from 100 passionate, fanatic users to a million than to convert 100,000 lukewarm users into passionate advocates.

4. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[Startup Idea / Product Opportunity]
                 │
                 ▼
┌────────────────────────────────┐
│ Phase 1: The Schlep Test       │ ── Is this idea hard/tedious enough that others avoid it?
└────────────────┬───────────────┘
                 ▼
┌────────────────────────────────┐
│ Phase 2: Organic Need Proof    │ ── Do the founders personally desperately need this tool?
└────────────────┬───────────────┘
                 ▼
┌────────────────────────────────┐
│ Phase 3: The 100 Fanatics Goal │ ── Who are the exact 100 users who will use this daily?
└────────────────┬───────────────┘
                 ▼
┌────────────────────────────────┐
│ Phase 4: Ruthless Simplification ── Strip everything until only the core magic remains
└────────────────────────────────┘
```

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "idea": "An AI platform that helps enterprise marketing teams schedule social media posts and manage influencer relationships",
  "founder_concern": "It feels generic and we are competing with 50 existing social tools"
}
```

### Output Contract
```markdown
# Paul Graham Essay-Style Strategic Evaluation

## 1. The Diagnosis: Made-Up Idea / Sitcom Startup
This sounds like a "sitcom startup"—an idea that sounds plausible in a script, but no specific human is frantically searching for right now. You are competing in an overcrowded space because it avoids the hard schleps.

## 2. The Schlep Pivot
Where is the real tedious, unglamorous pain in enterprise social marketing that nobody wants to touch?
- **The Schlep**: Calculating exact ROI and attribution across 500 creator contracts and automated wire payouts.
- **The Pivot**: Build automated creator contract generation and instant milestone payouts tied to verified view counts.

## 3. The 100 Users Strategy
- Find 10 marketing agencies who currently spend 20 hours/week manually verifying Instagram stories and sending manual PayPal transfers.
- Handle their creator payouts manually for the next 2 weeks to understand every edge case.
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Sitcom Startup Ideas**: Inventing problems you don't personally have and don't understand, hoping someone else wants it.
- ❌ **Schlep Avoidance**: Choosing an easy consumer app idea over a hard B2B infrastructure problem because the infrastructure problem sounds like hard work.
- ❌ **Premature Optimization of Scale**: Worrying about how the product will work for 10 million users when you don't yet have 10.

---

## 6. Real-World Production Example

```markdown
**Overcoming Schlep Blindness**:
- Founders avoided building API banking integrations because dealing with legacy banks was painful.
- Embracing the schlep resulted in Stripe—a $70B+ company built on making the hardest unglamorous problem seamless for developers.
```
