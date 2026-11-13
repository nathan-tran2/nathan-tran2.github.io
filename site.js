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
  var HOLD = 520;   // ms the loader is visible before navigating
  var BAIL = 6000;  // ms after which we give up and release the screen

  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var loader = document.createElement("div");
  loader.className = "nt-loader";
  loader.setAttribute("aria-hidden", "true");
  loader.innerHTML = '<div class="nt-load">' +
                     '<p class="nt-to"></p>' +
                     '<p class="nt-mark">Nathan Tran<span class="dot">.</span></p>' +
                     '<span class="nt-bar"><i></i></span>' +
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
    var to = loader.querySelector(".nt-to"), num = a.closest && a.closest(".nav-links, .foot-nav") ? a.querySelector("span") : null;
    to.innerHTML = num ? '<b>' + num.textContent + '</b>' + a.textContent.replace(num.textContent, "").trim() : "Loading";
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


/* ── neural network with agents behind each opener ──────────────
   Drifting nodes joined by thin links. Three bright agent hubs
   move through it, linking to the nodes around them and sending
   pulses along the way. Nodes near the cursor reach for it, and a
   click sends a ring through the network. Colours come from the
   theme, so it works in light and dark mode.                     */
(function () {
  var canvas = document.querySelector(".field");
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext("2d");
  var stage = canvas.parentNode;
  var small = stage.classList.contains("stage-sm");
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var w = 0, h = 0, dpr = 1, nodes = [], pulses = [], rings = [];
  var acc = "#E5484D", hot = "#FFFFFF", ACC = "229,72,77", LINE = "233,229,221", dark = true;
  var mx = -1e4, my = -1e4, running = false, visible = true, raf = 0, start = performance.now();
  var LINK = 150, REACH = 210;

  function rgb(hex) { var n = parseInt(hex.replace("#", ""), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255].join(","); }
  function colours() {
    var cs = getComputedStyle(stage);
    acc = cs.getPropertyValue("--accent").trim() || acc;
    hot = cs.getPropertyValue("--hot").trim() || hot;
    ACC = rgb(acc); LINE = rgb(cs.getPropertyValue("--field").trim() || "#E9E5DD");
    dark = document.documentElement.getAttribute("data-theme") !== "light";
  }
  colours();

  function seedRand(s) { return function () { s = (s * 16807) % 2147483647; return s / 2147483647; }; }
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    LINK = Math.max(110, Math.min(165, w * .11)); REACH = LINK * 1.4;
    var rnd = seedRand(7), count = Math.round(Math.min(small ? 50 : 95, w * h / (small ? 15000 : 11000)));
    nodes = [];
    for (var i = 0; i < count; i++) {
      var x = w * (w < 700 ? rnd() : .25 + .75 * Math.pow(rnd(), .8));    /* weighted away from the text */
      nodes.push({ x: x, y: rnd() * h, vx: (rnd() - .5) * .3, vy: (rnd() - .5) * .3, r: 1.1 + rnd() * 1.7, glow: 0 });
    }
  }
  function hubs(t) {
    var phone = w < 700;
    return [0, 1, 2].map(function (k) {
      var a = t * .14 + k * 2.094;
      return { x: w * ((phone ? .55 : .66) + (phone ? .3 : .2) * Math.cos(a)), y: h * ((phone ? .32 : .45) + (phone ? .2 : .28) * Math.sin(a * 1.3 + k)) };
    });
  }

  function frame(now) {
    var t = (now - start) / 1000, i, j, n, d;
    ctx.clearRect(0, 0, w, h);
    var H3 = hubs(reduce ? 4 : t), sOn = dark ? 0 : 1;

    for (i = 0; i < nodes.length; i++) {
      n = nodes[i];
      if (!reduce) { n.x += n.vx; n.y += n.vy; }
      if (n.x < -20) n.x = w + 20; if (n.x > w + 20) n.x = -20;
      if (n.y < -20) n.y = h + 20; if (n.y > h + 20) n.y = -20;
      if (mx > -1e3) { var dx = mx - n.x, dy = my - n.y; d = Math.hypot(dx, dy); if (d < REACH) { n.x += dx * .006; n.y += dy * .006; } }
      for (j = 0; j < rings.length; j++) {
        var rg = rings[j], age = t - rg.t, ex = n.x - rg.x, ey = n.y - rg.y, rd = Math.hypot(ex, ey) || 1;
        if (Math.abs(rd - age * 420) < 28) { n.glow = 1; n.x += ex / rd * 3; n.y += ey / rd * 3; }
      }
      n.glow *= .94;
    }

    /* links */
    ctx.lineWidth = 1;
    for (i = 0; i < nodes.length; i++) for (j = i + 1; j < nodes.length; j++) {
      var a = nodes[i], b = nodes[j]; d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d >= LINK) continue;
      var k = 1 - d / LINK, lit = Math.max(a.glow, b.glow);
      ctx.strokeStyle = "rgba(" + (lit > .3 ? LINE : ACC) + "," + (k * ((dark ? .2 : .22) + .35 * lit)) + ")";
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      if (!reduce && Math.random() < .0003 + lit * .002) pulses.push({ a: a, b: b, t: t, d: .9 + d / 300 });
    }

    /* agent hubs reach the nodes around them */
    H3.forEach(function (hb, q) {
      for (i = 0; i < nodes.length; i++) {
        n = nodes[i]; d = Math.hypot(n.x - hb.x, n.y - hb.y);
        if (d < LINK * 1.25) {
          n.glow = Math.max(n.glow, .6 * (1 - d / (LINK * 1.25)));
          ctx.strokeStyle = "rgba(" + ACC + "," + (1 - d / (LINK * 1.25)) * .45 + ")";
          ctx.beginPath(); ctx.moveTo(hb.x, hb.y); ctx.lineTo(n.x, n.y); ctx.stroke();
          if (!reduce && Math.random() < .0015) pulses.push({ a: hb, b: n, t: t, d: .8 });
        }
      }
    });

    /* the cursor joins in */
    if (mx > -1e3) for (i = 0; i < nodes.length; i++) {
      n = nodes[i]; d = Math.hypot(n.x - mx, n.y - my);
      if (d < REACH) { n.glow = Math.max(n.glow, .7 * (1 - d / REACH)); ctx.strokeStyle = "rgba(" + LINE + "," + (1 - d / REACH) * .7 + ")"; ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(mx, my); ctx.stroke(); }
    }

    /* nodes */
    ctx.shadowColor = acc;
    for (i = 0; i < nodes.length; i++) {
      n = nodes[i];
      var on = n.glow > .25;
      ctx.fillStyle = on ? hot : "rgba(" + ACC + "," + (dark ? .9 : .75) + ")";
      ctx.shadowBlur = 0;
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r * (1 + .7 * n.glow), 0, 6.2832); ctx.fill();
    }

    /* hubs on top */
    H3.forEach(function (hb, q) {
      ctx.fillStyle = hot; ctx.shadowBlur = 0;
      ctx.beginPath(); ctx.arc(hb.x, hb.y, 5, 0, 6.2832); ctx.fill();
      ctx.shadowBlur = 0; ctx.strokeStyle = "rgba(" + ACC + ",.75)"; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.arc(hb.x, hb.y, 11 + 3 * Math.sin(t * 3 + q), 0, 6.2832); ctx.stroke();
      ctx.lineWidth = 1;
    });

    /* pulses */
    pulses = pulses.filter(function (p) { return t - p.t < p.d; });
    ctx.fillStyle = hot; ctx.shadowBlur = 0;
    pulses.forEach(function (p) {
      var u = (t - p.t) / p.d;
      ctx.beginPath(); ctx.arc(p.a.x + (p.b.x - p.a.x) * u, p.a.y + (p.b.y - p.a.y) * u, 2.2, 0, 6.2832); ctx.fill();
    });
    ctx.shadowBlur = 0;

    /* click rings */
    rings = rings.filter(function (r) { return t - r.t < 1.7; });
    rings.forEach(function (r) {
      var age = t - r.t;
      ctx.strokeStyle = "rgba(" + ACC + "," + (1 - age / 1.7) * .7 + ")"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(r.x, r.y, age * 420, 0, 6.2832); ctx.stroke();
    });
    ctx.lineWidth = 1;
  }

  function loop(now) { if (!running) return; frame(now); raf = requestAnimationFrame(loop); }
  function play() { if (reduce || running || !visible || document.hidden) return; running = true; raf = requestAnimationFrame(loop); }
  function stop() { running = false; cancelAnimationFrame(raf); }

  resize(); frame(start + 1000);
  window.addEventListener("resize", function () { resize(); if (!running) frame(performance.now()); });
  new MutationObserver(function () { colours(); if (!running) frame(performance.now()); })
    .observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  if ("IntersectionObserver" in window) new IntersectionObserver(function (es) { visible = es[0].isIntersecting; visible ? play() : stop(); }).observe(canvas);
  document.addEventListener("visibilitychange", function () { document.hidden ? stop() : play(); });

  stage.addEventListener("pointermove", function (e) { var bx = canvas.getBoundingClientRect(); mx = e.clientX - bx.left; my = e.clientY - bx.top; });
  stage.addEventListener("pointerleave", function () { mx = my = -1e4; });
  stage.addEventListener("pointerdown", function (e) {
    if (e.target.closest && e.target.closest("a, button")) return;
    var bx = canvas.getBoundingClientRect(), x = e.clientX - bx.left, y = e.clientY - bx.top, t = (performance.now() - start) / 1000;
    rings.push({ x: x, y: y, t: t });
    nodes.forEach(function (n) {
      if (Math.hypot(n.x - x, n.y - y) < 240) nodes.forEach(function (m) {
        if (m !== n && Math.hypot(m.x - n.x, m.y - n.y) < LINK && Math.random() < .3) pulses.push({ a: n, b: m, t: t, d: .8 });
      });
    });
  });

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



