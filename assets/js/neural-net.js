import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js';

const canvas = document.querySelector('[data-neural-gl]');
const card = document.querySelector('[data-ai-card]');
const hint = document.querySelector('[data-ai-hint]');
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---- node data ---- */
const NODES = [
  /* Input layer */
  { id: 'sampit', layer: 'input', label: 'Sampit', title: 'Sampit, Indonesia', desc: 'A river town in Central Kalimantan — where production software ships to Perth, Jakarta, and the cloud.', tags: ['Origin', 'Remote'] },
  { id: 'bangkit', layer: 'input', label: 'Bangkit', title: 'Bangkit Academy', desc: 'Google\'s intensive academy program — Android/Kotlin capstone (C23-PS321), ML foundations, soft-skills.', tags: ['Google', 'ML', 'Android'], link: 'https://github.com/nabhanyuzqi1' },
  { id: 'years', layer: 'input', label: '4+ Years', title: '4+ Years Shipping', desc: 'Shipping production software since 2022: from Django EdTech to Flutter platforms to Gemini-powered dashboards.', tags: ['Experience'] },
  { id: 'founder', layer: 'input', label: 'Founder', title: 'PT Tuntas Kilat', desc: 'Founded and running an on-demand services startup end-to-end: product strategy, engineering, operations.', tags: ['Startup', 'Leadership'] },
  
  /* Hidden layer 2 — projects */
  { id: 'tuntaskilat', layer: 'hidden', label: 'TuntasKilat', title: 'Tuntas Kilat Platform', desc: '3-app on-demand cleaning platform: Customer books, Crew executes, Admin oversees. Atomic Firestore.', tags: ['Flutter', 'Firebase'], link: 'https://github.com/nabhanyuzqi1/tuntaskilat' },
  { id: 'kontrack', layer: 'hidden', label: 'Kontrack', title: 'Kontrack Dashboard', desc: 'Contract & finance dashboard for PT PEB — Gemini reads the contracts, humans confirm. Serverless.', tags: ['SaaS', 'Gemini API', 'Firebase'], link: 'https://kontrack.web.app/' },
  { id: 'mclearance', layer: 'hidden', label: 'M-Clearance', title: 'M-Clearance App', desc: 'Immigration clearance workflow digitized — submission, verification, approval. Full audit trail.', tags: ['GovTech', 'Flutter'], link: 'https://github.com/nabhanyuzqi1/m-clearance-imigrasi' },
  { id: 'orah', layer: 'hidden', label: 'Orah Cafe', title: 'Orah Cafe', desc: 'Cafe website for a Perth Airport venue — menu showcase, SEO, local search presence.', tags: ['Web', 'Australia', 'SEO'], link: 'https://orah-cafe-website.web.app' },
  { id: 'tekka', layer: 'hidden', label: 'Tekka POS', title: 'Tekka Cafe OS', desc: 'Multi-tenant ordering & POS SaaS — one deployment serving many cafes with isolated data.', tags: ['SaaS', 'Multi-tenant', 'PHP'] },
  { id: 'manob', layer: 'hidden', label: 'Manob', title: 'Manob Production', desc: 'Creative agency site + academy app in Kotlin Multiplatform. Shared brand system across web & mobile.', tags: ['Agency', 'KMP', 'Next.js'], link: 'https://manobproduction.com' },

  /* Learning frontier */
  { id: 'web3', layer: 'hidden', label: 'Web3', title: 'Web3 & Blockchain', desc: 'Currently exploring smart contracts (Solidity), decentralized applications, tokenomics, and building my journey in Web3.', tags: ['Learning', 'Solidity', 'DApps'] },
  { id: 'ml', layer: 'hidden', label: 'ML / AI Repos', title: 'Machine Learning', desc: 'My deep dive into ML, neural networks, and AI architectures. See my GitHub repos for practical experiments and model training.', tags: ['TensorFlow', 'Gemini', 'PyTorch', 'GitHub'], link: 'https://github.com/nabhanyuzqi1' },

  /* Output layer */
  { id: 'apps', layer: 'output', label: 'Production', title: 'Production Apps', desc: '7+ live client platforms running in production — from Flutter mobile apps to Next.js web platforms.', tags: ['Shipped', 'Production'] },
  { id: 'ai-out', layer: 'output', label: 'Applied AI', title: 'AI Integration', desc: 'Practical AI that solves real problems: contract extraction, structured data from documents.', tags: ['Gemini', 'Practical AI'] },
  { id: 'iot-out', layer: 'output', label: 'Edge IoT', title: 'IoT Systems', desc: 'Hardware + cloud connected systems: soil sensors, automated pumps, remote dashboards.', tags: ['Hardware', 'Cloud'] },
];

