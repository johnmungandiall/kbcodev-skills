# 🚀 kbcodedev-skills: The Advanced AI Developer Skills Master Library

A production-grade, meticulously synthesized, category-wise library of **115 advanced yet simplified AI developer skills, agentic orchestration engines, architectural frameworks, and engineering playbooks** designed specifically for **kbcode**, Claude Code, and modern autonomous AI coding assistants.

Synthesized and completely rewritten from over 50,000 raw prompts and prompt repositories into clean, contract-driven, high-signal skill modules.

---

## 🏛️ Core Philosophy: Advanced & Simplified

Unlike raw prompt dumps filled with conversational filler, repetitive clichés, and vague instructions, every skill in **kbcodedev-skills** adheres to four non-negotiable architectural principles:

1. **High-Signal, Zero Fluff**: Stripped of generic conversational pleasantries. Pure, actionable execution pipelines.
2. **Contract-Driven Specification**: Every skill includes explicit **Trigger Conditions**, **Input JSON Contracts**, **Output Contracts**, and **Invariant Principles**.
3. **Falsification & Safety Gating**: Embedded root-cause verification, non-destructive alternatives, and blast-radius risk tiering.
4. **Autonomous ReAct & Tool Ergonomics**: Optimized for dynamic batch tool execution, minimal token overhead, and KV-cache reuse.

---

## 📁 Category Taxonomy & Master Directory Structure

```
C:\dev\kbcodev-skills/
├── README.md                                  # Master Library Documentation & Catalog (With 'When to Use' Guide)
├── SKILLS_MANIFEST.json                       # Machine-Readable JSON Skills Registry (115 Skills)
├── INDEX.md                                   # Task-to-Skill Fast Lookup Table (115 Mappings)
├── AGENT.md                                   # Agent Navigation & Project Guide
│
├── categories/
│   ├── 01-agentic-orchestration/             # Autonomous ReAct, Swarms, DAGs, Reflexion, Guards (8 Skills)
│   ├── 02-system-architecture/               # C4, Distributed Microservices, DB Schemas, IaC, Kafka (6 Skills)
│   ├── 03-software-engineering/              # Scaffolding, Refactoring, Big-O, Concurrency, Regex (7 Skills)
│   ├── 04-testing-qa-debugging/              # Root Cause, Test Generators, E2E, Profilers, Bisect (7 Skills)
│   ├── 05-frontend-ui-ux/                    # Next.js, Design Tokens, Artifacts, A11y, Vision (7 Skills)
│   ├── 06-devops-sre-release/                # Zero-Downtime Ship, CI/CD, K8s, Docker, OTel (6 Skills)
│   ├── 07-ai-mcp-prompt-engineering/         # Claude API, MCP Servers, Metaprompts, Checkpoints (7 Skills)
│   ├── 08-strategic-product-leadership/      # CEO/Staff Reviews, YC Playbook, PRDs, Retros (7 Skills)
│   ├── 09-document-media-synthesis/          # Programmatic DOCX, PDF, PPTX, XLSX, RFCs (5 Skills)
│   ├── 10-communication-humanizer-career/    # De-AI Voice, ATS Resumes, XYZ Bullets, Memos (5 Skills)
│   ├── 11-scientific-quantitative-ai/        # Research Synthesis, Stats, Polars, Genomics, SciPy (6 Skills)
│   ├── 12-mobile-cross-platform/             # React Native, Flutter, Swift 6, Kotlin Compose, Offline Sync (5 Skills)
│   ├── 13-data-engineering-mlops/            # Feature Stores, Qdrant RAG, Triton, Airflow, Iceberg (5 Skills)
│   ├── 14-security-compliance-governance/    # SOC2/GDPR, SAML SSO, AWS KMS, STRIDE, WAF, Injection Guard (6 Skills)
│   ├── 15-c-suite-executive-advisory/        # CTO Radar, CFO SaaS Unit Economics, CPO JTBD, Product Hunt, Cap Tables (8 Skills)
│   ├── 16-tool-integrations-connectors/      # GitHub Octokit, Slack Bolt, Stripe, Supabase Prisma, Linear (5 Skills)
│   ├── 17-visual-architecture-diagrams/      # Sequence Flows, ERD, Multi-AZ VPC, FSM Diagrams (4 Skills)
│   ├── 18-yc-tech-leaders-frameworks/        # Altman Velocity, Amodei Safety, Karpathy OS, Andrew Ng, Paul Graham (5 Skills)
│   ├── 19-game-dev-3d-graphics/              # Three.js WebGL Shaders, Game Loop Physics Engines (2 Skills)
│   ├── 20-web-scraping-browser-automation/   # Anti-Detect Stealth Scraping, High-Concurrency Crawlers (2 Skills)
│   └── 21-systems-embedded-programming/      # Bare-Metal no_std Rust, C/C++ Valgrind ASan Leak Sanitizers (2 Skills)
│
└── kb/                                        # Knowledge Base Index & Cheatsheet
```

---

## 🎯 Master Skills Catalog & "When to Use" Guide (115 Production Skills)

---

### 01. Agentic Orchestration & Autonomous Systems (8 Skills)

| Skill File | Skill ID | Core Capability | When to Use (Edhi Eppudu Use Cheyyali / Triggers) |
|---|---|---|---|
| [`autonomous-react-loop.md`](categories/01-agentic-orchestration/autonomous-react-loop.md) | `kbcodedev/autonomous-react-loop` | Autonomous ReAct execution loops, step budgets, oscillation detection | **Use when**: Executing long-running autonomous tasks unattended, multi-step refactoring, or iterative bug hunting requiring dynamic hypothesis-action-observation cycles. |
| [`multi-agent-swarm.md`](categories/01-agentic-orchestration/multi-agent-swarm.md) | `kbcodedev/multi-agent-swarm` | Supervisor-worker topologies, context isolation, file ownership gating | **Use when**: Decomposing large, multi-domain features across separate frontend/backend/database scopes with strict file-ownership isolation (`owns: [...]`). |
| [`dag-task-planner.md`](categories/01-agentic-orchestration/dag-task-planner.md) | `kbcodedev/dag-task-planner` | Prerequisite DAG planning, autonomous concurrency, dynamic task spawning | **Use when**: Planning multi-stage workflows with clear prerequisite dependencies (`needs: [1, 2]`), parallel branch execution, and mid-flight task discovery. |
| [`memory-reflexion-engine.md`](categories/01-agentic-orchestration/memory-reflexion-engine.md) | `kbcodedev/memory-reflexion-engine` | Episodic memory, failure diagnosis, immediate mistake binding | **Use when**: A command fails, syntax error occurs, or user correction is received. Instantly notes mistakes and binds active negative rules to prevent repetition. |
| [`tool-use-orchestrator.md`](categories/01-agentic-orchestration/tool-use-orchestrator.md) | `kbcodedev/tool-use-orchestrator` | 3-question batch test, rate-limit backoff, payload sanitization | **Use when**: Batching independent read/search/command tool invocations in a single turn to minimize token round trips and stay under rate limits. |
| [`blast-radius-safety-gate.md`](categories/01-agentic-orchestration/blast-radius-safety-gate.md) | `kbcodedev/blast-radius-safety-gate` | 3-tier risk assessment, non-destructive fallbacks, numbered approval rosters | **Use when**: Performing high-impact or destructive operations (deleting files, `git reset --hard`, dropping tables). Enforces backups and flat numbered approval. |
| [`agent-trajectory-evaluator.md`](categories/01-agentic-orchestration/agent-trajectory-evaluator.md) | `kbcodedev/agent-trajectory-evaluator` | LLM-as-a-judge trajectory grading, milestone verification, hallucination checks | **Use when**: Auditing agent execution logs, grading multi-step prompt workflows, testing prompt regressions, or evaluating code generation factuality. |
| [`codebase-freeze-unfreeze-guard.md`](categories/01-agentic-orchestration/codebase-freeze-unfreeze-guard.md) | `kbcodedev/codebase-freeze-unfreeze-guard` | Codebase mutation lock-in, scope whitelisting, zero collateral drift | **Use when**: Locking down working tree files during critical refactorings, hotfixes, or autonomous agent runs to strictly prevent touching out-of-scope files. |

