# Skill: Multi-Modal Vision & UI Screenshot Inspector
`id`: `kbcodedev/multi-modal-vision-inspector`  
`category`: `05-frontend-ui-ux`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Inspecting web page screenshots, design wireframes, UI layout anomalies, overlapping text, visual regressions, and accessibility contrast issues using multi-modal vision models.
- **Triggers**: User provides image/screenshot attachment, visual UI bugs ("the button looks misaligned"), comparing rendered web page to Figma design.
- **Prerequisites**: Screenshot capture tool (`browser_screenshot` or local image file path), vision inspection model (`vision_analyze`).

---

## 2. Core Mental Model & Invariant Principles
1. **Scope Exclusively to the Visual Image**: When an image is provided, anchor the entire diagnostic strictly to the visual elements in the image—never guess from memory.
2. **Coordinate & Element Precision**: Report exact bounding regions, visual hierarchy flaws, overlapping elements, color contrast violations, and font misalignment.
3. **Structured Visual Diagnosis**: Analyze: (1) Layout & Spacing, (2) Typography & Hierarchy, (3) Color & Contrast, (4) Alignment & Breakpoint behavior.

4. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[Captured Screenshot Image / Attachment]
                    │
                    ▼
┌───────────────────────────────────────┐
│ Step 1: Multi-Modal Vision Analysis   │ ── Call vision_analyze(image_path, prompt)
└───────────────────┬───────────────────┘
                    ▼
┌───────────────────────────────────────┐
│ Step 2: Identify Visual Flaws         │ ── Text clipping, broken margins, bad contrast
└───────────────────┬───────────────────┘
                    ▼
┌───────────────────────────────────────┐
│ Step 3: Map Visual Bug to CSS Source  │ ── Trace defect to Flexbox/Grid CSS rule
└───────────────────┬───────────────────┘
                    ▼
┌───────────────────────────────────────┐
│ Step 4: Emit Surgical CSS Patch       │ ── Provide exact CSS fix with before/after
└───────────────────────────────────────┘
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
  "image_path": "screenshots/mobile_checkout_broken.png",
  "user_query": "Why is the checkout button cut off on mobile screens?"
}
```

### Output Contract
```markdown
# Visual UI Inspection Report: Mobile Checkout

## 1. Visual Defect Analysis
- **Observed Bug**: The "Pay Now" primary button is partially clipped at the bottom of the viewport; its bottom 24px and box shadow are hidden beneath the mobile browser navigation bar.
- **Location**: Fixed bottom action container in `CheckoutFooter.tsx`.

## 2. Root Cause in CSS
- The container uses `height: 80px; position: fixed; bottom: 0;` without accounting for mobile viewport dynamic safe area insets (`env(safe-area-inset-bottom)`).

## 3. Surgical CSS Remediation
```tsx
// Before:
<div className="fixed bottom-0 left-0 right-0 h-20 bg-white p-4">

// After (Fixed with Safe Area Padding):
<div className="fixed bottom-0 left-0 right-0 bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-lg">
```
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Ignoring Image Attachments**: Guessing what a screenshot shows from the conversation prompt without invoking vision inspection.
- ❌ **Vague Visual Feedback**: Saying *"The page looks weird"* instead of *"The header logo has 0px right margin and overlaps the navigation links"*.
- ❌ **Unverified CSS Guesses**: Proposing complex layout refactors when a simple `safe-area-inset-bottom` or `overflow-x-hidden` resolves the visual bug.

---

## 6. Real-World Production Example

```markdown
**Visual Regression Catch**:
- Automated screenshot comparison captured mobile drawer menu.
- Vision inspector detected menu close button had 2.8:1 contrast ratio against gray backdrop (failed WCAG AA).
- Updated color token to high-contrast slate, passing accessibility gate.
```
