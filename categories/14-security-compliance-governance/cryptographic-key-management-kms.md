# Skill: Cryptographic Key Management & Envelope Encryption (KMS)
`id`: `kbcodedev/cryptographic-key-management-kms`  
`category`: `14-security-compliance-governance`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Encrypting sensitive customer PII, credit cards, healthcare records, and API secrets using Envelope Encryption with AWS KMS, Google Cloud KMS, or HashiCorp Vault.
- **Triggers**: Storing sensitive data in databases, PCI-DSS compliance, annual cryptographic key rotation, tokenization of secrets.
- **Prerequisites**: Cloud KMS Key ARN, AES-256-GCM encryption libraries.

---

## 2. Core Mental Model & Invariant Principles
1. **Envelope Encryption Architecture**: Never send large datasets directly to KMS (network latency + cost). Ask KMS to generate a plaintext Data Encryption Key (DEK) and an encrypted DEK. Encrypt data locally with the plaintext DEK using AES-256-GCM, then destroy the plaintext DEK from memory and store the encrypted DEK alongside the ciphertext.
2. **Authenticated Encryption (AES-GCM)**: Always use AEAD (Authenticated Encryption with Associated Data) to guarantee both confidentiality and cryptographic integrity against ciphertext tampering.
3. **Annual Automatic Key Rotation**: Configure Master Keys (CMKs) in KMS with automated 365-day rotation.

4. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[Sensitive Plaintext Data (e.g. SSN / API Secret)]
                        │
                        ▼
┌──────────────────────────────────────────────┐
│ Step 1: Call KMS: GenerateDataKey(AES_256)   │ ── Returns: Plaintext DEK + Encrypted DEK
└──────────────────────┬───────────────────────┘
                        ▼
┌──────────────────────────────────────────────┐
│ Step 2: Local AES-256-GCM Encryption         │ ── Encrypt data with Plaintext DEK
└──────────────────────┬───────────────────────┘
                        ▼
┌──────────────────────────────────────────────┐
│ Step 3: Zeroize Plaintext DEK Memory         │ ── Wipe plaintext key from RAM immediately
└──────────────────────┬───────────────────────┘
                        ▼
┌──────────────────────────────────────────────┐
│ Step 4: Persist Encrypted Payload            │ ── Store: (Encrypted DEK + IV + Ciphertext + AuthTag)
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
  "kms_key_id": "arn:aws:kms:us-east-1:123456789012:key/7f8a9b2c-3d4e",
  "plaintext_secret": "sk_live_9921_secret_api_key_value"
}
```

### Output Contract
```typescript
import { KMSClient, GenerateDataKeyCommand, DecryptCommand } from "@aws-sdk/client-kms";
import crypto from "crypto";

const kms = new KMSClient({ region: "us-east-1" });
const KMS_KEY_ARN = process.env.KMS_KEY_ARN!;

export interface EncryptedEnvelope {
  encryptedDekBase64: string;
  ivBase64: string;
  ciphertextBase64: string;
  authTagBase64: string;
}

export async function encryptEnvelope(plaintext: string): Promise<EncryptedEnvelope> {
  // 1. Generate Data Encryption Key (DEK) from AWS KMS
  const command = new GenerateDataKeyCommand({
    KeyId: KMS_KEY_ARN,
    KeySpec: "AES_256",
  });
  const { Plaintext: plaintextDek, CiphertextBlob: encryptedDek } = await kms.send(command);
  if (!plaintextDek || !encryptedDek) throw new Error("KMS DEK generation failed");

  // 2. Encrypt locally using AES-256-GCM
  const iv = crypto.randomBytes(12); // Standard 96-bit GCM IV
  const cipher = crypto.createCipheriv("aes-256-gcm", Buffer.from(plaintextDek), iv);

  let ciphertext = cipher.update(plaintext, "utf8");
  ciphertext = Buffer.concat([ciphertext, cipher.final()]);
  const authTag = cipher.getAuthTag();

  // 3. Zeroize plaintext DEK buffer
  Buffer.from(plaintextDek).fill(0);

  return {
    encryptedDekBase64: Buffer.from(encryptedDek).toString("base64"),
    ivBase64: iv.toString("base64"),
    ciphertextBase64: ciphertext.toString("base64"),
    authTagBase64: authTag.toString("base64"),
  };
}
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Hardcoded AES Keys in Source Code**: Storing `const SECRET_KEY = "mysecretkey123"` in git repositories.
- ❌ **Reusing AES-GCM IVs**: Using a static initialization vector (IV) across multiple encryptions, destroying cryptographic security.
- ❌ **Encrypting Unauthenticated (AES-CBC without HMAC)**: Using CBC mode without HMAC verification, making ciphertext vulnerable to padding oracle attacks.

---

## 6. Real-World Production Example

```markdown
**PII Encryption at Scale**:
- Implemented Envelope Encryption across 10M patient records.
- KMS cost was only $1.20/month because data keys were generated once per batch and encrypted locally.
```