---

### 02. System Architecture & Distributed Systems (6 Skills)

| Skill File | Skill ID | Core Capability | When to Use (Edhi Eppudu Use Cheyyali / Triggers) |
|---|---|---|---|
| [`c4-system-architecture.md`](categories/02-system-architecture/c4-system-architecture.md) | `kbcodedev/c4-system-architecture` | 4-level zoom modeling (Context, Container, Component, Code), Diagram-as-Code | **Use when**: Designing new systems, documenting architecture for RFCs, onboarding engineers, or mapping service boundaries and data flow visually. |
| [`distributed-microservices.md`](categories/02-system-architecture/distributed-microservices.md) | `kbcodedev/distributed-microservices` | Circuit breakers, idempotency keys, transactional outbox pattern | **Use when**: Building resilient inter-service communication, preventing cascading failures, or designing idempotent payment/order processing APIs. |
| [`database-schema-modeling.md`](categories/02-system-architecture/database-schema-modeling.md) | `kbcodedev/database-schema-modeling` | Relational 3NF, compound index prefix rules, non-blocking DDL migrations | **Use when**: Designing database schemas, optimizing slow SQL queries (`EXPLAIN ANALYZE`), adding indices, or staging zero-downtime database migrations. |
| [`api-design-rest-graphql-grpc.md`](categories/02-system-architecture/api-design-rest-graphql-grpc.md) | `kbcodedev/api-design-rest-graphql-grpc` | REST OpenAPI 3.1, GraphQL schemas, gRPC Protobuf binary contracts | **Use when**: Authoring public or internal API specs, choosing between REST/GraphQL/gRPC, standardizing error envelopes, or implementing cursor pagination. |
| [`cloud-infrastructure-iac.md`](categories/02-system-architecture/cloud-infrastructure-iac.md) | `kbcodedev/cloud-infrastructure-iac` | Terraform/OpenTofu, zero-trust VPC networking, speculative plan audits | **Use when**: Provisioning cloud infrastructure (AWS/GCP/Azure), writing Terraform modules, auditing IAM least-privilege, or reviewing speculative plans. |
| [`event-driven-streaming.md`](categories/02-system-architecture/event-driven-streaming.md) | `kbcodedev/event-driven-streaming` | Kafka/RabbitMQ streams, partition key ordering, Dead Letter Queues (DLQ) | **Use when**: Designing asynchronous event processing, pub/sub architectures, high-throughput message ingestion, or handling failed message DLQs. |

---

### 03. Software Engineering & Code Mastery (7 Skills)

| Skill File | Skill ID | Core Capability | When to Use (Edhi Eppudu Use Cheyyali / Triggers) |
|---|---|---|---|
| [`code-scaffolding-synthesis.md`](categories/03-software-engineering/code-scaffolding-synthesis.md) | `kbcodedev/code-scaffolding-synthesis` | Clean-room boilerplate synthesis, dependency injection, type safety | **Use when**: Bootstrapping new microservices, packages, domain modules, or CLI tools from scratch with production-grade defaults and DI architecture. |
| [`deep-code-refactoring.md`](categories/03-software-engineering/deep-code-refactoring.md) | `kbcodedev/deep-code-refactoring` | Strangler Fig refactoring, code smell elimination, behavioral preservation | **Use when**: Deconstructing god classes, breaking down long methods, eliminating duplication, and modernizing legacy code without behavioral regressions. |
| [`algorithmic-optimization.md`](categories/03-software-engineering/algorithmic-optimization.md) | `kbcodedev/algorithmic-optimization` | $O(N^2) \rightarrow O(N)$ asymptotic transformations, memory locality, hot paths | **Use when**: Profiling CPU/memory bottlenecks, optimizing slow algorithms, eliminating nested loop lookups, or speeding up batch data processing. |
| [`language-migration-modernizer.md`](categories/03-software-engineering/language-migration-modernizer.md) | `kbcodedev/language-migration-modernizer` | Cross-language translation (Py to Go/Rust, JS to TS), modern idioms | **Use when**: Migrating legacy codebases to modern languages (e.g. JavaScript to TypeScript, Python to Go), upgrading syntax, or adopting strict typing. |
| [`regex-parser-engineering.md`](categories/03-software-engineering/regex-parser-engineering.md) | `kbcodedev/regex-parser-engineering` | ReDoS-safe regular expressions, lexers, AST recursive descent parsers | **Use when**: Parsing complex text formats, extracting structured data from logs, writing custom DSLs, or preventing ReDoS catastrophic backtracking. |
| [`clean-code-solid-principles.md`](categories/03-software-engineering/clean-code-solid-principles.md) | `kbcodedev/clean-code-solid-principles` | SOLID architectural implementation, interface segregation, inversion of control | **Use when**: Refactoring tightly coupled classes, defining client-specific interfaces, and implementing extensible plugins using Open/Closed principles. |
| [`concurrency-async-patterns.md`](categories/03-software-engineering/concurrency-async-patterns.md) | `kbcodedev/concurrency-async-patterns` | Bounded worker pools, event loop concurrency, deadlock & race elimination | **Use when**: Handling concurrent async operations, throttling network requests, preventing socket exhaustion, or eliminating multi-threaded deadlocks. |

---

### 04. Testing, QA & Deep Debugging (7 Skills)

