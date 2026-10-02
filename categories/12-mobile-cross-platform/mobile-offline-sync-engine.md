# Skill: Mobile Offline-First & Conflict Sync Engine
`id`: `kbcodedev/mobile-offline-sync-engine`  
`category`: `12-mobile-cross-platform`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Engineering offline-first mobile and desktop applications with local-first databases (SQLite, WatermelonDB, Realm, CRDTs), optimistic mutation queues, background sync, and conflict resolution.
- **Triggers**: Offline support requirements, spotty network connectivity optimization, real-time multi-device sync, local cache reconciliation.
- **Prerequisites**: Embedded local database, change tracking timestamps (`updated_at_utc`, `sync_status`, `client_mutation_id`).

---

## 2. Core Mental Model & Invariant Principles
1. **Local Database is the Single Source of Truth**: The UI reads exclusively from the local embedded database; network responses write to the local database, which automatically emits reactive updates to the UI.
2. **Optimistic Append-Only Mutation Queue**: Store offline actions (e.g. `CREATE_NOTE`, `UPDATE_TITLE`) in a persistent FIFO queue with a `client_mutation_id`.
3. **Last-Write-Wins (LWW) or CRDT Resolution**: Reconcile conflicts using high-precision logical timestamps (HLC - Hybrid Logical Clocks) or field-level Conflict-Free Replicated Data Types.

4. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[User Performs Action (Offline)]
                │
                ▼
┌───────────────────────────────┐
│ Step 1: Write to Local DB     │ ── Instant UI update (sync_status: 'PENDING')
└───────────────┬───────────────┘
                ▼
┌───────────────────────────────┐
│ Step 2: Append to Outbox Queue│ ── Store payload + UUID + mutation_ts in SQLite outbox
└───────────────┬───────────────┘
                ▼
┌───────────────────────────────┐
│ Step 3: Network Drain Worker  │ ── On connectivity return, flush outbox sequentially
└───────────────┬───────────────┘
                ▼
┌───────────────────────────────┐
│ Step 4: Conflict Resolution   │ ── Server validates HLC timestamps -> Marks 'SYNCED'
└───────────────────────────────┘
```

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "entity": "TaskItem",
  "local_action": "UPDATE_TITLE",
  "payload": { "id": "task_104", "title": "Deploy v2 (Updated Offline)", "version": 4 }
}
```

### Output Contract
```typescript
// Production Offline Sync Queue Manager
export interface PendingMutation {
  id: string; // client_mutation_id (UUIDv7)
  entityName: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  payload: Record<string, any>;
  createdAt: number;
  retryCount: number;
}

export class OfflineSyncCoordinator {
  constructor(
    private readonly localDb: LocalDatabase,
    private readonly remoteApi: RemoteApiClient
  ) {}

  async executeMutation(mutation: PendingMutation): Promise<void> {
    // 1. Optimistically write to local database
    await this.localDb.execute(
      "UPDATE tasks SET title = ?, sync_status = 'PENDING', updated_at = ? WHERE id = ?",
      [mutation.payload.title, Date.now(), mutation.payload.id]
    );

    // 2. Enqueue to persistent outbox table
    await this.localDb.insertOutbox(mutation);

    // 3. Trigger async background drain (non-blocking)
    this.drainOutboxQueue().catch(console.error);
  }

  async drainOutboxQueue(): Promise<void> {
    const pending = await this.localDb.getPendingOutboxItems();
    for (const item of pending) {
      try {
        const serverResponse = await this.remoteApi.syncMutation(item);
        // Mark local record as SYNCED with server authoritative timestamp
        await this.localDb.markSynced(item.payload.id, serverResponse.serverTimestamp);
        await this.localDb.removeOutboxItem(item.id);
      } catch (error: any) {
        if (error.isConflict) {
          // Field-level LWW reconciliation
          await this.resolveConflict(item, error.serverRecord);
          await this.localDb.removeOutboxItem(item.id);
        } else {
          // Network offline, break loop and wait for next connectivity ping
          break;
        }
      }
    }
  }

  private async resolveConflict(localItem: PendingMutation, serverRecord: any) {
    if (localItem.createdAt > serverRecord.updated_at) {
      // Local wins
      await this.remoteApi.forceSync(localItem);
    } else {
      // Server wins -> overwrite local DB
      await this.localDb.updateLocal(serverRecord);
    }
  }
}
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Blocking UI on Network Responses**: Freezing mobile app buttons with spinners while waiting for spotty 3G network calls.
- ❌ **In-Memory Outbox Queues**: Storing pending offline mutations in JavaScript arrays that get lost if the user force-closes the app.
- ❌ **Full Table Syncs on Every Refresh**: Downloading the entire database on reconnect instead of using delta syncs (`GET /sync?since_ts=1727878000`).

---

## 6. Real-World Production Example

```markdown
**Offline-First Field App**:
- Construction engineers inspect job sites in remote areas with zero cell reception.
- Captured 450 photos and inspection forms offline; synced 100% reliably in background when returning to Wi-Fi with zero data loss.
```
