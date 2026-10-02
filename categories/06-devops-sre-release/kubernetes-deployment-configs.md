# Skill: Kubernetes Deployment & Cloud-Native Manifests
`id`: `kbcodedev/kubernetes-deployment-configs`  
`category`: `06-devops-sre-release`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Authoring production-grade Kubernetes manifests, Helm charts, Kustomize overlays, Horizontal Pod Autoscalers (HPA), Ingress rules, and PodDisruptionBudgets.
- **Triggers**: Service onboarding to Kubernetes cluster, auto-scaling configuration, rolling update tuning, resource quota definition.
- **Prerequisites**: Kubernetes API concepts, container registry paths, cluster ingress controller (NGINX, Traefik, ALB).

---

## 2. Core Mental Model & Invariant Principles
1. **Mandatory Resource Requests and Limits**: Every container must explicitly specify CPU/Memory `requests` (for scheduling) and `limits` (to prevent OOM node exhaustion).
2. **Graceful Termination & PreStop Hook**: Allow applications to drain active connections on `SIGTERM` before Kubernetes severs the network route.
3. **Pod Anti-Affinity**: Distribute replica pods across distinct physical nodes or availability zones (`topologyKey: topology.kubernetes.io/zone`) to guarantee high availability during node failures.

4. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[Container Image & Service Spec]
               │
               ▼
┌──────────────────────────────┐
│ Phase 1: Deployment & Pod    │ ── Replicas, Anti-Affinity, Non-root SecurityContext
│          Security Standard   │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ Phase 2: Probes & Lifecycles │ ── Liveness, Readiness, Startup, preStop sleep drain
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ Phase 3: Networking & Scale  │ ── ClusterIP Service, Ingress, HPA (CPU/Memory 70%)
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ Phase 4: PodDisruptionBudget │ ── minAvailable: 1 (Guarantees uptime during node drains)
└──────────────────────────────┘
```

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "service_name": "checkout-api",
  "replicas": 3,
  "port": 8080,
  "cpu_request": "250m",
  "memory_request": "512Mi",
  "cpu_limit": "1000m",
  "memory_limit": "1Gi"
}
```

### Output Contract
```yaml
# Production Kubernetes Deployment Manifest
apiVersion: apps/v1
kind: Deployment
metadata:
  name: checkout-api
  labels:
    app.kubernetes.io/name: checkout-api
spec:
  replicas: 3
  revisionHistoryLimit: 5
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 25%
      maxUnavailable: 0
  selector:
    matchLabels:
      app.kubernetes.io/name: checkout-api
  template:
    metadata:
      labels:
        app.kubernetes.io/name: checkout-api
    spec:
      affinity:
        podAntiAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
            - weight: 100
              podAffinityTerm:
                labelSelector:
                  matchExpressions:
                    - key: app.kubernetes.io/name
                      operator: In
                      values: ["checkout-api"]
                topologyKey: kubernetes.io/hostname
      securityContext:
        runAsNonRoot: true
        runAsUser: 10001
        fsGroup: 10001
      containers:
        - name: app
          image: registry.example.com/checkout-api:v2.14.0
          imagePullPolicy: IfNotPresent
          ports:
            - containerPort: 8080
          resources:
            requests:
              cpu: "250m"
              memory: "512Mi"
            limits:
              cpu: "1000m"
              memory: "1Gi"
          readinessProbe:
            httpGet:
              path: /ready
              port: 8080
            initialDelaySeconds: 5
            periodSeconds: 5
          livenessProbe:
            httpGet:
              path: /healthz
              port: 8080
            initialDelaySeconds: 15
            periodSeconds: 10
          lifecycle:
            preStop:
              exec:
                command: ["/bin/sh", "-c", "sleep 10"]
---
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: checkout-api-pdb
spec:
  minAvailable: 2
  selector:
    matchLabels:
      app.kubernetes.io/name: checkout-api
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Missing Resource Limits**: Pods with no memory limits consuming all host node RAM, triggering Linux OOM killer to terminate kubelet.
- ❌ **`maxUnavailable: 100%`**: Allowing all pods to terminate simultaneously during updates, causing service downtime.
- ❌ **Identical Liveness and Readiness Probes**: Using the same heavy database check for liveness, causing Kubernetes to enter a cascading pod restart loop during DB latency spikes.

---

## 6. Real-World Production Example

```markdown
**PreStop Lifecycle Hook**:
- Added `preStop: exec: command: ["/bin/sh", "-c", "sleep 10"]` to allow AWS Ingress controller time to deregister pod IP from target group before application stopped accepting HTTP connections. Dropped in-flight connection resets from 0.8% to 0.00%.
```
