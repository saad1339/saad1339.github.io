/* ═══════════════════════════════════════════
   MUHAMMAD SAAD PORTFOLIO — script.js
═══════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── ULTRA-SMOOTH CURSOR ─────────────────────────────
  const dot     = document.getElementById('cursor-dot');
  const outline = document.getElementById('cursor-outline');

  if (dot && outline && window.innerWidth > 768) {

    // Current mouse position
    let mx = window.innerWidth  / 2;
    let my = window.innerHeight / 2;

    // Lagged ring position (lerped)
    let rx = mx;
    let ry = my;

    // Update mouse immediately (dot snaps)
    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top  = my + 'px';
    });

    // Ring follows with smooth lerp
    const LERP = 0.095; // lower = smoother / laggier
    let rafId;

    function animateRing() {
      rx += (mx - rx) * LERP;
      ry += (my - ry) * LERP;
      outline.style.left = rx + 'px';
      outline.style.top  = ry + 'px';
      rafId = requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover state for interactive elements
    const hoverTargets = 'a, button, input, textarea, .project-card, .skill-group, .cert-card';

    document.querySelectorAll(hoverTargets).forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });

    // Hide when leaving window
    document.addEventListener('mouseleave', () => {
      dot.style.opacity = '0';
      outline.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      dot.style.opacity = '1';
      outline.style.opacity = '1';
    });

    // Cleanup on mobile resize
    window.addEventListener('resize', () => {
      if (window.innerWidth <= 768) cancelAnimationFrame(rafId);
    });
  }


  // ─── NAVBAR SCROLL ───────────────────────────────────
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });


  // ─── MOBILE MENU ─────────────────────────────────────
  const menuBtn  = document.getElementById('menuBtn');
  const navLinks = document.getElementById('navLinks');

  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open);
      // Animate hamburger to X
      menuBtn.querySelectorAll('span').forEach((s, i) => {
        s.style.transition = 'transform 0.3s, opacity 0.3s';
        if (open) {
          if (i === 0) s.style.transform = 'translateY(6.5px) rotate(45deg)';
          if (i === 1) s.style.opacity = '0';
          if (i === 2) s.style.transform = 'translateY(-6.5px) rotate(-45deg)';
        } else {
          s.style.transform = '';
          s.style.opacity = '';
        }
      });
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', false);
        menuBtn.querySelectorAll('span').forEach(s => {
          s.style.transform = '';
          s.style.opacity = '';
        });
      });
    });
  }


  // ─── REVEAL ON SCROLL ────────────────────────────────
  // Hero elements use CSS @keyframes — skip them here, only observe non-hero.
  const nonHeroReveals = Array.from(
    document.querySelectorAll('.reveal-up, .reveal-left')
  ).filter(el => !el.closest('#home'));

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  nonHeroReveals.forEach(el => revealObserver.observe(el));


  // ─── SKILLS ANIMATION ────────────────────────────────
  let skillsAnimated = false;
  const skillsSection = document.getElementById('skills');

  if (skillsSection) {
    const skillObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !skillsAnimated) {
          skillsAnimated = true;
          animateSkills();
          skillObserver.disconnect();
        }
      });
    }, { threshold: 0.15 });

    skillObserver.observe(skillsSection);
  }

  function animateSkills() {
    // Animate bars
    const fills = document.querySelectorAll('.sk-fill');
    fills.forEach((fill, i) => {
      const item   = fill.closest('.sk-item');
      const target = item ? item.getAttribute('data-pct') : 0;
      setTimeout(() => {
        fill.style.width = target + '%';
      }, i * 80);
    });

    // Animate counters
    const counters = document.querySelectorAll('.counter');
    counters.forEach((counter, i) => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      let current  = 0;
      const steps  = 80;
      const step   = target / steps;

      setTimeout(() => {
        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            counter.textContent = target + '%';
            clearInterval(timer);
          } else {
            counter.textContent = Math.ceil(current) + '%';
          }
        }, 14);
      }, i * 80);
    });
  }


  // ─── ACTIVE NAV LINK ─────────────────────────────────
  const sections  = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navAnchors.forEach(a => {
          a.classList.toggle(
            'active',
            a.getAttribute('href') === '#' + id
          );
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionObserver.observe(s));


  // ─── CONTACT FORM ────────────────────────────────────
  const form      = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');

  if (form && submitBtn) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      submitBtn.classList.add('sent');
      submitBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
        Message Sent!`;

      setTimeout(() => {
        submitBtn.classList.remove('sent');
        submitBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="m22 2-7 20-4-9-9-4Z"/>
            <path d="M22 2 11 13"/>
          </svg>
          Send Message`;
        form.reset();
      }, 3500);
    });
  }


  // ─── SMOOTH SCROLL ───────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  // ─── PAGE LOAD ───────────────────────────────────────
  // Body fades in via CSS animation, no JS needed here.

})();
