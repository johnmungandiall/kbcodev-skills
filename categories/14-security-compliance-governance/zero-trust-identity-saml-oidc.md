# Skill: Zero-Trust Identity & Enterprise SSO (SAML / OIDC / SCIM)
`id`: `kbcodedev/zero-trust-identity-saml-oidc`  
`category`: `14-security-compliance-governance`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Implementing enterprise Single Sign-On (SSO) via SAML 2.0 and OpenID Connect (OIDC), Okta/WorkOS/Auth0 integrations, and automated user provisioning via SCIM 2.0.
- **Triggers**: Enterprise customer onboarding, SAML SSO requirement, automated user de-provisioning upon employee offboarding.
- **Prerequisites**: Identity Provider (IdP) metadata XML, Service Provider (SP) certificate keys.

---

## 2. Core Mental Model & Invariant Principles
1. **IdP-Initiated & SP-Initiated SSO Support**: Support both login from the enterprise Okta portal (IdP-initiated) and login from application domain (SP-initiated).
2. **Automated SCIM Directory Sync**: Listen for SCIM 2.0 Webhooks to automatically provision users when added to an Okta group and instantly revoke access when removed.
3. **Cryptographic SAML Signature Verification**: Always validate XML signatures against the IdP X.509 public certificate, asserting `NotBefore` and `NotOnOrAfter` timestamp validity.

---

## 3. High-Signal Execution Workflow

```
[Enterprise User Clicks "Log in with Okta"]
                     │
                     ▼
┌───────────────────────────────────────────┐
│ Step 1: SP Generates SAML AuthNRequest    │ ── Redirect to IdP SSO URL with Signed XML
└────────────────────┬──────────────────────┘
                     ▼
┌───────────────────────────────────────────┐
│ Step 2: User Authenticates at IdP (Okta)  │ ── Enterprise MFA verified
└────────────────────┬──────────────────────┘
                     ▼
┌───────────────────────────────────────────┐
│ Step 3: IdP Posts SAMLResponse to ACS URL │ ── Validate Signature & Extract Claims
└────────────────────┬──────────────────────┘
                     ▼
┌───────────────────────────────────────────┐
│ Step 4: Issue Application Session / JWT   │ ── JIT (Just-In-Time) User Provisioning
└───────────────────────────────────────────┘
```

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "idp_entity_id": "http://www.okta.com/exk829a1024",
  "sso_url": "https://company.okta.com/app/app_name/sso/saml",
  "x509_certificate": "-----BEGIN CERTIFICATE-----\nMIIDpDCCAoygAwIBAgIGAX...\n-----END CERTIFICATE-----"
}
```

### Output Contract
```typescript
// Production SAML 2.0 Assertion Consumer Service (ACS) Handler
import { validateSamlResponse } from './samlValidator';

export async function handleSamlAcsCallback(rawSamlResponse: string, tenantId: string) {
  const tenantConfig = await getTenantSamlConfig(tenantId);

  // 1. Verify XML Signature & Timestamp Validity
  const parsedAssertion = await validateSamlResponse(rawSamlResponse, {
    idpCertificate: tenantConfig.x509Certificate,
    expectedAudience: `https://api.example.com/sso/saml/${tenantId}/metadata`,
    clockToleranceMs: 30000,
  });

  const email = parsedAssertion.nameId;
  const firstName = parsedAssertion.attributes['firstName'];
  const lastName = parsedAssertion.attributes['lastName'];
  const groups = parsedAssertion.attributes['groups'] || [];

  // 2. Just-In-Time (JIT) Provision or Update User
  const user = await db.users.upsert({
    where: { email_tenantId: { email, tenantId } },
    update: { lastLoginAt: new Date() },
    create: {
      email,
      name: `${firstName} ${lastName}`.trim(),
      tenantId,
      role: groups.includes('Admins') ? 'ADMIN' : 'MEMBER',
    },
  });

  // 3. Issue Secure HttpOnly Application Session
  return createSessionCookie(user);
}
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Skipping SAML Signature Validation**: Parsing raw XML claims without verifying cryptographic signatures, allowing attackers to forge arbitrary admin assertions.
- ❌ **Hardcoded Tenant Domain Mappings**: Hardcoding `@acme.com` to a single organization ID instead of allowing enterprise admins to configure verified custom domains.
- ❌ **Ignoring SCIM De-Provisioning**: Forgetting to deactivate sessions when SCIM receives `DELETE /Users/{id}`, leaving terminated employees with active tokens.

---

## 6. Real-World Production Example

```markdown
**Enterprise SSO Implementation**:
- Enabled WorkOS SAML SSO for Fortune 500 customer.
- Automated SCIM provisioning synced 1,200 employees into their respective teams in 4 minutes with zero manual IT tickets.
```
