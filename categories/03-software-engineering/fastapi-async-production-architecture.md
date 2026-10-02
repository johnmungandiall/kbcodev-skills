# Skill: FastAPI Async Production Architecture & Enterprise API Engine
`id`: `kbcodedev/fastapi-async-production-architecture`  
`category`: `03-software-engineering`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Building high-throughput, low-latency async REST/GraphQL/gRPC APIs using Python, FastAPI, Pydantic v2, async SQLAlchemy 2.0, lifespan lifecycle handlers, OAuth2 JWT security, dependency injection hierarchies, background task queues, and automated OpenAPI documentation.
- **Triggers**: Designing new Python backend services, migrating synchronous Flask/Django endpoints to async FastAPI, optimizing database connection pooling, implementing structured request/response validation, and building production-ready ASGI microservices.
- **Prerequisites**: Python 3.11+, FastAPI 0.110+, Pydantic v2.6+, SQLAlchemy 2.0+ (asyncpg/aiomysql), Uvicorn/Gunicorn ASGI server.

---

## 2. Core Mental Model & Invariant Principles
1. **Async End-to-End Purity**: Never invoke blocking I/O calls (e.g., synchronous `requests.get()`, `time.sleep()`, synchronous database drivers like `psycopg2`, or heavy CPU-bound parsing) inside an `async def` route. Blocking the event loop freezes all concurrent requests handled by that worker process. Use `asyncio.to_thread()` or background worker queues for CPU-bound or legacy synchronous calls.
2. **Pydantic v2 Schema Separation**: Always maintain strict separation between Domain Models (SQLAlchemy ORM), Request Ingress Schemas (Create/Update with strict field validation), and Response Egress Schemas (with `model_config = ConfigDict(from_attributes=True)` and explicit field filtering). Never return naked ORM entities directly from route handlers.
3. **Dependency Injection as Single Source of Truth**: Inject database sessions, current authenticated user, rate limiters, and external clients exclusively via FastAPI `Depends()`. Lifespan context managers manage startup/shutdown connection pools; individual request scopes yield transaction-managed sessions with guaranteed rollback on exceptions.
4. **Resilient Error Modeling**: Map domain exceptions to RFC 7807 problem details or consistent error envelopes via global exception handlers. Never expose internal stack traces or raw database driver errors to clients.

5. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[HTTP Request / ASGI Gateway]
              │
              ▼
┌──────────────────────────────────────┐
│ Phase 1: Middleware & Ingress        │ ── CORS, Request ID, Rate Limiter,
│          Validation                  │    Security Headers, Pydantic Ingress
└──────────────────┬───────────────────┘
                   ▼
┌──────────────────────────────────────┐
│ Phase 2: Dependency Resolution &     │ ── OAuth2 JWT Token -> Current User,
│          Session Inversion           │    Async DB Session (scoped transaction)
└──────────────────┬───────────────────┘
                   ▼
┌──────────────────────────────────────┐
│ Phase 3: Service Layer Execution     │ ── Pure domain logic, async repository,
│          & External Integrations     │    background tasks, cache access (Redis)
└──────────────────┬───────────────────┘
                   ▼
┌──────────────────────────────────────┐
│ Phase 4: Egress Serialization &      │ ── Pydantic Response Schema filtering,
│          Observability               │    status codes, OpenTelemetry tracing
└──────────────────────────────────────┘
```

### Phase 1: Application Factory, Lifespan & Middleware

```python
# app/main.py
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import structlog
import redis.asyncio as aioredis
from app.core.config import settings
from app.core.database import engine
from app.api.v1.router import api_v1_router

logger = structlog.get_logger()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize DB connection pool & Redis client
    logger.info("startup.connection_pools_init")
    app.state.redis = aioredis.from_url(
        settings.REDIS_URL, encoding="utf-8", decode_responses=True
    )
    yield
    # Shutdown: Gracefully close connection pools
    logger.info("shutdown.cleanup_resources")
    await engine.dispose()
    await app.state.redis.close()

def create_application() -> FastAPI:
    app = FastAPI(
        title=settings.PROJECT_NAME,
        version=settings.VERSION,
        openapi_url=f"{settings.API_V1_STR}/openapi.json",
        lifespan=lifespan,
    )

    # Middlewares
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Include API Routers
    app.include_router(api_v1_router, prefix=settings.API_V1_STR)
    return app

app = create_application()
```

### Phase 2: Async SQLAlchemy 2.0 & Session Dependency Injection

```python
# app/core/database.py
from collections.abc import AsyncGenerator
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import DeclarativeBase
from app.core.config import settings

