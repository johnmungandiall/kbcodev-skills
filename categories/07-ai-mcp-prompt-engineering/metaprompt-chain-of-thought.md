# Skill: Metaprompting & Chain-of-Thought Engineering
`id`: `kbcodedev/metaprompt-chain-of-thought`  
`category`: `07-ai-mcp-prompt-engineering`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Authoring foundational system prompts, dynamic prompt generators, structured XML cognitive scaffolding, and multi-step Chain-of-Thought (CoT) reasoning guides.
- **Triggers**: Authoring new agent instructions, designing complex reasoning workflows, eliminating model ambiguity and hallucination.
- **Prerequisites**: Clear task objectives, operational constraints, output format specifications.

---

## 2. Core Mental Model & Invariant Principles
1. **XML Semantic Scaffolding**: Use clear, well-structured XML tags (`<instructions>`, `<rules>`, `<context>`, `<examples>`, `<thinking>`) to delineate distinct semantic domains for LLMs.
2. **Thinking Before Acting**: Require the model to reason through constraints, dependencies, and potential failure modes in a dedicated scratchpad before generating final answers.
3. **Negative Constraint Density**: State what the model MUST NOT do as clearly as what it should do, preventing common edge-case drift.

---

## 3. High-Signal Execution Workflow

```
[Raw Goal & Requirements]
            │
            ▼
┌───────────────────────────┐
│ Phase 1: Context & Role   │ ── Define persona, mission, and operational scope
└───────────┬───────────────┘
            ▼
┌───────────────────────────┐
│ Phase 2: Invariant Rules  │ ── Immutable behavioral rules and negative constraints
└───────────┬───────────────┘
            ▼
┌───────────────────────────┐
│ Phase 3: Cognitive Flow   │ ── Step-by-step thinking & decision requirements
└───────────┬───────────────┘
            ▼
┌───────────────────────────┐
│ Phase 4: Few-Shot Golden  │ ── Input -> Expected Structured Output demonstrations
│          Examples         │
└───────────────────────────┘
```

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "target_agent": "SQL DBA Query Optimizer",
  "goal": "Analyze query performance, suggest indices, rewrite slow SQL",
  "constraints": ["Never suggest full table rewrites on >10M rows", "Always provide EXPLAIN ANALYZE proof"]
}
```

### Output Contract
```markdown
You are an expert PostgreSQL Database Administrator and Performance Engineer.

<mission>
Your objective is to diagnose slow queries, eliminate sequential scans, and design high-performance indexing strategies without causing production table locks.
</mission>

<rules>
1. Always analyze execution plans with EXPLAIN (ANALYZE, BUFFERS).
2. NEVER propose synchronous `CREATE INDEX` on live tables; ALWAYS specify `CREATE INDEX CONCURRENTLY`.
3. Do not suggest adding columns with volatile defaults without non-blocking DDL staging.
4. Output queries strictly formatted in valid, uppercase SQL.
</rules>

<reasoning_process>
Before generating SQL suggestions, perform the following steps inside <thinking> tags:
1. Identify the scan type (Seq Scan vs Index Scan vs Bitmap Heap Scan).
2. Calculate the buffer hit ratio and total execution time.
3. Determine whether a Single Column Index, Compound Index, or Partial Index is most optimal.
4. Verify whether proposed indices satisfy prefix ordering rules.
</reasoning_process>

<output_format>
Present your optimization findings structured as:
1. **Root Cause Analysis**: One-line bottleneck explanation.
2. **Optimized SQL / Index DDL**: Exact, copy-pasteable SQL.
3. **Performance Impact**: Expected speedup and buffer reduction.
</output_format>
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Conversational Prompt Fluff**: Starting prompts with *"You are a helpful and friendly assistant who loves coding"* which adds zero operational signal.
- ❌ **Ambiguous Output Instructions**: Telling the model to *"output nicely"* instead of specifying exact JSON/Markdown schemas.
- ❌ **Contradictory Instructions**: Telling the agent to be *"extremely thorough and verbose"* while also asking for *"under 50 words"*.

---

## 6. Real-World Production Example

```markdown
**Metaprompting Efficacy**:
- Before: Generic prompt produced conversational explanations mixed with unrunnable code snippets.
- After: XML-structured metaprompt produced 100% deterministic JSON outputs that parsed directly into automated CI pipelines with 0% schema validation errors.
```
