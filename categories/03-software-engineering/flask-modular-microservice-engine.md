# Skill: Flask Modular Microservices & Application Factory Architecture
`id`: `kbcodedev/flask-modular-microservice-engine`  
`category`: `03-software-engineering`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Designing, refactoring, building, or maintaining enterprise-grade, modular REST APIs and microservices in Python using Flask 3+, the Application Factory pattern, decoupled domain Blueprints, Pydantic v2 schema validation, Flask-SQLAlchemy 3.1+ (scoped session lifecycle management), RFC 7807 Problem Details error formatting, structured JSON observability, and production Gunicorn/Docker deployment.
- **Triggers**: Creating a new Flask service, breaking up a monolithic `app.py`, implementing strict request/response validation, resolving database connection leakage across Gunicorn worker forks, setting up Kubernetes liveness/readiness probes, securing Flask headers, or authoring deterministic Pytest test suites with transactional database rollbacks.
- **Prerequisites**: Python 3.11+, Flask 3.0+, Flask-SQLAlchemy 3.1+, Flask-Migrate (Alembic) 4.0+, Pydantic v2.6+, Gunicorn 21+, Pytest 8+.

---

## 2. Core Mental Model & Invariant Principles

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 FLASK SERVICE TOPOLOGY                                 │
├────────────────────────┬───────────────────────────────┬───────────────────────────────┤
│  1. FACTORY PATTERN    │ 2. DUAL CONTEXT DISCIPLINE    │ 3. DATABASE LIFECYCLE         │
│  - create_app(config)  │ - App Context: current_app, g │ - Unbound extensions          │
│  - Environment configs │ - Request Context: request    │ - Scoped session per request  │
│  - Clean blueprint DI  │ - Zero global cross-talk      │ - Gunicorn post-fork dispose  │
├────────────────────────┼───────────────────────────────┼───────────────────────────────┤
│  4. PYDANTIC V2 VALID  │ 5. RFC 7807 ERROR MAPPING     │ 6. OBSERVABILITY & SECURITY   │
│  - Model validation    │ - application/problem+json    │ - Inbound X-Request-ID        │
│  - Schema invariants   │ - Typed error envelopes       │ - Structured JSON logs        │
│  - Typed deserializer  │ - Zero leaked stack traces    │ - Talisman security headers   │
└────────────────────────┴───────────────────────────────┴───────────────────────────────┘
```

1. **Application Factory as the Sole Entrypoint**: Never instantiate `app = Flask(__name__)` at module top-level. Always encapsulate instantiation inside a `create_app(config_object)` factory. This eliminates circular import deadlocks, enables isolated test runners with ephemeral database fixtures, and allows multi-instance execution in the same process space.
2. **Dual Context Discipline**: Strictly distinguish between **Application Context** (`current_app`, `g`) and **Request Context** (`request`, `session`). Never pass `request` into domain services, database models, or asynchronous background threads. Extract validated primitives or Pydantic models at the route layer and pass pure data into business services.
3. **Database Session Scoping & Explicit Transactions**: Flask-SQLAlchemy binds a scoped session to the active request context and automatically calls `db.session.remove()` during request teardown. All state mutations must use explicit transaction boundaries (`db.session.begin()`, or explicit `commit()` / `rollback()`). In the event of any unhandled exception, `db.session.rollback()` must be executed before returning an error response.
4. **Gunicorn Multi-Worker Forking & Connection Pool Invariant**: When Gunicorn forks a worker, any pooled database connection inherited from the master is shared across process boundaries — SQLAlchemy's documented behaviour is that this lets two independent interpreters use the same socket concurrently, producing broken protocol streams and connection resets. This applies **only when the application is loaded in the master process** (`gunicorn --preload`); without `--preload` each worker imports the app itself and there is nothing to abandon. Under `--preload`, the fork-safe form is `db.engine.dispose(close=False)` inside the `post_fork(server, worker)` hook — `close=False` abandons the inherited pool rather than emitting `close()` on file descriptors the master and sibling workers still own, which a plain `dispose()` would close out from under them.
5. **Declarative Ingress & Egress with Pydantic v2**: Never read raw, untyped dictionaries from `request.get_json()`. Validate all request bodies, query strings, and path parameters through Pydantic v2 models (`BaseModel.model_validate(payload)`). Rejection of invalid payloads must return HTTP 422 Unprocessable Entity with detailed field-level error pointers.
6. **RFC 7807 Problem Details for HTTP APIs**: All non-2xx responses must strictly emit the standard `application/problem+json` media type with keys: `type`, `title`, `status`, `detail`, `instance`, and optional `invalid_params`. Never return generic HTML error pages or inconsistent JSON shapes (`{"error": "msg"}` vs `{"message": "err"}`).
7. **Production Security Baseline**: Enforce strict security headers (HSTS, CSP, X-Frame-Options, X-Content-Type-Options) via `Flask-Talisman` or custom middleware; configure CORS to least-privilege explicit origins; ensure `DEBUG = False` and `TESTING = False` in production configs. JSON output is controlled through the provider API (`app.json.sort_keys = False`) — the old `JSON_SORT_KEYS` config key was removed in Flask 2.3.
8. **Structured Logging & Distributed Tracing Context**: Every request must be assigned a unique `X-Request-ID` (extracted from inbound headers or generated via UUID4), stored in `g.request_id`, injected into response headers, and bound to every structured JSON log entry alongside `method`, `path`, `status_code`, and `duration_ms`.
9. **Liveness vs. Readiness Probes**:
   - `/healthz/live`: Lightweight probe returning HTTP 200 indicating the WSGI process is alive and responsive.
   - `/healthz/ready`: Comprehensive probe verifying active database connectivity (`SELECT 1`), cache availability (Redis ping), and critical downstream service health before Kubernetes traffic routing.

10. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[Agent Implementation Flow]
              │
              ▼
┌──────────────────────────────────────┐
│ Phase 0: Existing-Codebase Audit     │ ── Inspect directory layout, models, config,
│                                      │    Alembic migrations, and dependencies
└──────────────────┬───────────────────┘
                   ▼
┌──────────────────────────────────────┐
│ Phase 1: Unbound Extensions & Config │ ── extensions.py (db, migrate, talisman),
│                                      │    config.py (Dev, Test, Prod classes)
└──────────────────┬───────────────────┘
                   ▼
┌──────────────────────────────────────┐
│ Phase 2: Application Factory Core    │ ── create_app(), extension binding, error
│                                      │    handlers, request hooks (request_id)
└──────────────────┬───────────────────┘
                   ▼
┌──────────────────────────────────────┐
│ Phase 3: Blueprints & Validation     │ ── Domain blueprints, Pydantic v2 schema
│                                      │    validation decorator, route handlers
└──────────────────┬───────────────────┘
                   ▼
┌──────────────────────────────────────┐
│ Phase 4: Service Layer & DB Scopes   │ ── Decoupled service classes, explicit
│                                      │    transaction boundaries, rollbacks
└──────────────────┬───────────────────┘
                   ▼
┌──────────────────────────────────────┐
│ Phase 5: Testing, Docker & Verify    │ ── Pytest fixtures (DB rollback), Docker
│                                      │    multi-stage, Gunicorn post_fork hook
└──────────────────────────────────────┘
```

