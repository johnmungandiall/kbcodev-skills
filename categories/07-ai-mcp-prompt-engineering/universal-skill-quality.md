# Skill: Universal Skill Quality & Production Hardening
`id`: `kbcodedev/universal-skill-quality`  
`category`: `07-ai-mcp-prompt-engineering`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Reviewing, repairing, strengthening or production-hardening **any** skill definition, whatever its domain, length, format, framework or language — a skill about to ship, a skill that produced wrong agent behaviour, or a library-wide quality sweep.
- **Triggers**: "review / harden / audit this skill", "why did this skill make the agent do X", a skill flagged for outdated APIs, hardcoded thresholds, ambiguous steps, unsafe instructions, or contradictory rules, or a pre-release skill-library pass.
- **Prerequisites**: The target skill readable as text; the target project that skill will execute against (so its claims can be reconciled with reality); a writable path only if repair — not audit-only — was requested.
- **Explicit non-goals** (state these in the final report if the request drifts toward them): rewriting a skill for style, forcing every skill into one template, inventing verification evidence, adding security rules irrelevant to the domain, or widening the pass beyond the skills named.

---

## 2. Core Mental Model & Invariant Principles
1. **Understand before repairing**: the existing skill is the current answer to some problem. Read what it claims, who it is for, when it fires, what it inputs and outputs, and which of its specifics are load-bearing — before changing a line. Blind rewrite is the primary failure mode of this skill.
2. **Precise rules, not maximum rules**: every absolute ("always", "never", "must", "guaranteed", "zero") is classified, not deleted by reflex; every repeated rule, filler adjective and low-value example is cut. The deliverable is the **smallest reliable skill**, not the largest comprehensive-looking one — smaller with precise, evidence-driven instructions beats larger with contradictory or hardcoded ones.
3. **Evidence, never assertion**: `Implemented ≠ Verified`, and discovery is not proof. A grep hit is a lead, not behaviour; a filename is not an implementation; documentation is not runtime behaviour; an example is not project configuration; expected output is not actual output; a command that ran is not an operation that succeeded. Require: **Discovery → actual implementation → execution → evidence**.
4. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[Target skill(s) + the project they run against]
                 │
                 ▼
┌────────────────────────────┐
│ Phase 1: Discover the      │ ── purpose, triggers, contracts, claims, assumptions
│          Skill's Contract  │
└──────────────┬─────────────┘
               ▼
┌────────────────────────────┐
│ Phase 2: Diagnose          │ ── classify every assumption, absolute, number,
│          (classify, not    │    example and contradiction
│           guess)           │
└──────────────┬─────────────┘
               ▼
┌────────────────────────────┐
│ Phase 3: Repair Minimally  │ ── preserve intent + domain expertise, fix only what is proven wrong
└──────────────┬─────────────┘
               ▼
┌────────────────────────────┐
│ Phase 4: Verify            │ ── quality gates + strongest available evidence
└──────────────┬─────────────┘
               ▼
