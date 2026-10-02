# Skill: Database Schema Modeling & Performance DBA
`id`: `kbcodedev/database-schema-modeling`  
`category`: `02-system-architecture`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Designing relational/NoSQL schemas, optimizing high-throughput queries, indexing strategies, data migrations, and eliminating N+1 query bottlenecks.
- **Triggers**: New feature data modeling, slow query optimization (`EXPLAIN ANALYZE`), database migration authoring, table partitioning.
- **Prerequisites**: Target database engine knowledge (PostgreSQL, MySQL, MongoDB, Redis), access patterns and query frequency estimates.

---

## 2. Core Mental Model & Invariant Principles
1. **Design for Access Patterns**: Index for the queries you run most, normalize for transactional consistency (3NF), denormalize only with measurable query proofs.
2. **Compound Index Prefix Rule**: A B-Tree index on `(A, B, C)` supports queries on `(A)`, `(A, B)`, and `(A, B, C)`, but NOT `(B)` or `(C)` alone.
3. **Zero-Downtime Migrations**: Add column -> Backfill -> Deploy code reading new column -> Cut over -> Drop old column. Never run locking DDL on large live tables.

---

## 3. High-Signal Execution Workflow

```
[Entity Domain & Access Requirements]
                  │
                  ▼
┌─────────────────────────────────┐
│ Phase 1: Entity Relationship    │ ── Cardinality (1:1, 1:N, N:M), Keys, Constraints
│          Modeling (ERD)         │
└─────────────────┬───────────────┘
                  ▼
┌─────────────────────────────────┐
│ Phase 2: Indexing & Storage     │ ── B-Tree, GIN, Hash indexes, Partitioning keys
│          Optimization           │
└─────────────────┬───────────────┘
                  ▼
┌─────────────────────────────────┐
│ Phase 3: EXPLAIN Plan Audit     │ ── Eliminate Seq Scans, Verify Index Scans
└─────────────────┬───────────────┘
                  ▼
┌─────────────────────────────────┐
│ Phase 4: Safe Migration Script  │ ── Non-blocking DDL (CONCURRENTLY, NOT VALID)
└─────────────────────────────────┘
```

### Phase 1: Relational Modeling Best Practices
- Primary keys: Prefer UUIDv7 (time-ordered, collision-free, index-friendly) or `BIGINT GENERATED ALWAYS AS IDENTITY`.
- Foreign keys: Always index foreign key columns to prevent full table scans on `JOIN` and cascading checks.
- Audit columns: Include `created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()`, `updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()`.

### Phase 2: Non-Blocking PostgreSQL Migrations
```sql
-- Step 1: Add column with NULL allowed (instant DDL)
ALTER TABLE users ADD COLUMN organization_id UUID;

-- Step 2: Create index concurrently without table lock
CREATE INDEX CONCURRENTLY idx_users_org_id ON users (organization_id);

-- Step 3: Add foreign key as NOT VALID (avoids scanning entire table under lock)
ALTER TABLE users ADD CONSTRAINT fk_users_org 
  FOREIGN KEY (organization_id) REFERENCES organizations(id) NOT VALID;

-- Step 4: Validate constraint in background
ALTER TABLE users VALIDATE CONSTRAINT fk_users_org;
```

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "engine": "PostgreSQL 16",
  "entities": [
    { "name": "Organization", "fields": ["id", "name", "plan", "created_at"] },
    { "name": "Project", "fields": ["id", "org_id", "title", "status", "created_at"] }
  ],
  "heavy_query": "SELECT * FROM projects WHERE org_id = $1 AND status = 'active' ORDER BY created_at DESC LIMIT 20;"
}
```

### Output Contract
```sql
-- Optimal Schema Definition
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    plan VARCHAR(50) NOT NULL DEFAULT 'starter',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Compound Index tailored specifically for the heavy query
CREATE INDEX idx_projects_org_status_created 
ON projects (org_id, status, created_at DESC);
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Full Table Scans on High-Traffic Tables**: Omitting indices on `WHERE` filter columns and `JOIN` keys.
- ❌ **Blocking Table Locks**: Running `ALTER TABLE ADD COLUMN ... DEFAULT 'foo'` or `CREATE INDEX` on millions of live rows without `CONCURRENTLY`.
- ❌ **`SELECT *` in Production APIs**: Over-fetching unnecessary columns (especially large `TEXT` or `JSONB` fields) inflating memory and bandwidth.

---

## 6. Real-World Production Example

```markdown
**Problem**: Query `SELECT * FROM audit_logs WHERE tenant_id = 42 AND created_at > NOW() - INTERVAL '7 days'` took 4.8 seconds (Sequential Scan over 12M rows).

**Optimization**:
- Analyzed: `EXPLAIN (ANALYZE, BUFFERS)` showed 115,000 buffer reads.
- Fix: `CREATE INDEX CONCURRENTLY idx_audit_tenant_created ON audit_logs (tenant_id, created_at DESC);`
- Result: Query switched to `Bitmap Index Scan`. Execution time dropped from 4.8s to 2.4ms (99.95% speedup).
```
