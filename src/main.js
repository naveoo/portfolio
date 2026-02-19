import './style.css'
import { translations } from './translations.js'

// ==========================================
// CONSTANTES & VARIABLES GLOBALES
// Toutes les const/let sont déclarées ICI en premier
// pour éviter le Temporal Dead Zone (TDZ) lors du build
// ==========================================
const GITHUB_USERNAME = 'naveoo';
const reposContainer = document.getElementById('github-repos');
let cachedRepos = [];

const isTouch = window.matchMedia('(pointer: coarse)').matches
  || navigator.maxTouchPoints > 0;

let currentLang = localStorage.getItem('lang') || 'en';
const typingEl = document.getElementById('typing-text');
let typingRoles = [];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingTimeout = null;

// ==========================================
// INTERSECTION OBSERVERS — déclarés AVANT changeLanguage()
// car renderRepos() (appelé dans changeLanguage) les utilise → évite le TDZ
// ==========================================
const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      obs.unobserve(entry.target);
    }
  });
}, {
  root: null,
  rootMargin: '0px 0px -80px 0px',
  threshold: 0.0
});

const counterObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('[data-count]').forEach(c => animateCounter(c));
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

// ==========================================
// LANGUAGE / i18n
// ==========================================
function changeLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  document.documentElement.lang = lang;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang]?.[key]) el.textContent = translations[lang][key];
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (translations[lang]?.[key]) el.placeholder = translations[lang][key];
  });

  const langToggleEl = document.getElementById('lang-toggle');
  if (langToggleEl) {
    langToggleEl.querySelector('.lang-flag').textContent = lang === 'fr' ? '🇬🇧' : '🇫🇷';
    langToggleEl.querySelector('.lang-label').textContent = lang === 'fr' ? 'EN' : 'FR';
  }

  updateTypingRoles();
  if (cachedRepos.length > 0) renderRepos();
}

const langToggle = document.getElementById('lang-toggle');
if (langToggle) {
  langToggle.addEventListener('click', () => {
    changeLanguage(currentLang === 'en' ? 'fr' : 'en');
  });
}

changeLanguage(currentLang);

// ==========================================
// MOBILE MENU
// ==========================================
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navbar = document.getElementById('navbar');

if (hamburger && navLinks) {
  const toggleMenu = () => {
    const isOpen = navLinks.classList.toggle('nav-open');
    hamburger.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', String(isOpen));
  };

  hamburger.addEventListener('click', toggleMenu);
  hamburger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleMenu(); }
  });

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        navLinks.classList.remove('nav-open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

// ==========================================
// NAVBAR SCROLL EFFECT
// ==========================================
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });
}

// ==========================================
// SMOOTH SCROLLING
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      window.scrollTo({ top: target.offsetTop - 70, behavior: 'smooth' });
      history.pushState(null, null, this.getAttribute('href'));
    }
  });
});

// ==========================================
// ACTIVE LINK ON SCROLL
// ==========================================
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => { if (scrollY >= s.offsetTop - 200) current = s.getAttribute('id'); });
  navItems.forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href').includes(current)) a.classList.add('active');
  });
});

// ==========================================
// TYPING EFFECT
// ==========================================
function updateTypingRoles() {
  typingRoles = translations[currentLang]?.['hero.roles']
    || ['Python Developer', 'Web Developer', 'Open Source Enthusiast'];
}

updateTypingRoles();

function typeEffect() {
  if (!typingEl || !typingRoles.length) return;
  const role = typingRoles[roleIndex % typingRoles.length];
  typingEl.textContent = role.substring(0, isDeleting ? --charIndex : ++charIndex);

  let delay = isDeleting ? 40 : 80;
  if (!isDeleting && charIndex === role.length) { delay = 2000; isDeleting = true; }
  else if (isDeleting && charIndex === 0) { isDeleting = false; roleIndex++; delay = 400; }

  typingTimeout = setTimeout(typeEffect, delay);
}
typeEffect();

// ==========================================
// SECTION DECORATIVE NUMBERS
// ==========================================
['#about','#skills','#projects','#contact'].forEach((id, i) => {
  const el = document.querySelector(`${id} .section-title`);
  if (el) el.setAttribute('data-section-num', String(i + 1).padStart(2, '0'));
});

