/* ========= إعدادات المكتب ========= */
const CONFIG = {
  WA_NUMBER: "9665XXXXXXXX", // بدون +
  OFFICE_PHONE: "+966 — [رقمك]",
  OFFICE_EMAIL: "[بريدك الرسمي]",
  OFFICE_LOCATION: "مدينة حائل – حي شراف",
  WORK_HOURS: "من 9 صباحًا إلى 5 مساءً",
};

/* ========= Helpers ========= */
const $ = (q, el = document) => el.querySelector(q);
const $$ = (q, el = document) => [...el.querySelectorAll(q)];

function escapeHTML(str) {
  return String(str).replace(/[&<>"']/g, s => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[s]));
}

function toast(title, message) {
  const wrap = $("#toast");
  const t = document.createElement("div");
  t.className = "t";
  t.innerHTML = `
    <div class="bar"></div>
    <div>
      <b style="display:block;font-weight:950;margin-bottom:2px;">${escapeHTML(title)}</b>
      <span style="display:block;color:rgba(169,184,214,.95);font-weight:800;line-height:1.55;font-size:.95rem;">
        ${escapeHTML(message)}
      </span>
    </div>
  `;
  wrap.appendChild(t);

  setTimeout(() => {
    t.style.opacity = "0";
    t.style.transform = "translateY(10px)";
    t.style.transition = "all .25s ease";
    setTimeout(() => t.remove(), 260);
  }, 3200);
}

/* ========= Motion preference ========= */
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ========= Entry animation (stagger tiles) ========= */
function staggerTiles() {
  const tiles = $$(".tile");
  tiles.forEach((tile, i) => {
    if (reduceMotion) {
      tile.classList.add("is-in");
      return;
    }
    setTimeout(() => tile.classList.add("is-in"), 90 + i * 90);
  });
}
staggerTiles();

/* ========= Parallax for side title (creative, subtle) ========= */
(function parallaxTitle(){
  const title = $(".side-title h1");
  if (!title || reduceMotion) return;

  let raf = null;
  const state = { x: 0, y: 0 };

  window.addEventListener("mousemove", (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    state.x = (e.clientX - cx) / cx; // -1..1
    state.y = (e.clientY - cy) / cy;

    if (raf) return;
    raf = requestAnimationFrame(() => {
      const tx = (state.x * 8).toFixed(2);
      const ty = (state.y * 6).toFixed(2);
      title.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
      raf = null;
    });
  }, { passive: true });
})();

/* ========= WhatsApp ========= */
function openWhatsApp(text) {
  const url = `https://wa.me/${CONFIG.WA_NUMBER}?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}
$("#waBtn")?.addEventListener("click", () => {
  openWhatsApp("السلام عليكم، أود الاستفسار عن خدمات مكتب إرادة وطموح.");
});

/* ========= Modal ========= */
const backdrop = $("#backdrop");
const closeModalBtn = $("#closeModal");
const mTitle = $("#mTitle");
const mDesc = $("#mDesc");
const mBodyText = $("#mBodyText");
const mActions = $("#mActions");
const contactForm = $("#contactForm");
const officeLine = $("#officeLine");

function setOfficeLine() {
  if (!officeLine) return;
  officeLine.textContent =
    `📍 ${CONFIG.OFFICE_LOCATION} • 📞 ${CONFIG.OFFICE_PHONE} • ✉️ ${CONFIG.OFFICE_EMAIL} • 🕘 ${CONFIG.WORK_HOURS}`;
}
setOfficeLine();

let lastFocusedEl = null;

function openModal({ title, desc, showForm = false, preService = "" }) {
  lastFocusedEl = document.activeElement;

  mTitle.textContent = title || "تفاصيل";
  mDesc.textContent = desc || "";
  mBodyText.textContent = showForm ? "" : (desc || "");
  mActions.innerHTML = "";

  contactForm.style.display = showForm ? "grid" : "none";

  if (showForm) {
    const serviceEl = $("#service");
    if (serviceEl && preService) {
      const options = [...serviceEl.options].map(o => o.value);
      if (options.includes(preService)) serviceEl.value = preService;
    }

    const btnWA = document.createElement("button");
    btnWA.type = "button";
    btnWA.className = "btn";
    btnWA.textContent = "واتساب مباشر";
    btnWA.addEventListener("click", () => {
      openWhatsApp("السلام عليكم، أود الاستفسار عن خدمات مكتب إرادة وطموح.");
    });
    mActions.appendChild(btnWA);

    setTimeout(() => $("#fullName")?.focus(), 0);
  } else {
    const btnContact = document.createElement("button");
    btnContact.type = "button";
    btnContact.className = "btn primary";
    btnContact.textContent = "فتح نموذج التواصل";
    btnContact.addEventListener("click", () => {
      openModal({ title: "تواصل سريع", desc: "أدخل بيانات بسيطة وسنعاود التواصل.", showForm: true });
    });
    mActions.appendChild(btnContact);
  }

  backdrop.classList.add("open");
  backdrop.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  backdrop.classList.remove("open");
  backdrop.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";

  if (lastFocusedEl && typeof lastFocusedEl.focus === "function") {
    lastFocusedEl.focus();
  }
}

closeModalBtn?.addEventListener("click", closeModal);
backdrop?.addEventListener("click", (e) => { if (e.target === backdrop) closeModal(); });
window.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

/* ========= Tiles click ========= */
$$(".tile").forEach(tile => {
  tile.addEventListener("click", () => {
    const title = tile.getAttribute("data-title") || "تفاصيل";
    const desc = tile.getAttribute("data-desc") || "";
    const isContact = tile.getAttribute("data-contact") === "1";
    const preService = tile.getAttribute("data-service") || "";

    openModal({
      title,
      desc,
      showForm: isContact,
      preService: isContact ? "" : preService,
    });

    if (!isContact) {
      const quick = document.createElement("button");
      quick.type = "button";
      quick.className = "btn";
      quick.textContent = "طلب الخدمة الآن";
      quick.addEventListener("click", () => {
        openModal({
          title: "طلب خدمة",
          desc: "أدخل بيانات بسيطة وسنعاود التواصل.",
          showForm: true,
          preService
        });
      });
      mActions.appendChild(quick);
    }
  });
});

/* ========= Copy office info ========= */
$("#copyInfo")?.addEventListener("click", async () => {
  const text =
    `مكتب إرادة وطموح\n` +
    `الموقع: ${CONFIG.OFFICE_LOCATION}\n` +
    `الجوال: ${CONFIG.OFFICE_PHONE}\n` +
    `البريد: ${CONFIG.OFFICE_EMAIL}\n` +
    `أوقات العمل: ${CONFIG.WORK_HOURS}\n` +
    `واتساب: https://wa.me/${CONFIG.WA_NUMBER}`;

  try {
    await navigator.clipboard.writeText(text);
    toast("نسخ ✅", "تم نسخ بيانات المكتب.");
  } catch {
    toast("تعذر النسخ", "المتصفح لا يدعم النسخ التلقائي هنا.");
  }
});

/* ========= Contact form (واجهة فقط) ========= */
$("#contactForm")?.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = ($("#fullName")?.value || "").trim();
  const phone = ($("#phone")?.value || "").trim().replace(/\s/g, "");
  const service = $("#service")?.value || "";
  const channel = $("#channel")?.value || "واتساب";
  const msg = ($("#msg")?.value || "").trim();

  if (name.length < 3) { toast("تنبيه", "يرجى إدخال الاسم الكامل."); $("#fullName")?.focus(); return; }
  const phoneOk = /^(\+?\d{8,15}|05\d{8})$/.test(phone);
  if (!phoneOk) { toast("تنبيه", "رقم الجوال غير صحيح (مثال: 05xxxxxxxx)."); $("#phone")?.focus(); return; }
  if (!service) { toast("تنبيه", "اختر نوع الخدمة."); $("#service")?.focus(); return; }
  if (msg.length < 10) { toast("تنبيه", "اكتب تفاصيل أكثر (10 أحرف على الأقل)."); $("#msg")?.focus(); return; }

  toast("تم ✅", "تم استلام طلبك وسنعاود التواصل قريبًا.");

  if (channel === "واتساب") {
    const wText =
      `طلب خدمة من موقع مكتب إرادة وطموح:\n` +
      `الاسم: ${name}\n` +
      `الجوال: ${phone}\n` +
      `الخدمة: ${service}\n` +
      `الرسالة: ${msg}`;
    openWhatsApp(wText);
  }

  e.target.reset();
  closeModal();
});

