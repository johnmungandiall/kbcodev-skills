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
