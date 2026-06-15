// JavaScript for Personal Portfolio Website

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initSectionSpy();
  initTerminalSimulation();
});

// 1. Navbar Scroll Effect
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

// 2. Mobile Menu Toggle
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

// 3. Section Spy (Highlight Active Nav Link on Scroll)
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

// 4. Terminal Simulation (Typing and Agent Execution Output)
function initTerminalSimulation() {
  const terminal = document.getElementById('terminal-body');
  if (!terminal) return;

  const simulationSteps = [
    { type: 'cmd', text: 'python run_agent.py --orchestrate' },
    { type: 'system', text: '[System] Initializing Multi-Agent Orchestration Engine...' },
    { type: 'mcp', text: '[MCP] Fetching server schemas (SQLite, Filesystem, Web Search)...' },
    { type: 'success', text: '[Success] Registered 3 MCP tools with Agent reasoning core.' },
    { type: 'input', text: 'User: "Optimize context precision in RAG database."' },
    { type: 'thought', text: '[Agent Thought] Analyzing request. Action needed: Retrieve documents via Parent-Document Retrieval.' },
    { type: 'tool', text: '[MCP Call] -> doc_retriever.search(strategy="parent-document", query="context precision")' },
    { type: 'tool-response', text: '[MCP Response] <- Returning parent chunks (doc_id_817, doc_id_944). Accuracy metrics high.' },
    { type: 'thought', text: '[Agent Thought] Processing parent contexts. Filtering noise and redundant strings.' },
    { type: 'success', text: '[Agent Response] Context optimized. Precision improved by +34%. Hallucination metrics decreased.' },
    { type: 'cmd', text: 'git commit -m "feat: standardise agent loops using MCP"' },
    { type: 'success', text: '[git] 4 files changed, 114 insertions(+), 12 deletions(-)' }
  ];

  let currentStep = 0;

  function runNextStep() {
    if (currentStep >= simulationSteps.length) {
      // Clear terminal (except for header) and restart simulation after a short delay
      setTimeout(() => {
        terminal.innerHTML = '';
        currentStep = 0;
        // Append baseline prompt
        appendTerminalLine('sys@agent:~#', 'python run_agent.py --orchestrate', 'cmd');
        setTimeout(runNextStep, 1000);
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
    
    setTimeout(runNextStep, nextDelay);
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
  setTimeout(runNextStep, 2000);
}
