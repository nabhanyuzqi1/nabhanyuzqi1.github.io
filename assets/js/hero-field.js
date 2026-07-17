/* ==========================================================================
   Hero flow field — GPGPU particles + pulse rings + selective bloom.
   Techniques: simplex-noise flow field (organic drift), GPU simulation via
   GPUComputationRenderer (positions/velocities live in textures), pointer
   interaction, click shockwave rings, UnrealBloom with a high threshold so
   only ring-excited (bright) particles glow.
   Fallback: static CSS gradient (already present) — this module exits quietly
   on reduced-motion, no-WebGL2, or any init error.
   Audio hook: call window.__heroRingPulse(strength 0..1) per beat to drive
   rings from an AnalyserNode if a track is ever added.
   ========================================================================== */
import * as THREE from 'three';
import { GPUComputationRenderer } from 'three/addons/misc/GPUComputationRenderer.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

const SIMPLEX = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

const RINGS_GLSL = /* glsl */ `
uniform vec4 uRings[4]; // xy origin · z birth time · w strength
float ringGlow(vec2 p, float time){
  float glow = 0.0;
  for (int i = 0; i < 4; i++) {
    vec4 r = uRings[i];
    if (r.w < 0.001) continue;
    float age = time - r.z;
    if (age < 0.0 || age > 2.5) continue;
    float radius = age * 22.0;
    float band = abs(distance(p, r.xy) - radius);
    float fade = (1.0 - age / 2.5) * r.w;
    glow += smoothstep(4.5, 0.0, band) * fade;
  }
  return glow;
}`;

