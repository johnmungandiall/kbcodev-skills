# Skill: Pytest Advanced Test Engineering & Property-Based Verification
`id`: `kbcodedev/pytest-advanced-test-engineering`  
`category`: `04-testing-qa-debugging`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Building robust, deterministic, and comprehensive Python test suites using Pytest 8+, `pytest-asyncio`, dynamic fixtures with explicit scopes, parameterized test matrices, mock/spy/patch isolation (`unittest.mock` / `pytest-mock`), property-based fuzz testing with Hypothesis, and coverage reporting (`pytest-cov`).
- **Triggers**: Writing unit/integration test suites for Python backends, testing async ASGI/FastAPI/Django applications, eliminating test flakiness, detecting edge-case regressions with property-based fuzzing, and configuring CI test pipelines.
- **Prerequisites**: Python 3.11+, Pytest 8.0+, pytest-asyncio 0.23+, pytest-mock 3.14+, Hypothesis 6.100+, pytest-cov.

---

## 2. Core Mental Model & Invariant Principles
1. **AAA Pattern & Test Isolation**: Every test must strictly follow Arrange-Act-Assert. Tests must never depend on the execution order of other tests or leave persistent side-effects in the file system or shared databases. Use autouse cleanup fixtures or rollback transactions.
2. **Fixture Scope Hierarchy**: Match fixture lifecycle (`function`, `class`, `module`, `session`) to resource cost. Expensive read-only resources (e.g., test database containers, ML model weights) belong in `session` or `module` scope; mutable state (database transactions, temporary directories) must use `function` scope with automatic teardown.
3. **Property-Based Verification with Hypothesis**: Beyond hand-crafted example tests, use Hypothesis `@given(st.text(), st.integers())` to generate hundreds of randomized adversarial inputs (unicode, null bytes, extreme boundary values) to prove mathematical properties and invariants.
4. **Deterministic Async Mocking**: When mocking async functions or coroutines, always use `AsyncMock` and patch at the lookup locus (where the object is imported and used, NOT where it is defined).

5. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[Test Execution / CI Trigger]
              │
              ▼
┌──────────────────────────────────────┐
│ Phase 1: Fixture Scoping & Session   │ ── Test DB spin-up, mock environment,
│          Configuration (conftest.py) │    asyncio event loop policy
└──────────────────┬───────────────────┘
                   ▼
┌──────────────────────────────────────┐
│ Phase 2: Unit & Parametrized Tests   │ ── @pytest.mark.parametrize matrices,
│                                      │    pure domain logic verification
└──────────────────┬───────────────────┘
                   ▼
┌──────────────────────────────────────┐
│ Phase 3: Property-Based Fuzz Testing │ ── Hypothesis @given strategies, boundary
│          (Hypothesis)                │    invariant validation
└──────────────────┬───────────────────┘
                   ▼
┌──────────────────────────────────────┐
│ Phase 4: Integration & Async ASGI    │ ── AsyncClient / TestClient HTTP probing,
│          Verification + Coverage     │    DB rollback, 90%+ branch coverage check
└──────────────────────────────────────┘
```

### Phase 1: Conftest Fixture Factory & Async Client

```python
# tests/conftest.py
import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from app.main import app
from app.core.database import Base, get_db_session

TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

@pytest_asyncio.fixture(scope="session")
async def test_engine():
    engine = create_async_engine(TEST_DATABASE_URL, echo=False)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield engine
    await engine.dispose()

@pytest_asyncio.fixture(scope="function")
async def db_session(test_engine) -> AsyncSession:
    session_factory = async_sessionmaker(bind=test_engine, expire_on_commit=False)
    async with session_factory() as session:
        yield session
        await session.rollback()

@pytest_asyncio.fixture(scope="function")
async def async_client(db_session: AsyncSession):
    # Override FastAPI database dependency
    app.dependency_overrides[get_db_session] = lambda: db_session
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://testserver") as client:
        yield client
    app.dependency_overrides.clear()
```

### Phase 2: Parameterized Tests & Hypothesis Invariants

```python
# tests/unit/test_pricing.py
import pytest
from decimal import Decimal
from hypothesis import given, strategies as st
from app.services.pricing import calculate_discounted_price

@pytest.mark.parametrize(
    "price, discount_pct, expected",
    [
        (Decimal("100.00"), 10, Decimal("90.00")),
        (Decimal("50.00"), 0, Decimal("50.00")),
        (Decimal("200.00"), 100, Decimal("0.00")),
    ],
)
def test_calculate_discount_examples(price, discount_pct, expected):
    result = calculate_discounted_price(price=price, discount_pct=discount_pct)
    assert result == expected

@given(
    price=st.decimals(min_value=Decimal("0.01"), max_value=Decimal("1000000.00"), places=2),
    discount_pct=st.integers(min_value=0, max_value=100),
)
def test_pricing_invariant_hypothesis(price: Decimal, discount_pct: int):
    """Property test: Discounted price must NEVER exceed original price or drop below zero."""
    discounted = calculate_discounted_price(price=price, discount_pct=discount_pct)
    assert Decimal("0.00") <= discounted <= price
```

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "test_runner": "pytest_8",
  "async_mode": "pytest_asyncio_auto",
  "property_testing": "hypothesis",
  "mocking": "pytest_mock_mocker",
  "coverage_target": ">= 90% branch coverage"
}
```

### Output Contract
```json
{
  "test_structure": {
    "tests/conftest.py": "Session and function scoped fixtures with dependency overrides",
    "tests/unit/": "Fast, isolated, zero-network unit tests with parametrization",
    "tests/integration/": "Async HTTP client integration tests with DB rollback",
    "tests/properties/": "Hypothesis invariant fuzz tests"
  }
}
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Shared Mutable State Across Tests**: Modifying global variables or leaving dirty rows in a non-transactional database, causing flaky tests dependent on run order.
- ❌ **Patching at the Definition Site**: Writing `mocker.patch("app.models.user.send_email")` instead of patching where the function is used: `mocker.patch("app.services.auth.send_email")`.
- ❌ **Using `time.sleep()` in Async Tests**: Freezing the asyncio event loop during test runs instead of `await asyncio.sleep()`.

---

## 6. Real-World Production Example

```markdown
**Task**: Build a 100% reliable test suite for an async payment processing engine with zero flakiness.

1. **In-Memory SQLite Async Fixtures**: Built transaction-rollback fixtures resetting database state in 2ms per test.
2. **Hypothesis Fuzzing**: Uncovered 3 silent currency rounding bugs by generating 5,000 randomized decimal edge cases.
3. **Async Mocking**: Mocked Stripe gateway API calls via `pytest-mock` `AsyncMock`, simulating 429 rate limit retries.

**Outcome**: Ran 850 tests in 4.2 seconds on GitHub Actions with 94.6% branch coverage and zero flaky test failures over 6 months.
```
