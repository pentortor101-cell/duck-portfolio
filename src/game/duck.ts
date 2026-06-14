// ============================================================
//  Duck Hunt engine — minimal modern style
//  Canvas ล้วน ไม่พึ่ง library ภายนอก
// ============================================================

export type SectionKey = "about" | "skills" | "projects" | "contact";

export interface DuckConfig {
  key: SectionKey;
  label: string;
  color: string; // สีตัว
  wing: string; // สีปีก
}

interface Duck {
  cfg: DuckConfig;
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  flap: number;
  state: "flying" | "hit" | "falling" | "gone";
  fallV: number;
  spin: number;
}

const PALETTE: DuckConfig[] = [
  { key: "about", label: "ABOUT", color: "#5B5BD6", wing: "#8B8BE8" },
  { key: "skills", label: "SKILLS", color: "#1A9E75", wing: "#3FD0A0" },
  { key: "projects", label: "WORK", color: "#C77B1E", wing: "#E8A94B" },
  { key: "contact", label: "TALK", color: "#D14B7E", wing: "#EE7FA8" },
];

export class DuckGame {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private ducks: Duck[] = [];
  private mouse = { x: 0, y: 0, inside: false };
  private flash = 0;
  private paused = false;
  private raf = 0;
  private audioCtx?: AudioContext;
  private onHit: (key: SectionKey) => void;
  private onAllDown: () => void;
  private allDownFired = false;

  readonly W = 960;
  readonly H = 540;

  constructor(
    canvas: HTMLCanvasElement,
    opts: { onHit: (key: SectionKey) => void; onAllDown: () => void }
  ) {
    this.canvas = canvas;
    this.canvas.width = this.W;
    this.canvas.height = this.H;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D not supported");
    this.ctx = ctx;
    this.onHit = opts.onHit;
    this.onAllDown = opts.onAllDown;

    this.spawnDucks();
    this.bindEvents();
    this.loop();
  }

  private spawnDucks() {
    this.ducks = PALETTE.map((cfg, i) => ({
      cfg,
      x: 140 + i * 200,
      y: 150 + Math.random() * 160,
      vx: (Math.random() < 0.5 ? -1 : 1) * (1.6 + Math.random() * 1.0),
      vy: (Math.random() - 0.5) * 1.8,
      w: 64,
      h: 46,
      flap: Math.random() * Math.PI * 2,
      state: "flying",
      fallV: 0,
      spin: 0,
    }));
    this.allDownFired = false;
  }

  /** ยิงเป็ดทุกตัวให้ตกใหม่ (รีเซต) */
  reset() {
    this.spawnDucks();
    this.paused = false;
  }

  pause() {
    this.paused = true;
  }
  resume() {
    this.paused = false;
  }

  private bindEvents() {
    const rect = () => this.canvas.getBoundingClientRect();
    const toLocal = (cx: number, cy: number) => {
      const r = rect();
      return {
        x: ((cx - r.left) / r.width) * this.W,
        y: ((cy - r.top) / r.height) * this.H,
      };
    };

    this.canvas.addEventListener("mousemove", (e) => {
      const p = toLocal(e.clientX, e.clientY);
      this.mouse.x = p.x;
      this.mouse.y = p.y;
      this.mouse.inside = true;
    });
    this.canvas.addEventListener("mouseleave", () => (this.mouse.inside = false));
    this.canvas.addEventListener("mousedown", (e) => {
      const p = toLocal(e.clientX, e.clientY);
      this.shoot(p.x, p.y);
    });

    // มือถือ: แตะเพื่อยิง
    this.canvas.addEventListener(
      "touchstart",
      (e) => {
        e.preventDefault();
        const t = e.touches[0];
        const p = toLocal(t.clientX, t.clientY);
        this.mouse.x = p.x;
        this.mouse.y = p.y;
        this.mouse.inside = true;
        this.shoot(p.x, p.y);
      },
      { passive: false }
    );
  }

  private shoot(mx: number, my: number) {
    if (this.paused) return;
    this.flash = 5;
    this.playShot();
    for (const d of this.ducks) {
      if (
        d.state === "flying" &&
        mx > d.x - d.w / 2 &&
        mx < d.x + d.w / 2 &&
        my > d.y - d.h / 2 &&
        my < d.y + d.h / 2
      ) {
        d.state = "hit";
        d.fallV = -3;
        this.playHit();
        setTimeout(() => {
          this.paused = true;
          this.onHit(d.cfg.key);
        }, 650);
        break;
      }
    }
  }

