# Skill: Design System & Semantic Theme Tokens
`id`: `kbcodedev/design-system-theme-tokens`  
`category`: `05-frontend-ui-ux`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Establishing scalable design systems, semantic color palettes, typography scales, spacing tokens, and seamless Light/Dark mode transitions.
- **Triggers**: New frontend project initialization, UI redesign, theme customization, consistent multi-brand styling.
- **Prerequisites**: CSS Variables / Tailwind config knowledge, color contrast compliance standards (WCAG AAA/AA).

---

## 2. Core Mental Model & Invariant Principles
1. **Three-Tier Token Architecture**:
   - **Global Tokens (Raw)**: `blue-500: #3b82f6`
   - **Semantic Tokens (Intent)**: `color-primary: var(--blue-500)`, `color-surface: var(--gray-50)`
   - **Component Tokens (Scoped)**: `button-primary-bg: var(--color-primary)`
2. **Never Hardcode Hex Values in Components**: Components must always consume semantic CSS variables or design tokens (`bg-surface-elevated`), never raw hex values (`#ffffff`).
3. **Contrast-Safe Light/Dark Inversion**: Dark mode is not just inverted white/black—it requires calibrated surface layering (`surface-1`, `surface-2`, `surface-3`) for depth.

---

## 3. High-Signal Execution Workflow

```
[Brand Palette & Typography Spec]
                │
                ▼
┌───────────────────────────────┐
│ Tier 1: Global Primitive      │ ── Raw color scales, font families, radius scales
│         Tokens                │
└───────────────┬───────────────┘
                ▼
┌───────────────────────────────┐
│ Tier 2: Semantic Intent Tokens│ ── Background, Surface, Text, Border, Accent
└───────────────┬───────────────┘
                ▼
┌───────────────────────────────┐
│ Tier 3: Light/Dark Mode       │ ── CSS Custom Properties (:root & [data-theme='dark'])
│         Mapping               │
└───────────────┬───────────────┘
                ▼
┌───────────────────────────────┐
│ Tier 4: Tailwind Integration  │ ── Extend tailwind.config.ts with semantic tokens
└───────────────────────────────┘
```

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "theme_name": "Enterprise Minimalist",
  "primary_brand": "Indigo",
  "features": ["Dark Mode", "High Contrast AA", "8px Grid Spacing"]
}
```

### Output Contract
```css
/* Semantic CSS Theme Variables */
:root {
  /* Light Theme */
  --bg-app: #f8fafc;
  --bg-surface: #ffffff;
  --bg-surface-elevated: #ffffff;
  
  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-muted: #94a3b8;
  
  --border-subtle: #e2e8f0;
  --border-strong: #cbd5e1;
  
  --brand-primary: #4f46e5;
  --brand-primary-hover: #4338ca;
  --brand-on-primary: #ffffff;
}

[data-theme="dark"] {
  /* Dark Theme */
  --bg-app: #090d16;
  --bg-surface: #111827;
  --bg-surface-elevated: #1f2937;
  
  --text-primary: #f9fafb;
  --text-secondary: #d1d5db;
  --text-muted: #6b7280;
  
  --border-subtle: #1f2937;
  --border-strong: #374151;
  
  --brand-primary: #6366f1;
  --brand-primary-hover: #818cf8;
  --brand-on-primary: #ffffff;
}
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Hardcoded `#fff` and `#000`**: Strewing raw hex colors across 200 components making dark mode impossible to implement cleanly.
- ❌ **Pure Black Dark Mode (`#000000`)**: Using pure black backgrounds with pure white text causing harsh visual vibration and eye strain.
- ❌ **Unsemantic Naming**: Naming tokens by their color (e.g. `--red-bg`) instead of their semantic purpose (e.g. `--danger-surface`).

---

## 6. Real-World Production Example

```markdown
**Design System Rollout**:
- Built unified button component using `var(--brand-primary)` and `var(--brand-on-primary)`.
- Swapping themes simply switches the `data-theme` attribute on `<html>`, updating all 50+ components simultaneously with zero JavaScript re-render overhead.
```
