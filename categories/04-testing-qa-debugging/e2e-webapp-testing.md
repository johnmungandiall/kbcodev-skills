# Skill: End-to-End Web App Testing & Automation
`id`: `kbcodedev/e2e-webapp-testing`  
`category`: `04-testing-qa-debugging`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Authoring resilient end-to-end browser tests, user interaction flows, cross-browser verification, and synthetic user journeys.
- **Triggers**: Critical user flow verification (Sign Up, Checkout, Dashboard interaction), UI regression testing, release gating.
- **Prerequisites**: Running web server or staging URL, browser automation driver (Playwright/kbcode browser tools), test assertions.

---

## 2. Core Mental Model & Invariant Principles
1. **User-Facing Locators (Accessibility First)**: Always prefer semantic locators (`getByRole('button', { name: 'Submit' })`, `getByLabel('Email')`) over brittle CSS classes (`.btn-v2-blue`).
2. **Auto-Waiting Over Hard Sleeps**: Never use `sleep(5000)`. Rely on deterministic auto-waiting for element visibility, network idle, and DOM stability.
3. **Test Isolation & Hermetic State**: Every E2E test must create its own isolated user credentials or test workspace to ensure independent parallel execution.

4. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[Critical User Flow Spec (e.g. Checkout)]
                  │
                  ▼
┌─────────────────────────────────┐
│ Step 1: Page Object Model (POM) │ ── Encapsulate UI interactions per page
└─────────────────┬───────────────┘
                  ▼
┌─────────────────────────────────┐
│ Step 2: Hermetic Test Setup     │ ── Seed isolated database tenant & login session
└─────────────────┬───────────────┘
                  ▼
┌─────────────────────────────────┐
│ Step 3: Interactive User Flow   │ ── Navigate, Fill Form, Click Action
└─────────────────┬───────────────┘
                  ▼
┌─────────────────────────────────┐
│ Step 4: Visual & State Assert   │ ── Verify URL redirect, success toast, DB state
└─────────────────────────────────┘
```

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "flow_name": "User Registration & Workspace Creation",
  "steps": [
    "Navigate to /signup",
    "Enter name, email, password",
    "Submit form",
    "Enter workspace name 'Acme Corp'",
    "Assert redirect to /workspace/acme-corp with welcome banner"
  ]
}
```

### Output Contract
```typescript
import { test, expect } from "@playwright/test";

test.describe("User Registration Flow", () => {
  test("registers new user and creates workspace successfully", async ({ page }) => {
    const uniqueEmail = `test_${Date.now()}@example.com`;

    // 1. Navigation
    await page.goto("/signup");

    // 2. Form Fill via Accessible Roles
    await page.getByLabel("Full Name").fill("Jane Doe");
    await page.getByLabel("Email Address").fill(uniqueEmail);
    await page.getByLabel("Password").fill("P@ssw0rdSecure!2026");
    await page.getByRole("button", { name: "Create Account" }).click();

    // 3. Workspace Onboarding
    await expect(page.getByRole("heading", { name: "Name your workspace" })).toBeVisible();
    await page.getByLabel("Workspace Name").fill("Acme Corp");
    await page.getByRole("button", { name: "Get Started" }).click();

    // 4. Verification Assertions
    await expect(page).toHaveURL(/\/workspace\/acme-corp/);
    await expect(page.getByRole("heading", { name: "Welcome to Acme Corp" })).toBeVisible();
    await expect(page.getByText("Your 14-day trial is active")).toBeVisible();
  });
});
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Brittle CSS / XPath Selectors**: Locating buttons via `div > div:nth-child(3) > button.css-1a2b3c` which breaks on any styling update.
- ❌ **Arbitrary Timeouts (`setTimeout(3000)`)**: Introducing flaky, slow tests instead of waiting for specific network responses or DOM elements.
- ❌ **Testing Third-Party Payment Portals Live in CI**: Failing to mock external Stripe checkout iframe redirects in staging test runs.

---

## 6. Real-World Production Example

```markdown
**Triage of Flaky Test**:
- Issue: Test failed 15% of runs on `await page.click('#submit')` because a modal animation took 200ms to fade out.
- Fix: Replaced with `await page.getByRole('button', { name: 'Save' }).click()` with auto-wait on clickability. Flakiness reduced to 0.0%.
```
