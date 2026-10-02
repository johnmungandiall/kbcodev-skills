# Skill: Responsive Layout & Adaptive CSS Grid Engine
`id`: `kbcodedev/responsive-layout-engine`  
`category`: `05-frontend-ui-ux`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Crafting fluid, mobile-first responsive layouts, multi-column dashboards, adaptive navigation bars, and container-query-driven components.
- **Triggers**: Web application UI layout, responsive grid creation, mobile viewport optimization.
- **Prerequisites**: CSS Grid, Flexbox, Tailwind CSS responsive modifiers (`sm:`, `md:`, `lg:`, `xl:`), CSS Container Queries (`@container`).

---

## 2. Core Mental Model & Invariant Principles
1. **Mobile-First Breakpoint Architecture**: Write default CSS for mobile viewports, applying media queries strictly as `min-width` enhancements (`sm:`, `md:`, `lg:`).
2. **Intrinsic Web Design (Content-Driven Sizing)**: Use `minmax()`, `clamp()`, and `auto-fit` rather than hardcoding static pixel widths.
3. **Container Queries for Component Autonomy**: Components should adapt based on their parent container's width, not the global window viewport.

4. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[Design Wireframe / Multi-Device Spec]
                  │
                  ▼
┌─────────────────────────────────┐
│ Step 1: Fluid Typography &      │ ── clamp(1rem, 2.5vw, 2rem)
│         Spacing Scale           │
└─────────────────┬───────────────┘
                  ▼
┌─────────────────────────────────┐
│ Step 2: Auto-Fit CSS Grid       │ ── grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))
└─────────────────┬───────────────┘
                  ▼
┌─────────────────────────────────┐
│ Step 3: Adaptive Navigation     │ ── Bottom bar on mobile -> Collapsible sidebar on desktop
└─────────────────┬───────────────┘
                  ▼
┌─────────────────────────────────┐
│ Step 4: Container Queries       │ ── Card layout changes horizontally inside wide columns
└─────────────────────────────────┘
```

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "layout_type": "Responsive E-Commerce Product Grid",
  "behavior": "1 column on mobile, 2 on tablet, 3 on laptop, 4 on 4K displays",
  "card_min_width": "260px"
}
```

### Output Contract
```tsx
// Modern Fluid CSS Grid with Tailwind
export function ResponsiveProductGrid({ products }: { products: Product[] }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Intrinsic Responsive Auto-Fit Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <article 
            key={product.id}
            className="group relative flex flex-col overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="aspect-square w-full overflow-hidden bg-slate-100 dark:bg-slate-700">
              <img 
                src={product.imageUrl} 
                alt={product.title}
                className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
            <div className="flex flex-1 flex-col p-4">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                {product.title}
              </h3>
              <p className="mt-1 text-sm text-slate-500 line-clamp-2">{product.description}</p>
              <div className="mt-auto pt-4 flex justify-between items-baseline">
                <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                  ${product.price}
                </span>
                <button className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                  Add to Cart
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Fixed Pixel Widths on Containers**: Setting `width: 1200px` causing horizontal scrollbars on mobile screens.
- ❌ **Desktop-First Media Queries (`max-width`)**: Writing desktop CSS and attempting to override properties backwards for mobile.
- ❌ **Unresponsive Data Tables**: Leaving 10-column tables without horizontal overflow wrappers (`overflow-x-auto`) on mobile.

---

## 6. Real-World Production Example

```markdown
**Responsive Dashboard Sidebar**:
- Mobile (<768px): Collapses into a floating bottom navigation bar.
- Tablet (768px-1024px): Collapses into icon-only rail (w-16).
- Desktop (>1024px): Full expanded sidebar (w-64) with sub-navigation trees.
```