const EDGES = [
  ['sampit', 'flutter'], ['sampit', 'firebase'], ['sampit', 'iot'],
  ['bangkit', 'ml'], ['bangkit', 'gemini'],
  ['years', 'nextjs'], ['years', 'flutter'], ['years', 'firebase'],
  ['founder', 'flutter'], ['founder', 'iot'], ['founder', 'firebase'],
  ['flutter', 'tuntaskilat'], ['flutter', 'mclearance'],
  ['firebase', 'tuntaskilat'], ['firebase', 'kontrack'], ['firebase', 'mclearance'],
  ['gemini', 'kontrack'], ['nextjs', 'orah'], ['nextjs', 'manob'],
  ['kontrack', 'ml'], ['kontrack', 'web3'], ['tuntaskilat', 'web3'],
  ['tuntaskilat', 'apps'], ['kontrack', 'apps'], ['mclearance', 'apps'],
  ['orah', 'apps'], ['manob', 'apps'],
  ['ml', 'ai-out'], ['web3', 'apps'], ['iot', 'iot-out'], ['gemini', 'ai-out']
];

/* Make sure all referenced IDs exist, filter broken edges */
const nodeIds = new Set(NODES.map(n => n.id));
const validEdges = EDGES.filter(e => nodeIds.has(e[0]) && nodeIds.has(e[1]));

