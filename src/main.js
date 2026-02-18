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
  navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
  if (navLinks.style.display === 'flex') {
    navLinks.style.flexDirection = 'column';
    navLinks.style.position = 'absolute';
    navLinks.style.top = '100%';
    navLinks.style.left = '0';
    navLinks.style.width = '100%';
    navLinks.style.backgroundColor = 'var(--nav-bg)';
    navLinks.style.padding = '1rem';
    navLinks.style.borderBottom = '1px solid var(--card-border)';
  }
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
      navLinks.style.display = 'none';
    }
  });
});

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
  } else {
    navbar.style.boxShadow = 'none';
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
// PARTICLE CANVAS BACKGROUND
// ==========================================
const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray;

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 1;
    this.speedX = Math.random() * 1 - 0.5;
    this.speedY = Math.random() * 1 - 0.5;
    this.color = 'rgba(100, 255, 218, 0.2)';
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
    if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
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
  const numberOfParticles = Math.min((canvas.width * canvas.height) / 9000, 100);
  for (let i = 0; i < numberOfParticles; i++) {
    particlesArray.push(new Particle());
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update();
    particlesArray[i].draw();
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

const scrollElements = document.querySelectorAll('.section-title, .skill-category, .about-text');
scrollElements.forEach((el) => {
  el.classList.add('hidden');
  observer.observe(el);
});

// ==========================================
// GITHUB REPOS INTEGRATION
// ==========================================
const GITHUB_USERNAME = 'naveoo';
const reposContainer = document.getElementById('github-repos');

async function fetchGitHubRepos() {
  try {
    const response = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`
    );
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const repos = await response.json();

    const filtered = repos.filter(r => r.name !== GITHUB_USERNAME);

    if (filtered.length === 0) {
      reposContainer.innerHTML = `<p>${translations[currentLang]['projects.error']}</p>`;
      return;
    }

    reposContainer.innerHTML = filtered.map(repo => `
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

    document.querySelectorAll('.project-card').forEach(card => {
      card.classList.add('hidden');
      observer.observe(card);
    });

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
