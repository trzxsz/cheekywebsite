/* =========================================================================
   NOCTRA theme — interactions (vanilla JS, no dependencies)
   Globals expected on window.NOCTRA (set in theme.liquid):
     { moneyFormat, cartType, freeShipping, routes:{cart,cartAdd,cartChange} }
   ========================================================================= */
(function () {
  "use strict";
  var N = window.NOCTRA || {};
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- money ---------- */
  function formatMoney(cents) {
    var value = (cents / 100).toFixed(2);
    var fmt = N.moneyFormat || "{{amount}}";
    function withSep(v, dec, thou) {
      var parts = (Math.round(parseFloat(value) * 100) / 100).toFixed(2).split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thou || ",");
      return dec === false ? parts[0] : parts.join(dec || ".");
    }
    return fmt.replace(/\{\{\s*(\w+)\s*\}\}/g, function (_, name) {
      switch (name) {
        case "amount": return withSep(value, ".", ",");
        case "amount_no_decimals": return withSep(value, false, ",");
        case "amount_with_comma_separator": return withSep(value, ",", ".");
        case "amount_no_decimals_with_comma_separator": return withSep(value, false, ".");
        case "amount_with_space_separator": return withSep(value, ",", " ");
        case "amount_no_decimals_with_space_separator": return withSep(value, false, " ");
        default: return withSep(value, ".", ",");
      }
    });
  }

  /* ---------- header scroll ---------- */
  var header = $(".header");
  if (header) {
    var onScroll = function () { header.classList.toggle("is-scrolled", window.scrollY > 12); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- generic toggles (data-toggle="targetId") ---------- */
  function openEl(el) { if (el) el.classList.add("is-open"); }
  function closeEl(el) { if (el) el.classList.remove("is-open"); }
  var backdrop = $("[data-backdrop]");

  $$("[data-open]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var t = document.getElementById(btn.getAttribute("data-open"));
      openEl(t); openEl(backdrop);
      document.body.style.overflow = "hidden";
      if (btn.getAttribute("data-open") === "search-overlay") {
        var inp = $("input", t); if (inp) setTimeout(function () { inp.focus(); }, 60);
      }
    });
  });
  function closeAll() {
    $$(".is-open[data-closeable], .drawer-menu.is-open, .cart-drawer.is-open, .search-overlay.is-open").forEach(closeEl);
    closeEl(backdrop);
    document.body.style.overflow = "";
  }
  $$("[data-close]").forEach(function (b) { b.addEventListener("click", closeAll); });
  if (backdrop) backdrop.addEventListener("click", closeAll);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeAll(); });

  /* ---------- accordions (faq + specs) ---------- */
  $$("[data-accordion] .faq__q, .faq__q").forEach(function (q) {
    q.addEventListener("click", function () {
      var item = q.closest(".faq__item");
      if (!item) return;
      var ans = $(".faq__a", item);
      var open = item.classList.toggle("is-open");
      if (ans) ans.style.maxHeight = open ? ans.scrollHeight + "px" : "0px";
    });
  });

  /* ---------- reveal on scroll ---------- */
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    $$("[data-reveal]").forEach(function (el) { io.observe(el); });
  } else {
    $$("[data-reveal]").forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- magnetic buttons ---------- */
  if (matchMedia("(pointer:fine)").matches) {
    $$(".magnetic").forEach(function (el) {
      var strength = 0.3;
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) * strength;
        var y = (e.clientY - r.top - r.height / 2) * strength;
        el.style.transform = "translate(" + x + "px," + y + "px)";
      });
      el.addEventListener("mouseleave", function () { el.style.transform = ""; });
    });
  }

  /* ---------- quantity steppers ---------- */
  $$(".qty").forEach(function (q) {
    var input = $("input", q) || $("span", q);
    q.addEventListener("click", function (e) {
      var dir = e.target.closest("[data-qty]");
      if (!dir) return;
      var step = dir.getAttribute("data-qty") === "inc" ? 1 : -1;
      if (input.tagName === "INPUT") {
        var v = Math.max(1, (parseInt(input.value, 10) || 1) + step);
        input.value = v; input.dispatchEvent(new Event("change", { bubbles: true }));
      }
    });
  });

  /* ====================================================================
     CART (AJAX)
     ==================================================================== */
  var routes = N.routes || { cart: "/cart", cartAdd: "/cart/add.js", cartChange: "/cart/change.js" };
  var cartDrawer = $("#cart-drawer");

  function setLoading(el, on) { if (el) el.classList.toggle("is-loading", !!on); }

  function getCart() { return fetch(routes.cart + ".js", { headers: { Accept: "application/json" } }).then(function (r) { return r.json(); }); }

  function updateCount(count) {
    $$("[data-cart-count]").forEach(function (n) {
      n.textContent = count;
      n.classList.toggle("hidden", count === 0);
    });
  }

  function renderDrawer(cart) {
    if (!cartDrawer) return;
    updateCount(cart.item_count);
    var body = $("[data-cart-body]", cartDrawer);
    var foot = $("[data-cart-foot]", cartDrawer);
    if (!body) return;

    if (cart.item_count === 0) {
      body.innerHTML = '<div class="cart-empty"><p>Twój koszyk jest pusty.</p><a class="btn btn--primary mt-3" href="/collections/all">Przeglądaj produkty</a></div>';
      if (foot) foot.innerHTML = "";
      renderShipBar(0);
      return;
    }

    body.innerHTML = cart.items.map(function (it) {
      var img = it.image
        ? '<img src="' + it.image.replace(/(\.[^.]+)(\?|$)/, "_120x$1$2") + '" alt="' + escapeHtml(it.product_title) + '" loading="lazy">'
        : '<div class="media-ph"></div>';
      var opts = it.options_with_values && it.options_with_values.length
        ? it.options_with_values.map(function (o) { return escapeHtml(o.value); }).join(" · ")
        : "";
      return '' +
        '<div class="cart-line" data-key="' + it.key + '">' +
          '<a class="cart-line__media" href="' + it.url + '">' + img + '</a>' +
          '<div>' +
            '<a class="cart-line__title" href="' + it.url + '">' + escapeHtml(it.product_title) + '</a>' +
            (opts ? '<div class="cart-line__opt">' + opts + '</div>' : "") +
            '<div class="qty mt-1" data-key="' + it.key + '">' +
              '<button data-qty="dec" aria-label="Mniej">−</button>' +
              '<span>' + it.quantity + '</span>' +
              '<button data-qty="inc" aria-label="Więcej">+</button>' +
            '</div>' +
          '</div>' +
          '<div style="text-align:right">' +
            '<div class="mono">' + formatMoney(it.final_line_price) + '</div>' +
            '<button class="cart-line__remove muted mono" data-remove="' + it.key + '" style="font-size:.72rem;margin-top:.4rem">Usuń</button>' +
          '</div>' +
        '</div>';
    }).join("");

    if (foot) {
      foot.innerHTML = '' +
        '<div class="cart-drawer__sub"><span>Suma</span><strong>' + formatMoney(cart.total_price) + '</strong></div>' +
        '<a href="' + routes.cart + '" class="btn btn--ghost btn--block mt-1">Zobacz koszyk</a>' +
        '<a href="/checkout" class="btn btn--primary btn--block magnetic mt-1">Do kasy</a>';
    }
    renderShipBar(cart.total_price);
    bindLineEvents();
  }

  function renderShipBar(totalCents) {
    var bar = $("[data-ship-bar]", cartDrawer || document);
    if (!bar) return;
    var threshold = (N.freeShipping || 0) * 100;
    if (!threshold) { bar.classList.add("hidden"); return; }
    bar.classList.remove("hidden");
    var pct = Math.min(100, Math.round((totalCents / threshold) * 100));
    var fill = $("[data-ship-fill]", bar);
    var label = $("[data-ship-label]", bar);
    if (fill) fill.style.width = pct + "%";
    if (label) {
      if (totalCents >= threshold) label.innerHTML = "🎉 Masz <strong>darmową wysyłkę</strong>!";
      else label.innerHTML = "Do darmowej wysyłki brakuje <strong>" + formatMoney(threshold - totalCents) + "</strong>";
    }
  }

  function bindLineEvents() {
    $$("[data-remove]", cartDrawer).forEach(function (b) {
      b.addEventListener("click", function () { changeLine(b.getAttribute("data-remove"), 0); });
    });
    $$(".cart-line .qty", cartDrawer).forEach(function (q) {
      q.addEventListener("click", function (e) {
        var dir = e.target.closest("[data-qty]"); if (!dir) return;
        var key = q.getAttribute("data-key");
        var cur = parseInt($("span", q).textContent, 10) || 1;
        changeLine(key, dir.getAttribute("data-qty") === "inc" ? cur + 1 : cur - 1);
      });
    });
  }

  function changeLine(key, quantity) {
    setLoading(cartDrawer, true);
    fetch(routes.cartChange, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ id: key, quantity: quantity })
    }).then(function (r) { return r.json(); })
      .then(function (cart) { renderDrawer(cart); })
      .finally(function () { setLoading(cartDrawer, false); });
  }

  function openCart() {
    if (N.cartType === "page") { window.location.href = routes.cart; return; }
    openEl(cartDrawer); openEl(backdrop); document.body.style.overflow = "hidden";
    getCart().then(renderDrawer);
  }
  $$("[data-cart-open]").forEach(function (b) {
    b.addEventListener("click", function (e) { e.preventDefault(); openCart(); });
  });

  /* add-to-cart forms */
  $$("form[action*='/cart/add'], form[data-add-form]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var btn = form.querySelector("[type=submit]");
      var original = btn ? btn.innerHTML : "";
      if (btn) { btn.disabled = true; btn.innerHTML = "Dodawanie…"; }
      fetch(routes.cartAdd, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form)
      }).then(function (r) { return r.json(); })
        .then(function (res) {
          if (res.status) { // error
            if (btn) btn.innerHTML = res.description || "Błąd";
            return;
          }
          if (btn) { btn.innerHTML = "✓ Dodano"; }
          return getCart().then(function (cart) {
            renderDrawer(cart);
            if (N.cartType !== "page") openCart();
          });
        })
        .finally(function () {
          setTimeout(function () { if (btn) { btn.disabled = false; btn.innerHTML = original; } }, 1100);
        });
    });
  });

  /* init count on load */
  getCart().then(function (cart) { updateCount(cart.item_count); }).catch(function () {});

  /* ---------- wishlist (localStorage, lightweight) ---------- */
  var WISH_KEY = "noctra_wishlist";
  function wish() { try { return JSON.parse(localStorage.getItem(WISH_KEY) || "[]"); } catch (e) { return []; } }
  function setWish(a) { localStorage.setItem(WISH_KEY, JSON.stringify(a)); }
  function paintWish() {
    var w = wish();
    $$("[data-wish]").forEach(function (b) { b.classList.toggle("is-active", w.indexOf(b.getAttribute("data-wish")) > -1); });
  }
  $$("[data-wish]").forEach(function (b) {
    b.addEventListener("click", function (e) {
      e.preventDefault();
      var id = b.getAttribute("data-wish"); var w = wish(); var i = w.indexOf(id);
      if (i > -1) w.splice(i, 1); else w.push(id);
      setWish(w); paintWish();
    });
  });
  paintWish();

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
})();
