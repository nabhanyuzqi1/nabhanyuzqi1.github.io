import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const canvas = document.querySelector('[data-neural-gl]');
const card = document.querySelector('[data-ai-card]');
const hint = document.querySelector('[data-ai-hint]');
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

if (canvas && !REDUCED) {
  try { init(canvas); }
  catch (e) { console.warn('[neural-net] disabled:', e); }
}

/* ---- node data: CV embedded in the network ---- */
const NODES = [
  /* Input layer */
  { id: 'sampit', layer: 'input', label: 'Sampit', title: 'Sampit, Indonesia', desc: 'A river town in Central Kalimantan — where production software ships to Perth, Jakarta, and the cloud.', tags: ['Origin', 'Remote'] },
  { id: 'bangkit', layer: 'input', label: 'Bangkit', title: 'Bangkit Academy', desc: 'Google\'s intensive academy program — Android/Kotlin capstone (C23-PS321), ML foundations, soft-skills.', tags: ['Google', 'ML', 'Android'], link: 'https://github.com/nabhanyuzqi1' },
  { id: 'years', layer: 'input', label: '4+ Years', title: '4+ Years Shipping', desc: 'Shipping production software since 2022: from Django EdTech to Flutter platforms to Gemini-powered dashboards.', tags: ['Experience'] },
  { id: 'founder', layer: 'input', label: 'Founder', title: 'PT Tuntas Kilat', desc: 'Founded and running an on-demand services startup end-to-end: product strategy, engineering, operations.', tags: ['Startup', 'Leadership'] },

  /* Hidden layer 1 — core skills */
  { id: 'flutter', layer: 'hidden', label: 'Flutter', title: 'Flutter & Dart', desc: '3 production apps: Customer, Crew, Admin. Firestore Transactions for atomic bookings, security rules as backend.', tags: ['Mobile', 'Dart', 'Firebase'] },
  { id: 'nextjs', layer: 'hidden', label: 'Next.js', title: 'Next.js & React', desc: 'Production sites for creative agencies, news portals, and e-commerce — with 3D product rendering, SEO architecture.', tags: ['Web', 'TypeScript', 'React'] },
  { id: 'firebase', layer: 'hidden', label: 'Firebase', title: 'Firebase Ecosystem', desc: 'Firestore, Auth, Cloud Storage, Hosting, FCM — the serverless stack behind every platform. Zero fixed server costs.', tags: ['Cloud', 'Serverless', 'NoSQL'] },
  { id: 'gemini', layer: 'hidden', label: 'Gemini API', title: 'Gemini API Integration', desc: 'Kontrack uses Gemini to extract structured data from uploaded contracts — parties, values, milestones.', tags: ['AI', 'LLM', 'NLP'], link: 'https://kontrack.web.app/' },
  { id: 'django', layer: 'hidden', label: 'Django', title: 'Django & Python', desc: 'Platform engineering for Cakrawala Akademi — a nationally grant-funded EdTech (IWDM). Full-stack Django APIs.', tags: ['Python', 'Backend', 'EdTech'] },
  { id: 'iot', layer: 'hidden', label: 'IoT', title: 'IoT & Hardware', desc: 'ESP32 + soil sensors automating irrigation for a 2,000-tree palm oil nursery. Edge computing.', tags: ['ESP32', 'Arduino', 'Sensors'] },

  /* Hidden layer 2 — projects */
  { id: 'tuntaskilat', layer: 'hidden', label: 'TuntasKilat', title: 'Tuntas Kilat Platform', desc: '3-app on-demand cleaning platform: Customer books, Crew executes, Admin oversees. Atomic Firestore.', tags: ['Flutter', 'Firebase'], link: 'https://github.com/nabhanyuzqi1/tuntaskilat' },
  { id: 'kontrack', layer: 'hidden', label: 'Kontrack', title: 'Kontrack Dashboard', desc: 'Contract & finance dashboard for PT PEB — Gemini reads the contracts, humans confirm. Serverless.', tags: ['SaaS', 'Gemini API', 'Firebase'], link: 'https://kontrack.web.app/' },
  { id: 'mclearance', layer: 'hidden', label: 'M-Clearance', title: 'M-Clearance App', desc: 'Immigration clearance workflow digitized — submission, verification, approval. Full audit trail.', tags: ['GovTech', 'Flutter'], link: 'https://github.com/nabhanyuzqi1/m-clearance-imigrasi' },
  { id: 'orah', layer: 'hidden', label: 'Orah Cafe', title: 'Orah Cafe', desc: 'Cafe website for a Perth Airport venue — menu showcase, SEO, local search presence.', tags: ['Web', 'Australia', 'SEO'], link: 'https://orah-cafe-website.web.app' },
  { id: 'tekka', layer: 'hidden', label: 'Tekka POS', title: 'Tekka Cafe OS', desc: 'Multi-tenant ordering & POS SaaS — one deployment serving many cafes with isolated data.', tags: ['SaaS', 'Multi-tenant', 'PHP'] },
  { id: 'manob', layer: 'hidden', label: 'Manob', title: 'Manob Production', desc: 'Creative agency site + academy app in Kotlin Multiplatform. Shared brand system across web & mobile.', tags: ['Agency', 'KMP', 'Next.js'], link: 'https://manobproduction.com' },

  /* Hidden layer 3 — learning frontier */
  { id: 'web3', layer: 'hidden', label: 'Web3', title: 'Web3 & Blockchain', desc: 'Currently exploring: smart contracts (Solidity), decentralized applications, tokenomics.', tags: ['Learning', 'Solidity', 'DApps'] },
  { id: 'ml', layer: 'hidden', label: 'ML / AI', title: 'Machine Learning', desc: 'Foundations from Bangkit Academy, now applying through Gemini API integration.', tags: ['TensorFlow', 'Gemini', 'Edge AI'] },

  /* Output layer */
  { id: 'apps', layer: 'output', label: 'Production', title: 'Production Apps', desc: '7+ live client platforms running in production — from Flutter mobile apps to Next.js web platforms.', tags: ['Shipped', 'Production'] },
  { id: 'ai-out', layer: 'output', label: 'Applied AI', title: 'AI Integration', desc: 'Practical AI that solves real problems: contract extraction, structured data from documents.', tags: ['Gemini', 'Practical AI'] },
  { id: 'iot-out', layer: 'output', label: 'Edge IoT', title: 'IoT Systems', desc: 'Hardware + cloud connected systems: soil sensors, automated pumps, remote dashboards.', tags: ['Hardware', 'Cloud'] },
  { id: 'web3-out', layer: 'output', label: 'The Future', title: 'Web3 (Exploring)', desc: 'Building toward decentralized applications — smart contracts, token-gated access.', tags: ['Blockchain', 'Future'] },
];