/* ── opener chapters: rotate through research themes ────────────
   Each chapter changes the caption and how the field moves. The
   bar along the bottom fills while a chapter plays.              */
(function () {
  var list = document.querySelector(".chapters");
  if (!list) return;
  var btns = [].slice.call(list.querySelectorAll("button"));
  var sub = document.getElementById("ch-sub");
  var bar = document.querySelector(".ch-track i");
  var play = document.querySelector(".ch-play");
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var DUR = 7000, cur = 0, t0 = performance.now(), paused = reduce, held = 0, raf = 0;

  function show(i) {
    cur = (i + btns.length) % btns.length;
    btns.forEach(function (b, k) {
      b.classList.toggle("on", k === cur);
      if (k === cur) b.setAttribute("aria-current", "true"); else b.removeAttribute("aria-current");
    });
    if (sub) {
      sub.classList.add("swap");
      setTimeout(function () { sub.innerHTML = btns[cur].getAttribute("data-sub"); sub.classList.remove("swap"); }, 300);
    }
    document.dispatchEvent(new CustomEvent("nt:chapter", { detail: cur }));
    t0 = performance.now(); held = 0;
  }
  function setPaused(p) {
    paused = p;
    if (play) {
      play.classList.toggle("paused", p);
      play.setAttribute("aria-label", p ? "Play theme rotation" : "Pause theme rotation");
    }
    if (p) held = performance.now() - t0; else t0 = performance.now() - held;
  }
  function tick(now) {
    if (!paused) {
      var p = (now - t0) / DUR;
      if (p >= 1) { show(cur + 1); p = 0; }
      if (bar) bar.style.width = (p * 100) + "%";
    }
    raf = requestAnimationFrame(tick);
  }

  btns.forEach(function (b, k) { b.addEventListener("click", function () { show(k); }); });
  if (play) play.addEventListener("click", function () { setPaused(!paused); });
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) { if (!paused) { setPaused(true); list._auto = true; } }
    else if (list._auto) { list._auto = false; setPaused(false); }
  });
  setPaused(paused);
  if (bar && reduce) bar.style.width = "0%";
  raf = requestAnimationFrame(tick);
})();


/* ── floating "get in touch" once past the opener ─────────────── */
(function () {
  var cta = document.querySelector(".float-cta");
  if (!cta) return;
  var foot = document.querySelector(".site-foot");
  var footIn = false;
  if (foot && "IntersectionObserver" in window) {
    new IntersectionObserver(function (es) { footIn = es[0].isIntersecting; update(); }).observe(foot);
  }
  function update() {
    var past = window.scrollY > window.innerHeight * 0.6;
    cta.classList.toggle("on", past && !footIn);
  }
  window.addEventListener("scroll", update, { passive: true });
  update();
})();