| Skill File | Skill ID | Core Capability | When to Use (Edhi Eppudu Use Cheyyali / Triggers) |
|---|---|---|---|
| [`root-cause-investigator.md`](categories/04-testing-qa-debugging/root-cause-investigator.md) | `kbcodedev/root-cause-investigator` | 5-Whys diagnostic protocol, stack frame inspection, minimal repro isolation | **Use when**: Investigating tricky bugs, production stack traces, unhandled exceptions, or intermittent failures. Probes the root cause before fixing. |
| [`unit-integration-test-generator.md`](categories/04-testing-qa-debugging/unit-integration-test-generator.md) | `kbcodedev/unit-integration-test-generator` | AAA pattern test suites, boundary condition testing, fast in-memory fakes | **Use when**: Writing unit and integration test suites, covering edge cases (0, 1, max, null), testing error branches, and verifying regression fixes. |
| [`e2e-webapp-testing.md`](categories/04-testing-qa-debugging/e2e-webapp-testing.md) | `kbcodedev/e2e-webapp-testing` | Playwright/Vitest browser automation, accessible role locators, auto-waiting | **Use when**: Writing browser end-to-end tests for critical user flows (Sign Up, Checkout, Dashboard), eliminating flaky tests, or release gating. |
| [`performance-profiler-benchmark.md`](categories/04-testing-qa-debugging/performance-profiler-benchmark.md) | `kbcodedev/performance-profiler-benchmark` | p95/p99 latency percentile benchmarking, CPU flamegraphs, k6 load testing | **Use when**: Stress-testing HTTP endpoints, diagnosing high latency (p95 > 300ms), finding memory leaks, or running k6 load test simulations. |
| [`security-vulnerability-auditor.md`](categories/04-testing-qa-debugging/security-vulnerability-auditor.md) | `kbcodedev/security-vulnerability-auditor` | OWASP Top 10 SAST scanning, SQLi/SSRF/XSS remediation, secret detection | **Use when**: Auditing code for security flaws (SQL injection, XSS, SSRF, path traversal), scanning dependencies for CVEs, or checking for leaked secrets. |
| [`canary-regression-verifier.md`](categories/04-testing-qa-debugging/canary-regression-verifier.md) | `kbcodedev/canary-regression-verifier` | Synthetic health probing, canary error rate gates, automated rollbacks | **Use when**: Verifying canary deployments in staging/production, comparing canary vs baseline error rates, or setting up automated rollback gates. |
| [`automated-git-bisect-debugger.md`](categories/04-testing-qa-debugging/automated-git-bisect-debugger.md) | `kbcodedev/automated-git-bisect-debugger` | Automated git bisect binary search, regression commit identification | **Use when**: Hunting down the exact commit that introduced a test regression, memory leak, or performance drop across hundreds of commits in $O(\log N)$ time. |

---

### 05. Frontend UI/UX & Design Systems (7 Skills)

| Skill File | Skill ID | Core Capability | When to Use (Edhi Eppudu Use Cheyyali / Triggers) |
|---|---|---|---|
| [`modern-frontend-architecture.md`](categories/05-frontend-ui-ux/modern-frontend-architecture.md) | `kbcodedev/modern-frontend-architecture` | Next.js App Router, React Server Components (RSC), optimistic UI updates | **Use when**: Architecting React/Next.js web apps, dividing server vs client components (`'use client'`), managing URL state, or optimizing initial load bundles. |
| [`design-system-theme-tokens.md`](categories/05-frontend-ui-ux/design-system-theme-tokens.md) | `kbcodedev/design-system-theme-tokens` | 3-tier semantic token architecture, CSS custom properties, Light/Dark modes | **Use when**: Building design systems, creating scalable CSS variable tokens, configuring Tailwind themes, or implementing smooth Light/Dark theme switching. |
| [`interactive-artifacts-builder.md`](categories/05-frontend-ui-ux/interactive-artifacts-builder.md) | `kbcodedev/interactive-artifacts-builder` | Standalone interactive React/Tailwind/Lucide prototypes and visual calculators | **Use when**: Building self-contained, single-file interactive React/Tailwind prototypes, visual calculators, or live SaaS dashboard demos for artifacts. |
| [`a11y-accessibility-spec.md`](categories/05-frontend-ui-ux/a11y-accessibility-spec.md) | `kbcodedev/a11y-accessibility-spec` | WCAG 2.1 AA compliance, keyboard focus trapping, accessible ARIA roles | **Use when**: Auditing and building accessible UI components (modals, dropdowns, forms) supporting screen readers, keyboard navigation, and contrast AA rules. |
| [`responsive-layout-engine.md`](categories/05-frontend-ui-ux/responsive-layout-engine.md) | `kbcodedev/responsive-layout-engine` | Mobile-first CSS Grid & Flexbox, container queries, fluid typography clamp | **Use when**: Crafting fluid, mobile-first responsive grids, multi-column dashboards, adaptive navigation bars, or container-query-driven components. |
| [`canvas-generative-visuals.md`](categories/05-frontend-ui-ux/canvas-generative-visuals.md) | `kbcodedev/canvas-generative-visuals` | High-DPI Retina HTML5 Canvas, delta-time animation loops, interactive particles | **Use when**: Building custom charts, high-performance HTML5 canvas visualizations, mathematical generative backgrounds, or interactive particle networks. |
| [`multi-modal-vision-inspector.md`](categories/05-frontend-ui-ux/multi-modal-vision-inspector.md) | `kbcodedev/multi-modal-vision-inspector` | Vision model UI screenshot analysis, visual bug localization, CSS fix mapping | **Use when**: Inspecting UI screenshots or wireframes, localizing clipped elements, bad contrast, or broken responsive layouts, and generating exact CSS fixes. |

---

### 06. DevOps, SRE & Release Engineering (6 Skills)

| Skill File | Skill ID | Core Capability | When to Use (Edhi Eppudu Use Cheyyali / Triggers) |
|---|---|---|---|
| [`zero-downtime-ship-pipeline.md`](categories/06-devops-sre-release/zero-downtime-ship-pipeline.md) | `kbcodedev/zero-downtime-ship-pipeline` | Blue-Green releases, expand-and-contract DB staging, traffic switchover | **Use when**: Releasing new service versions to production, coordinating blue-green traffic shifts, staging database migrations, or enforcing release gates. |
| [`ci-cd-workflow-automation.md`](categories/06-devops-sre-release/ci-cd-workflow-automation.md) | `kbcodedev/ci-cd-workflow-automation` | GitHub Actions matrix testing, lockfile caching, cloud OIDC auth | **Use when**: Setting up or accelerating CI/CD pipelines (GitHub Actions/GitLab CI), configuring matrix test runners, or replacing static secrets with OIDC. |
| [`docker-container-orchestration.md`](categories/06-devops-sre-release/docker-container-orchestration.md) | `kbcodedev/docker-container-orchestration` | Multi-stage Dockerfiles, non-root user execution, minimal Alpine/Distroless | **Use when**: Authoring secure, minimal multi-stage Dockerfiles, optimizing image size (<100MB), speeding up layer caching, or setting up Docker Compose. |
| [`kubernetes-deployment-configs.md`](categories/06-devops-sre-release/kubernetes-deployment-configs.md) | `kbcodedev/kubernetes-deployment-configs` | Pod anti-affinity, resource limits, preStop drain hooks, PodDisruptionBudgets | **Use when**: Writing production Kubernetes manifests, configuring HPA autoscaling, setting CPU/memory limits, or configuring graceful pod termination. |
| [`observability-logging-telemetry.md`](categories/06-devops-sre-release/observability-logging-telemetry.md) | `kbcodedev/observability-logging-telemetry` | OpenTelemetry distributed tracing, W3C TraceContext, structured JSON logs | **Use when**: Instrumenting microservices with OpenTelemetry, propagating distributed trace context, standardizing structured JSON logs, or tracking metrics. |
| [`infrastructure-security-hardening.md`](categories/06-devops-sre-release/infrastructure-security-hardening.md) | `kbcodedev/infrastructure-security-hardening` | CIS Benchmarks, drop Linux capabilities, read-only container root filesystems | **Use when**: Hardening servers, containers, and Kubernetes pods against CIS benchmarks, dropping Linux capabilities, or enforcing read-only root filesystems. |

