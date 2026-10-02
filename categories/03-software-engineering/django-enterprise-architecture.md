# Skill: Django Enterprise Architecture & High-Scale Optimization Engine
`id`: `kbcodedev/django-enterprise-architecture`  
`category`: `03-software-engineering`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Architecting robust enterprise applications with Django 5+, Django REST Framework (DRF), Django Ninja, Celery async tasks, advanced ORM optimization (preventing N+1 queries with `select_related`/`prefetch_related`), custom middleware, service layer isolation, multi-tenant databases, and enterprise admin customization.
- **Triggers**: Building monolithic or modular enterprise backends, refactoring fat Django models or views into clean service/selector layers, diagnosing slow database queries, setting up multi-tenant tenancy, and designing resilient background task processing.
- **Prerequisites**: Python 3.11+, Django 5.0+, DRF 3.15+ or Django Ninja 1.1+, PostgreSQL 15+, Redis.

---

## 2. Core Mental Model & Invariant Principles
1. **Service-Selector Layer Architecture**: Never place complex business logic inside Django views, serializers, or model `save()` methods. Use **Services** (mutations, external API calls, transactional workflows) and **Selectors** (read-only query construction with strict prefetching). Views remain thin HTTP adapters.
2. **Deterministic ORM Query Budget (Zero N+1)**: Every database query executed in a view or serializer must be pre-planned. Always use `select_related` for one-to-one and foreign-key relations (SQL `JOIN`), and `prefetch_related` with `Prefetch()` objects for many-to-many and reverse foreign-key relations. Enforce query count assertions in automated tests.
3. **Explicit Database Transactions**: Wrap multi-step mutations in `transaction.atomic()`. Never perform slow external network calls (e.g., Stripe, SendGrid, S3 uploads) inside a database transaction block — use `transaction.on_commit()` to trigger background Celery tasks only after the transaction is successfully committed.
4. **Signals Discipline**: Limit Django Signals (`post_save`, `pre_delete`) to cross-app caching or search indexing triggers. Never use signals for core business workflows or recursive model updates where call flow becomes untraceable.

---

## 3. High-Signal Execution Workflow

```
[HTTP Request / WSGI-ASGI]
              │
              ▼
┌──────────────────────────────────────┐
│ Phase 1: Middleware & Authentication │ ── Multi-tenant routing, request tracking ID,
│                                      │    JWT/Session auth, Rate Limiting
└──────────────────┬───────────────────┘
                   ▼
┌──────────────────────────────────────┐
│ Phase 2: View / API Dispatch         │ ── Thin view validation (DRF Serializer /
│          (Thin Adapter)              │    Django Ninja Schema)
└──────────────────┬───────────────────┘
                   ▼
┌──────────────────────────────────────┐
│ Phase 3: Service / Selector Domain   │ ── Selectors (N+1 free queries),
│          Execution                   │    Services (atomic transaction + on_commit)
└──────────────────┬───────────────────┘
                   ▼
┌──────────────────────────────────────┐
│ Phase 4: Celery Background Tasks     │ ── Async execution, webhook dispatch,
│          & Response Formatting       │    cache invalidation, standardized JSON
└──────────────────────────────────────┘
```

### Phase 1: Service-Selector Pattern & Query Optimization

```python
# core/selectors/orders.py
from django.db.models import QuerySet, Prefetch
from core.models import Order, OrderItem

def get_customer_orders_selector(*, customer_id: int) -> QuerySet[Order]:
    """Retrieve customer orders with optimized joins and prefetching to eliminate N+1 queries."""
    return (
        Order.objects.filter(customer_id=customer_id)
        .select_related("customer", "shipping_address", "payment_method")
        .prefetch_related(
            Prefetch(
                "items",
                queryset=OrderItem.objects.select_related("product"),
            )
        )
        .order_by("-created_at")
    )
```

