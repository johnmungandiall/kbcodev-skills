# Architecture: kbcodedev-skills

## Design Philosophy
1. **Advanced & Simplified**: High signal, zero conversational filler, direct execution pipelines.
2. **Contract-Driven**: Every skill defines Triggers, Input JSON Contracts, Output Contracts, and Invariant Principles.
3. **Safety Gated**: Integrated 3-tier risk assessment, non-destructive fallbacks, and 5-Whys root cause analysis.
4. **ReAct & Tool Ergonomics**: Engineered for minimal context waste, dynamic batch widths, and KV-cache reuse.

## Taxonomy (21 Categories, 115 Skills)
- `01-agentic-orchestration` (8 skills) — ReAct loops, multi-agent swarms, DAG planners, reflexion, mutation guards.
- `02-system-architecture` (6 skills) — C4 diagrams, distributed microservices, DB schemas, REST/gRPC, IaC, Kafka.
- `03-software-engineering` (7 skills) — Scaffolding, refactoring, algorithmic complexity, language migrations, regex.
- `04-testing-qa-debugging` (7 skills) — 5-Whys root cause debugging, unit tests, Playwright E2E, k6 profilers, SAST security, git bisect.
- `05-frontend-ui-ux` (7 skills) — Next.js App Router, design tokens, interactive artifacts, WCAG AA, responsive grid, vision inspector.
- `06-devops-sre-release` (6 skills) — Zero-downtime blue-green deploys, GitHub Actions CI/CD, Docker, K8s, OpenTelemetry.
- `07-ai-mcp-prompt-engineering` (7 skills) — Claude API caching, MCP servers, metaprompts, skill authoring, JSON Schema, checkpoints.
- `08-strategic-product-leadership` (7 skills) — CEO/Staff reviews, UX audits, DevEx, YC startup sprints, PRDs, retros.
- `09-document-media-synthesis` (5 skills) — Programmatic DOCX, print PDF, 16:9 PPTX decks, Excel XLSX models, ADRs.
- `10-communication-humanizer-career` (5 skills) — De-AI humanizer voice, ATS resumes, Google XYZ bullets, executive memos.
- `11-scientific-quantitative-ai` (6 skills) — Research synthesis, statistical modeling, Polars ETL, reproducible protocols, genomics, SciPy.
- `12-mobile-cross-platform` (5 skills) — React Native New Architecture, Flutter BLoC, iOS Swift 6, Android Compose, Offline Sync.
- `13-data-engineering-mlops` (5 skills) — Feast feature stores, Qdrant hybrid RAG, Triton inference, Airflow, Iceberg lakehouse.
- `14-security-compliance-governance` (6 skills) — SOC2/GDPR compliance OS, Enterprise SAML SSO, KMS encryption, STRIDE, WAF, injection guard.
- `15-c-suite-executive-advisory` (8 skills) — CTO Tech Radar, CFO SaaS Unit Economics, CPO JTBD, CMO pSEO, Head of People, Product Hunt, Copywriting, Cap Tables.
- `16-tool-integrations-connectors` (5 skills) — GitHub Octokit, Slack Bolt, Stripe Billing, Supabase Prisma, Linear GraphQL.
- `17-visual-architecture-diagrams` (4 skills) — Mermaid sequence flows, Crow's foot ERD, Multi-AZ VPC, FSM diagrams.
- `18-yc-tech-leaders-frameworks` (5 skills) — Sam Altman Velocity, Dario Amodei Safety, Karpathy Software 3.0, Andrew Ng AI, Paul Graham.
- `19-game-dev-3d-graphics` (2 skills) — Three.js WebGL shaders, fixed-timestep game loops.
- `20-web-scraping-browser-automation` (2 skills) — Anti-detect stealth scraping, high-concurrency Cheerio crawlers.
- `21-systems-embedded-programming` (2 skills) — Bare-metal no_std Rust, C/C++ Valgrind ASan leak sanitizers.

See [[categories]] for individual skill mappings and [[cheatsheet]] for quick lookups.
