/* ===================================================================
   app.js — Cinematic Portfolio Engine
   Particles · Typewriter · Scroll Animations · Timeline · Nav
   Fully reversible scroll animations
   =================================================================== */

(function () {
  'use strict';

  // ─── PARTICLE SYSTEM ───────────────────────────────────────────
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouse = { x: null, y: null };
  const PARTICLE_COUNT = 80;
  const CONNECT_DIST = 150;
  const GOLD = { r: 201, g: 168, b: 76 };

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 2 + 0.5;
      this.opacity = Math.random() * 0.5 + 0.2;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      if (mouse.x !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          this.x += dx * 0.01;
          this.y += dy * 0.01;
        }
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${GOLD.r}, ${GOLD.g}, ${GOLD.b}, ${this.opacity})`;
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }
  }

  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT_DIST) {
          const alpha = (1 - dist / CONNECT_DIST) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${GOLD.r}, ${GOLD.g}, ${GOLD.b}, ${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    requestAnimationFrame(animateParticles);
  }

  window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });
  canvas.addEventListener('mousemove', e => { mouse.x = e.x; mouse.y = e.y; });
  canvas.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });
  resizeCanvas();
  initParticles();
  animateParticles();

  // ─── TYPEWRITER ────────────────────────────────────────────────
  const typewriterEl = document.getElementById('typewriter');
  const phrases = [
    'Building scalable, multi-tenant SaaS platforms.',
    'FastAPI · Next.js · PostgreSQL · Redis · Docker',
    'Shipping production apps that solve real problems.',
    '130+ API endpoints. 28 database models. 2 live apps.',
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typewrite() {
    const current = phrases[phraseIndex];
    if (isDeleting) {
      typewriterEl.textContent = current.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typewriterEl.textContent = current.substring(0, charIndex + 1);
      charIndex++;
    }
    let delay = isDeleting ? 30 : 55;
    if (!isDeleting && charIndex === current.length) {
      delay = 2200;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 400;
    }
    setTimeout(typewrite, delay);
  }
  setTimeout(typewrite, 1800);

  // ─── SCROLL REVEAL — FULLY REVERSIBLE ─────────────────────────
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      } else {
        // Reverse: only hide if element is ABOVE the viewport (scrolled past it going up)
        const rect = entry.boundingClientRect;
        if (rect.top > 0) {
          // Element is below viewport — user scrolled up past it, reverse the animation
          entry.target.classList.remove('visible');
        }
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  // ─── ANIMATED SKILL BARS — REVERSIBLE ─────────────────────────
  const skillFills = document.querySelectorAll('.skill-fill');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const target = entry.target;
      if (entry.isIntersecting) {
        const width = target.getAttribute('data-width');
        target.style.width = width + '%';
        target.classList.add('animate');
      } else {
        // Reverse: collapse bars back to 0 when scrolled away
        target.style.width = '0%';
        target.classList.remove('animate');
      }
    });
  }, { threshold: 0.3 });

  skillFills.forEach(fill => skillObserver.observe(fill));

  // ─── TIMELINE PROGRESS — FULLY REVERSIBLE ─────────────────────
  const timeline = document.getElementById('timeline');
  const timelineProgress = document.getElementById('timeline-progress');
  const timelineItems = document.querySelectorAll('.timeline-item');

  function updateTimeline() {
    if (!timeline) return;
    const rect = timeline.getBoundingClientRect();
    const timelineTop = rect.top;
    const timelineHeight = rect.height;
    const windowHeight = window.innerHeight;
    const scrolledPast = windowHeight * 0.4 - timelineTop;
    const progress = Math.max(0, Math.min(1, scrolledPast / timelineHeight));
    timelineProgress.style.height = (progress * 100) + '%';

    // Reversible: add/remove 'lit' based on scroll position
    timelineItems.forEach(item => {
      const itemRect = item.getBoundingClientRect();
      if (itemRect.top < windowHeight * 0.6) {
        item.classList.add('lit');
      } else {
        // Reverse: un-light nodes when scrolling back up
        item.classList.remove('lit');
      }
    });
  }

  // ─── NAV SCROLL EFFECT ────────────────────────────────────────
  const nav = document.getElementById('navbar');
  function updateNav() {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  // ─── SMOOTH SCROLL FOR NAV LINKS ──────────────────────────────
  document.querySelectorAll('.nav-links a, .hero-cta').forEach(link => {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // ─── UNIFIED SCROLL LISTENER ──────────────────────────────────
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateNav();
        updateTimeline();
        ticking = false;
      });
      ticking = true;
    }
  });

  // ─── INITIAL CALLS ────────────────────────────────────────────
  updateNav();
  updateTimeline();

})();