---

### 07. AI, MCP & Prompt Engineering (7 Skills)

| Skill File | Skill ID | Core Capability | When to Use (Edhi Eppudu Use Cheyyali / Triggers) |
|---|---|---|---|
| [`claude-api-advanced-patterns.md`](categories/07-ai-mcp-prompt-engineering/claude-api-advanced-patterns.md) | `kbcodedev/claude-api-advanced-patterns` | Claude 3.5/3.7 API integration, prompt caching breakpoints, thinking budgets | **Use when**: Integrating Anthropic Claude API, optimizing prompt caching for 90% cost savings, authoring tool use schemas, or configuring thinking budgets. |
| [`mcp-server-builder.md`](categories/07-ai-mcp-prompt-engineering/mcp-server-builder.md) | `kbcodedev/mcp-server-builder` | Model Context Protocol servers in TS/Python, tools, resources, stdio safety | **Use when**: Authoring custom Model Context Protocol (MCP) servers to expose proprietary tools, databases, or APIs to Claude Desktop, kbcode, or Cursor. |
| [`metaprompt-chain-of-thought.md`](categories/07-ai-mcp-prompt-engineering/metaprompt-chain-of-thought.md) | `kbcodedev/metaprompt-chain-of-thought` | XML cognitive scaffolding, structured thinking tags, negative constraints | **Use when**: Designing foundational system prompts, dynamic prompt generators, structured XML cognitive scaffolding, and multi-step reasoning guidelines. |
| [`skill-authoring-framework.md`](categories/07-ai-mcp-prompt-engineering/skill-authoring-framework.md) | `kbcodedev/skill-authoring-framework` | Reusable agent skill design, contract schemas, benchmarking & falsification | **Use when**: Authoring, benchmarking, packaging, and evaluating new reusable skills for AI coding agents following the canonical kbcodedev standard. |
| [`context-window-optimization.md`](categories/07-ai-mcp-prompt-engineering/context-window-optimization.md) | `kbcodedev/context-window-optimization` | KV-cache reuse, session worklog compaction, minimal targeted file reads | **Use when**: Managing long agent coding sessions, compacting conversation history without losing rules, or preventing context window token overflow. |
| [`structured-output-json-schema.md`](categories/07-ai-mcp-prompt-engineering/structured-output-json-schema.md) | `kbcodedev/structured-output-json-schema` | JSON Schema Draft 7 validation, prose stripping, self-correcting repair loops | **Use when**: Enforcing guaranteed, strictly valid JSON output from LLMs conforming to JSON Schema (Draft 7), auto-repairing malformed JSON strings. |
| [`context-save-restore-checkpoint.md`](categories/07-ai-mcp-prompt-engineering/context-save-restore-checkpoint.md) | `kbcodedev/context-save-restore-checkpoint` | Session state snapshots, persistent memory serialization across LLM restarts | **Use when**: Serializing active agent state, modified files, and verified milestones to disk, enabling instant session recovery upon cold reboots. |

---

### 08. Strategic & Product Leadership (7 Skills)

| Skill File | Skill ID | Core Capability | When to Use (Edhi Eppudu Use Cheyyali / Triggers) |
|---|---|---|---|
| [`ceo-strategic-plan-review.md`](categories/08-strategic-product-leadership/ceo-strategic-plan-review.md) | `kbcodedev/ceo-strategic-plan-review` | Product-Market Fit (PMF) audits, scope-halving pass, unit economics review | **Use when**: Reviewing feature proposals from a business, monetization, and PMF perspective. Cuts 70% of non-essential scope to ship an MVP in days. |
| [`staff-eng-architect-review.md`](categories/08-strategic-product-leadership/staff-eng-architect-review.md) | `kbcodedev/staff-eng-architect-review` | One-way vs two-way doors, failure domain segregation, scalability limits | **Use when**: Conducting high-level Staff/Principal Engineer technical reviews on RFCs, evaluating hard-to-reverse architectural decisions and failure modes. |
| [`product-design-ux-review.md`](categories/08-strategic-product-leadership/product-design-ux-review.md) | `kbcodedev/product-design-ux-review` | Cognitive friction audits, 60-second onboarding tests, form ergonomics | **Use when**: Auditing user journeys, onboarding flows, checkout forms, or UI wireframes to eliminate cognitive friction, confusing affordances, and drop-offs. |
| [`developer-experience-devex-review.md`](categories/08-strategic-product-leadership/developer-experience-devex-review.md) | `kbcodedev/developer-experience-devex-review` | Time-to-Hello-World < 5 min, actionable error messages, SDK ergonomics | **Use when**: Designing or reviewing SDKs, CLI command structures, API ergonomics, or developer error messages to ensure <5 minute time-to-hello-world. |
| [`yc-startup-playbook.md`](categories/08-strategic-product-leadership/yc-startup-playbook.md) | `kbcodedev/yc-startup-playbook` | Do Things That Don't Scale, 7-day MVP sprints, high-velocity iterations | **Use when**: Guiding early-stage startup execution, rapid prototyping, recruiting first 100 users, running 7-day validation sprints, and avoiding fake work. |
| [`prd-roadmap-engineering.md`](categories/08-strategic-product-leadership/prd-roadmap-engineering.md) | `kbcodedev/prd-roadmap-engineering` | Structured PRDs, explicit non-goals, RICE prioritization, phased milestones | **Use when**: Writing Product Requirement Documents (PRDs), defining explicit out-of-scope non-goals, scoring features via RICE, and planning phased roadmaps. |
| [`post-mortem-incident-retro.md`](categories/08-strategic-product-leadership/post-mortem-incident-retro.md) | `kbcodedev/post-mortem-incident-retro` | Blameless incident post-mortems, 5-Whys root cause, preventive action items | **Use when**: Conducting blameless post-mortem reviews after production outages, reconstructing incident timelines, and generating preventive action items. |

---

### 09. Document & Media Synthesis (5 Skills)