/* ========= Canvas Particles (مُحسن للجوال/التابلت) ========= */
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d", { alpha: true });

let W, H, DPR;
function resize() {
  DPR = Math.min(2, window.devicePixelRatio || 1);
  W = canvas.width = Math.floor(innerWidth * DPR);
  H = canvas.height = Math.floor(innerHeight * DPR);
  canvas.style.width = innerWidth + "px";
  canvas.style.height = innerHeight + "px";
}
addEventListener("resize", resize, { passive: true });
resize();

const particles = [];
function countForDevice() {
  const area = innerWidth * innerHeight;
  const base = Math.floor(area / 24000);
  const cap = innerWidth < 600 ? 34 : innerWidth < 980 ? 52 : 76;
  return Math.max(16, Math.min(cap, base));
}
const COUNT = reduceMotion ? 0 : countForDevice();

const rand = (a, b) => Math.random() * (b - a) + a;

function seed() {
  particles.length = 0;
  for (let i = 0; i < COUNT; i++) {
    particles.push({
      x: rand(0, W), y: rand(0, H),
      vx: rand(-0.18, 0.18), vy: rand(-0.12, 0.12),
      r: rand(1.1, 2.1),
      a: rand(0.10, 0.24),
    });
  }
}
seed();

let mouse = { x: -9999, y: -9999 };
addEventListener("mousemove", (e) => {
  mouse.x = e.clientX * DPR;
  mouse.y = e.clientY * DPR;
}, { passive: true });

