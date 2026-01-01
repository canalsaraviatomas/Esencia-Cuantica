// script.js - vanilla JS interactivity for Esencia Cuántica
document.addEventListener("DOMContentLoaded", function () {
  // Mobile nav toggle (with aria and outside click close)
  const navToggle = document.querySelector(".nav-toggle");
  const navList = document.querySelector(".nav-list");
  if (navToggle && navList) {
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.addEventListener("click", (e) => {
      const open = navList.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      e.stopPropagation();
    });
    // close when clicking outside
    document.addEventListener("click", (e) => {
      if (!navList.classList.contains("open")) return;
      if (!navList.contains(e.target) && !navToggle.contains(e.target)) {
        navList.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Sticky header shadow on scroll
  const header = document.getElementById("site-header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 10) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  });

  // Smooth scroll for internal links (enhanced)
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (!target) return;
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      // close mobile nav
      if (navList.classList.contains("open")) navList.classList.remove("open");
    });
  });

  // Fade-in on scroll
  const faders = document.querySelectorAll(".fade-in");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0, rootMargin: "50px" }
  );
  faders.forEach((f) => {
    // Ensure visibility immediately as fallback
    f.classList.add("visible");
    io.observe(f);
  });

  // Parallax subtle effect on hero
  const heroBg = document.querySelector(".hero-bg");
  window.addEventListener("scroll", () => {
    if (!heroBg) return;
    const y = window.scrollY * 0.08; // subtle
    heroBg.style.transform = `translateY(${y}px)`;
  });

  // Load images from data-img attribute when present
  document.querySelectorAll("img[data-img]").forEach((img) => {
    const src = img.getAttribute("data-img");
    if (src && src.trim() !== "") {
      img.src = src;
      img.addEventListener("error", () => {
        img.style.opacity = 0.6;
      });
    } else {
      // placeholder styling if no image provided
      img.style.background = "linear-gradient(135deg,#f3f3f3,#fafafa)";
      img.alt = img.alt || "";
    }
  });

  // Make QR placeholders clickable if data-qr provided
  document.querySelectorAll(".qr-placeholder").forEach((q) => {
    const link = q.getAttribute("data-qr");
    if (link && link.trim() !== "") {
      q.style.cursor = "pointer";
      q.addEventListener("click", () => window.open(link, "_blank"));
    }
  });

  // Footer year dynamic
  const yEl = document.getElementById("year");
  if (yEl) yEl.textContent = new Date().getFullYear();
});
