# Skill: Regular Expressions & Parser Engineering
`id`: `kbcodedev/regex-parser-engineering`  
`category`: `03-software-engineering`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Authoring robust, ReDoS-safe regular expressions, tokenizers, lexers, AST parsers, and structured text extractors.
- **Triggers**: Complex string parsing, log data extraction, custom domain-specific language (DSL) parsing, input sanitization.
- **Prerequisites**: Grammar specification (EBNF or syntax rules), edge-case test suite including malformed inputs.

---

## 2. Core Mental Model & Invariant Principles
1. **ReDoS Immunity (No Catastrophic Backtracking)**: Never write nested quantifiers like `(a+)+$` or overlapping ambiguous groups that cause exponential time complexity.
2. **Regex vs Parser Threshold**: Use Regular Expressions for regular languages (tokens, dates, simple formats). Use Parser Combinators or AST Grammars for recursive/nested structures (HTML, JSON, Math expressions).
3. **Named Capture Groups**: Always use named capture groups (`(?<year>\d{4})`) instead of numeric indices (`match[1]`) for maintainability.

4. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[Raw Text / Custom DSL Format]
               │
               ▼
┌──────────────────────────────┐
│ Complexity Assessment:       │
│ Nested / Recursive?          │
└──────────────┬───────────────┘
         ┌─────┴─────┐
      [No]          [Yes]
         ▼             ▼
┌────────────────┐ ┌───────────────────────────┐
│ Robust ReDoS-  │ │ Lexer / Tokenizer + AST   │
│ Safe Regex     │ │ Recursive Descent Parser  │
└────────┬───────┘ └───────────┬───────────────┘
         └─────────────┬───────┘
                       ▼
┌──────────────────────────────────────────────┐
│ Falsification Test Suite (Malformed inputs)  │
└──────────────────────────────────────────────┘
```

### ReDoS Prevention Checklist
- Avoid `(a|a)+` or `(.*a)+` patterns.
- Keep quantifiers deterministic: use possessive quantifiers `++` or atomic groups `(?>...)` where supported.
- Apply execution timeout caps when running user-supplied regexes.

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
  "target": "Parse SemVer 2.0 version strings (e.g., '1.2.3-alpha.1+build.2026')",
  "requirements": ["Extract major, minor, patch, prerelease, and build metadata", "ReDoS safe"]
}
```

### Output Contract
```typescript
// Production SemVer Parser with Named Groups & ReDoS Protection
export const SEMVER_REGEX = 
  /^v?(?<major>0|[1-9]\d*)\.(?<minor>0|[1-9]\d*)\.(?<patch>0|[1-9]\d*)(?:-(?<prerelease>(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+(?<buildmetadata>[0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

export interface ParsedSemVer {
  major: number;
  minor: number;
  patch: number;
  prerelease?: string;
  buildmetadata?: string;
}

export function parseSemVer(versionString: string): ParsedSemVer | null {
  const match = SEMVER_REGEX.exec(versionString.trim());
  if (!match || !match.groups) return null;

  return {
    major: parseInt(match.groups.major, 10),
    minor: parseInt(match.groups.minor, 10),
    patch: parseInt(match.groups.patch, 10),
    prerelease: match.groups.prerelease,
    buildmetadata: match.groups.buildmetadata
  };
}
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Parsing HTML with Regex**: Attempting to parse nested HTML/XML tags using regex instead of a DOM/AST parser.
- ❌ **Catastrophic Backtracking**: Deploying unanchored regexes with greedy repeating wildcards like `.*` to production servers.
- ❌ **Magic Number Indexing**: Accessing `match[4]` in application code, breaking silently whenever the regex pattern adds a new group.

---

## 6. Real-World Production Example

```markdown
**Parser Engineering**: Building a Markdown Frontmatter Extractor.
- Lexer: Identifies opening `---` and closing `---` delimiters at line start.
- Parser: Parses intermediate YAML into structured key-value maps while extracting the trailing markdown body cleanly without destructive regex recursion.
```