```python
# core/services/orders.py
from decimal import Decimal
from django.db import transaction
from core.models import Order, OrderItem, Customer
from core.tasks import send_order_receipt_email_task

def create_order_service(
    *,
    customer: Customer,
    items_data: list[dict],
    payment_token: str,
) -> Order:
    """Atomic service for order creation with deferred background task execution."""
    with transaction.atomic():
        total_amount = sum(
            Decimal(item["unit_price"]) * item["quantity"] for item in items_data
        )

        order = Order.objects.create(
            customer=customer,
            total_amount=total_amount,
            status=Order.Status.PENDING,
        )

        order_items = [
            OrderItem(
                order=order,
                product_id=item["product_id"],
                quantity=item["quantity"],
                unit_price=Decimal(item["unit_price"]),
            )
            for item in items_data
        ]
        OrderItem.objects.bulk_create(order_items)

        # Execute side-effects ONLY after DB transaction commits successfully
        transaction.on_commit(
            lambda: send_order_receipt_email_task.delay(order_id=order.id)
        )

    return order
```

### Phase 2: Django Ninja / DRF Thin API View

```python
# api/endpoints/orders.py
from ninja import Router, Schema
from django.http import HttpRequest
from core.selectors.orders import get_customer_orders_selector
from core.services.orders import create_order_service

router = Router(tags=["Orders"])

class OrderItemIn(Schema):
    product_id: int
    quantity: int
    unit_price: str

class OrderCreateIn(Schema):
    items: list[OrderItemIn]
    payment_token: str

class OrderOut(Schema):
    id: int
    total_amount: str
    status: str
    created_at: str

@router.post("", response={201: OrderOut})
def create_order_endpoint(request: HttpRequest, payload: OrderCreateIn):
    order = create_order_service(
        customer=request.user.customer,
        items_data=[item.dict() for item in payload.items],
        payment_token=payload.payment_token,
    )
    return 201, order

@router.get("", response=list[OrderOut])
def list_orders_endpoint(request: HttpRequest):
    return get_customer_orders_selector(customer_id=request.user.customer.id)
```

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "framework": "django_5_drf_or_ninja",
  "database": "postgresql_15",
  "tenancy_model": "schema_per_tenant | row_level_shared",
  "task_queue": "celery_redis",
  "architecture_pattern": "service_selector_layer",
  "performance_target": "zero_n_plus_one_queries"
}
```

### Output Contract
```json
{
  "project_structure": {
    "core/models/": "Clean Django models with explicit DB indexes and constraints",
    "core/selectors/": "Read-only query functions with select_related / prefetch_related",
    "core/services/": "Business workflows wrapped in transaction.atomic and on_commit",
    "api/": "Thin DRF / Django Ninja endpoints with strict input/output serialization"
  },
  "invariants": {
    "no_business_logic_in_views": "Enforced by service-layer boundary",
    "zero_n_plus_one": "Verified via django-assert-num-queries in test suites"
  }
}
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Fat Models and Fat Views**: Dumping hundreds of lines of business logic into model methods or serializer `create()`/`update()` methods. Use pure Python service modules.
- ❌ **N+1 Queries in Serializers**: Accessing foreign relations inside `SerializerMethodField` without prior `select_related` or `prefetch_related` in the view queryset.
- ❌ **External API Calls Inside `transaction.atomic()`**: Calling payment gateways or third-party webhooks inside an open database transaction, holding row locks and exhausting database connections.
- ❌ **Overuse of Signals**: Implementing cascade updates via `post_save` signals that create hidden side-effects and infinite recursion loops.
- ❌ **Unindexed Foreign Keys and Filtering Fields**: Forgetting `db_index=True` or composite `indexes = [models.Index(...)]` on frequently filtered query fields.

---

## 6. Real-World Production Example

```markdown
**Task**: Eliminate N+1 query bottlenecks in a B2B SaaS Django invoicing API serving 2,000 requests/second.

1. **Diagnosis**: Django Debug Toolbar and pg_stat_statements revealed 42 queries per invoice detail request due to un-prefetched line items and tax rules.
2. **Selector Refactoring**: Created `get_invoice_detail_selector` combining `select_related('organization', 'client')` with `Prefetch('line_items', queryset=LineItem.objects.select_related('tax_code'))`.
3. **Query Reduction**: Reduced database query count from 42 queries to 2 single-digit millisecond queries.
4. **Service Hardening**: Moved payment settlement into `settle_invoice_service` with `transaction.atomic()` and `transaction.on_commit(trigger_celery_webhook)`.

**Outcome**: Invoice API p95 response time dropped from 850ms to 24ms, decreasing PostgreSQL CPU utilization by 65%.
```
