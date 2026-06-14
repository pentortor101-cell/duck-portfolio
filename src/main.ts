import "./style.css";
import { DuckGame, type SectionKey } from "./game/duck";
import {
  profile,
  skills,
  projects,
  experience,
  education,
  contact,
} from "./data/portfolio";

const app = document.querySelector<HTMLDivElement>("#app")!;

// ---------- โครง HTML ----------
app.innerHTML = `
  <div class="topbar">
    <div class="who">${profile.name}<small>${profile.title}</small></div>
    <div class="links">
      <button class="btn" id="toggle-view">ดูแบบปกติ</button>
      <a class="btn primary" href="mailto:${contact.email}">ติดต่อ</a>
    </div>
  </div>

  <div id="game-view">
    <div class="hero">
      <div class="role">${profile.title}</div>
      <h1>${profile.name}</h1>
      <p class="tag">${profile.tagline}</p>
    </div>

    <div class="game-shell">
      <canvas id="game-canvas"></canvas>
      <div class="win-banner" id="win">ยิงครบทุกตัวแล้ว 🦆 เก่งมาก!</div>
    </div>
    <div class="game-hud">
      <span>เลื่อนเมาส์เล็ง · คลิกยิงเป็ด · มือถือแตะเพื่อยิง</span>
      <span class="score">ยิงโดน <b id="score">0</b> / 4 &nbsp;·&nbsp;
        <button class="btn" id="reset" style="padding:4px 10px;font-size:12px;">เริ่มใหม่</button>
      </span>
    </div>
  </div>

  <div class="resume" id="resume-view">
    ${renderResume()}
  </div>

  <footer>© ${new Date().getFullYear()} ${profile.name} · พอร์ตโฟลิโอแบบเกมยิงเป็ด · สร้างด้วย Canvas + TypeScript · <span class="ai-badge">✦ สร้างด้วยความช่วยเหลือของ AI</span></footer>

  <div class="modal-back" id="modal-back">
    <div class="modal">
      <div class="modal-head">
        <h2 id="modal-title"></h2>
        <button class="close" id="modal-close" aria-label="ปิด">✕</button>
      </div>
      <div id="modal-body"></div>
    </div>
  </div>
`;

// ---------- modal ----------
const modalBack = document.querySelector<HTMLDivElement>("#modal-back")!;
const modalTitle = document.querySelector<HTMLHeadingElement>("#modal-title")!;
const modalBody = document.querySelector<HTMLDivElement>("#modal-body")!;

function openModal(key: SectionKey) {
  modalTitle.textContent = sectionTitle(key);
  modalBody.innerHTML = sectionBody(key);
  modalBack.classList.add("show");
}
function closeModal() {
  modalBack.classList.remove("show");
  game.resume();
}
document.querySelector("#modal-close")!.addEventListener("click", closeModal);
modalBack.addEventListener("click", (e) => {
  if (e.target === modalBack) closeModal();
});
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modalBack.classList.contains("show")) closeModal();
});

function sectionTitle(key: SectionKey): string {
  return { about: "About", skills: "Skills", projects: "Projects", contact: "Contact" }[key];
}

function sectionBody(key: SectionKey): string {
  if (key === "about") {
    return `<div class="bio">${profile.bio.map((l) => `<p>${l}</p>`).join("")}
      <p style="margin-top:12px;color:var(--ink-faint);font-size:13px;">
        ${education.degree} · ${education.school} (${education.period})</p></div>`;
  }
  if (key === "skills") {
    return skills
      .map(
        (g) => `<div class="skill-group"><h3>${g.group}</h3>
        <div class="chips">${g.items.map((s) => `<span class="chip">${s}</span>`).join("")}</div></div>`
      )
      .join("");
  }
  if (key === "projects") {
    return projects
      .map(
        (p) => `<div class="proj">
        <div class="proj-top"><h3>${p.title}</h3><span class="period">${p.period}</span></div>
        <p>${p.description}</p>
        <div class="chips">${p.stack.map((s) => `<span class="chip">${s}</span>`).join("")}</div>
        ${p.link ? `<a href="${p.link.url}" target="_blank" rel="noopener">${p.link.label} →</a>` : ""}
      </div>`
      )
      .join("");
  }
  // contact
  return `
    <div class="contact-row"><span class="k">Email</span><a href="mailto:${contact.email}">${contact.email}</a></div>
    <div class="contact-row"><span class="k">โทร</span><a href="tel:${contact.phone.replace(/-/g, "")}">${contact.phone}</a></div>
    <div class="contact-row"><span class="k">Facebook</span><span>${contact.facebook.label}</span></div>
    <div class="contact-row"><span class="k">LINE</span><span>${contact.line}</span></div>
    <div class="contact-row"><span class="k">Instagram</span><a href="${contact.ig.url}" target="_blank" rel="noopener">@${contact.ig.label}</a></div>`;
}

