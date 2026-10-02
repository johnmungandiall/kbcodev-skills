# Skill: Infrastructure Security & Hardening Standards
`id`: `kbcodedev/infrastructure-security-hardening`  
`category`: `06-devops-sre-release`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Hardening Linux servers, Docker containers, Kubernetes clusters, and cloud networks against CIS Benchmarks, privilege escalation, and lateral movement.
- **Triggers**: Infrastructure security audits, compliance requirements (SOC2, ISO 27001, PCI-DSS), network perimeter lock-down.
- **Prerequisites**: Access to host/container configurations, firewall rules, TLS/SSL certificates.

---

## 2. Core Mental Model & Invariant Principles
1. **Principle of Least Privilege**: Grant only the bare minimum permissions, ports, and capabilities required for the application to function.
2. **Immutable Read-Only Root Filesystems**: Mount container root filesystems as read-only (`readOnlyRootFilesystem: true`), forcing temporary writes into memory-backed `tmpfs`.
3. **Drop All Linux Capabilities**: Drop all default kernel capabilities (`ALL`) and add back only explicitly necessary privileges (e.g. `NET_BIND_SERVICE`).

4. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[Container / Server Instance]
              │
              ▼
┌─────────────────────────────┐
│ Phase 1: Attack Surface     │ ── Disable SSH password auth, close unused ports
│          Minimization       │
└─────────────┬───────────────┘
              ▼
┌─────────────────────────────┐
│ Phase 2: Linux Capabilities │ ── drop: ["ALL"], runAsNonRoot: true
│          & Namespaces       │
└─────────────┬───────────────┘
              ▼
┌─────────────────────────────┐
│ Phase 3: Storage Hardening  │ ── readOnlyRootFilesystem: true, tmpfs for /tmp
└─────────────┬───────────────┘
              ▼
┌─────────────────────────────┐
│ Phase 4: Network Policies   │ ── Default-deny Ingress/Egress K8s NetworkPolicies
└─────────────────────────────┘
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
  "target": "Production Kubernetes Pod Security Standard",
  "compliance_level": "Restricted (Highest Level)",
  "app_name": "auth-service"
}
```

### Output Contract
```yaml
# Hardened Pod Security Context (CIS Benchmark Compliant)
apiVersion: v1
kind: Pod
metadata:
  name: auth-service
  labels:
    app: auth-service
spec:
  securityContext:
    runAsNonRoot: true
    runAsUser: 10001
    runAsGroup: 10001
    fsGroup: 10001
    seccompProfile:
      type: RuntimeDefault
  containers:
    - name: auth-service
      image: auth-service:v2.1.0
      securityContext:
        allowPrivilegeEscalation: false
        readOnlyRootFilesystem: true
        capabilities:
          drop:
            - ALL
      volumeMounts:
        - name: tmp-volume
          mountPath: /tmp
  volumes:
    - name: tmp-volume
      emptyDir:
        medium: Memory
        sizeLimit: 64Mi
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **`privileged: true` Containers**: Running containers in privileged mode, granting full host kernel and hardware access.
- ❌ **Plain HTTP for Internal Microservices**: Transmitting unencrypted internal traffic without TLS/mTLS encryption.
- ❌ **Writable Root Filesystems in Containers**: Allowing attackers who achieve remote code execution to write persistent backdoors or download cryptominers to disk.

---

## 6. Real-World Production Example

```markdown
**Audit Remediation**:
- Vulnerability: Container ran as root with writable root filesystem.
- Hardening: Set `readOnlyRootFilesystem: true`, dropped all Linux capabilities, assigned unprivileged UID 10001. Attackers unable to write payloads to disk.
```
