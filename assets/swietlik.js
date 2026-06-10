/* =========================================================================
   ŚWIETLIK PRO 3000 — animacje landingu (GSAP pin + scrub, count-up, sticky)
   Idempotentne: guardy per-element, więc podwójne załadowanie nie szkodzi.
   ========================================================================= */
(function () {
  "use strict";

  var REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  /* --- scroll-storytelling: pin + scrub crossfade --- */
  function initStory(root) {
    if (root.dataset.swInit) return;
    root.dataset.swInit = "1";

    if (REDUCED || typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      root.classList.add("sw-static");
      return;
    }
    gsap.registerPlugin(ScrollTrigger);

    var imgs = root.querySelectorAll(".sw-slide");
    var caps = root.querySelectorAll(".sw-cap");
    var bar = root.querySelector(".sw-bar-fill");
    if (!imgs.length) return;

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: root,
        start: "top top",
        end: "+=300%",
        pin: true,
        scrub: true,
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    });

    tl.fromTo(imgs[0], { scale: 1.05 }, { scale: 1, duration: 0.9, ease: "none" }, 0);
    tl.fromTo(caps[0], { autoAlpha: 0, y: 36 }, { autoAlpha: 1, y: 0, duration: 0.35 }, 0.05);

    for (var i = 1; i < imgs.length; i++) {
      tl.to(imgs[i - 1], { autoAlpha: 0, duration: 0.5 }, i);
      tl.to(caps[i - 1], { autoAlpha: 0, y: -24, duration: 0.35 }, i);
      tl.fromTo(imgs[i], { autoAlpha: 0, scale: 1.05 }, { autoAlpha: 1, scale: 1, duration: 0.6 }, i + 0.05);
      tl.fromTo(caps[i], { autoAlpha: 0, y: 36 }, { autoAlpha: 1, y: 0, duration: 0.4 }, i + 0.45);
    }

    tl.to({}, { duration: 0.5 });
    if (bar) tl.fromTo(bar, { scaleX: 0 }, { scaleX: 1, ease: "none", duration: tl.duration() }, 0);
  }

  /* --- liczby count-up w specyfikacji --- */
  function initCounters() {
    var els = document.querySelectorAll("[data-sw-count]");
    Array.prototype.forEach.call(els, function (el) {
      if (el.dataset.swInit) return;
      el.dataset.swInit = "1";

      var target = parseInt(el.getAttribute("data-sw-count"), 10) || 0;
      var suffix = el.getAttribute("data-sw-suffix") || "";
      var render = function (n) { el.textContent = n.toLocaleString("pl-PL") + suffix; };

      if (REDUCED || !("IntersectionObserver" in window)) { render(target); return; }
      render(0);

      var io = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        var start = null, dur = 1400;
        var step = function (ts) {
          if (!start) start = ts;
          var p = Math.min(1, (ts - start) / dur);
          p = 1 - Math.pow(1 - p, 3);
          render(Math.round(target * p));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }, { threshold: 0.4 });
      io.observe(el);
    });
  }

  /* --- dolny sticky pasek zakupu --- */
  function initSticky() {
    var bar = document.querySelector(".sw-stickybar");
    if (!bar || bar.dataset.swInit) return;
    bar.dataset.swInit = "1";
    var onScroll = function () {
      bar.classList.toggle("is-visible", window.scrollY > window.innerHeight * 0.9);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* --- reveal on scroll (sekcje landingu) --- */
  function initReveals() {
    var els = document.querySelectorAll(".sw [data-reveal]:not([data-sw-rv])");
    if (!("IntersectionObserver" in window) || REDUCED) {
      Array.prototype.forEach.call(els, function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    Array.prototype.forEach.call(els, function (el) { el.setAttribute("data-sw-rv", "1"); io.observe(el); });
  }

  function initAll() {
    Array.prototype.forEach.call(document.querySelectorAll(".sw-story"), initStory);
    initCounters();
    initSticky();
    initReveals();
  }

  ready(initAll);
  document.addEventListener("shopify:section:load", initAll);
})();