| Skill File | Skill ID | Core Capability | When to Use (Edhi Eppudu Use Cheyyali / Triggers) |
|---|---|---|---|
| [`programmatic-docx-generator.md`](categories/09-document-media-synthesis/programmatic-docx-generator.md) | `kbcodedev/programmatic-docx-generator` | Programmatic Word docx generation, styled tables, executive callout boxes | **Use when**: Programmatically generating polished Word (.docx) audit reports, contracts, executive summaries, or whitepapers with styled tables and headers. |
| [`typographic-pdf-generator.md`](categories/09-document-media-synthesis/typographic-pdf-generator.md) | `kbcodedev/typographic-pdf-generator` | Print-ready PDF synthesis, CSS `@page` media, base64 asset embedding | **Use when**: Generating crisp, print-ready PDF invoices, financial statements, or formal technical reports using Puppeteer with CSS paged media rules. |
| [`executive-slide-pptx-generator.md`](categories/09-document-media-synthesis/executive-slide-pptx-generator.md) | `kbcodedev/executive-slide-pptx-generator` | 16:9 widescreen PowerPoint deck synthesis, 3-column metric cards | **Use when**: Authoring clean, executive-ready 16:9 widescreen PowerPoint (.pptx) decks, investor pitch presentations, or engineering performance slides. |
| [`financial-model-xlsx-generator.md`](categories/09-document-media-synthesis/financial-model-xlsx-generator.md) | `kbcodedev/financial-model-xlsx-generator` | Dynamic Excel formulas (`=B2*B3`), SaaS unit economics, accounting formatting | **Use when**: Programmatically generating Excel (.xlsx) financial forecasts, SaaS unit economics models, and budget spreadsheets with dynamic formulas. |
| [`technical-rfc-doc-coauthor.md`](categories/09-document-media-synthesis/technical-rfc-doc-coauthor.md) | `kbcodedev/technical-rfc-doc-coauthor` | Architectural Decision Records (ADRs), trade-off evaluation matrices, RFCs | **Use when**: Authoring technical RFCs, documenting immutable Architectural Decision Records (ADRs), and tabulating trade-offs for team alignment. |

---

### 10. Communication, Humanizer & Career Engineering (5 Skills)

| Skill File | Skill ID | Core Capability | When to Use (Edhi Eppudu Use Cheyyali / Triggers) |
|---|---|---|---|
| [`humanizer-de-ai-voice.md`](categories/10-communication-humanizer-career/humanizer-de-ai-voice.md) | `kbcodedev/humanizer-de-ai-voice` | De-AI rewriting, purging synthetic clichés ("delve", "tapestry"), burstiness | **Use when**: Rewriting AI-generated technical prose, blog posts, or announcements to eliminate robotic clichés, formulaic sentence lengths, and buzzwords. |
| [`ats-resume-career-engineer.md`](categories/10-communication-humanizer-career/ats-resume-career-engineer.md) | `kbcodedev/ats-resume-career-engineer` | Single-column ATS resume architecture, keyword density, engineering CVs | **Use when**: Engineering high-impact, ATS-optimized single-column resumes for senior/staff engineers and leaders targeting Workday/Greenhouse parsers. |
| [`google-xyz-impact-bullets.md`](categories/10-communication-humanizer-career/google-xyz-impact-bullets.md) | `kbcodedev/google-xyz-impact-bullets` | "Accomplished [X] measured by [Y] by doing [Z]" bullet formulation | **Use when**: Polishing resume accomplishment bullets, annual performance self-evaluations, or promotion packets using Google's formula. |
| [`executive-internal-comms.md`](categories/10-communication-humanizer-career/executive-internal-comms.md) | `kbcodedev/executive-internal-comms` | BLUF executive status memos, cross-team announcements, blocker escalations | **Use when**: Drafting crisp weekly executive status updates, cross-team milestone announcements, or escalating blockers to leadership with 30-second BLUF. |
| [`tech-interview-grilling-prep.md`](categories/10-communication-humanizer-career/tech-interview-grilling-prep.md) | `kbcodedev/tech-interview-grilling-prep` | Staff system design defense, capacity estimation math, trade-off defense | **Use when**: Preparing for Senior/Staff system design interviews, practicing back-of-the-envelope capacity calculations, or defending failure trade-offs. |

---

### 11. Scientific & Quantitative AI (6 Skills)

| Skill File | Skill ID | Core Capability | When to Use (Edhi Eppudu Use Cheyyali / Triggers) |
|---|---|---|---|
| [`scientific-literature-synthesis.md`](categories/11-scientific-quantitative-ai/scientific-literature-synthesis.md) | `kbcodedev/scientific-literature-synthesis` | Systematic research review, methodology extraction matrix, citation rigor | **Use when**: Reviewing scientific literature, synthesizing machine learning papers, extracting benchmark comparison matrices, and verifying citations. |
| [`quantitative-statistical-modeler.md`](categories/11-scientific-quantitative-ai/quantitative-statistical-modeler.md) | `kbcodedev/quantitative-statistical-modeler` | A/B test Z-tests, confidence intervals, Cohen's d effect sizes, assumption checks | **Use when**: Analyzing A/B test experiments, conducting statistical hypothesis tests ($t$-test, Z-test), validating normality, and calculating effect sizes. |
| [`data-pipeline-etl-synthesis.md`](categories/11-scientific-quantitative-ai/data-pipeline-etl-synthesis.md) | `kbcodedev/data-pipeline-etl-synthesis` | Polars LazyFrames streaming ETL, ZSTD parquet sinks, data quality gates | **Use when**: Building high-throughput, memory-efficient data cleaning pipelines, streaming large CSV/Parquet files in Polars/DuckDB without memory OOMs. |
| [`reproducible-research-protocol.md`](categories/11-scientific-quantitative-ai/reproducible-research-protocol.md) | `kbcodedev/reproducible-research-protocol` | Global random seed pinning, immutable config manifests, artifact hashing | **Use when**: Structuring reproducible machine learning experiments, pinning deterministic random seeds, and logging artifact/hyperparameter manifests. |
| [`bioinformatics-genomic-pipeline.md`](categories/11-scientific-quantitative-ai/bioinformatics-genomic-pipeline.md) | `kbcodedev/bioinformatics-genomic-pipeline` | Streaming FASTQ parsing, Phred quality scoring, genomic sequence alignment | **Use when**: Processing massive high-throughput sequencing datasets (FASTQ/BAM/VCF), calculating Phred quality distributions, and identifying genetic mutations. |
| [`mathematical-optimization-scipy.md`](categories/11-scientific-quantitative-ai/mathematical-optimization-scipy.md) | `kbcodedev/mathematical-optimization-scipy` | Linear programming (HiGHS), constrained non-linear optimization, SciPy minimize | **Use when**: Solving mathematical resource allocation problems, portfolio risk minimization, server fleet provisioning, and constrained optimization. |

---

### 12. Mobile & Cross-Platform Engineering (5 Skills)

| Skill File | Skill ID | Core Capability | When to Use (Edhi Eppudu Use Cheyyali / Triggers) |
|---|---|---|---|
| [`react-native-architecture.md`](categories/12-mobile-cross-platform/react-native-architecture.md) | `kbcodedev/react-native-architecture` | React Native New Architecture (Fabric/TurboModules), Hermes, FlashList | **Use when**: Developing React Native / Expo apps, optimizing 60fps/120fps list scrolling, authoring JSI native bridges, or setting up Expo Router. |
| [`flutter-state-management.md`](categories/12-mobile-cross-platform/flutter-state-management.md) | `kbcodedev/flutter-state-management` | Flutter BLoC, Riverpod reactive state, fine-grained widget pruning | **Use when**: Building scalable Flutter applications, managing unidirectional data flows, eliminating unnecessary full-screen rebuilds, and decoupling domain logic. |
| [`ios-swift-modern-concurrency.md`](categories/12-mobile-cross-platform/ios-swift-modern-concurrency.md) | `kbcodedev/ios-swift-modern-concurrency` | iOS Swift 6 concurrency, Actors, `@Observable` ViewModels, SwiftUI | **Use when**: Developing native iOS applications with Swift 6, eliminating data races via Actors, building `@Observable` SwiftUI views, and managing structured tasks. |
| [`android-kotlin-jetpack-compose.md`](categories/12-mobile-cross-platform/android-kotlin-jetpack-compose.md) | `kbcodedev/android-kotlin-jetpack-compose` | Jetpack Compose, Kotlin StateFlow, Hilt dependency injection, Room DB | **Use when**: Building modern Android applications with Jetpack Compose, state hoisting, ViewModel Coroutines, and immutable UI state streams. |
| [`mobile-offline-sync-engine.md`](categories/12-mobile-cross-platform/mobile-offline-sync-engine.md) | `kbcodedev/mobile-offline-sync-engine` | Offline-first SQLite local persistence, mutation queues, LWW/CRDT conflict sync | **Use when**: Engineering offline-first mobile apps with local embedded databases, optimistic mutation outbox queues, background sync, and conflict resolution. |