  // ---------- เสียง (Web Audio API, ไม่ต้องโหลดไฟล์) ----------
  private ensureAudio() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
    }
    return this.audioCtx;
  }
  private playShot() {
    const ac = this.ensureAudio();
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.type = "square";
    o.frequency.setValueAtTime(180, ac.currentTime);
    o.frequency.exponentialRampToValueAtTime(40, ac.currentTime + 0.12);
    g.gain.setValueAtTime(0.25, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.12);
    o.connect(g).connect(ac.destination);
    o.start();
    o.stop(ac.currentTime + 0.13);
  }
  private playHit() {
    const ac = this.ensureAudio();
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.type = "triangle";
    o.frequency.setValueAtTime(660, ac.currentTime);
    o.frequency.exponentialRampToValueAtTime(220, ac.currentTime + 0.3);
    g.gain.setValueAtTime(0.2, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.3);
    o.connect(g).connect(ac.destination);
    o.start();
    o.stop(ac.currentTime + 0.31);
  }

  // ---------- update + draw ----------
  private update() {
    if (this.paused) return;
    for (const d of this.ducks) {
      if (d.state === "flying") {
        d.x += d.vx;
        d.y += d.vy;
        d.flap += 0.35;
        if (d.x < 60 || d.x > this.W - 60) d.vx *= -1;
        if (d.y < 80 || d.y > this.H - 150) d.vy *= -1;
        d.y += Math.sin(d.flap * 0.5) * 0.5;
      } else if (d.state === "hit") {
        d.fallV += 0.25;
        d.y += d.fallV;
        d.spin += 0.2;
        if (d.fallV > 0) d.state = "falling";
      } else if (d.state === "falling") {
        d.fallV += 0.45;
        d.y += d.fallV;
        d.x += d.vx * 0.3;
        d.spin += 0.3;
        if (d.y > this.H + 60) d.state = "gone";
      }
    }
    if (!this.allDownFired && this.ducks.every((d) => d.state !== "flying")) {
      this.allDownFired = true;
      setTimeout(() => this.onAllDown(), 400);
    }
  }

  shotCount() {
    return this.ducks.filter((d) => d.state !== "flying").length;
  }

  private draw() {
    const { ctx, W, H } = this;
    // ท้องฟ้า gradient เรียบๆ
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, "#cfe9f5");
    sky.addColorStop(1, "#eef6fb");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    // เมฆมินิมอล (วงกลมจางๆ)
    ctx.fillStyle = "rgba(255,255,255,0.65)";
    const clouds = [
      [170, 110, 46],
      [430, 80, 56],
      [720, 130, 40],
      [600, 90, 34],
    ];
    for (const [cx, cy, r] of clouds) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.arc(cx + r, cy + 6, r * 0.8, 0, Math.PI * 2);
      ctx.arc(cx - r, cy + 6, r * 0.7, 0, Math.PI * 2);
      ctx.fill();
    }

    // พื้นหญ้ามินิมอล
    ctx.fillStyle = "#5a8a4a";
    ctx.fillRect(0, H - 70, W, 70);
    ctx.fillStyle = "#4d7a3f";
    ctx.fillRect(0, H - 70, W, 6);

    // เป็ด
    for (const d of this.ducks) {
      if (d.state === "gone") continue;
      this.drawDuck(d);
    }

    // flash ตอนยิง
    if (this.flash > 0) {
      ctx.fillStyle = `rgba(255,255,235,${(this.flash / 5) * 0.35})`;
      ctx.fillRect(0, 0, W, H);
      this.flash--;
    }

    // crosshair
    if (this.mouse.inside) this.drawCrosshair();
  }

  private drawDuck(d: Duck) {
    const { ctx } = this;
    const flying = d.state === "flying";
    const wingUp = Math.sin(d.flap) > 0;
    ctx.save();
    ctx.translate(d.x, d.y);
    if (!flying) ctx.rotate(d.spin);
    if (d.vx < 0) ctx.scale(-1, 1);

    // ตัว
    ctx.fillStyle = d.cfg.wing;
    ctx.beginPath();
    ctx.ellipse(0, 0, 26, 17, 0, 0, Math.PI * 2);
    ctx.fill();
    // หัว
    ctx.beginPath();
    ctx.ellipse(20, -9, 12, 11, 0, 0, Math.PI * 2);
    ctx.fill();
    // ปีก
    ctx.fillStyle = d.cfg.color;
    ctx.beginPath();
    if (wingUp || !flying) ctx.ellipse(-5, -16, 15, 9, -0.5, 0, Math.PI * 2);
    else ctx.ellipse(-5, 14, 15, 9, 0.5, 0, Math.PI * 2);
    ctx.fill();
    // ปาก
    ctx.fillStyle = "#F2A03D";
    ctx.beginPath();
    ctx.moveTo(30, -8);
    ctx.lineTo(44, -5);
    ctx.lineTo(30, -1);
    ctx.closePath();
    ctx.fill();
    // ตา
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(24, -12, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#1a2230";
    ctx.beginPath();
    ctx.arc(25, -12, 1.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // ป้ายชื่อ section (เฉพาะตอนบิน)
    if (flying) {
      ctx.fillStyle = d.cfg.color;
      ctx.font = "600 12px 'IBM Plex Mono', monospace";
      ctx.textAlign = "center";
      ctx.fillText(d.cfg.label, d.x, d.y - 30);
    }
  }

  private drawCrosshair() {
    const { ctx } = this;
    const { x, y } = this.mouse;
    const r = 18;
    ctx.strokeStyle = "#E2474A";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - r - 8, y);
    ctx.lineTo(x - 5, y);
    ctx.moveTo(x + 5, y);
    ctx.lineTo(x + r + 8, y);
    ctx.moveTo(x, y - r - 8);
    ctx.lineTo(x, y - 5);
    ctx.moveTo(x, y + 5);
    ctx.lineTo(x, y + r + 8);
    ctx.stroke();
    ctx.fillStyle = "#E2474A";
    ctx.beginPath();
    ctx.arc(x, y, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  private loop = () => {
    this.update();
    this.draw();
    this.raf = requestAnimationFrame(this.loop);
  };

  destroy() {
    cancelAnimationFrame(this.raf);
  }
}
