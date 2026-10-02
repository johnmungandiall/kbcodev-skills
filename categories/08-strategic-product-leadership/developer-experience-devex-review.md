# Skill: Developer Experience (DevEx) & API Ergonomics Reviewer
`id`: `kbcodedev/developer-experience-devex-review`  
`category`: `08-strategic-product-leadership`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Designing and evaluating SDKs, CLI tools, REST/GraphQL API endpoints, error messages, and documentation for maximum developer ergonomics.
- **Triggers**: SDK authoring, CLI argument design, API public beta reviews, developer documentation writing.
- **Prerequisites**: Target API/SDK code samples, CLI command tree, target programming languages.

---

## 2. Core Mental Model & Invariant Principles
1. **Dynamic Time-to-Hello-World SLA**: Minimize time-to-first-successful-call to fit the target ecosystem SLA (benchmarking < 5 minutes for lightweight APIs, proportional for complex enterprise SDKs) with zero unhandled friction.
2. **Actionable Error Messages**: An error message must tell the developer (a) What went wrong, (b) Why it happened, and (c) Exactly what command or parameter change fixes it.
3. **Sensible Defaults with Progressive Disclosure**: Make the common 90% case require 1 line of code; allow advanced customization through optional config objects.

4. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[Proposed SDK / CLI / API Surface]
                 │
                 ▼
┌────────────────────────────────┐
│ Phase 1: Time-to-First-Call    │ ── Target SLA onboarding walkthrough
└────────────────┬───────────────┘
                 ▼
┌────────────────────────────────┐
│ Phase 2: Error Ergonomics      │ ── Evaluate error clarity, docs links, copy-paste fixes
└────────────────┬───────────────┘
                 ▼
┌────────────────────────────────┐
│ Phase 3: Typing & Autocomplete │ ── TypeScript IntelliSense, IDE autocompletion audits
└────────────────┬───────────────┘
                 ▼
┌────────────────────────────────┐
│ Phase 4: Ergonomic Recommendations ── Before/After code comparison
└────────────────────────────────┘
```

---

## 4. Input / Output Contracts

### Input Contract
```typescript
// Proposed Clunky SDK Usage
const client = new PaymentClient();
client.setApiKey("sec_123");
client.setEnvironment(Environment.SANDBOX);
client.setVersion("2026-01-01");
const res = await client.getTransactionsService().listAll({ limit: 10 });
```

### Output Contract
```typescript
// Ergonomically Refactored SDK Specification
import { Stripe } from '@stripe/stripe-node';

// 1. One-line initialization with sensible defaults
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// 2. Intuitive, fluent resource traversal with full IDE autocomplete
const transactions = await stripe.transactions.list({ limit: 10 });

// 3. Ergonomic Error Message Standard:
/*
StripeAuthenticationError: Invalid API Key provided: 'sec_12***'.
-> Check that your API key is correct in your dashboard: https://dashboard.stripe.com/apikeys
-> Or set the STRIPE_SECRET_KEY environment variable.
*/
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Generic 400 Bad Request Errors**: Returning `400 Bad Request` with no details on which field failed validation.
- ❌ **Deep Object Nesting**: Forcing developers to navigate 5 layers of getters (`client.getV1().getServices().getBilling().getInvoices().create()`).
- ❌ **CLI Argument Inconsistency**: Mixing `--output-format`, `-o`, `--out` across different subcommands in the same CLI tool.

---

## 6. Real-World Production Example

```markdown
**CLI Error Message Redesign**:
- Before: `Error: failed to deploy (exit code 1)`
- After:
```
Error: Missing required environment variable 'DATABASE_URL'.
Run `kb env set DATABASE_URL=postgres://...` to configure your database connection.
Docs: https://docs.example.com/databases/setup
```
```
