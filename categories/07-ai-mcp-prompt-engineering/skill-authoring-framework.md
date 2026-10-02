# Skill: Agent Skill Authoring & Benchmarking Framework
`id`: `kbcodedev/skill-authoring-framework`  
`category`: `07-ai-mcp-prompt-engineering`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Designing, writing, benchmarking, packaging, and evaluating reusable AI agent skills for kbcode, Claude Code, Cursor, and custom agent ecosystems.
- **Triggers**: Creating new agent skills, updating outdated prompt templates, standardizing developer workflows into reusable skills.
- **Prerequisites**: Clear domain workflow knowledge, input/output specifications, validation test cases.

---

## 2. Core Mental Model & Invariant Principles
1. **High Signal, Zero Slop**: Eliminate filler adjectives, generic pleasantries, and redundant instructions. Focus purely on actionable, deterministic execution logic.
2. **Contract-Driven Design**: Every skill must explicitly define its Trigger conditions, Input Contract, Output Contract, and Anti-Patterns.
3. **Verifiable Test Harness**: A skill is incomplete until it has been tested against at least 3 realistic evaluation prompts and proven to produce deterministic results.

---

## 3. High-Signal Execution Workflow

```
[Domain Expertise / Workflow Need]
                 │
                 ▼
┌────────────────────────────────┐
│ Step 1: Define Metadata &      │ ── Unique ID, Category, Triggers, Prerequisites
│         Trigger Boundaries     │
└────────────────┬───────────────┘
                 ▼
┌────────────────────────────────┐
│ Step 2: Formulate Invariant    │ ── 3 core non-negotiable architectural principles
│         Principles             │
└────────────────┬───────────────┘
                 ▼
┌────────────────────────────────┐
│ Step 3: Author High-Signal     │ ── Phase 1 through Phase 4 actionable pipeline
│         Execution Steps        │
└────────────────┬───────────────┘
                 ▼
┌────────────────────────────────┐
│ Step 4: Define Strict Schema   │ ── JSON Input & Output Contracts
│         Contracts              │
└────────────────┬───────────────┘
                 ▼
┌────────────────────────────────┐
│ Step 5: Benchmark & Falsify    │ ── Run through Agent Grader with real test cases
└────────────────────────────────┘
```

---

## 4. Standard Skill Template (Canonical Spec)

```markdown
# Skill: <Title>
`id`: `kbcodedev/<skill-id>`  
`category`: `<category-name>`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: ...
- **Triggers**: ...
- **Prerequisites**: ...

---

## 2. Core Mental Model & Invariant Principles
1. ...
2. ...
3. ...

---

## 3. High-Signal Execution Workflow
### Phase 1: ...
### Phase 2: ...
### Phase 3: ...

---

## 4. Input / Output Contracts
### Input Contract
### Output Contract

---

## 5. Anti-Patterns & Critical Traps
- ❌ ...
- ❌ ...

---

## 6. Real-World Production Example
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Unstructured Free-Form Text**: Writing skills as rambling prose paragraphs without clear phases or contracts.
- ❌ **Missing Trigger Boundaries**: Creating skills that trigger on everything, polluting agent context on unrelated queries.
- ❌ **Untested Skills**: Publishing skills without running benchmark test cases to verify agent adherence.

---

## 6. Real-World Production Example

```markdown
**Skill Lifecycle**:
- Authored `kbcodedev/zero-downtime-ship-pipeline`.
- Benchmarked on 5 simulated deployment tasks.
- Verified: Agent correctly checked DB backward compatibility and refused to drop live columns without staging.
```