### Phase 0: Existing-Codebase Inspection
Before altering or adding files, execute a thorough inspection:
1. Check `requirements.txt` / `pyproject.toml` for exact package versions (`flask`, `flask-sqlalchemy`, `pydantic`, `gunicorn`).
2. Search for existing global Flask instances (`app = Flask`) or database extensions (`db = SQLAlchemy()`).
3. Inspect `migrations/` or existing models to preserve relational schema naming conventions.

### Phase 1: Unbound Extensions & Configuration Architecture

```python
# src/extensions.py
"""Central locus for unbound Flask extensions to prevent circular imports."""
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    """Base declarative class for SQLAlchemy 2.0+ models."""
    pass

db = SQLAlchemy(model_class=Base)
migrate = Migrate()
cors = CORS()
```

```python
# src/config.py
"""Environment-aware configuration classes with strict type validation."""
import os
from datetime import timedelta

class Config:
    """Base configuration with immutable security defaults."""
    SECRET_KEY = os.environ.get("SECRET_KEY", "insecure-dev-key-change-in-production")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        "pool_size": int(os.environ.get("DB_POOL_SIZE", "10")),
        "max_overflow": int(os.environ.get("DB_MAX_OVERFLOW", "20")),
        "pool_pre_ping": True,
        "pool_recycle": 1800,
    }
    # Flask 2.3 removed the JSON_SORT_KEYS config key; JSON behaviour now lives on the
    # provider, set as app.json.sort_keys = False inside create_app().
    REQUEST_TIMEOUT_SECONDS = 30

class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL", "sqlite:///dev.db")

class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    SQLALCHEMY_ENGINE_OPTIONS = {"pool_pre_ping": True}
    WTF_CSRF_ENABLED = False

class ProductionConfig(Config):
    DEBUG = False
    TESTING = False
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL")
    
    @classmethod
    def validate(cls):
        if not cls.SQLALCHEMY_DATABASE_URI:
            raise ValueError("DATABASE_URL environment variable is mandatory in ProductionConfig")
        if cls.SECRET_KEY == "insecure-dev-key-change-in-production":
            raise ValueError("SECRET_KEY must be securely provided in ProductionConfig")

config_map = {
    "development": DevelopmentConfig,
    "testing": TestingConfig,
    "production": ProductionConfig,
}
```

