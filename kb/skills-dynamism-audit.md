# Skills Dynamism & Adaptivity Audit

Records the exhaustive audit of all 115 skills across 21 categories to determine if they are genuinely fully dynamic or contain static/rigid anti-patterns.

## Dynamism Breakdown (115 Skills)
- **Fully Dynamic (81 skills / 70.4%)**: Completely parameterized JSON input contracts, environment-adaptive discovery, framework-agnostic execution.
- **Dynamic Workflow with Stack Bias (29 skills / 25.2%)**: Dynamic step execution, but examples or contracts are tightly coupled to specific stacks (Next.js, Tailwind, PostgreSQL, Playwright).
- **Static Heuristics & Magic Numbers (5 skills / 4.4%)**: Inflexible thresholds or constants (30-80 step budgets, 60-second onboarding, 7-day sprints, < 5min hello-world).

See `SKILLS_DYNAMISM_AUDIT.md` for the full 21-category table and remediation guidelines.

## Project-Grounding Invariant (added to all 129 skills)
An audit found **0 of 129** skills carried any directive telling the executing agent to inspect the real target project before applying the skill's examples — while 85 contained hardcoded numeric thresholds. Each skill's section 2 now ends with a **Project-Grounding Invariant** (marker string `Project-Grounding Invariant`) requiring the agent to: inspect the real project (manifest/lockfile, installed toolchain, existing implementations) before changing code; adapt each example's specifics (versions, names, paths, thresholds) while keeping the principle; treat the real code as authoritative where it and the skill disagree; and re-derive every numeric bound from the project's own evidence rather than treating it as a constant. `skill-authoring-framework.md` carries the same item in its canonical template so new skills inherit it.

## Corrected technical defects (verified against upstream sources)
- `categories/03-software-engineering/flask-modular-microservice-engine.md` Gunicorn `post_fork` hook: corrected to `db.engine.dispose(close=False)` — SQLAlchemy's documented fork-safe form; a bare `dispose()` closes inherited descriptors the master and sibling workers still hold. Scope narrowed to `--preload` only. App access changed to `server.app.wsgi()` (`BaseApplication.wsgi`).
- `categories/03-software-engineering/flask-modular-microservice-engine.md` pytest fixture: replaced the bare `db.session.begin_nested()` with `join_transaction_mode="create_savepoint"` bound to an external connection transaction — in SQLAlchemy 2.0 `Session.commit()` commits the OUTERMOST transaction, so a route-level commit would durably persist test data.
- `categories/03-software-engineering/flask-modular-microservice-engine.md`: removed `JSON_SORT_KEYS` config and `FLASK_ENV` (both removed in Flask 2.3).
- `categories/03-software-engineering/django-enterprise-architecture.md`: Pydantic v1 `.dict()` → `model_dump()`.

## Library growth
- 2026-10-02: library now **130 skills** across 21 categories — added `universal-skill-quality` (category 07), a structure-agnostic audit/repair/hardening engine for any skill definition (assumption & absolute triage, project-grounding, evidence discipline, verification gates, fixed four-part report). It carries the Project-Grounding Invariant in its own section 2 and treats every numeric bound as a heuristic.