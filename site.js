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


/* ── wireframe shape behind each opener ─────────────────────────
   A geodesic sphere drawn as glowing lines. It tilts toward the
   cursor, bulges under it, flies apart when the pointer moves fast
   and sends a shockwave from wherever you click. Each home-page
   chapter changes how it moves. Pauses when off screen.          */
(function () {
  var canvas = document.querySelector(".field");
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext("2d");
  var stage = canvas.parentNode;
  var small = stage.classList.contains("stage-sm");
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* geodesic sphere: icosahedron subdivided three times */
  var t0 = (1 + Math.sqrt(5)) / 2, V = [], F = [];
  [[-1,t0,0],[1,t0,0],[-1,-t0,0],[1,-t0,0],[0,-1,t0],[0,1,t0],[0,-1,-t0],[0,1,-t0],[t0,0,-1],[t0,0,1],[-t0,0,-1],[-t0,0,1]]
    .forEach(function (p) { var l = Math.hypot(p[0], p[1], p[2]); V.push([p[0]/l, p[1]/l, p[2]/l]); });
  F = [[0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],[1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],[3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],[4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]];
  for (var lvl = 0; lvl < (small ? 2 : 3); lvl++) {
    var cache = {}, nf = [];
    var mid = function (a, b) {
      var k = a < b ? a + "_" + b : b + "_" + a;
      if (cache[k] !== undefined) return cache[k];
      var p = [(V[a][0]+V[b][0])/2, (V[a][1]+V[b][1])/2, (V[a][2]+V[b][2])/2], l = Math.hypot(p[0], p[1], p[2]);
      V.push([p[0]/l, p[1]/l, p[2]/l]); return (cache[k] = V.length - 1);
    };
    F.forEach(function (f) { var a = mid(f[0], f[1]), b = mid(f[1], f[2]), c = mid(f[2], f[0]); nf.push([f[0],a,c],[f[1],b,a],[f[2],c,b],[a,b,c]); });
    F = nf;
  }
  var E = [], seen = {};
  F.forEach(function (f) { for (var i = 0; i < 3; i++) { var a = f[i], b = f[(i+1)%3], k = a < b ? a+"_"+b : b+"_"+a; if (!seen[k]) { seen[k] = 1; E.push(a, b); } } });
  var n = V.length;
  var hash = V.map(function (v, i) { var s = Math.sin(i * 12.9898) * 43758.5453; return s - Math.floor(s); });
  var bulge = new Float32Array(n);             // eased cursor bulge per vertex
  var P = new Float32Array(n * 3);              // projected x, y, depth

  var w = 0, h = 0, dpr = 1, cx = 0, cy = 0, R = 0;
  var line = "#F1EDF8", acc = "#B48CFF";
  var mx = -1e4, my = -1e4, lastX = 0, lastY = 0, speed = 0, burst = 0;
  var rx = 0.35, ry = 0, trx = 0.35, try_ = 0, spin = 0;
  var mode = 0, waves = [], running = false, visible = true, raf = 0, start = performance.now();

  function colours() {
    var cs = getComputedStyle(stage);
    line = cs.getPropertyValue("--field").trim() || line;
    acc = cs.getPropertyValue("--accent").trim() || acc;
  }
  colours();
  new MutationObserver(function () { colours(); if (!running) frame(performance.now()); })
    .observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  document.addEventListener("nt:chapter", function (e) { mode = e.detail; });

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var phone = w < 700;
    cx = phone ? w * 0.62 : w * (small ? 0.74 : 0.68);
    cy = phone ? h * (small ? 0.38 : 0.3) : h * (small ? 0.5 : 0.4);
    R = Math.min(w, h) * (phone ? 0.34 : small ? 0.33 : 0.31);
  }

  function shape(v, i, t) {
    var x = v[0], y = v[1], z = v[2], r;
    if (mode === 1) {                       /* sensing: heartbeat + pulses running pole to pole */
      var b = t % 1.1, beat = Math.exp(-Math.pow(b / .07, 2)) + .6 * Math.exp(-Math.pow((b - .24) / .07, 2));
      r = 1 + .07 * beat + .045 * Math.sin(9 * y - t * 5);
    } else if (mode === 2) {                /* agents: three bulges orbiting */
      r = 1;
      for (var k = 0; k < 3; k++) {
        var a = t * .7 + k * 2.094, bx = Math.cos(a) * .9, bz = Math.sin(a) * .9, by = .35 * Math.sin(t + k * 2);
        var d2 = (x - bx) * (x - bx) + (y - by) * (y - by) + (z - bz) * (z - bz);
        r += .2 * Math.exp(-d2 / .09);
      }
    } else {                                /* gaze: slow breathing */
      r = 1 + .03 * Math.sin(3 * x + t * 1.1) + .025 * Math.sin(4 * y - t * .9) + .022 * Math.sin(5 * z + t * 1.3);
    }
    for (var q = 0; q < waves.length; q++) {   /* click shockwaves */
      var wv = waves[q], age = t - wv.t, dd = Math.acos(Math.max(-1, Math.min(1, x * wv.v[0] + y * wv.v[1] + z * wv.v[2])));
      var ring = dd - age * 2.6;
      r += .16 * Math.exp(-ring * ring * 20) * Math.max(0, 1 - age / 1.6);
    }
    return r + bulge[i] + burst * (hash[i] - .3) * 1.2;
  }

  function frame(now) {
    var t = (now - start) / 1000;
    ctx.clearRect(0, 0, w, h);
    waves = waves.filter(function (wv) { return t - wv.t < 1.6; });

    speed *= .88; burst += (Math.min(speed / 45, 1) * .55 - burst) * .12;
    if (!reduce) spin += .0025;
    rx += (trx - rx) * .06; ry += (try_ - ry) * .06;
    var cY = Math.cos(ry + spin), sY = Math.sin(ry + spin), cX = Math.cos(rx), sX = Math.sin(rx);
    var D = 3.4, f = D - 1;

    for (var i = 0; i < n; i++) {
      var v = V[i], r = shape(v, i, t);
      var x = v[0] * r, y = v[1] * r, z = v[2] * r;
      var x1 = x * cY + z * sY, z1 = z * cY - x * sY;
      var y2 = y * cX - z1 * sX, z2 = y * sX + z1 * cX;
      var s = f / (D - z2);
      P[i*3] = cx + x1 * R * s; P[i*3+1] = cy - y2 * R * s; P[i*3+2] = z2;
      /* bulge toward the cursor for front-facing points */
      var dx = P[i*3] - mx, dy = P[i*3+1] - my, near = z2 > -.2 ? Math.exp(-(dx*dx + dy*dy) / (R * R * .09)) : 0;
      bulge[i] += (near * .28 - bulge[i]) * .12;
    }

    /* edges in four depth bands, back to front */
    var bands = [[-2, -.35, .07], [-.35, .1, .16], [.1, .55, .38], [.55, 2, .75]];
    ctx.lineWidth = 1;
    for (var bi = 0; bi < 4; bi++) {
      var lo = bands[bi][0], hi = bands[bi][1];
      ctx.beginPath();
      for (var e = 0; e < E.length; e += 2) {
        var a = E[e], c = E[e + 1], z = (P[a*3+2] + P[c*3+2]) / 2;
        if (z < lo || z >= hi) continue;
        ctx.moveTo(P[a*3], P[a*3+1]); ctx.lineTo(P[c*3], P[c*3+1]);
      }
      ctx.strokeStyle = bi === 3 ? line : acc;
      ctx.globalAlpha = bands[bi][2] * (1 - burst * .35);
      ctx.stroke();
    }
    /* glowing nodes on the near side; the ones under the cursor turn bright */
    ctx.shadowColor = acc;
    for (var k = 0; k < n; k++) {
      var zz = P[k*3+2];
      if (zz < .25) continue;
      var hot = bulge[k] > .08;
      ctx.globalAlpha = hot ? 1 : .35 + .5 * zz;
      ctx.fillStyle = hot ? "#ffffff" : acc;
      ctx.shadowBlur = hot ? 12 : 0;
      var sz = hot ? 3 : 1.6;
      ctx.fillRect(P[k*3] - sz / 2, P[k*3+1] - sz / 2, sz, sz);
    }
    ctx.shadowBlur = 0; ctx.globalAlpha = 1;
  }

  function loop(now) { if (!running) return; frame(now); raf = requestAnimationFrame(loop); }
  function play() { if (reduce || running || !visible || document.hidden) return; running = true; raf = requestAnimationFrame(loop); }
  function stop() { running = false; cancelAnimationFrame(raf); }

  resize(); frame(start + 2000);
  window.addEventListener("resize", function () { resize(); if (!running) frame(performance.now()); });
  if ("IntersectionObserver" in window) new IntersectionObserver(function (es) { visible = es[0].isIntersecting; visible ? play() : stop(); }).observe(canvas);
  document.addEventListener("visibilitychange", function () { document.hidden ? stop() : play(); });

  stage.addEventListener("pointermove", function (e) {
    var b = canvas.getBoundingClientRect(), x = e.clientX - b.left, y = e.clientY - b.top;
    if (mx > -1e3) speed = Math.max(speed, Math.hypot(x - lastX, y - lastY));
    lastX = x; lastY = y; mx = x; my = y;
    try_ = ((x - cx) / w) * 1.1;
    trx = .35 + ((y - cy) / h) * .8;
  });
  stage.addEventListener("pointerleave", function () { mx = my = -1e4; trx = .35; try_ = 0; });
  stage.addEventListener("pointerdown", function (e) {
    if (e.target.closest && e.target.closest("a, button")) return;
    var b = canvas.getBoundingClientRect(), x = e.clientX - b.left, y = e.clientY - b.top, best = -1, bd = 1e9;
    for (var i = 0; i < n; i++) {
      if (P[i*3+2] < 0) continue;
      var d = (P[i*3] - x) * (P[i*3] - x) + (P[i*3+1] - y) * (P[i*3+1] - y);
      if (d < bd) { bd = d; best = i; }
    }
    if (best >= 0 && bd < R * R * 1.6) waves.push({ v: V[best], t: (performance.now() - start) / 1000 });
    else speed = 60;                                  /* clicked away from it: a burst instead */
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