/* ---- connections ---- */
const EDGES = [
  ['sampit', 'flutter'], ['sampit', 'firebase'], ['sampit', 'iot'],
  ['bangkit', 'django'], ['bangkit', 'ml'], ['bangkit', 'gemini'],
  ['years', 'nextjs'], ['years', 'flutter'], ['years', 'firebase'],
  ['founder', 'flutter'], ['founder', 'iot'], ['founder', 'firebase'],
  ['flutter', 'tuntaskilat'], ['flutter', 'mclearance'],
  ['firebase', 'tuntaskilat'], ['firebase', 'kontrack'], ['firebase', 'mclearance'],
  ['gemini', 'kontrack'], ['nextjs', 'orah'], ['nextjs', 'manob'], ['django', 'tekka'], ['iot', 'tuntaskilat'],
  ['kontrack', 'ml'], ['kontrack', 'web3'], ['tuntaskilat', 'web3'], ['ml', 'gemini'],
  ['tuntaskilat', 'apps'], ['kontrack', 'apps'], ['mclearance', 'apps'],
  ['orah', 'apps'], ['manob', 'apps'], ['tekka', 'apps'],
  ['gemini', 'ai-out'], ['ml', 'ai-out'], ['iot', 'iot-out'], ['web3', 'web3-out'],
];

