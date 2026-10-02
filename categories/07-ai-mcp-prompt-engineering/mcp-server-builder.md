# Skill: Model Context Protocol (MCP) Server Builder
`id`: `kbcodedev/mcp-server-builder`  
`category`: `07-ai-mcp-prompt-engineering`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Authoring custom Model Context Protocol (MCP) servers (in TypeScript or Python) to expose enterprise databases, APIs, file systems, and tools to AI agents.
- **Triggers**: Creating MCP extensions, integrating proprietary APIs into Claude Desktop / kbcode / Cursor, building secure tool bridges.
- **Prerequisites**: Official MCP SDK (`@modelcontextprotocol/sdk` or Python `mcp`), standard I/O (stdio) or Server-Sent Events (SSE) transport.

---

## 2. Core Mental Model & Invariant Principles
1. **The Three Core MCP Primitives**:
   - **Tools**: Executable functions that perform side-effects and return data to the model.
   - **Resources**: File-like read-only data payloads (e.g. `postgres://schema`, `file:///logs`).
   - **Prompts**: Pre-engineered parameterized prompt templates.
2. **Stdio Transport Cleanliness**: Never use `console.log()` for debugging inside stdio servers—raw prints to stdout corrupt JSON-RPC transport frames. Log exclusively to `stderr`.
3. **Strict Schema Pre-Validation**: Validate tool arguments with Zod or Pydantic before executing underlying system functions.

---

## 3. High-Signal Execution Workflow

```
[Custom Enterprise API / Database]
                 │
                 ▼
┌────────────────────────────────┐
│ Step 1: Define Tool & Resource │ ── ListToolsRequestSchema & ListResourcesRequestSchema
│         Schemas (Zod/Pydantic) │
└────────────────┬───────────────┘
                 ▼
┌────────────────────────────────┐
│ Step 2: Implement Execution    │ ── CallToolRequestSchema handler with error boundaries
│         Handlers               │
└────────────────┬───────────────┘
                 ▼
┌────────────────────────────────┐
│ Step 3: Stdio Transport Setup  │ ── Connect server over StdioServerTransport
└────────────────┬───────────────┘
                 ▼
┌────────────────────────────────┐
│ Step 4: Verification & Test    │ ── Test using MCP Inspector (`npx @modelcontextprotocol/inspector`)
└────────────────────────────────┘
```

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "server_name": "git-repo-mcp",
  "tools": [
    { "name": "get_git_status", "description": "Get staged and unstaged file diffs" },
    { "name": "create_commit", "description": "Commit staged changes with message" }
  ]
}
```

### Output Contract (TypeScript & Python Implementations)

#### 1. TypeScript Production Implementation
```typescript
// Production TypeScript MCP Server Implementation
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { execSync } from "node:child_process";

const server = new Server(
  { name: "git-repo-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

// 1. List Tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_git_status",
        description: "Returns working tree git status",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "create_commit",
        description: "Commit staged changes with a commit message",
        inputSchema: {
          type: "object",
          properties: {
            message: { type: "string", description: "Commit message" },
          },
          required: ["message"],
        },
      },
    ],
  };
});

// 2. Handle Tool Invocations
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === "get_git_status") {
      const output = execSync("git status --short", { encoding: "utf-8" });
      return { content: [{ type: "text", text: output || "Working tree clean" }] };
    }

    if (name === "create_commit") {
      const schema = z.object({ message: z.string().min(1) });
      const { message } = schema.parse(args);
      const output = execSync(`git commit -m "${message.replace(/"/g, '\\"')}"`, { encoding: "utf-8" });
      return { content: [{ type: "text", text: output }] };
    }

    throw new Error(`Unknown tool: ${name}`);
  } catch (error: any) {
    return {
      isError: true,
      content: [{ type: "text", text: `Tool Error: ${error.message}` }],
    };
  }
});

// 3. Connect via Stdio Transport
const transport = new StdioServerTransport();
await server.connect(transport);
```

#### 2. Python FastMCP Implementation
```python
# Production Python FastMCP Implementation
from mcp.server.fastmcp import FastMCP
import subprocess

mcp = FastMCP("git-repo-mcp")

@mcp.tool()
def get_git_status() -> str:
    """Returns current git working tree status."""
    result = subprocess.run(["git", "status", "--short"], capture_output=True, text=True)
    return result.stdout.strip() or "Working tree clean"

@mcp.tool()
def create_commit(message: str) -> str:
    """Commit staged git changes with a structured message.
    
    Args:
        message: The descriptive commit message
    """
    if not message.strip():
        raise ValueError("Commit message cannot be empty")
    result = subprocess.run(["git", "commit", "-m", message], capture_output=True, text=True, check=True)
    return result.stdout.strip()

if __name__ == "__main__":
    mcp.run()
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Stdout Pollution**: Printing plain strings or debug logs to `stdout` in stdio servers, crashing the MCP JSON-RPC parser.
- ❌ **Uncaught Exceptions in Tool Handlers**: Crashing the entire MCP server process on a single failed command instead of returning `{ isError: true }`.
- ❌ **Unbounded Payload Returns**: Returning a 50MB JSON database dump in a single tool response, blowing up LLM context memory.

---

## 6. Real-World Production Example

```markdown
**MCP Inspector Testing**:
- Ran `npx @modelcontextprotocol/inspector node dist/index.js`.
- Verified tool discovery and argument validation interactively in web UI before connecting to live agent clients.
```
