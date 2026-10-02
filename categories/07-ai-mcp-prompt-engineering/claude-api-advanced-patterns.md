# Skill: Anthropic Claude API Advanced Patterns & Prompt Caching
`id`: `kbcodedev/claude-api-advanced-patterns`  
`category`: `07-ai-mcp-prompt-engineering`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Building high-performance, cost-effective LLM integrations using the Anthropic Claude API. Model families and snapshot IDs change often — resolve the current ID from Anthropic's models overview (or the project's own pinned config) before use, and treat the IDs in the examples below as placeholders rather than fixed values.
- **Triggers**: Prompt caching optimization, tool-use schema authoring, streaming responses, token budget controls, extended thinking mode.
- **Prerequisites**: Anthropic API Key (`@anthropic-ai/sdk` or Python `anthropic`), schema definitions.

---

## 2. Core Mental Model & Invariant Principles
1. **Prompt Caching Discipline**: Place large, static system prompts, tool schemas, and reference knowledge at the top marked with `"cache_control": {"type": "ephemeral"}` to achieve up to 90% cost savings and 85% latency reduction.
2. **Strict Tool Calling Schemas**: Define unambiguous JSON Schema parameter definitions with descriptive `description` fields and complete `required` arrays.
3. **Thinking Budget Allocation**: Allocate explicit thinking budgets (e.g. `thinking: { type: 'enabled', budget_tokens: 2048 }`) for complex mathematical, architectural, or multi-hop reasoning tasks.

4. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[System Instructions + KB Docs + Tool Schemas]
                     │
                     ▼
┌─────────────────────────────────────────────┐
│ Step 1: Cache Breakpoint Placement          │ ── Add cache_control to static system prompt
└────────────────────┬────────────────────────┘
                     ▼
┌─────────────────────────────────────────────┐
│ Step 2: Tool Definitions (JSON Schema)      │ ── Strict properties, types, and descriptions
└────────────────────┬────────────────────────┘
                     ▼
┌─────────────────────────────────────────────┐
│ Step 3: Stream Handling & Thinking Decoder  │ ── Stream delta chunks, parse thinking blocks
└────────────────────┬────────────────────────┘
                     ▼
┌─────────────────────────────────────────────┐
│ Step 4: Tool Call Execution & Observation   │ ── Send tool_result back with matching tool_use_id
└─────────────────────────────────────────────┘
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
  "model": "claude-sonnet-5-5",
  "tools": ["query_database", "send_notification"],
  "cache_strategy": "System prompt + Reference schema cached"
}
```

### Output Contract (TypeScript & Python SDKs)

#### 1. TypeScript Implementation with Ephemeral Caching
```typescript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

export async function runAgentStep(userMessage: string, history: Anthropic.MessageParam[]) {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-5-5', // resolve the current ID before use — see models overview
    max_tokens: 4096,
    system: [
      {
        type: 'text',
        text: 'You are an enterprise DBA specialist. Use provided tools to analyze query plans.',
        cache_control: { type: 'ephemeral' } // 90% discount on cache hits
      }
    ],
    tools: [
      {
        name: 'query_database',
        description: 'Execute read-only SQL queries against the replica database.',
        input_schema: {
          type: 'object',
          properties: {
            sql: { type: 'string', description: 'The SELECT query to execute' },
            timeout_ms: { type: 'number', description: 'Query timeout limit' }
          },
          required: ['sql']
        }
      }
    ],
    messages: [
      ...history,
      { role: 'user', content: userMessage }
    ]
  });

  return response;
}
```

#### 2. Python Implementation with Streaming & Prompt Caching
```python
import os
import anthropic

client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

def run_agent_step_python(user_prompt: str, messages: list):
    response = client.messages.create(
        model="claude-sonnet-5-5",  # resolve the current ID before use
        max_tokens=4096,
        system=[
            {
                "type": "text",
                "text": "You are a senior system architect agent.",
                "cache_control": {"type": "ephemeral"}
            }
        ],
        tools=[
            {
                "name": "read_file",
                "description": "Read file contents from workspace.",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "path": {"type": "string", "description": "Relative file path"}
                    },
                    "required": ["path"]
                }
            }
        ],
        messages=messages + [{"role": "user", "content": user_prompt}]
    )
    return response
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Dynamic Content Before Cached Blocks**: Placing dynamic timestamps or user session IDs before cached system prompts, busting prompt cache on every turn.
- ❌ **Vague Tool Schemas**: Defining parameters with no descriptions (`"param1": { "type": "string" }`), causing the model to hallucinate incorrect inputs.
- ❌ **Missing `tool_result` IDs**: Returning tool responses with mismatched or missing `tool_use_id`s, breaking API protocol validation.

---

## 6. Real-World Production Example

```markdown
**Prompt Caching ROI**:
- Ingested a 120k token technical API documentation corpus into system prompt.
- With Prompt Caching: First turn cost $0.36; subsequent turns cost $0.036 (90% reduction) with response latency dropping from 14s to 1.8s.
```
