# Skill: Docker & Container Orchestration
`id`: `kbcodedev/docker-container-orchestration`  
`category`: `06-devops-sre-release`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Authoring minimal, secure, multi-stage Dockerfiles, optimizing image layer caching, configuring non-root user execution, and orchestrating multi-container local dev stacks via Docker Compose.
- **Triggers**: Containerization of new services, bloated image size optimization (>1GB to <100MB), container security vulnerability remediation.
- **Prerequisites**: Target runtime knowledge, package manager lockfiles, Docker Compose specifications.

---

## 2. Core Mental Model & Invariant Principles
1. **Multi-Stage Build Isolation**: Separate build-time tooling (compilers, devDependencies, header files) from production runtime artifacts (compiled binaries, minimal Distroless/Alpine images).
2. **Order Layers from Least to Most Frequently Changed**: Copy lockfiles and install dependencies BEFORE copying application source code to maximize layer cache hits.
3. **Non-Root User Execution**: Always create and switch to a dedicated non-root user (`USER node` / `USER appuser`) to mitigate container breakout vulnerabilities.

---

## 3. High-Signal Execution Workflow

```
[Application Source Code]
            │
            ▼
┌───────────────────────────┐
│ Stage 1: Build & Compile  │ ── Node/Go/Rust full toolchain + install dependencies
└───────────┬───────────────┘
            ▼
┌───────────────────────────┐
│ Stage 2: Minimal Runtime  │ ── Base on Alpine / Distroless / Debian-Slim
└───────────┬───────────────┘
            ▼
┌───────────────────────────┐
│ Stage 3: Copy Artifacts   │ ── Copy only compiled binary / dist folder
└───────────┬───────────────┘
            ▼
┌───────────────────────────┐
│ Stage 4: Drop Root Rights │ ── Switch to non-root USER + Expose Port
└───────────────────────────┘
```

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "service": "Next.js / Node.js Web Application",
  "goal": "Production-grade, secure, minimal image size with multi-stage caching"
}
```

### Output Contract
```dockerfile
# Multi-Stage Production Dockerfile for Node.js / Next.js

# Stage 1: Dependencies Cache
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN npm run build

# Stage 3: Minimal Production Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Create non-root system user and group
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy only production standalone build artifacts
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/healthz || exit 1

CMD ["node", "server.js"]
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Running as `root`**: Leaving default root user in containers, giving attackers root host access upon container escapes.
- ❌ **Copying Source Before Dependencies**: `COPY . .` before `RUN npm install`, invalidating layer cache on every single code change.
- ❌ **Leaking Secrets in Build Args**: Using `ARG AWS_SECRET_KEY` inside Dockerfiles, leaving credentials permanently embedded in image layer metadata.

---

## 6. Real-World Production Example

```markdown
**Image Slimming**:
- Legacy Image: Single-stage Node.js image with dev tools -> Size: 1.28 GB.
- Optimized: Multi-stage Alpine standalone image.
- Result: Final image size: 84 MB (93.4% reduction). Build time in CI dropped from 4 minutes to 18 seconds.
```
