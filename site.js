/* ── theme toggle ─────────────────────────────────────────────── */
(function () {
  var root = document.documentElement;
  var btn  = document.getElementById("theme-toggle");
  if (!btn) return;

  function current() {
    return root.getAttribute("data-theme") === "light" ? "light" : "dark";
  }

  function label() {
    btn.setAttribute("aria-label", current() === "light" ? "Switch to dark mode" : "Switch to light mode");
    btn.setAttribute("aria-pressed", current() === "light" ? "true" : "false");
  }

  btn.addEventListener("click", function () {
    var next = current() === "light" ? "dark" : "light";
    if (next === "light") root.setAttribute("data-theme", "light");
    else root.removeAttribute("data-theme");
    try { localStorage.setItem("theme", next); } catch (e) {}
    label();
  });

  label();
})();


/* ── page transition ──────────────────────────────────────────── */
/* Covers the screen with a spinning vortex while moving between
   pages. Builds its own markup, so the HTML stays clean. Skipped
   entirely for anyone who asked for reduced motion.              */
(function () {
  var HOLD = 480;   // ms the vortex is visible before navigating
  var BAIL = 6000;  // ms after which we give up and release the screen

  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var loader = document.createElement("div");
  loader.className = "nt-loader";
  loader.setAttribute("aria-hidden", "true");
  loader.innerHTML = '<div class="nt-spin">' +
                     '<span></span><span></span><span></span><span></span><span></span>' +
                     '</div>';
  document.body.appendChild(loader);

  var leaving = false;

  /* walk up to the enclosing <a>; the nav links wrap an <svg>, and
     older browsers don't put .closest() on SVG elements */
  function anchorFor(node) {
    while (node && node !== document) {
      if (node.tagName && node.tagName.toLowerCase() === "a") return node;
      node = node.parentNode;
    }
    return null;
  }

  /* only intercept ordinary jumps to another page of this site */
  function isPageLink(a) {
    if (!a) return false;
    var href = a.getAttribute("href");
    if (!href || href.charAt(0) === "#") return false;
    if (a.target && a.target !== "_self") return false;      // resume PDF opens in a new tab
    if (a.hasAttribute("download")) return false;
    if (/^(mailto:|tel:|javascript:)/i.test(href)) return false;

    var url;
    try { url = new URL(a.href, location.href); } catch (e) { return false; }
    if (url.origin !== location.origin) return false;        // leave external links alone
    if (url.pathname === location.pathname) return false;    // already here
    return /\.html?$/i.test(url.pathname) || /\/$/.test(url.pathname);
  }

  document.addEventListener("click", function (e) {
    if (e.defaultPrevented || e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;   // open-in-new-tab

    var a = anchorFor(e.target);
    if (!isPageLink(a)) return;

    e.preventDefault();
    if (leaving) return;
    leaving = true;

    var dest = a.href;
    loader.classList.add("is-on");
    setTimeout(function () { window.location.href = dest; }, HOLD);
    setTimeout(function () { loader.classList.remove("is-on"); leaving = false; }, BAIL);
  });

  /* coming back via the back button restores the page from cache with
     the overlay still up, so clear it */
  window.addEventListener("pageshow", function (e) {
    if (e.persisted) { loader.classList.remove("is-on"); leaving = false; }
  });
})();


/* ── phones: long project descriptions collapse to a few lines ── */
(function () {
  var mq = window.matchMedia && window.matchMedia("(max-width: 599px)");
  var descs = [].slice.call(document.querySelectorAll(".pub .desc"));
  if (!mq || !descs.length) return;

  descs.forEach(function (d) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "more";
    btn.textContent = "Read more";
    btn.setAttribute("aria-expanded", "false");
    btn.hidden = true;
    btn.addEventListener("click", function () {
      var open = d.classList.toggle("open");
      btn.textContent = open ? "Show less" : "Read more";
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    d.insertAdjacentElement("afterend", btn);
  });

  function apply() {
    descs.forEach(function (d) {
      var btn = d.nextElementSibling;
      if (!mq.matches) { d.classList.remove("clamp"); btn.hidden = true; return; }
      d.classList.add("clamp");
      /* only offer "Read more" when the text is actually cut off */
      btn.hidden = !(d.classList.contains("open") || d.scrollHeight > d.clientHeight + 2);
    });
  }
  apply();
  if (mq.addEventListener) mq.addEventListener("change", apply); else mq.addListener(apply);
})();


/* ── top nav: turns solid once you scroll; menu on small screens ─ */
(function () {
  var nav = document.getElementById("nav");
  if (!nav) return;
  var btn = nav.querySelector(".menu-btn");

  function onScroll() { nav.classList.toggle("solid", window.scrollY > 24); }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  function setOpen(open) {
    nav.classList.toggle("open", open);
    if (btn) btn.setAttribute("aria-expanded", open ? "true" : "false");
  }
  if (btn) btn.addEventListener("click", function () { setOpen(!nav.classList.contains("open")); });
  nav.addEventListener("click", function (e) { if (e.target.closest && e.target.closest(".nav-links a")) setOpen(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setOpen(false); });
  window.addEventListener("resize", function () { if (window.innerWidth >= 900) setOpen(false); });
})();


/* ── the moving field behind each opener ─────────────────────────
   A perspective floor of points that rolls like a slow swell. Every
   few seconds a ripple spreads out from a random spot, and the
   points lift toward the cursor. Pauses when off screen.          */
(function () {
  var canvas = document.querySelector(".field");
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext("2d");
  var stage = canvas.parentNode;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var small = stage.classList.contains("stage-sm");

  var w = 0, h = 0, dpr = 1;
  var accent = "#45CFC2", bright = "#F1F4F8";
  var mx = -9999, my = -9999, tmx = -9999, tmy = -9999;
  var ripples = [], nextRipple = 0;
  var running = false, visible = true, raf = 0, start = performance.now();

  function colours() {
    var cs = getComputedStyle(document.documentElement);
    accent = cs.getPropertyValue("--accent").trim() || accent;
    bright = cs.getPropertyValue("--ink").trim() || bright;
  }
  colours();
  new MutationObserver(function () { colours(); if (!running) frame(performance.now()); })
    .observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function frame(now) {
    var t = (now - start) / 1000;
    ctx.clearRect(0, 0, w, h);

    mx += (tmx - mx) * 0.08; my += (tmy - my) * 0.08;

    if (!reduce && t > nextRipple) {
      ripples.push({ x: (Math.random() - 0.5) * 8, z: 4 + Math.random() * 7, t: t });
      nextRipple = t + 3.2 + Math.random() * 2.4;
    }
    ripples = ripples.filter(function (r) { return t - r.t < 6; });

    var f = Math.max(h, 520) * 0.95;
    var horizon = h * (small ? 0.22 : 0.3);
    var camY = 1.25;
    var Z0 = 0.42, Z1 = 16, GAP = (w < 600 ? 22 : 30) / f;
    var R = Math.min(w, h) * 0.3;
    var hot = [];

    ctx.fillStyle = accent;
    for (var z = Z1; z >= Z0; z /= 1.04) {
      var scale = f / z;
      /* spacing doubles every octave of distance, so lines converge
         toward the horizon without the far rows turning to mush */
      var DX = GAP * Math.pow(2, Math.floor(Math.log(z) / Math.LN2));
      var half = (w * 0.5) / scale + DX;
      var depth = 1 - (z - Z0) / (Z1 - Z0);
      var baseA = Math.pow(depth, 1.6) * 0.75 + 0.06;
      var size = Math.max(0.8, 2.4 * depth + 0.5);
      var x0 = -Math.ceil(half / DX) * DX;
      for (var x = x0; x <= half; x += DX) {
        var y = 0.42 * Math.sin(x * 0.38 + t * 0.55) * Math.cos(z * 0.3 - t * 0.4)
              + 0.22 * Math.sin((x + z) * 0.24 + t * 0.35);
        var crest = 0;
        for (var i = 0; i < ripples.length; i++) {
          var rp = ripples[i], age = t - rp.t;
          var d = Math.sqrt((x - rp.x) * (x - rp.x) + (z - rp.z) * (z - rp.z));
          var ring = d - age * 2.4;
          var c = Math.exp(-ring * ring * 3) * (1 - age / 6);
          y += 0.5 * c; crest = Math.max(crest, c);
        }
        var sx = w * 0.5 + x * scale;
        var sy = horizon + (camY - y) * scale * 0.5;
        var dd = Math.sqrt((sx - mx) * (sx - mx) + (sy - my) * (sy - my));
        var lift = 0;
        if (dd < R) { lift = 1 - dd / R; lift *= lift; sy -= lift * 40 * (0.3 + depth); }
        if (sy < -4 || sy > h + 4 || sx < -4 || sx > w + 4) continue;
        var a = baseA + lift * 0.7 + crest * 0.5 + (y > 0.3 ? (y - 0.3) * 0.5 : 0);
        if (lift > 0.3 || crest > 0.45) { hot.push(sx, sy, size + 0.4, Math.min(a, 1)); continue; }
        ctx.globalAlpha = Math.min(a, 1);
        ctx.fillRect(sx, sy, size, size);
      }
    }
    ctx.fillStyle = bright;
    for (var k = 0; k < hot.length; k += 4) {
      ctx.globalAlpha = hot[k + 3];
      ctx.fillRect(hot[k], hot[k + 1], hot[k + 2], hot[k + 2]);
    }
    ctx.globalAlpha = 1;
  }

  function loop(now) {
    if (!running) return;
    frame(now);
    raf = requestAnimationFrame(loop);
  }
  function play() {
    if (reduce || running || !visible || document.hidden) return;
    running = true; raf = requestAnimationFrame(loop);
  }
  function stop() { running = false; cancelAnimationFrame(raf); }

  resize();
  frame(start + 4000);
  window.addEventListener("resize", function () { resize(); if (!running) frame(performance.now()); });

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (es) {
      visible = es[0].isIntersecting;
      visible ? play() : stop();
    }).observe(canvas);
  }
  document.addEventListener("visibilitychange", function () { document.hidden ? stop() : play(); });

  stage.addEventListener("pointermove", function (e) {
    var r = canvas.getBoundingClientRect();
    tmx = e.clientX - r.left; tmy = e.clientY - r.top;
    if (mx < -9000) { mx = tmx; my = tmy; }
  });
  stage.addEventListener("pointerleave", function () { tmx = tmy = -9999; mx = my = -9999; });

  play();
})();


/* ── sections ease in as they come into view ──────────────────── */
(function () {
  var auto = document.querySelectorAll(".page-body > .card, .page-body .pub, .page-body .role-item");
  [].forEach.call(auto, function (el) { el.classList.add("rv"); });
  var els = [].slice.call(document.querySelectorAll(".rv"));
  if (!els.length) return;
  if (!("IntersectionObserver" in window)) { els.forEach(function (el) { el.classList.add("in"); }); return; }
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.01 });
  els.forEach(function (el) { io.observe(el); });
})();