/* ---- 4D Hypercube Vertices & Edges ---- */
function generateHypercube() {
  const vertices = [];
  for (let i = 0; i < 16; i++) {
    vertices.push([
      (i & 1) ? 1 : -1,
      (i & 2) ? 1 : -1,
      (i & 4) ? 1 : -1,
      (i & 8) ? 1 : -1
    ]);
  }
  const edges = [];
  for (let i = 0; i < 16; i++) {
    for (let j = i + 1; j < 16; j++) {
      // Connect if they differ by exactly 1 bit
      let diff = i ^ j;
      if (diff === 1 || diff === 2 || diff === 4 || diff === 8) {
        edges.push([i, j]);
      }
    }
  }
  return { vertices, edges };
}
const hypercube = generateHypercube();

function init(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setClearColor(0x020305, 1);
  const DPR = Math.min(devicePixelRatio || 1, 1.5);
  renderer.setPixelRatio(DPR);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 1, 1000);
  camera.position.set(0, 0, 180);

  const sizeToViewport = () => {
    const r = canvas.parentElement.getBoundingClientRect();
    renderer.setSize(r.width, r.height, false);
    camera.aspect = r.width / r.height;
    camera.updateProjectionMatrix();
  };
  sizeToViewport();

  const isMobile = innerWidth < 700;

  /* ---- 4D Core (Tesseract) ---- */
  const coreGroup = new THREE.Group();
  scene.add(coreGroup);

  const coreGeo = new THREE.BufferGeometry();
  const corePositions = new Float32Array(hypercube.edges.length * 2 * 3);
  coreGeo.setAttribute('position', new THREE.BufferAttribute(corePositions, 3));
  const coreMat = new THREE.LineBasicMaterial({ color: 0x8b9dff, transparent: true, opacity: 0.7 });
  const coreLines = new THREE.LineSegments(coreGeo, coreMat);
  coreLines.scale.setScalar(12);
  coreGroup.add(coreLines);

  /* Add glowing particles on tesseract vertices */
  const corePointsGeo = new THREE.BufferGeometry();
  const corePointsPositions = new Float32Array(16 * 3);
  corePointsGeo.setAttribute('position', new THREE.BufferAttribute(corePointsPositions, 3));
  const corePointsMat = new THREE.PointsMaterial({ color: 0xffffff, size: 2, transparent: true, opacity: 0.9 });
  const corePoints = new THREE.Points(corePointsGeo, corePointsMat);
  corePoints.scale.setScalar(12);
  coreGroup.add(corePoints);

  /* ---- Background Neural Dust (Points) ---- */
  const dustGeo = new THREE.BufferGeometry();
  const DUST_COUNT = isMobile ? 800 : 2500;
  const dustPos = new Float32Array(DUST_COUNT * 3);
  const dustBases = new Float32Array(DUST_COUNT * 3); // for organic movement
  for (let i = 0; i < DUST_COUNT * 3; i++) {
    const v = (Math.random() - 0.5) * 400;
    dustPos[i] = v;
    dustBases[i] = v;
  }
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
  dustGeo.setAttribute('base', new THREE.BufferAttribute(dustBases, 3));
  const dustMat = new THREE.PointsMaterial({ color: 0x8b9dff, size: 0.8, transparent: true, opacity: 0.3 });
  const dust = new THREE.Points(dustGeo, dustMat);
  scene.add(dust);

  /* ---- Data Nodes (Icosahedron Crystals) ---- */
  const nodeMap = {};
  const layerConfig = {
    input: { radiusX: 90, color: 0x5ee29a },
    hidden: { radiusX: 55, color: 0x8b9dff },
    output: { radiusX: 90, color: 0xf5c56b },
  };

  const layers = { input: [], hidden: [], output: [] };
  NODES.forEach(n => layers[n.layer].push(n));

  const networkGroup = new THREE.Group();
  scene.add(networkGroup);

  const crystalGeo = new THREE.IcosahedronGeometry(2.5, 0);
  const wireGeo = new THREE.IcosahedronGeometry(3.5, 0);

  Object.entries(layers).forEach(([layerName, nodes]) => {
    const cfg = layerConfig[layerName];
    
    nodes.forEach((n, i) => {
      const angle = (i / nodes.length) * Math.PI * 2;
      const rX = cfg.radiusX;
      // Elliptical orbit: wide X, shallow Y, varied Z
      let posX, posY, posZ;
      if (layerName === 'input') {
        posX = -rX * 0.8 + Math.random() * 20;
        posY = Math.sin(angle) * 40;
        posZ = Math.cos(angle) * 40;
      } else if (layerName === 'output') {
        posX = rX * 0.8 - Math.random() * 20;
        posY = Math.sin(angle) * 40;
        posZ = Math.cos(angle) * 40;
      } else {
        // Hidden layer orbits in a chaotic ring around the core
        posX = Math.sin(angle) * rX;
        posY = (Math.random() - 0.5) * 50;
        posZ = Math.cos(angle) * rX;
      }
      
      const pos = new THREE.Vector3(posX, posY, posZ);

      // Inner glowing core
      const coreMesh = new THREE.Mesh(crystalGeo, new THREE.MeshStandardMaterial({
        color: cfg.color,
        emissive: cfg.color,
        emissiveIntensity: 0.8,
        roughness: 0.1,
        metalness: 0.8,
      }));
      // Outer wireframe shell
      const wireMesh = new THREE.LineSegments(
        new THREE.EdgesGeometry(wireGeo),
        new THREE.LineBasicMaterial({ color: cfg.color, transparent: true, opacity: 0.3 })
      );
      
      const group = new THREE.Group();
      group.position.copy(pos);
      group.add(coreMesh);
      group.add(wireMesh);
      
      group.userData = { nodeData: n, baseScale: 1, baseEmissive: 0.8, color: cfg.color, phase: Math.random() * Math.PI * 2, origin: pos.clone() };
      networkGroup.add(group);

      nodeMap[n.id] = { group, coreMesh, wireMesh, data: n, cfg };
    });
  });

  /* ---- Lightning Edges ---- */
  const edgeGroup = new THREE.Group();
  networkGroup.add(edgeGroup);

  const edgeLines = [];
  EDGES.forEach(([fromId, toId]) => {
    const from = nodeMap[fromId];
    const to = nodeMap[toId];
    if (!from || !to) return;

    // We create a line with multiple segments to jitter like lightning
    const segments = 6;
    const points = new Float32Array((segments + 1) * 3);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(points, 3));
    
    // Gradient line material is tricky in vanilla three.js without shaders, so we use a basic material that pulses
    const mat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.05,
      blending: THREE.AdditiveBlending
    });
    
    const line = new THREE.Line(geo, mat);
    edgeGroup.add(line);
    edgeLines.push({ line, geo, from, to, segments, offset: Math.random() * 100 });
  });

  /* ---- Lights ---- */
  scene.add(new THREE.AmbientLight(0x0a0c12, 1));
  const pLight = new THREE.PointLight(0xffffff, 100, 300);
  scene.add(pLight); // Tracks cursor/core

  /* ---- Interaction ---- */
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2(-9999, -9999);
  let targX = 0, targY = 0;
  let hoveredNode = null;
  let selectedNode = null;

  const hitMeshes = Object.values(nodeMap).map(n => n.coreMesh);

  function decodeText(element, text) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*';
    let iterations = 0;
    const maxIterations = 15;
    const interval = setInterval(() => {
      element.innerText = text.split('').map((c, i) => {
        if (i < iterations) return c;
        return chars[Math.floor(Math.random() * chars.length)];
      }).join('');
      iterations += 1;
      if (iterations > text.length) clearInterval(interval);
    }, 20);
  }

  function updateCard(nodeEntry, clientX, clientY) {
    if (!nodeEntry) {
      card.classList.remove('is-on');
      return;
    }
    const d = nodeEntry.data;
    
    const layerEl = card.querySelector('[data-card-layer]');
    layerEl.className = 'ai-card__layer mono ai-card__layer--' + d.layer;
    decodeText(layerEl, d.layer);

    decodeText(card.querySelector('[data-card-title]'), d.title);
    
    // Description appears normally to avoid too much chaos
    card.querySelector('[data-card-desc]').textContent = d.desc;

    const tagsEl = card.querySelector('[data-card-tags]');
    tagsEl.innerHTML = '';
    (d.tags || []).forEach(t => {
      const span = document.createElement('span');
      span.className = 'ai-card__tag';
      span.textContent = t;
      tagsEl.appendChild(span);
    });

    const linkEl = card.querySelector('[data-card-link]');
    if (d.link) {
      linkEl.href = d.link;
      linkEl.style.display = '';
    } else {
      linkEl.style.display = 'none';
    }

    const cw = 340, ch = card.offsetHeight || 280;
    const x = Math.max(12, Math.min(clientX + 30, innerWidth - cw - 12));
    const y = Math.max(12, Math.min(clientY - ch / 2, innerHeight - ch - 12));
    card.style.left = x + 'px';
    card.style.top = y + 'px';
    card.classList.add('is-on');
  }

  function projectToScreen(pos3d) {
    const v = pos3d.clone().project(camera);
    return {
      x: (v.x * 0.5 + 0.5) * canvas.clientWidth,
      y: (-v.y * 0.5 + 0.5) * canvas.clientHeight,
    };
  }

  canvas.addEventListener('pointermove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    targX = mouse.x;
    targY = mouse.y;

    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObjects(hitMeshes);

    if (hits.length > 0) {
      const hit = hits[0].object; // This is the coreMesh
      const parentGroup = hit.parent; // The group containing wire & core
      if (hoveredNode !== parentGroup) {
        if (hoveredNode && hoveredNode !== selectedNode) {
          hoveredNode.children[0].material.emissiveIntensity = hoveredNode.userData.baseEmissive;
          hoveredNode.scale.setScalar(hoveredNode.userData.baseScale);
          hoveredNode.children[1].material.opacity = 0.3;
        }
        hoveredNode = parentGroup;
        if (hoveredNode !== selectedNode) {
          hoveredNode.children[0].material.emissiveIntensity = 1.5; // Brighten core
          hoveredNode.scale.setScalar(1.5); // Grow
          hoveredNode.children[1].material.opacity = 0.8; // Brighten wire
        }
        canvas.style.cursor = 'crosshair';

        // Highlight connected edges
        const nid = hoveredNode.userData.nodeData.id;
        edgeLines.forEach(el => {
          if (el.from.data.id === nid || el.to.data.id === nid) {
            el.line.material.opacity = 0.8;
            el.line.material.color.setHex(hoveredNode.userData.color);
          } else {
            el.line.material.opacity = 0.05;
            el.line.material.color.setHex(0xffffff);
          }
        });
      }
      if (!selectedNode) {
        updateCard(hoveredNode.userData, e.clientX, e.clientY);
      }
    } else {
      if (hoveredNode) {
        if (hoveredNode !== selectedNode) {
          hoveredNode.children[0].material.emissiveIntensity = hoveredNode.userData.baseEmissive;
          hoveredNode.scale.setScalar(hoveredNode.userData.baseScale);
          hoveredNode.children[1].material.opacity = 0.3;
        }
        hoveredNode = null;
        canvas.style.cursor = 'default';
        
        if (!selectedNode) {
          edgeLines.forEach(el => { el.line.material.opacity = 0.05; el.line.material.color.setHex(0xffffff); });
          card.classList.remove('is-on');
        } else {
          // Restore selected node's edges
          const sid = selectedNode.userData.nodeData.id;
          edgeLines.forEach(el => {
            if (el.from.data.id === sid || el.to.data.id === sid) {
              el.line.material.opacity = 0.8;
              el.line.material.color.setHex(selectedNode.userData.color);
            } else {
              el.line.material.opacity = 0.05;
              el.line.material.color.setHex(0xffffff);
            }
          });
        }
      }
    }
  });

  canvas.addEventListener('pointerdown', e => {
    if (hoveredNode) {
      if (selectedNode === hoveredNode) {
        // Deselect
        selectedNode.children[0].material.emissiveIntensity = selectedNode.userData.baseEmissive;
        selectedNode.scale.setScalar(selectedNode.userData.baseScale);
        selectedNode.children[1].material.opacity = 0.3;
        selectedNode = null;
        card.classList.remove('is-on');
        edgeLines.forEach(el => { el.line.material.opacity = 0.05; el.line.material.color.setHex(0xffffff); });
      } else {
        if (selectedNode) {
          selectedNode.children[0].material.emissiveIntensity = selectedNode.userData.baseEmissive;
          selectedNode.scale.setScalar(selectedNode.userData.baseScale);
          selectedNode.children[1].material.opacity = 0.3;
        }
        selectedNode = hoveredNode;
        selectedNode.children[0].material.emissiveIntensity = 2.0;
        selectedNode.scale.setScalar(1.6);
        selectedNode.children[1].material.opacity = 1.0;
        
        const wp = new THREE.Vector3();
        selectedNode.getWorldPosition(wp);
        const sp = projectToScreen(wp);
        updateCard(selectedNode.userData, sp.x, sp.y);
      }
      if (hint) hint.classList.add('is-hidden');
    } else {
      if (selectedNode) {
        selectedNode.children[0].material.emissiveIntensity = selectedNode.userData.baseEmissive;
        selectedNode.scale.setScalar(selectedNode.userData.baseScale);
        selectedNode.children[1].material.opacity = 0.3;
        selectedNode = null;
        card.classList.remove('is-on');
        edgeLines.forEach(el => { el.line.material.opacity = 0.05; el.line.material.color.setHex(0xffffff); });
      }
    }
  });

  /* ---- Render Loop ---- */
  let running = false, raf = null;
  const clock = new THREE.Clock();

  let angle4D_1 = 0; // XW rotation
  let angle4D_2 = 0; // YW rotation

  // For camera smoothing
  let camX = 0, camY = 0;

  const tick = () => {
    if (!running) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;

    // Update 4D Hypercube Core
    angle4D_1 += dt * 0.8;
    angle4D_2 += dt * 0.5;
    const cos1 = Math.cos(angle4D_1), sin1 = Math.sin(angle4D_1);
    const cos2 = Math.cos(angle4D_2), sin2 = Math.sin(angle4D_2);

    const projected = [];
    for (let i = 0; i < hypercube.vertices.length; i++) {
      let [x, y, z, w] = hypercube.vertices[i];
      // Rotate in XW plane
      let nx = x * cos1 - w * sin1;
      let nw = x * sin1 + w * cos1;
      x = nx; w = nw;
      // Rotate in YW plane
      let ny = y * cos2 - w * sin2;
      nw = y * sin2 + w * cos2;
      y = ny; w = nw;

      // Stereographic projection from 4D to 3D
      const distance = 3;
      const wFactor = 1 / (distance - w);
      projected.push(new THREE.Vector3(x * wFactor, y * wFactor, z * wFactor));
    }

    const corePos = coreGeo.attributes.position.array;
    let idx = 0;
    for (let i = 0; i < hypercube.edges.length; i++) {
      const a = projected[hypercube.edges[i][0]];
      const b = projected[hypercube.edges[i][1]];
      corePos[idx++] = a.x; corePos[idx++] = a.y; corePos[idx++] = a.z;
      corePos[idx++] = b.x; corePos[idx++] = b.y; corePos[idx++] = b.z;
    }
    coreGeo.attributes.position.needsUpdate = true;
    
    // Update core points
    const cpPos = corePointsGeo.attributes.position.array;
    for(let i=0; i<projected.length; i++) {
      cpPos[i*3] = projected[i].x;
      cpPos[i*3+1] = projected[i].y;
      cpPos[i*3+2] = projected[i].z;
    }
    corePointsGeo.attributes.position.needsUpdate = true;

    coreGroup.rotation.y = t * 0.2;
    coreGroup.rotation.x = t * 0.15;

    // Organic movement of nodes
    networkGroup.rotation.y = Math.sin(t * 0.1) * 0.2;
    
    Object.values(nodeMap).forEach((n) => {
      const grp = n.group;
      const origin = grp.userData.origin;
      const phase = grp.userData.phase;
      
      // Float
      grp.position.y = origin.y + Math.sin(t * 1.5 + phase) * 4;
      grp.position.x = origin.x + Math.cos(t * 1.2 + phase) * 2;
      
      // Spin crystals
      grp.rotation.y += dt * 0.5;
      grp.rotation.z += dt * 0.3;
      grp.children[1].rotation.x -= dt * 0.8; // Wire spins oppositely
    });

    // Lightning Edges Update
    edgeLines.forEach(el => {
      // Only animate actively visible lines to save compute, or animate all subtly
      const isActive = el.line.material.opacity > 0.1;
      const jitterAmt = isActive ? 2.5 : 0.2;
      
      const p1 = new THREE.Vector3();
      const p2 = new THREE.Vector3();
      el.from.group.getWorldPosition(p1);
      el.to.group.getWorldPosition(p2);
      
      const pts = el.geo.attributes.position.array;
      for (let i = 0; i <= el.segments; i++) {
        const factor = i / el.segments;
        const base = new THREE.Vector3().lerpVectors(p1, p2, factor);
        
        // Add jagged noise
        if (i > 0 && i < el.segments) {
          const time = t * 10 + el.offset;
          base.x += (Math.sin(time + i) - 0.5) * jitterAmt;
          base.y += (Math.cos(time - i) - 0.5) * jitterAmt;
          base.z += (Math.sin(time * 0.8 + i) - 0.5) * jitterAmt;
        }
        
        pts[i * 3] = base.x;
        pts[i * 3 + 1] = base.y;
        pts[i * 3 + 2] = base.z;
      }
      el.geo.attributes.position.needsUpdate = true;
    });

    // Dust particles drift based on mouse
    const dPos = dustGeo.attributes.position.array;
    const dBase = dustGeo.attributes.base.array;
    for (let i = 0; i < DUST_COUNT; i++) {
      const idx = i * 3;
      // Base swirling
      const y = dBase[idx + 1];
      const swirl = Math.sin(t * 0.2 + y * 0.01) * 20;
      
      // React to mouse
      dPos[idx] = dBase[idx] + swirl - targX * 40;
      dPos[idx + 2] = dBase[idx + 2] + Math.cos(t * 0.2 + y * 0.01) * 20 - targY * 20;
    }
    dustGeo.attributes.position.needsUpdate = true;
    dust.rotation.y = t * 0.05; // slowly rotate the whole storm

    // Camera parallax
    camX += (targX - camX) * 0.05;
    camY += (targY - camY) * 0.05;
    camera.position.x = camX * 40;
    camera.position.y = -camY * 20;
    camera.lookAt(0, 0, 0);

    // Light tracks cursor
    pLight.position.set(camX * 100, -camY * 100, 50);

    // Update selected card position
    if (selectedNode) {
      const wp = new THREE.Vector3();
      selectedNode.getWorldPosition(wp);
      const sp = projectToScreen(wp);
      const cw = 340, ch = card.offsetHeight || 280;
      const x = Math.max(12, Math.min(sp.x + 30, innerWidth - cw - 12));
      const y = Math.max(12, Math.min(sp.y - ch / 2, innerHeight - ch - 12));
      card.style.left = x + 'px';
      card.style.top = y + 'px';
    }

    renderer.render(scene, camera);
    raf = requestAnimationFrame(tick);
  };

  const start = () => { if (!running) { running = true; clock.getDelta(); raf = requestAnimationFrame(tick); } };
  const stop = () => { running = false; if (raf) cancelAnimationFrame(raf); };

  new IntersectionObserver(es => {
    (es[0].isIntersecting && !document.hidden) ? start() : stop();
  }).observe(canvas);
  document.addEventListener('visibilitychange', () => { document.hidden ? stop() : start(); });

  let rsz;
  addEventListener('resize', () => { clearTimeout(rsz); rsz = setTimeout(sizeToViewport, 150); });
  start();
}
