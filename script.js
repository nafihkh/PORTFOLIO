/* ===== CANVAS BACKGROUND ===== */
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

// Particles
const particles = Array.from({ length: 80 }, () => ({
  x: Math.random() * window.innerWidth,
  y: Math.random() * window.innerHeight,
  vx: (Math.random() - 0.5) * 0.4,
  vy: (Math.random() - 0.5) * 0.4,
  r: Math.random() * 1.5 + 0.5,
  alpha: Math.random() * 0.6 + 0.2,
}));

let mouse = { x: -9999, y: -9999 };
window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

function drawGrid() {
  const size = 60;
  ctx.strokeStyle = 'rgba(0,245,255,0.04)';
  ctx.lineWidth = 1;
  for (let x = 0; x < canvas.width; x += size) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += size) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
  }
}

function animateBg() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();

  particles.forEach(p => {
    // Mouse repel
    const dx = p.x - mouse.x, dy = p.y - mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 120) {
      p.vx += dx / dist * 0.15;
      p.vy += dy / dist * 0.15;
    }

    p.vx *= 0.99; p.vy *= 0.99;
    p.x += p.vx; p.y += p.vy;

    if (p.x < 0) p.x = canvas.width;
    if (p.x > canvas.width) p.x = 0;
    if (p.y < 0) p.y = canvas.height;
    if (p.y > canvas.height) p.y = 0;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,245,255,${p.alpha})`;
    ctx.fill();
  });

  // Connect nearby particles
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 100) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(0,245,255,${0.12 * (1 - d / 100)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(animateBg);
}
animateBg();

/* ===== SCOREBOARD ===== */
let score = 0;
const scoreEl = document.getElementById('score-val');
function addScore(n) {
  score += n;
  scoreEl.textContent = String(score).padStart(6, '0');
}
// Increment score on scroll
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const s = window.scrollY;
  if (s > lastScroll + 50) { addScore(10); lastScroll = s; }
});

/* ===== NAV SCROLL HIGHLIGHT ===== */
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current ? 'var(--cyan)' : '';
    a.style.textShadow = a.getAttribute('href') === '#' + current ? '0 0 12px var(--cyan)' : '';
  });
});

/* ===== HAMBURGER ===== */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
document.querySelectorAll('.mob-link').forEach(l => l.addEventListener('click', () => mobileMenu.classList.remove('open')));

/* ===== SKILL BARS ANIMATION ===== */
const skillFills = document.querySelectorAll('.skill-fill');
const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('animated'), 200);
      skillObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
skillFills.forEach(f => skillObserver.observe(f));

/* ===== CARD ENTRANCE ANIMATIONS ===== */
const cards = document.querySelectorAll('.service-card, .project-card, .ach-card');
const cardObs = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      e.target.style.transition = `opacity 0.5s ${i * 0.07}s, transform 0.5s ${i * 0.07}s`;
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
      cardObs.unobserve(e.target);
      addScore(5);
    }
  });
}, { threshold: 0.1 });
cards.forEach(c => {
  c.style.opacity = '0';
  c.style.transform = 'translateY(30px)';
  cardObs.observe(c);
});

/* ===== CONTACT FORM ===== */
const form = document.getElementById('contact-form');
const sendBtn = document.getElementById('send-btn');
form.addEventListener('submit', e => {
  e.preventDefault();
  sendBtn.textContent = 'TRANSMITTING...';
  sendBtn.style.background = 'var(--magenta)';
  setTimeout(() => {
    sendBtn.textContent = 'MESSAGE SENT ✓';
    sendBtn.style.background = 'var(--green)';
    sendBtn.style.color = 'var(--bg)';
    form.reset();
    addScore(500);
    setTimeout(() => {
      sendBtn.textContent = 'SEND MESSAGE ▶';
      sendBtn.style.background = '';
      sendBtn.style.color = '';
    }, 3000);
  }, 1500);
});

/* ===== TERMINAL ===== */
const termToggle = document.getElementById('term-toggle');
const terminal = document.getElementById('terminal');
const termClose = document.getElementById('term-close');
const termInput = document.getElementById('term-input');
const termOutput = document.getElementById('term-output');

termToggle.addEventListener('click', () => {
  terminal.classList.toggle('open');
  if (terminal.classList.contains('open')) {
    termInput.focus();
    printLine('nafih@portfolio:~$ Welcome! Type <span style="color:var(--cyan)">help</span> for commands.', '');
  }
});
termClose.addEventListener('click', () => terminal.classList.remove('open'));

function printLine(text, cls = '') {
  const div = document.createElement('div');
  div.className = 'term-line ' + cls;
  div.innerHTML = text;
  termOutput.appendChild(div);
  termOutput.scrollTop = termOutput.scrollHeight;
}

const cmds = {
  help: () => {
    printLine('Available commands:', '');
    printLine('  <span style="color:var(--green)">whoami</span>     — About Nafih', '');
    printLine('  <span style="color:var(--green)">skills</span>     — List tech stack', '');
    printLine('  <span style="color:var(--green)">projects</span>   — List projects', '');
    printLine('  <span style="color:var(--green)">contact</span>    — Contact info', '');
    printLine('  <span style="color:var(--green)">score</span>      — Your current score', '');
    printLine('  <span style="color:var(--green)">clear</span>      — Clear terminal', '');
    printLine('  <span style="color:var(--green)">matrix</span>     — You know what this is', '');
  },
  whoami: () => {
    printLine('> Nafih — Full-Stack Developer from Kerala, India.', '');
    printLine('> 3+ years building web apps that actually work.', '');
    printLine('> React | Node.js | MongoDB | Tailwind | Redux', '');
    addScore(50);
  },
  skills: () => {
    printLine('> FRONTEND: React, Next.js, TypeScript, Tailwind, GSAP', '');
    printLine('> BACKEND : Node.js, Express, REST APIs, JWT Auth', '');
    printLine('> DATABASE: MongoDB, Mongoose, PostgreSQL', '');
    printLine('> TOOLS   : Git, Docker, VS Code, Figma', '');
    addScore(50);
  },
  projects: () => {
    printLine('> [1] HIGHLOW     — Sneaker e-commerce platform', '');
    printLine('> [2] JOBSEEK     — Job-seeking portal', '');
    printLine('> [3] ZAPTRO      — Modern storefront', '');
    printLine('> [4] AUTH SYSTEM — JWT boilerplate', '');
    printLine('> [5] CHAT APP    — Real-time messaging', '');
    addScore(50);
  },
  contact: () => {
    printLine('> Email   : nafih@email.com', '');
    printLine('> Location: Kerala, India', '');
    printLine('> Status  : Open to freelance & full-time', '');
    addScore(50);
  },
  score: () => {
    printLine(`> Your score: <span style="color:var(--cyan)">${score}</span> pts`, '');
  },
  clear: () => {
    termOutput.innerHTML = '';
  },
  matrix: () => {
    printLine('<span style="color:var(--green)">Wake up, Nafih...</span>', '');
    setTimeout(() => printLine('<span style="color:var(--green)">The Matrix has you...</span>', ''), 700);
    setTimeout(() => printLine('<span style="color:var(--green)">Follow the white rabbit. 🐇</span>', ''), 1500);
    addScore(100);
  },
};

termInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const val = termInput.value.trim().toLowerCase();
    printLine(`❯ ${val}`, 'cmd');
    termInput.value = '';
    if (cmds[val]) {
      cmds[val]();
    } else if (val) {
      printLine(`bash: ${val}: command not found. Type <span style="color:var(--cyan)">help</span>`, 'err');
    }
  }
});

/* ===== TYPING EFFECT FOR HERO PRE ===== */
const heroPre = document.querySelector('.hero-pre');
const text = heroPre.textContent;
heroPre.textContent = '';
let i = 0;
function typeHero() {
  if (i < text.length) {
    heroPre.textContent += text[i++];
    setTimeout(typeHero, 50);
  }
}
setTimeout(typeHero, 400);

/* ===== KONAMI CODE EASTER EGG ===== */
const konami = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let ki = 0;
document.addEventListener('keydown', e => {
  if (e.key === konami[ki]) {
    ki++;
    if (ki === konami.length) {
      ki = 0;
      addScore(9999);
      document.body.style.animation = 'none';
      const msg = document.createElement('div');
      msg.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:var(--bg);border:2px solid var(--yellow);padding:2rem 3rem;z-index:9999;text-align:center;font-family:var(--font-orb);color:var(--yellow);font-size:1.2rem;letter-spacing:3px;box-shadow:0 0 60px var(--yellow)';
      msg.innerHTML = '⭐ CHEAT CODE ACTIVATED ⭐<br><span style="font-size:0.7rem;color:#8ab4cc;letter-spacing:2px">+9999 SCORE</span>';
      document.body.appendChild(msg);
      setTimeout(() => msg.remove(), 3000);
    }
  } else {
    ki = 0;
  }
});
