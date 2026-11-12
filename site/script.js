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

  /* Valence-electron background: slow particles, connecting lines, soft pulses.
     Canvas only, no network, no libraries. Pauses when hidden or reduced-motion. */
  var canvas = document.getElementById('valence');
  if (!canvas) return;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) { canvas.style.display = 'none'; return; }
  var ctx = canvas.getContext('2d');
  if (!ctx) return;

  var particles = [];
  var width = 0, height = 0, raf = 0, running = false;
  var DPR = Math.min(window.devicePixelRatio || 1, 2);

  function isLight() { return root.getAttribute('data-theme') === 'light'; }

  function resize() {
    width = window.innerWidth; height = window.innerHeight;
    canvas.width = Math.floor(width * DPR); canvas.height = Math.floor(height * DPR);
    canvas.style.width = width + 'px'; canvas.style.height = height + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    var count = Math.min(90, Math.max(36, Math.floor(width * height / 22000)));
    particles = [];
    for (var i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width, y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.22, vy: (Math.random() - 0.5) * 0.22,
        r: 1 + Math.random() * 1.8,
        teal: Math.random() < 0.35,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.004 + Math.random() * 0.008
      });
    }
  }

  function frame() {
    if (!running) return;
    ctx.clearRect(0, 0, width, height);
    var light = isLight();
    var lineCol = light ? '8,153,189' : '39,215,246';
    var dotCol = light ? '8,153,189' : '79,227,219';
    var blueCol = light ? '29,95,196' : '108,169,255';

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.x += p.vx; p.y += p.vy; p.pulse += p.pulseSpeed;
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
        }
      }
    }
    for (var k = 0; k < particles.length; k++) {
      var pt = particles[k];
      var glow = 0.45 + 0.35 * Math.sin(pt.pulse);
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
