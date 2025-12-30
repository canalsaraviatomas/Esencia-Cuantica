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

  // Accordion behavior (main and sub)
  function setupAccordion(containerSelector, toggleSelector, panelSelector) {
    const toggles = document.querySelectorAll(toggleSelector);
    toggles.forEach((btn) => {
      // set initial aria state
      btn.setAttribute("aria-expanded", "false");
      btn.addEventListener("click", () => {
        const panel = btn.nextElementSibling;
        if (!panel) return;
        const isOpen = panel.style.maxHeight && panel.style.maxHeight !== "0px";
        // close other panels at same level
        const siblings = Array.from(document.querySelectorAll(toggleSelector))
          .map((t) => t.nextElementSibling)
          .filter((p) => p !== panel);
        siblings.forEach((s) => {
          if (!s) return;
          s.style.maxHeight = null;
          const tb = s.previousElementSibling;
          if (tb) {
            tb.classList.remove("is-open");
            tb.setAttribute("aria-expanded", "false");
          }
        });
        if (isOpen) {
          panel.style.maxHeight = null;
          btn.classList.remove("is-open");
          btn.setAttribute("aria-expanded", "false");
        } else {
          panel.style.maxHeight = panel.scrollHeight + "px";
          btn.classList.add("is-open");
          btn.setAttribute("aria-expanded", "true");
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

  // Sistema de tabs para colecciones de perfumes
  const tabBtns = document.querySelectorAll(".tab-btn");
  const collectionTabs = document.querySelectorAll(".collection-tab");

  if (tabBtns.length > 0) {
    tabBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const tabId = btn.getAttribute("data-tab");

        // Remover clase active de todos los botones y tabs
        tabBtns.forEach((b) => {
          b.classList.remove("active");
          b.setAttribute("aria-selected", "false");
        });
        collectionTabs.forEach((tab) => {
          tab.classList.remove("active");
        });

        // Añadir clase active al botón y tab seleccionado
        btn.classList.add("active");
        btn.setAttribute("aria-selected", "true");
        const selectedTab = document.getElementById(tabId);
        if (selectedTab) {
          selectedTab.classList.add("active");
        }
      });

      // Permitir navegación con teclado (Enter/Space)
      btn.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          btn.click();
        }
      });
    });
  }

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

  // Filtrado de productos por categoría (sección Perfumes)
  const filterBtns = document.querySelectorAll(".filter-btn");
  const productCards = document.querySelectorAll(".product-card");
  if (filterBtns.length && productCards.length) {
    filterBtns.forEach((btn) => {
      // keyboard accessibility
      btn.setAttribute("tabindex", "0");
      btn.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          btn.click();
        }
      });

      btn.addEventListener("click", () => {
        const filter = btn.dataset.filter;
        filterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        productCards.forEach((card) => {
          const cat = card.dataset.category || "";
          if (filter === "all" || cat === filter) {
            card.style.display = "";
          } else {
            card.style.display = "none";
          }
        });
      });
    });
  }

  // Footer year dynamic
  const yEl = document.getElementById("year");
  if (yEl) yEl.textContent = new Date().getFullYear();
});
