# Skill: WebGL, Three.js & Custom GLSL Shaders
`id`: `kbcodedev/webgl-threejs-shaders`  
`category`: `19-game-dev-3d-graphics`  
`version`: `2.0.0`  
`type`: `advanced-simplified`

---

## 1. Intent & Trigger Conditions
- **When to Use**: Building high-performance 3D web experiences, interactive 3D product visualizers, Three.js scenes, custom GLSL vertex/fragment shaders, and post-processing passes.
- **Triggers**: 3D web application design, Three.js canvas setup, custom shader material authoring, 3D model (GLTF/GLB) loading and optimization.
- **Prerequisites**: WebGL 2.0 / Three.js r160+, GLSL syntax, modern browser rendering pipeline.

---

## 2. Core Mental Model & Invariant Principles
1. **GPU Offloading via Custom Shaders**: Offload procedural vertex deformations and per-pixel lighting calculations directly to GPU hardware using GLSL shaders instead of manipulating meshes in JavaScript CPU loops.
2. **Dispose Geometries and Textures Explicitly**: Three.js does NOT automatically garbage collect GPU buffers. Always call `.dispose()` on geometries, materials, and textures when scenes or meshes are destroyed.
3. **GLTF/GLB Draco & Meshopt Compression**: Always compress 3D meshes using Draco or Meshopt compression to reduce 50MB 3D assets to < 3MB web payloads.

4. **Project-Grounding Invariant (MANDATORY)**: Every version number, package name, API signature, CLI flag, file path, numeric threshold and code sample in this skill is an **illustrative reference pattern from a known-good configuration — never a literal instruction to paste**. Before changing the target codebase: (a) inspect the real project (dependency manifest and lockfile, installed toolchain, existing module layout, current implementations of anything you are about to modify — grep and symbol hits are discovery, only the actual function body is proof of behaviour); (b) reconcile each example here against what you find and adapt its specifics (versions, names, paths, thresholds) while keeping the principle intact; (c) where this skill and the real code disagree, **the real code wins** — follow it and say so plainly. Any numeric bound stated here (step budget, timeout, pool size, retry count, coverage %, latency target) is a **starting heuristic to be re-derived from the project's own evidence**, not a fixed constant. Nothing may be reported as verified until it has been checked against the running implementation; an unverified claim is delivered as unverified, never as fact.

---

## 3. High-Signal Execution Workflow

```
[3D Mesh / Custom Visual Effect Spec]
                 │
                 ▼
┌────────────────────────────────┐
│ Step 1: Scene, Camera & WebGL  │ ── PerspectiveCamera + WebGLRenderer (antialias, powerPreference)
│         Renderer Setup         │
└────────────────┬───────────────┘
                 ▼
┌────────────────────────────────┐
│ Step 2: Custom ShaderMaterial  │ ── Vertex Shader (position) + Fragment Shader (color/glow)
└────────────────┬───────────────┘
                 ▼
┌────────────────────────────────┐
│ Step 3: Animation Tick Loop    │ ── Update uniform uTime += dt -> renderer.render(scene, camera)
└────────────────┬───────────────┘
                 ▼
┌────────────────────────────────┐
│ Step 4: Component Unmount      │ ── Clean up animation frame, dispose geometries and materials
└────────────────────────────────┘
```

---

## 4. Input / Output Contracts

### Input Contract
```json
{
  "effect": "Interactive Pulsing Energy Sphere",
  "tech": "Three.js + Custom GLSL ShaderMaterial",
  "features": ["Perlin noise vertex displacement", "Dynamic mouse hover glow", "Clean disposal"]
}
```

### Output Contract
```typescript
import * as THREE from 'three';

// 1. GLSL Shaders
const vertexShader = `
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vNormal;

  void main() {
    vUv = uv;
    vNormal = normal;
    // Displace vertices along normal vector using sin/cos waves
    vec3 newPosition = position + normal * (sin(position.y * 4.0 + uTime * 2.0) * 0.1);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vNormal;

  void main() {
    // Fresnel rim light glow calculation
    float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
    vec3 glowColor = vec3(0.38, 0.40, 0.95); // Indigo (#6366f1)
    gl_FragColor = vec4(glowColor * intensity, 1.0);
  }
`;

// 2. Three.js Scene Setup
export function createEnergySphere(container: HTMLElement) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.z = 3;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const geometry = new THREE.IcosahedronGeometry(1.2, 32);
  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0 },
    },
    wireframe: true,
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  let animationId: number;
  const clock = new THREE.Clock();

  function animate() {
    material.uniforms.uTime.value = clock.getElapsedTime();
    mesh.rotation.y += 0.005;
    renderer.render(scene, camera);
    animationId = requestAnimationFrame(animate);
  }
  animate();

  // Cleanup handler
  return function dispose() {
    cancelAnimationFrame(animationId);
    geometry.dispose();
    material.dispose();
    renderer.dispose();
    container.removeChild(renderer.domElement);
  };
}
```

---

## 5. Anti-Patterns & Critical Traps
- ❌ **Leaking WebGL Contexts**: Creating new Three.js renderers on route changes without disposing old geometries, triggering `WARNING: Too many active WebGL contexts`.
- ❌ **Heavy Uncompressed Textures**: Loading uncompressed 4K 20MB PNG textures on mobile screens instead of KTX2 / Basis Universal compressed textures.
- ❌ **Running Shader Calculations in JS Loop**: Modifying 10,000 vertex positions in a JavaScript `for` loop every frame instead of letting the GPU handle it in the vertex shader.

---

## 6. Real-World Production Example

```markdown
**3D Product Visualizer**:
- Built real-time 3D watch customizer in Three.js with PBR materials and environment map reflections.
- Compressed 3D GLTF asset from 48MB to 2.4MB using Draco compression. Maintained 60fps on mobile browsers.
```