function init(canvas) {
  if (!window.WebGL2RenderingContext) throw new Error('no webgl2');

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: 'high-performance' });
  const DPR = Math.min(devicePixelRatio || 1, 1.5);
  renderer.setPixelRatio(DPR);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 1, 300);
  camera.position.z = 90;

  const SIM = innerWidth < 700 ? 112 : 176; // 12.5k phone · 31k desktop
  const COUNT = SIM * SIM;
  const gpu = new GPUComputationRenderer(SIM, SIM, renderer);

  // world-space field size that fills the camera frustum
  let fieldW = 120, fieldH = 70;
  const sizeToViewport = () => {
    const r = canvas.parentElement.getBoundingClientRect();
    renderer.setSize(r.width, r.height, false);
    camera.aspect = r.width / r.height;
    camera.updateProjectionMatrix();
    fieldH = 2 * Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
    fieldW = fieldH * camera.aspect;
  };
  sizeToViewport();

  const dtPos = gpu.createTexture();
  const dtVel = gpu.createTexture();
  const pos = dtPos.image.data, vel = dtVel.image.data;
  for (let i = 0; i < COUNT; i++) {
    pos[i * 4 + 0] = (Math.random() - 0.5) * fieldW;
    pos[i * 4 + 1] = (Math.random() - 0.5) * fieldH;
    pos[i * 4 + 2] = (Math.random() - 0.5) * 14;
    pos[i * 4 + 3] = Math.random(); // per-particle seed
    vel[i * 4 + 0] = 0; vel[i * 4 + 1] = 0; vel[i * 4 + 2] = 0; vel[i * 4 + 3] = 0;
  }

  const velShader = /* glsl */ `
    uniform float uTime;
    uniform vec3 uPointer; // xy world · z active
    uniform vec2 uField;
    ${SIMPLEX}
    ${RINGS_GLSL}
    void main(){
      vec2 uv = gl_FragCoord.xy / resolution.xy;
      vec4 p = texture2D(texturePosition, uv);
      vec4 v = texture2D(textureVelocity, uv);

      // flow field: simplex noise decides the drift direction (organic, not random)
      float n = snoise(vec3(p.xy * 0.035, uTime * 0.06 + p.w * 3.0));
      float a = n * 6.28318;
      vec2 flow = vec2(cos(a), sin(a)) * 2.6;

      // gentle pointer attraction
      if (uPointer.z > 0.5) {
        vec2 d = uPointer.xy - p.xy;
        float dist = length(d);
        flow += normalize(d) * smoothstep(34.0, 4.0, dist) * 5.0;
      }

      // pulse rings shove particles outward as the wavefront passes
      for (int i = 0; i < 4; i++) {
        vec4 r = uRings[i];
        if (r.w < 0.001) continue;
        float age = uTime - r.z;
        if (age < 0.0 || age > 2.5) continue;
        float radius = age * 22.0;
        vec2 d = p.xy - r.xy;
        float band = abs(length(d) - radius);
        flow += normalize(d + 0.0001) * smoothstep(5.0, 0.0, band) * 14.0 * r.w;
      }

      v.xy = mix(v.xy, flow, 0.045);
      v.z = mix(v.z, snoise(vec3(p.xy * 0.02, uTime * 0.05)) * 1.2, 0.03);
      gl_FragColor = v;
    }`;

  const posShader = /* glsl */ `
    uniform vec2 uField;
    void main(){
      vec2 uv = gl_FragCoord.xy / resolution.xy;
      vec4 p = texture2D(texturePosition, uv);
      vec4 v = texture2D(textureVelocity, uv);
      p.xyz += v.xyz * 0.016;
      // wrap the field so the flow never empties an edge
      if (p.x >  uField.x * 0.52) p.x = -uField.x * 0.52;
      if (p.x < -uField.x * 0.52) p.x =  uField.x * 0.52;
      if (p.y >  uField.y * 0.52) p.y = -uField.y * 0.52;
      if (p.y < -uField.y * 0.52) p.y =  uField.y * 0.52;
      p.z = clamp(p.z, -9.0, 9.0);
      gl_FragColor = p;
    }`;

  const velVar = gpu.addVariable('textureVelocity', velShader, dtVel);
  const posVar = gpu.addVariable('texturePosition', posShader, dtPos);
  gpu.setVariableDependencies(velVar, [velVar, posVar]);
  gpu.setVariableDependencies(posVar, [velVar, posVar]);

  const ringsUniform = { value: [new THREE.Vector4(), new THREE.Vector4(), new THREE.Vector4(), new THREE.Vector4()] };
  const shared = {
    uTime: { value: 0 },
    uPointer: { value: new THREE.Vector3(0, 0, 0) },
    uField: { value: new THREE.Vector2(fieldW, fieldH) },
    uRings: ringsUniform,
  };
  Object.assign(velVar.material.uniforms, shared);
  Object.assign(posVar.material.uniforms, { uField: shared.uField });
  const err = gpu.init();
  if (err) throw new Error(err);

  // ---- points ----
  const geo = new THREE.BufferGeometry();
  const refs = new Float32Array(COUNT * 2);
  for (let i = 0; i < COUNT; i++) {
    refs[i * 2] = (i % SIM) / SIM;
    refs[i * 2 + 1] = Math.floor(i / SIM) / SIM;
  }
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(COUNT * 3), 3));
  geo.setAttribute('ref', new THREE.BufferAttribute(refs, 2));

  const mat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uPositions: { value: null },
      uTime: shared.uTime,
      uDpr: { value: DPR },
      uRings: ringsUniform,
    },
    vertexShader: /* glsl */ `
      attribute vec2 ref;
      uniform sampler2D uPositions;
      uniform float uTime;
      uniform float uDpr;
      varying float vGlow;
      varying float vSeed;
      ${RINGS_GLSL}
      void main(){
        vec4 p = texture2D(uPositions, ref);
        vSeed = p.w;
        vGlow = ringGlow(p.xy, uTime);
        vec4 mv = modelViewMatrix * vec4(p.xyz, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = (1.0 + vSeed * 1.1 + vGlow * 1.5) * uDpr * (120.0 / -mv.z);
      }`,
    fragmentShader: /* glsl */ `
      varying float vGlow;
      varying float vSeed;
      void main(){
        float d = length(gl_PointCoord - 0.5);
        if (d > 0.5) discard;
        float soft = smoothstep(0.5, 0.05, d);
        // base: dim indigo dust (below bloom threshold)
        vec3 base = mix(vec3(0.545, 0.616, 1.0), vec3(0.961, 0.773, 0.42), step(0.965, vSeed));
        float alpha = (0.045 + vSeed * 0.055) * soft;
        // ring-excited particles get pushed over the bloom threshold → they glow
        vec3 col = base * (0.5 + vGlow * 1.7);
        alpha += vGlow * 0.28 * soft;
        gl_FragColor = vec4(col, alpha);
      }`,
  });
  scene.add(new THREE.Points(geo, mat));

  // ---- selective bloom: high threshold, only excited particles pass ----
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.55, 0.45, 0.68);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  // ---- interaction ----
  const toWorld = (cx, cy) => {
    const r = canvas.getBoundingClientRect();
    return [
      ((cx - r.left) / r.width - 0.5) * fieldW,
      -(((cy - r.top) / r.height) - 0.5) * fieldH,
    ];
  };
  const hero = canvas.closest('.hero');
  hero.addEventListener('pointermove', (e) => {
    const [x, y] = toWorld(e.clientX, e.clientY);
    shared.uPointer.value.set(x, y, 1);
  });
  hero.addEventListener('pointerleave', () => { shared.uPointer.value.z = 0; });

  let ringIdx = 0;
  const pulse = (x, y, strength) => {
    ringsUniform.value[ringIdx % 4].set(x, y, shared.uTime.value, strength);
    ringIdx++;
  };
  hero.addEventListener('pointerdown', (e) => {
    if (e.target.closest('a, button')) return;
    const [x, y] = toWorld(e.clientX, e.clientY);
    pulse(x, y, 0.7);
  });
  // idle heartbeat from the origin every ~4s so the scene breathes untouched
  setInterval(() => { if (running) pulse(fieldW * 0.28, -fieldH * 0.3, 0.16); }, 6000);
  // audio hook: wire an AnalyserNode beat detector to this for track-reactive rings
  window.__heroRingPulse = (s) => pulse(0, -6, Math.max(0, Math.min(1, s)));

  // ---- loop, paused off-screen / hidden tab ----
  let running = false, raf = null;
  const clock = new THREE.Clock();
  const tick = () => {
    if (!running) return;
    shared.uTime.value += Math.min(clock.getDelta(), 0.05) * 1.0;
    gpu.compute();
    mat.uniforms.uPositions.value = gpu.getCurrentRenderTarget(posVar).texture;
    composer.render();
    raf = requestAnimationFrame(tick);
  };
  const start = () => { if (!running) { running = true; clock.getDelta(); raf = requestAnimationFrame(tick); } };
  const stop = () => { running = false; if (raf) cancelAnimationFrame(raf); };

  new IntersectionObserver((es) => { (es[0].isIntersecting && !document.hidden) ? start() : stop(); }).observe(canvas);
  document.addEventListener('visibilitychange', () => { document.hidden ? stop() : start(); });

  let rsz;
  addEventListener('resize', () => {
    clearTimeout(rsz);
    rsz = setTimeout(() => {
      sizeToViewport();
      shared.uField.value.set(fieldW, fieldH);
      composer.setSize(canvas.clientWidth, canvas.clientHeight);
    }, 150);
  });
  composer.setSize(canvas.clientWidth, canvas.clientHeight);
  start();
  return { camera, shared };
}

