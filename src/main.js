import './style.css'
import { translations } from './translations.js'

// ==========================================
// LANGUAGE / i18n
// ==========================================
let currentLang = localStorage.getItem('lang') || 'en';

function changeLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  document.documentElement.lang = lang;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (translations[lang] && translations[lang][key]) {
      el.placeholder = translations[lang][key];
    }
  });

  const langToggle = document.getElementById('lang-toggle');
  if (langToggle) {
    const flag = langToggle.querySelector('.lang-flag');
    const label = langToggle.querySelector('.lang-label');
    if (lang === 'fr') {
      flag.textContent = '🇬🇧';
      label.textContent = 'EN';
    } else {
      flag.textContent = '🇫🇷';
      label.textContent = 'FR';
    }
  }

  updateTypingRoles();

  if (typeof renderRepos === 'function' && cachedRepos.length > 0) {
    renderRepos();
  }
}

const langToggle = document.getElementById('lang-toggle');
if (langToggle) {
  langToggle.addEventListener('click', () => {
    const newLang = currentLang === 'en' ? 'fr' : 'en';
    changeLanguage(newLang);
  });
}

changeLanguage(currentLang);

// ==========================================
// MOBILE MENU
// ==========================================
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navbar = document.getElementById('navbar');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('nav-open');
  hamburger.classList.toggle('active');
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
      navLinks.classList.remove('nav-open');
      hamburger.classList.remove('active');
    }
  });
});

// ==========================================
// NAVBAR SCROLL EFFECT
// ==========================================
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ==========================================
// SMOOTH SCROLLING
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 70,
        behavior: 'smooth'
      });
      history.pushState(null, null, targetId);
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

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    if (scrollY >= (sectionTop - 200)) {
      current = section.getAttribute('id');
    }
  });

  navItems.forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href').includes(current)) {
      a.classList.add('active');
    }
  });
});

// ==========================================
// TYPING EFFECT
// ==========================================
const typingEl = document.getElementById('typing-text');
let typingRoles = [];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingTimeout = null;

function updateTypingRoles() {
  const roles = translations[currentLang]?.['hero.roles'];
  if (roles) {
    typingRoles = roles;
  } else {
    typingRoles = ['Python Developer', 'Web Developer', 'Open Source Enthusiast'];
  }
}

updateTypingRoles();

function typeEffect() {
  if (!typingEl || typingRoles.length === 0) return;

  const currentRole = typingRoles[roleIndex % typingRoles.length];

  if (isDeleting) {
    charIndex--;
    typingEl.textContent = currentRole.substring(0, charIndex);
  } else {
    charIndex++;
    typingEl.textContent = currentRole.substring(0, charIndex);
  }

  let delay = isDeleting ? 40 : 80;

  if (!isDeleting && charIndex === currentRole.length) {
    delay = 2000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex++;
    delay = 400;
  }

  typingTimeout = setTimeout(typeEffect, delay);
}

typeEffect();

// ==========================================
// INTERACTIVE PARTICLE CANVAS
// ==========================================
const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let mouse = { x: null, y: null, radius: 120 };

canvas.addEventListener('mousemove', (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
});

canvas.addEventListener('mouseleave', () => {
  mouse.x = null;
  mouse.y = null;
});

let particlesArray;

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.baseSpeedX = (Math.random() - 0.5) * 0.6;
    this.baseSpeedY = (Math.random() - 0.5) * 0.6;
    this.speedX = this.baseSpeedX;
    this.speedY = this.baseSpeedY;

    const colors = [
      'rgba(100, 255, 218, 0.4)',
      'rgba(91, 141, 238, 0.3)',
      'rgba(168, 85, 247, 0.3)',
      'rgba(100, 255, 218, 0.2)',
    ];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }

  update() {
    // Mouse interaction: push particles away
    if (mouse.x !== null && mouse.y !== null) {
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < mouse.radius) {
        const force = (mouse.radius - dist) / mouse.radius;
        const angle = Math.atan2(dy, dx);
        this.speedX = this.baseSpeedX + Math.cos(angle) * force * 2;
        this.speedY = this.baseSpeedY + Math.sin(angle) * force * 2;
      } else {
        this.speedX += (this.baseSpeedX - this.speedX) * 0.05;
        this.speedY += (this.baseSpeedY - this.speedY) * 0.05;
      }
    } else {
      this.speedX += (this.baseSpeedX - this.speedX) * 0.05;
      this.speedY += (this.baseSpeedY - this.speedY) * 0.05;
    }

    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x > canvas.width) this.x = 0;
    if (this.x < 0) this.x = canvas.width;
    if (this.y > canvas.height) this.y = 0;
    if (this.y < 0) this.y = canvas.height;
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
  const numberOfParticles = Math.min(Math.floor((canvas.width * canvas.height) / 8000), 120);
  for (let i = 0; i < numberOfParticles; i++) {
    particlesArray.push(new Particle());
  }
}

