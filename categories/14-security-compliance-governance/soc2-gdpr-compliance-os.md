# Skill: SOC2, GDPR & Enterprise Compliance OS
`id`: `kbcodedev/soc2-gdpr-compliance-os`  
`category`: `14-security-compliance-governance`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Implementing automated compliance guardrails, SOC2 Type II controls, GDPR privacy regulations (Right-to-be-Forgotten, Data Export), HIPAA audit trails, and data retention policies.
- **Triggers**: Enterprise compliance readiness audits, SOC2 preparation, implementing GDPR data deletion/export APIs, encryption at rest/in transit policies.
- **Prerequisites**: Application database, user identification models, audit logging infrastructure.

---

## 2. Core Mental Model & Invariant Principles
1. **Compliance as Code**: Enforce compliance rules programmatically via automated tests, CI gates, and immutable audit logs rather than relying on manual policy PDFs.
2. **Immutable Append-Only Audit Logging**: All sensitive data reads, credential changes, and admin actions must be recorded in an immutable, tamper-evident log store.
3. **Data Subject Access Request (DSAR) Automation**: Implement deterministic APIs for GDPR Article 17 (Right to Erasure) and Article 20 (Data Portability).

---

## 3. High-Signal Execution Workflow

```
[User DSAR Request: "Delete all my personal data"]
                        │
                        ▼
┌──────────────────────────────────────────────┐
│ Phase 1: Identity & Authentication Gate      │ ── Verify requesting user ownership
└──────────────────────┬───────────────────────┘
                        ▼
┌──────────────────────────────────────────────┐
│ Phase 2: Distributed Erasure Cascade         │ ── PostgreSQL (Anonymize PII) + S3 (Wipe) + Stripe
└──────────────────────┬───────────────────────┘
                        ▼
┌──────────────────────────────────────────────┐
│ Phase 3: Immutable Audit Log Record          │ ── Record deletion event with zero PII in audit log
└──────────────────────┬───────────────────────┘
                        ▼
┌──────────────────────────────────────────────┐
│ Phase 4: Compliance Certificate Receipt      │ ── Return signed proof of deletion
└──────────────────────────────────────────────┘
```

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "compliance_frameworks": ["SOC2 Type II", "GDPR", "HIPAA"],
  "task": "Implement automated GDPR Right-to-be-Forgotten endpoint"
}
```

### Output Contract
```typescript
// Production GDPR Erasure Coordinator with Audit Logging
export class GdprComplianceService {
  constructor(
    private readonly db: DatabaseClient,
    private readonly s3: S3StorageClient,
    private readonly auditLogger: AuditLogger
  ) {}

  async executeRightToBeForgotten(userId: string, requestedBy: string): Promise<ErasureReceipt> {
    const transactionId = crypto.randomUUID();

    await this.db.transaction(async (tx) => {
      // 1. Anonymize user entity in database (Preserve financial transaction IDs for tax compliance)
      await tx.execute(
        `UPDATE users SET 
           email = 'anonymized_' || id || '@deleted.internal',
           full_name = 'Anonymized User',
           phone_number = NULL,
           billing_address = NULL,
           deleted_at = NOW()
         WHERE id = $1`,
        [userId]
      );

      // 2. Cascade delete non-financial user files in S3
      await this.s3.deleteFolder(`users/${userId}/avatars/`);
      await this.s3.deleteFolder(`users/${userId}/documents/`);
    });

    // 3. Write tamper-evident audit log (Zero PII included)
    await this.auditLogger.logEvent({
      eventId: transactionId,
      action: "GDPR_ERASURE_COMPLETED",
      targetEntityId: userId,
      actor: requestedBy,
      timestamp: new Date().toISOString(),
      complianceFramework: "GDPR_ARTICLE_17"
    });

    return {
      status: "SUCCESS",
      erasureTransactionId: transactionId,
      completedAt: new Date().toISOString()
    };
  }
}
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Hard Deleting Financial Records**: Deleting ledger transactions during GDPR erasures, violating statutory tax audit retention requirements (anonymize PII instead).
- ❌ **Storing Plaintext PII in Application Logs**: Printing customer names and emails into centralized log aggregators like Datadog or CloudWatch.
- ❌ **Missing Access Control Audit Trails**: Allowing engineers to access production databases without recording WHO queried WHAT customer record.

---

## 6. Real-World Production Example

```markdown
**SOC2 Type II Audit Success**:
- Automated evidence collection for 42 SOC2 controls using GitHub Actions and Terraform checks.
- Passed annual audit with 0 exceptions in 3 days.
```