---

### 13. Data Engineering & MLOps (5 Skills)

| Skill File | Skill ID | Core Capability | When to Use (Edhi Eppudu Use Cheyyali / Triggers) |
|---|---|---|---|
| [`feature-store-pipeline.md`](categories/13-data-engineering-mlops/feature-store-pipeline.md) | `kbcodedev/feature-store-pipeline` | Feast feature stores, dual Redis/Snowflake storage, point-in-time joins | **Use when**: Designing ML feature stores (Feast), eliminating training-serving skew, generating point-in-time correct training datasets, or low-latency feature serving. |
| [`vector-database-rag-engine.md`](categories/13-data-engineering-mlops/vector-database-rag-engine.md) | `kbcodedev/vector-database-rag-engine` | Qdrant/Pinecone hybrid search (Dense + BM25), semantic chunking, Cohere reranking | **Use when**: Building production RAG pipelines, indexing knowledge bases in vector databases, implementing hybrid search, and eliminating LLM hallucinations. |
| [`mlops-model-serving-triton.md`](categories/13-data-engineering-mlops/mlops-model-serving-triton.md) | `kbcodedev/mlops-model-serving-triton` | NVIDIA Triton Inference Server, TensorRT/ONNX, dynamic batching | **Use when**: Deploying high-throughput GPU inference pipelines, compiling PyTorch to TensorRT/ONNX, and configuring dynamic request batching. |
| [`airflow-dag-orchestration.md`](categories/13-data-engineering-mlops/airflow-dag-orchestration.md) | `kbcodedev/airflow-dag-orchestration` | Apache Airflow 2 TaskFlow DAGs, idempotent partition writes, reschedule sensors | **Use when**: Authoring scheduled ETL DAGs in Airflow/Prefect, enforcing task idempotency, configuring non-blocking sensors, and automating partition backfills. |
| [`data-lakehouse-delta-iceberg.md`](categories/13-data-engineering-mlops/data-lakehouse-delta-iceberg.md) | `kbcodedev/data-lakehouse-delta-iceberg` | Apache Iceberg / Delta Lake, ACID object storage, automated compaction | **Use when**: Designing cloud Data Lakehouses on S3/GCS, managing Iceberg table metadata, running automated file compactions, and executing time-travel queries. |

---

### 14. Enterprise Security, Compliance & Governance (6 Skills)

| Skill File | Skill ID | Core Capability | When to Use (Edhi Eppudu Use Cheyyali / Triggers) |
|---|---|---|---|
| [`soc2-gdpr-compliance-os.md`](categories/14-security-compliance-governance/soc2-gdpr-compliance-os.md) | `kbcodedev/soc2-gdpr-compliance-os` | SOC2 Type II controls, automated GDPR Right-to-be-Forgotten, tamper-evident logs | **Use when**: Implementing automated compliance controls for SOC2/GDPR/HIPAA, handling GDPR Article 17 data erasure cascades, and writing immutable audit logs. |
| [`zero-trust-identity-saml-oidc.md`](categories/14-security-compliance-governance/zero-trust-identity-saml-oidc.md) | `kbcodedev/zero-trust-identity-saml-oidc` | Enterprise SAML 2.0 SSO, OIDC, Okta/WorkOS integrations, SCIM directory sync | **Use when**: Implementing Enterprise Single Sign-On (SSO) with Okta/Azure AD, validating cryptographic SAML responses, or automating SCIM user provisioning. |
| [`cryptographic-key-management-kms.md`](categories/14-security-compliance-governance/cryptographic-key-management-kms.md) | `kbcodedev/cryptographic-key-management-kms` | AWS KMS Envelope Encryption, AES-256-GCM AEAD, automated key rotation | **Use when**: Encrypting sensitive PII, credit cards, or API secrets using Envelope Encryption with AWS KMS, preventing raw key leakage in source code. |
| [`threat-modeling-stride.md`](categories/14-security-compliance-governance/threat-modeling-stride.md) | `kbcodedev/threat-modeling-stride` | STRIDE architectural threat modeling, trust boundary maps, DREAD risk scoring | **Use when**: Conducting architectural threat modeling on new features/services, identifying attack surfaces at trust boundaries, and prioritizing mitigations via DREAD. |
| [`api-security-rate-limit-waf.md`](categories/14-security-compliance-governance/api-security-rate-limit-waf.md) | `kbcodedev/api-security-rate-limit-waf` | Cloudflare WAF edge rules, Redis Sliding Window token bucket, bot mitigation | **Use when**: Protecting public REST/GraphQL APIs against credential stuffing, brute-force login attacks, automated scrapers, and DDoS using sliding-window rate limiting. |
| [`prompt-injection-defense-guard.md`](categories/14-security-compliance-governance/prompt-injection-defense-guard.md) | `kbcodedev/prompt-injection-defense-guard` | Indirect prompt injection delimiters, untrusted data framing, adversarial defense | **Use when**: Ingesting untrusted external text (web pages, resumes, webhook payloads) into LLM prompts, preventing indirect instruction injection overrides. |

---

### 15. C-Suite Executive Advisory & Strategic Decision Agents (8 Skills)

