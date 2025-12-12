// script.js - vanilla JS interactivity for Esencia Cuántica
document.addEventListener("DOMContentLoaded", function () {
  // Mobile nav toggle
  const navToggle = document.querySelector(".nav-toggle");
  const navList = document.querySelector(".nav-list");
  navToggle &&
    navToggle.addEventListener("click", () => {
      navList.classList.toggle("open");
    });

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

  // Accordion behavior (main and sub)
  function setupAccordion(containerSelector, toggleSelector, panelSelector) {
    const toggles = document.querySelectorAll(toggleSelector);
    toggles.forEach((btn) => {
      btn.addEventListener("click", () => {
        const panel = btn.nextElementSibling;
        if (!panel) return;
        const isOpen = panel.style.maxHeight && panel.style.maxHeight !== "0px";
        // close other panels at same level
        const siblings = Array.from(document.querySelectorAll(toggleSelector))
          .map((t) => t.nextElementSibling)
          .filter((p) => p !== panel);
        siblings.forEach((s) => {
          s.style.maxHeight = null;
        });
        if (isOpen) {
          panel.style.maxHeight = null;
        } else {
          panel.style.maxHeight = panel.scrollHeight + "px";
        }
      });
    });
  }
  setupAccordion("#collections-acc", ".accordion-toggle", ".accordion-panel");
  setupAccordion("#collections-acc", ".sub-toggle", ".sub-panel");

  // make sure initially no panels open, but allow first-level closed
  document
    .querySelectorAll(".accordion-panel, .sub-panel")
    .forEach((p) => (p.style.maxHeight = null));

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
    { threshold: 0.08 }
  );
  faders.forEach((f) => io.observe(f));

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

  // Accessibility: allow Enter/Space to toggle accordions
  document.querySelectorAll(".accordion-toggle, .sub-toggle").forEach((btn) => {
    btn.setAttribute("tabindex", "0");
    btn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        btn.click();
      }
    });
  });
});
