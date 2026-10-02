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

---

## 3. High-Signal Execution Workflow

```
[Raw Model Response Text]
            │
            ▼
┌───────────────────────────┐
│ Step 1: Strip Prose &     │ ── Remove ```json fences and conversational prefixes
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
