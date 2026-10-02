# Skill: Game Loop Architecture & Physics Engine Integration
`id`: `kbcodedev/game-loop-physics-engine`  
`category`: `19-game-dev-3d-graphics`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Building 2D/3D browser games, physics simulations, spatial partitioning (Quadtrees / Spatial Hash Grids), collision detection, and fixed-timestep game loops in JavaScript/TypeScript/C++.
- **Triggers**: Game physics simulation, collision detection performance lag ($O(N^2)$), fixed-timestep integration (Rapier / Matter.js / Cannon.js).
- **Prerequisites**: 2D/3D Vector math, continuous collision detection fundamentals.

---

## 2. Core Mental Model & Invariant Principles
1. **Fixed Timestep with Variable Render Interpolation**: Physics must update at a fixed rate (e.g., exactly 60Hz / 16.66ms per step) using an accumulator, while rendering interpolates between states to eliminate physics tunneling and determinism drift.
2. **Spatial Partitioning for Collision ($O(N^2) \rightarrow O(N \log N)$)**: Never check every entity against every other entity. Partition the game world into a Quadtree or Spatial Hash Grid to check collisions only among nearby objects.
3. **Decouple Game State from Rendering**: Game simulation logic must run headlessly without any DOM or canvas dependencies, allowing deterministic server-side reconciliation.

4. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[Raw Elapsed Frame Time (dt)]
              │
              ▼
┌─────────────────────────────┐
│ Step 1: Accumulate Delta    │ ── accumulator += dt (Clamp max frame time)
└─────────────┬───────────────┘
              ▼
┌─────────────────────────────┐
│ Step 2: Fixed Physics Step  │ ── while (accumulator >= FIXED_DT) {
│         Update Loop         │      Physics.step(FIXED_DT);
└─────────────┬───────────────┘      accumulator -= FIXED_DT; }
              ▼
┌─────────────────────────────┐
│ Step 3: Spatial Partitioning│ ── Insert bodies into Quadtree -> Narrowphase collision
└─────────────┬───────────────┘
              ▼
┌─────────────────────────────┐
│ Step 4: Interpolate & Draw  │ ── Render(alpha = accumulator / FIXED_DT)
└─────────────────────────────┘
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
  "entity_count": 2000,
  "world_bounds": { "width": 4000, "height": 4000 },
  "physics_rate": "60Hz Fixed Timestep"
}
```

### Output Contract
```typescript
// Production Fixed-Timestep Game Engine Loop
export class GameEngine {
  private static readonly FIXED_DT = 1 / 60; // 16.666ms
  private static readonly MAX_ACCUMULATOR = 0.25; // Prevent spiral of death

  private accumulator = 0;
  private lastTime = 0;
  private running = false;

  constructor(
    private readonly physicsWorld: PhysicsWorld,
    private readonly renderer: Renderer
  ) {}

  start() {
    this.running = true;
    this.lastTime = performance.now() / 1000;
    requestAnimationFrame(this.loop.bind(this));
  }

  private loop(currentTimeMs: number) {
    if (!this.running) return;

    const currentTime = currentTimeMs / 1000;
    let frameTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    // Prevent spiral of death on tab unfocus
    if (frameTime > GameEngine.MAX_ACCUMULATOR) {
      frameTime = GameEngine.MAX_ACCUMULATOR;
    }

    this.accumulator += frameTime;

    // Fixed physics updates
    while (this.accumulator >= GameEngine.FIXED_DT) {
      this.physicsWorld.update(GameEngine.FIXED_DT);
      this.accumulator -= GameEngine.FIXED_DT;
    }

    // Render with interpolation factor alpha
    const alpha = this.accumulator / GameEngine.FIXED_DT;
    this.renderer.render(this.physicsWorld, alpha);

    requestAnimationFrame(this.loop.bind(this));
  }
}
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Variable Delta Time in Physics Calculations**: Multiplying velocity directly by fluctuating frame `dt`, causing objects to tunnel through walls during lag spikes.
- ❌ **$O(N^2)$ Naive Collision Loops**: Running nested loops over 2,000 entities ($4,000,000$ collision checks per frame) instead of using Quadtree spatial partitioning.
- ❌ **Allocating Vector Objects in Update Loops**: Creating `new Vector3()` inside the 60Hz update loop, triggering Garbage Collection freezes.

---

## 6. Real-World Production Example

```markdown
**Spatial Partitioning Speedup**:
- 2D particle battle simulation with 3,000 colliding projectiles.
- Quadtree reduced collision checks from 9,000,000 to 18,400 checks per frame. Frame rate jumped from 11fps to solid 60fps.
```
