/* ==========================================================================
   NABHAN YUZQI — portfolio v2 · vanilla motion layer (no libraries)
   Spec: docs/Animation-Guide.md. Everything degrades to fully-visible
   content with JS off (html.no-js) or prefers-reduced-motion.
   ========================================================================== */
(function () {
  'use strict';

  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var FINE = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- scroll reveals ---------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.rv').forEach(function (el) { io.observe(el); });

  /* ---------- live WIB clock ---------- */
  var clock = document.querySelector('[data-clock]');
  if (clock) {
    var tick = function () {
      clock.textContent = 'Sampit, ID — ' + new Date().toLocaleTimeString('en-GB', {
        timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit'
      }) + ' WIB';
    };
    tick();
    setInterval(tick, 30000);
  }

  /* ---------- smart-hide nav ---------- */
  var nav = document.querySelector('[data-nav]');
  if (nav) {
    var lastY = window.scrollY;
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      if (y > 140 && y > lastY) nav.classList.add('is-hidden');
      else nav.classList.remove('is-hidden');
      lastY = y;
    }, { passive: true });
  }

  /* ---------- work index: hover preview floater ---------- */
  var preview = document.querySelector('[data-preview]');
  if (preview && FINE && !REDUCED) {
    var pimg = preview.querySelector('img');
    var px = 0, py = 0, tx = 0, ty = 0, raf = null;
    var loop = function () {
      px += (tx - px) * 0.18;
      py += (ty - py) * 0.18;
      preview.style.transform = 'translate(' + px + 'px,' + py + 'px)' +
        (preview.classList.contains('is-on') ? '' : ' scale(.94)');
      raf = (Math.abs(tx - px) > 0.5 || Math.abs(ty - py) > 0.5 || preview.classList.contains('is-on'))
        ? requestAnimationFrame(loop) : null;
    };
    document.querySelectorAll('[data-row]').forEach(function (row) {
      row.addEventListener('pointerenter', function () {
        var src = row.getAttribute('data-img');
        if (!src) return;
        pimg.src = src;
        preview.classList.add('is-on');
        if (!raf) raf = requestAnimationFrame(loop);
      });
      row.addEventListener('pointerleave', function () { preview.classList.remove('is-on'); });
      row.addEventListener('pointermove', function (e) {
        tx = Math.min(e.clientX + 24, window.innerWidth - 364);
        ty = Math.min(e.clientY - 100, window.innerHeight - 240);
      });
    });
    preview.style.left = '0';
    preview.style.top = '0';
  }

  /* ---------- Sampit route board: draw routes with scroll progress ---------- */
  var board = document.querySelector('[data-routes]');
  if (board && !REDUCED) {
    var routes = Array.prototype.map.call(board.querySelectorAll('[data-route]'), function (p) {
      var len = p.getTotalLength();
      p.style.strokeDasharray = len;
      p.style.strokeDashoffset = len;
      return { el: p, len: len };
    });
    var drawTick = null;
    var draw = function () {
      drawTick = null;
      var r = board.getBoundingClientRect();
      var vh = window.innerHeight;
      // 0 when board top hits 90% of viewport, 1 when board center passes 45%
      var prog = (vh * 0.9 - r.top) / (vh * 0.55);
      prog = Math.max(0, Math.min(1, prog));
      routes.forEach(function (rt, i) {
        var local = Math.max(0, Math.min(1, prog * 1.5 - i * 0.14));
        rt.el.style.strokeDashoffset = rt.len * (1 - local);
      });
    };
    window.addEventListener('scroll', function () {
      if (!drawTick) drawTick = requestAnimationFrame(draw);
    }, { passive: true });
    draw();
  }

  /* ---------- count-up numbers ---------- */
  if (!REDUCED) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        cio.unobserve(e.target);
        var el = e.target;
        var target = parseFloat(el.getAttribute('data-count'));
        var t0 = performance.now(), dur = 1200;
        var step = function (t) {
          var k = Math.min(1, (t - t0) / dur);
          k = 1 - Math.pow(1 - k, 3); // easeOutCubic
          el.textContent = Math.round(target * k).toLocaleString('en-US');
          if (k < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    }, { threshold: 0.6 });
    document.querySelectorAll('[data-count]').forEach(function (el) { cio.observe(el); });
  }

  /* ---------- showreel: only show if the video actually exists ---------- */
  var reel = document.querySelector('[data-reel]');
  var reelVideo = document.querySelector('[data-reel-video]');
  if (reel && reelVideo) {
    reelVideo.addEventListener('loadedmetadata', function () {
      reel.hidden = false;
      io.observe(reel.querySelectorAll('.rv')[0] || reel);
      reel.querySelectorAll('.rv').forEach(function (el) { io.observe(el); });
      if (!REDUCED) {
        new IntersectionObserver(function (es) {
          es.forEach(function (e) { e.isIntersecting ? reelVideo.play().catch(function(){}) : reelVideo.pause(); });
        }, { threshold: 0.25 }).observe(reelVideo);
      }
    });
    reelVideo.addEventListener('error', function () { reel.hidden = true; });
    reelVideo.preload = 'metadata';
    reelVideo.load();
  }

  /* ---------- case-study diagrams: draw on enter + traveling dot ---------- */
  document.querySelectorAll('.case-diagram svg').forEach(function (svg) {
    var lines = svg.querySelectorAll('.d-line');
    if (REDUCED) return;
    lines.forEach(function (p) {
      var len = p.getTotalLength();
      p.style.strokeDasharray = len;
      p.style.strokeDashoffset = len;
      p.style.transition = 'stroke-dashoffset 1.1s cubic-bezier(.22,1,.36,1)';
    });
    new IntersectionObserver(function (es, obs) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        obs.unobserve(svg);
        lines.forEach(function (p, i) {
          setTimeout(function () { p.style.strokeDashoffset = 0; }, i * 140);
        });
        var dot = svg.querySelector('.d-dot');
        var flow = svg.querySelector('.d-flow');
        if (dot && flow) {
          var len = flow.getTotalLength(), t0 = performance.now();
          var travel = function (t) {
            var k = ((t - t0) / 2400) % 1;
            var pt = flow.getPointAtLength(k * len);
            dot.setAttribute('cx', pt.x);
            dot.setAttribute('cy', pt.y);
            requestAnimationFrame(travel);
          };
          requestAnimationFrame(travel);
        }
      });
    }, { threshold: 0.3 }).observe(svg);
  });

  /* ---------- graceful fallback for missing/broken images ---------- */
  function imageFallback(img) {
    var wrap = img.closest('.case-screens figure, .preview');
    if (!wrap) { img.style.display = 'none'; return; }
    if (wrap.classList.contains('preview')) return;
    var cap = wrap.querySelector('figcaption');
    wrap.classList.add('media-missing');
    wrap.setAttribute('data-label', cap ? cap.textContent.trim() : '—');
    img.remove();
  }
  document.addEventListener('error', function (e) {
    if (e.target && e.target.tagName === 'IMG') imageFallback(e.target);
  }, true);
})();