### Phase 2: Application Factory, Request Hooks & RFC 7807 Error Handlers

```python
# src/__init__.py
"""Application Factory with strict middleware, hooks, and RFC 7807 exception handling."""
import time
import uuid
import logging
from flask import Flask, request, g, jsonify, Response
from werkzeug.exceptions import HTTPException
from pydantic import ValidationError

from src.extensions import db, migrate, cors
from src.config import config_map, Config

logger = logging.getLogger(__name__)

def create_app(config_name: str = "development") -> Flask:
    app = Flask(__name__)
    config_class = config_map.get(config_name, Config)
    if hasattr(config_class, "validate"):
        config_class.validate()
    app.config.from_object(config_class)

    # Initialize extensions with the application instance
    db.init_app(app)
    migrate.init_app(app, db)
    cors.init_app(app, resources={r"/api/*": {"origins": app.config.get("ALLOWED_ORIGINS", "*")}})

    # Register Request Lifecycle Middleware & Observability Hooks
    register_request_hooks(app)

    # Register Global RFC 7807 Exception Handlers
    register_error_handlers(app)

    # Register Blueprints
    register_blueprints(app)

    return app

def register_request_hooks(app: Flask):
    @app.before_request
    def start_timer_and_request_id():
        g.start_time = time.perf_counter()
        g.request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))

    @app.after_request
    def append_headers_and_log(response: Response) -> Response:
        response.headers["X-Request-ID"] = getattr(g, "request_id", "unknown")
        
        # Calculate duration
        duration_ms = (time.perf_counter() - getattr(g, "start_time", time.perf_counter())) * 1000
        
        # Avoid logging noisy health check probes at INFO level
        if not request.path.startswith("/healthz"):
            logger.info(
                "request_completed",
                extra={
                    "request_id": g.request_id,
                    "method": request.method,
                    "path": request.path,
                    "status_code": response.status_code,
                    "duration_ms": round(duration_ms, 2),
                    "client_ip": request.remote_addr,
                },
            )
        return response

    @app.teardown_request
    def teardown_request_cleanup(exc=None):
        """Ensure database sessions with pending errors are cleanly rolled back."""
        if exc is not None:
            try:
                db.session.rollback()
            except Exception as rollback_err:
                logger.error("Failed to rollback database session on teardown: %s", rollback_err)

def register_error_handlers(app: Flask):
    @app.errorhandler(ValidationError)
    def handle_pydantic_validation_error(err: ValidationError):
        """Format Pydantic v2 validation errors into RFC 7807 Problem Details."""
        db.session.rollback()
        invalid_params = [
            {
                "field": ".".join(str(loc) for loc in e["loc"]),
                "reason": e["msg"],
                "type": e["type"],
            }
            for e in err.errors()
        ]
        payload = {
            "type": "https://errors.example.com/validation-error",
            "title": "Validation Failed",
            "status": 422,
            "detail": "One or more fields in the request body failed validation.",
            "instance": request.path,
            "invalid_params": invalid_params,
        }
        res = jsonify(payload)
        res.content_type = "application/problem+json"
        return res, 422

    @app.errorhandler(HTTPException)
    def handle_http_exception(err: HTTPException):
        """Format Werkzeug HTTP exceptions into RFC 7807 Problem Details."""
        db.session.rollback()
        payload = {
            "type": f"https://errors.example.com/http-{err.code}",
            "title": err.name,
            "status": err.code,
            "detail": err.description,
            "instance": request.path,
        }
        res = jsonify(payload)
        res.content_type = "application/problem+json"
        return res, err.code

    @app.errorhandler(Exception)
    def handle_unhandled_exception(err: Exception):
        """Format unexpected server errors into RFC 7807 Problem Details (no leaked traces)."""
        db.session.rollback()
        logger.exception("Unhandled server exception: %s", err, extra={"request_id": getattr(g, "request_id", "unknown")})
        payload = {
            "type": "https://errors.example.com/internal-server-error",
            "title": "Internal Server Error",
            "status": 500,
            "detail": "An unexpected server error occurred. Please reference the request ID when reporting.",
            "instance": request.path,
            "request_id": getattr(g, "request_id", "unknown"),
        }
        res = jsonify(payload)
        res.content_type = "application/problem+json"
        return res, 500

def register_blueprints(app: Flask):
    from src.api.v1.health import health_bp
    from src.api.v1.users import users_bp
    
    app.register_blueprint(health_bp, url_prefix="/healthz")
    app.register_blueprint(users_bp, url_prefix="/api/v1/users")
```