┌────────────────────────────┐
│ Phase 5: Report            │ ── fixed format: assessment, changes, limits, verification status
└────────────────────────────┘
```

### Phase 1: Discover the Skill's Contract
Identify, from the skill itself: purpose; domain; intended user or agent; trigger conditions; expected inputs; expected outputs; execution workflow; dependencies and external tools/services; security requirements; verification requirements; failure conditions; examples; anti-patterns; constraints; assumptions. **Do not impose a fixed section structure** — a different valid structure is preserved, not normalised. Note the skill's own declared contract (if it has one) so Phase 3 can be checked against it.

### Phase 2: Diagnose — classify, never guess
For every concrete specificity in the skill, record a classification before deciding its fate:

| Found in the skill | Classify as | Action |
|---|---|---|
| Version, package name, framework API, CLI flag, path, port, timeout, retry count, limit, token cap, coverage/latency/security target | **Project-specific / Domain-standard / Reference example / Heuristic / Required invariant** | Keep invariants; convert unjustified hardcoded values into context-aware guidance; label examples as starting heuristics |
| Absolute wording: always, never, must, exactly, only, all, zero, required, guaranteed, never fail | **A** true invariant · **B** security/safety invariant (keep, scope it explicitly) · **C** context-dependent (make conditional) · **D** example/heuristic (mark it) · **E** unsupported assumption (remove or replace) | Never delete an absolute automatically; never keep one unexamined |
| Tool, framework, API, cloud service, package, command, platform reference | Compatible / Deprecated / Changed / Removed / Version-specific / Unverifiable | Never preserve an outdated recommendation because it was in the original; if current behaviour cannot be verified, mark the statement **requires verification** instead of asserting it |
| Example | Correct · current · internally consistent · secure · representative · clearly illustrative | Examples must not contradict the skill's own rules; a deliberately simplified example must say so and never read as a production recommendation |
| Contradiction: "never auto-approve" vs an `auto-approve` flag; "use dynamic values" vs a fixed threshold; "verify everything" vs an unverified success claim; "provider agnostic" vs provider-specific assumptions; "do not modify production directly" vs direct production commands; an input contract requiring X while the output ignores X | Contradiction | The repaired skill must be internally consistent; surface the resolution in the report |

Also verify the **hallucinated-evidence traps** above are closed in the target skill (it must tell its agent not to treat grep hits, filenames, docs, examples or command invocation as proof), and that its workflow shape fits its domain — coding `Inspect → Design → Implement → Test → Review`, IaC `Inspect → Plan → Security Check → Risk Review → Apply → Verify`, database `Inspect Schema → Plan Migration → Validate → Migrate → Verify`, API `Inspect Contract → Implement → Test → Integration Verify`, UI `Inspect Existing UI → Design → Implement → Visual Verify`, security `Discover → Threat Model → Test → Remediate → Verify`, documentation `Gather Evidence → Draft → Validate → Finalize`. Another ordering is legitimate when the domain demands it.

### Phase 3: Repair Minimally
- **Edit only what is proven wrong or missing**; leave correct text, correct examples and the skill's own vocabulary intact. Preserve the skill's original purpose and its domain intelligence — framework conventions, architecture patterns, security models, CLI workflows, API semantics, testing strategies, deployment practices, performance notes, domain-specific failure modes. Universal quality rules improve a skill; they never erase its expertise or turn it into a generic template.
- **Dynamic thresholds**: replace copied numbers with derivation from (1) project constraints, (2) existing configuration, (3) runtime evidence, (4) dependency/tool capabilities, (5) workload requirements, (6) failure/reliability requirements. Where a number is genuinely a fixed invariant of the domain, keep it and say why.
- **Failure handling**: the repaired skill must state what happens on missing dependency, missing credential, invalid configuration, unsupported version, tool/test/build failure, partial execution, destructive change, ambiguous requirement, and missing project evidence. Its agent must: stop when continuing could damage; preserve diagnostics; name the actual failure; never invent a successful result; retry only when something changed; report unresolved issues explicitly.
- **Security scoping**: for skills touching code, infrastructure, credentials, data, networking, deployment or external systems, check secrets exposure, credential leakage, excessive permissions, unsafe defaults, injection, public exposure, authn/authz gaps, sensitive-data logging, insecure transport, unsafe destructive operations, dependency and supply-chain risk. **Do not** introduce security requirements irrelevant to the skill's domain.
- **Complexity control**: cut repeated rules, filler, duplicate explanations, low-value examples and warnings that do not change agent behaviour. Every instruction kept must be able to change what the agent does.

### Phase 4: Verify
Run the quality gates against the **edited** skill and record the strongest available evidence (tests, build, type check, lint, static analysis, runtime execution, CLI validation, config inspection, log/diff inspection — whichever the target project actually provides):

- **Correctness** — no known incorrect technical guidance, no contradiction, no unjustified assumption.
- **Grounding** — project-specific facts are discovered, not assumed; examples are distinguishable from facts.
- **Execution** — the agent can tell what to do, what to inspect first, when to stop, how to verify.
- **Safety** — destructive operations gated, secrets protected, security scope appropriate.
- **Verification** — claims require evidence; implementation and verification are separated.
- **Maintainability** — version-sensitive content identifiable; deprecated assumptions removed; numeric heuristics dynamic where appropriate.
- **Clarity** — no unnecessary repetition; precise instructions; domain expertise intact.

Implementing a repair and running the gates are different events. Never claim *working*, *fixed*, *production-ready*, *secure*, *successful*, *zero downtime* or *compatible* on the strength of the edit alone — only on the strength of evidence.

### Phase 5: Report
Deliver exactly the four-part format in the Output Contract below. No claim of complete verification when evidence is unavailable.

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "target_skills": ["categories/<category>/<skill>.md"],
  "mode": "audit | repair",
  "project_root": "<path the target skill will execute against>",
  "constraints": {
    "preserve_structure": true,
    "max_changed_lines_per_skill": "unset | integer",
    "domain_context": "free text, optional"
  }
}
```
- `mode: audit` → diagnose and report only; change no file.
- `mode: repair` → apply the Phase-3 edits, then run Phase 4 and report.
- Missing `project_root` for a skill containing project-specific claims is **not** an invitation to assume: discover it, or mark those claims unverified.

