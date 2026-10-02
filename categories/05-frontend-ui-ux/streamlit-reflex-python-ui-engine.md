# Skill: Streamlit & Reflex Pure-Python Full-Stack UI Engineering Engine
`id`: `kbcodedev/streamlit-reflex-python-ui-engine`  
`category`: `05-frontend-ui-ux`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Building interactive data applications, internal tooling dashboards, real-time analytics portals, and pure-Python reactive full-stack web applications using Python, Streamlit, Reflex, FastAPI backend integrations, caching decorators, and state management.
- **Triggers**: Creating rapid data science dashboards, building full-stack web applications in 100% pure Python without writing JavaScript/React, deploying enterprise analytics tools, and optimizing UI rendering performance.
- **Prerequisites**: Python 3.11+, Streamlit 1.35+ or Reflex 0.4+, Pandas/Polars, Plotly / Altair.

---

## 2. Core Mental Model & Invariant Principles
1. **Streamlit Script Execution Model vs. Reflex Reactive State**:
   - **Streamlit**: Re-runs the entire Python script from top to bottom on every user interaction. Always guard heavy computations and database connections with `@st.cache_data` (for serializable data) and `@st.cache_resource` (for database/ML client singletons). Use `st.session_state` to persist interactive UI state across re-runs.
   - **Reflex**: Compiles pure Python into Next.js React frontends with FastAPI backend state servers. State lives in `rx.State` classes; UI events trigger async Python backend methods updating reactive variables (vars).
2. **Component Modularity & Lazy Rendering**: Break monolithic dashboard scripts into modular page components. Defer expensive chart computations and data loads until tabs or expandable sections are explicitly clicked by the user.
3. **Security & Session Isolation**: Never store global mutable variables across different user sessions in Streamlit or Reflex. Always scope user authentication, tokens, and tenant filters within per-session state containers.

4. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[User Browser Interaction]
             │
             ▼
┌──────────────────────────────────────┐
│ Phase 1: State Ingress & Session     │ ── Session state lookup, auth validation,
│          Scope Resolution            │    URL query parameter parsing
└──────────────────┬───────────────────┘
                   ▼
┌──────────────────────────────────────┐
│ Phase 2: Cached Data Retrieval       │ ── @st.cache_data / rx.State query,
│          & Aggregation               │    Polars/Pandas transform
└──────────────────┬───────────────────┘
                   ▼
┌──────────────────────────────────────┐
│ Phase 3: Reactive UI Component       │ ── Metric cards, Plotly charts, data
│          Rendering                   │    tables with column configuration
└──────────────────┬───────────────────┘
                   ▼
┌──────────────────────────────────────┐
│ Phase 4: Event Handling & Egress     │ ── Form submission, CSV download export,
│          State Persistence           │    WebSocket event sync
└──────────────────────────────────────┘
```

### Phase 1: High-Performance Cached Streamlit Analytics Dashboard

```python
# dashboard/app.py
import streamlit as st
import polars as pl
import plotly.express as px

st.set_page_config(
    page_title="Enterprise Analytics Hub",
    page_icon="📈",
    layout="wide",
    initial_sidebar_state="expanded",
)

@st.cache_resource
def get_database_connection():
    """Singleton database client cached across all users and reruns."""
    return {"status": "connected"}

@st.cache_data(ttl=300, show_spinner="Loading live analytics...")
def load_and_aggregate_metrics(timeframe: str) -> pl.DataFrame:
    """Cached data computation with 5-minute time-to-live cache invalidation."""
    df = pl.read_parquet("data/metrics.parquet")
    return (
        df.filter(pl.col("timeframe") == timeframe)
        .group_by("category")
        .agg(pl.col("revenue").sum().alias("total_revenue"))
        .sort("total_revenue", descending=True)
    )

# Session state initialization
if "selected_category" not in st.session_state:
    st.session_state.selected_category = "All"

st.title("Enterprise Revenue Analytics")

timeframe = st.sidebar.selectbox("Timeframe", ["7d", "30d", "90d"])
metrics_df = load_and_aggregate_metrics(timeframe)

col1, col2, col3 = st.columns(3)
col1.metric("Total Revenue", f"${metrics_df['total_revenue'].sum():,.2f}", "+12.4%")
col2.metric("Active Categories", len(metrics_df))
col3.metric("System Health", "Operational")

fig = px.bar(
    metrics_df.to_pandas(),
    x="category",
    y="total_revenue",
    title="Revenue Distribution by Category",
    template="plotly_dark",
)
st.plotly_chart(fig, use_container_width=True)
```

### Phase 2: Reflex Pure-Python Full-Stack Reactive App

```python
# app/reflex_app.py
import reflex as rx

class DashboardState(rx.State):
    count: int = 0
    items: list[str] = ["Initial Item"]
    new_item_text: str = ""

    def increment(self):
        self.count += 1

    def add_item(self):
        if self.new_item_text:
            self.items.append(self.new_item_text)
            self.new_item_text = ""

def index() -> rx.Component:
    return rx.container(
        rx.vstack(
            rx.heading("Pure Python Reactive Dashboard", size="8"),
            rx.text(f"Counter: {DashboardState.count}", font_size="2em"),
            rx.button("Increment", on_click=DashboardState.increment, color_scheme="blue"),
            rx.hstack(
                rx.input(
                    value=DashboardState.new_item_text,
                    on_change=DashboardState.set_new_item_text,
                    placeholder="Enter item...",
                ),
                rx.button("Add Item", on_click=DashboardState.add_item),
            ),
            rx.vstack(
                rx.foreach(DashboardState.items, lambda item: rx.text(f"• {item}")),
            ),
            spacing="4",
        )
    )

app = rx.App()
app.add_page(index)
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
  "framework": "streamlit | reflex",
  "python_version": "3.11+",
  "data_engine": "polars | pandas",
  "visualization": "plotly | altair | recharts",
  "caching": "st_cache_data_ttl | st_cache_resource"
}
```

### Output Contract
```json
{
  "architecture": {
    "caching_strategy": "Zero un-cached DB/API queries during script reruns",
    "state_isolation": "Strict session-scoped state isolation across concurrent users"
  }
}
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Running Un-Cached Queries in Streamlit**: Putting raw SQL queries or API calls in the main script without `@st.cache_data`, causing redundant database hits on every button click or slider move.
- ❌ **Global Mutable Variables in Streamlit**: Modifying global variables across user sessions, creating cross-user state pollution and security leaks.
- ❌ **Blocking WebSocket Event Loops in Reflex**: Running long synchronous computations inside Reflex state methods without `async` and background tasks, freezing the reactive frontend.

---

## 6. Real-World Production Example

```markdown
**Task**: Build a real-time executive operations dashboard in Streamlit monitoring 50 Kubernetes clusters with live metrics.

1. **Caching Architecture**: Used `@st.cache_resource` for K8s API client connection pooling and `@st.cache_data(ttl=60)` for cluster node telemetry.
2. **Session State**: Handled multi-cluster filtering and drill-downs using `st.session_state`.
3. **Data Visualization**: Rendered interactive Plotly heatmaps and real-time alert logs with sub-second page re-renders.

**Outcome**: Shipped to 250 internal DevOps engineers with 100% uptime and sub-100ms UI interaction latency.
```
