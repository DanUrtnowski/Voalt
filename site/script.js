(function () {
  'use strict';

  /* Theme: dark is the default. Persist the visitor's choice locally. */
  var root = document.documentElement;
  var toggle = document.querySelector('.theme-toggle');
  var stored = null;
  try { stored = window.localStorage.getItem('voalt-theme'); } catch (e) { stored = null; }
  if (stored === 'light' || stored === 'dark') root.setAttribute('data-theme', stored);
  else root.setAttribute('data-theme', 'dark');

  function syncToggle() {
    if (!toggle) return;
    var dark = root.getAttribute('data-theme') !== 'light';
    toggle.setAttribute('aria-pressed', String(!dark));
    toggle.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    var icon = toggle.querySelector('.theme-icon');
    var label = toggle.querySelector('.theme-label');
    if (icon) icon.textContent = dark ? '☾' : '☀';
    if (label) label.textContent = dark ? 'Dark' : 'Light';
  }
  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      try { window.localStorage.setItem('voalt-theme', next); } catch (e) { /* private mode: theme just lasts for this visit */ }
      syncToggle();
    });
  }
  syncToggle();

  /* Mobile menu */
  var menuButton = document.querySelector('.menu-button');
  var nav = document.getElementById('main-nav');
  if (menuButton && nav) {
    menuButton.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(open));
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) { nav.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false'); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { nav.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false'); }
    });
  }

  /* Valence-electron background: drifting particles, orbiting electrons
     around slow nuclei, pulses travelling along the links, and a gentle
     response to the pointer. Canvas only, no network, no libraries.
     Pauses when hidden or reduced-motion. */
  var canvas = document.getElementById('valence');
  if (!canvas) return;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) { canvas.style.display = 'none'; return; }
  var ctx = canvas.getContext('2d');
  if (!ctx) return;

  var particles = [], nuclei = [], pulses = [];
  var width = 0, height = 0, raf = 0, running = false;
  var DPR = Math.min(window.devicePixelRatio || 1, 2);
  var mouse = { x: -9999, y: -9999 };

  function isLight() { return root.getAttribute('data-theme') === 'light'; }

  function resize() {
    width = window.innerWidth; height = window.innerHeight;
    canvas.width = Math.floor(width * DPR); canvas.height = Math.floor(height * DPR);
    canvas.style.width = width + 'px'; canvas.style.height = height + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    var count = Math.min(110, Math.max(44, Math.floor(width * height / 18000)));
    particles = [];
    for (var i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width, y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
        r: 1 + Math.random() * 1.8,
        teal: Math.random() < 0.35,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.006 + Math.random() * 0.012
      });
    }
    /* A few slow nuclei, each with electrons on real orbits. */
    nuclei = [];
    var spots = [[0.2, 0.28], [0.82, 0.6], [0.5, 0.88]];
    for (var n = 0; n < spots.length; n++) {
      var electrons = [];
      var eCount = 3 + (n % 2);
      for (var e = 0; e < eCount; e++) {
        electrons.push({
          radius: 26 + e * 22 + Math.random() * 8,
          angle: Math.random() * Math.PI * 2,
          speed: (0.0035 + Math.random() * 0.003) * (e % 2 ? 1 : -1),
          r: 1.6 + Math.random() * 1.4,
          teal: e % 2 === 0
        });
      }
      nuclei.push({
        fx: spots[n][0], fy: spots[n][1],
        vx: (Math.random() - 0.5) * 0.05, vy: (Math.random() - 0.5) * 0.05,
        electrons: electrons
      });
    }
    pulses = [];
  }

  window.addEventListener('pointermove', function (e) { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('pointerleave', function () { mouse.x = -9999; mouse.y = -9999; });

  function frame() {
    if (!running) return;
    ctx.clearRect(0, 0, width, height);
    var light = isLight();
    var lineCol = light ? '8,153,189' : '39,215,246';
    var dotCol = light ? '8,153,189' : '79,227,219';
    var blueCol = light ? '29,95,196' : '108,169,255';

    /* Drifting particles + links, with pulses riding the links. */
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.x += p.vx; p.y += p.vy; p.pulse += p.pulseSpeed;
      /* Gentle push away from the pointer, and a brightening near it. */
      var mdx = p.x - mouse.x, mdy = p.y - mouse.y, md2 = mdx * mdx + mdy * mdy;
      if (md2 < 14400 && md2 > 1) {
        var md = Math.sqrt(md2), push = (120 - md) / 120 * 0.6;
        p.x += mdx / md * push; p.y += mdy / md * push;
      }
      if (p.x < -20) p.x = width + 20; if (p.x > width + 20) p.x = -20;
      if (p.y < -20) p.y = height + 20; if (p.y > height + 20) p.y = -20;
      for (var j = i + 1; j < particles.length; j++) {
        var q = particles[j];
        var dx = p.x - q.x, dy = p.y - q.y, d2 = dx * dx + dy * dy;
        if (d2 < 14400) {
          var a = (1 - Math.sqrt(d2) / 120) * (light ? 0.20 : 0.16);
          ctx.strokeStyle = 'rgba(' + lineCol + ',' + a.toFixed(3) + ')';
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          if (pulses.length < 24 && Math.random() < 0.0012) pulses.push({ i: i, j: j, t: 0 });
        }
      }
    }
    /* Travelling pulses: bright dots moving along a link, then gone. */
    for (var s = pulses.length - 1; s >= 0; s--) {
      var pu = pulses[s];
      pu.t += 0.022;
      if (pu.t >= 1 || !particles[pu.i] || !particles[pu.j]) { pulses.splice(s, 1); continue; }
      var aP = particles[pu.i], bP = particles[pu.j];
      var px = aP.x + (bP.x - aP.x) * pu.t, py = aP.y + (bP.y - aP.y) * pu.t;
      ctx.fillStyle = 'rgba(' + dotCol + ',0.9)';
      ctx.beginPath(); ctx.arc(px, py, 2.2, 0, Math.PI * 2); ctx.fill();
    }
    /* Nuclei: faint ring, glowing core, electrons circling it. */
    for (var n = 0; n < nuclei.length; n++) {
      var nuc = nuclei[n];
      var cx = nuc.fx * width, cy = nuc.fy * height;
      nuc.fx += nuc.vx / width; nuc.fy += nuc.vy / height;
      if (nuc.fx < 0.08 || nuc.fx > 0.92) nuc.vx *= -1;
      if (nuc.fy < 0.12 || nuc.fy > 0.92) nuc.vy *= -1;
      ctx.strokeStyle = 'rgba(' + lineCol + ',' + (light ? 0.14 : 0.12) + ')';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(cx, cy, 74, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = 'rgba(' + blueCol + ',0.55)';
      ctx.beginPath(); ctx.arc(cx, cy, 3.2, 0, Math.PI * 2); ctx.fill();
      for (var e = 0; e < nuc.electrons.length; e++) {
        var el = nuc.electrons[e];
        el.angle += el.speed;
        var ex = cx + Math.cos(el.angle) * el.radius, ey = cy + Math.sin(el.angle) * el.radius;
        var glow = 0.6 + 0.4 * Math.sin(el.angle * 2);
        ctx.fillStyle = 'rgba(' + (el.teal ? dotCol : blueCol) + ',' + glow.toFixed(3) + ')';
        ctx.beginPath(); ctx.arc(ex, ey, el.r, 0, Math.PI * 2); ctx.fill();
      }
    }
    /* Particles on top, brightening near the pointer. */
    for (var k = 0; k < particles.length; k++) {
      var pt = particles[k];
      var glow = 0.45 + 0.35 * Math.sin(pt.pulse);
      var pdx = pt.x - mouse.x, pdy = pt.y - mouse.y;
      if (pdx * pdx + pdy * pdy < 14400) glow = Math.min(1, glow + 0.35);
      ctx.fillStyle = 'rgba(' + (pt.teal ? dotCol : blueCol) + ',' + glow.toFixed(3) + ')';
      ctx.beginPath(); ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2); ctx.fill();
    }
    raf = window.requestAnimationFrame(frame);
  }

  function start() { if (!running && !document.hidden) { running = true; raf = window.requestAnimationFrame(frame); } }
  function stop() { running = false; if (raf) window.cancelAnimationFrame(raf); }

  resize();
  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else start(); });
  start();
})();
