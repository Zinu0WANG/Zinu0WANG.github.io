// JavaScript for Personal Portfolio Website

let currentLang = 'en';
let terminalTimeoutId = null;

document.addEventListener('DOMContentLoaded', () => {
  initLanguage();
  initNavbar();
  initMobileMenu();
  initSectionSpy();
  initTerminalSimulation();
});

// 1. Language Localization & State Handling
function initLanguage() {
  // Read preference from localStorage or fall back to English by default
  let savedLang = localStorage.getItem('preferredLang');
  if (!savedLang) {
    savedLang = 'en';
  }
  currentLang = savedLang;
  applyTranslations(currentLang);

  // Setup click handler for toggle button
  const langToggle = document.getElementById('lang-toggle');
  if (langToggle) {
    langToggle.addEventListener('click', () => {
      currentLang = currentLang === 'en' ? 'zh' : 'en';
      localStorage.setItem('preferredLang', currentLang);
      applyTranslations(currentLang);
      
      // Clean restart the terminal simulation using translated steps
      initTerminalSimulation();
    });
  }

  // Setup contact form submission alert translation
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert(translations[currentLang]['contact.alert_success']);
    });
  }
}

function applyTranslations(lang) {
  // Update document language attribute
  document.documentElement.lang = lang;

  // Update SEO Document Title and Description
  if (translations[lang]["meta.title"]) {
    document.title = translations[lang]["meta.title"];
  }
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc && translations[lang]["meta.description"]) {
    metaDesc.setAttribute('content', translations[lang]["meta.description"]);
  }

  // Translate all elements with data-i18n markers
  const i18nElements = document.querySelectorAll('[data-i18n]');
  i18nElements.forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key] !== undefined) {
      el.textContent = translations[lang][key];
    }
  });

  // Translate elements with placeholders (such as form inputs)
  const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
  placeholderElements.forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (translations[lang] && translations[lang][key] !== undefined) {
      el.setAttribute('placeholder', translations[lang][key]);
    }
  });

  // Toggle button indicator text (if current is EN, show button to switch to ZH, and vice versa)
  const langText = document.getElementById('lang-text');
  if (langText) {
    langText.textContent = lang === 'en' ? 'ZH' : 'EN';
  }
}

// 2. Navbar Scroll Effect
function initNavbar() {
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

// 3. Mobile Menu Toggle
function initMobileMenu() {
  const toggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');
  const links = navLinks.querySelectorAll('a');

  toggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const icon = toggle.querySelector('i');
    if (navLinks.classList.contains('active')) {
      icon.className = 'fa-solid fa-xmark';
    } else {
      icon.className = 'fa-solid fa-bars';
    }
  });

  // Close menu when a link is clicked
  links.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      toggle.querySelector('i').className = 'fa-solid fa-bars';
    });
  });
}

// 4. Section Spy (Highlight Active Nav Link on Scroll)
function initSectionSpy() {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-links a');

  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -60% 0px', // Adjust to trigger in the middle area of the viewport
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    observer.observe(section);
  });
}

// 5. Terminal Simulation (Typing and Agent Execution Output)
function initTerminalSimulation() {
  const terminal = document.getElementById('terminal-body');
  if (!terminal) return;

  // Clear any existing active timeout to avoid overlapping step execution
  if (terminalTimeoutId) {
    clearTimeout(terminalTimeoutId);
  }

  // Clear terminal body and render initial blinking prompt
  terminal.innerHTML = '';
  
  const initialCursor = document.createElement('div');
  initialCursor.className = 'terminal-line terminal-line-cursor';
  initialCursor.innerHTML = '<span class="prefix">sys@agent:~#</span> <span class="cursor-blink">█</span>';
  terminal.appendChild(initialCursor);

  let currentStep = 0;
  const simulationSteps = translations[currentLang]["terminal.steps"] || [];

  function runNextStep() {
    if (currentStep >= simulationSteps.length) {
      // Clear terminal (except for header) and restart simulation after a short delay
      terminalTimeoutId = setTimeout(() => {
        terminal.innerHTML = '';
        currentStep = 0;
        appendTerminalLine('sys@agent:~#', translations[currentLang]["hero.terminal_cmd"] || 'python run_agent.py --orchestrate', 'cmd');
        terminalTimeoutId = setTimeout(runNextStep, 1000);
      }, 5000);
      return;
    }

    const step = simulationSteps[currentStep];
    let prefix = 'sys@agent:~#';
    let lineClass = 'output';

    if (step.type === 'cmd') {
      prefix = 'sys@agent:~#';
      lineClass = 'cmd';
    } else if (step.type === 'system') {
      prefix = '[sys]';
      lineClass = 'output';
    } else if (step.type === 'mcp') {
      prefix = '[mcp]';
      lineClass = 'accent';
    } else if (step.type === 'success') {
      prefix = '[ok]';
      lineClass = 'success';
    } else if (step.type === 'input') {
      prefix = '[usr]';
      lineClass = 'output';
    } else if (step.type === 'thought') {
      prefix = '[cog]';
      lineClass = 'accent';
    } else if (step.type === 'tool') {
      prefix = '[call]';
      lineClass = 'output';
    } else if (step.type === 'tool-response') {
      prefix = '[resp]';
      lineClass = 'success';
    }

    appendTerminalLine(prefix, step.text, lineClass);
    currentStep++;

    // Scroll to bottom of terminal
    terminal.scrollTop = terminal.scrollHeight;

    // Calculate delay based on step type
    let nextDelay = 1500;
    if (step.type === 'cmd') nextDelay = 2000;
    if (step.type === 'thought') nextDelay = 2500;
    
    terminalTimeoutId = setTimeout(runNextStep, nextDelay);
  }

  function appendTerminalLine(prefixText, contentText, contentClass) {
    // Remove cursor blinking line if it exists
    const oldCursor = terminal.querySelector('.terminal-line-cursor');
    if (oldCursor) {
      oldCursor.remove();
    }

    const line = document.createElement('div');
    line.className = 'terminal-line';

    const prefix = document.createElement('span');
    prefix.className = 'prefix';
    prefix.textContent = prefixText + ' ';

    const content = document.createElement('span');
    content.className = contentClass;
    content.textContent = contentText;

    line.appendChild(prefix);
    line.appendChild(content);
    terminal.appendChild(line);

    // Re-append a new cursor blinking line
    const cursorLine = document.createElement('div');
    cursorLine.className = 'terminal-line terminal-line-cursor';
    cursorLine.innerHTML = '<span class="prefix">sys@agent:~#</span> <span class="cursor-blink">█</span>';
    terminal.appendChild(cursorLine);
  }

  // Start the simulation loop after initial page render
  terminalTimeoutId = setTimeout(runNextStep, 2000);
}
