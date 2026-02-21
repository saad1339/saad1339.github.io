/* ═══════════════════════════════════════════
   MUHAMMAD SAAD PORTFOLIO — script.js (ENHANCED)
═══════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── PARTICLE CANVAS ──────────────────────────────────
  (function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, particles = [], mouse = { x: -9999, y: -9999 };

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });
    document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

    class Particle {
      constructor() { this.reset(true); }
      reset(init) {
        this.x   = Math.random() * W;
        this.y   = init ? Math.random() * H : H + 10;
        this.vx  = (Math.random() - 0.5) * 0.4;
        this.vy  = -(Math.random() * 0.6 + 0.2);
        this.r   = Math.random() * 1.8 + 0.4;
        this.a   = Math.random() * 0.5 + 0.1;
        this.hue = Math.random() > 0.5 ? '59,130,246' : '34,211,238';
      }
      update() {
        const dx = this.x - mouse.x, dy = this.y - mouse.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 130) {
          const f = (130 - dist) / 130 * 0.016;
          this.vx += (dx / dist) * f;
          this.vy += (dy / dist) * f;
        }
        this.x += this.vx; this.y += this.vy;
        this.vx *= 0.99; this.vy *= 0.99;
        if (this.y < -10 || this.x < -10 || this.x > W + 10) this.reset(false);
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.hue},${this.a})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < 160; i++) particles.push(new Particle());

    function loop() {
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d  = Math.sqrt(dx*dx + dy*dy);
          if (d < 90) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(59,130,246,${(1 - d/90) * 0.07})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
        particles[i].update();
        particles[i].draw();
      }
      requestAnimationFrame(loop);
    }
    loop();
  })();


  // ─── ULTRA-SMOOTH MAGNETIC CURSOR ─────────────────────
  const dot     = document.getElementById('cursor-dot');
  const outline = document.getElementById('cursor-outline');

  if (dot && outline && window.innerWidth > 768) {
    let mx = window.innerWidth/2, my = window.innerHeight/2;
    let rx = mx, ry = my;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top  = my + 'px';
    });

    const LERP = 0.10;
    function animateRing() {
      rx += (mx - rx) * LERP;
      ry += (my - ry) * LERP;
      outline.style.left = rx + 'px';
      outline.style.top  = ry + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    document.querySelectorAll('a, button, .project-card, .skill-group, .cert-card').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover');
        if (!el.classList.contains('project-card') && !el.classList.contains('cert-card') && !el.classList.contains('skill-group')) {
          el.style.transform = '';
        }
      });
      el.addEventListener('mousemove', e => {
        if (el.tagName === 'A' || el.tagName === 'BUTTON') {
          const rect = el.getBoundingClientRect();
          const dx = (e.clientX - rect.left - rect.width/2) * 0.13;
          const dy = (e.clientY - rect.top - rect.height/2) * 0.13;
          el.style.transform = `translate(${dx}px,${dy}px)`;
          el.style.transition = 'transform 0.1s ease';
        }
      });
    });

    document.addEventListener('mouseleave', () => { dot.style.opacity='0'; outline.style.opacity='0'; });
    document.addEventListener('mouseenter', () => { dot.style.opacity='1'; outline.style.opacity='1'; });
  }


  // ─── NAVBAR ───────────────────────────────────────────
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });


  // ─── MOBILE MENU ──────────────────────────────────────
  const menuBtn  = document.getElementById('menuBtn');
  const navLinks = document.getElementById('navLinks');

  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open);
      menuBtn.querySelectorAll('span').forEach((s, i) => {
        s.style.transition = 'transform 0.3s, opacity 0.3s';
        if (open) {
          if (i === 0) s.style.transform = 'translateY(6.5px) rotate(45deg)';
          if (i === 1) s.style.opacity = '0';
          if (i === 2) s.style.transform = 'translateY(-6.5px) rotate(-45deg)';
        } else { s.style.transform=''; s.style.opacity=''; }
      });
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', false);
        menuBtn.querySelectorAll('span').forEach(s => { s.style.transform=''; s.style.opacity=''; });
      });
    });
  }


  // ─── TYPING EFFECT ────────────────────────────────────
  (function initTyping() {
    const el = document.getElementById('typing-role');
    if (!el) return;
    const phrases = ['Cloud & DevOps Engineer','Azure Specialist','GCP Developer','CI/CD Architect','Data Engineer'];
    let pIdx=0, cIdx=0, deleting=false;

    function type() {
      const cur = phrases[pIdx];
      if (!deleting) {
        el.textContent = cur.slice(0, ++cIdx);
        if (cIdx === cur.length) { deleting=true; setTimeout(type, 2200); return; }
        setTimeout(type, 70);
      } else {
        el.textContent = cur.slice(0, --cIdx);
        if (cIdx === 0) { deleting=false; pIdx=(pIdx+1)%phrases.length; setTimeout(type, 420); return; }
        setTimeout(type, 35);
      }
    }
    type();
  })();


  // ─── GLITCH TEXT ──────────────────────────────────────
  (function initGlitch() {
    const chars = '!<>-_\\/[]{}—=+*^?#';
    document.querySelectorAll('[data-glitch]').forEach(el => {
      const text = el.getAttribute('data-glitch') || el.textContent;
      function glitch() {
        let iter = 0;
        const interval = setInterval(() => {
          el.textContent = text.split('').map((c, i) => {
            if (i < iter) return text[i];
            return c===' ' ? ' ' : chars[Math.floor(Math.random()*chars.length)];
          }).join('');
          if (iter >= text.length) clearInterval(interval);
          iter += 0.6;
        }, 28);
      }
      el.addEventListener('mouseenter', glitch);
      setTimeout(function loop() { glitch(); setTimeout(loop, Math.random()*10000+6000); }, Math.random()*8000+3000);
    });
  })();


  // ─── 3D TILT CARDS ────────────────────────────────────
  (function initTilt() {
    document.querySelectorAll('.project-card, .cert-card, .skill-group').forEach(card => {
      // Inject shine
      if (!card.querySelector('.card-shine')) {
        const shine = document.createElement('div');
        shine.className = 'card-shine';
        card.appendChild(shine);
      }
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width/2;
        const cy = rect.top  + rect.height/2;
        const dx = (e.clientX - cx) / (rect.width/2);
        const dy = (e.clientY - cy) / (rect.height/2);
        card.style.transform = `perspective(900px) rotateX(${dy*-7}deg) rotateY(${dx*7}deg) translateY(-5px)`;
        card.style.transition = 'transform 0.08s ease';
        const shine = card.querySelector('.card-shine');
        if (shine) shine.style.background = `radial-gradient(circle at ${e.clientX-rect.left}px ${e.clientY-rect.top}px,rgba(255,255,255,0.07),transparent 60%)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.55s cubic-bezier(0.22,1,0.36,1)';
        const shine = card.querySelector('.card-shine');
        if (shine) shine.style.background = 'none';
      });
    });
  })();


  // ─── REVEAL ON SCROLL ─────────────────────────────────
  const nonHeroReveals = Array.from(
    document.querySelectorAll('.reveal-up, .reveal-left, .reveal-scale')
  ).filter(el => !el.closest('#home'));

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  nonHeroReveals.forEach(el => revealObserver.observe(el));


  // ─── SKILLS ANIMATION ─────────────────────────────────
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
    document.querySelectorAll('.sk-fill').forEach((fill, i) => {
      const item   = fill.closest('.sk-item');
      const target = item ? item.getAttribute('data-pct') : 0;
      setTimeout(() => {
        fill.style.width = target + '%';
        setTimeout(() => fill.classList.add('sk-fill--done'), 900);
      }, i * 90);
    });
    document.querySelectorAll('.counter').forEach((counter, i) => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      let current = 0;
      const step = target / 80;
      setTimeout(() => {
        const timer = setInterval(() => {
          current += step;
          if (current >= target) { counter.textContent = target+'%'; clearInterval(timer); }
          else counter.textContent = Math.ceil(current)+'%';
        }, 14);
      }, i * 90);
    });
  }


  // ─── SCROLL PROGRESS ──────────────────────────────────
  const progressBar = document.getElementById('scroll-progress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
      progressBar.style.width = pct + '%';
    }, { passive: true });
  }


  // ─── ACTIVE NAV ───────────────────────────────────────
  const sections   = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-link');
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href')==='#'+id));
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => sectionObserver.observe(s));


  // ─── CONTACT FORM ─────────────────────────────────────
  const form      = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  if (form && submitBtn) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      submitBtn.classList.add('loading');
      submitBtn.innerHTML = `<span class="btn-spinner"></span> Sending...`;
      setTimeout(() => {
        submitBtn.classList.remove('loading');
        submitBtn.classList.add('sent');
        submitBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Message Sent!`;
        launchConfetti();
        setTimeout(() => {
          submitBtn.classList.remove('sent');
          submitBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg> Send Message`;
          form.reset();
        }, 3500);
      }, 1200);
    });
  }


  // ─── CONFETTI ─────────────────────────────────────────
  function launchConfetti() {
    const colors = ['#3b82f6','#22d3ee','#4ade80','#f59e0b','#a78bfa'];
    for (let i = 0; i < 70; i++) {
      const el   = document.createElement('div');
      const c    = colors[Math.floor(Math.random()*colors.length)];
      const size = Math.random()*9+4;
      const isC  = Math.random()>0.5;
      const tx   = (Math.random()-0.5)*220;
      const ty   = Math.random()*320+80;
      el.style.cssText=`position:fixed;left:${45+Math.random()*10}%;top:60%;width:${size}px;height:${size}px;background:${c};border-radius:${isC?'50%':'3px'};pointer-events:none;z-index:9999;opacity:1;transform:rotate(${Math.random()*360}deg);animation:cFly${i%3} ${Math.random()*1.4+0.8}s ease-out ${Math.random()*0.5}s forwards;`;
      document.body.appendChild(el);
      setTimeout(()=>el.remove(),2400);
    }
  }

  // ─── RIPPLE ON CARDS ──────────────────────────────────
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', e => {
      const ripple = document.createElement('span');
      const rect   = card.getBoundingClientRect();
      ripple.className = 'ripple-effect';
      ripple.style.left = (e.clientX - rect.left)+'px';
      ripple.style.top  = (e.clientY - rect.top) +'px';
      card.appendChild(ripple);
      setTimeout(()=>ripple.remove(),700);
    });
  });

  // ─── TECH PILL HOVER ──────────────────────────────────
  document.querySelectorAll('.pc-techs span').forEach(pill => {
    pill.addEventListener('mouseenter', () => { pill.style.transform='scale(1.1) translateY(-2px)'; pill.style.transition='transform 0.2s cubic-bezier(0.22,1,0.36,1)'; });
    pill.addEventListener('mouseleave', () => { pill.style.transform=''; });
  });

  // ─── HERO VISUAL 3D ───────────────────────────────────
  const heroVisual = document.querySelector('.hero-visual');
  if (heroVisual && window.innerWidth > 1024) {
    document.addEventListener('mousemove', e => {
      const xR = (e.clientX / window.innerWidth - 0.5)*2;
      const yR = (e.clientY / window.innerHeight - 0.5)*2;
      heroVisual.style.transform=`perspective(1000px) rotateY(${xR*9}deg) rotateX(${-yR*6}deg)`;
      heroVisual.style.transition='transform 0.15s ease';
    });
  }

  // ─── SECTION TITLE WORD STAGGER ──────────────────────
  document.querySelectorAll('.section-title').forEach(title => {
    const html = title.innerHTML;
    const parts = html.split(/(<em>.*?<\/em>|\s+)/);
    title.innerHTML = parts.map((p,i) => {
      if (!p.trim()) return ' ';
      return `<span class="word-reveal" style="--wi:${i}">${p}</span>`;
    }).join('');
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        title.querySelectorAll('.word-reveal').forEach((w,i) => {
          setTimeout(()=>w.classList.add('word-visible'), i*110);
        });
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    obs.observe(title);
  });

  // ─── INJECT STYLES ────────────────────────────────────
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    .card-shine {
      position:absolute;inset:0;pointer-events:none;border-radius:inherit;z-index:10;transition:background 0.1s;
    }
    .ripple-effect {
      position:absolute;width:4px;height:4px;background:rgba(59,130,246,0.35);
      border-radius:50%;transform:translate(-50%,-50%);
      animation:rippleOut 0.7s ease-out forwards;pointer-events:none;
    }
    @keyframes rippleOut { to { width:350px;height:350px;opacity:0; } }
    .word-reveal {
      display:inline-block;opacity:0;transform:translateY(18px);
      transition:opacity 0.5s ease,transform 0.5s cubic-bezier(0.22,1,0.36,1);
    }
    .word-reveal.word-visible { opacity:1;transform:translateY(0); }
    .btn-spinner {
      display:inline-block;width:14px;height:14px;border:2px solid rgba(0,0,0,0.25);
      border-top-color:#000;border-radius:50%;animation:spin 0.7s linear infinite;vertical-align:middle;
    }
    @keyframes spin { to { transform:rotate(360deg); } }
    .sk-fill--done { box-shadow:0 0 14px rgba(34,211,238,0.4); }
    @keyframes cFly0 { to { transform:translate(-110px,-240px) rotate(720deg);opacity:0; } }
    @keyframes cFly1 { to { transform:translate(80px,-300px) rotate(-540deg);opacity:0; } }
    @keyframes cFly2 { to { transform:translate(170px,-200px) rotate(900deg);opacity:0; } }
  `;
  document.head.appendChild(styleEl);

  // ─── SMOOTH SCROLL ────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior:'smooth', block:'start' }); }
    });
  });

})();
