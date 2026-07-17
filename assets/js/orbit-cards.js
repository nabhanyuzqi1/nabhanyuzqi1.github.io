/* ==========================================================================
   Work orbit — 3D carousel of real production screenshots, above the work
   index. Cards orbit a tilted ellipse; scrolling through the section slides
   the whole orbit from the right toward the lower-left.
   Transparent renderer (no post-processing) so the page shows through.
   Exits quietly on reduced-motion / no-WebGL / error → band collapses.
   ========================================================================== */
import * as THREE from 'three';

const canvas = document.querySelector('[data-orbit-gl]');
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

if (canvas && !REDUCED) {
  try {
    init(canvas);
  } catch (e) {
    console.warn('[orbit-cards] disabled:', e);
    const band = canvas.closest('.work-orbit');
    if (band) band.remove();
  }
}

function init(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 1, 300);
  camera.position.z = 62;

  let vw = 100, vh = 50;
  const size = () => {
    const r = canvas.parentElement.getBoundingClientRect();
    renderer.setSize(r.width, r.height, false);
    camera.aspect = r.width / r.height;
    camera.updateProjectionMatrix();
    vh = 2 * Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
    vw = vh * camera.aspect;
  };
  size();

  const isMobile = innerWidth < 700;
  const group = new THREE.Group();
  group.rotation.x = -0.3;
  group.rotation.z = 0.06;
  scene.add(group);

  const SRCS = [
    '/assets/img/sites/orah-cafe.jpg',
    '/assets/img/sites/kontrack.jpg',
    '/assets/img/sites/query-roastery.jpg',
    '/assets/img/sites/isu-indonesia.jpg',
    '/assets/img/sites/manob-production.jpg',
  ];
  const cardW = isMobile ? 13 : 20;
  const loader = new THREE.TextureLoader();
  SRCS.forEach(function (src, i) {
    loader.load(src, function (tex) {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);
      const card = new THREE.Mesh(
        new THREE.PlaneGeometry(cardW, cardW * 0.625),
        new THREE.MeshBasicMaterial({ map: tex })
      );
      card.userData.i = i;
      group.add(card);
    });
  });

  /* pointer tilt (adds parallax without hijacking the page) */
  let tx = 0, ty = 0, cx = 0, cy = 0;
  addEventListener('pointermove', function (e) {
    tx = (e.clientX / innerWidth - 0.5);
    ty = (e.clientY / innerHeight - 0.5);
  }, { passive: true });

  let running = false, raf = null;
  const clock = new THREE.Clock();
  let t = 0;

  const tick = function () {
    if (!running) return;
    t += Math.min(clock.getDelta(), 0.05);

    // section scroll progress: 0 as the band enters, 1 as it leaves
    const r = canvas.getBoundingClientRect();
    const prog = Math.max(0, Math.min(1, (innerHeight - r.top) / (innerHeight + r.height)));

    // slide from right → lower-left as you scroll through
    group.position.x = vw * 0.18 - prog * vw * 0.36;
    group.position.y = -2 + (prog - 0.5) * -vh * 0.22;

    cx += (tx - cx) * 0.05;
    cy += (ty - cy) * 0.05;
    camera.position.x = cx * 8;
    camera.position.y = -cy * 5;
    camera.lookAt(0, 0, 0);

    const rx = isMobile ? 15 : 26, rz = isMobile ? 9 : 13;
    group.children.forEach(function (c) {
      const th = c.userData.i * (Math.PI * 2 / SRCS.length) + t * 0.28;
      c.position.set(Math.cos(th) * rx, Math.sin(t * 0.6 + c.userData.i * 1.7) * 1.2, Math.sin(th) * rz);
      c.quaternion.copy(camera.quaternion); // billboard — screenshots stay readable
      c.rotation.z += Math.sin(t * 0.5 + c.userData.i) * 0.05;
      const depth = (Math.sin(th) + 1) / 2;
      c.material.color.setScalar(0.55 + depth * 0.45); // back cards recede
      c.renderOrder = depth; // draw back-to-front for correct overlap feel
    });

    renderer.render(scene, camera);
    raf = requestAnimationFrame(tick);
  };
  const start = function () { if (!running) { running = true; clock.getDelta(); raf = requestAnimationFrame(tick); } };
  const stop = function () { running = false; if (raf) cancelAnimationFrame(raf); };

  new IntersectionObserver(function (es) {
    (es[0].isIntersecting && !document.hidden) ? start() : stop();
  }, { rootMargin: '80px' }).observe(canvas);
  document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });

  let rsz;
  addEventListener('resize', function () { clearTimeout(rsz); rsz = setTimeout(size, 150); });
}
