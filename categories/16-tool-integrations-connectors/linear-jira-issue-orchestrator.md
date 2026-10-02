# Skill: Linear & Jira Issue Orchestration Engine
`id`: `kbcodedev/linear-jira-issue-orchestrator`  
`category`: `16-tool-integrations-connectors`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Automating issue tracking, sprint planning, pull request linking, automated issue triage, and bi-directional synchronization with Linear and Jira APIs via GraphQL/REST.
- **Triggers**: Automated ticket creation from production errors, linking PRs to Linear issues, sprint burndown tracking, issue status transitions.
- **Prerequisites**: Linear API Key (`lin_api_`) or Jira REST API Token, Linear SDK (`@linear/sdk`).

---

## 2. Core Mental Model & Invariant Principles
1. **Magic PR Linking Syntax**: Automatically link pull requests to Linear tickets by embedding the ticket identifier (`[ENG-124]`) in the branch name or commit message (`git commit -m "fix(auth): fix token race condition [ENG-124]"`).
2. **Deterministic State Transitions**: Map git PR lifecycle events directly to Linear workflow states (PR Opened $\rightarrow$ `In Review`; PR Merged $\rightarrow$ `Done`).
3. **Automated Error Triage & Deduplication**: When logging exceptions from Sentry to Linear/Jira, calculate an issue fingerprint hash to prevent creating 1,000 duplicate tickets for the same recurring bug.

4. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[Production Error Event / Sentry Alert]
                  │
                  ▼
┌─────────────────────────────────┐
│ Step 1: Compute Issue Hash      │ ── Hash(stack_trace_top_3_frames + error_name)
└─────────────────┬───────────────┘
                  ▼
┌─────────────────────────────────┐
│ Step 2: Query Existing Tickets  │ ── Linear GraphQL: Search for matching issue hash
└─────────────────┬───────────────┘
         ┌────────┴────────┐
    [Exists]          [New Bug]
         ▼                 ▼
┌─────────────────┐ ┌──────────────────────────────────────────────┐
│ Increment Count │ │ Create Linear Issue (Assign Priority: High)  │
└─────────────────┘ └──────────────────────────────────────────────┘
```

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "title": "Payment webhook signature verification failing for EU accounts",
  "team_key": "ENG",
  "priority": 1,
  "description": "Stripe webhook HMAC validation throws 400 Bad Request on EU currency formatting.",
  "labels": ["Bug", "Billing", "High Severity"]
}
```

### Output Contract
```typescript
import { LinearClient } from "@linear/sdk";

const linear = new LinearClient({ apiKey: process.env.LINEAR_API_KEY });

export async function createTriageIssue(
  teamKey: string,
  title: string,
  description: string,
  priority: number = 1
) {
  // 1. Get Team by Key
  const teams = await linear.teams();
  const team = teams.nodes.find((t) => t.key === teamKey);
  if (!team) throw new Error(`Team ${teamKey} not found`);

  // 2. Create Linear Issue
  const issuePayload = await linear.createIssue({
    teamId: team.id,
    title,
    description,
    priority, // 1 = Urgent, 2 = High, 3 = Normal, 4 = Low
  });

  const issue = await issuePayload.issue;
  return {
    issueId: issue?.id,
    identifier: issue?.identifier, // e.g. "ENG-482"
    url: issue?.url,
  };
}
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Spamming Tickets Without Deduplication**: Creating a new Jira ticket on every unhandled server exception, generating 10,000 tickets in 1 hour during an outage.
- ❌ **Hardcoding Team UUIDs in Code**: Using static database UUIDs instead of querying team keys (`ENG`, `PRODUCT`) dynamically.
- ❌ **Missing PR-to-Issue Links**: Merging code without linking to the issue identifier, breaking project audit trails.

---

## 6. Real-World Production Example

```markdown
**Linear Automation**:
- Integrated Linear SDK into GitHub Actions.
- When PR is merged to `main`, bot automatically comments benchmark test proof, updates Linear issue `ENG-391` to "Done", and notifies the product manager on Slack in 800ms.
```