### Output Contract
```json
{
  "skill_assessment": {
    "original_purpose": "string",
    "problems_found": ["string"],
    "risks": ["string"],
    "outdated_assumptions": ["string"],
    "missing_execution_or_verification_rules": ["string"]
  },
  "changes_made": ["meaningful change only — no cosmetic churn"],
  "remaining_limitations": ["what could not be verified + why"],
  "verification_status": {
    "verified": ["claim + the evidence that proves it"],
    "partially_verified": ["claim + what is still missing"],
    "unverified": ["claim + why no evidence could be obtained"]
  }
}
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Blind rewrite** — regenerating the whole skill before understanding its contract; the fastest way to destroy domain expertise that was correct.
- ❌ **Passing off a reference pattern as verified project fact** — versions, paths, thresholds and commands pasted from the skill into a real repository without inspecting that repository.
- ❌ **Fabricated or imported evidence** — citing a test, validator or tool run that never happened, or reporting another repo's result as this one's.
- ❌ **Deleting valid absolutes** — removing a security or safety invariant because it "sounds too absolute"; scope it explicitly instead.
- ❌ **Keeping undocumented magic numbers** — a retry count, timeout or pool size left as a bare constant with no derivation and no label.
- ❌ **Forcing every skill into one template** — normalising a valid domain structure into a house style, losing semantics in the process.
- ❌ **Bloat as thoroughness** — restating the same rule in five sections; growing the text while agent reliability stays flat.
- ❌ **Irrelevant security theatre** — bolting credential handling, rate limiting or threat modelling onto a skill whose domain does not touch them.
- ❌ **Silent scope narrowing** — auditing fewer skills, or fewer rules per skill, than asked, and reporting success. Say what was left out and why.
- ❌ **Claiming completeness** — "production-ready / fully verified" with no evidence behind it.

---

## 6. Real-World Production Example

**Input**: `mode: repair`, target `categories/03-software-engineering/<some-skill>.md`, whose retry guidance reads
`"retry 3 times with a 5-second timeout"`, presented as a literal instruction.

**Discovery** — the skill is a code-integration playbook; its project faces a third-party API. Read the real caller in the target repo: the HTTP client wraps a dependency whose own default timeout is unknown to the skill.

**Diagnosis** — classify the two numbers: *project-specific / heuristic*, not invariants. The retry **count** is a reliability heuristic; the **timeout** is a project-derived bound. No counter-evidence removed them.

**Repair** — replace the literals with derivation guidance: derive the timeout from the caller's measured p95 latency and the documented upstream limit; derive the retry budget from idempotency of the operation and the caller's own deadline; state explicitly that any number given is a starting heuristic. Nothing else in the skill is touched, preserving its domain expertise.

**Verify** — `node bin/skill-runner.mjs validate` → canonical schema still intact for that file; `git diff` inspected to confirm the change is confined to the two lines and no unrelated text moved.

**Report** —
- *Assessment*: correct skill, one unjustified hardcoded pair, no verification rule for the retry claim.
- *Changes*: literals → derivation guidance; added "starting heuristic" label.
- *Remaining limitations*: the upstream provider's documented timeout could not be reached from this environment — marked **requires verification** in-skill.
- *Verification status*: **verified** — schema validation passes, diff confined; **unverified** — the upstream timeout value itself.

**Skill Lifecycle note**: this skill applies its own rules to itself — it is structure-agnostic, carries the Project-Grounding Invariant in section 2, treats every numeric bound as a heuristic, and separates implementation from verification.
