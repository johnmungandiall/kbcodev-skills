# Skill: Web Accessibility (A11y) & WCAG 2.1 AA Compliance
`id`: `kbcodedev/a11y-accessibility-spec`  
`category`: `05-frontend-ui-ux`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Auditing and building accessible web applications adhering to WCAG 2.1 AA standards, screen reader compatibility, ARIA patterns, and keyboard navigation.
- **Triggers**: UI component development, modal/dialog engineering, accessibility compliance audits, form UX design.
- **Prerequisites**: Semantic HTML knowledge, WAI-ARIA authoring practices, keyboard event handling.

---

## 2. Core Mental Model & Invariant Principles
1. **First Rule of ARIA**: Use native semantic HTML (`<button>`, `<dialog>`, `<nav>`, `<main>`) whenever possible before reaching for custom ARIA roles.
2. **Keyboard Navigability**: Every interactive element must be reachable and actionable via `Tab`, `Enter`, `Space`, and `Escape` with a clear visible `:focus-visible` ring.
3. **Color Contrast & Dynamic Live Regions**: Enforce minimum 4.5:1 contrast for normal text (3:1 for large text); use `aria-live="polite"` for asynchronous status alerts.

4. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[UI Component / Modal Dialog]
              │
              ▼
┌─────────────────────────────┐
│ Phase 1: Semantic HTML      │ ── Replace generic <div>s with semantic elements
└─────────────┬───────────────┘
              ▼
┌─────────────────────────────┐
│ Phase 2: Keyboard Focus     │ ── Focus trap inside dialogs, restore focus on close
│          Management         │
└─────────────┬───────────────┘
              ▼
┌─────────────────────────────┐
│ Phase 3: ARIA Attributes &  │ ── aria-expanded, aria-controls, aria-labelledby
│          Relationships      │
└─────────────┬───────────────┘
              ▼
┌─────────────────────────────┐
│ Phase 4: Automated A11y Gate│ ── axe-core / Lighthouse Accessibility (100 score)
└─────────────────────────────┘
```

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "component": "Accessible Modal Dialog",
  "features": ["Focus trap", "Escape key listener", "Screen reader announcements", "Focus restoration"]
}
```

### Output Contract
```tsx
import React, { useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function AccessibleModal({ isOpen, onClose, title, children }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement as HTMLElement;
      dialogRef.current?.focus();

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        triggerRef.current?.focus(); // Restore focus on close
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="presentation">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        className="bg-white dark:bg-slate-900 rounded-xl p-6 max-w-lg w-full shadow-2xl focus:outline-none"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 id="modal-title" className="text-xl font-bold text-gray-900 dark:text-white">
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            ✕
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Clickable Divs without Keyboard Support**: `<div onClick={submit}>` with no `tabIndex`, `role="button"`, or keydown handler.
- ❌ **Removing Focus Outlines**: `outline: none` without providing an accessible `:focus-visible` ring replacement.
- ❌ **Inaccessible Form Inputs**: `<input type="text">` without a matching `<label htmlFor="...">` or `aria-label`.

---

## 6. Real-World Production Example

```markdown
**A11y Audit Finding**: Screen reader users could not tell which accordion item was expanded.
- Fix: Added `aria-expanded={isOpen}` and `aria-controls="accordion-panel-1"`. Screen readers now clearly announce "Section 1, Expanded, Button".
```
