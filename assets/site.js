// Shared site behaviors: mobile menu toggle, footer year, and active-nav detection.
document.addEventListener("DOMContentLoaded", () => {
  // Set footer year
  document.querySelectorAll("[data-footer-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  // Mobile menu toggle
  const menuBtn = document.querySelector("[data-mobile-menu-btn]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });
  }

  // Highlight active nav based on current page filename
  const file = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll("[data-nav-link]").forEach((link) => {
    const href = (link.getAttribute("href") || "").toLowerCase();
    if (href === file || (file === "" && href === "index.html")) {
      link.classList.add("text-primary", "border-b-2", "border-primary");
      link.classList.remove("text-on-surface-variant");
    }
  });

  // Industry selector tabs — switch visible copy per industry
  const industryTabs = document.querySelectorAll("[data-industry-tab]");
  const applyIndustry = (industry) => {
    document.querySelectorAll("[data-industry-content]").forEach((el) => {
      el.hidden = el.dataset.industryContent !== industry;
    });
    industryTabs.forEach((t) => {
      const active = t.dataset.industryTab === industry;
      t.classList.toggle("bg-primary", active);
      t.classList.toggle("text-on-primary", active);
      t.classList.toggle("shadow-ambient", active);
      t.classList.toggle("bg-surface-container-lowest", !active);
      t.classList.toggle("text-on-surface-variant", !active);
      t.setAttribute("aria-pressed", active ? "true" : "false");
    });
  };
  industryTabs.forEach((t) => {
    t.addEventListener("click", () => applyIndustry(t.dataset.industryTab));
  });
  if (industryTabs.length) applyIndustry("commerce");

  // Manual vs Automated — each row is a collapsible toggle; content reveals in before→after order on open
  const mvabSection = document.querySelector("[data-mvab-section]");
  if (mvabSection) {
    mvabSection.querySelectorAll("article").forEach((row) => {
      row.classList.add("mvab-row");
      const header = row.querySelector("header");
      const grid = header && header.nextElementSibling;
      if (!header || !grid) return;

      // Tag direct children of grid as before / arrow / after for staged reveal
      const cols = grid.querySelectorAll(":scope > div");
      if (cols[0]) cols[0].setAttribute("data-side", "before");
      if (cols[1] && cols.length === 3) cols[1].setAttribute("data-side", "arrow");
      if (cols[cols.length - 1]) cols[cols.length - 1].setAttribute("data-side", "after");

      // Wrap the grid inside a collapsible panel
      const panel = document.createElement("div");
      panel.className = "mvab-panel";
      const inner = document.createElement("div");
      inner.className = "mvab-inner";
      grid.parentNode.insertBefore(panel, grid);
      panel.appendChild(inner);
      inner.appendChild(grid);

      // Add chevron to header
      const chevron = document.createElement("span");
      chevron.className = "material-symbols-outlined mvab-chevron";
      chevron.textContent = "expand_more";
      header.appendChild(chevron);

      // Toggle click
      header.setAttribute("role", "button");
      header.setAttribute("tabindex", "0");
      header.setAttribute("aria-expanded", "false");
      const toggle = () => {
        const open = row.classList.toggle("is-open");
        header.setAttribute("aria-expanded", open ? "true" : "false");
      };
      header.addEventListener("click", toggle);
      header.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle();
        }
      });
    });
  }

  // Flywheel: reveal nodes 01 → 05 sequentially when scrolled into view
  const flywheel = document.querySelector(".flywheel-wrap");
  if (flywheel) {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!("IntersectionObserver" in window) || prefersReduced) {
      flywheel.classList.add("is-in-view");
    } else {
      const flywheelObs = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            flywheel.classList.add("is-in-view");
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.25 });
      flywheelObs.observe(flywheel);
    }
  }

  // Tab gallery — click a tab to expand its image panel below
  document.querySelectorAll("[data-tabgallery]").forEach((gallery) => {
    const tabs = gallery.querySelectorAll("[data-tab-idx]");
    const panels = gallery.querySelectorAll("[data-tab-panel]");
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const idx = tab.dataset.tabIdx;
        const willClose = tab.getAttribute("aria-selected") === "true";
        tabs.forEach((t) => t.setAttribute("aria-selected", "false"));
        panels.forEach((p) => p.classList.remove("is-open"));
        if (!willClose) {
          tab.setAttribute("aria-selected", "true");
          gallery.querySelector(`[data-tab-panel="${idx}"]`).classList.add("is-open");
        }
      });
    });
  });

  // Count-up animation — triggers when element scrolls into view.
  // Hero metrics set `data-count-delay="800"` to sync with entrance animations.
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const runCount = (el, delayMs) => {
    const target = parseFloat(el.dataset.countTo);
    const prefix = el.dataset.countPrefix || "";
    const suffix = el.dataset.countSuffix || "";
    if (reduceMotion || !Number.isFinite(target)) {
      el.textContent = prefix + target.toLocaleString() + suffix;
      return;
    }
    const duration = 1600;
    const startTime = performance.now() + delayMs;
    const step = (now) => {
      const t = Math.max(0, Math.min(1, (now - startTime) / duration));
      const eased = 1 - Math.pow(1 - t, 3);
      const current = Math.round(target * eased);
      el.textContent = prefix + current.toLocaleString() + suffix;
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const countEls = document.querySelectorAll("[data-count-to]");
  if (countEls.length) {
    if (!("IntersectionObserver" in window)) {
      countEls.forEach((el) => runCount(el, parseInt(el.dataset.countDelay || "0", 10)));
    } else {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = parseInt(entry.target.dataset.countDelay || "0", 10);
            runCount(entry.target, delay);
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3, rootMargin: "0px 0px -10% 0px" });
      countEls.forEach((el) => observer.observe(el));
    }
  }
});