| Skill File | Skill ID | Core Capability | When to Use (Edhi Eppudu Use Cheyyali / Triggers) |
|---|---|---|---|
| [`cto-technology-radar-evaluation.md`](categories/15-c-suite-executive-advisory/cto-technology-radar-evaluation.md) | `kbcodedev/cto-technology-radar-evaluation` | CTO Tech Radar (Adopt/Trial/Assess/Hold), Buy vs Build, TCO & vendor lock-in | **Use when**: Making strategic technology stack choices, evaluating Buy vs Build for commodity features, auditing vendor lock-in risks, or managing technical debt. |
| [`cfo-saas-metrics-unit-economics.md`](categories/15-c-suite-executive-advisory/cfo-saas-metrics-unit-economics.md) | `kbcodedev/cfo-saas-metrics-unit-economics` | SaaS CAC Payback, LTV:CAC, Net Revenue Retention (NRR), Burn Multiple, Runway | **Use when**: Modeling SaaS unit economics, calculating Net Burn Multiples, evaluating pricing models, or auditing zero-cash runway for executive planning. |
| [`cpo-product-discovery-jtbd.md`](categories/15-c-suite-executive-advisory/cpo-product-discovery-jtbd.md) | `kbcodedev/cpo-product-discovery-jtbd` | Jobs-To-Be-Done (JTBD), Opportunity Solution Trees, customer discovery sprints | **Use when**: Conducting customer discovery interviews, structuring Jobs-To-Be-Done frameworks, building Opportunity Solution Trees, or testing product assumptions in 3 days. |
| [`cmo-growth-loops-technical-seo.md`](categories/15-c-suite-executive-advisory/cmo-growth-loops-technical-seo.md) | `kbcodedev/cmo-growth-loops-technical-seo` | Programmatic SEO (pSEO), viral product growth loops, Core Web Vitals | **Use when**: Architecting programmatic SEO engines (generating 5,000+ data-driven landing pages), building self-sustaining growth loops, or auditing Core Web Vitals. |
| [`head-of-people-eng-career-ladder.md`](categories/15-c-suite-executive-advisory/head-of-people-eng-career-ladder.md) | `kbcodedev/head-of-people-eng-career-ladder` | Dual-track engineering levels (L3-L8 IC & EM), performance calibrations, promotion criteria | **Use when**: Designing engineering leveling ladders, separating Individual Contributor (IC) and Management tracks, or structuring fair promotion rubrics. |
| [`product-hunt-launch-playbook.md`](categories/15-c-suite-executive-advisory/product-hunt-launch-playbook.md) | `kbcodedev/product-hunt-launch-playbook` | Product Hunt #1 Product of the Day launch strategy, 00:02 PST timeline, maker comment | **Use when**: Preparing and executing a public launch on Product Hunt, Hacker News, and X/Twitter to maximize 24-hour momentum and developer conversions. |
| [`technical-copywriting-landing-page.md`](categories/15-c-suite-executive-advisory/technical-copywriting-landing-page.md) | `kbcodedev/technical-copywriting-landing-page` | High-converting developer landing page copy, 5-second hero rule, code showcases | **Use when**: Writing landing page copy for developer tools, APIs, or open-source projects. Replaces marketing fluff with clear syntax, terminal commands, and benchmarks. |
| [`cap-table-equity-dilution-modeler.md`](categories/15-c-suite-executive-advisory/cap-table-equity-dilution-modeler.md) | `kbcodedev/cap-table-equity-dilution-modeler` | Cap Table modeling, Post-Money SAFE note conversions, option pool shuffle | **Use when**: Evaluating investor term sheets, modeling SAFE note conversions, calculating founder dilution across priced rounds, or granting employee stock options. |

---

### 16. Tool Integrations & API Connectors (5 Skills)

| Skill File | Skill ID | Core Capability | When to Use (Edhi Eppudu Use Cheyyali / Triggers) |
|---|---|---|---|
| [`github-actions-api-automation.md`](categories/16-tool-integrations-connectors/github-actions-api-automation.md) | `kbcodedev/github-actions-api-automation` | Octokit REST/GraphQL, automated SemVer releases, idempotent PR bots | **Use when**: Building GitHub bots, automating changelog and semantic release tagging on merge to `main`, or updating PR comments in-place without spam. |
| [`slack-bot-interactive-workflows.md`](categories/16-tool-integrations-connectors/slack-bot-interactive-workflows.md) | `kbcodedev/slack-bot-interactive-workflows` | Slack Bolt SDK, Block Kit UI, interactive modal forms, <3s `ack()` | **Use when**: Building interactive ChatOps bots in Slack, handling modal submissions, interactive deployment approvals, or automated incident war rooms. |
| [`stripe-billing-webhook-engine.md`](categories/16-tool-integrations-connectors/stripe-billing-webhook-engine.md) | `kbcodedev/stripe-billing-webhook-engine` | Stripe Checkout & Subscriptions, raw body webhook HMAC verification, idempotency | **Use when**: Integrating Stripe Billing, handling subscription lifecycle webhooks (`invoice.payment_succeeded`), and preventing duplicate billing via idempotency tables. |
| [`database-connector-supabase-prisma.md`](categories/16-tool-integrations-connectors/database-connector-supabase-prisma.md) | `kbcodedev/database-connector-supabase-prisma` | Supabase Row Level Security (RLS), Prisma ORM, transaction pooler tuning (6543) | **Use when**: Building apps with Supabase and Prisma, enforcing database-level Row Level Security policies, or tuning serverless connection poolers. |
| [`linear-jira-issue-orchestrator.md`](categories/16-tool-integrations-connectors/linear-jira-issue-orchestrator.md) | `kbcodedev/linear-jira-issue-orchestrator` | Linear GraphQL SDK, Jira REST, automated issue triage, PR branch linking | **Use when**: Automating issue creation from error alerts, linking git branches/PRs to Linear issues (`[ENG-124]`), and updating ticket statuses on merge. |

---

### 17. Visual Architecture & Diagram Synthesis (Archify) (4 Skills)

| Skill File | Skill ID | Core Capability | When to Use (Edhi Eppudu Use Cheyyali / Triggers) |
|---|---|---|---|
| [`sequence-flow-diagram-synthesis.md`](categories/17-visual-architecture-diagrams/sequence-flow-diagram-synthesis.md) | `kbcodedev/sequence-flow-diagram-synthesis` | Mermaid sequence diagrams, OAuth PKCE flows, sync vs async messaging | **Use when**: Documenting complex multi-service handshakes, authentication protocols (OAuth 2.0 / PKCE / SAML), or payment lifecycle message flows. |
| [`entity-relationship-erd-synthesis.md`](categories/17-visual-architecture-diagrams/entity-relationship-erd-synthesis.md) | `kbcodedev/entity-relationship-erd-synthesis` | Crow's Foot cardinality ERDs, primary/foreign key modeling in Mermaid | **Use when**: Designing relational database schemas, documenting ORM entity relationships, modeling multi-tenant data models, and staging migrations. |
| [`cloud-topology-network-diagram.md`](categories/17-visual-architecture-diagrams/cloud-topology-network-diagram.md) | `kbcodedev/cloud-topology-network-diagram` | Multi-AZ AWS/GCP VPC network topologies, private subnets, NAT gateways, ALB | **Use when**: Designing cloud network architectures, documenting Multi-AZ high-availability failovers, public/private subnet routing, and SOC2 network proof. |
| [`state-machine-transition-diagram.md`](categories/17-visual-architecture-diagrams/state-machine-transition-diagram.md) | `kbcodedev/state-machine-transition-diagram` | Finite State Machines (FSM), stateDiagram-v2, guard conditions, terminal states | **Use when**: Modeling entity lifecycles (Order status, Subscription renewal, Payment retry), eliminating race conditions in status transitions. |

---

### 18. YC & Tech Leaders Strategic Frameworks (5 Skills)