### Phase 3: Pydantic v2 Ingress Validation & Blueprint Route Layer

```python
# src/common/validation.py
"""Reusable, type-safe Pydantic v2 validation decorator for Flask routes."""
from functools import wraps
from typing import Type
from flask import request
from pydantic import BaseModel, ValidationError

def validate_body(schema_cls: Type[BaseModel]):
    """Decorator to parse, validate, and inject a Pydantic v2 model into route kwargs."""
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            payload = request.get_json(silent=True)
            if payload is None:
                raise ValidationError.from_exception_data(
                    title="BodyValidationError",
                    line_errors=[{"type": "missing", "loc": ("body",), "msg": "Request body must be valid JSON", "input": None}]
                )
            # Validates model or raises pydantic.ValidationError caught by app error handler
            validated_data = schema_cls.model_validate(payload)
            return fn(*args, validated_body=validated_data, **kwargs)
        return wrapper
    return decorator
```

```python
# src/api/v1/users.py
"""User Management Blueprint with declarative Pydantic schemas and pure routing."""
from flask import Blueprint, jsonify
from pydantic import BaseModel, EmailStr, Field, ConfigDict
from src.common.validation import validate_body
from src.services.user_service import UserService

users_bp = Blueprint("users", __name__)

# --- Pydantic v2 Ingress & Egress Schemas ---
class UserCreateInput(BaseModel):
    model_config = ConfigDict(strict=True, str_strip_whitespace=True)
    
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50, pattern=r"^[a-zA-Z0-9_-]+$")
    password: str = Field(..., min_length=8, max_length=128)

class UserOutput(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    email: str
    username: str
    is_active: bool

# --- Route Handlers ---
@users_bp.route("", methods=["POST"])
@validate_body(UserCreateInput)
def create_user(validated_body: UserCreateInput):
    """Create a new user account with transactional consistency."""
    user = UserService.create_user(
        email=validated_body.email,
        username=validated_body.username,
        raw_password=validated_body.password,
    )
    output = UserOutput.model_validate(user).model_dump()
    return jsonify(output), 201

@users_bp.route("/<int:user_id>", methods=["GET"])
def get_user(user_id: int):
    """Retrieve user details by ID."""
    user = UserService.get_by_id(user_id)
    output = UserOutput.model_validate(user).model_dump()
    return jsonify(output), 200
```

