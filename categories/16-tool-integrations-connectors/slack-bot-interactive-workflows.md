# Skill: Slack Bot & Interactive Block Kit Workflows
`id`: `kbcodedev/slack-bot-interactive-workflows`  
`category`: `16-tool-integrations-connectors`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Authoring custom interactive Slack Bots, Block Kit visual interfaces, modal forms, slash commands, and incident response notifications using the Slack Bolt SDK (Node.js / Python).
- **Triggers**: ChatOps automation, Slack incident escalation bots, interactive approval workflows, automated engineering standup bots.
- **Prerequisites**: Slack App Bot Token (`xoxb-`), Signing Secret, Socket Mode or HTTPS Webhook receiver.

---

## 2. Core Mental Model & Invariant Principles
1. **The 3-Second Acknowledgment Rule (`ack()`)**: Slack requires all slash commands and interactive actions to be acknowledged within 3,000ms. Always call `await ack()` immediately before executing long-running background tasks.
2. **Block Kit Visual Hierarchy**: Structure messages with Section Blocks, Divider Blocks, and Action Blocks (Buttons, DatePickers, Select menus).
3. **Modal Form State Validation**: Validate modal input fields on submission (`view_submission`); return structured errors attached to the specific block ID on failure.

4. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[User Invokes /deploy or Clicks Approve Button]
                       │
                       ▼
┌──────────────────────────────────────────────┐
│ Step 1: Immediate Acknowledgment (ack())     │ ── Responds to Slack within < 500ms
└──────────────────────┬───────────────────────┘
                       ▼
┌──────────────────────────────────────────────┐
│ Step 2: Validate User Permissions & Payload  │ ── Verify user is in authorized Ops group
└──────────────────────┬───────────────────────┘
                       ▼
┌──────────────────────────────────────────────┐
│ Step 3: Execute Background Engineering Task  │ ── Trigger deployment / GitHub Action
└──────────────────────┬───────────────────────┘
                       ▼
┌──────────────────────────────────────────────┐
│ Step 4: Update Slack Message In-Place        │ ── Replace buttons with "✅ Approved by @user"
└──────────────────────────────────────────────┘
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
  "action": "Deployment Approval Request",
  "service": "billing-service",
  "version": "v2.14.0",
  "requester": "@johndoe"
}
```

### Output Contract
```typescript
import { App } from '@slack/bolt';

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
});

// Interactive Button Action Handler
app.action('approve_deployment_btn', async ({ ack, body, client }) => {
  // 1. Mandatory immediate acknowledgment
  await ack();

  const user = body.user.name;

  // 2. Update the message in-place to prevent double-clicking
  if (body.type === 'block_actions' && body.message) {
    await client.chat.update({
      channel: body.channel!.id,
      ts: body.message.ts,
      text: `Deployment approved by @${user}`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `✅ *Deployment Approved & In Progress*\n*Approved by:* <@${body.user.id}>\n*Status:* Rolling out to production cluster...`,
          },
        },
      ],
    });
  }

  // 3. Trigger deployment pipeline asynchronously ...
});

(async () => {
  await app.start();
  console.log('⚡️ Slack Bolt ChatOps Bot is running in Socket Mode!');
})();
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Missing `ack()` Call**: Forgetting to call `await ack()` inside Slack handlers, causing Slack to display an ugly `"Operation timed out"` error to users.
- ❌ **Sending New Messages Instead of Updating In-Place**: Spamming the channel with 5 status messages instead of editing the original message.
- ❌ **Hardcoding Channel IDs in Source Code**: Committing `#general` channel IDs into git instead of reading from environment variables.

---

## 6. Real-World Production Example

```markdown
**ChatOps Incident Triage**:
- PagerDuty incident fires alert into `#ops-incidents`.
- On-call engineer clicks "Acknowledge" button directly in Slack.
- Bot updates message with incident status, creates a dedicated war room channel, and opens a Google Meet link in 1.2 seconds.
```
