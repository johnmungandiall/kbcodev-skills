# Skill: Stripe Billing & Webhook Idempotency Engine
`id`: `kbcodedev/stripe-billing-webhook-engine`  
`category`: `16-tool-integrations-connectors`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Integrating Stripe Checkout, customer portal subscriptions, usage-based metering, handling Stripe webhook events (`customer.subscription.updated`, `invoice.payment_succeeded`), and preventing duplicate billing via strict idempotency.
- **Triggers**: Payment gateway integration, SaaS tier upgrades, webhook processing, subscription lifecycle management.
- **Prerequisites**: Stripe Secret Key, Stripe Webhook Signing Secret (`whsec_`), local/replica database.

---

## 2. Core Mental Model & Invariant Principles
1. **Raw Body Webhook Signature Verification**: Always pass the exact raw unparsed HTTP request body (`req.rawBody`) to `stripe.webhooks.constructEvent()` to prevent signature verification failure.
2. **Idempotent Webhook Processing**: Webhook deliveries can arrive multiple times. Store processed `event.id` in a database table inside an atomic transaction to ensure each event is processed exactly once.
3. **Listen for Webhooks, Don't Trust Client-Side Callbacks**: Never provision customer subscription tiers based solely on a frontend redirect URL; provision strictly upon receiving verified `invoice.payment_succeeded` webhook events.

4. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[Stripe Sends Webhook POST /api/webhooks/stripe]
                        │
                        ▼
┌──────────────────────────────────────────────┐
│ Step 1: Verify Webhook Signature             │ ── constructEvent(rawBody, sig, whsec)
└──────────────────────┬───────────────────────┘
                        ▼
┌──────────────────────────────────────────────┐
│ Step 2: Idempotency Gate                     │ ── If event.id already processed -> return 200 OK
└──────────────────────┬───────────────────────┘
                        ▼
┌──────────────────────────────────────────────┐
│ Step 3: Handle Subscription Lifecycle        │ ── Update user subscription status in database
└──────────────────────┬───────────────────────┘
                        ▼
┌──────────────────────────────────────────────┐
│ Step 4: Return Immediate 200 OK              │ ── Acknowledge receipt within < 2 seconds
└──────────────────────────────────────────────┘
```

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "event_type": "customer.subscription.updated",
  "customer_id": "cus_9942a",
  "subscription_status": "active",
  "price_id": "price_pro_monthly"
}
```

### Output Contract
```typescript
import { Stripe } from 'stripe';
import { Request, Response } from 'express';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;

export async function handleStripeWebhook(req: Request, res: Response, db: DatabaseClient) {
  const sig = req.headers['stripe-signature'] as string;
  let event: Stripe.Event;

  // 1. Verify Raw Signature
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, WEBHOOK_SECRET);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // 2. Idempotency Gate
  const hasProcessed = await db.hasProcessedEvent(event.id);
  if (hasProcessed) {
    return res.status(200).json({ received: true, message: 'Event already processed' });
  }

  // 3. Process Events Inside Transaction
  switch (event.type) {
    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string;
      await db.updateCustomerPlan(customerId, { status: 'ACTIVE', lastPaymentAt: new Date() });
      break;
    }
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;
      await db.updateCustomerPlan(customerId, { status: 'CANCELED' });
      break;
    }
  }

  // 4. Mark Event as Processed
  await db.recordProcessedEvent(event.id);
  res.status(200).json({ received: true });
}
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **JSON-Parsing Body Before Webhook Verification**: Using `bodyParser.json()` before passing to `constructEvent()`, mutating whitespace and failing HMAC verification.
- ❌ **Blocking Webhooks with Slow Operations**: Performing 30-second PDF generation inside the webhook handler, causing Stripe to timeout and retry the event.
- ❌ **Hardcoding Stripe Price IDs in Application Code**: Hardcoding `price_123` across 15 files instead of referencing a centralized config or environment map.

---

## 6. Real-World Production Example

```markdown
**Stripe Webhook Resilience**:
- Handled 12,000 subscription renewals during Black Friday.
- Idempotency gate blocked 340 duplicate webhook deliveries with zero double-charge billing errors.
```
