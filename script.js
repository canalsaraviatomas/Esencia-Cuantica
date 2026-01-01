// Esencia Cuántica - Enhanced UX JavaScript
document.addEventListener("DOMContentLoaded", function () {
  // ============================================
  // Mobile Navigation Toggle
  // ============================================
  const navToggle = document.querySelector(".nav-toggle");
  const navList = document.querySelector(".nav-list");
  
  if (navToggle && navList) {
    navToggle.setAttribute("aria-expanded", "false");
    
    navToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = navList.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      
      // Update button text for accessibility
      navToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
    });
    
    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!navList.classList.contains("open")) return;
      
      if (!navList.contains(e.target) && !navToggle.contains(e.target)) {
        navList.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Abrir menú");
      }
    });
    
    // Close menu on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navList.classList.contains("open")) {
        navList.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Abrir menú");
        navToggle.focus();
      }
    });
  }

  // ============================================
  // Sticky Header Shadow on Scroll
  // ============================================
  const header = document.getElementById("site-header");
  let lastScroll = 0;
  
  if (header) {
    window.addEventListener("scroll", () => {
      const currentScroll = window.scrollY;
      
      if (currentScroll > 10) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
      
      lastScroll = currentScroll;
    }, { passive: true });
  }

  // ============================================
  // Smooth Scroll for Internal Links
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      
      // Skip empty hash links
      if (href === "#" || href === "#!") {
        return;
      }
      
      const target = document.querySelector(href);
      
      if (target) {
        e.preventDefault();
        
        // Close mobile nav if open
        if (navList && navList.classList.contains("open")) {
          navList.classList.remove("open");
          if (navToggle) {
            navToggle.setAttribute("aria-expanded", "false");
            navToggle.setAttribute("aria-label", "Abrir menú");
          }
        }
        
        // Calculate offset for sticky header
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth"
        });
        
        // Update URL without triggering scroll
        if (history.pushState) {
          history.pushState(null, null, href);
        }
      }
    });
  });

  // ============================================
  // Fade-in Animation on Scroll
  // ============================================
  const faders = document.querySelectorAll(".fade-in");
  
  if (faders.length > 0 && "IntersectionObserver" in window) {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "50px"
    };
    
    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          fadeObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    faders.forEach((fader) => {
      // Ensure visibility as fallback for no-JS
      fader.classList.add("visible");
      fadeObserver.observe(fader);
    });
  } else {
    // Fallback: show all fade-in elements immediately
    faders.forEach((fader) => {
      fader.classList.add("visible");
    });
  }

  // ============================================
  // Subtle Parallax Effect on Hero
  // ============================================
  const heroBg = document.querySelector(".hero-bg");
  
  if (heroBg && window.innerWidth > 768) {
    let ticking = false;
    
    window.addEventListener("scroll", () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.pageYOffset;
          const parallaxSpeed = 0.08;
          const y = scrolled * parallaxSpeed;
          
          heroBg.style.transform = `translateY(${y}px)`;
          ticking = false;
        });
        
        ticking = true;
      }
    }, { passive: true });
  }

  // ============================================
  // Lazy Load Images from data-img Attribute
  // ============================================
  const lazyImages = document.querySelectorAll("img[data-img]");
  
  if (lazyImages.length > 0 && "IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.getAttribute("data-img");
          
          if (src && src.trim() !== "") {
            // Create new image to preload
            const newImg = new Image();
            newImg.onload = () => {
              img.src = src;
              img.classList.add("loaded");
            };
            newImg.onerror = () => {
              img.style.opacity = "0.6";
              img.alt = img.alt || "Imagen no disponible";
            };
            newImg.src = src;
          } else {
            // Placeholder styling if no image provided
            img.style.background = "linear-gradient(135deg, #f3f3f3, #fafafa)";
            img.alt = img.alt || "";
          }
          
          imageObserver.unobserve(img);
        }
      });
    }, {
      rootMargin: "50px"
    });
    
    lazyImages.forEach((img) => {
      imageObserver.observe(img);
    });
  } else {
    // Fallback: load all images immediately
    lazyImages.forEach((img) => {
      const src = img.getAttribute("data-img");
      if (src && src.trim() !== "") {
        img.src = src;
      }
    });
  }

  // ============================================
  // Dynamic Footer Year
  // ============================================
  const yearElement = document.getElementById("year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Active navigation link highlighting removed per user request
  // Only hover effects remain

  // ============================================
  // Improve Touch Target Sizes on Mobile
  // ============================================
  if ("ontouchstart" in window) {
    document.body.classList.add("touch-device");
  }

  // ============================================
  // Prevent Layout Shift on Image Load
  // ============================================
  const images = document.querySelectorAll("img");
  images.forEach((img) => {
    if (img.complete) {
      img.classList.add("loaded");
    } else {
      img.addEventListener("load", function () {
        this.classList.add("loaded");
      });
    }
  });
});
