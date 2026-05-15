/* ════════════════════════════════════════════════════
   javascript.js — Pezão Capoeira · Método Ginga Forte
   ════════════════════════════════════════════════════ */

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

// ── 1. HERO — ENTRADA + PARALLAX NA IMAGEM ────────────
const heroEl = document.querySelector(".hero");
const heroBgWrap = document.querySelector(".hero-bg-wrap");

function initHero() {
  if (!heroEl) return;

  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (prefersReducedMotion || !heroBgWrap || !heroEl) return;
      if (!ticking) {
        requestAnimationFrame(() => {
          const max = heroEl.offsetHeight || window.innerHeight;
          const progress = Math.min(window.scrollY, max);
          heroBgWrap.style.transform = `translate3d(0, ${progress * 0.18}px, 0)`;
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true },
  );
}

window.addEventListener("load", initHero);

// ── 2. REVEAL ON SCROLL ─────────────────────────────
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 },
);

document.querySelectorAll(".reveal").forEach((el) => {
  revealObserver.observe(el);
});

// ── 3. CONTAGEM DOS NÚMEROS (AUTORIDADE) ──────────────
function formatStatNum(value, useLocale) {
  if (useLocale) return Math.round(value).toLocaleString("pt-BR");
  return String(Math.round(value));
}

function easeOutQuad(t) {
  return 1 - (1 - t) * (1 - t);
}

function runStatCountUps() {
  const nums = document.querySelectorAll(".stat-num[data-count]");
  nums.forEach((el) => {
    const target = parseInt(el.getAttribute("data-count"), 10);
    const suffix = el.getAttribute("data-suffix") || "";
    const useLocale = el.hasAttribute("data-format-int");
    const duration = 1600;
    const start = performance.now();

    function frame(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = easeOutQuad(t);
      const val = target * eased;
      el.textContent = formatStatNum(val, useLocale) + suffix;
      if (t < 1) requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  });
}

let statsCountStarted = false;

function primeStatsForAnimation() {
  document.querySelectorAll(".stat-num[data-count]").forEach((el) => {
    const suffix = el.getAttribute("data-suffix") || "";
    const useLocale = el.hasAttribute("data-format-int");
    el.textContent = formatStatNum(0, useLocale) + suffix;
  });
}

const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting || statsCountStarted) return;
      statsCountStarted = true;
      if (!prefersReducedMotion) {
        primeStatsForAnimation();
        runStatCountUps();
      }
      statsObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.25 },
);

const statsRow = document.querySelector(".stats-row");
if (statsRow && !prefersReducedMotion) {
  statsObserver.observe(statsRow);
}

// ── 4. MENU MOBILE ────────────────────────────────────
const bodyEl = document.body;
const navToggle = document.querySelector(".nav-toggle");
const navBackdrop = document.querySelector(".nav-backdrop");
const mqNavMobile = window.matchMedia("(max-width: 768px)");

function setNavMenuOpen(open) {
  bodyEl.classList.toggle("nav-menu-open", open);
  if (navToggle) {
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    navToggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  }
}

function closeNavMenuIfMobile() {
  if (mqNavMobile.matches) setNavMenuOpen(false);
}

if (navToggle) {
  navToggle.addEventListener("click", () => {
    const open = !bodyEl.classList.contains("nav-menu-open");
    setNavMenuOpen(open);
  });
}

if (navBackdrop) {
  navBackdrop.addEventListener("click", () => closeNavMenuIfMobile());
}

document.querySelectorAll("#primary-nav a").forEach((a) => {
  a.addEventListener("click", () => closeNavMenuIfMobile());
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeNavMenuIfMobile();
});

mqNavMobile.addEventListener("change", (e) => {
  if (!e.matches) setNavMenuOpen(false);
});

// ── 5. SCROLL SUAVE + SCROLL SPY ─────────────────────
const spySectionIds = ["autoridade", "metodo", "para-quem", "prova", "oferta"];

function updateNavSpy() {
  const fromTop = window.scrollY + 110;
  let currentId = spySectionIds[0];
  for (const id of spySectionIds) {
    const el = document.getElementById(id);
    if (el && el.offsetTop <= fromTop) currentId = id;
  }
  document.querySelectorAll("[data-nav-anchor]").forEach((link) => {
    link.classList.toggle("nav-active", link.dataset.navAnchor === currentId);
  });
}