```python
# src/api/v1/health.py
"""Production liveness and readiness health probes for orchestrator monitoring."""
from flask import Blueprint, jsonify
from sqlalchemy import text
from src.extensions import db

health_bp = Blueprint("health", __name__)

@health_bp.route("/live", methods=["GET"])
def liveness():
    """Kubernetes liveness probe: indicates the WSGI process is running."""
    return jsonify({"status": "UP"}), 200

@health_bp.route("/ready", methods=["GET"])
def readiness():
    """Kubernetes readiness probe: verifies database and dependent services."""
    checks = {"database": "DOWN"}
    status_code = 200
    
    try:
        # Perform non-blocking database ping
        db.session.execute(text("SELECT 1"))
        checks["database"] = "UP"
    except Exception as db_err:
        checks["database"] = f"DOWN: {str(db_err)}"
        status_code = 503

    response_payload = {
        "status": "UP" if status_code == 200 else "DEGRADED",
        "checks": checks,
    }
    return jsonify(response_payload), status_code
```

### Phase 4: Models, Service Layer & Explicit Transaction Boundaries

```python
# src/models/user.py
"""SQLAlchemy 2.0 declarative database models."""
from datetime import datetime, timezone
from sqlalchemy import String, Boolean, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from src.extensions import db

class User(db.Model):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    username: Mapped[str] = mapped_column(String(50), unique=True, nullable=False, index=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
```

```python
# src/services/user_service.py
"""Domain business logic with explicit transaction management and no HTTP context leaks."""
from werkzeug.exceptions import Conflict, NotFound
from werkzeug.security import generate_password_hash
from sqlalchemy.exc import IntegrityError
from src.extensions import db
from src.models.user import User

class UserService:
    @staticmethod
    def create_user(email: str, username: str, raw_password: str) -> User:
        """Create a user with Argon2/PBKDF2 password hashing in an explicit transaction."""
        hashed = generate_password_hash(raw_password, method="scrypt")
        user = User(email=email, username=username, password_hash=hashed)
        
        db.session.add(user)
        try:
            db.session.commit()
        except IntegrityError:
            db.session.rollback()
            raise Conflict("A user with this email or username already exists.")
        except Exception:
            db.session.rollback()
            raise
        
        return user

    @staticmethod
    def get_by_id(user_id: int) -> User:
        """Fetch user by ID or raise RFC 7807 compliant NotFound."""
        user = db.session.get(User, user_id)
        if not user or not user.is_active:
            raise NotFound(f"User with ID {user_id} was not found.")
        return user
```

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "framework": "Flask 3.x",
  "app_pattern": "Application Factory (create_app)",
  "orm": "Flask-SQLAlchemy 3.1+ (SQLAlchemy 2.0 DeclarativeBase)",
  "migrations": "Flask-Migrate (Alembic)",
  "validation": "Pydantic v2 (strict model_validate)",
  "error_format": "RFC 7807 Problem Details (application/problem+json)",
  "deployment": "Gunicorn 21+ with post_fork pool disposal & Docker multi-stage"
}
```

### Output Contract (Modular Directory Structure)
```
src/
├── __init__.py          # create_app() factory, error handlers, request lifecycle hooks
├── config.py            # Environment-aware configuration classes (Dev, Test, Prod)
├── extensions.py        # Central locus for unbound extensions (db, migrate, cors)
├── common/
│   ├── validation.py    # Reusable @validate_body Pydantic v2 route decorator
│   └── exceptions.py    # Custom domain exceptions mapped to HTTP status codes
├── models/
│   └── user.py          # Declarative SQLAlchemy models with type-annotated mapped_columns
├── services/
│   └── user_service.py  # Decoupled business logic & explicit transaction boundaries
└── api/
    └── v1/
        ├── health.py    # /healthz/live and /healthz/ready probes
        └── users.py     # Domain Blueprint, Pydantic schemas, HTTP routing
