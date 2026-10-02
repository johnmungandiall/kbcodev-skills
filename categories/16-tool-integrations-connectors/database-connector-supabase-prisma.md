# Skill: Supabase, Prisma & PostgreSQL ORM Connector
`id`: `kbcodedev/database-connector-supabase-prisma`  
`category`: `16-tool-integrations-connectors`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Building backend services with Supabase (Row Level Security - RLS, Auth, Realtime) and Prisma ORM, optimizing connection pooling (PgBouncer/Supavisor), and type-safe database queries.
- **Triggers**: Supabase project integration, Prisma schema modeling, Row Level Security policy definition, connection pool exhaustion remediation.
- **Prerequisites**: Supabase project URL & API keys, Prisma CLI, PostgreSQL connection string.

---

## 2. Core Mental Model & Invariant Principles
1. **Row Level Security (RLS) as Primary Defense**: Never rely solely on application-level filtering. Write SQL RLS policies directly in PostgreSQL (`auth.uid() = user_id`) to ensure unauthorized data reads are impossible even if client queries are tampered with.
2. **Transaction vs Session Connection Pooling**: Use Transaction Pooling (Port 6543 / Supavisor) for serverless environments (Next.js/Vercel) to prevent `max_connections` exhaustion; use Session Pooling (Port 5432) strictly for running migrations.
3. **Prisma Type Safety & Selective Selection**: Always use Prisma `select: { id: true, title: true }` to fetch only required fields, avoiding massive over-fetching of large JSON or relation trees.

4. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[Prisma Schema & Supabase Project]
                 │
                 ▼
┌────────────────────────────────┐
│ Step 1: Prisma Schema Modeling │ ── Define models, relations, @@index, @@map
└────────────────┬───────────────┘
                 ▼
┌────────────────────────────────┐
│ Step 2: Supabase RLS Policies  │ ── Enforce tenant isolation directly in SQL
└────────────────┬───────────────┘
                 ▼
┌────────────────────────────────┐
│ Step 3: Connection Pool Tuning │ ── Connect via directUrl (Migrations) vs url (App)
└────────────────┬───────────────┘
                 ▼
┌────────────────────────────────┐
│ Step 4: Type-Safe CRUD Engine  │ ── Strict TypeScript query execution
└────────────────────────────────┘
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
  "entity": "OrganizationProject",
  "rules": ["Users can only read projects belonging to their organization", "Serverless Next.js connection pooling"]
}
```

### Output Contract
```prisma
// prisma/schema.prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")       // Transaction pooler (Port 6543)
  directUrl = env("DIRECT_URL")         // Direct connection for migrations (Port 5432)
}

generator client {
  provider = "prisma-client-js"
}

model Project {
  id             String       @id @default(uuid()) @db.Uuid
  organizationId String       @map("organization_id") @db.Uuid
  title          String       @db.VarChar(255)
  status         String       @default("ACTIVE")
  createdAt      DateTime     @default(now()) @map("created_at") @db.Timestamptz

  @@index([organizationId, status])
  @@map("projects")
}
```

```sql
-- Supabase Row Level Security (RLS) Policy
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only view projects in their organization" 
ON projects
FOR SELECT
USING (
  organization_id IN (
    SELECT org_id FROM organization_members 
    WHERE user_id = auth.uid()
  )
);
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Disabling RLS on Supabase Tables**: Leaving sensitive tables without RLS, exposing data to anyone holding the public Supabase Anon key.
- ❌ **Direct Database Connections from Serverless Lambdas**: Opening 500 direct PostgreSQL connections from Next.js API routes without connection poolers, crashing the database.
- ❌ **N+1 Query Loops with Prisma**: Calling `await prisma.project.findMany()` inside a loop over 100 organizations instead of using `include` or batch `whereIn` queries.

---

## 6. Real-World Production Example

```markdown
**Connection Pooling Fix**:
- Serverless Next.js app hit `FATAL: remaining connection slots are reserved for non-replication superuser connections`.
- Fix: Updated connection string to Supabase Supavisor transaction pooler port `6543`. Handled 25,000 concurrent users with only 15 active database connections.
```