function init(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x02040a, 1);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x02040a, 0.003);

  const camera = new THREE.PerspectiveCamera(45, 1, 1, 1000);
  camera.position.set(0, 30, 800);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.maxDistance = 400;
  controls.minDistance = 20;

  // Lighting
  const ambient = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambient);
  const pointLight = new THREE.PointLight(0x00ffff, 2, 300);
  scene.add(pointLight);

  // Group for the network
  const networkGroup = new THREE.Group();
  scene.add(networkGroup);

  const nodeMeshes = [];
  const nodeMap = {};

  const colors = {
    input: 0x00ffaa,
    hidden: 0x0088ff,
    output: 0xffaa00
  };

  function createGlowTexture(colorHex) {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    const r = (colorHex >> 16) & 255;
    const g = (colorHex >> 8) & 255;
    const b = colorHex & 255;
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, `rgba(255,255,255,0.8)`);
    gradient.addColorStop(0.2, `rgba(${r},${g},${b},0.8)`);
    gradient.addColorStop(0.5, `rgba(${r},${g},${b},0.3)`);
    gradient.addColorStop(1, `rgba(${r},${g},${b},0)`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(canvas);
  }

  // Create Nodes

  NODES.forEach((n, i) => {
    // Distribute nodes on the surface of a brain-like ellipsoid
    const theta = (i / NODES.length) * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);
    
    let x = 150 * Math.sin(phi) * Math.cos(theta);
    let y = 90 * Math.sin(phi) * Math.sin(theta);
    let z = 110 * Math.cos(phi);
    
    // Create the longitudinal fissure (split down the middle)
    if (Math.abs(x) < 20) {
      x = x < 0 ? x - 20 : x + 20;
    }

    const color = colors[n.layer] || 0x00ffff;

    const group = new THREE.Group();
    group.position.set(x, y, z);
    group.userData = { id: n.id, data: n, basePos: new THREE.Vector3(x, y, z), random: Math.random() * 100 };

    // Outer glow shell - highly visible Sprite
    const tex = createGlowTexture(color);
    const spriteMat = new THREE.SpriteMaterial({
      map: tex,
      color: 0xffffff,
      transparent: true,
      opacity: 1.0,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(20, 20, 1);
    group.add(sprite);

    // Inner bright core
    const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const coreMesh = new THREE.Mesh(new THREE.SphereGeometry(2, 16, 16), coreMat);
    group.add(coreMesh);

    networkGroup.add(group);
    nodeMeshes.push(group);
    nodeMap[n.id] = group;
  });

  // Create Edges
  const edgeMat = new THREE.LineBasicMaterial({
    color: 0x00ffff,
    transparent: true,
    opacity: 0.3,
    blending: THREE.AdditiveBlending
  });

  const lines = [];
  validEdges.forEach(e => {
    const startNode = nodeMap[e[0]];
    const endNode = nodeMap[e[1]];
    
    // Create a curved line
    const v1 = startNode.position;
    const v2 = endNode.position;
    const dist = v1.distanceTo(v2);
    // Control point pulled towards center
    const control = v1.clone().add(v2).multiplyScalar(0.5).normalize().multiplyScalar(dist * 0.3);

    // Create 3 lines per edge for thicker electricity
    for (let i = 0; i < 3; i++) {
      const curve = new THREE.QuadraticBezierCurve3(v1, control, v2);
      const points = curve.getPoints(20);
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(lineGeo, edgeMat);
      networkGroup.add(line);
      lines.push({ line, v1, v2, startNode, endNode, control });
    }
  });

  // Background particles (Structured into a brain shape)
  const dustGeo = new THREE.BufferGeometry();
  const dustCount = REDUCED ? 500 : 3000;
  const dustPos = [];
  
  while(dustPos.length < dustCount * 3) {
    const x = (Math.random() - 0.5) * 320;
    const y = (Math.random() - 0.5) * 200;
    const z = (Math.random() - 0.5) * 240;
    
    // Brain shape constraint (ellipsoid)
    if ((x/160)**2 + (y/100)**2 + (z/120)**2 < 1) {
      // Fissure gap down the X axis
      if (Math.abs(x) > 15) {
        dustPos.push(x, y, z);
      }
    }
  }
  
  dustGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(dustPos), 3));
  const dustMat = new THREE.PointsMaterial({
    color: 0x00ffff,
    size: 2.0, // increased size slightly
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const dust = new THREE.Points(dustGeo, dustMat);
  scene.add(dust);

  // Interaction
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2(-999, -999);
  let hovered = null;
  let selected = null;
  let targetOrbit = new THREE.Vector3(0, 0, 0);
  
  let targetCameraPos = new THREE.Vector3();
  let animatingCamera = false;
  const baseCameraPos = new THREE.Vector3(0, 30, 200);
  
  let introAnimating = true;
  let introProgress = 0;
  const introStartPos = new THREE.Vector3(0, 30, 800);

  window.addEventListener('mousemove', e => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  window.addEventListener('click', () => {
    if (introAnimating) {
      introAnimating = false;
      dustMat.opacity = 0.05;
      camera.position.copy(baseCameraPos);
    }
    if (hovered) {
      selected = hovered;
      showCard(selected.userData.data);
      // Pan camera slightly closer to node
      targetOrbit.copy(selected.position);
      const offset = new THREE.Vector3(20, 10, 80);
      targetCameraPos.copy(selected.position).add(offset);
      animatingCamera = true;
      if (hint) hint.style.display = 'none';
    } else {
      selected = null;
      hideCard();
      targetOrbit.set(0,0,0);
      targetCameraPos.copy(baseCameraPos);
      animatingCamera = true;
    }
  });

  const typeWriter = (el, text, speed=10) => {
    el.textContent = '';
    let i = 0;
    const type = () => {
      if(i < text.length) {
        el.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    };
    type();
  };

  const showCard = (data) => {
    const layer = card.querySelector('[data-card-layer]');
    const title = card.querySelector('[data-card-title]');
    const desc = card.querySelector('[data-card-desc]');
    const tags = card.querySelector('[data-card-tags]');
    const link = card.querySelector('[data-card-link]');

    layer.textContent = `// NODE: ${data.layer}`;
    typeWriter(title, data.title);
    desc.textContent = data.desc; // skip typing for long text to avoid lag
    
    tags.innerHTML = data.tags.map(t => `<span>${t}</span>`).join('');
    
    if (data.link) {
      link.href = data.link;
      link.style.display = 'inline-flex';
    } else {
      link.style.display = 'none';
    }

    card.classList.add('is-active');
  };

  const hideCard = () => {
    card.classList.remove('is-active');
  };

  const sizeToViewport = () => {
    const r = canvas.parentElement.getBoundingClientRect();
    renderer.setSize(r.width, r.height, false);
    camera.aspect = r.width / r.height;
    camera.updateProjectionMatrix();
  };
  sizeToViewport();

  const clock = new THREE.Clock();
  let raf;
  let running = false;

  const tick = () => {
    if (!running) return;
    const delta = clock.getDelta();
    const time = clock.getElapsedTime();

    if (introAnimating) {
      introProgress += delta * 0.4;
      if (introProgress >= 1) {
        introProgress = 1;
        introAnimating = false;
        camera.position.copy(baseCameraPos);
      } else {
        const ease = 1 - Math.pow(1 - introProgress, 3);
        camera.position.lerpVectors(introStartPos, baseCameraPos, ease);
        dustMat.opacity = 0.5 * (1 - ease) + 0.05 * ease;
      }
      controls.update();
    } else if (animatingCamera) {
      camera.position.lerp(targetCameraPos, 0.04);
      controls.target.lerp(targetOrbit, 0.04);
      camera.lookAt(controls.target);
      if (camera.position.distanceTo(targetCameraPos) < 1.5 && controls.target.distanceTo(targetOrbit) < 1.5) {
        animatingCamera = false;
      }
    } else {
      controls.target.lerp(targetOrbit, 0.05);
      controls.update();
    }

    // Rotate network slowly
    if (!selected) {
      networkGroup.rotation.y += delta * 0.05;
      networkGroup.rotation.x += delta * 0.02;
    }

    // Floating animation and Focus States
    nodeMeshes.forEach(group => {
      const ud = group.userData;
      group.position.y = ud.basePos.y + Math.sin(time * 2 + ud.random) * 3;
      
      const isSelected = selected === group;
      const isHovered = hovered === group;
      
      // Determine if this node is connected to the selected node
      let isConnectedToSelected = false;
      if (selected) {
        if (isSelected) {
          isConnectedToSelected = true;
        } else {
          for (let l of lines) {
            if ((l.startNode === selected && l.endNode === group) || 
                (l.endNode === selected && l.startNode === group)) {
              isConnectedToSelected = true;
              break;
            }
          }
        }
      }

      const sprite = group.children[0];
      const core = group.children[1]; // Inner core

      if (selected) {
        // A node is selected: dim everything not connected
        if (isConnectedToSelected) {
          sprite.scale.lerp(new THREE.Vector3(30, 30, 1), 0.1);
          sprite.material.opacity = isSelected ? 1.0 : 0.8;
          core.material.transparent = false;
          core.material.opacity = 1.0;
        } else {
          sprite.scale.lerp(new THREE.Vector3(10, 10, 1), 0.1);
          sprite.material.opacity = 0.05;
          core.material.transparent = true;
          core.material.opacity = 0.1;
        }
      } else {
        // No node is selected: standard hover states
        if (isHovered) {
          sprite.scale.set(30, 30, 1);
          sprite.material.opacity = 1.0;
        } else {
          sprite.scale.lerp(new THREE.Vector3(20, 20, 1), 0.1);
          sprite.material.opacity = 0.8;
        }
        core.material.transparent = false;
        core.material.opacity = 1.0;
      }
    });

    // Update curved lines as electricity
    lines.forEach(l => {
      const positions = l.line.geometry.attributes.position.array;
      const curve = new THREE.QuadraticBezierCurve3(l.startNode.position, l.control, l.endNode.position);
      const points = curve.getPoints(20);
      
      let isHighlighted = false;
      let isDimmed = false;
      if (selected) {
        if (l.startNode === selected || l.endNode === selected) {
          isHighlighted = true;
        } else {
          isDimmed = true;
        }
      }
      
      const jitterAmount = isHighlighted ? 4.0 : 1.5;
      
      for(let i=0; i<points.length; i++){
        let offset = new THREE.Vector3(0,0,0);
        // Add random electric jitter to inner points
        if (i > 0 && i < points.length - 1 && time % 0.1 > 0.02) {
          offset.set(
            (Math.random() - 0.5) * jitterAmount,
            (Math.random() - 0.5) * jitterAmount,
            (Math.random() - 0.5) * jitterAmount
          );
        }
        positions[i*3] = points[i].x + offset.x;
        positions[i*3+1] = points[i].y + offset.y;
        positions[i*3+2] = points[i].z + offset.z;
      }
      l.line.geometry.attributes.position.needsUpdate = true;
      
      // Highlight electric arcs connected to selected
      if (isHighlighted) {
        l.line.material.opacity = 0.9;
        l.line.material.color.setHex(0xffffff); // Bright white arc
      } else if (isDimmed) {
        l.line.material.opacity = 0.02; // Heavily dim non-connected lines
        l.line.material.color.setHex(0x00ffff);
      } else {
        l.line.material.opacity = 0.3;
        l.line.material.color.setHex(0x00ffff);
      }
    });

    // Raycast
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(nodeMeshes, true);
    
    if (intersects.length > 0) {
      // Find the group (parent of the intersected mesh)
      let obj = intersects[0].object;
      while(obj && !obj.userData.id) obj = obj.parent;
      
      if (obj && obj !== hovered) {
        hovered = obj;
        document.body.style.cursor = 'pointer';
      }
    } else {
      if (hovered) {
        hovered = null;
        document.body.style.cursor = 'auto';
      }
    }

    // Position card in 2D space tracking the selected node
    if (selected && card.classList.contains('is-active')) {
      const wp = new THREE.Vector3();
      selected.getWorldPosition(wp);
      wp.project(camera);
      
      const x = (wp.x * .5 + .5) * window.innerWidth;
      const y = (wp.y * -.5 + .5) * window.innerHeight;
      
      // Keep inside bounds
      const cw = 340, ch = card.offsetHeight || 280;
      const cx = Math.max(20, Math.min(x + 40, window.innerWidth - cw - 20));
      const cy = Math.max(20, Math.min(y - ch / 2, window.innerHeight - ch - 20));
      
      card.style.left = cx + 'px';
      card.style.top = cy + 'px';
    }

    renderer.render(scene, camera);
    raf = requestAnimationFrame(tick);
  };

  const start = () => { if (!running) { running = true; clock.getDelta(); raf = requestAnimationFrame(tick); } };
  const stop = () => { running = false; if (raf) cancelAnimationFrame(raf); };

  let rsz;
  window.addEventListener('resize', () => { clearTimeout(rsz); rsz = setTimeout(sizeToViewport, 150); });
  start();
}

if (canvas && !REDUCED) {
  try { init(canvas); }
  catch (e) { console.warn('[neural-net] disabled:', e); }
}
