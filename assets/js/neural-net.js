/* ==========================================================================
   AI Lab — Interactive 3D Neural Network Simulation
   Three.js module: builds a layered neural network graph in 3D space.
   Nodes contain real information about Nabhan's projects, skills, and interests.
   Click/hover any node to see its detail card.
   ========================================================================== */
import * as THREE from 'three';

const canvas = document.querySelector('[data-neural-gl]');
const card = document.querySelector('[data-ai-card]');
const hint = document.querySelector('[data-ai-hint]');
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

if (canvas && !REDUCED) {
  try { init(canvas); }
  catch (e) { console.warn('[neural-net] disabled:', e); }
}

/* ---- node data: the real information embedded in the network ---- */
const NODES = [
  /* Input layer — background & origins */
  { id: 'sampit', layer: 'input', label: 'Sampit, ID', title: 'Sampit, Indonesia', desc: 'A river town in Central Kalimantan — where production software ships to Perth, Jakarta, and the cloud. Distance is a solved problem.', tags: ['Origin', 'Remote'] },
  { id: 'bangkit', layer: 'input', label: 'Bangkit', title: 'Bangkit Academy', desc: 'Google\'s intensive academy program — Android/Kotlin capstone (C23-PS321), machine learning foundations, and soft-skills for Indonesian developers.', tags: ['Google', 'ML', 'Android'], link: 'https://github.com/nabhanyuzqi1' },
  { id: 'years', layer: 'input', label: '4+ Years', title: '4+ Years Shipping', desc: 'Shipping production software since 2022: from Django EdTech to Flutter platforms to Gemini-powered dashboards. 5 companies, 7+ live platforms.', tags: ['Experience'] },
  { id: 'founder', layer: 'input', label: 'Founder', title: 'PT Tuntas Kilat Group', desc: 'Founded and running an on-demand services startup end-to-end: product strategy, engineering, operations, and IoT hardware.', tags: ['Startup', 'Leadership'] },

  /* Hidden layer 1 — core skills */
  { id: 'flutter', layer: 'hidden', label: 'Flutter', title: 'Flutter & Dart', desc: '3 production apps: Customer, Crew, Admin — all from one discipline. Firestore Transactions for atomic bookings, FCM push notifications, security rules as backend.', tags: ['Mobile', 'Dart', 'Firebase'] },
  { id: 'nextjs', layer: 'hidden', label: 'Next.js', title: 'Next.js & React', desc: 'Production sites for creative agencies, news portals, and e-commerce — with 3D product rendering, SEO architecture, and multi-tenant SaaS.', tags: ['Web', 'TypeScript', 'React'] },
  { id: 'firebase', layer: 'hidden', label: 'Firebase', title: 'Firebase Ecosystem', desc: 'Firestore, Auth, Cloud Storage, Hosting, FCM — the serverless stack behind every platform. Zero fixed server costs, infinite scale ceiling.', tags: ['Cloud', 'Serverless', 'NoSQL'] },
  { id: 'gemini', layer: 'hidden', label: 'Gemini', title: 'Gemini API Integration', desc: 'Kontrack uses Gemini to extract structured data from uploaded contracts — parties, values, milestones. AI as assist, not autopilot.', tags: ['AI', 'LLM', 'NLP'], link: 'https://kontrack.web.app/' },
  { id: 'django', layer: 'hidden', label: 'Django', title: 'Django & Python', desc: 'Platform engineering for Cakrawala Akademi — a nationally grant-funded EdTech (IWDM). Full-stack Django with REST APIs.', tags: ['Python', 'Backend', 'EdTech'] },
  { id: 'iot', layer: 'hidden', label: 'IoT', title: 'IoT & Hardware', desc: 'ESP32 + soil sensors automating irrigation for a 2,000-tree palm oil nursery. Edge computing: control at the device, insight in the cloud.', tags: ['ESP32', 'Arduino', 'Sensors'] },

  /* Hidden layer 2 — projects */
  { id: 'tuntaskilat', layer: 'hidden', label: 'TuntasKilat', title: 'Tuntas Kilat Platform', desc: '3-app on-demand cleaning platform: Customer books, Crew executes, Admin oversees. Atomic Firestore Transactions prevent double-bookings.', tags: ['Flutter', 'Firebase', 'HCD'], link: 'https://github.com/nabhanyuzqi1/tuntaskilat' },
  { id: 'kontrack', layer: 'hidden', label: 'Kontrack', title: 'Kontrack Dashboard', desc: 'Contract & finance dashboard for PT PEB — Gemini reads the contracts, humans confirm. Serverless, $0 running cost.', tags: ['SaaS', 'Gemini API', 'Firebase'], link: 'https://kontrack.web.app/' },
  { id: 'mclearance', layer: 'hidden', label: 'M-Clearance', title: 'M-Clearance App', desc: 'Immigration clearance workflow digitized — submission, verification, approval. State machine architecture with full audit trail. Live on Play Store.', tags: ['GovTech', 'Flutter', 'Firebase'], link: 'https://github.com/nabhanyuzqi1/m-clearance-imigrasi' },
  { id: 'orah', layer: 'hidden', label: 'Orah Cafe', title: 'Orah Cafe Website', desc: 'Cafe website for a Perth Airport venue — menu showcase, SEO, local search presence. Australian client shipped from Sampit.', tags: ['Web', 'Australia', 'SEO'], link: 'https://orah-cafe-website.web.app' },
  { id: 'tekka', layer: 'hidden', label: 'Tekka POS', title: 'Tekka Cafe OS', desc: 'Multi-tenant ordering & POS SaaS — one deployment serving many cafes with isolated data. PHP + MySQL for cheap commodity hosting.', tags: ['SaaS', 'Multi-tenant', 'PHP'] },
  { id: 'manob', layer: 'hidden', label: 'Manob', title: 'Manob Production', desc: 'Creative agency site at manobproduction.com + academy app in Kotlin Multiplatform. Shared brand system across web & mobile.', tags: ['Agency', 'KMP', 'Next.js'], link: 'https://manobproduction.com' },

  /* Hidden layer 3 — learning frontier */
  { id: 'web3', layer: 'hidden', label: 'Web3', title: 'Web3 & Blockchain', desc: 'Currently exploring: smart contracts (Solidity), decentralized applications, tokenomics, and how Web3 intersects with real-world Indonesian SME use cases.', tags: ['Learning', 'Solidity', 'DApps'] },
  { id: 'ml', layer: 'hidden', label: 'ML/AI', title: 'Machine Learning', desc: 'Foundations from Bangkit Academy, now applying through Gemini API integration. Interested in on-device ML, edge inference, and practical AI for small businesses.', tags: ['TensorFlow', 'Gemini', 'Edge AI'] },

  /* Output layer — what gets delivered */
  { id: 'apps', layer: 'output', label: 'Apps', title: 'Production Apps', desc: '7+ live client platforms running in production — from Flutter mobile apps to Next.js web platforms. Every project ships, no toy demos.', tags: ['Shipped', 'Production'] },
  { id: 'ai-out', layer: 'output', label: 'AI', title: 'AI Integration', desc: 'Practical AI that solves real problems: contract extraction, structured data from documents, chat-powered dashboards.', tags: ['Gemini', 'Practical AI'] },
  { id: 'iot-out', layer: 'output', label: 'IoT', title: 'IoT Systems', desc: 'Hardware + cloud connected systems: soil sensors, automated pumps, remote dashboards. Edge-first, cloud-reported.', tags: ['Hardware', 'Cloud'] },
  { id: 'web3-out', layer: 'output', label: 'Web3', title: 'Web3 (Exploring)', desc: 'Building toward decentralized applications — smart contracts, token-gated access, blockchain-verified records. The next frontier.', tags: ['Blockchain', 'Future'] },
];

