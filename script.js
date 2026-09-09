// ========== Theme Toggle ==========
const themeBtn = document.getElementById('theme-btn');
const html = document.documentElement;

function setTheme(theme) {
  html.setAttribute('data-theme', theme);
  themeBtn.textContent = theme === 'dark' ? '☾' : '☀';
  localStorage.setItem('theme', theme);
}

themeBtn.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
});

const savedTheme = localStorage.getItem('theme') || 'dark';
setTheme(savedTheme);

// ========== Year ==========
document.getElementById('year').textContent = new Date().getFullYear();

// ========== Mobile Menu ==========
const menuBtn = document.getElementById('menu-btn');
const mobileNav = document.getElementById('mobile-nav');

menuBtn.addEventListener('click', () => {
  mobileNav.classList.toggle('hidden');
});

mobileNav.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => mobileNav.classList.add('hidden'));
});

// ========== Back to Top ==========
const backToTop = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
});
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ========== Reveal on Scroll ==========
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });

reveals.forEach(el => observer.observe(el));

// ========== Keyboard Typing Sounds ==========
let audioCtx = null;
let soundEnabled = localStorage.getItem('terminal-sound') !== 'off';

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

function playKeySound(type = 'key') {
  if (!soundEnabled) return;

  const ctx = getAudioContext();
  if (ctx.state === 'suspended') ctx.resume();

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  if (type === 'enter') {
    osc.frequency.setValueAtTime(380, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.12);
  } else if (type === 'backspace') {
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.06);
  } else {
    // Normal key
    const freq = 600 + Math.random() * 200;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.6, ctx.currentTime + 0.03);
    gain.gain.setValueAtTime(0.045, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.045);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.05);
  }
}

function playTypewriterSound() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') ctx.resume();

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.frequency.setValueAtTime(750 + Math.random() * 150, ctx.currentTime);
  gain.gain.setValueAtTime(0.025, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.035);
}

// ========== Particles (subtle constellation) ==========
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];
let animationId;

function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}

function createParticles() {
  particles = [];
  const count = Math.min(55, Math.floor(canvas.width * canvas.height / 18000));
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + 0.4,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25
    });
  }
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const isDark = html.getAttribute('data-theme') === 'dark';
  ctx.fillStyle = isDark ? 'rgba(0, 255, 157, 0.45)' : 'rgba(0, 168, 107, 0.35)';
  
  particles.forEach((p, i) => {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();

    // connect nearby particles
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[j].x - p.x;
      const dy = particles[j].y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 110) {
        ctx.beginPath();
        ctx.strokeStyle = isDark 
          ? `rgba(0, 255, 157, ${0.12 * (1 - dist / 110)})` 
          : `rgba(0, 168, 107, ${0.1 * (1 - dist / 110)})`;
        ctx.lineWidth = 0.6;
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  });
  animationId = requestAnimationFrame(drawParticles);
}

function initParticles() {
  resizeCanvas();
  createParticles();
  cancelAnimationFrame(animationId);
  drawParticles();
}

window.addEventListener('resize', () => {
  resizeCanvas();
  createParticles();
});

initParticles();

// ========== Interactive Terminal ==========
const terminalOutput = document.getElementById('terminal-output');
const terminalInput = document.getElementById('terminal-input');
const terminalBody = document.getElementById('terminal-body');
const cursor = document.querySelector('.cursor');

