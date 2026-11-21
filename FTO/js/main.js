/* ==========================================================================
   Fais Ton’ Ovalie — interactions de la maquette
   1. Menu mobile
   2. Éclats de confettis sur les boutons « Réserver »
   3. Fond animé : confettis, étoiles et ballons qui rebondissent
   ========================================================================== */

const COLORS = ["#FF5D73", "#FFB400", "#00A6A6", "#7FB800", "#F06543", "#2E86AB"];
const BALL_STRIPES = ["#2E86AB", "#7FB800", "#00A6A6", "#FF5D73", "#FFB400", "#F06543"];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

/* ---------- 1. Menu mobile ---------- */
function initMenu() {
  const header = document.querySelector(".site-header");
  const toggle = header?.querySelector(".menu-toggle");
  if (!toggle) return;

  const label = toggle.querySelector(".menu-toggle__label");
  const icon = toggle.querySelector("use");

  const setOpen = (open) => {
    header.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    label.textContent = open ? "Fermer" : "Menu";
    icon.setAttribute("href", open ? "#i-close" : "#i-menu");
  };

  toggle.addEventListener("click", () => setOpen(!header.classList.contains("is-open")));

  // Ferme le menu après un clic sur un lien, avec Échap, ou en repassant en bureau
  header.querySelector("#menu-principal").addEventListener("click", (e) => {
    if (e.target.closest("a")) setOpen(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && header.classList.contains("is-open")) {
      setOpen(false);
      toggle.focus();
    }
  });
  window.matchMedia("(min-width: 1025px)").addEventListener("change", (e) => {
    if (e.matches) setOpen(false);
  });

  // Ombre plus marquée dès que le contenu passe sous le header fixe
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* ---------- 2. Éclats de confettis ---------- */
function burst(button) {
  if (reduceMotion.matches) return;
  const container = document.createElement("span");
  container.className = "burst";
  container.setAttribute("aria-hidden", "true");

  for (let i = 0; i < 20; i++) {
    const piece = document.createElement("span");
    piece.style.background = COLORS[i % COLORS.length];
    container.append(piece);

    const angle = (i / 20) * Math.PI * 2 + Math.random() * 0.4;
    const dist = 60 + Math.random() * 60;
    const x = Math.cos(angle) * dist;
    const y = Math.sin(angle) * dist;
    const rot = (Math.random() - 0.5) * 720;
    piece.animate(
      [
        { transform: "translate(0, 0) scale(.2) rotate(0)", opacity: 1 },
        { transform: `translate(${x}px, ${y}px) scale(1) rotate(${rot * 0.6}deg)`, opacity: 1, offset: 0.55 },
        { transform: `translate(${x * 1.1}px, ${y + 55}px) scale(.9) rotate(${rot}deg)`, opacity: 0 }
      ],
      { duration: 1000, easing: "cubic-bezier(.15,.75,.35,1)", fill: "forwards" }
    );
  }

  button.append(container);
  setTimeout(() => container.remove(), 1050);
}

function initBursts() {
  document.querySelectorAll("[data-burst]").forEach((btn) => {
    btn.addEventListener("click", () => burst(btn));
  });
}

/* ---------- 3. Fond animé ---------- */
function initBackground() {
  const canvas = document.querySelector(".page-bg__canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const area = canvas.parentElement;

  let width = 0;
  let height = 0;
  let confetti = [];
  let balls = [];

  const rand = (min, max) => min + Math.random() * (max - min);
  const pick = (list) => list[Math.floor(Math.random() * list.length)];

  /* Confettis : ronds, bandes, rectangles et étoiles qui tombent en ondulant */
  function makeConfetti(randomY) {
    return {
      x: rand(0, width),
      y: randomY ? rand(-40, height) : -40,
      speed: rand(70, 110),
      sway: rand(10, 18),
      swaySpeed: rand(1.4, 2.4),
      phase: rand(0, Math.PI * 2),
      angle: rand(0, Math.PI * 2),
      spin: rand(-3, 3),
      flip: rand(2, 4),
      shape: pick(["dot", "bar", "rect", "star"]),
      color: pick(COLORS),
      size: rand(0.9, 1.2)
    };
  }

  /* Ballons rayés : rebonds sur les bords et entre eux */
  function makeBalls() {
    const sizes = width < 640 ? [118, 90, 68] : [210, 170, 136, 108, 84];
    const list = [];
    for (const w of sizes) {
      const h = w * 0.6;
      const r = (w + h) / 4;
      let x, y, tries = 0;
      do {
        x = rand(r, width - r);
        y = rand(r, height - r);
        tries++;
      } while (tries < 200 && list.some((o) => Math.hypot(o.x - x, o.y - y) < o.r + r + 10));
      const dir = rand(0, Math.PI * 2);
      const speed = rand(90, 160);
      list.push({ w, h, r, x, y, vx: Math.cos(dir) * speed, vy: Math.sin(dir) * speed, a: rand(-3, 3), spin: rand(-1, 1), m: r * r });
    }
    return list;
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = area.clientWidth;
    height = area.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Recrée les confettis si leur nombre change, et les ballons au passage mobile/bureau
    const count = Math.round(width / 26);
    if (confetti.length !== count) confetti = Array.from({ length: count }, () => makeConfetti(true));
    const mobile = width < 640;
    if (!balls.length || balls.mobile !== mobile) {
      balls = makeBalls();
      balls.mobile = mobile;
    }
    if (reduceMotion.matches) draw(0);
  }

  function step(dt, t) {
    for (const c of confetti) {
      c.y += c.speed * dt;
      c.angle += c.spin * dt;
      if (c.y > height + 40) Object.assign(c, makeConfetti(false));
    }

    for (const o of balls) {
      o.x += o.vx * dt;
      o.y += o.vy * dt;
      o.a += o.spin * dt;
      if (o.x - o.r < 0) { o.x = o.r; o.vx = Math.abs(o.vx); o.spin = -o.spin; }
      if (o.x + o.r > width) { o.x = width - o.r; o.vx = -Math.abs(o.vx); o.spin = -o.spin; }
      if (o.y - o.r < 0) { o.y = o.r; o.vy = Math.abs(o.vy); o.spin = -o.spin; }
      if (o.y + o.r > height) { o.y = height - o.r; o.vy = -Math.abs(o.vy); o.spin = -o.spin; }
    }

    // Collisions élastiques entre ballons
    for (let i = 0; i < balls.length; i++) {
      for (let j = i + 1; j < balls.length; j++) {
        const p = balls[i];
        const q = balls[j];
        const dx = q.x - p.x;
        const dy = q.y - p.y;
        const d = Math.hypot(dx, dy);
        const min = p.r + q.r;
        if (d === 0 || d >= min) continue;
        const nx = dx / d;
        const ny = dy / d;
        const total = p.m + q.m;
        const overlap = min - d;
        p.x -= nx * overlap * (q.m / total);
        p.y -= ny * overlap * (q.m / total);
        q.x += nx * overlap * (p.m / total);
        q.y += ny * overlap * (p.m / total);
        const rel = (p.vx - q.vx) * nx + (p.vy - q.vy) * ny;
        if (rel > 0) {
          const impulse = (2 * rel) / total;
          p.vx -= impulse * q.m * nx;
          p.vy -= impulse * q.m * ny;
          q.vx += impulse * p.m * nx;
          q.vy += impulse * p.m * ny;
          p.spin += rand(-1.4, 1.4);
          q.spin += rand(-1.4, 1.4);
        }
      }
    }
    for (const o of balls) o.spin = Math.max(-3, Math.min(3, o.spin));
  }

  function drawStar(size) {
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const r = i % 2 ? size * 0.42 : size;
      const a = (i * Math.PI) / 5 - Math.PI / 2;
      ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    ctx.closePath();
    ctx.fill();
  }

  function drawConfetti(c, t) {
    const x = c.x + Math.sin(t * c.swaySpeed + c.phase) * c.sway;
    ctx.save();
    ctx.translate(x, c.y);
    ctx.rotate(c.angle);
    ctx.fillStyle = c.color;
    if (c.shape === "star") {
      drawStar(9 * c.size);
    } else {
      ctx.scale(1, Math.cos(t * c.flip + c.phase)); // effet de retournement
      ctx.beginPath();
      if (c.shape === "dot") ctx.arc(0, 0, 5 * c.size, 0, Math.PI * 2);
      else if (c.shape === "bar") ctx.roundRect(-9 * c.size, -3.5 * c.size, 18 * c.size, 7 * c.size, 4);
      else ctx.roundRect(-4.5 * c.size, -6.5 * c.size, 9 * c.size, 13 * c.size, 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // Ballon rayé dessiné dans un repère 200 × 120
  const ballShape = new Path2D("M8 60C9 24 54 5 100 5s91 19 92 55c-1 36-46 55-92 55S9 96 8 60Z");
  function drawBall(o) {
    ctx.save();
    ctx.translate(o.x, o.y);
    ctx.rotate(o.a);
    ctx.scale(o.w / 200, o.h / 120);
    ctx.translate(-100, -60);
    ctx.save();
    ctx.clip(ballShape);
    BALL_STRIPES.forEach((color, i) => {
      ctx.fillStyle = color;
      ctx.fillRect(i * 33.333, 0, 34, 120);
    });
    ctx.restore();
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineCap = "round";
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(74, 60);
    ctx.lineTo(126, 60);
    ctx.stroke();
    ctx.lineWidth = 4;
    ctx.beginPath();
    for (let x = 77; x <= 125; x += 8) {
      ctx.moveTo(x, 54);
      ctx.lineTo(x, 66);
    }
    ctx.stroke();
    ctx.restore();
  }

  function draw(t) {
    ctx.clearRect(0, 0, width, height);
    balls.forEach(drawBall);
    confetti.forEach((c) => drawConfetti(c, t));
  }

  let last = null;
  let rafId = null;
  function loop(now) {
    const t = now / 1000;
    const dt = last === null ? 0 : Math.min(t - last, 0.05);
    last = t;
    step(dt, t);
    draw(t);
    rafId = requestAnimationFrame(loop);
  }

  function start() {
    cancelAnimationFrame(rafId);
    last = null;
    if (reduceMotion.matches) draw(0);
    else rafId = requestAnimationFrame(loop);
  }

  new ResizeObserver(resize).observe(area);
  resize();
  start();
  reduceMotion.addEventListener("change", start);
}

initMenu();
initBursts();
initBackground();
