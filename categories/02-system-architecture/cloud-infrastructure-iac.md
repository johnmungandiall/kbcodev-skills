# Skill: Cloud Infrastructure as Code (IaC) & Zero-Trust Architecture
`id`: `kbcodedev/cloud-infrastructure-iac`  
`category`: `02-system-architecture`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Provisioning, updating, and auditing cloud resources (AWS, GCP, Azure) using Terraform, OpenTofu, Pulumi, or CloudFormation.
- **Triggers**: Cloud environment setup, VPC/subnet topology design, IAM least-privilege policies, terraform plan reviews.
- **Prerequisites**: Cloud provider credentials, state backend configuration (S3/GCS with DynamoDB locking), module taxonomy.

---

## 2. Core Mental Model & Invariant Principles
1. **Immutable Infrastructure**: Never SSH into production servers to apply manual patches; replace instances via automated IaC pipelines.
2. **Zero-Trust Networking**: Default-deny on all Security Groups and VPC peering; enforce mTLS and IAM authentication across all services.
3. **State File Integrity**: Always use encrypted remote state backends with atomic distributed locking to prevent state corruption during concurrent applies.

---

## 3. High-Signal Execution Workflow

```
[IaC Code Changes / PR]
           │
           ▼
┌─────────────────────────┐
│ Phase 1: Static Lint &  │ ── tflint, checkov, tfsec (Zero high/crit vulnerabilities)
│ Security Scan           │
└──────────┬──────────────┘
           ▼
┌─────────────────────────┐
│ Phase 2: Speculative    │ ── terraform plan (Inspect additions, updates, destructions)
│ Plan Verification       │
└──────────┬──────────────┘
           ▼
┌─────────────────────────┐
│ Phase 3: Destruction    │ ── If destroys > 0, require manual confirmation gate
│ Gate Check              │
└──────────┬──────────────┘
           ▼
┌─────────────────────────┐
│ Phase 4: Atomic Apply   │ ── terraform apply -auto-approve (with state lock)
└─────────────────────────┘
```

### Production Terraform Best Practices
- **Pin Provider Versions**: Always constrain provider versions (`~> 5.0`) to avoid breaking provider upgrades.
- **Tag Everything**: Apply standardized tags (`Environment`, `Service`, `Owner`, `ManagedBy: Terraform`).
- **Secret Isolation**: Inject secrets via AWS Secrets Manager / HashiCorp Vault; never store plaintext secrets in `.tf` files or git.

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "provider": "aws",
  "resource": "Secure S3 Bucket for User Uploads",
  "security_requirements": [
    "SSE-KMS encryption",
    "Block all public access",
    "Enforce HTTPS only",
    "Lifecycle rule: archive to Glacier after 90 days"
  ]
}
```

### Output Contract
```hcl
# Production-Grade AWS S3 Bucket Resource Module
resource "aws_s3_bucket" "user_uploads" {
  bucket        = "${var.environment}-app-user-uploads"
  force_destroy = false

  tags = {
    Environment = var.environment
    Service     = "storage"
    ManagedBy   = "terraform"
  }
}

resource "aws_s3_bucket_public_access_block" "user_uploads_block" {
  bucket = aws_s3_bucket.user_uploads.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_server_side_encryption_configuration" "user_uploads_encryption" {
  bucket = aws_s3_bucket.user_uploads.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm     = "aws:kms"
      kms_master_key_id = var.kms_key_arn
    }
    bucket_key_enabled = true
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "user_uploads_lifecycle" {
  bucket = aws_s3_bucket.user_uploads.id

  rule {
    id     = "archive-old-uploads"
    status = "Enabled"

    transition {
      days          = 90
      storage_class = "GLACIER"
    }
  }
}
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Wildcard IAM Policies (`Action: "*"`)**: Granting blanket permissions instead of specific actions (e.g. `s3:GetObject`).
- ❌ **Local State Files (`terraform.tfstate`)**: Committing state files containing sensitive resource data to source control.
- ❌ **Unreviewed Plan Destructions**: Running `terraform apply` when the plan indicated 5 database instances would be destroyed and recreated.

---

## 6. Real-World Production Example

```markdown
**Audit Finding**: A production database security group allowed ingress on port 5432 from `0.0.0.0/0`.

**Remediation**:
- Modified Terraform: Restricted ingress CIDR blocks strictly to the private application subnet `10.0.2.0/24`.
- Verified: `terraform plan` indicated 1 in-place modification, 0 replacements. Applied seamlessly with zero downtime.
```