engine = create_async_engine(
    settings.DATABASE_ASYNC_URL,
    pool_size=settings.DB_POOL_SIZE,
    max_overflow=settings.DB_MAX_OVERFLOW,
    pool_recycle=3600,
    pool_pre_ping=True,
    echo=settings.DB_ECHO,
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

class Base(DeclarativeBase):
    pass

async def get_db_session() -> AsyncGenerator[AsyncSession, None]:
    """FastAPI dependency yielding an async transactional database session."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
```

### Phase 3: Pydantic v2 Schema Design & Service Handlers

```python
# app/schemas/order.py
from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel, ConfigDict, Field, field_validator
from enum import Enum

class OrderStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class OrderBase(BaseModel):
    customer_id: str = Field(..., min_length=3, max_length=64)
    total_amount: Decimal = Field(..., gt=Decimal("0.00"), decimal_places=2)
    currency: str = Field(default="USD", min_length=3, max_length=3)

class OrderCreate(OrderBase):
    items: list[dict] = Field(..., min_length=1)

    @field_validator("currency")
    @classmethod
    def validate_currency(cls, v: str) -> str:
        return v.upper()

class OrderResponse(OrderBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    status: OrderStatus
    created_at: datetime
    updated_at: datetime
```

```python
# app/api/v1/endpoints/orders.py
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db_session
from app.schemas.order import OrderCreate, OrderResponse
from app.services.order_service import OrderService
from app.core.security import get_current_active_user
from app.models.user import User

router = APIRouter(prefix="/orders", tags=["Orders"])

@router.post(
    "",
    response_model=OrderResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new customer order",
)
async def create_order(
    payload: OrderCreate,
    background_tasks: BackgroundTasks,
    session: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(get_current_active_user),
) -> OrderResponse:
    order_service = OrderService(session)
    order = await order_service.create_order(
        customer_id=current_user.id,
        order_data=payload,
    )
    # Dispatch async background notification without blocking client response
    background_tasks.add_task(order_service.send_order_confirmation, order.id)
    return OrderResponse.model_validate(order)
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
  "project_name": "ecommerce-order-service",
  "python_version": "3.11+",
  "db_driver": "postgresql+asyncpg",
  "authentication": "oauth2_bearer_jwt",
  "orm": "sqlalchemy_2_0_async",
  "validation": "pydantic_v2",
  "rate_limiting": "redis_token_bucket",
  "monitoring": "opentelemetry_prometheus"
}
```

### Output Contract
```json
{
  "structure": {
    "app/main.py": "Lifespan-configured FastAPI application factory with global error handlers",
    "app/core/database.py": "Async engine, scoped sessionmaker, and transaction yield dependency",
    "app/core/security.py": "JWT signature verification, password hashing, and user dependencies",
    "app/schemas/": "Pydantic v2 Ingress/Egress schemas with strict field constraints",
    "app/services/": "Async domain business logic isolated from HTTP routing",
    "app/api/v1/": "APIRouter endpoints with status codes, responses, and dependency injection"
  },
  "invariants": {
    "zero_blocking_io": "All network, DB, and file operations use non-blocking async primitives",
    "strict_egress_filtering": "No ORM entity leaked directly to client responses"
  }
}
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Mixing Synchronous Blocking I/O in Async Routes**: Invoking `time.sleep()`, synchronous `requests.get()`, or synchronous DB calls inside `async def`. This stalls the entire single-threaded asyncio event loop.
- ❌ **Returning Naked SQLAlchemy ORM Models**: Leaking lazy-loaded relations or private DB columns (passwords, salts) by returning ORM models directly instead of validating through explicit Pydantic response schemas with `from_attributes=True`.
- ❌ **Session Management in Global Scope**: Sharing a single SQLAlchemy `AsyncSession` across multiple concurrent HTTP requests. Always scope sessions per-request via `Depends(get_db_session)`.
- ❌ **Ignoring Pydantic v2 Migration Best Practices**: Using deprecated Pydantic v1 patterns (`@validator`, `schema.dict()`, `orm_mode = True`) instead of `@field_validator`, `model_dump()`, and `model_config = ConfigDict(from_attributes=True)`.
- ❌ **Unbounded Endpoint Pagination**: Returning full SQL query result sets without enforcing `limit` (max 100) and `offset` / cursor-based pagination parameters.

---

## 6. Real-World Production Example

```markdown
**Task**: Build a high-throughput async payments settlement microservice handling 5,000 req/sec with PostgreSQL and Redis.

1. **Database & Connection Pooling**:
   - Initialized `create_async_engine("postgresql+asyncpg://...")` with `pool_size=40`, `max_overflow=20`, `pool_pre_ping=True`.
   - Built session dependency yielding transactions with auto-rollback on uncaught exceptions.

2. **Ingress & Egress Validation**:
   - Authored `PaymentInitiateRequest` with decimal precision, idempotency key validation, and currency checking.
   - Built `PaymentResponse` filtering gateway authorization tokens before returning to mobile clients.

3. **Performance & Security Hardening**:
   - Configured Redis-backed sliding-window rate limiting (100 req/min per API key).
   - Offloaded webhook notification dispatch to FastAPI `BackgroundTasks` to maintain sub-20ms p99 latency.
   - Verified 100% async purity across all database transactions, Redis locks, and external HTTP calls via `httpx.AsyncClient`.

**Outcome**: Handled peak Black Friday volume of 6,200 req/sec with 14ms median latency and zero database pool exhaustion incidents.
```