const commands = {
  help: `Available commands:
  <span class="info">whoami</span>      
  <span class="info">about</span>       
  <span class="info">skills</span>      
  <span class="info">experience</span>  
  <span class="info">impact</span>     
  <span class="info">platform</span>    
  <span class="info">delta</span>       
  <span class="info">certs</span>       
  <span class="info">contact</span>     
  <span class="info">resume</span>      
  <span class="info">linkedin</span>    
  <span class="info">sound</span>       
  <span class="info">clear</span>       
  <span class="info">help</span>       `,

  whoami: `<span class="success">Sohrab Ahmed</span>
Data Engineering Advisor | Databricks Lakehouse & Delta Lake Specialist
Currently building high-throughput real-time platforms at SEEK, Kuala Lumpur.`,

  about: `I design and operate modern data platforms that turn raw events into trusted, low-latency insights.

Core focus areas:
• Databricks Lakehouse architecture & Unity Catalog
• High-throughput streaming (Kafka + Flink + Spark Structured Streaming)
• Data quality, governance & FinOps
• Platform enablement — helping teams ship faster with clear standards`,

  skills: `<span class="info">Lakehouse</span>     Databricks · Unity Catalog · DQX · Genie · Delta Lake · Spark
<span class="info">Streaming</span>     Apache Kafka · AWS MSK · Apache Flink · Spark Streaming
<span class="info">Cloud</span>         AWS · Azure · S3 · Redshift · Synapse · ADF
<span class="info">Engineering</span>   Python · SQL · Scala · PySpark · Airflow · CI/CD
<span class="info">Leadership</span>    Data Quality · Lineage · Mentoring · SAFe · FinOps`,

  experience: `<span class="success">SEEK</span> (Dec 2024 – Present) — Kuala Lumpur
Architecting real-time platform (Flink + Kafka + Databricks). AI-driven automation with Claude Code. Lakehouse enablement for 5+ squads.

<span class="success">FedEx</span> (2023–2024) — Hyderabad
Led MARS re-architecture on Azure Databricks + Unity Catalog. ~30% cost reduction via Synapse serverless.

<span class="success">PPG Industries</span> (2019–2022) — Malaysia
Built production Delta Lake platform (ACID, time travel, SCD). 84% reduction in data defects.

Earlier: Neustar · Sphota · Cognizant (Amex)`,

  impact: `<span class="success">• Sub-minute latency</span> — Real-time platform reduced critical data delay from hours to under 60 seconds
<span class="success">• 84% fewer defects</span> — Production Delta Lake with proactive quality rules
<span class="success">• ~20% faster delivery</span> — Onboarded 5+ squads onto Databricks Lakehouse
<span class="success">• Closed-loop AI automation</span> — Claude Code + DQX generating Git PRs automatically
<span class="success">• 30% cost savings</span> — Migrated heavy SAS workloads to Synapse serverless`,

  platform: `Current focus at SEEK:
Building a high-throughput real-time data platform using Apache Flink, Kafka (MSK) and Databricks.

Key outcomes so far:
• Latency reduced from hours → sub-minute
• Centralized data quality framework with Databricks DQX
• Self-service analytics via Databricks Genie
• AI-assisted ETL & deployment automation
• Strong FinOps practices (S3 lifecycle + cluster optimization)`,

  delta: `Deep expertise in Delta Lake:
• ACID transactions & concurrent writes
• Schema evolution & enforcement
• Time travel & versioning
• SCD Type 1 / Type 2 patterns
• Optimized file layouts & Z-ordering
• Integration with Unity Catalog for governance

Delivered a full production Delta Lake platform at PPG that cut data defects by 84%.`,

  certs: `• Databricks Certified Data Engineer Professional
• Databricks Certified Platform Architect
• Microsoft Azure Data Engineer
• Microsoft Azure Developer
• Power BI Data Analyst
• Azure Fundamentals
• Cloudera CCA Spark and Hadoop Developer
• SAFe 6 Practitioner
• Microsoft Certified Trainer (MCT)`,

  contact: `📍 Kuala Lumpur, Malaysia
📧 sohrabahmed@outlook.com
📱 +60 111 262 5189
🔗 linkedin.com/in/sohrabahmed

Open to conversations about Lakehouse architecture, real-time platforms, and data engineering leadership.`,

  resume: null,
  linkedin: null,
  sound: null,
  clear: null
};

let history = [];
let historyIndex = -1;

function print(html) {
  const div = document.createElement('div');
  div.className = 'line';
  div.innerHTML = html;
  terminalOutput.appendChild(div);
  terminalBody.scrollTop = terminalBody.scrollHeight;
}

function typeWriter(text, callback) {
  let i = 0;
  const line = document.createElement('div');
  line.className = 'line muted';
  terminalOutput.appendChild(line);

  function type() {
    if (i < text.length) {
      line.innerHTML += text.charAt(i);
      playTypewriterSound();
      i++;
      terminalBody.scrollTop = terminalBody.scrollHeight;
      setTimeout(type, 18 + Math.random() * 22);
    } else if (callback) {
      callback();
    }
  }
  type();
}

