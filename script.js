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

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'dark';
setTheme(savedTheme);

// ========== Interactive Terminal ==========
const terminalOutput = document.getElementById('terminal-output');
const terminalInput = document.getElementById('terminal-input');
const terminalBody = document.getElementById('terminal-body');

const commands = {
  help: `Available commands:
  <span class="info">whoami</span>      Who I am
  <span class="info">about</span>       About me
  <span class="info">skills</span>      Technical skills
  <span class="info">experience</span>  Work experience
  <span class="info">impact</span>      Key achievements
  <span class="info">certs</span>       Certifications
  <span class="info">contact</span>     Contact info
  <span class="info">clear</span>       Clear terminal
  <span class="info">help</span>        Show this help`,

  whoami: `<span class="success">Sohrab Ahmed — Specializing in Databricks Lakehouse, Delta Lake & real-time data platforms</span>`,

  about: `I design and build scalable data platforms, real-time pipelines, and modern lakehouse architectures.
Focus areas: Databricks Lakehouse, Delta Lake, Kafka, Flink, data quality, governance and FinOps.`,

  skills: `Lakehouse: Databricks, Unity Catalog, DQX, Genie, Delta Lake, Spark, Snowflake
Streaming: Kafka, MSK, Flink, Spark Structured Streaming
Cloud: AWS, Azure, S3, Redshift, Synapse, ADF
Languages: Python, SQL, Scala, PySpark
Other: Airflow, CI/CD, Power BI, Data Quality, Mentoring`,

  experience: `SEEK (Dec 2024 – Present) — Real-time platform, AI automation, Lakehouse enablement
FedEx (2023–2024) — Azure Databricks, Unity Catalog, cost optimization
PPG (2019–2022) — Delta Lake platform, 84% defect reduction
Earlier: Neustar, Sphota, Cognizant`,

  impact: `• Sub-minute real-time platform (Flink + Kafka + Databricks)
• AI-driven ETL + DQX automation with auto PRs
• Production Delta Lake with 84% fewer defects
• Onboarded 5+ squads → ~20% faster delivery`,

  certs: `Databricks Data Engineer Professional
Databricks Platform Architect
Azure Data Engineer · Azure Developer
Power BI Data Analyst · Azure Fundamentals
Cloudera CCA Spark & Hadoop
SAFe 6 Practitioner · Microsoft Certified Trainer`,

  contact: `📍 Kuala Lumpur, Malaysia
📧 sohrabahmed@outlook.com
📱 +60 111 262 5189
🔗 linkedin.com/in/sohrabahmed`,

  clear: null
};

function print(html) {
  const div = document.createElement('div');
  div.className = 'line';
  div.innerHTML = html;
  terminalOutput.appendChild(div);
  terminalBody.scrollTop = terminalBody.scrollHeight;
}

function runCommand(cmd) {
  const command = cmd.trim().toLowerCase();
  print(`<span class="prompt">sohrab@data:~$</span> ${cmd}`);

  if (!command) return;

  if (commands[command] !== undefined) {
    if (command === 'clear') {
      terminalOutput.innerHTML = '';
    } else {
      print(commands[command]);
    }
  } else {
    print(`<span class="error">Command not found: ${command}</span><br>Type <span class="info">help</span> for available commands.`);
  }
}

// Boot message
print(`<span class="muted">Welcome to sohrab@data</span>`);
print(`Type <span class="info">help</span> to see available commands.`);
print(``);

terminalInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const value = terminalInput.value;
    terminalInput.value = '';
    runCommand(value);
  }
});

// Focus terminal on click
document.querySelector('.terminal-window').addEventListener('click', () => {
  terminalInput.focus();
});

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
  { name: 'Education', id: 'education' },
  { name: 'Contact', id: 'contact' }
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
    `<div data-id="${p.id}">${p.name}</div>`
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
  const id = e.target.dataset.id;
  if (id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    closePalette();
  }
});

palette.addEventListener('click', (e) => {
  if (e.target === palette) closePalette();
});