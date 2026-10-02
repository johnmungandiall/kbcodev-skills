# Skill: Canvas & Generative Visuals Engine
`id`: `kbcodedev/canvas-generative-visuals`  
`category`: `05-frontend-ui-ux`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Authoring HTML5 Canvas graphics, mathematical procedural visual patterns, interactive particles, SVG infographics, and data visualizations.
- **Triggers**: Data visualization dashboards, generative backgrounds, custom charts, visual export generators.
- **Prerequisites**: HTML5 Canvas 2D / WebGL API, `requestAnimationFrame` lifecycle, high-DPI (Retina) scaling techniques.

---

## 2. Core Mental Model & Invariant Principles
1. **Device Pixel Ratio (DPR) Awareness**: Always scale canvas dimensions by `window.devicePixelRatio` to prevent blurry rendering on Retina screens.
2. **Delta Time (`dt`) Animation Invariance**: Update physics and animations using elapsed delta time, ensuring consistent 60fps/120fps motion regardless of monitor refresh rate.
3. **Clean Up Animation Loops**: Always cancel `requestAnimationFrame` IDs in component unmount hooks to prevent memory leaks and background CPU drain.

4. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[Visual Spec / Particle Math Model]
                 │
                 ▼
┌────────────────────────────────┐
│ Step 1: Canvas Retina Setup    │ ── Scale canvas width/height by window.devicePixelRatio
└────────────────┬───────────────┘
                 ▼
┌────────────────────────────────┐
│ Step 2: State & Particle Pool  │ ── Pre-allocate object pools to prevent GC stutter
└────────────────┬───────────────┘
                 ▼
┌────────────────────────────────┐
│ Step 3: Game / Animation Loop  │ ── Calculate dt -> Update Positions -> Clear & Render
└────────────────┬───────────────┘
                 ▼
┌────────────────────────────────┐
│ Step 4: Unmount Hook Cleanup   │ ── cancelAnimationFrame(reqId)
└────────────────────────────────┘
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
  "canvas_type": "Interactive Particle Network Background",
  "features": ["Mouse proximity connection lines", "Smooth floating physics", "Retina DPI sharp"]
}
```

### Output Contract
```tsx
import React, { useEffect, useRef } from 'react';

export function ParticleNetworkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // High-DPI Scaling
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Particle Setup
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 1.2,
      vy: (Math.random() - 0.5) * 1.2,
      radius: 2,
    }));

    function loop() {
      ctx.clearRect(0, 0, width, height);

      // Update & Draw Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#6366f1';
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${1 - dist / 120})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(loop);
    }

    loop();

    return () => cancelAnimationFrame(animationId);
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
}
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Blurry Canvas on High-DPI Displays**: Omitting `devicePixelRatio` scaling, causing text and lines to look pixelated on Macs and modern phones.
- ❌ **Allocating Objects Inside `requestAnimationFrame`**: Creating new arrays or objects 60 times per second, triggering severe Garbage Collection frame drops.
- ❌ **Missing Cleanup in React**: Leaving animation loops running after the component is unmounted.

---

## 6. Real-World Production Example

```markdown
**Interactive Stock Candlestick Chart**:
- Rendered 50,000 historical price ticks on HTML5 Canvas in 8ms with pinch-to-zoom and crosshair tooltips. 10x faster than SVG DOM node alternatives.
```
