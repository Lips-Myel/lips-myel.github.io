// ================================================
// Theme Toggle - dark by default + system preference
// ================================================

const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const toggleIcon = document.querySelector('.toggle-icon');
const logoImg = document.querySelector('.logo-img');
const footerLogo = document.querySelector('.footer-logo');

const LOGO_BLACK = '../img/lips-creation-black.png';
const LOGO_WHITE = '../img/lips-creation-white.png';

const icon_sun = '../img/sun.svg';
const icon_moon = '../img/moon-stars.svg';

function updateLogos(isDark) {
  const src = isDark ? LOGO_WHITE : LOGO_BLACK;
  if (logoImg) logoImg.src = src;
  if (footerLogo) footerLogo.src = src;
}

function updateIcon(isDark) {
  if (toggleIcon) toggleIcon.src = isDark ? icon_moon : icon_sun;
}

function applyTheme(isDark) {
  if (isDark) {
    body.classList.add('dark-mode');
  } else {
    body.classList.remove('dark-mode');
  }
  updateLogos(isDark);
  updateIcon(isDark);
}

// Priorité : localStorage > préférence système > dark par défaut
const savedTheme = localStorage.getItem('theme');
const prefersDark = globalThis.matchMedia('(prefers-color-scheme: dark)');

let isDark;
if (savedTheme) {
  isDark = savedTheme === 'dark';
} else {
  // Pas de préférence sauvegardée → préférence système, sinon dark par défaut
  isDark = prefersDark.matches === undefined ? true : prefersDark.matches;
}

applyTheme(isDark);

// Écoute les changements de préférence système (seulement si pas de localStorage)
prefersDark.addEventListener('change', (e) => {
  if (!localStorage.getItem('theme')) {
    applyTheme(e.matches);
  }
});

// Clic bouton toggle
themeToggle.addEventListener('click', () => {
  const nowDark = !body.classList.contains('dark-mode');
  applyTheme(nowDark);
  localStorage.setItem('theme', nowDark ? 'dark' : 'light');
  createRipple(themeToggle);
});

// ================================================
// Mobile Menu Toggle
// ================================================

const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const nav = document.querySelector('.nav');

mobileMenuToggle.addEventListener('click', () => {
  nav.classList.toggle('active');
  mobileMenuToggle.classList.toggle('active');
  body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('active');
    mobileMenuToggle.classList.remove('active');
    body.style.overflow = '';
  });
});

document.addEventListener('click', (e) => {
  if (!nav.contains(e.target) && !mobileMenuToggle.contains(e.target) && nav.classList.contains('active')) {
    nav.classList.remove('active');
    mobileMenuToggle.classList.remove('active');
    body.style.overflow = '';
  }
});

// ================================================
// Smooth Scroll
// ================================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ================================================
// Contact Form + reCAPTCHA
// ================================================

const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formMessage = document.getElementById('formMessage');
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;

    formMessage.style.display = 'block';
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="btn-text">Envoi en cours...</span>';

    try {
      const formData = new FormData(contactForm);

      if (typeof grecaptcha !== 'undefined' && grecaptcha?.getResponse) {
        const token = grecaptcha.getResponse();
        if (!token) {
          formMessage.textContent = "Veuillez valider le reCAPTCHA avant d'envoyer.";
          formMessage.className = 'form-message error';
          return;
        }
        formData.set('g-recaptcha-response', token);
      }

      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        formMessage.textContent = 'Message envoyé avec succès ! Je vous répondrai très bientôt.';
        formMessage.className = 'form-message success';
        contactForm.reset();
        if (typeof grecaptcha !== 'undefined' && grecaptcha?.reset) {
          grecaptcha.reset();
        }
      } else {
        const data = await response.json().catch(() => null);
        formMessage.textContent = data?.errors
          ? 'Erreur : ' + data.errors.map(err => err.message).join(', ')
          : "Erreur lors de l'envoi. Veuillez réessayer.";
        formMessage.className = 'form-message error';
      }
    } catch (error) {
      console.error('Form submission error:', error);
      formMessage.textContent = 'Erreur de connexion. Vérifiez votre connexion internet et réessayez.';
      formMessage.className = 'form-message error';
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
      setTimeout(() => {
        formMessage.style.display = 'none';
        formMessage.className = 'form-message';
      }, 6000);
    }
  });
}

// ================================================
// Intersection Observer - scroll animations
// ================================================

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.expertise-card, .project-card').forEach((card, index) => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(50px)';
  card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
  observer.observe(card);
});

// ================================================
// Header scroll effect
// ================================================

const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
  if (window.pageYOffset > 100) {
    header.style.boxShadow = '0 4px 30px var(--shadow-hover)';
  } else {
    header.style.boxShadow = '0 2px 30px var(--shadow-color)';
  }
});

// ================================================
// Parallax hero
// ================================================

const heroVisual = document.querySelector('.hero-visual');
if (heroVisual) {
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    if (scrolled < window.innerHeight) {
      heroVisual.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
  });
}

// ================================================
// Ripple effect
// ================================================

function createRipple(element) {
  const ripple = document.createElement('span');
  const rect = element.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);

  ripple.style.cssText = `
    width: ${size}px;
    height: ${size}px;
    position: absolute;
    border-radius: 50%;
    background: rgba(255,255,255,0.5);
    transform: scale(0);
    animation: ripple-animation 0.6s ease-out;
    pointer-events: none;
  `;

  element.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
}

document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function (e) {
    const ripple = document.createElement('div');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);

    ripple.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${e.clientX - rect.left - size / 2}px;
      top: ${e.clientY - rect.top - size / 2}px;
    `;
    ripple.classList.add('ripple-effect');
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

const style = document.createElement('style');
style.textContent = `
  @keyframes ripple-animation {
    to { transform: scale(4); opacity: 0; }
  }
  .ripple-effect {
    position: absolute;
    border-radius: 50%;
    background: rgba(255,255,255,0.6);
    transform: scale(0);
    animation: ripple-animation 0.6s ease-out;
    pointer-events: none;
  }
`;
document.head.appendChild(style);

// ================================================
// Konami code easter egg
// ================================================

let konamiCode = [];
const konamiSequence = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];

document.addEventListener('keydown', (e) => {
  konamiCode.push(e.key);
  if (konamiCode.length > konamiSequence.length) konamiCode.shift();
  if (konamiCode.join(',') === konamiSequence.join(',')) {
    document.body.style.animation = 'rainbow 2s infinite';
    setTimeout(() => { document.body.style.animation = ''; }, 5000);
  }
});

// ================================================
// Console signature
// ================================================

console.log('%c🎸 Lips Creation 💋', 'font-size: 24px; font-weight: bold; color: #ee2646; text-shadow: 2px 2px 0 #bc2551;');
console.log('%cDevelopment by Lips Myel ★', 'font-size: 14px; color: #ee2646;');
console.log('%cVous cherchez des secrets ? Continue... 😏', 'font-size: 12px; font-style: italic; color: #999;');