// ==========================================
// INTERACTIVE PARTICLE CANVAS
// ==========================================
const canvas = document.getElementById('hero-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let mouse = { x: null, y: null, radius: 120 };
  window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('mouseout', (e) => { if (!e.relatedTarget) { mouse.x = null; mouse.y = null; } });

  let particlesArray = [];

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.baseSpeedX = (Math.random() - 0.5) * 0.6;
      this.baseSpeedY = (Math.random() - 0.5) * 0.6;
      this.speedX = this.baseSpeedX;
      this.speedY = this.baseSpeedY;
      const colors = ['rgba(100,255,218,0.5)','rgba(91,141,238,0.4)','rgba(168,85,247,0.4)','rgba(100,255,218,0.25)'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }
    update() {
      if (mouse.x !== null) {
        const dx = this.x - mouse.x, dy = this.y - mouse.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < mouse.radius) {
          const f = (mouse.radius - dist) / mouse.radius, a = Math.atan2(dy, dx);
          this.speedX = this.baseSpeedX + Math.cos(a) * f * 2.5;
          this.speedY = this.baseSpeedY + Math.sin(a) * f * 2.5;
        } else {
          this.speedX += (this.baseSpeedX - this.speedX) * 0.05;
          this.speedY += (this.baseSpeedY - this.speedY) * 0.05;
        }
      } else {
        this.speedX += (this.baseSpeedX - this.speedX) * 0.05;
        this.speedY += (this.baseSpeedY - this.speedY) * 0.05;
      }
      this.x = (this.x + this.speedX + canvas.width) % canvas.width;
      this.y = (this.y + this.speedY + canvas.height) % canvas.height;
    }
    draw() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function initParticles() {
    particlesArray = [];
    const n = Math.min(Math.floor((canvas.width * canvas.height) / 8000), 120);
    for (let i = 0; i < n; i++) particlesArray.push(new Particle());
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particlesArray.forEach(p => { p.update(); p.draw(); });
    // Connect nearby particles
    const maxDist = 130;
    for (let i = 0; i < particlesArray.length; i++) {
      for (let j = i + 1; j < particlesArray.length; j++) {
        const dx = particlesArray[i].x - particlesArray[j].x;
        const dy = particlesArray[i].y - particlesArray[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < maxDist) {
          ctx.strokeStyle = `rgba(100,255,218,${0.15*(1-dist/maxDist)})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
          ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animateParticles);
  }

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
  });

  initParticles();
  animateParticles();
}

// ==========================================
// CUSTOM CURSOR
// ==========================================
function initCustomCursor() {
  if (isTouch) return;

  document.body.classList.add('custom-cursor');

  const ring = document.createElement('div');
  const dot = document.createElement('div');
  ring.className = 'cursor';
  dot.className = 'cursor-dot';

  const base = {
    position: 'fixed',
    borderRadius: '50%',
    pointerEvents: 'none',
    zIndex: '2147483647',
    transform: 'translate(-50%, -50%)',
    left: '-200px',
    top: '-200px',
    opacity: '0',
  };

  Object.assign(ring.style, {
    ...base,
    width: '36px',
    height: '36px',
    border: '1.5px solid rgba(100,255,218,0.8)',
    transition: 'opacity 0.3s, width 0.2s, height 0.2s, border-color 0.2s, background 0.2s',
  });

  Object.assign(dot.style, {
    ...base,
    width: '6px',
    height: '6px',
    background: '#64ffda',
    transition: 'opacity 0.3s',
  });

  document.body.appendChild(ring);
  document.body.appendChild(dot);

  let visible = false;
  let pending = false;
  let mx = -200, my = -200;

  function updatePos() {
    ring.style.left = mx + 'px'; ring.style.top = my + 'px';
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
    pending = false;
  }

  window.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    if (!pending) { pending = true; requestAnimationFrame(updatePos); }
    if (!visible) {
      ring.style.opacity = '1'; dot.style.opacity = '1'; visible = true;
    }
  }, { passive: true });

  document.documentElement.addEventListener('mouseleave', () => {
    ring.style.opacity = '0'; dot.style.opacity = '0'; visible = false;
  });
  document.documentElement.addEventListener('mouseenter', () => {
    ring.style.opacity = '1'; dot.style.opacity = '1'; visible = true;
  });

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest('a, button, .skill-tags span, .project-card, .stat-card, .hamburger')) {
      ring.style.width = '60px'; ring.style.height = '60px';
      ring.style.borderColor = 'rgba(168,85,247,0.8)';
      ring.style.background = 'rgba(168,85,247,0.08)';
    } else {
      ring.style.width = '36px'; ring.style.height = '36px';
      ring.style.borderColor = 'rgba(100,255,218,0.8)';
      ring.style.background = '';
    }
  });

  document.addEventListener('mousedown', () => {
    ring.style.width = '20px'; ring.style.height = '20px';
    ring.style.background = 'rgba(100,255,218,0.2)';
  });
  document.addEventListener('mouseup', () => {
    ring.style.width = '36px'; ring.style.height = '36px';
    ring.style.background = '';
  });

  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width/2) * 0.25;
      const dy = (e.clientY - r.top - r.height/2) * 0.25;
      btn.style.transform = `translate(${dx}px,${dy}px) translateY(-3px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
}

initCustomCursor();

// ==========================================
// 3D TILT EFFECT
// ==========================================
function initCardTilt() {
  document.querySelectorAll('.project-card').forEach(card => {
    if (!card.querySelector('.card-shine')) {
      const shine = document.createElement('div');
      shine.className = 'card-shine';
      card.appendChild(shine);
    }
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      card.style.transform = `perspective(600px) rotateX(${((y-r.height/2)/(r.height/2))*-8}deg) rotateY(${((x-r.width/2)/(r.width/2))*8}deg) scale(1.02)`;
      card.style.transition = 'box-shadow 0.1s, border-color 0.4s';
      card.style.setProperty('--mouse-x', `${(x/r.width)*100}%`);
      card.style.setProperty('--mouse-y', `${(y/r.height)*100}%`);
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'all 0.5s var(--ease-out-expo)';
    });
  });
}

// ==========================================
// SCROLL REVEAL
// ==========================================
document.querySelectorAll('.section-title, .section-subtitle')
  .forEach(el => {
    el.classList.add('hidden');
    el.style.transitionDelay = '0s';
    observer.observe(el);
  });

document.querySelectorAll('.skill-category, .about-text, .stat-card, .about-stats')
  .forEach((el, i) => {
    el.classList.add('hidden');
    el.style.transitionDelay = `${i * 0.08}s`;
    observer.observe(el);
  });

// ==========================================
// COUNTER ANIMATION
// ==========================================
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-count'));
  if (isNaN(target)) return;
  const duration = 1500, start = performance.now();
  const update = (now) => {
    const p = Math.min((now - start) / duration, 1);
    el.textContent = Math.floor((1-(1-p)*(1-p)) * target) + '+';
    if (p < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const statsSection = document.querySelector('.about-stats');
if (statsSection) counterObserver.observe(statsSection);

// ==========================================
// GITHUB REPOS
// ==========================================
function getLangColor(lang) {
  return { Python:'#3572A5', JavaScript:'#f1e05a', TypeScript:'#3178c6', HTML:'#e34c26',
    CSS:'#563d7c', Java:'#b07219', C:'#555555', Haskell:'#5e5086',
    PHP:'#4F5D95', Shell:'#89e051', Dart:'#00B4AB' }[lang] || '#8b949e';
}

function renderRepos() {
  if (!reposContainer || !cachedRepos.length) {
    if (reposContainer) reposContainer.innerHTML = `<p>${translations[currentLang]['projects.error']}</p>`;
    return;
  }
  reposContainer.innerHTML = cachedRepos.map(repo => `
    <article class="project-card">
      <div class="project-header">
        <h3>${repo.name}</h3>
        ${repo.stargazers_count > 0 ? `<span class="stars">⭐ ${repo.stargazers_count}</span>` : ''}
      </div>
      <p class="project-desc">${repo.description || translations[currentLang]['projects.noDesc']}</p>
      <div class="project-meta">
        ${repo.language ? `<span class="project-lang"><span class="lang-dot" style="background:${getLangColor(repo.language)}"></span>${repo.language}</span>` : ''}
        ${repo.topics?.length ? `<div class="project-tags">${repo.topics.slice(0,4).map(t=>`<span>${t}</span>`).join('')}</div>` : ''}
      </div>
      <div class="project-links">
        <a href="${repo.html_url}" target="_blank">${translations[currentLang]['project.code']}</a>
        ${repo.homepage ? `<a href="${repo.homepage}" target="_blank">Demo</a>` : ''}
      </div>
    </article>
  `).join('');

  document.querySelectorAll('.project-card').forEach((card, i) => {
    card.classList.add('hidden');
    card.style.transitionDelay = `${i * 0.1}s`;
    observer.observe(card);
  });
  initCardTilt();
}

function showGitHubError(msg) {
  if (!reposContainer) return;
  reposContainer.innerHTML = `
    <div style="grid-column:1/-1;text-align:center;padding:3rem;">
      <p style="color:var(--text-secondary);font-family:var(--font-mono);line-height:1.8;">
        ${msg}<br>
        <a href="https://github.com/${GITHUB_USERNAME}?tab=repositories" target="_blank"
           style="color:var(--accent-primary)">Voir les dépôts sur GitHub →</a>
      </p>
    </div>`;
}

async function fetchGitHubRepos() {
  if (!reposContainer) return;
  try {
    const controller = new AbortController();
    const tid = setTimeout(() => controller.abort(), 8000);

    const token = import.meta.env.VITE_GITHUB_TOKEN;
    const headers = { 'Accept': 'application/vnd.github+json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=12`,
      { headers, signal: controller.signal }
    );
    clearTimeout(tid);

    const remaining = res.headers.get('X-RateLimit-Remaining');
    const resetTs = res.headers.get('X-RateLimit-Reset');
    console.info(`GitHub API — Remaining: ${remaining} | Reset: ${resetTs ? new Date(resetTs*1000).toLocaleTimeString() : 'N/A'}`);

    if (res.status === 403 || res.status === 429) {
      const t = resetTs ? new Date(resetTs*1000).toLocaleTimeString() : '?';
      showGitHubError(`⚠️ Rate limit GitHub atteint. Réinitialisation à ${t}.`);
      return;
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const repos = await res.json();
    cachedRepos = repos
      .filter(r => r.name !== GITHUB_USERNAME && !r.fork)
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 6);

    renderRepos();
  } catch (err) {
    console.error('GitHub API error:', err);
    showGitHubError(err.name === 'AbortError'
      ? '⏱️ La requête GitHub a expiré (timeout).'
      : '⚠️ Impossible de charger les dépôts.');
  }
}

fetchGitHubRepos();

// ==========================================
// CONTACT FORM — DISCORD WEBHOOK
// ==========================================
const WEBHOOK_URL = import.meta.env.VITE_DISCORD_WEBHOOK_URL;
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    if (!name || !email || !message) return;

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = translations[currentLang]['contact.sending'];

    try {
      if (!WEBHOOK_URL) throw new Error('Webhook URL not configured');
      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ embeds: [{
          title: '📬 New Portfolio Contact', color: 0x64ffda,
          fields: [
            { name: '👤 Name', value: name, inline: true },
            { name: '📧 Email', value: email, inline: true },
            { name: '💬 Message', value: message },
          ],
          timestamp: new Date().toISOString(),
        }]}),
      });
      if (res.ok || res.status === 204) {
        formStatus.textContent = translations[currentLang]['contact.success'];
        formStatus.className = 'form-status success';
        contactForm.reset();
      } else throw new Error(`HTTP ${res.status}`);
    } catch (err) {
      console.error('Webhook error:', err);
      formStatus.textContent = translations[currentLang]['contact.error'];
      formStatus.className = 'form-status error';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = translations[currentLang]['contact.send'];
      setTimeout(() => { formStatus.textContent = ''; formStatus.className = 'form-status'; }, 5000);
    }
  });
}
