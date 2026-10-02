# Skill: Humanizer Voice & De-AI Writing Engine
`id`: `kbcodedev/humanizer-de-ai-voice`  
`category`: `10-communication-humanizer-career`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Rewriting AI-generated technical prose, documentation, marketing copy, blog posts, or announcements to eliminate robotic clichés, formulaic structures, and synthetic buzzwords, producing authentic, crisp, natural human voice.
- **Triggers**: Content humanization, de-AI rewriting, eliminating generic AI boilerplate, natural tone optimization.
- **Prerequisites**: Source draft text, target tone (conversational, executive, technical).

---

## 2. Core Mental Model & Invariant Principles
1. **Eliminate Banned AI Clichés**: Ban synthetic buzzwords: *"delve", "tapestry", "revolutionize", "game-changer", "unleash", "testament to", "beacon of", "in conclusion", "it is important to remember"*.
2. **Vary Sentence Cadence (Burstiness)**: Human writing alternates naturally between short punchy sentences and longer descriptive thoughts. AI writing tends to be uniformly medium-length.
3. **Show, Don't Preach**: Replace abstract adjectives (*"extremely powerful and robust"*) with concrete numbers and facts (*"processes 50,000 requests/sec with 4ms latency"*).

4. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[Synthetic / Robotic AI Draft]
               │
               ▼
┌──────────────────────────────┐
│ Step 1: Scan & Strip AI Fluff│ ── Purge "delve", "tapestry", generic metaphors
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ Step 2: Inject Concrete Facts│ ── Replace adjectives with exact metrics & examples
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ Step 3: Vary Sentence Rhythm │ ── Mix 4-word punchlines with 18-word explanations
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ Step 4: Human Authenticity   │ ── Natural transitions, active voice, zero fluff
└──────────────────────────────┘
```

---

## 4. Input / Output Contracts

### Input Contract (Synthetic AI Draft)
```markdown
In the fast-paced and ever-evolving landscape of modern web development, it is crucial to delve into the tapestry of caching strategies. By unlocking the power of Redis, developers can revolutionize their database performance. This serves as a testament to the transformative potential of in-memory key-value stores.
```

### Output Contract (Humanized Rewrite)
```markdown
Database queries are slow; memory is fast. Placing Redis in front of PostgreSQL drops average query latency from 45ms to 1.8ms. That 25x speedup keeps your API snappy when traffic spikes during flash sales.
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **The "In conclusion..." Closing Formula**: Ending every paragraph with a generic recap summarizing what was just said.
- ❌ **Passive Voice Overload**: Writing *"The optimization was executed by the team"* instead of *"The team optimized the query"*.
- ❌ **Excessive Semicolons and Colon Lists**: Formatting every single sentence into a multi-tiered colon list instead of natural prose.

---

## 6. Real-World Production Example

```markdown
**Blog Post Humanization**:
- Before: 800 words of generic AI praise about cloud containers with 0 concrete examples.
- After: 320 words detailing exact memory allocations, Docker multi-stage caching rules, and a 93% image size reduction. Engagement and reader retention doubled.
```
