// Theme Toggle with localStorage persistence
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const prefersDark = globalThis.matchMedia('(prefers-color-scheme: dark)');

const logoImg = document.querySelector('.logo-img');
const footerLogo = document.querySelector('.footer-logo');

const LOGO_BLACK = '../img/lips-creation-black.png';
const LOGO_WHITE = '../img/lips-creation-white.png';

function updateLogos(isDark) {
  const src = isDark ? LOGO_WHITE : LOGO_BLACK;
  if (logoImg) logoImg.src = src;
  if (footerLogo) footerLogo.src = src;
}


// Initialize theme
const currentTheme = localStorage.getItem('theme') || (prefersDark.matches ? 'dark' : 'light');
if (currentTheme === 'dark') {
  body.classList.add('dark-mode');
}
updateLogos(body.classList.contains('dark-mode'));

themeToggle.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  const isDark = body.classList.contains('dark-mode');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');

  updateLogos(isDark);
  createRipple(themeToggle);
});


// Mobile Menu Toggle
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const nav = document.querySelector('.nav');

mobileMenuToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
    mobileMenuToggle.classList.toggle('active');
    body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
});

// Close mobile menu on link click
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        body.style.overflow = '';
    });
});

// Close mobile menu when clicking on social icons
document.querySelectorAll('.mobile-social-icon').forEach(icon => {
    icon.addEventListener('click', () => {
        // Ne ferme pas le menu pour permettre l'ouverture du lien
        // mais tu peux le fermer si tu veux :
        // nav.classList.remove('active');
        // mobileMenuToggle.classList.remove('active');
        // body.style.overflow = '';
    });
});

// Close mobile menu on outside click
document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !mobileMenuToggle.contains(e.target) && nav.classList.contains('active')) {
        nav.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        body.style.overflow = '';
    }
});

// Smooth scroll for all links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Contact Form Handling with Formspree
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formMessage = document.getElementById('formMessage');
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        
        // Disable submit button
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="btn-text">Envoi en cours...</span>';
        
        try {
            const formData = new FormData(contactForm);
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                formMessage.textContent = '✨ Message envoyé avec succès ! Je vous répondrai très bientôt.';
                formMessage.className = 'form-message success';
                contactForm.reset();
                
                // Reset reCAPTCHA
                if (typeof grecaptcha !== 'undefined') {
                    grecaptcha.reset();
                }
            } else {
                const data = await response.json();
                if (data.errors) {
                    formMessage.textContent = '❌ ' + data.errors.map(error => error.message).join(', ');
                } else {
                    formMessage.textContent = '❌ Erreur lors de l\'envoi. Veuillez réessayer.';
                }
                formMessage.className = 'form-message error';
            }
        } catch (error) {
            console.error('Form submission error:', error);
            formMessage.textContent = '❌ Erreur de connexion. Vérifiez votre connexion internet et réessayez.';
            formMessage.className = 'form-message error';
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
            
            // Hide message after 6 seconds
            setTimeout(() => {
                formMessage.style.display = 'none';
                formMessage.className = 'form-message';
            }, 6000);
        }
    });
}


// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe cards with staggered animation
document.querySelectorAll('.expertise-card, .project-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(50px)';
    card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(card);
});

// Header scroll effect
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.boxShadow = '0 4px 30px var(--shadow-hover)';
    } else {
        header.style.boxShadow = '0 2px 30px var(--shadow-color)';
    }
    
    lastScroll = currentScroll;
});

// Parallax effect on hero visual
const heroVisual = document.querySelector('.hero-visual');
if (heroVisual) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.3;
        if (scrolled < window.innerHeight) {
            heroVisual.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        }
    });
}

// Cursor trail effect (subtle)
let cursorTrail = [];
const maxTrailLength = 10;

document.addEventListener('mousemove', (e) => {
    if (window.innerWidth > 768) {
        cursorTrail.push({ x: e.clientX, y: e.clientY });
        if (cursorTrail.length > maxTrailLength) {
            cursorTrail.shift();
        }
    }
});

// Ripple effect helper
function createRipple(element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(255, 255, 255, 0.5)';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple-animation 0.6s ease-out';
    ripple.style.pointerEvents = 'none';
    
    element.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
}

// Add ripple animation to buttons
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const ripple = document.createElement('div');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple-effect');
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add CSS for ripple animation dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .ripple-effect {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
`;
document.head.appendChild(style);

// Easter egg: Konami code
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        document.body.style.animation = 'rainbow 2s infinite';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 5000);
    }
});



// Console signature
console.log('%c🎸 Lips Creation 💋', 'font-size: 24px; font-weight: bold; color: #ee2646; text-shadow: 2px 2px 0 #bc2551;');
console.log('%cDevelopment by Lips Myel ★', 'font-size: 14px; color: #ee2646;');
console.log('%cVous cherchez des secrets ? Continue... 😏', 'font-size: 12px; font-style: italic; color: #999;');
