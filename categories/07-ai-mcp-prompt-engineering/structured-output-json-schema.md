# Skill: Structured Output & JSON Schema Validation Engine
`id`: `kbcodedev/structured-output-json-schema`  
`category`: `07-ai-mcp-prompt-engineering`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Enforcing guaranteed, strictly valid JSON output from LLMs conforming to JSON Schema (Draft 7), auto-repairing malformed JSON strings, and parsing structured payloads.
- **Triggers**: Model-to-code pipelines, automated data extraction, strict API payload generation, structured reasoning extraction.
- **Prerequisites**: JSON Schema (Draft 7) definition, parser/validator tool (`structured_output` or Zod/AJV).

---

## 2. Core Mental Model & Invariant Principles
1. **Schema Strictness (`additionalProperties: false`)**: Always explicitly constrain schemas to prevent models from inventing unexpected fields.
2. **Fences and Prose Stripping**: Real-world LLMs often prefix outputs with prose ("Here is the JSON:"). Robust parsers must automatically strip markdown ` ```json ` fences and leading text.
3. **Self-Correcting Repair Loops**: If schema validation fails, feed the exact JSON path and validation error back to the model for a targeted 1-step repair.

4. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[Raw Model Response Text]
            │
            ▼
┌───────────────────────────┐
│ Step 1: Strip Prose &     │ ── Remove markdown fences and conversational prefixes
│         Markdown Fences   │
└───────────┬───────────────┘
            ▼
┌───────────────────────────┐
│ Step 2: JSON Parse &      │ ── JSON.parse() + JSON Schema Draft 7 Validation
│         Schema Validate   │
└───────────┬───────────────┘
            ├──────────────────────────┐
        [Valid]                    [Invalid]
            ▼                          ▼
┌───────────────────────────┐ ┌────────────────────────────────────────┐
│ Typed Data Hand-off       │ │ Self-Correction: Emit exact error path │
└───────────────────────────┘ └────────────────────────────────────────┘
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
  "schema": {
    "type": "object",
    "properties": {
      "task_name": { "type": "string" },
      "priority": { "type": "string", "enum": ["low", "medium", "high"] },
      "estimated_hours": { "type": "number", "minimum": 0 }
    },
    "required": ["task_name", "priority", "estimated_hours"],
    "additionalProperties": false
  },
  "raw_text": "Here is the result:\n```json\n{\n  \"task_name\": \"Implement OAuth\",\n  \"priority\": \"high\",\n  \"estimated_hours\": 4.5\n}\n```"
}
```

### Output Contract
```json
{
  "valid": true,
  "data": {
    "task_name": "Implement OAuth",
    "priority": "high",
    "estimated_hours": 4.5
  },
  "errors": []
}
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Missing `required` Array**: Defining property schemas without listing them in `required`, allowing models to return empty `{}` objects.
- ❌ **Unsanitized Trailing Commas**: Failing to sanitize trailing commas (`{ "a": 1, }`) which cause standard `JSON.parse` to throw syntax errors.
- ❌ **Blind Error Retries**: Re-prompting the model with generic "Your JSON was wrong" without providing the specific path and validation constraint that failed.

---

## 6. Real-World Production Example

```markdown
**Automated JSON Repair**:
- Model output: ````json\n{\n  "status": "success",\n  "code": 200,\n}\n```` (trailing comma syntax error).
- Structured Output Parser: Stripped fences, normalized trailing comma, validated against schema, and returned typed object in 1.2ms without wasting a round-trip LLM retry.
```