// ---------- resume (normal view) ----------
function renderResume(): string {
  return `
  <section>
    <h2>About</h2>
    <div class="about-wrap">
      <img class="profile-img" src="/tor.jpg" alt="${profile.name}" />
      <div class="bio">${profile.bio.map((l) => `<p>${l}</p>`).join("")}</div>
    </div>
  </section>
  <section>
    <h2>Skills</h2>
    ${skills
      .map(
        (g) => `<div class="skill-group"><h3>${g.group}</h3>
      <div class="chips">${g.items.map((s) => `<span class="chip">${s}</span>`).join("")}</div></div>`
      )
      .join("")}
  </section>
  <section>
    <h2>Experience</h2>
    ${experience
      .map(
        (e) => `<div class="exp-row">
        <div class="left"><b>${e.company}</b><span>${e.role} · ${e.note}</span></div>
        <div class="right">${e.period}</div></div>`
      )
      .join("")}
  </section>
  <section>
    <h2>Projects</h2>
    ${projects
      .map(
        (p) => `<div class="proj" style="border:none;padding:8px 0;">
        <div class="proj-top"><h3>${p.title}</h3><span class="period">${p.period}</span></div>
        <p>${p.description}</p>
        <div class="chips">${p.stack.map((s) => `<span class="chip">${s}</span>`).join("")}</div>
        ${p.link ? `<a href="${p.link.url}" target="_blank" rel="noopener">${p.link.label} →</a>` : ""}
      </div>`
      )
      .join("")}
  </section>
  <section>
    <h2>Education</h2>
    <div class="exp-row"><div class="left"><b>${education.school}</b><span>${education.degree}</span></div>
    <div class="right">${education.period}</div></div>
  </section>
  <section>
    <h2>Contact</h2>
    ${sectionBody("contact")}
  </section>`;
}

// ---------- toggle game / resume ----------
const gameView = document.querySelector<HTMLDivElement>("#game-view")!;
const resumeView = document.querySelector<HTMLDivElement>("#resume-view")!;
const toggleBtn = document.querySelector<HTMLButtonElement>("#toggle-view")!;
let showingResume = false;
toggleBtn.addEventListener("click", () => {
  showingResume = !showingResume;
  gameView.style.display = showingResume ? "none" : "block";
  resumeView.classList.toggle("show", showingResume);
  toggleBtn.textContent = showingResume ? "เล่นเกม" : "ดูแบบปกติ";
  if (showingResume) game.pause();
  else game.resume();
});

// ---------- start game ----------
const canvas = document.querySelector<HTMLCanvasElement>("#game-canvas")!;
const scoreEl = document.querySelector<HTMLSpanElement>("#score")!;
const winEl = document.querySelector<HTMLDivElement>("#win")!;

const game = new DuckGame(canvas, {
  onHit: (key) => {
    scoreEl.textContent = String(game.shotCount());
    openModal(key);
  },
  onAllDown: () => {
    winEl.classList.add("show");
  },
});

document.querySelector("#reset")!.addEventListener("click", () => {
  game.reset();
  scoreEl.textContent = "0";
  winEl.classList.remove("show");
});
