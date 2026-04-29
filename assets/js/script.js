// Modern University Landing Page - Advanced Interactions
// Jurusan Bahasa Website

// Check for reduced motion preference
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

// ===== Initialize AOS (Animate On Scroll) =====
document.addEventListener("DOMContentLoaded", function () {
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 800,
      easing: "ease-out-cubic",
      once: true,
      offset: 100,
      disable: prefersReducedMotion,
    });
  }
});

// ===== Smooth Scrolling for Navigation Links =====
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    }
  });
});

// ===== Navbar Scroll Effect =====
const navbar = document.querySelector(".navbar");
let lastScrollY = 0;

function handleNavbarScroll() {
  if (!navbar) return;

  const scrollY = window.scrollY;

  if (scrollY > 50) {
    navbar.classList.add("glass-nav", "scrolled");
    navbar.style.backgroundColor = "rgba(10, 37, 64, 0.9)";
  } else {
    navbar.classList.remove("glass-nav", "scrolled");
    navbar.style.backgroundColor = "var(--primary-color)";
    navbar.style.backdropFilter = "none";
  }

  lastScrollY = scrollY;
}

window.addEventListener("scroll", handleNavbarScroll, { passive: true });

// ===== Hero Text Scramble/Reveal Effect =====
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = "!<>-_\\/[]{}—=+*^?#________";
    this.update = this.update.bind(this);
  }

  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => (this.resolve = resolve));
    this.queue = [];

    for (let i = 0; i < length; i++) {
      const from = oldText[i] || "";
      const to = newText[i] || "";
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      this.queue.push({ from, to, start, end });
    }

    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }

  update() {
    let output = "";
    let complete = 0;

    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];

      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span class="scramble-char">${char}</span>`;
      } else {
        output += from;
      }
    }

    this.el.innerHTML = output;

    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }

  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

// Initialize text scramble on hero title
document.addEventListener("DOMContentLoaded", () => {
  if (prefersReducedMotion) return;

  const heroTitle = document.querySelector(".hero-title");
  if (heroTitle) {
    const originalText = heroTitle.innerText;
    heroTitle.style.opacity = "1";

    const fx = new TextScramble(heroTitle);
    setTimeout(() => {
      fx.setText(originalText);
    }, 500);
  }
});

// ===== Animated Number Counters =====
class Counter {
  constructor(el) {
    this.el = el;
    this.target = parseInt(el.dataset.count, 10);
    this.duration = 2000;
    this.startTime = null;
    this.hasAnimated = false;
  }

  animate(timestamp) {
    if (!this.startTime) this.startTime = timestamp;
    const progress = Math.min((timestamp - this.startTime) / this.duration, 1);

    // Ease out expo
    const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    const current = Math.floor(easeOutExpo * this.target);

    this.el.textContent = current.toLocaleString("id-ID");

    if (progress < 1) {
      requestAnimationFrame(this.animate.bind(this));
    } else {
      this.el.textContent = this.target.toLocaleString("id-ID");
    }
  }

  start() {
    if (this.hasAnimated) return;
    this.hasAnimated = true;
    requestAnimationFrame(this.animate.bind(this));
  }
}

// Observe stat numbers for counter animation
const statObserverOptions = {
  threshold: 0.5,
  rootMargin: "0px",
};

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const counter = new Counter(entry.target);
      counter.start();
      statObserver.unobserve(entry.target);
    }
  });
}, statObserverOptions);

document.querySelectorAll(".stat-number").forEach((el) => {
  statObserver.observe(el);
});

// ===== 3D Tilt Effect on Cards =====
function initTiltEffect() {
  if (prefersReducedMotion || window.innerWidth < 768) return;

  const tiltCards = document.querySelectorAll(".tilt-card");

  tiltCards.forEach((card) => {
    const inner = card.querySelector(".tilt-card-inner");
    if (!inner) return;

    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8; // Max 8 degrees
      const rotateY = ((x - centerX) / centerX) * 8;

      inner.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener("mouseleave", () => {
      inner.style.transform =
        "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";
      inner.style.transition = "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)";

      setTimeout(() => {
        inner.style.transition = "transform 0.1s ease-out";
      }, 500);
    });

    card.addEventListener("mouseenter", () => {
      inner.style.transition = "transform 0.1s ease-out";
    });
  });
}

document.addEventListener("DOMContentLoaded", initTiltEffect);

// ===== Parallax Effect on Hero Background =====
function initParallax() {
  if (prefersReducedMotion) return;

  const heroSection = document.querySelector(".hero-section");
  if (!heroSection) return;

  let ticking = false;

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.pageYOffset;
          const rate = scrollY * 0.4;
          heroSection.style.backgroundPositionY = `${50 + rate * 0.02}%`;
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true },
  );
}

document.addEventListener("DOMContentLoaded", initParallax);

// ===== Magnetic Button Effect =====
function initMagneticButtons() {
  if (prefersReducedMotion || window.innerWidth < 768) return;

  const magneticBtns = document.querySelectorAll(".magnetic-btn");

  magneticBtns.forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });

    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "translate(0, 0)";
      btn.style.transition = "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)";

      setTimeout(() => {
        btn.style.transition = "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)";
      }, 500);
    });

    btn.addEventListener("mouseenter", () => {
      btn.style.transition = "transform 0.1s ease-out";
    });
  });
}

document.addEventListener("DOMContentLoaded", initMagneticButtons);

// ===== Intersection Observer for Fade-in Animations =====
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const fadeObserver = new IntersectionObserver(function (entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("fade-in-up");
      fadeObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe elements that should fade in
document.querySelectorAll(".card, .career-card, .glass-card").forEach((el) => {
  if (!el.closest("[data-aos]")) {
    fadeObserver.observe(el);
  }
});

// ===== Mobile Menu Close on Link Click =====
document.querySelectorAll(".navbar-nav .nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    const navbarCollapse = document.querySelector(".navbar-collapse");
    if (navbarCollapse && navbarCollapse.classList.contains("show")) {
      const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
      if (bsCollapse) {
        bsCollapse.hide();
      }
    }
  });
});

// ===== Scroll Reveal for List Items =====
function initListReveal() {
  const lists = document.querySelectorAll(".list-unstyled");

  lists.forEach((list) => {
    const items = list.querySelectorAll("li");
    items.forEach((item, index) => {
      item.style.opacity = "0";
      item.style.transform = "translateX(-20px)";
      item.style.transition = `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s`;

      const itemObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              item.style.opacity = "1";
              item.style.transform = "translateX(0)";
              itemObserver.unobserve(item);
            }
          });
        },
        { threshold: 0.5 },
      );

      itemObserver.observe(item);
    });
  });
}

document.addEventListener("DOMContentLoaded", initListReveal);

// ===== Image Reveal Animation =====
function initImageReveal() {
  const images = document.querySelectorAll(".image-container");

  images.forEach((container) => {
    container.style.opacity = "0";
    container.style.transform = "scale(0.9)";
    container.style.transition = "all 1s cubic-bezier(0.16, 1, 0.3, 1)";

    const imgObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            container.style.opacity = "1";
            container.style.transform = "scale(1)";
            imgObserver.unobserve(container);
          }
        });
      },
      { threshold: 0.2 },
    );

    imgObserver.observe(container);
  });
}

document.addEventListener("DOMContentLoaded", initImageReveal);

// ===== Floating Decorative Elements =====
function createFloatingElements() {
  if (prefersReducedMotion || window.innerWidth < 768) return;

  const sections = document.querySelectorAll("section");

  sections.forEach((section, index) => {
    if (section.querySelector(".decoration-blob")) return;

    const blob = document.createElement("div");
    blob.className = "decoration-blob";
    blob.style.cssText = `
      width: ${200 + Math.random() * 300}px;
      height: ${200 + Math.random() * 300}px;
      background: ${
        index % 2 === 0
          ? "radial-gradient(circle, rgba(10, 37, 64, 0.08), transparent 70%)"
          : "radial-gradient(circle, rgba(247, 192, 74, 0.06), transparent 70%)"
      };
      top: ${Math.random() * 50}%;
      ${index % 2 === 0 ? "right" : "left"}: -10%;
      animation: float ${6 + Math.random() * 4}s ease-in-out infinite;
      animation-delay: ${Math.random() * 2}s;
    `;

    section.style.position = "relative";
    section.appendChild(blob);
  });
}

document.addEventListener("DOMContentLoaded", createFloatingElements);

// ===== Console Welcome Message =====
console.log(
  "%c Jurusan Bahasa ",
  "background: linear-gradient(135deg, #0a2540, #d4af37); color: white; font-size: 24px; font-weight: bold; padding: 10px 20px; border-radius: 10px;",
);
console.log(
  "%cWebsite loaded with glassmorphism & modern animations",
  "color: #0a2540; font-size: 14px; font-style: italic;",
);
