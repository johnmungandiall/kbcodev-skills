# Skill: CI/CD Workflow & Matrix Pipeline Automation
`id`: `kbcodedev/ci-cd-workflow-automation`  
`category`: `06-devops-sre-release`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Authoring fast, secure, cache-optimized CI/CD pipelines (GitHub Actions, GitLab CI, CircleCI) with matrix testing, automated semantic versioning, and secure credential handling.
- **Triggers**: Repository setup, PR verification pipelines, automated release tagging, multi-OS / multi-runtime test matrices.
- **Prerequisites**: Git repository structure, dependency lockfiles, deployment target credentials via OIDC.

---

## 2. Core Mental Model & Invariant Principles
1. **Aggressive Cache Invalidation Keys**: Cache dependency folders (e.g. `~/.npm`, `~/.cache/pypoetry`, `~/.cargo`) keyed to lockfile hashes to reduce CI runtime from minutes to seconds.
2. **OIDC Over Static Long-Lived Secrets**: Use OpenID Connect (OIDC) with cloud providers (AWS IAM Roles, GCP Workload Identity) rather than storing static permanent access keys in GitHub Secrets.
3. **Fail-Fast Matrix Builds**: Run matrix test combinations (Node 18/20/22 on Ubuntu/macOS/Windows) with `fail-fast: true` to conserve CI runner minutes upon first failure.

4. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[Git Push / Pull Request Event]
               │
               ▼
┌──────────────────────────────┐
│ Phase 1: Security & Linting  │ ── ESLint / Ruff, Semgrep, Secret Scanner (15s)
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ Phase 2: Parallel Test Matrix│ ── Matrix: [Node 18, 20, 22] x [Ubuntu, Windows] (Cached)
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ Phase 3: Build & Containerize│ ── Multi-stage Docker build + push to registry
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ Phase 4: Deploy via OIDC     │ ── Short-lived IAM token authentication
└──────────────────────────────┘
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
  "pipeline_type": "GitHub Actions",
  "project_stack": "TypeScript / Node.js Monorepo",
  "triggers": ["push to main", "pull_request"],
  "security": "OIDC to AWS ECR"
}
```

### Output Contract
```yaml
# .github/workflows/ci-cd.yml
name: Production CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  validate:
    name: Lint, Typecheck & Security
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - name: Gitleaks Secret Audit
        uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

  test:
    name: Test Matrix
    needs: validate
    runs-on: ${{ matrix.os }}
    strategy:
      fail-fast: true
      matrix:
        os: [ubuntu-latest]
        node-version: [18, 20, 22]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      - run: npm ci
      - run: npm test -- --coverage
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **`npm install` in CI**: Using `npm install` instead of `npm ci` (which respects exact `package-lock.json` hashes and avoids non-deterministic dependency drift).
- ❌ **Hardcoded AWS Secret Keys**: Storing long-lived `AWS_SECRET_ACCESS_KEY` in GitHub repository secrets instead of OIDC roles.
- ❌ **Missing `concurrency.cancel-in-progress`**: Wasting hours of CI worker queue time running obsolete builds for stale superseded PR commits.

---

## 6. Real-World Production Example

```markdown
**CI Speedup**:
- Baseline: CI ran `npm install` from scratch on every commit -> 7 minutes 40 seconds.
- Optimization: Added `actions/setup-node` with `cache: 'npm'` + switched to `npm ci` + parallelized lint/test.
- Result: CI execution time dropped to 52 seconds (8.8x speedup).
```
