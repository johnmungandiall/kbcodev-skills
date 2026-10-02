# Skill: Automated Git Bisect & Regression Debugger
`id`: `kbcodedev/automated-git-bisect-debugger`  
`category`: `04-testing-qa-debugging`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Pinpointing the exact commit that introduced a regression, test failure, performance slowdown, or memory leak using automated binary search with `git bisect run`.
- **Triggers**: Mystery regressions where a test passed in `v2.10.0` but fails in `HEAD`, finding broken commits across hundreds of git merges.
- **Prerequisites**: Known good commit hash (e.g. `v2.10.0`), known bad commit (`HEAD`), deterministic automated test script (`npm test` or bash script).

---

## 2. Core Mental Model & Invariant Principles
1. **$O(\log N)$ Binary Search Efficiency**: Searching through 1,000 commits takes only $\approx 10$ test runs with `git bisect`.
2. **Deterministic Script Exit Codes**: The test script must return exit code `0` for Good, `1` to `127` (except 125) for Bad, and `125` for Untestable / Skipped (e.g. build failure).
3. **Clean Workspace Invariant**: Always run `git bisect reset` upon completion to restore the working tree to its original state.

---

## 3. High-Signal Execution Workflow

```
[Regression Discovered: Passed in v2.10.0; Failed in HEAD]
                           │
                           ▼
┌──────────────────────────────────────────────────────────┐
│ Step 1: Initialize Git Bisect Session                    │ ── git bisect start HEAD v2.10.0
└──────────────────────────┬───────────────────────────────┘
                           ▼
┌──────────────────────────────────────────────────────────┐
│ Step 2: Author Minimal Test Script (test_repro.sh)       │ ── Script exits 0 on PASS, 1 on FAIL
└──────────────────────────┬───────────────────────────────┘
                           ▼
┌──────────────────────────────────────────────────────────┐
│ Step 3: Run Automated Binary Search                      │ ── git bisect run ./test_repro.sh
└──────────────────────────┬───────────────────────────────┘
                           ▼
┌──────────────────────────────────────────────────────────┐
│ Step 4: Extract Culprit Commit & Clean Up                │ ── Inspect diff + git bisect reset
└──────────────────────────────────────────────────────────┘
```

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "good_commit": "v2.10.0",
  "bad_commit": "HEAD",
  "test_command": "pytest tests/api/test_checkout_regression.py"
}
```

### Output Contract
```bash
# Automated Git Bisect Execution Script
git bisect start HEAD v2.10.0

# Execute automated binary search
git bisect run pytest tests/api/test_checkout_regression.py

# Expected Output:
# Bisecting: 64 revisions left to test after this (roughly 6 steps)
# ...
# 7f8a9b2c3d4e5f6a is the first bad commit
# commit 7f8a9b2c3d4e5f6a
# Author: Developer <dev@example.com>
# Date:   Wed Sep 28 14:22:00 2026
#
#     feat(checkout): add currency conversion cache
#
#  src/checkout/pricing.py | 14 +++++++-------
#  1 file changed, 7 insertions(+), 7 deletions(-)

# Clean up and return to original branch
git bisect reset
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Non-Deterministic Test Scripts**: Running flaky network-dependent tests during git bisect, corrupting the binary search tree.
- ❌ **Failing to Handle Broken Intermediate Builds**: Not returning exit code `125` when an intermediate commit fails to compile due to an unrelated broken dependency.
- ❌ **Leaving Git in Bisect State**: Forgetting to call `git bisect reset`, leaving the repository in a detached HEAD state.

---

## 6. Real-World Production Example

```markdown
**Git Bisect Triumph**:
- A subtle floating-point precision bug was introduced somewhere across 480 merged PRs over 3 months.
- `git bisect run npm test` located the exact 2-line commit that changed decimal rounding in 45 seconds (9 steps).
```