| Skill File | Skill ID | Core Capability | When to Use (Edhi Eppudu Use Cheyyali / Triggers) |
|---|---|---|---|
| [`sam-altman-execution-velocity.md`](categories/18-yc-tech-leaders-frameworks/sam-altman-execution-velocity.md) | `kbcodedev/sam-altman-execution-velocity` | Relentless execution momentum, 48-hour falsification tests, high-agency moves | **Use when**: Breaking through decision paralysis, overcoming multi-month project stalls, driving high-agency execution, or accelerating shipping cadence. |
| [`dario-amodei-scaling-safety.md`](categories/18-yc-tech-leaders-frameworks/dario-amodei-scaling-safety.md) | `kbcodedev/dario-amodei-scaling-safety` | Chinchilla compute scaling laws, Constitutional AI self-critiques, bounded agency | **Use when**: Designing AI safety guardrails, calculating compute/token ratios, implementing constitutional self-critique gates, or red-teaming prompt injection. |
| [`andrej-karpathy-software-3.0.md`](categories/18-yc-tech-leaders-frameworks/andrej-karpathy-software-3.0.md) | `kbcodedev/andrej-karpathy-software-3.0` | Software 3.0 LLM OS paradigm, Context RAM management, tools as I/O bus | **Use when**: Architecting complex autonomous agent loops, managing working context memory as RAM, treating tools as I/O peripherals, and building prompt compilers. |
| [`andrew-ng-data-centric-ai.md`](categories/18-yc-tech-leaders-frameworks/andrew-ng-data-centric-ai.md) | `kbcodedev/andrew-ng-data-centric-ai` | Data-Centric AI iteration, 100-sample structured error analysis, clean datasets | **Use when**: ML model accuracy hits a plateau. Systematically inspects error buckets and cleans training labels rather than endlessly tweaking hyperparameters. |
| [`paul-graham-founder-intuition.md`](categories/18-yc-tech-leaders-frameworks/paul-graham-founder-intuition.md) | `kbcodedev/paul-graham-founder-intuition` | Schlep blindness elimination, organic idea generation, 100 fanatic users goal | **Use when**: Evaluating startup ideas, overcoming aversion to tedious unglamorous problems ("schleps"), and stripping products down to their core magic. |

---

### 19. Game Development & 3D Web Graphics (2 Skills)

| Skill File | Skill ID | Core Capability | When to Use (Edhi Eppudu Use Cheyyali / Triggers) |
|---|---|---|---|
| [`webgl-threejs-shaders.md`](categories/19-game-dev-3d-graphics/webgl-threejs-shaders.md) | `kbcodedev/webgl-threejs-shaders` | Three.js WebGL rendering, custom GLSL vertex/fragment shaders, Draco compression | **Use when**: Building high-performance 3D web applications, interactive product visualizers, custom GLSL shader materials, or loading compressed GLTF/GLB models. |
| [`game-loop-physics-engine.md`](categories/19-game-dev-3d-graphics/game-loop-physics-engine.md) | `kbcodedev/game-loop-physics-engine` | Fixed-timestep 60Hz game loop, accumulator rendering interpolation, Quadtrees | **Use when**: Building 2D/3D browser games, physics simulations, spatial partitioning for collision detection, or decoupling game state from render frames. |

---

### 20. Web Scraping & Advanced Browser Engineering (2 Skills)

| Skill File | Skill ID | Core Capability | When to Use (Edhi Eppudu Use Cheyyali / Triggers) |
|---|---|---|---|
| [`anti-detect-browser-automation.md`](categories/20-web-scraping-browser-automation/anti-detect-browser-automation.md) | `kbcodedev/anti-detect-browser-automation` | Stealth Playwright, Cloudflare Turnstile bypass, fingerprint neutralization | **Use when**: Automating browser tasks on bot-protected websites (Cloudflare, Akamai, PerimeterX), bypassing CAPTCHAs, or masking headless browser fingerprints. |
| [`headless-crawler-data-extractor.md`](categories/20-web-scraping-browser-automation/headless-crawler-data-extractor.md) | `kbcodedev/headless-crawler-data-extractor` | High-concurrency Cheerio crawler, URL normalization, Bloom filter deduplication | **Use when**: Scraping large web catalogs (>100k pages), crawling sitemaps, extracting structured HTML data with Cheerio, or streaming directly to Parquet. |

---

### 21. Systems & Embedded Programming (2 Skills)

| Skill File | Skill ID | Core Capability | When to Use (Edhi Eppudu Use Cheyyali / Triggers) |
|---|---|---|---|
| [`rust-embedded-systems.md`](categories/21-systems-embedded-programming/rust-embedded-systems.md) | `kbcodedev/rust-embedded-systems` | Bare-metal `#![no_std]` Rust, microcontroller HAL, Type-State GPIO | **Use when**: Developing firmware for microcontrollers (ARM Cortex-M, ESP32, RISC-V), writing zero-allocation bare-metal drivers, and eliminating hardware crashes. |
| [`c-cpp-memory-leak-sanitizer.md`](categories/21-systems-embedded-programming/c-cpp-memory-leak-sanitizer.md) | `kbcodedev/c-cpp-memory-leak-sanitizer` | Valgrind Memcheck, AddressSanitizer (ASan), RAII smart pointer refactoring | **Use when**: Diagnosing and fixing memory leaks, buffer overflows, double-frees, and segmentation faults in C/C++ applications using ASan and Valgrind. |

---

## 🛠️ CLI Runner, Validator & Prompt Export Tooling

`kbcodedev-skills` includes built-in developer CLI tools for running, searching, validating, and exporting skills:

### 1. Interactive Terminal Commands
```bash
# List all 115 skills across 21 categories
npm run skill list

# Fast keyword search across IDs, titles, and categories
npm run search docker
npm run search react

# Read any skill directly in terminal
npm run skill show zero-downtime-ship-pipeline

# Validate all 115 skills against the canonical production schema
npm run validate
```

### 2. Exporting Skills into Agent Prompts (Claude, Cursor, kbcode)
Export any skill formatted for immediate injection into AI agent system prompts:
```bash
# Export into Claude XML prompt tag (<skill name="...">...</skill>)
node tools/export-prompt.mjs autonomous-react-loop claude

# Export into Cursor .cursorrules / .mdc format
node tools/export-prompt.mjs zero-downtime-ship-pipeline cursor

# Export as clean JSON or Markdown block
node tools/export-prompt.mjs mcp-server-builder json
node tools/export-prompt.mjs database-schema-modeling markdown
```

---

## 🛠️ How to Use kbcodedev-skills

### In kbcode
Load any skill dynamically before or during task execution:
```markdown
# Load via Learned Skill or get_skill
get_skill("kbcodedev/zero-downtime-ship-pipeline")
```

### In Claude Code / Cursor / System Prompts
Directly reference any skill file path:
```bash
# Example: Injecting into Claude Code session
claude "Review this architecture using C:\dev\kbcodev-skills\categories\08-strategic-product-leadership\staff-eng-architect-review.md"
```

---

## ⚖️ License & Legal Compliance

- **License**: Distributed under the permissive [MIT License](LICENSE).
- **IP & Copyright Compliance**: All skills are clean-room synthesized and original contract implementations. See [LEGAL.md](LEGAL.md) for full Idea-Expression Dichotomy, Nominative Fair Use, and Open-Source Compliance documentation.
- **Trademarks**: All third-party trademarks (Anthropic, OpenAI, AWS, Stripe, GitHub, etc.) are the property of their respective owners and used solely for nominative identification.