function loop() {
  ctx.clearRect(0, 0, W, H);

  const g = ctx.createRadialGradient(W * 0.72, H * 0.18, 0, W * 0.72, H * 0.18, Math.max(W, H) * 0.7);
  g.addColorStop(0, "rgba(31,167,184,0.10)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  for (const p of particles) {
    p.x += p.vx * DPR;
    p.y += p.vy * DPR;

    if (p.x < -30) p.x = W + 30;
    if (p.x > W + 30) p.x = -30;
    if (p.y < -30) p.y = H + 30;
    if (p.y > H + 30) p.y = -30;

    const dx = mouse.x - p.x, dy = mouse.y - p.y;
    const dist = Math.hypot(dx, dy);
    if (dist < 150 * DPR) {
      p.x -= dx * 0.00030;
      p.y -= dy * 0.00030;
    }

    ctx.beginPath();
    ctx.fillStyle = `rgba(44,198,216,${p.a})`;
    ctx.arc(p.x, p.y, p.r * DPR, 0, Math.PI * 2);
    ctx.fill();
  }

  const maxDist = (innerWidth < 600 ? 90 : 115) * DPR;

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const a = particles[i], b = particles[j];
      const dx = a.x - b.x, dy = a.y - b.y;
      const d = Math.hypot(dx, dy);
      if (d < maxDist) {
        const alpha = (1 - d / maxDist) * 0.14;
        ctx.strokeStyle = `rgba(31,167,184,${alpha})`;
        ctx.lineWidth = 1 * DPR;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(loop);
}

if (!reduceMotion) loop();