function connectParticles() {
  const maxDist = 130;
  for (let i = 0; i < particlesArray.length; i++) {
    for (let j = i + 1; j < particlesArray.length; j++) {
      const dx = particlesArray[i].x - particlesArray[j].x;
      const dy = particlesArray[i].y - particlesArray[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < maxDist) {
        const opacity = 0.12 * (1 - dist / maxDist);
        ctx.strokeStyle = `rgba(100, 255, 218, ${opacity})`;
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
        ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update();
    particlesArray[i].draw();
  }
  connectParticles();
  requestAnimationFrame(animateParticles);
}

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initParticles();
});

initParticles();
animateParticles();

// ==========================================
// SCROLL REVEAL (Intersection Observer)
// ==========================================
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      obs.unobserve(entry.target);
    }
  });
}, observerOptions);

const scrollElements = document.querySelectorAll('.section-title, .section-subtitle, .skill-category, .about-text, .stat-card, .about-stats');
scrollElements.forEach((el, i) => {
  el.classList.add('hidden');
  el.style.transitionDelay = `${i * 0.08}s`;
  observer.observe(el);
});

// ==========================================
// COUNTER ANIMATION
// ==========================================
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-count'));
  const duration = 1500;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - (1 - progress) * (1 - progress);
    const current = Math.floor(ease * target);
    el.textContent = current + '+';

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const counters = entry.target.querySelectorAll('[data-count]');
      counters.forEach(c => animateCounter(c));
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const statsSection = document.querySelector('.about-stats');
if (statsSection) {
  counterObserver.observe(statsSection);
}

// ==========================================
// GITHUB REPOS INTEGRATION
// ==========================================
const GITHUB_USERNAME = 'naveoo';
const reposContainer = document.getElementById('github-repos');
let cachedRepos = [];

function renderRepos() {
  if (cachedRepos.length === 0) {
    reposContainer.innerHTML = `<p>${translations[currentLang]['projects.error']}</p>`;
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
        ${repo.topics && repo.topics.length > 0 ? `<div class="project-tags">${repo.topics.slice(0, 4).map(t => `<span>${t}</span>`).join('')}</div>` : ''}
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
}

async function fetchGitHubRepos() {
  try {
    const response = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`,
      {
        headers: {
          'Accept': 'application/vnd.github+json'
        }
      }
    );

    if (response.status === 403) {
      console.warn('GitHub API rate limit reached');
      reposContainer.innerHTML = `<p>${translations[currentLang]['projects.error']}</p>`;
      return;
    }
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const repos = await response.json();
    cachedRepos = repos.filter(r => r.name !== GITHUB_USERNAME && !r.fork);

    renderRepos();
  } catch (err) {
    console.error('GitHub API error:', err);
    reposContainer.innerHTML = `<p>${translations[currentLang]['projects.error']}</p>`;
  }
}

function getLangColor(lang) {
  const colors = {
    'Python': '#3572A5',
    'JavaScript': '#f1e05a',
    'TypeScript': '#3178c6',
    'HTML': '#e34c26',
    'CSS': '#563d7c',
    'Java': '#b07219',
    'C': '#555555',
    'Haskell': '#5e5086',
    'PHP': '#4F5D95',
    'Shell': '#89e051',
    'Dart': '#00B4AB',
  };
  return colors[lang] || '#8b949e';
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
    const payload = {
      embeds: [{
        title: "📬 New Portfolio Contact",
        color: 0x64ffda,
        fields: [
          { name: "👤 Name", value: name, inline: true },
          { name: "📧 Email", value: email, inline: true },
          { name: "💬 Message", value: message }
        ],
        timestamp: new Date().toISOString()
      }]
    };

    try {
      if (!WEBHOOK_URL) {
        throw new Error('Webhook URL not configured');
      }

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok || response.status === 204) {
        formStatus.textContent = translations[currentLang]['contact.success'];
        formStatus.className = 'form-status success';
        contactForm.reset();
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (err) {
      console.error('Webhook error:', err);
      formStatus.textContent = translations[currentLang]['contact.error'];
      formStatus.className = 'form-status error';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = translations[currentLang]['contact.send'];

      setTimeout(() => {
        formStatus.textContent = '';
        formStatus.className = 'form-status';
      }, 5000);
    }
  });
}