/* ---- edges: connections between nodes ---- */
const EDGES = [
  /* Input → Hidden 1 (skills) */
  ['sampit', 'flutter'], ['sampit', 'firebase'], ['sampit', 'iot'],
  ['bangkit', 'django'], ['bangkit', 'ml'], ['bangkit', 'gemini'],
  ['years', 'nextjs'], ['years', 'flutter'], ['years', 'firebase'],
  ['founder', 'flutter'], ['founder', 'iot'], ['founder', 'firebase'],
  /* Skills → Projects */
  ['flutter', 'tuntaskilat'], ['flutter', 'mclearance'],
  ['firebase', 'tuntaskilat'], ['firebase', 'kontrack'], ['firebase', 'mclearance'],
  ['gemini', 'kontrack'],
  ['nextjs', 'orah'], ['nextjs', 'manob'],
  ['django', 'tekka'],
  ['iot', 'tuntaskilat'],
  /* Projects → Learning */
  ['kontrack', 'ml'], ['kontrack', 'web3'],
  ['tuntaskilat', 'web3'],
  ['ml', 'gemini'],
  /* Hidden → Output */
  ['tuntaskilat', 'apps'], ['kontrack', 'apps'], ['mclearance', 'apps'],
  ['orah', 'apps'], ['manob', 'apps'], ['tekka', 'apps'],
  ['gemini', 'ai-out'], ['ml', 'ai-out'],
  ['iot', 'iot-out'],
  ['web3', 'web3-out'],
];

