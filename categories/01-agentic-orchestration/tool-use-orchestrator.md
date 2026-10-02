# Skill: Tool Use & API Integration Orchestrator
`id`: `kbcodedev/tool-use-orchestrator`  
`category`: `01-agentic-orchestration`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Efficiently dispatching, batching, rate-limiting, and error-handling tool invocations and external API integrations.
- **Triggers**: Multi-file read/search batches, structured JSON tool calls, external REST/MCP tool communications.
- **Prerequisites**: Tool catalog schema definition, rate-limit / token budget parameters, valid parameter structures.

---

## 2. Core Mental Model & Invariant Principles
1. **Dynamic Batch Width**: Batch width is an emergent decision based on dependency graphs and context capacity—never a static constant.
2. **Three-Question Batch Test**: Include tool calls together ONLY if: (a) Ready now? (b) Independent? (c) Serves the same information need?
3. **Payload Sanitization**: Pre-validate parameter shapes, strip unneeded raw verbosity, and redact credentials prior to dispatch.

4. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[Tool Request Needs]
         │
         ▼
┌──────────────────┐
│ Three-Question   │ ── (1) Ready? (2) Independent? (3) Same Info Need?
│ Batch Filter     │
└────────┬─────────┘
         ├──────────────────────────────┐
     [All Yes]                       [Any No]
         ▼                              ▼
┌──────────────────┐           ┌──────────────────┐
│ Parallel Batch   │           │ Serial Single    │
│ Dispatch (1 Turn)│           │ Call Execution   │
└────────┬─────────┘           └────────┬─────────┘
         └──────────────┬───────────────┘
                        ▼
┌──────────────────────────────────────┐
│ Tool Response Ingestion & Redaction  │ ── Strip noise, extract key facts
└──────────────────────────────────────┘
```

### Phase 1: Tool Selection & Parameter Validation
- Select the minimal, most direct tool for the task.
- Ensure all required arguments exist and conform to the schema.
- Validate paths are absolute/relative as expected and symbols exist.

### Phase 2: Batch Optimization & Dispatch
- Aggregate independent read/search/command calls into a single response round.
- Respect rate limit budgets (`/llm_rpm`, `/llm_mtpm`) by reducing batch width if token headroom is constrained.
- Maintain serial dispatch for stateful mutations (e.g. browser navigation).

### Phase 3: Output Processing & Agent Steering
- Parse raw outputs, handle error exit codes gracefully.
- Extract high-signal facts and prevent large data dumps from overflowing context.

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "operations": [
    { "tool": "search_code", "parameters": { "pattern": "JWT_SECRET", "path": "src/" } },
    { "tool": "search_code", "parameters": { "pattern": "TOKEN_EXPIRY", "path": "src/" } }
  ],
  "batch_mode": "parallel"
}
```

### Output Contract (With Production Token Bucket Rate Limiter)

#### 1. Structured Tool Output Spec
```json
{
  "batch_size": 2,
  "status": "success",
  "results": [
    { "tool": "search_code", "matches": 3, "summary": "Found JWT_SECRET in config.py:12, auth.py:4" },
    { "tool": "search_code", "matches": 1, "summary": "Found TOKEN_EXPIRY in config.py:15" }
  ]
}
```

#### 2. Production Token Bucket Rate Limiting Engine (TypeScript)
```typescript
export class TokenBucketLimiter {
  private tokens: number;
  private lastRefillTimestamp: number;

  constructor(
    private readonly capacity: number,       // Max burst requests allowed
    private readonly refillRatePerSecond: number // Token refill rate
  ) {
    this.tokens = capacity;
    this.lastRefillTimestamp = Date.now();
  }

  public async acquire(cost: number = 1): Promise<void> {
    while (true) {
      this.refill();
      if (this.tokens >= cost) {
        this.tokens -= cost;
        return;
      }
      const needed = cost - this.tokens;
      const waitTimeMs = Math.ceil((needed / this.refillRatePerSecond) * 1000);
      await new Promise((resolve) => setTimeout(resolve, Math.max(waitTimeMs, 50)));
    }
  }

  private refill(): void {
    const now = Date.now();
    const elapsedSeconds = (now - this.lastRefillTimestamp) / 1000;
    const addedTokens = elapsedSeconds * this.refillRatePerSecond;
    this.tokens = Math.min(this.capacity, this.tokens + addedTokens);
    this.lastRefillTimestamp = now;
  }
}
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Serial Read Crawling**: Reading 10 files in 10 sequential round-trips when all 10 are known and ready simultaneously.
- ❌ **Padded Batches**: Adding unrelated tool calls to a turn simply to reach an arbitrary batch number.
- ❌ **Raw Secret Leaks**: Echoing real API keys or connection strings in tool outputs or logging parameters.

---

## 6. Real-World Production Example

```markdown
**Task**: Investigate where `getUserSession` is defined and where it is imported across 3 microservices.

**Optimized Dispatch (1 Turn, 3 Parallel Searches)**:
1. `search_code(pattern="export function getUserSession", path="services/auth")`
2. `search_code(pattern="import { getUserSession }", path="services/gateway")`
3. `search_code(pattern="import { getUserSession }", path="services/billing")`

**Result**: All 3 searches return concurrently in 0.4s. One turn used instead of three.
```
