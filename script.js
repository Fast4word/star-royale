// Star Royale — script.js
// Small enhancements: starfield canvas, year injection, mobile nav toggle

document.addEventListener('DOMContentLoaded', function () {
  // Inject year in footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle (simple)
  const toggle = document.querySelector('.mobile-toggle');
  const nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      if (!expanded) {
        nav.style.display = 'flex';
        nav.style.flexDirection = 'column';
        nav.style.position = 'absolute';
        nav.style.right = '20px';
        nav.style.top = '60px';
        nav.style.background = 'rgba(3,8,20,0.9)';
        nav.style.padding = '10px';
        nav.style.borderRadius = '10px';
      } else {
        nav.style.display = '';
        nav.style.position = '';
        nav.style.background = '';
        nav.style.padding = '';
        nav.style.borderRadius = '';
      }
    });
  }

  // Simple animated starfield inside the hero device canvas
  const canvas = document.getElementById('starfield');
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext('2d');
    const DPR = window.devicePixelRatio || 1;
    let width = canvas.width;
    let height = canvas.height;
    const stars = [];
    const STAR_COUNT = 80;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * DPR);
      canvas.height = Math.round(height * DPR);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }

    function initStars() {
      stars.length = 0;
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          z: Math.random() * 1,
          size: Math.random() * 1.6 + 0.3,
          speed: 0.2 + Math.random() * 0.9
        });
      }
    }

    function tick() {
      ctx.clearRect(0, 0, width, height);

      // subtle gradient background
      const g = ctx.createLinearGradient(0, 0, 0, height);
      g.addColorStop(0, 'rgba(6,9,20,1)');
      g.addColorStop(1, 'rgba(3,6,12,1)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, width, height);

      for (let s of stars) {
        s.x -= s.speed;
        if (s.x < -10) s.x = width + 10;
        // twinkle
        const alpha = 0.5 + Math.sin((Date.now() / 600) * (0.5 + s.z)) * 0.3;
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.arc(s.x, s.y, s.size * (1 + s.z), 0, Math.PI * 2);
        ctx.fill();
      }

      // ship-ish glow (decorative)
      ctx.beginPath();
      ctx.fillStyle = 'rgba(91,114,255,0.06)';
      ctx.ellipse(width * 0.75, height * 0.55, 120, 60, 0, 0, Math.PI * 2);
      ctx.fill();

      requestAnimationFrame(tick);
    }

    function start() {
      resize();
      initStars();
      tick();
    }

    window.addEventListener('resize', () => {
      // debounced-ish
      clearTimeout(window.___sr_timeout);
      window.___sr_timeout = setTimeout(() => {
        resize();
        initStars();
      }, 150);
    });

    start();
  }
});
