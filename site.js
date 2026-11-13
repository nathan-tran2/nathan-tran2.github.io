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


/* ── neural sphere behind each opener ───────────────────────────
   A 3D globe of network nodes joined by links, inside a faint
   floating network. It tilts toward the cursor, bulges under it,
   flies apart when the pointer moves fast, and a click sends a
   shockwave across it. Pulses of light run along the links. Each
   home-page chapter changes it: gaze sweeps a point of attention
   over the surface, sensing beats like a heart, agents sends three
   bright hubs orbiting it.                                       */
(function () {
  var canvas = document.querySelector(".field");
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext("2d");
  var stage = canvas.parentNode;
  var small = stage.classList.contains("stage-sm");
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* sphere nodes on a Fibonacci spiral, linked to near neighbours */
  var NS = small ? 120 : 190, V = [], E = [], i, j;
  var GA = Math.PI * (3 - Math.sqrt(5));
  for (i = 0; i < NS; i++) {
    var y = 1 - (i + .5) / NS * 2, rr = Math.sqrt(1 - y * y), th = GA * i;
    V.push([Math.cos(th) * rr, y, Math.sin(th) * rr]);
  }
  var LINK3 = small ? .36 : .29;
  for (i = 0; i < NS; i++) for (j = i + 1; j < NS; j++) {
    var d3 = Math.hypot(V[i][0] - V[j][0], V[i][1] - V[j][1], V[i][2] - V[j][2]);
    if (d3 < LINK3) E.push(i, j);
  }
  var hash = V.map(function (v, k) { var s = Math.sin(k * 12.9898) * 43758.5453; return s - Math.floor(s); });
  var bulge = new Float32Array(NS), glow = new Float32Array(NS), P = new Float32Array(NS * 3);

  var w = 0, h = 0, dpr = 1, cx = 0, cy = 0, R = 0, amb = [];
  var line = "#E4DCF5", acc = "#B48CFF", ACC = "180,140,255", LINE = "228,220,245";
  var mx = -1e4, my = -1e4, lastX = 0, lastY = 0, speed = 0, burst = 0;
  var rx = .3, ry = 0, trx = .3, try_ = 0, spin = 0;
  var mode = 0, waves = [], pulses = [], running = false, visible = true, raf = 0, start = performance.now();

  function rgb(hex) { var n = parseInt(hex.replace("#", ""), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255].join(","); }
  function colours() {
    var cs = getComputedStyle(stage);
    line = cs.getPropertyValue("--field").trim() || line; acc = cs.getPropertyValue("--accent").trim() || acc;
    ACC = rgb(acc); LINE = rgb(line);
  }
  colours();
  new MutationObserver(function () { colours(); if (!running) frame(performance.now()); })
    .observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  document.addEventListener("nt:chapter", function (e) { mode = e.detail; });

  function seedRand(s) { return function () { s = (s * 16807) % 2147483647; return s / 2147483647; }; }
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var phone = w < 700;
    cx = phone ? w * .62 : w * (small ? .74 : .68);
    cy = phone ? h * (small ? .38 : .3) : h * (small ? .5 : .42);
    R = Math.min(w, h) * (phone ? .33 : small ? .32 : .31);
    var rnd = seedRand(5), count = Math.round(Math.min(small ? 50 : 90, w * h / 14000));
    amb = [];
    for (var k = 0; k < count; k++) amb.push({ x: rnd() * w, y: rnd() * h, vx: (rnd() - .5) * .25, vy: (rnd() - .5) * .25, r: .9 + rnd() * 1.3 });
  }

  function hubDirs(t) {
    return [0, 1, 2].map(function (k) {
      var a = t * .6 + k * 2.094, el = .45 * Math.sin(t * .8 + k * 2);
      return [Math.cos(a) * Math.cos(el), Math.sin(el), Math.sin(a) * Math.cos(el)];
    });
  }

  function radius(v, k, t, hubs) {
    var x = v[0], y = v[1], z = v[2], r = 1;
    if (mode === 1) {
      var b = t % 1.2, beat = Math.exp(-Math.pow(b / .07, 2)) + .6 * Math.exp(-Math.pow((b - .25) / .07, 2));
      r += .08 * beat + .04 * Math.sin(9 * y - t * 5);
      if (beat > .5) glow[k] = Math.max(glow[k], .5 * beat * (.5 + .5 * Math.sin(9 * y - t * 5)));
    } else if (mode === 2) {
      for (var q = 0; q < 3; q++) {
        var hb = hubs[q], d2 = (x - hb[0]) * (x - hb[0]) + (y - hb[1]) * (y - hb[1]) + (z - hb[2]) * (z - hb[2]);
        var f = Math.exp(-d2 / .08); r += .16 * f; if (f > .3) glow[k] = Math.max(glow[k], f);
      }
    } else {
      r += .03 * Math.sin(3 * x + t * 1.1) + .025 * Math.sin(4 * y - t * .9) + .02 * Math.sin(5 * z + t * 1.3);
    }
    for (var s = 0; s < waves.length; s++) {
      var wv = waves[s], age = t - wv.t, dd = Math.acos(Math.max(-1, Math.min(1, x * wv.v[0] + y * wv.v[1] + z * wv.v[2])));
      var ring = dd - age * 2.6, hit = Math.exp(-ring * ring * 20) * Math.max(0, 1 - age / 1.6);
      r += .16 * hit; if (hit > .4) glow[k] = Math.max(glow[k], hit);
    }
    return r + bulge[k] + burst * (hash[k] - .3) * 1.3;
  }

  function frame(now) {
    var t = (now - start) / 1000, k, a, b, n, d;
    ctx.clearRect(0, 0, w, h);
    waves = waves.filter(function (wv) { return t - wv.t < 1.6; });
    speed *= .88; burst += (Math.min(speed / 45, 1) * .5 - burst) * .12;
    if (!reduce) spin += .0022;
    rx += (trx - rx) * .06; ry += (try_ - ry) * .06;
    var cY = Math.cos(ry + spin), sY = Math.sin(ry + spin), cX = Math.cos(rx), sX = Math.sin(rx), D = 3.4, F = D - 1;
    var hubs = mode === 2 ? hubDirs(t) : null;

    /* gaze: a point of attention sweeping the surface (in view space) */
    var gx = -1e4, gy = -1e4;
    if (mode === 0 && !reduce) { gx = cx + R * .62 * Math.sin(t * .55); gy = cy + R * .45 * Math.sin(t * .9 + 1); }

    for (k = 0; k < NS; k++) {
      var v = V[k], r = radius(v, k, t, hubs);
      var x = v[0] * r, y = v[1] * r, z = v[2] * r;
      var x1 = x * cY + z * sY, z1 = z * cY - x * sY, y2 = y * cX - z1 * sX, z2 = y * sX + z1 * cX, s = F / (D - z2);
      P[k*3] = cx + x1 * R * s; P[k*3+1] = cy - y2 * R * s; P[k*3+2] = z2;
      var dx = P[k*3] - mx, dy = P[k*3+1] - my, near = z2 > -.2 ? Math.exp(-(dx*dx + dy*dy) / (R * R * .09)) : 0;
      bulge[k] += (near * .26 - bulge[k]) * .12;
      if (near > .4) glow[k] = Math.max(glow[k], near);
      if (z2 > 0 && gx > -1e3) { var g = Math.exp(-((P[k*3] - gx) * (P[k*3] - gx) + (P[k*3+1] - gy) * (P[k*3+1] - gy)) / (R * R * .05)); if (g > .3) glow[k] = Math.max(glow[k], g); }
      glow[k] *= .93;
    }

    /* ambient network drifting around the sphere */
    var AL = Math.max(110, Math.min(160, w * .11));
    for (k = 0; k < amb.length; k++) {
      n = amb[k];
      if (!reduce) { n.x += n.vx; n.y += n.vy; }
      if (n.x < -20) n.x = w + 20; if (n.x > w + 20) n.x = -20; if (n.y < -20) n.y = h + 20; if (n.y > h + 20) n.y = -20;
    }
    ctx.lineWidth = 1;
    for (a = 0; a < amb.length; a++) for (b = a + 1; b < amb.length; b++) {
      d = Math.hypot(amb[a].x - amb[b].x, amb[a].y - amb[b].y);
      if (d < AL) { ctx.strokeStyle = "rgba(" + ACC + "," + (1 - d / AL) * .32 + ")"; ctx.beginPath(); ctx.moveTo(amb[a].x, amb[a].y); ctx.lineTo(amb[b].x, amb[b].y); ctx.stroke(); }
    }
    /* ambient nodes reach for the sphere's near side */
    for (a = 0; a < amb.length; a++) for (k = 0; k < NS; k += 3) {
      if (P[k*3+2] < .2) continue;
      d = Math.hypot(amb[a].x - P[k*3], amb[a].y - P[k*3+1]);
      if (d < AL * .8) { ctx.strokeStyle = "rgba(" + ACC + "," + (1 - d / (AL * .8)) * .24 + ")"; ctx.beginPath(); ctx.moveTo(amb[a].x, amb[a].y); ctx.lineTo(P[k*3], P[k*3+1]); ctx.stroke(); }
    }
    ctx.fillStyle = "rgba(" + ACC + ",.85)";
    amb.forEach(function (n) { ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, 6.2832); ctx.fill(); });

    /* sphere links: back half faint, front half bright, lit ones white */
    for (var pass = 0; pass < 2; pass++) {
      for (var e = 0; e < E.length; e += 2) {
        a = E[e]; b = E[e + 1];
        var z = (P[a*3+2] + P[b*3+2]) / 2, front = z > 0;
        if ((pass === 0) === front) continue;
        var lit = Math.max(glow[a], glow[b]);
        var al = front ? .22 + .45 * (z) : .06 + .06 * (1 + z);
        ctx.strokeStyle = "rgba(" + (lit > .35 ? LINE : ACC) + "," + Math.min(1, al + lit * .5) * (1 - burst * .3) + ")";
        ctx.beginPath(); ctx.moveTo(P[a*3], P[a*3+1]); ctx.lineTo(P[b*3], P[b*3+1]); ctx.stroke();
        if (front && !reduce && Math.random() < .0015 + lit * .006) pulses.push({ a: a, b: b, t: t, d: .55 });
      }
    }

    /* the cursor joins the network */
    if (mx > -1e3) {
      var REACH = R * .9;
      for (k = 0; k < NS; k++) {
        if (P[k*3+2] < 0) continue;
        d = Math.hypot(P[k*3] - mx, P[k*3+1] - my);
        if (d < REACH) { ctx.strokeStyle = "rgba(" + LINE + "," + (1 - d / REACH) * .6 + ")"; ctx.beginPath(); ctx.moveTo(P[k*3], P[k*3+1]); ctx.lineTo(mx, my); ctx.stroke(); }
      }
      amb.forEach(function (n) { d = Math.hypot(n.x - mx, n.y - my); if (d < 180) { ctx.strokeStyle = "rgba(" + LINE + "," + (1 - d / 180) * .5 + ")"; ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(mx, my); ctx.stroke(); } });
    }

    /* nodes */
    for (k = 0; k < NS; k++) {
      var zz = P[k*3+2]; if (zz < -.15) continue;
      var hot = glow[k] > .3;
      ctx.globalAlpha = hot ? 1 : .3 + .6 * Math.max(0, zz);
      ctx.fillStyle = hot ? "#fff" : acc;
      ctx.shadowColor = acc; ctx.shadowBlur = hot ? 12 : 0;
      ctx.beginPath(); ctx.arc(P[k*3], P[k*3+1], (hot ? 3 : 2) * (.75 + .5 * Math.max(0, zz)), 0, 6.2832); ctx.fill();
    }
    ctx.globalAlpha = 1; ctx.shadowBlur = 0;

    /* agent hubs */
    if (hubs) hubs.forEach(function (hb, q) {
      var x1 = hb[0] * cY + hb[2] * sY, z1 = hb[2] * cY - hb[0] * sY, y2 = hb[1] * cX - z1 * sX, z2 = hb[1] * sX + z1 * cX;
      var r = 1.18, s = F / (D - z2 * r), sx = cx + x1 * r * R * s, sy = cy - y2 * r * R * s;
      ctx.globalAlpha = z2 > -.2 ? 1 : .35;
      ctx.fillStyle = "#fff"; ctx.shadowColor = acc; ctx.shadowBlur = 20;
      ctx.beginPath(); ctx.arc(sx, sy, 4.5, 0, 6.2832); ctx.fill(); ctx.shadowBlur = 0;
      ctx.strokeStyle = "rgba(" + ACC + ",.75)"; ctx.beginPath(); ctx.arc(sx, sy, 10 + 3 * Math.sin(t * 3 + q), 0, 6.2832); ctx.stroke();
      ctx.globalAlpha = 1;
    });

    /* gaze marker */
    if (gx > -1e3) {
      ctx.strokeStyle = "rgba(" + LINE + ",.8)"; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.arc(gx, gy, 8, 0, 6.2832); ctx.stroke();
      ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(gx, gy, 2.2, 0, 6.2832); ctx.fill();
      ctx.lineWidth = 1;
    }

    /* pulses along sphere links */
    pulses = pulses.filter(function (p) { return t - p.t < p.d; });
    ctx.fillStyle = "#fff"; ctx.shadowColor = acc; ctx.shadowBlur = 10;
    pulses.forEach(function (p) {
      var u = (t - p.t) / p.d, A = p.a * 3, B = p.b * 3;
      if (P[A+2] < 0 && P[B+2] < 0) return;
      ctx.beginPath(); ctx.arc(P[A] + (P[B] - P[A]) * u, P[A+1] + (P[B+1] - P[A+1]) * u, 1.9, 0, 6.2832); ctx.fill();
    });
    ctx.shadowBlur = 0;
  }

  function loop(now) { if (!running) return; frame(now); raf = requestAnimationFrame(loop); }
  function play() { if (reduce || running || !visible || document.hidden) return; running = true; raf = requestAnimationFrame(loop); }
  function stop() { running = false; cancelAnimationFrame(raf); }

  resize(); frame(start + 1500);
  window.addEventListener("resize", function () { resize(); if (!running) frame(performance.now()); });
  if ("IntersectionObserver" in window) new IntersectionObserver(function (es) { visible = es[0].isIntersecting; visible ? play() : stop(); }).observe(canvas);
  document.addEventListener("visibilitychange", function () { document.hidden ? stop() : play(); });

  stage.addEventListener("pointermove", function (e) {
    var bx = canvas.getBoundingClientRect(), x = e.clientX - bx.left, y = e.clientY - bx.top;
    if (mx > -1e3) speed = Math.max(speed, Math.hypot(x - lastX, y - lastY));
    lastX = x; lastY = y; mx = x; my = y;
    try_ = ((x - cx) / w) * 1.1; trx = .3 + ((y - cy) / h) * .8;
  });
  stage.addEventListener("pointerleave", function () { mx = my = -1e4; trx = .3; try_ = 0; });
  stage.addEventListener("pointerdown", function (e) {
    if (e.target.closest && e.target.closest("a, button")) return;
    var bx = canvas.getBoundingClientRect(), x = e.clientX - bx.left, y = e.clientY - bx.top, best = -1, bd = 1e9, t = (performance.now() - start) / 1000;
    for (var k = 0; k < NS; k++) {
      if (P[k*3+2] < 0) continue;
      var dd = (P[k*3] - x) * (P[k*3] - x) + (P[k*3+1] - y) * (P[k*3+1] - y);
      if (dd < bd) { bd = dd; best = k; }
    }
    if (best >= 0 && bd < R * R * 1.6) {
      waves.push({ v: V[best], t: t });
      for (var e2 = 0; e2 < E.length; e2 += 2) if (Math.random() < .25) pulses.push({ a: E[e2], b: E[e2 + 1], t: t + Math.random() * .4, d: .6 });
    } else speed = 60;
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