function runCommand(cmd) {
  const original = cmd.trim();
  const command = original.toLowerCase();

  // Always show the typed command in lowercase + muted color
  print(`<span class="prompt">sohrab@data:~$</span> <span class="muted">${command}</span>`);

  if (!command) return;

  if (commands[command] !== undefined) {
    if (command === 'clear') {
      terminalOutput.innerHTML = '';
    } else if (command === 'resume') {
      window.open('resume_md_sohrab_ahmed.pdf', '_blank');
      print(`<span class="success">Opening resume...</span>`);
    } else if (command === 'linkedin') {
      window.open('https://linkedin.com/in/sohrabahmed', '_blank');
      print(`<span class="success">Opening LinkedIn...</span>`);
    } else if (command === 'sound') {
      soundEnabled = !soundEnabled;
      localStorage.setItem('terminal-sound', soundEnabled ? 'on' : 'off');
      print(`<span class="success">Terminal sound ${soundEnabled ? 'enabled' : 'disabled'}</span>`);
    } else {
      print(commands[command]);
    }
  } else {
    // Unknown command
    print(`<span class="error">Command not found: ${command}</span><br>Type <span class="info">help</span> for available commands.`);
  }

  history.push(original);
  historyIndex = history.length;
}

// Boot sequence
print(`<span class="muted">Welcome to sohrab@data</span>`);
setTimeout(() => {
  typeWriter('Initializing lakehouse modules...', () => {
    setTimeout(() => {
      print(`<span class="success">✓ Delta Lake ready</span>`);
      print(`<span class="success">✓ Streaming engines online</span>`);
      print(``);
      print(`Type <span class="info">help</span> to explore.`);
      print(``);
      terminalInput.focus();
    }, 400);
  });
}, 300);

// Input handling + sounds
terminalInput.addEventListener('keydown', (e) => {
  // Play sound
  if (e.key === 'Enter') {
    playKeySound('enter');
  } else if (e.key === 'Backspace') {
    playKeySound('backspace');
  } else if (e.key.length === 1 || e.key === ' ') {
    playKeySound('key');
  }

  if (e.key === 'Enter') {
    const value = terminalInput.value;
    terminalInput.value = '';
    runCommand(value);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (historyIndex > 0) {
      historyIndex--;
      terminalInput.value = history[historyIndex];
    }
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (historyIndex < history.length - 1) {
      historyIndex++;
      terminalInput.value = history[historyIndex];
    } else {
      historyIndex = history.length;
      terminalInput.value = '';
    }
  }
});

document.querySelector('.terminal-window').addEventListener('click', () => {
  terminalInput.focus();
});

terminalInput.addEventListener('focus', () => cursor.style.display = 'inline');
terminalInput.addEventListener('blur', () => cursor.style.display = 'none');

// ========== Command Palette ==========
const palette = document.getElementById('cmd-palette');
const cmdInput = document.getElementById('cmd-input');
const cmdResults = document.getElementById('cmd-results');
const cmdBtn = document.getElementById('cmd-btn');

const pages = [
  { name: 'About', id: 'about' },
  { name: 'Skills', id: 'skills' },
  { name: 'Experience', id: 'experience' },
  { name: 'Impact', id: 'impact' },
  { name: 'Architecture', id: 'architecture' },
  { name: 'Education', id: 'education' },
  { name: 'Contact', id: 'contact' },
  { name: 'Resume (PDF)', action: () => window.open('resume_md_sohrab_ahmed.pdf', '_blank') },
  { name: 'LinkedIn', action: () => window.open('https://linkedin.com/in/sohrabahmed', '_blank') }
];

function openPalette() {
  palette.classList.remove('hidden');
  cmdInput.value = '';
  cmdInput.focus();
  renderResults('');
}

function closePalette() {
  palette.classList.add('hidden');
}

function renderResults(query) {
  const q = query.toLowerCase();
  const filtered = pages.filter(p => p.name.toLowerCase().includes(q));
  cmdResults.innerHTML = filtered.map(p =>
    `<div data-id="${p.id || ''}" data-action="${p.action ? 'true' : ''}">${p.name}</div>`
  ).join('') || `<div style="color:var(--muted);padding:16px">No results</div>`;
}

cmdBtn.addEventListener('click', openPalette);

document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    openPalette();
  }
  if (e.key === 'Escape') closePalette();
});

cmdInput.addEventListener('input', (e) => renderResults(e.target.value));

cmdResults.addEventListener('click', (e) => {
  const target = e.target.closest('div[data-id], div[data-action]');
  if (!target) return;

  if (target.dataset.action === 'true') {
    const name = target.textContent;
    const page = pages.find(p => p.name === name);
    if (page && page.action) page.action();
  } else if (target.dataset.id) {
    document.getElementById(target.dataset.id)?.scrollIntoView({ behavior: 'smooth' });
  }
  closePalette();
});

palette.addEventListener('click', (e) => {
  if (e.target === palette) closePalette();
});


