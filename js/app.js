const CONFIG = {
  WA_NUMBER: "9665XXXXXXXX", // بدون +
  OFFICE_PHONE: "+966 — [رقمك]",
  OFFICE_EMAIL: "[بريدك الرسمي]",
  OFFICE_LOCATION: "مدينة حائل – حي شراف",
  WORK_HOURS: "من 9 صباحًا إلى 5 مساءً",
};

const $ = (q, el = document) => el.querySelector(q);
const $$ = (q, el = document) => [...el.querySelectorAll(q)];

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

/* ========= بيانات المودال (تفاصيل بدون تكرار) ========= */
const DETAILS = {
  realestate: {
    subtitle: "بيع • شراء • تأجير — خدمة موثوقة مع متابعة واضحة.",
    body: "نساعدك في إجراءات البيع والشراء والتأجير، مع تواصل مباشر ومتابعة حتى إتمام الإجراء، وبأسلوب واضح ومنظم."
  },
  ngo: {
    subtitle: "لوائح • نماذج • تقارير — دعم للقطاع غير الربحي.",
    body: "نُعد اللوائح والنماذج والتقارير ونساعد في بناء إجراءات إدارية ومالية مرتبة تناسب احتياج الجمعية."
  },
  tech: {
    subtitle: "نماذج • بيانات • عروض • تقارير — تنفيذ عن بُعد.",
    body: "ننفذ خدمات تقنية عن بُعد بجودة عالية: إعداد نماذج، تنظيم بيانات، عروض تقديمية، وتقارير احترافية."
  },
  contact: {
    subtitle: "نموذج مختصر + واتساب مباشر.",
    body: "املأ بيانات بسيطة وسنعاود التواصل في أقرب وقت، أو تواصل مباشرة عبر واتساب."
  }
};

function openWhatsApp(text) {
  const url = `https://wa.me/${CONFIG.WA_NUMBER}?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

$("#waBtn")?.addEventListener("click", () => {
  openWhatsApp("السلام عليكم، أود الاستفسار عن خدمات مكتب إرادة وطموح.");
});

/* ========= دخول تدريجي للبطاقات ========= */
(function staggerTiles() {
  const tiles = $$(".tile");
  tiles.forEach((tile, i) => {
    if (reduceMotion) return tile.classList.add("is-in");
    setTimeout(() => tile.classList.add("is-in"), 120 + i * 90);
  });
})();

/* ========= Spotlight يتبع الماوس داخل الكرت ========= */
(function cardSpotlight(){
  const card = $("#heroCard");
  if (!card || reduceMotion) return;

  let raf = null;
  card.addEventListener("pointermove", (e) => {
    const r = card.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;

    if (raf) return;
    raf = requestAnimationFrame(() => {
      card.style.setProperty("--mx", `${x.toFixed(2)}%`);
      card.style.setProperty("--my", `${y.toFixed(2)}%`);
      raf = null;
    });
  }, { passive: true });
})();

/* ========= Parallax بسيط للعنوان الكبير ========= */
(function parallaxTitle(){
  const title = $(".side-title h1");
  if (!title || reduceMotion) return;

  let raf = null;
  const state = { x: 0, y: 0 };

  window.addEventListener("mousemove", (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    state.x = (e.clientX - cx) / cx;
    state.y = (e.clientY - cy) / cy;

    if (raf) return;
    raf = requestAnimationFrame(() => {
      title.style.transform = `translate3d(${(state.x * 8).toFixed(2)}px, ${(state.y * 6).toFixed(2)}px, 0)`;
      raf = null;
    });
  }, { passive: true });
})();

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

function openModal({ title, subtitle, body, showForm = false, preService = "" }) {
  lastFocusedEl = document.activeElement;

  mTitle.textContent = title || "تفاصيل";
  mDesc.textContent = subtitle || "";
  mBodyText.innerHTML = body ? `<p style="margin:0;color:rgba(234,242,255,.86);font-weight:800;line-height:1.9">${escapeHTML(body)}</p>` : "";
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
      openModal({
        title: "تواصل سريع",
        subtitle: DETAILS.contact.subtitle,
        body: DETAILS.contact.body,
        showForm: true
      });
    });
    mActions.appendChild(btnContact);

    const btnService = document.createElement("button");
    btnService.type = "button";
    btnService.className = "btn";
    btnService.textContent = "طلب الخدمة الآن";
    btnService.addEventListener("click", () => {
      openModal({
        title: "طلب خدمة",
        subtitle: "أدخل بيانات بسيطة وسنعاود التواصل.",
        body: "",
        showForm: true,
        preService
      });
    });
    mActions.appendChild(btnService);
  }

  backdrop.classList.add("open");
  backdrop.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  backdrop.classList.remove("open");
  backdrop.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  if (lastFocusedEl && typeof lastFocusedEl.focus === "function") lastFocusedEl.focus();
}

closeModalBtn?.addEventListener("click", closeModal);
backdrop?.addEventListener("click", (e) => { if (e.target === backdrop) closeModal(); });
window.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

/* فتح المودال من البطاقات */
$$(".tile").forEach(tile => {
  tile.addEventListener("click", () => {
    const key = tile.getAttribute("data-key") || "contact";
    const title = tile.getAttribute("data-title") || "تفاصيل";
    const preService = tile.getAttribute("data-service") || "";
    const isContact = tile.getAttribute("data-contact") === "1";

    const d = DETAILS[key] || DETAILS.contact;

    openModal({
      title,
      subtitle: d.subtitle,
      body: d.body,
      showForm: isContact,
      preService: isContact ? "" : preService
    });
  });
});

/* نسخ بيانات المكتب */
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

/* نموذج التواصل */
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

/* ========= Canvas Particles (كما هو محسّن للجوال/التابلت) ========= */
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
