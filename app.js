let currentLang = 'en';

document.addEventListener('DOMContentLoaded', () => {
  initLanguage();
  initNavbar();
  initMobileMenu();
  initSectionSpy();
  initRevealAnimation();
});

function initLanguage() {
  const savedLang = localStorage.getItem('preferredLang') || 'en';
  currentLang = savedLang;
  applyTranslations(currentLang);

  const langToggle = document.getElementById('lang-toggle');
  if (langToggle) {
    langToggle.addEventListener('click', () => {
      currentLang = currentLang === 'en' ? 'zh' : 'en';
      localStorage.setItem('preferredLang', currentLang);
      applyTranslations(currentLang);
    });
  }
}

function applyTranslations(lang) {
  const dictionary = translations[lang] || translations.en;
  document.documentElement.lang = lang;

  if (dictionary['meta.title']) {
    document.title = dictionary['meta.title'];
  }

  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc && dictionary['meta.description']) {
    metaDesc.setAttribute('content', dictionary['meta.description']);
  }

  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const key = element.getAttribute('data-i18n');
    if (dictionary[key] !== undefined) {
      element.textContent = dictionary[key];
    }
  });

  const langText = document.getElementById('lang-text');
  if (langText) {
    langText.textContent = lang === 'en' ? 'ZH' : 'EN';
  }
}

function initNavbar() {
  const header = document.getElementById('header');
  if (!header) return;

  const updateHeader = () => {
    header.classList.toggle('scrolled', window.scrollY > 24);
  };

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
}

function initMobileMenu() {
  const toggle = document.getElementById('mobile-toggle');
  const nav = document.querySelector('.site-nav');
  const navLinks = document.getElementById('nav-links');
  if (!toggle || !nav || !navLinks) return;

  const setOpen = (isOpen) => {
    nav.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    const icon = toggle.querySelector('i');
    if (icon) {
      icon.className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
    }
  };

  toggle.addEventListener('click', () => {
    setOpen(!nav.classList.contains('open'));
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });
}

function initSectionSpy() {
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute('id');
      navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    });
  }, {
    root: null,
    rootMargin: '-35% 0px -55% 0px',
    threshold: 0
  });

  sections.forEach((section) => observer.observe(section));
}

function initRevealAnimation() {
  const revealItems = document.querySelectorAll('.reveal');
  if (!revealItems.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, {
    root: null,
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.15
  });

  revealItems.forEach((item) => observer.observe(item));
}
