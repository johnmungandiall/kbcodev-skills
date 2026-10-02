# Skill: Flask Modular Microservices & Application Factory Architecture
`id`: `kbcodedev/flask-modular-microservice-engine`  
`category`: `03-software-engineering`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Building lightweight, modular, maintainable microservices and REST APIs using Python, Flask 3+, Application Factory pattern, Blueprints, Marshmallow / Pydantic validation, Flask-SQLAlchemy, Gunicorn/Uvicorn deployment, and standardized error handling.
- **Triggers**: Creating standalone Python microservices, structuring medium-to-large Flask codebases, decoupling database models from web routing, implementing clean Blueprint architectures, and containerizing Flask services.
- **Prerequisites**: Python 3.11+, Flask 3.0+, Flask-SQLAlchemy 3.1+, Marshmallow 3.20+ or Pydantic v2, Gunicorn.

---

## 2. Core Mental Model & Invariant Principles
1. **Application Factory as Single Entrypoint**: Never instantiate the `Flask(__name__)` app object in the global module namespace. Always use `create_app(config_name)` to enable isolated test environments, dynamic configuration switching, and multi-instance concurrency.
2. **Blueprint Modularity & Route Decoupling**: Organize routes into domain Blueprints (`auth_bp`, `users_bp`, `orders_bp`). Blueprints register dependencies cleanly without circular imports.
3. **Explicit Context Management**: Understand Flask's dual contexts — **Application Context** (`current_app`, `g`) and **Request Context** (`request`, `session`). Never leak request-scoped state into global or background worker threads.
4. **Declarative Ingress/Egress Serialization**: Validate JSON request payloads and serialize response schemas using Marshmallow or Pydantic. Route handlers never parse untyped `request.json` manually.

---

## 3. High-Signal Execution Workflow

```
[HTTP Request / WSGI Server]
              │
              ▼
┌──────────────────────────────────────┐
│ Phase 1: Application Factory Init    │ ── Config loading, extension binding
│          & Blueprint Registration    │    (SQLAlchemy, Migrate, CORS)
└──────────────────┬───────────────────┘
                   ▼
┌──────────────────────────────────────┐
│ Phase 2: Request Hook & Ingress      │ ── Request ID injection, Auth header check,
│          Validation                  │    Schema validation (Pydantic/Marshmallow)
└──────────────────┬───────────────────┘
                   ▼
┌──────────────────────────────────────┐
│ Phase 3: Service Layer & Database    │ ── Business domain execution, SQLAlchemy
│          Transaction Scope           │    session commit/rollback
└──────────────────┬───────────────────┘
                   ▼
┌──────────────────────────────────────┐
│ Phase 4: Centralized Error Handling  │ ── RFC 7807 JSON error mapping, custom
│          & Response Formatting       │    exception handlers, response logging
└──────────────────────────────────────┘
```

### Phase 1: Application Factory & Extension Registry

```python
# src/__init__.py
from flask import Flask, jsonify
from flask_cors import CORS
from src.extensions import db, migrate
from src.config import get_config
from src.api.v1.users import users_bp
from src.api.v1.health import health_bp
from src.common.exceptions import AppException

def create_app(config_object=None) -> Flask:
    app = Flask(__name__)
    app.config.from_object(config_object or get_config())

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    CORS(app)

    # Register Blueprints
    app.register_blueprint(health_bp, url_prefix="/health")
    app.register_blueprint(users_bp, url_prefix="/api/v1/users")

    # Global Exception Handlers
    register_error_handlers(app)
    return app

def register_error_handlers(app: Flask):
    @app.errorhandler(AppException)
    def handle_app_exception(error: AppException):
        response = jsonify(error.to_dict())
        response.status_code = error.status_code
        return response

    @app.errorhandler(404)
    def handle_not_found(e):
        return jsonify({"error": "Resource not found", "code": "NOT_FOUND"}), 404

    @app.errorhandler(500)
    def handle_server_error(e):
        return jsonify({"error": "Internal server error", "code": "INTERNAL_ERROR"}), 500
```

### Phase 2: Blueprint & Service Handler

```python
# src/api/v1/users.py
from flask import Blueprint, request, jsonify
from pydantic import BaseModel, EmailStr, Field, ValidationError
from src.services.user_service import UserService
from src.common.exceptions import ValidationError as CustomValidationError

users_bp = Blueprint("users", __name__)

class UserCreateSchema(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=8)

@users_bp.route("", methods=["POST"])
def create_user():
    try:
        data = UserCreateSchema.model_validate(request.get_json())
    except ValidationError as err:
        raise CustomValidationError(err.errors())

    user = UserService.create_user(
        email=data.email,
        username=data.username,
        raw_password=data.password,
    )
    return jsonify({"id": user.id, "email": user.email, "username": user.username}), 201
```

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "app_pattern": "application_factory",
  "orm": "flask_sqlalchemy_3",
  "validation": "pydantic_v2 | marshmallow_3",
  "deployment": "gunicorn_gevent_or_sync",
  "testing": "pytest_client_fixtures"
}
```

### Output Contract
```json
{
  "modular_structure": {
    "src/app.py": "create_app factory with blueprint binding and error handlers",
    "src/extensions.py": "Unbound extension instances (db, migrate, cors)",
    "src/api/": "Domain blueprints with HTTP routes",
    "src/services/": "Pure domain logic decoupled from Flask request context",
    "src/models/": "SQLAlchemy declarative database models"
  }
}
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Global App Instantiation (`app = Flask(__name__)`)**: Prevents testing with isolated configurations and leads to circular imports when importing models or blueprints.
- ❌ **Accessing `request` in Service Classes**: Tying business domain logic directly to Flask's HTTP context instead of passing extracted primitives (strings, ints, schemas) as arguments.
- ❌ **Uncaught Exceptions Disgorging HTML**: Allowing Flask's default HTML 500 tracebacks to leak to API clients instead of returning structured JSON error payloads.
- ❌ **Ignoring Connection Pooling in WSGI Forking**: Initializing database engine before Gunicorn worker fork, leading to shared DB sockets across processes. Always initialize engine inside worker post-fork hooks or application factory.

---

## 6. Real-World Production Example

```markdown
**Task**: Build a modular authentication microservice in Flask serving JWT issuance and verification.

1. **Application Factory**: Configured `create_app()` with environment-aware settings (`ProductionConfig`, `TestingConfig`).
2. **Blueprint Isolation**: Built `auth_bp` and `tokens_bp` with Pydantic payload validation.
3. **Database & Migrations**: Configured Flask-SQLAlchemy with Alembic migrations, managing user credentials with Argon2 password hashing.
4. **Production Deployment**: Containerized with Gunicorn (`gunicorn -w 4 -b 0.0.0.0:8000 "src:create_app()"`) with structured JSON access logs.

**Outcome**: Microservice successfully deployed in Kubernetes handling 1,500 token verifications/sec with 8ms median latency.
```