let spyTicking = false;
window.addEventListener(
  "scroll",
  () => {
    if (!spyTicking) {
      requestAnimationFrame(() => {
        updateNavSpy();
        spyTicking = false;
      });
      spyTicking = true;
    }
    const nav = document.querySelector(".site-nav");
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 60);
  },
  { passive: true },
);
updateNavSpy();

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    const href = anchor.getAttribute("href");
    if (href === "#" || href.length < 2) return;

    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });
    }
  });
});

// ── 6. CONTADOR REGRESSIVO + FEEDBACK VISUAL ─────────
function flashCountdownIfChanged(elements, pads, prev) {
  pads.forEach((str, i) => {
    if (prev[i] !== str) elements[i].classList.add("countdown-tick");
  });
}

function clearCountFlash(els) {
  els.forEach((el) => el.classList.remove("countdown-tick"));
}

function startCountdown(targetDate) {
  const hEl = document.getElementById("cd-h");
  const mEl = document.getElementById("cd-m");
  const sEl = document.getElementById("cd-s");
  if (!hEl || !mEl || !sEl) return;

  const numEls = [hEl, mEl, sEl];
  let prev = ["–", "–", "–"];

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function tick() {
    const diff = targetDate - new Date();

    if (diff <= 0) {
      const zeros = ["00", "00", "00"];
      flashCountdownIfChanged(numEls, zeros, prev);
      hEl.textContent = "00";
      mEl.textContent = "00";
      sEl.textContent = "00";
      clearCountFlash(numEls);
      return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const mVal = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    const next = [pad(h), pad(mVal), pad(s)];
    if (!prefersReducedMotion && prev[0] !== "–") {
      flashCountdownIfChanged(numEls, next, prev);
      setTimeout(() => clearCountFlash(numEls), 480);
    }

    hEl.textContent = next[0];
    mEl.textContent = next[1];
    sEl.textContent = next[2];
    prev = next;

    setTimeout(tick, 1000);
  }

  tick();
}

const COUNTDOWN_KEY = "pezao_countdown_target";
const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

let storedTarget = parseInt(localStorage.getItem(COUNTDOWN_KEY) || "0", 10);
if (!storedTarget || storedTarget < Date.now()) {
  storedTarget = Date.now() + TWENTY_FOUR_HOURS;
  localStorage.setItem(COUNTDOWN_KEY, String(storedTarget));
}
startCountdown(new Date(storedTarget));

// ── 7. CARROSSEL DE PROVA SOCIAL (INFINITO + AUTOMÁTICO) ──
function initProvaCarousel() {
  const carousel = document.querySelector("[data-carousel]");
  if (!carousel) return;

  const track = carousel.querySelector(".prova-carousel-track");
  if (!track) return;

  const baseSlides = Array.from(track.querySelectorAll(".prova-slide"));
  if (baseSlides.length < 2) return;

  const firstClone = baseSlides[0].cloneNode(true);
  track.appendChild(firstClone);

  let index = 0;
  let timerId = null;
  const intervalMs = 3200;

  function goTo(nextIndex, withTransition = true) {
    track.style.transition = withTransition
      ? "transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)"
      : "none";
    track.style.transform = `translate3d(-${nextIndex * 100}%, 0, 0)`;
  }

  function nextSlide() {
    index += 1;
    goTo(index, true);
  }

  function startAuto() {
    if (prefersReducedMotion || timerId) return;
    timerId = setInterval(nextSlide, intervalMs);
  }

  function stopAuto() {
    if (!timerId) return;
    clearInterval(timerId);
    timerId = null;
  }

  track.addEventListener("transitionend", () => {
    if (index !== baseSlides.length) return;
    index = 0;
    goTo(index, false);
  });

  carousel.addEventListener("mouseenter", stopAuto);
  carousel.addEventListener("mouseleave", startAuto);
  carousel.addEventListener("focusin", stopAuto);
  carousel.addEventListener("focusout", startAuto);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopAuto();
    else startAuto();
  });

  goTo(0, false);
  startAuto();
}

initProvaCarousel();

function initLucideIcons() {
  if (typeof lucide === "undefined") return;
  lucide.createIcons({
    attrs: {
      "stroke-width": 1.75,
    },
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initLucideIcons);
} else {
  initLucideIcons();
}