/* ── stat numbers count up once ───────────────────────────────── */
(function () {
  var nums = [].slice.call(document.querySelectorAll("[data-count]"));
  if (!nums.length || !("IntersectionObserver" in window)) return;
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      var el = e.target, to = +el.getAttribute("data-count"), from = +(el.getAttribute("data-from") || 0);
      var t0 = performance.now(), dur = 1400;
      (function step(now) {
        var p = Math.min((now - t0) / dur, 1);
        p = 1 - Math.pow(1 - p, 4);
        el.textContent = Math.round(from + (to - from) * p);
        if (p < 1) requestAnimationFrame(step);
      })(t0);
    });
  }, { threshold: 0.6 });
  nums.forEach(function (n) { io.observe(n); });
})();


/* ── featured rail: arrows and progress bar ───────────────────── */
(function () {
  var rail = document.querySelector(".rail");
  if (!rail) return;
  var bar = document.querySelector(".rail-bar i");
  var prev = document.querySelector("[data-rail='prev']");
  var next = document.querySelector("[data-rail='next']");

  function step() {
    var s = rail.querySelector(".slide");
    return s ? s.getBoundingClientRect().width + 20 : 400;
  }
  function update() {
    var max = rail.scrollWidth - rail.clientWidth;
    var vis = rail.clientWidth / rail.scrollWidth;
    var p = max > 0 ? rail.scrollLeft / max : 0;
    if (bar) { bar.style.width = (vis * 100) + "%"; bar.style.marginLeft = (p * (1 - vis) * 100) + "%"; }
    if (prev) prev.disabled = rail.scrollLeft < 4;
    if (next) next.disabled = rail.scrollLeft > max - 4;
  }
  if (prev) prev.addEventListener("click", function () { rail.scrollBy({ left: -step(), behavior: "smooth" }); });
  if (next) next.addEventListener("click", function () { rail.scrollBy({ left: step(), behavior: "smooth" }); });
  rail.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
})();


/* ── focus list: the item in the middle of the screen lights up ─ */
(function () {
  var items = [].slice.call(document.querySelectorAll(".focus-list > li"));
  if (!items.length || !("IntersectionObserver" in window)) return;
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { e.target.classList.toggle("on", e.isIntersecting); });
  }, { rootMargin: "-42% 0px -42% 0px" });
  items.forEach(function (li) { io.observe(li); });
})();
