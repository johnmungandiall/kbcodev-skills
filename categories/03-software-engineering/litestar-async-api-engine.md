# Skill: Litestar High-Performance Modern ASGI Engine
`id`: `kbcodedev/litestar-async-api-engine`  
`category`: `03-software-engineering`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Building ultra-high-performance, type-safe async REST APIs and ASGI microservices in Python using Litestar (formerly Starlite) 2.x, Data Transfer Objects (DTOs), `msgspec` high-speed JSON serialization, dependency injection, plugin architecture (SQLAlchemy, OpenTelemetry), and automated OpenAPI 3.1 schema generation.
- **Triggers**: Creating modern Python async APIs where performance is critical (5x faster than standard ASGI frameworks), leveraging automatic DTO generation to eliminate boilerplate validation schemas, and architecting modular enterprise microservices.
- **Prerequisites**: Python 3.11+, Litestar 2.8+, `msgspec` 0.18+, SQLAlchemy 2.0+ (async), Uvicorn/Granian ASGI server.

---

## 2. Core Mental Model & Invariant Principles
1. **DTO-Driven Architecture**: Use Litestar Data Transfer Objects (DTOs) with `SQLAlchemyDTO` or `MsgspecDTO` to automatically derive input validation and output serialization directly from database models or domain structs. Explicitly control field exclusion (`exclude={"id", "created_at"}`) to prevent schema drift.
2. **High-Speed Serialization via `msgspec`**: Litestar uses `msgspec` by default, which serializes and validates types directly in C extensions without intermediate Python object dictionaries. Always prefer `msgspec.Struct` over generic classes for performance-critical payload models.
3. **Hierarchical Dependency Injection & Guard Layers**: Define dependency injection providers and route guards (authentication, rate limiting) at the Application, Router, Controller, or Handler level with fine-grained scoping.
4. **First-Class OpenAPI 3.1 & Plugin Ecosystem**: Leverage native SQLAlchemy and OpenTelemetry plugins to handle database connection lifecycles and distributed tracing without custom middleware wrappers.

5. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[HTTP Request / Granian ASGI]
              │
              ▼
┌──────────────────────────────────────┐
│ Phase 1: Route Guards & Dependency   │ ── JWT validation, Rate limiting,
│          Resolution                  │    Async SQLAlchemy session injection
└──────────────────┬───────────────────┘
                   ▼
┌──────────────────────────────────────┐
│ Phase 2: DTO Ingress Deserialization │ ── msgspec C-speed validation, automatic
│          & Field Extraction          │    SQLAlchemyDTO payload mapping
└──────────────────┬───────────────────┘
                   ▼
┌──────────────────────────────────────┐
│ Phase 3: Controller / Handler Logic  │ ── Pure async domain execution, repository
│          Execution                   │    pattern queries
└──────────────────┬───────────────────┘
                   ▼
┌──────────────────────────────────────┐
│ Phase 4: DTO Egress Serialization &  │ ── msgspec zero-overhead JSON encoding,
│          OpenAPI 3.1 Spec Export     │    HTTP status code return
└──────────────────┬───────────────────┘
```

### Phase 1: Litestar Application with SQLAlchemy Plugin & DTO

```python
# src/app.py
from litestar import Litestar, get, post, Controller
from litestar.plugins.sqlalchemy import (
    SQLAlchemyAsyncConfig,
    SQLAlchemyPlugin,
    SQLAlchemyDTO,
    SQLAlchemyDTOConfig,
)
from litestar.dto import DTOConfig
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import String, select

class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    username: Mapped[str] = mapped_column(String(50), unique=True)
    email: Mapped[str] = mapped_column(String(100))
    password_hash: Mapped[str] = mapped_column(String(255))

# Automatically derive Ingress & Egress DTOs
class UserCreateDTO(SQLAlchemyDTO[User]):
    config = SQLAlchemyDTOConfig(exclude={"id", "password_hash"})

class UserReadDTO(SQLAlchemyDTO[User]):
    config = SQLAlchemyDTOConfig(exclude={"password_hash"})

class UserController(Controller):
    path = "/users"
    tags = ["Users"]

    @get("/{user_id:int}", return_dto=UserReadDTO)
    async def get_user(self, user_id: int, transaction: AsyncSession) -> User:
        result = await transaction.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()
        return user

    @post("", dto=UserCreateDTO, return_dto=UserReadDTO)
    async def create_user(self, data: User, transaction: AsyncSession) -> User:
        data.password_hash = "argon2_hashed_secret"
        transaction.add(data)
        return data

# Database & Plugin Configuration
db_config = SQLAlchemyAsyncConfig(
    connection_string="sqlite+aiosqlite:///app.db",
    metadata=Base.metadata,
    create_all=True,
)

app = Litestar(
    route_handlers=[UserController],
    plugins=[SQLAlchemyPlugin(db_config)],
)
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
  "framework": "litestar_2_x",
  "serialization_engine": "msgspec",
  "orm": "sqlalchemy_2_0_async",
  "dto_pattern": "sqlalchemy_dto_derived",
  "openapi": "openapi_3_1_strict"
}
```

### Output Contract
```json
{
  "performance": {
    "throughput": "Up to 50,000 req/sec on Granian ASGI",
    "serialization_overhead": "Near-zero via msgspec C-structs"
  }
}
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Manual Pydantic Validation When DTOs Are Available**: Writing redundant boilerplate Pydantic schema files instead of deriving `SQLAlchemyDTOConfig` with field inclusion/exclusion rules.
- ❌ **Blocking Synchronous DB Calls in Async Handlers**: Using synchronous SQLAlchemy sessions without the async engine, blocking Granian/Uvicorn worker threads.

---

## 6. Real-World Production Example

```markdown
**Task**: Build an ultra-low-latency financial telemetry ingestion gateway in Litestar handling 35,000 writes/second.

1. **DTO & Serialization**: Used `msgspec.Struct` models and `SQLAlchemyPlugin` with SQLite write-ahead logging (WAL).
2. **Controller Routing**: Implemented `TelemetryController` with automatic validation and batch insertion.
3. **Granian Server**: Deployed with Granian ASGI server using 8 worker threads.

**Outcome**: Handled 35,000 req/sec with a p99 response time of 3.8ms and 40% lower memory footprint than alternative Python ASGI frameworks.
```
