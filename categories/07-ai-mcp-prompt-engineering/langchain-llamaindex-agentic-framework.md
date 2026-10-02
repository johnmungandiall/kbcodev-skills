# Skill: LangChain & LlamaIndex Agentic Orchestration Framework
`id`: `kbcodedev/langchain-llamaindex-agentic-framework`  
`category`: `07-ai-mcp-prompt-engineering`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Building stateful multi-actor agent workflows, complex retrieval-augmented generation (RAG) graphs, hierarchical document indexes, dynamic tool routing, and evaluation pipelines using Python, LangChain, LangGraph, LlamaIndex, LangSmith, and Phoenix observability.
- **Triggers**: Implementing multi-step agentic reasoning loops, structuring stateful RAG systems with query planning and sub-question engines, routing dynamic user queries across multiple specialized agents, and debugging production LLM workflows.
- **Prerequisites**: Python 3.11+, LangChain 0.2+, LangGraph 0.1+, LlamaIndex 0.10+, OpenAI / Anthropic API keys.

---

## 2. Core Mental Model & Invariant Principles
1. **LangGraph Stateful Statechart Pattern**: Represent agent workflows as explicit state graphs (Nodes = actions/tools, Edges = conditional routing transitions, State = immutable TypedDict). Never rely on opaque, non-deterministic black-box loops; every state transition must be inspectable, interruptible, and replayable.
2. **LlamaIndex Index Hierarchy & Sub-Question Decomposition**: For complex multi-document reasoning, decompose broad queries into targeted sub-questions using `SubQuestionQueryEngine` across hierarchical summary and vector indexes rather than dumping all chunks into a single flat vector similarity search.
3. **Structured Tool Contracts**: Define tools using Pydantic v2 schemas with precise parameter constraints and descriptions. Agents must receive typed tool outputs with schema validation before continuing the execution chain.
4. **End-to-End Tracing & Evaluation**: Instrument all LLM calls, retriever hops, and tool invocations with OpenInference / LangSmith / Phoenix tracing to measure latency, token cost, retrieval precision, and hallucination metrics.

5. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[User Query / Task]
        │
        ▼
┌──────────────────────────────────────┐
│ Phase 1: Query Planner & Router      │ ── Sub-question decomposition (LlamaIndex),
│          (LangGraph Entry Node)      │    intent classification & state init
└──────────────────┬───────────────────┘
                   ▼
┌──────────────────────────────────────┐
│ Phase 2: Multi-Actor Agent Graph     │ ── Conditional routing (should_continue),
│          Execution (LangGraph)       │    typed tool invocation, human-in-the-loop
└──────────────────┬───────────────────┘
                   ▼
┌──────────────────────────────────────┐
│ Phase 3: Hierarchical Document       │ ── Vector + Summary index query fusion,
│          Retrieval (LlamaIndex)      │    reranking via Cohere / Cross-Encoder
└──────────────────┬───────────────────┘
                   ▼
┌──────────────────────────────────────┐
│ Phase 4: Response Synthesis &        │ ── Grounded answer generation, token
│          Tracing (LangSmith)         │    accounting, telemetry export
└──────────────────────────────────────┘
```

### Phase 1: Stateful Multi-Actor Graph with LangGraph

```python
# src/agent/graph.py
from typing import Annotated, TypedDict
from langchain_core.messages import BaseMessage, HumanMessage
from langgraph.graph import StateGraph, END
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode
from langchain_anthropic import ChatAnthropic
from src.tools.search_tools import query_financial_knowledge_base

class AgentState(TypedDict):
    messages: Annotated[list[BaseMessage], add_messages]
    next_step: str

tools = [query_financial_knowledge_base]
tool_node = ToolNode(tools)

model = ChatAnthropic(model="claude-sonnet-5-5").bind_tools(tools)  # resolve the current model ID before use

def should_continue(state: AgentState) -> str:
    messages = state["messages"]
    last_message = messages[-1]
    if last_message.tool_calls:
        return "tools"
    return END

def call_model(state: AgentState) -> AgentState:
    response = model.invoke(state["messages"])
    return {"messages": [response], "next_step": ""}

def build_agent_graph():
    workflow = StateGraph(AgentState)
    workflow.add_node("agent", call_model)
    workflow.add_node("tools", tool_node)

    workflow.set_entry_point("agent")
    workflow.add_conditional_edges(
        "agent",
        should_continue,
        {"tools": "tools", END: END},
    )
    workflow.add_edge("tools", "agent")
    return workflow.compile()
```

### Phase 2: LlamaIndex Hierarchical Sub-Question Engine

```python
# src/rag/hierarchical_engine.py
from llama_index.core import VectorStoreIndex, SummaryIndex, SimpleDirectoryReader
from llama_index.core.tools import QueryEngineTool, ToolMetadata
from llama_index.core.query_engine import SubQuestionQueryEngine
from llama_index.llms.anthropic import Anthropic

def create_subquestion_engine(docs_dir: str):
    documents = SimpleDirectoryReader(docs_dir).load_data()

    vector_index = VectorStoreIndex.from_documents(documents)
    summary_index = SummaryIndex.from_documents(documents)

    query_engine_tools = [
        QueryEngineTool(
            query_engine=vector_index.as_query_engine(),
            metadata=ToolMetadata(
                name="vector_tool",
                description="Useful for retrieving specific factual details and numbers.",
            ),
        ),
        QueryEngineTool(
            query_engine=summary_index.as_query_engine(),
            metadata=ToolMetadata(
                name="summary_tool",
                description="Useful for high-level summaries and comprehensive overviews.",
            ),
        ),
    ]

    llm = Anthropic(model="claude-sonnet-5-5")  # resolve the current model ID before use
    return SubQuestionQueryEngine.from_defaults(
        query_engine_tools=query_engine_tools,
        llm=llm,
        use_async=True,
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
  "frameworks": ["langgraph", "llamaindex"],
  "llm_provider": "anthropic_claude | openai_gpt4",
  "rag_architecture": "hierarchical_sub_question",
  "observability": "langsmith | phoenix",
  "state_persistence": "sqlite_checkpointer | postgres_checkpointer"
}
```

### Output Contract
```json
{
  "graph_structure": {
    "state": "TypedDict with append-only messages",
    "nodes": ["agent", "tools", "evaluator"],
    "routing": "Deterministic conditional edges"
  }
}
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Uncontrolled Infinite Agent Loops**: Omitting step recursion limits (`recursion_limit=25`) in LangGraph, causing agents to burn thousands of tokens in runaway loops when tools return ambiguous errors.
- ❌ **Flat Vector RAG for Complex Multi-Doc Queries**: Expecting top-k cosine similarity on a single flat index to answer complex comparative questions without query decomposition.
- ❌ **Untraced Production Agent Execution**: Running autonomous agent loops in production without distributed tracing (LangSmith/Phoenix), making hallucination and latency debugging impossible.

---

## 6. Real-World Production Example

```markdown
**Task**: Build an autonomous equity research agent capable of analyzing SEC 10-K filings, comparing revenue growth across companies, and synthesizing investment memos.

1. **State Graph**: Built a 4-node LangGraph workflow (Planner → SubQuestion Retriever → Synthesizer → Compliance Reviewer).
2. **Retrieval Engine**: Indexed 10-K filings using LlamaIndex hierarchical summary and vector tools.
3. **Execution & Checkpointing**: Persisted state transitions in PostgreSQL checkpointer with human-in-the-loop approval before final memo publishing.

**Outcome**: Reduced analyst research memo generation time from 6 hours to 45 seconds with 96% citation accuracy verified via LangSmith.
```
