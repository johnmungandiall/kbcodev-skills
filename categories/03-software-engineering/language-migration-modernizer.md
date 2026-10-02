# Skill: Language Migration & Idiomatic Modernizer
`id`: `kbcodedev/language-migration-modernizer`  
`category`: `03-software-engineering`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Migrating codebases between programming languages (e.g. JavaScript to TypeScript, Python to Rust/Go, Java to Kotlin) or upgrading legacy language syntax to modern standards.
- **Triggers**: Type safety adoption, performance-critical rewrite, framework version upgrades (e.g. Python 2 to 3, CommonJS to ESM, React Class to Hooks).
- **Prerequisites**: Source and target language specifications, idiomatic standard libraries, cross-language test verification harness.

---

## 2. Core Mental Model & Invariant Principles
1. **Idiomatic Translation, Not Word-for-Word Transliteration**: Write idiomatic target code (e.g. Go channels/goroutines or Rust `Result<T, E>`), not Java written in Go syntax.
2. **Strict Type Rigor**: When migrating to typed languages, eliminate `any`/`unknown` escapes; define precise algebraic data types (enums, union types, interfaces).
3. **Equivalence Test Gates**: Ensure unit test fixtures produce identical deterministic outputs across both the legacy and migrated implementations.

---

## 3. High-Signal Execution Workflow

```
[Legacy Source Code (e.g. Python / JS)]
                  │
                  ▼
┌─────────────────────────────────┐
│ Phase 1: Semantic AST Analysis  │ ── Extract data structures, invariants, side-effects
└─────────────────┬───────────────┘
                  ▼
┌─────────────────────────────────┐
│ Phase 2: Idiomatic Target       │ ── Map concepts to target language constructs
│          Mapping                │    (e.g., Python dict -> Go struct with json tags)
└─────────────────┬───────────────┘
                  ▼
┌─────────────────────────────────┐
│ Phase 3: Synthesize Modern Code │ ── Strict types, modern async/await, memory safety
└─────────────────┬───────────────┘
                  ▼
┌─────────────────────────────────┐
│ Phase 4: Cross-Language Testing │ ── Validate identical input/output parity
└─────────────────────────────────┘
```

### Common Migration Mapping Matrix

| Source Paradigm | Modern Target Equivalent |
|---|---|
| Python `dict` / JS untyped object | TypeScript `interface` / Go `struct` / Rust `struct` |
| JavaScript `null` / `undefined` | Rust `Option<T>` / Swift `Optional<T>` / TS strict null checks |
| Python Exceptions for control flow | Go `if err != nil` / Rust `Result<T, E>` / Swift `throws` |
| CommonJS `require()` / `module.exports` | Modern ECMAScript Modules (`import` / `export`) |
| React Class Component lifecycle | React Functional Component + `useEffect` / Custom Hooks |

---

## 4. Input / Output Contracts

### Input Contract (Legacy JavaScript CJS)
```javascript
const crypto = require('crypto');

function hashPassword(password, salt) {
  if (!password || !salt) throw new Error('Invalid arguments');
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
}

module.exports = { hashPassword };
```

### Output Contract (Modern TypeScript ESM)
```typescript
import { pbkdf2Sync } from "node:crypto";

export interface HashConfig {
  iterations?: number;
  keyLength?: number;
  digest?: string;
}

export class PasswordHasher {
  private static readonly DEFAULT_ITERATIONS = 10_000;
  private static readonly DEFAULT_KEYLEN = 64;
  private static readonly DEFAULT_DIGEST = "sha512";

  public static hash(password: string, salt: string, config?: HashConfig): string {
    if (!password.trim()) {
      throw new TypeError("Password cannot be empty");
    }
    if (!salt.trim()) {
      throw new TypeError("Salt cannot be empty");
    }

    const iterations = config?.iterations ?? PasswordHasher.DEFAULT_ITERATIONS;
    const keylen = config?.keyLength ?? PasswordHasher.DEFAULT_KEYLEN;
    const digest = config?.digest ?? PasswordHasher.DEFAULT_DIGEST;

    return pbkdf2Sync(password, salt, iterations, keylen, digest).toString("hex");
  }
}
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **`any` Type Escape Hatches**: Migrating to TypeScript and plastering `: any` across all function arguments.
- ❌ **Ignoring Error Handling Idioms**: Translating Go code into Python by omitting error checks or swallowing exceptions silently.
- ❌ **Direct Memory Model Mismatch**: Trying to use garbage-collection assumptions when migrating to manual memory management or Rust ownership models.

---

## 6. Real-World Production Example

```markdown
**Migration**: Python Flask Service -> Go Gin Microservice.
- Python: Dynamic JSON payload serialization with Flask `jsonify`.
- Go: Strongly typed structs with `binding:"required"` tags and automated Swagger doc generation.
- Result: Memory consumption dropped by 80% (from 250MB to 18MB per container); request throughput increased 12x.
```