/* ---- boot (must run AFTER all const declarations above) ---- */
const canvas = document.querySelector('[data-hero-gl]');
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (canvas && !REDUCED) {
  try {
    const { camera } = init(canvas);

    /* ---- 3D parallax: camera follows pointer + scroll ---- */
    let tiltX = 0, tiltY = 0, targX = 0, targY = 0;
    addEventListener('pointermove', (e) => {
      targX = (e.clientX / innerWidth - 0.5);
      targY = (e.clientY / innerHeight - 0.5);
    }, { passive: true });

    const mega = document.querySelector('.hero__mega');
    const sub = document.querySelector('.hero__sub');
    const parallax = () => {
      // pointer: dolly the camera around the field → real depth parallax
      tiltX += (targX - tiltX) * 0.04;
      tiltY += (targY - tiltY) * 0.04;
      camera.position.x = tiltX * 14;
      camera.position.y = -tiltY * 9;

      // scroll: pull the camera up & pitch as the hero leaves → the field
      // recedes at a different rate than the DOM = 3D scene, not flat page
      const sy = Math.min(scrollY, innerHeight);
      const k = sy / innerHeight;
      camera.position.z = 90 + k * 55;
      camera.rotation.x = -k * 0.35;
      camera.lookAt(0, camera.position.y * 0.4, 0);

      // DOM depth layers: title drifts slower than scroll, sub slower still
      if (mega) mega.style.transform = 'translateY(' + sy * 0.28 + 'px)';
      if (sub) sub.style.transform = 'translateY(' + sy * 0.16 + 'px)';
      requestAnimationFrame(parallax);
    };
    requestAnimationFrame(parallax);
  } catch (e) {
    console.warn('[hero-field] fallback to CSS gradient:', e);
    canvas.remove();
  }
}
