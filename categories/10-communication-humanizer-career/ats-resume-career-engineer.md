# Skill: ATS Resume & Technical Career Engineer
`id`: `kbcodedev/ats-resume-career-engineer`  
`category`: `10-communication-humanizer-career`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Engineering high-impact, Applicant Tracking System (ATS) optimized resumes, executive CVs, LinkedIn summaries, and career portfolios for senior/staff software engineers and leaders.
- **Triggers**: Resume rewriting, career transition, tech job application prep, ATS keyword alignment.
- **Prerequisites**: Candidate career history, target role job description (JD).

---

## 2. Core Mental Model & Invariant Principles
1. **ATS Parsability Over Fancy Columns**: Never use two-column layouts, tables, text boxes, or graphics that confuse ATS parsers (Workday, Greenhouse, Lever). Use clean single-column markdown or LaTeX.
2. **Google XYZ Bullet Formulation**: Every single achievement bullet must follow: *"Accomplished [X] as measured by [Y] by doing [Z]"*.
3. **Keyword Density without Keyword Stuffing**: Integrate required hard skills (e.g. *Kubernetes, Distributed Systems, Go, Kafka, PostgreSQL*) naturally into work accomplishment bullets.

---

## 3. High-Signal Execution Workflow

```
[Candidate Raw Experience + Target Job Description]
                        │
                        ▼
┌──────────────────────────────────────────────┐
│ Phase 1: JD Keyword & Competency Extraction  │ ── Extract top 15 required hard technologies
└───────────────────────┬──────────────────────┘
                        ▼
┌──────────────────────────────────────────────┐
│ Phase 2: Single-Column Structural Layout     │ ── Contact -> Summary -> Experience -> Skills
└───────────────────────┬──────────────────────┘
                        ▼
┌──────────────────────────────────────────────┐
│ Phase 3: XYZ Bullet Refinement               │ ── Transform passive duties into metric bullets
└───────────────────────┬──────────────────────┘
                        ▼
┌──────────────────────────────────────────────┐
│ Phase 4: ATS Parse Simulation & Validation   │ ── Verify plain-text extractability (100% score)
└──────────────────────────────────────────────┘
```

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "target_role": "Staff Backend Engineer (Distributed Systems)",
  "raw_experience": "I was in charge of the payments team. I fixed slow database queries and made the checkout faster. I also helped onboard junior developers."
}
```

### Output Contract
```markdown
# John Doe
San Francisco, CA | (555) 019-2834 | john.doe@email.com | github.com/johndoe | linkedin.com/in/johndoe

## PROFESSIONAL SUMMARY
Staff Backend Engineer with 8+ years architecting high-throughput distributed systems, event-driven microservices, and financial ledgers. Scaled payment infrastructure to 50,000 req/sec while maintaining 99.99% SLA availability across multi-region Kubernetes clusters.

## PROFESSIONAL EXPERIENCE

**Lead Distributed Systems Engineer** | Stripe / FinTech Corp (2022 – Present)
- Architected zero-downtime database partitioning strategy for PostgreSQL ledger, reducing p99 checkout latency by 64% (from 420ms to 150ms) across $4.2B annual volume.
- Eliminated payment reconciliation drift by implementing Transactional Outbox pattern with Kafka, ensuring exactly-once processing across 12 downstream microservices.
- Mentored 6 senior and mid-level engineers, establishing engineering RFC review standards that accelerated sprint delivery velocity by 25%.

## TECHNICAL SKILLS
- **Languages**: Go, TypeScript, Rust, Python, SQL
- **Distributed Systems**: Kafka, RabbitMQ, Redis, gRPC, REST, Microservices, Event Sourcing
- **Cloud & DevOps**: Kubernetes, Docker, AWS (EKS, Aurora, S3), Terraform, CI/CD, Prometheus
- **Databases**: PostgreSQL, MySQL, DynamoDB, Redis
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Job Duty Descriptions**: Writing *"Responsible for managing tickets"* instead of measurable business outcomes.
- ❌ **Two-Column Graphical PDF Templates**: Using Photoshop/Canva two-column resumes where ATS parsers merge unrelated text lines together.
- ❌ **Soft Skill Lists**: Listing *"Team player, Hard worker, Good communicator"* instead of demonstrating leadership through measurable achievements.

---

## 6. Real-World Production Example

```markdown
**Resume Transformation**:
- Before: *"Worked on migration to Kubernetes."*
- After: *"Led migration of 40 microservices from legacy EC2 instances to Amazon EKS, cutting AWS compute costs by 34% ($180k/year) and reducing deployment cycle times from 45 minutes to 3 minutes."*
```