function init(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setClearColor(0x0a0c12, 1);
  const DPR = Math.min(devicePixelRatio || 1, 1.5);
  renderer.setPixelRatio(DPR);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 1, 600);
  camera.position.set(0, 0, 140);

  const sizeToViewport = () => {
    const r = canvas.parentElement.getBoundingClientRect();
    renderer.setSize(r.width, r.height, false);
    camera.aspect = r.width / r.height;
    camera.updateProjectionMatrix();
  };
  sizeToViewport();

  const isMobile = innerWidth < 700;

  /* ---- build the network layout ---- */
  const nodeMap = {};
  const layerConfig = {
    input: { x: isMobile ? -40 : -60, color: 0x5ee29a, emissive: 0x1a5e35, radius: isMobile ? 2.2 : 3.0 },
    hidden: { x: 0, color: 0x8b9dff, emissive: 0x2a3066, radius: isMobile ? 1.8 : 2.4 },
    output: { x: isMobile ? 40 : 60, color: 0xf5c56b, emissive: 0x5e4a22, radius: isMobile ? 2.2 : 3.0 },
  };

  /* Sort nodes by layer for positioning */
  const layers = { input: [], hidden: [], output: [] };
  NODES.forEach(n => layers[n.layer].push(n));

  /* Position nodes in 3D space — layered left-to-right, spread vertically + depth */
  const networkGroup = new THREE.Group();
  scene.add(networkGroup);

  const sphereGeo = new THREE.SphereGeometry(1, 24, 16);

  Object.entries(layers).forEach(([layerName, nodes]) => {
    const cfg = layerConfig[layerName];
    const spread = isMobile ? 22 : 30;
    const depthSpread = isMobile ? 12 : 18;

    /* Arrange in sub-columns for hidden layer (skills vs projects vs frontier) */
    let xOffset = cfg.x;
    nodes.forEach((n, i) => {
      const count = nodes.length;
      const yPos = (i - (count - 1) / 2) * (spread / Math.max(1, count / 4));

      if (layerName === 'hidden') {
        /* Skills: left cluster, Projects: center, Frontier: right */
        const skillNodes = ['flutter', 'nextjs', 'firebase', 'gemini', 'django', 'iot'];
        const frontierNodes = ['web3', 'ml'];
        if (skillNodes.includes(n.id)) xOffset = cfg.x - (isMobile ? 16 : 22);
        else if (frontierNodes.includes(n.id)) xOffset = cfg.x + (isMobile ? 16 : 22);
        else xOffset = cfg.x + (isMobile ? 2 : 4);
      }

      const zPos = (Math.random() - 0.5) * depthSpread;
      const pos = new THREE.Vector3(xOffset, yPos, zPos);

      const mat = new THREE.MeshStandardMaterial({
        color: cfg.color,
        emissive: cfg.emissive,
        emissiveIntensity: 0.6,
        roughness: 0.3,
        metalness: 0.2,
      });
      const mesh = new THREE.Mesh(sphereGeo, mat);
      mesh.scale.setScalar(cfg.radius);
      mesh.position.copy(pos);
      mesh.userData = { nodeData: n, baseScale: cfg.radius, baseEmissive: 0.6 };
      networkGroup.add(mesh);

      nodeMap[n.id] = { mesh, pos, data: n, cfg };
    });
  });

  /* ---- edges (lines between nodes) ---- */
  const edgeGroup = new THREE.Group();
  networkGroup.add(edgeGroup);

  const edgeMat = new THREE.LineBasicMaterial({
    color: 0x8b9dff,
    transparent: true,
    opacity: 0.08,
  });

  const edgeLines = [];
  EDGES.forEach(([fromId, toId]) => {
    const from = nodeMap[fromId];
    const to = nodeMap[toId];
    if (!from || !to) return;

    const geo = new THREE.BufferGeometry().setFromPoints([from.pos, to.pos]);
    const line = new THREE.Line(geo, edgeMat.clone());
    edgeGroup.add(line);
    edgeLines.push({ line, from: fromId, to: toId });
  });

  /* ---- traveling signal particles ---- */
  const signalGeo = new THREE.SphereGeometry(0.4, 8, 6);
  const signalMat = new THREE.MeshBasicMaterial({ color: 0x8b9dff, transparent: true, opacity: 0.7 });
  const signals = [];
  const SIGNAL_COUNT = isMobile ? 12 : 24;

  for (let i = 0; i < SIGNAL_COUNT; i++) {
    const edge = EDGES[Math.floor(Math.random() * EDGES.length)];
    const from = nodeMap[edge[0]];
    const to = nodeMap[edge[1]];
    if (!from || !to) continue;

    const mesh = new THREE.Mesh(signalGeo, signalMat.clone());
    mesh.material.color.set(from.cfg.color);
    networkGroup.add(mesh);
    signals.push({
      mesh,
      from: from.pos,
      to: to.pos,
      t: Math.random(),
      speed: 0.15 + Math.random() * 0.2,
      edgeIdx: EDGES.indexOf(edge),
    });
  }

  /* ---- lights ---- */
  scene.add(new THREE.AmbientLight(0x404060, 0.8));
  const keyLight = new THREE.PointLight(0x8b9dff, 60, 200);
  keyLight.position.set(30, 20, 50);
  scene.add(keyLight);
  const fillLight = new THREE.PointLight(0xf5c56b, 30, 200);
  fillLight.position.set(-30, -20, 40);
  scene.add(fillLight);

  /* ---- fog for depth ---- */
  scene.fog = new THREE.FogExp2(0x0a0c12, 0.006);

  /* ---- interaction: raycaster ---- */
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let hoveredNode = null;
  let selectedNode = null;

  const allMeshes = Object.values(nodeMap).map(n => n.mesh);

  function updateCard(nodeEntry, clientX, clientY) {
    if (!nodeEntry) {
      card.classList.remove('is-on');
      return;
    }
    const d = nodeEntry.data;
    card.querySelector('[data-card-layer]').textContent = d.layer;
    card.querySelector('[data-card-layer]').className = 'ai-card__layer mono ai-card__layer--' + d.layer;
    card.querySelector('[data-card-title]').textContent = d.title;
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

    /* Position card near node but clamped to viewport */
    const cw = 320, ch = card.offsetHeight || 240;
    const x = Math.max(12, Math.min(clientX + 20, innerWidth - cw - 12));
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

    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObjects(allMeshes);

    if (hits.length > 0) {
      const hit = hits[0].object;
      if (hoveredNode !== hit) {
        /* Reset previous */
        if (hoveredNode) {
          hoveredNode.material.emissiveIntensity = hoveredNode.userData.baseEmissive;
          hoveredNode.scale.setScalar(hoveredNode.userData.baseScale);
        }
        hoveredNode = hit;
        hoveredNode.material.emissiveIntensity = 1.2;
        hoveredNode.scale.setScalar(hoveredNode.userData.baseScale * 1.4);
        canvas.style.cursor = 'pointer';

        /* Highlight connected edges */
        const nid = hit.userData.nodeData.id;
        edgeLines.forEach(el => {
          el.line.material.opacity = (el.from === nid || el.to === nid) ? 0.4 : 0.04;
        });
      }
      if (!selectedNode) {
        updateCard(
          Object.values(nodeMap).find(n => n.mesh === hit),
          e.clientX, e.clientY
        );
      }
    } else {
      if (hoveredNode && !selectedNode) {
        hoveredNode.material.emissiveIntensity = hoveredNode.userData.baseEmissive;
        hoveredNode.scale.setScalar(hoveredNode.userData.baseScale);
        hoveredNode = null;
        canvas.style.cursor = 'default';
        edgeLines.forEach(el => { el.line.material.opacity = 0.08; });
        card.classList.remove('is-on');
      }
    }
  });

  canvas.addEventListener('pointerdown', e => {
    if (hoveredNode) {
      if (selectedNode === hoveredNode) {
        /* Deselect */
        selectedNode.material.emissiveIntensity = selectedNode.userData.baseEmissive;
        selectedNode.scale.setScalar(selectedNode.userData.baseScale);
        selectedNode = null;
        card.classList.remove('is-on');
        edgeLines.forEach(el => { el.line.material.opacity = 0.08; });
      } else {
        if (selectedNode) {
          selectedNode.material.emissiveIntensity = selectedNode.userData.baseEmissive;
          selectedNode.scale.setScalar(selectedNode.userData.baseScale);
        }
        selectedNode = hoveredNode;
        /* Card stays pinned */
        const sp = projectToScreen(selectedNode.position);
        updateCard(
          Object.values(nodeMap).find(n => n.mesh === selectedNode),
          sp.x, sp.y
        );
      }
      /* Hide hint after first interaction */
      if (hint) hint.classList.add('is-hidden');
    } else {
      /* Click on empty space: deselect */
      if (selectedNode) {
        selectedNode.material.emissiveIntensity = selectedNode.userData.baseEmissive;
        selectedNode.scale.setScalar(selectedNode.userData.baseScale);
        selectedNode = null;
        card.classList.remove('is-on');
        edgeLines.forEach(el => { el.line.material.opacity = 0.08; });
      }
    }
  });

  /* ---- camera orbit & pointer parallax ---- */
  let targX = 0, targY = 0, camX = 0, camY = 0;
  addEventListener('pointermove', e => {
    targX = (e.clientX / innerWidth - 0.5);
    targY = (e.clientY / innerHeight - 0.5);
  }, { passive: true });

  /* ---- label sprites ---- */
  const labelCanvas = document.createElement('canvas');
  const labelCtx = labelCanvas.getContext('2d');
  labelCanvas.width = 256;
  labelCanvas.height = 64;

  function makeLabel(text, color) {
    labelCtx.clearRect(0, 0, 256, 64);
    labelCtx.font = '600 22px "Clash Display", system-ui, sans-serif';
    labelCtx.textAlign = 'center';
    labelCtx.textBaseline = 'middle';
    labelCtx.fillStyle = color;
    labelCtx.fillText(text, 128, 32);

    const tex = new THREE.CanvasTexture(labelCanvas);
    tex.needsUpdate = true;
    const spriteMat = new THREE.SpriteMaterial({ map: tex.clone(), transparent: true, opacity: 0.85, depthWrite: false });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(isMobile ? 10 : 14, isMobile ? 2.5 : 3.5, 1);
    return sprite;
  }

  Object.values(nodeMap).forEach(n => {
    const colors = { input: '#5ee29a', hidden: '#8b9dff', output: '#f5c56b' };
    const label = makeLabel(n.data.label, colors[n.data.layer]);
    label.position.copy(n.pos);
    label.position.y -= n.cfg.radius + (isMobile ? 3.2 : 4.2);
    networkGroup.add(label);
  });

  /* ---- render loop ---- */
  let running = false, raf = null;
  const clock = new THREE.Clock();

  const tick = () => {
    if (!running) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;

    /* Gentle rotation */
    networkGroup.rotation.y = Math.sin(t * 0.08) * 0.12;
    networkGroup.rotation.x = Math.cos(t * 0.06) * 0.04;

    /* Node breathing */
    Object.values(nodeMap).forEach((n, i) => {
      if (n.mesh !== hoveredNode && n.mesh !== selectedNode) {
        const breath = 1 + Math.sin(t * 1.2 + i * 0.7) * 0.08;
        n.mesh.scale.setScalar(n.cfg.radius * breath);
      }
    });

    /* Animate signal particles */
    signals.forEach(s => {
      s.t += s.speed * dt;
      if (s.t >= 1) {
        s.t = 0;
        /* Pick a new random edge */
        const edge = EDGES[Math.floor(Math.random() * EDGES.length)];
        const from = nodeMap[edge[0]];
        const to = nodeMap[edge[1]];
        if (from && to) {
          s.from = from.pos;
          s.to = to.pos;
          s.mesh.material.color.set(from.cfg.color);
        }
      }
      s.mesh.position.lerpVectors(s.from, s.to, s.t);
      s.mesh.material.opacity = Math.sin(s.t * Math.PI) * 0.7;
    });

    /* Camera parallax */
    camX += (targX - camX) * 0.03;
    camY += (targY - camY) * 0.03;
    camera.position.x = camX * 30;
    camera.position.y = -camY * 18;
    camera.lookAt(0, 0, 0);

    /* Update selected card position */
    if (selectedNode) {
      const sp = projectToScreen(selectedNode.position);
      const cw = 320, ch = card.offsetHeight || 240;
      const x = Math.max(12, Math.min(sp.x + 20, innerWidth - cw - 12));
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
