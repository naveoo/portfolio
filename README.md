<div align="center">

# 🚀 Dev.Portfolio

A modern, interactive developer portfolio built with **Vanilla JavaScript** and **Vite**.

![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)
![CSS3](https://img.shields.io/badge/CSS3-Custom_Properties-1572B6?logo=css3&logoColor=white)

</div>

---

## ✨ Features

| Feature | Description |
|---------|------------|
| 🌑 **Dark Theme** | Sleek dark mode with neon cyan & purple accents |
| 🎨 **Glassmorphism** | Translucent card effects with backdrop blur |
| ✨ **Particle Canvas** | Animated HTML5 Canvas background in the hero section |
| 📜 **Scroll Reveal** | Intersection Observer-based fade-in animations |
| 🐙 **GitHub Integration** | Projects fetched dynamically from the GitHub API |
| 🌐 **i18n (EN/FR)** | Full English ↔ French localization with `localStorage` persistence |
| 📬 **Discord Webhook** | Contact form sends messages directly to a Discord channel |
| 📱 **Responsive** | Mobile-first design with hamburger menu |

## 🛠️ Tech Stack

- **Build Tool** — [Vite](https://vitejs.dev/)
- **Styling** — Vanilla CSS (Custom Properties, Flexbox, Grid)
- **Typography** — [Inter](https://fonts.google.com/specimen/Inter) (Google Fonts)
- **Deployment** — GitHub Pages via GitHub Actions

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/naveoo/portfolio.git
cd portfolio

# Install dependencies
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
npm run preview  # Preview the production build locally
```

## 📁 Project Structure

```
portfolio/
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Actions CI/CD
├── public/
│   └── logo.svg
├── src/
│   ├── main.js               # Core logic (i18n, particles, GitHub API, webhook)
│   ├── translations.js       # EN/FR translation dictionary
│   └── style.css             # Full design system
├── index.html                # Entry point
├── vite.config.js            # Vite configuration (base path)
├── .env                      # Environment variables (not committed)
└── package.json
```

## 🤝 Customization

| What | Where |
|------|-------|
| Your name & bio | `index.html` (hero section, about section) |
| Skills list | `index.html` (skills section) |
| Translations | `src/translations.js` |
| GitHub username | `src/main.js` → `GITHUB_USERNAME` |
| Colors & theme | `src/style.css` → `:root` variables |
| Base URL | `vite.config.js` → `base` |

---

<div align="center">

Made with ❤️ by [Naveo](https://github.com/naveoo)

</div>