```

---

## 5. Anti-Patterns & Critical Traps

- ❌ **Global App Instantiation (`app = Flask(__name__)`)**: Instantiating the app in the global module namespace causes circular import deadlocks when importing models, breaks test isolation, and prevents running multiple test configurations concurrently.
- ❌ **Inheriting Open DB Sockets Across Gunicorn Worker Forks**: With `--preload` the engine is created in the master before the fork, so every child inherits the same pooled connections and TCP file descriptors, producing intermittent corruption (`SSL error: decryption failed`, connection resets, cross-talk). The fork-safe remedy is `db.engine.dispose(close=False)` in `post_fork` — **not** a bare `dispose()`, which closes the inherited descriptors the master and sibling workers are still using. Without `--preload` no hook is needed; if you cannot use the hook, the alternative is `poolclass=NullPool`.
- ❌ **Passing Flask's `request` Object into Service Classes**: Coupling domain logic directly to Flask HTTP context prevents services from being reused in CLI commands, Celery tasks, or background workers. Always extract and validate data in the Blueprint route, then pass clean primitives or schemas to services.
- ❌ **Swallowing Database Exceptions Without `db.session.rollback()`**: Catching an error and returning a response without executing a rollback leaves the scoped session in a corrupted state for subsequent requests reusing that worker thread.
- ❌ **Returning Raw HTML or Inconsistent Error Envelopes**: Letting unhandled exceptions produce default HTML 500 error pages. All API responses must adhere to RFC 7807 `application/problem+json`.
- ❌ **Coupling Liveness Probe to Database Availability**: If the database experiences a transient blip and `/healthz/live` fails, Kubernetes will repeatedly kill and restart healthy Flask worker containers, turning a minor database slowdown into a catastrophic cascading crash-loop. Always separate `/healthz/live` (process running) from `/healthz/ready` (dependencies connected).

---

## 6. Comprehensive Testing, Migration & Production Deployment

### Deterministic Pytest Suite with Transactional Rollback

```python
# tests/conftest.py
import pytest
from src import create_app
from src.extensions import db
from src.models.user import User

@pytest.fixture(scope="session")
def app():
    """Create a single application instance for the test session."""
    _app = create_app("testing")
    with _app.app_context():
        db.create_all()
        yield _app
        db.drop_all()

@pytest.fixture(scope="function")
def client(app):
    """HTTP test client whose database work is rolled back after every test.

    The scoped session is bound to an external connection-level transaction via
    join_transaction_mode="create_savepoint" — the recipe SQLAlchemy runs in its
    own CI. A bare db.session.begin_nested() does NOT give this guarantee:
    Session.commit() in SQLAlchemy 2.0 always commits the OUTERMOST transaction,
    so application code that commits would durably persist test data.
    """
    with app.app_context():
        connection = db.engine.connect()
        transaction = connection.begin()
        
        # Bind the scoped session to the external transaction so a route-level
        # commit() only releases a SAVEPOINT and teardown's rollback() discards
        # the whole test. Confirm this API against the installed Flask-SQLAlchemy.
        db.session.configure(bind=connection, join_transaction_mode="create_savepoint")
        
        with app.test_client() as test_client:
            yield test_client
            
        db.session.remove()
        transaction.rollback()
        connection.close()
