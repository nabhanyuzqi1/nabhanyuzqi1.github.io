/* ==========================================================================
   NABHAN YUZQI — PORTFOLIO OS · motion layer
   Implements docs/Animation-Guide.md scenes S0–S8 + case-study scenes.
   Rules: transform/opacity/filter only · all motion inside matchMedia ·
   CSS guarantees a readable page when JS is off or motion is reduced.
   ========================================================================== */
(function () {
  'use strict';

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    // CDN failed — fall back to the fully-visible no-js styling.
    document.documentElement.classList.replace('js', 'no-js');
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  var mm = gsap.matchMedia();
  var FINE_POINTER = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- graceful fallback for missing/broken images ---------- */
  function imageFallback(img) {
    var wrap = img.closest('.site-card__media, .case-screens figure, .work-card__media');
    if (!wrap) return;
    var card = img.closest('.site-card, .work-card, figure');
    var nameEl = card && card.querySelector('.site-card__name, .work-card__title, figcaption');
    wrap.classList.add('media-missing');
    wrap.setAttribute('data-label', nameEl ? nameEl.textContent.trim() : '—');
    img.remove();
  }
  document.addEventListener('error', function (e) {
    if (e.target && e.target.tagName === 'IMG') imageFallback(e.target);
  }, true);
  document.querySelectorAll('img').forEach(function (img) {
    if (img.complete && img.naturalWidth === 0) imageFallback(img);
  });

  /* ---------- text splitting helpers ---------- */
  function splitLines(el) {
    // Hero title ships pre-split (.line > span). Other titles get one mask per element.
    if (el.querySelector('.line')) return Array.prototype.slice.call(el.querySelectorAll('.line > span'));
    var html = el.innerHTML.split(/<br\s*\/?>/i);
    el.innerHTML = html.map(function (line) {
      return '<span class="line" style="display:block;overflow:clip"><span style="display:inline-block">' + line + '</span></span>';
    }).join('');
    return Array.prototype.slice.call(el.querySelectorAll('.line > span'));
  }

  function splitWords(el) {
    var words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map(function (w) {
      return '<span class="word">' + w + '</span>';
    }).join(' ');
    return Array.prototype.slice.call(el.querySelectorAll('.word'));
  }

  /* ---------- reduced-motion branch: reveal everything, no scenes ---------- */
  mm.add('(prefers-reduced-motion: reduce)', function () {
    gsap.set('[data-reveal], [data-reveal-group] > *, .work-card, .timeline__item', { clearProps: 'all', opacity: 1 });
    document.querySelectorAll('[data-split-lines]').forEach(function (el) { el.style.visibility = 'visible'; });
  });

  /* ---------- full-motion branch ---------- */
  mm.add('(prefers-reduced-motion: no-preference)', function () {

    /* ----- S0 · preloader ----- */
    var preloader = document.querySelector('[data-preloader]');
    var seen = false;
    try { seen = sessionStorage.getItem('seenIntro') === '1'; } catch (e) {}
    var introDelay = 0;

    if (preloader && !seen) {
      introDelay = 1.15;
      try { sessionStorage.setItem('seenIntro', '1'); } catch (e) {}
      var count = { v: 0 };
      var countEl = preloader.querySelector('[data-preloader-count]');
      gsap.timeline()
        .to(count, {
          v: 100, duration: 0.9, ease: 'power2.inOut',
          onUpdate: function () { if (countEl) countEl.textContent = Math.round(count.v); }
        })
        .to(preloader, {
          yPercent: -100, duration: 0.5, ease: 'power4.inOut',
          onComplete: function () { preloader.style.display = 'none'; }
        });
    } else if (preloader) {
      preloader.style.display = 'none';
    }

    /* ----- S1 · hero ----- */
    var heroTitle = document.querySelector('.hero__title[data-split-lines]');
    if (heroTitle) {
      var heroLines = splitLines(heroTitle);
      heroTitle.style.visibility = 'visible';
      gsap.fromTo(heroLines,
        { yPercent: 110, filter: 'blur(8px)' },
        { yPercent: 0, filter: 'blur(0px)', duration: 1.1, ease: 'power4.out', stagger: 0.08, delay: introDelay + 0.2 }
      );
      gsap.fromTo('.hero [data-reveal]',
        { y: 24, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.7, ease: 'power3.out', stagger: 0.12, delay: introDelay + 0.6 }
      );
    }

    var cue = document.querySelector('[data-scroll-cue]');
    if (cue) {
      var cueTween = gsap.to(cue, { y: 12, duration: 1.6, ease: 'sine.inOut', repeat: -1, yoyo: true });
      var hideCue = function () {
        if (window.scrollY > 40) {
          cueTween.kill();
          gsap.to(cue, { autoAlpha: 0, duration: 0.4 });
          window.removeEventListener('scroll', hideCue);
        }
      };
      window.addEventListener('scroll', hideCue, { passive: true });
    }

    /* ----- generic reveals (any section, once) ----- */
    document.querySelectorAll('main [data-reveal]').forEach(function (el) {
      if (el.closest('.hero')) return;
      gsap.fromTo(el,
        { y: 24, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 82%', once: true } }
      );
    });

    document.querySelectorAll('[data-reveal-group]').forEach(function (group) {
      gsap.fromTo(group.children,
        { y: 20, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.6, ease: 'power3.out', stagger: 0.09,
          scrollTrigger: { trigger: group, start: 'top 82%', once: true } }
      );
    });

    document.querySelectorAll('[data-split-lines]:not(.hero__title)').forEach(function (el) {
      var lines = splitLines(el);
      el.style.visibility = 'visible';
      gsap.fromTo(lines,
        { yPercent: 110 },
        { yPercent: 0, duration: 1, ease: 'power4.out', stagger: 0.08,
          scrollTrigger: { trigger: el, start: 'top 85%', once: true } }
      );
    });

    /* ----- S2 · who I am (pinned word scrub) ----- */
    var whoPin = document.querySelector('[data-who-pin]');
    var whoText = document.querySelector('[data-split-words]');
    if (whoPin && whoText && window.innerWidth > 900) {
      var words = splitWords(whoText);
      gsap.set(words, { opacity: 0.25 });
      var whoTl = gsap.timeline({
        scrollTrigger: { trigger: whoPin, start: 'top top', end: '+=150%', pin: true, scrub: 0.8 }
      });
      whoTl.fromTo('[data-who-frame]', { scale: 1.06, y: 30 }, { scale: 1, y: -30, ease: 'none' }, 0)
           .to(words, { opacity: 1, stagger: 0.02, ease: 'none' }, 0);
    } else if (whoText) {
      gsap.fromTo(whoText, { autoAlpha: 0, y: 24 }, {
        autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: whoText, start: 'top 80%', once: true }
      });
    }

    /* ----- S3 · how I think (pinned card swap) ----- */
    var thinkPin = document.querySelector('[data-think-pin]');
    var thinkCards = gsap.utils.toArray('[data-think-card]');
    if (thinkPin && thinkCards.length === 3 && window.innerWidth > 900) {
      var thinkTl = gsap.timeline({
        scrollTrigger: { trigger: thinkPin, start: 'top top', end: '+=300%', pin: true, scrub: 0.8 }
      });
      thinkCards.forEach(function (card, i) {
        if (i === 0) return;
        var prev = thinkCards[i - 1];
        thinkTl
          .to(prev, { xPercent: -12, autoAlpha: 0, scale: 0.94, filter: 'blur(6px)', duration: 1, ease: 'power3.inOut' }, i)
          .fromTo(card,
            { xPercent: 12, autoAlpha: 0, scale: 0.96, filter: 'blur(6px)' },
            { xPercent: 0, autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 1, ease: 'power3.inOut' }, i + 0.15);
      });
      gsap.to('[data-think-rail]', {
        scaleY: 1, ease: 'none',
        scrollTrigger: { trigger: thinkPin, start: 'top top', end: '+=300%', scrub: 0.8 }
      });
    } else if (thinkCards.length) {
      thinkCards.forEach(function (card) {
        gsap.set(card, { position: 'relative', visibility: 'visible' });
        gsap.fromTo(card, { autoAlpha: 0, y: 32 }, {
          autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 82%', once: true }
        });
      });
      gsap.set('[data-think-rail]', { scaleY: 1 });
      var stage = document.querySelector('.think__stage');
      if (stage) stage.style.minHeight = '0';
    }

    /* ----- S4 · work cards ----- */
    gsap.utils.toArray('.work-card').forEach(function (card) {
      var media = card.querySelector('.work-card__media');
      var img = card.querySelector('.work-card__media img');
      var tl = gsap.timeline({
        scrollTrigger: { trigger: card, start: 'top 75%', once: true }
      });
      tl.fromTo(card, { autoAlpha: 0, y: 48 }, { autoAlpha: 1, y: 0, duration: 1, ease: 'power4.out' });
      if (media && img) {
        tl.fromTo(media, { clipPath: 'inset(12% 12% 12% 12%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'power4.out' }, 0.12)
          .fromTo(img, { scale: 1.15 }, { scale: 1, duration: 1.2, ease: 'power4.out' }, 0.12);
      }
    });

    /* hover tilt (fine pointers only) */
    if (FINE_POINTER) {
      document.querySelectorAll('[data-tilt]').forEach(function (card) {
        var bounds;
        card.addEventListener('pointerenter', function () { bounds = card.getBoundingClientRect(); });
        card.addEventListener('pointermove', function (e) {
          if (!bounds) bounds = card.getBoundingClientRect();
          var px = (e.clientX - bounds.left) / bounds.width - 0.5;
          var py = (e.clientY - bounds.top) / bounds.height - 0.5;
          gsap.to(card, { rotateY: px * 6, rotateX: -py * 6, transformPerspective: 900, duration: 0.4, ease: 'power2.out' });
        });
        card.addEventListener('pointerleave', function () {
          gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.6, ease: 'power3.out' });
        });
      });
    }

    /* ----- S5 · sites gallery counter-scroll ----- */
    var sitesSection = document.querySelector('[data-scene="s5"]');
    if (sitesSection) {
      var row1 = sitesSection.querySelector('[data-sites-row="1"]');
      var row2 = sitesSection.querySelector('[data-sites-row="2"]');
      if (row1) gsap.fromTo(row1, { xPercent: 0 }, {
        xPercent: -14, ease: 'none',
        scrollTrigger: { trigger: sitesSection, start: 'top bottom', end: 'bottom top', scrub: 0.6 }
      });
      if (row2) gsap.fromTo(row2, { xPercent: -14 }, {
        xPercent: 0, ease: 'none',
        scrollTrigger: { trigger: sitesSection, start: 'top bottom', end: 'bottom top', scrub: 0.6 }
      });
    }

    /* ----- S6 · skills constellation ----- */
    var constellation = document.querySelector('[data-constellation]');
    if (constellation) {
      var edges = constellation.querySelectorAll('.edge');
      var nodes = constellation.querySelectorAll('.node');
      edges.forEach(function (edge) {
        var len = edge.getTotalLength();
        edge.style.strokeDasharray = len;
        edge.style.strokeDashoffset = len;
      });
      gsap.timeline({
        scrollTrigger: { trigger: constellation, start: 'top 70%', once: true }
      })
        .to(edges, { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut', stagger: 0.05 })
        .fromTo(nodes,
          { scale: 0, autoAlpha: 0, transformOrigin: '50% 50%' },
          { scale: 1, autoAlpha: 1, duration: 0.6, ease: 'back.out(1.7)', stagger: 0.04 }, 0.4);
    }

    /* ----- S7 · timeline ----- */
    var timelineFill = document.querySelector('[data-timeline-fill]');
    if (timelineFill) {
      gsap.to(timelineFill, {
        scaleY: 1, ease: 'none',
        scrollTrigger: { trigger: '.timeline', start: 'top 75%', end: 'bottom 60%', scrub: 0.6 }
      });
    }
    gsap.utils.toArray('.timeline__item').forEach(function (item, i) {
      gsap.fromTo(item,
        { autoAlpha: 0, x: i % 2 === 0 ? 32 : -32 },
        { autoAlpha: 1, x: 0, duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: item, start: 'top 80%', once: true } }
      );
    });

    /* ----- S8 · contact ----- */
    var email = document.querySelector('[data-contact-email]');
    if (email) {
      ScrollTrigger.create({
        trigger: email, start: 'top 75%', once: true,
        onEnter: function () { email.classList.add('is-drawn'); }
      });
    }
    var contactGlow = document.querySelector('.contact__glow');
    if (contactGlow) {
      gsap.to(contactGlow, { scale: 1.08, duration: 6, ease: 'sine.inOut', repeat: -1, yoyo: true });
    }

    /* ----- case-study scenes ----- */
    document.querySelectorAll('.case-diagram svg').forEach(function (svg) {
      var paths = svg.querySelectorAll('.d-line');
      var boxes = svg.querySelectorAll('.d-box, .d-label, .d-sub, .d-title');
      paths.forEach(function (p) {
        var len = p.getTotalLength();
        p.style.strokeDasharray = len;
        p.style.strokeDashoffset = len;
      });
      var tl = gsap.timeline({
        scrollTrigger: { trigger: svg, start: 'top 75%', once: true }
      });
      tl.fromTo(boxes, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, stagger: 0.06 })
        .to(paths, { strokeDashoffset: 0, duration: 1, ease: 'power2.inOut', stagger: 0.1 }, 0.3);

      var dot = svg.querySelector('.d-dot');
      var flow = svg.querySelector('.d-flow');
      if (dot && flow) {
        var flowLen = flow.getTotalLength();
        var prog = { t: 0 };
        var dotTween = gsap.to(prog, {
          t: 1, duration: 2.4, ease: 'none', repeat: -1, paused: true,
          onUpdate: function () {
            var pt = flow.getPointAtLength(prog.t * flowLen);
            dot.setAttribute('cx', pt.x);
            dot.setAttribute('cy', pt.y);
          }
        });
        ScrollTrigger.create({
          trigger: svg, start: 'top 90%', end: 'bottom 10%',
          onEnter: function () { dotTween.play(); },
          onLeave: function () { dotTween.pause(); },
          onEnterBack: function () { dotTween.play(); },
          onLeaveBack: function () { dotTween.pause(); }
        });
      }
    });

    document.querySelectorAll('[data-count]').forEach(function (el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var obj = { v: 0 };
      gsap.to(obj, {
        v: target, duration: 1.2, ease: 'power2.out',
        snap: { v: 1 },
        scrollTrigger: { trigger: el, start: 'top 80%', once: true },
        onUpdate: function () { el.textContent = obj.v; }
      });
    });

    document.querySelectorAll('.case-screens figure').forEach(function (fig, i) {
      gsap.fromTo(fig, { yPercent: i % 2 === 0 ? 8 : -8 }, {
        yPercent: i % 2 === 0 ? -8 : 8, ease: 'none',
        scrollTrigger: { trigger: fig, start: 'top bottom', end: 'bottom top', scrub: 0.6 }
      });
    });

    /* ----- magnetic elements ----- */
    if (FINE_POINTER) {
      document.querySelectorAll('[data-magnetic]').forEach(function (el) {
        var bounds;
        el.addEventListener('pointerenter', function () { bounds = el.getBoundingClientRect(); });
        el.addEventListener('pointermove', function (e) {
          if (!bounds) bounds = el.getBoundingClientRect();
          var dx = e.clientX - (bounds.left + bounds.width / 2);
          var dy = e.clientY - (bounds.top + bounds.height / 2);
          gsap.to(el, {
            x: gsap.utils.clamp(-12, 12, dx * 0.3),
            y: gsap.utils.clamp(-12, 12, dy * 0.3),
            duration: 0.4, ease: 'power2.out'
          });
        });
        el.addEventListener('pointerleave', function () {
          gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)' });
        });
      });
    }

    /* ----- hero particle field ----- */
    var canvas = document.querySelector('[data-particles]');
    if (canvas && FINE_POINTER !== null) {
      var ctx = canvas.getContext('2d');
      var particles = [];
      var mouse = { x: -9999, y: -9999 };
      var running = false;
      var rafId = null;
      var COUNT = window.innerWidth < 640 ? 50 : 120;
      var LINK = 110;

      function resize() {
        var r = canvas.getBoundingClientRect();
        canvas.width = r.width * Math.min(window.devicePixelRatio || 1, 2);
        canvas.height = r.height * Math.min(window.devicePixelRatio || 1, 2);
        ctx.setTransform(Math.min(window.devicePixelRatio || 1, 2), 0, 0, Math.min(window.devicePixelRatio || 1, 2), 0, 0);
      }

      function seed() {
        particles = [];
        var r = canvas.getBoundingClientRect();
        for (var i = 0; i < COUNT; i++) {
          particles.push({
            x: Math.random() * r.width,
            y: Math.random() * r.height,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            r: Math.random() * 1.6 + 0.4
          });
        }
      }

      function tick() {
        if (!running) return;
        var r = canvas.getBoundingClientRect();
        ctx.clearRect(0, 0, r.width, r.height);
        for (var i = 0; i < particles.length; i++) {
          var p = particles[i];
          // gentle drift toward cursor
          var mdx = mouse.x - p.x, mdy = mouse.y - p.y;
          var mdist = Math.hypot(mdx, mdy);
          if (mdist < 240 && mdist > 0.001) {
            p.vx += (mdx / mdist) * 0.004;
            p.vy += (mdy / mdist) * 0.004;
          }
          p.vx = Math.max(-0.5, Math.min(0.5, p.vx));
          p.vy = Math.max(-0.5, Math.min(0.5, p.vy));
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0 || p.x > r.width) p.vx *= -1;
          if (p.y < 0 || p.y > r.height) p.vy *= -1;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(244,244,245,0.35)';
          ctx.fill();

          for (var j = i + 1; j < particles.length; j++) {
            var q = particles[j];
            var dx = p.x - q.x, dy = p.y - q.y;
            var d2 = dx * dx + dy * dy;
            if (d2 < LINK * LINK) {
              var a = 1 - Math.sqrt(d2) / LINK;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(q.x, q.y);
              ctx.strokeStyle = 'rgba(255,180,84,' + (a * 0.12).toFixed(3) + ')';
              ctx.stroke();
            }
          }
        }
        rafId = requestAnimationFrame(tick);
      }

      function start() { if (!running) { running = true; rafId = requestAnimationFrame(tick); } }
      function stop() { running = false; if (rafId) cancelAnimationFrame(rafId); }

      resize();
      seed();
      window.addEventListener('resize', function () { resize(); seed(); });
      canvas.closest('.hero').addEventListener('pointermove', function (e) {
        var r = canvas.getBoundingClientRect();
        mouse.x = e.clientX - r.left;
        mouse.y = e.clientY - r.top;
      });

      new IntersectionObserver(function (entries) {
        entries[0].isIntersecting && !document.hidden ? start() : stop();
      }, { threshold: 0 }).observe(canvas);

      document.addEventListener('visibilitychange', function () {
        document.hidden ? stop() : start();
      });
    }

    /* ----- cursor glow depth layer ----- */
    var glowEl = document.querySelector('[data-glow]');
    if (glowEl && FINE_POINTER) {
      glowEl.classList.add('is-active');
      gsap.set(glowEl, { xPercent: -50, yPercent: -50 });
      var gx = gsap.quickTo(glowEl, 'x', { duration: 0.8, ease: 'power3.out' });
      var gy = gsap.quickTo(glowEl, 'y', { duration: 0.8, ease: 'power3.out' });
      window.addEventListener('pointermove', function (e) { gx(e.clientX); gy(e.clientY); });
    }

    /* ----- custom cursor ----- */
    var cursor = document.querySelector('[data-cursor]');
    if (cursor && FINE_POINTER) {
      var dot = cursor.querySelector('.cursor__dot');
      var ring = cursor.querySelector('.cursor__ring');
      gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });
      var dotX = gsap.quickTo(dot, 'x', { duration: 0.05, ease: 'none' });
      var dotY = gsap.quickTo(dot, 'y', { duration: 0.05, ease: 'none' });
      var ringX = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power3.out' });
      var ringY = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power3.out' });
      window.addEventListener('pointermove', function (e) {
        dotX(e.clientX); dotY(e.clientY);
        ringX(e.clientX); ringY(e.clientY);
      });
      document.addEventListener('pointerover', function (e) {
        if (e.target.closest('a, button, [data-magnetic]')) cursor.classList.add('is-hover');
      });
      document.addEventListener('pointerout', function (e) {
        if (e.target.closest('a, button, [data-magnetic]')) cursor.classList.remove('is-hover');
      });
    }

    /* ----- Lenis smooth scroll ----- */
    if (typeof Lenis !== 'undefined') {
      var lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
      // anchor links
      document.querySelectorAll('a[href*="#"]').forEach(function (a) {
        a.addEventListener('click', function (e) {
          var url = new URL(a.href, location.href);
          if (url.pathname === location.pathname && url.hash) {
            var target = document.querySelector(url.hash);
            if (target) {
              e.preventDefault();
              lenis.scrollTo(target, { offset: -60 });
              history.pushState(null, '', url.hash);
            }
          }
        });
      });
    }
  });

  /* ---------- smart-hide nav (works in both motion branches) ---------- */
  var nav = document.querySelector('[data-nav]');
  if (nav) {
    var lastY = window.scrollY;
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      nav.classList.toggle('is-scrolled', y > 40);
      if (y > 120 && y > lastY) nav.classList.add('is-hidden');
      else nav.classList.remove('is-hidden');
      lastY = y;
    }, { passive: true });
  }

  /* ---------- constellation hover (no motion involved) ---------- */
  var svg = document.querySelector('[data-constellation]');
  if (svg && FINE_POINTER) {
    var all = svg.querySelectorAll('.node, .edge');
    svg.querySelectorAll('.node').forEach(function (node) {
      node.addEventListener('pointerenter', function () {
        var g = node.getAttribute('data-group');
        if (g === 'all') return;
        all.forEach(function (el) {
          var eg = el.getAttribute('data-group');
          el.classList.toggle('is-dim', eg !== g && eg !== 'all');
        });
      });
      node.addEventListener('pointerleave', function () {
        all.forEach(function (el) { el.classList.remove('is-dim'); });
      });
    });
  }
})();