```

```python
# tests/test_users.py
def test_create_user_success(client):
    payload = {"email": "alice@example.com", "username": "alice", "password": "securepassword123"}
    response = client.post("/api/v1/users", json=payload)
    assert response.status_code == 201
    data = response.get_json()
    assert data["email"] == "alice@example.com"
    assert data["username"] == "alice"
    assert "password" not in data

def test_create_user_validation_error_rfc7807(client):
    payload = {"email": "not-an-email", "username": "a", "password": "123"}
    response = client.post("/api/v1/users", json=payload)
    assert response.status_code == 422
    assert response.headers["Content-Type"] == "application/problem+json"
    data = response.get_json()
    assert data["title"] == "Validation Failed"
    assert len(data["invalid_params"]) >= 2
```

### Production Dockerfile (Multi-Stage, Non-Root)

```dockerfile
# syntax=docker/dockerfile:1.4
FROM python:3.11-slim AS builder
WORKDIR /build
RUN apt-get update && apt-get install -y --no-install-recommends gcc libpq-dev && rm -rf /var/lib/apt/lists/*
COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

FROM python:3.11-slim AS runner
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends libpq5 curl && rm -rf /var/lib/apt/lists/*
RUN groupadd -g 10001 appgroup && useradd -u 10001 -g appgroup -s /bin/sh appuser

COPY --from=builder /root/.local /home/appuser/.local
COPY --chown=appuser:appgroup . .

ENV PATH=/home/appuser/.local/bin:$PATH \
    PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    APP_CONFIG=production

USER appuser
EXPOSE 8000

HEALTHCHECK --interval=15s --timeout=3s --retries=3 \
  CMD curl -f http://localhost:8000/healthz/live || exit 1

CMD ["gunicorn", "-c", "gunicorn.conf.py", "wsgi:app"]
```

### Production Gunicorn Configuration with Post-Fork Disposal

```python
# gunicorn.conf.py
"""Gunicorn production configuration with connection pool safety."""
import multiprocessing

bind = "0.0.0.0:8000"
workers = multiprocessing.cpu_count() * 2 + 1
worker_class = "sync"
timeout = 30
keepalive = 5
graceful_timeout = 30
max_requests = 1000
max_requests_jitter = 50

# Access and Error Logging
accesslog = "-"
errorlog = "-"
loglevel = "info"

def post_fork(server, worker):
    """
    Fork-safety hook. Required ONLY with --preload: that is the only mode where
    the engine is built in the master process and inherited by every worker.

    dispose(close=False) is the documented fork-safe form. A plain dispose()
    closes the inherited file descriptors, which the master and the other
    workers still hold — reintroducing the very cross-process socket sharing
    this hook exists to prevent.
    """
    from src.extensions import db
    try:
        # server.app is the Gunicorn WSGIApplication; .wsgi() returns the loaded
        # Flask app, importing it when --preload was not used.
        app = server.app.wsgi()
        with app.app_context():
            db.engine.dispose(close=False)
            server.log.info("SQLAlchemy pool abandoned post-fork for worker %s", worker.pid)
    except Exception as e:
        server.log.warning("Post-fork engine disposal skipped or failed: %s", e)
```

```python
# wsgi.py
"""WSGI entrypoint for Gunicorn/uWSGI servers."""
import os
from src import create_app

# Flask 2.3 removed the FLASK_ENV environment variable; the environment selector is
# entirely application-defined — this name is this project's own convention.
env = os.environ.get("APP_CONFIG", "production")
app = create_app(env)

if __name__ == "__main__":
    app.run()
```

---

## 7. 18-Point Production Validation Gate

Before marking any Flask microservice or Application Factory implementation complete, rigorously verify every criterion:

- [ ] **1. Factory Exclusivity**: No `Flask(__name__)` instantiated at module scope; all setup lives within `create_app()`.
- [ ] **2. Unbound Extensions**: All extensions (`db`, `migrate`, `cors`) reside in an `extensions.py` file and are bound via `init_app(app)`.
- [ ] **3. SQLAlchemy 2.0 Mapping**: Database models use modern `Mapped[T]` and `mapped_column()` annotations.
- [ ] **4. Pydantic v2 Ingress**: All JSON route inputs are validated using Pydantic v2 `model_validate` via strict decorators or schemas.
- [ ] **5. RFC 7807 Compliance**: Validation errors emit status 422 with `application/problem+json` and an `invalid_params` array.
- [ ] **6. No HTML Leaks**: 404, 500, and unexpected exceptions return structured RFC 7807 JSON, never HTML tracebacks.
- [ ] **7. Explicit Rollback on Failure**: `db.session.rollback()` is executed in error handlers and `teardown_request`.
- [ ] **8. Decoupled Service Layer**: Zero Flask `request` or `g` objects imported or accessed within `services/` or `models/`.
- [ ] **9. Request ID Propagation**: Inbound `X-Request-ID` is captured, assigned to `g.request_id`, returned in response headers, and logged.
- [ ] **10. Structured JSON Logging**: Request completions are logged with method, path, status_code, and latency in milliseconds.
- [ ] **11. Dual Health Probes**: `/healthz/live` returns 200 without touching DB; `/healthz/ready` verifies database query `SELECT 1`.
- [ ] **12. Gunicorn Post-Fork Safety**: if and only if the app is loaded with `--preload`, `gunicorn.conf.py` implements `post_fork` calling `db.engine.dispose(close=False)`. Confirm which load mode is actually in use before adding or demanding this hook.
- [ ] **13. Connection Pre-Ping**: Database configuration includes `pool_pre_ping: True` and `pool_recycle: 1800`.
- [ ] **14. Environment Configuration Validation**: `ProductionConfig` validates mandatory environment variables at factory startup.
- [ ] **15. Security Baseline**: Security headers configured; CORS restricted to explicit origin whitelists.
- [ ] **16. Isolated Test Client**: Pytest fixtures bind the session to an external transaction with `join_transaction_mode="create_savepoint"` (not a bare `begin_nested()`), so committed test data is discarded on teardown.
- [ ] **17. Non-Root Containerization**: Dockerfile uses multi-stage builds and drops privileges to a non-root `appuser`.
- [ ] **18. Zero Missing Migrations**: Database migration scripts are generated and verified against the models with `flask db check`.

---

## 8. Real-World Production Example

```markdown
**Task**: Build a high-throughput order processing microservice with idempotent transaction boundaries and RFC 7807 error handling.

1. **Application Factory**: Implemented `create_app("production")` in `src/__init__.py` with Flask-SQLAlchemy 3.1 and structured JSON logging.
2. **Pydantic Validation**: Built `OrderCreateSchema` with Pydantic v2 validating item IDs, SKU formats, and positive integer quantities.
3. **Explicit Transactions**: Handled inventory reservations in `OrderService` with `db.session.begin()` and explicit rollback on stock depletion.
4. **Gunicorn Tuning**: Configured `gunicorn.conf.py` with 9 sync workers, `post_fork` engine disposal, and a 30s graceful worker shutdown timeout.
5. **Observability**: Added `/healthz/live` and `/healthz/ready` probes, logging `request_id` across all order fulfillment events.

**Outcome**: Microservice deployed to Kubernetes handling 2,400 orders/minute with zero database socket corruptions across worker recycles and 100% compliant RFC 7807 error envelopes.
```
