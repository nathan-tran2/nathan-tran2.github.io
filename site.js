/* Nathan Tran — site behaviour.
   Theme switch, top bar, phone menu, loading screen between pages,
   the night sky, and the research strip's arrows. */

/* ── light / dark ─────────────────────────────────────────────── */
(function () {
  var root = document.documentElement;
  function label() {
    var light = root.getAttribute("data-theme") === "light";
    document.querySelectorAll("[data-theme-toggle]").forEach(function (b) {
      b.setAttribute("aria-label", light ? "Switch to dark mode" : "Switch to light mode");
      b.setAttribute("aria-pressed", String(light));
    });
  }
  document.querySelectorAll("[data-theme-toggle]").forEach(function (b) {
    b.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
      label();
    });
  });
  label();
})();

/* ── top bar turns solid once the night banner scrolls away ───── */
(function () {
  var top = document.querySelector(".top"), night = document.querySelector(".night");
  if (!top) return;
  function check() {
    var edge = night ? night.getBoundingClientRect().bottom : 0;
    top.classList.toggle("solid", edge < 76);
  }
  addEventListener("scroll", check, { passive: true }); addEventListener("resize", check); check();

  var btn = document.querySelector(".menu-btn"), sheet = document.querySelector(".sheet");
  if (!btn || !sheet) return;
  function set(open) {
    sheet.classList.toggle("open", open); document.body.classList.toggle("menu-open", open);
    btn.setAttribute("aria-expanded", String(open));
    btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.style.overflow = open ? "hidden" : "";
    if (open) { var f = sheet.querySelector("a"); if (f) f.focus(); }
  }
  btn.addEventListener("click", function () { set(!sheet.classList.contains("open")); });
  addEventListener("keydown", function (e) { if (e.key === "Escape" && sheet.classList.contains("open")) { set(false); btn.focus(); } });
  sheet.addEventListener("click", function (e) { if (e.target.closest("a")) set(false); });
})();

/* ── loading screen between pages ─────────────────────────────── */
(function () {
  var loader = document.querySelector(".loader");
  if (!loader) return;
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.addEventListener("click", function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest("a[href]");
    if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
    var url = new URL(a.href, location.href);
    if (url.origin !== location.origin || !/\.html$|\/$/.test(url.pathname)) return;
    if (url.pathname === location.pathname) return;               /* same page, maybe a #jump */
    e.preventDefault();
    var name = a.getAttribute("data-label") || (a.closest(".card, .pager") ? (a.querySelector("h3, b") || a).textContent : a.textContent);
    loader.querySelector(".to").textContent = name.trim().replace(/\s+/g, " ");
    loader.classList.add("on");
    setTimeout(function () { location.href = url.href; }, reduce ? 60 : 520);
  });
  /* the back button can bring the page back from cache with the screen still up */
  addEventListener("pageshow", function () { loader.classList.remove("on"); });
})();

/* ── the night sky ─────────────────────────────────────────────
   Twinkling stars, faint constellation lines, three named stars,
   the cursor drawing its own constellation, the odd shooting star. */
(function () {
  document.querySelectorAll("canvas.sky").forEach(function (canvas) {
    var ctx = canvas.getContext && canvas.getContext("2d"); if (!ctx) return;
    var host = canvas.parentNode, d = canvas.dataset;
    var labels = d.labels ? d.labels.split(",") : null;
    var cx = +d.cx || .64, cy = +d.cy || .4, rx = +d.rx || .2, ry = +d.ry || .22, dense = +d.density || 2600;
    var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    var w, h, S = [], links = [], mx = -1e4, my = -1e4, px = 0, py = 0, shoot = null, start = performance.now();
    var running = false, visible = true, raf = 0;

    function R(s) { return function () { s = (s * 16807) % 2147483647; return s / 2147483647; }; }
    function resize() {
      var dpr = Math.min(devicePixelRatio || 1, 2); w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var r = R(11), n = Math.round(Math.min(420, w * h / dense)); S = [];
      for (var i = 0; i < n; i++) { var z = Math.pow(r(), 2.2); S.push({ x: r() * w, y: r() * h, z: z, r: .35 + z * 1.9, b: .25 + z * .75, tw: r() * 6.28, sp: .6 + r() * 1.8 }); }
      links = []; var bright = S.filter(function (s) { return s.z > .45; }), L = Math.max(80, Math.min(130, w * .085));
      bright.forEach(function (a, i) {
        bright.map(function (b, j) { return { j: j, d: Math.hypot(a.x - b.x, a.y - b.y) }; })
          .filter(function (q) { return q.j > i && q.d < L; }).sort(function (p, q) { return p.d - q.d; })
          .slice(0, i % 3 ? 1 : 2).forEach(function (q) { links.push([a, bright[q.j], q.d / L]); });
      });
    }
    function hubs(t) {
      var phone = w < 700, X = phone ? .6 : cx, Y = phone ? .2 : cy, RX = phone ? .26 : rx, RY = phone ? .1 : ry;   /* on phones the named stars stay above the name */
      return [0, 1, 2].map(function (k) { var a = t * .05 + k * 2.094; return { x: w * (X + RX * Math.cos(a)), y: h * (Y + RY * Math.sin(a * 1.3 + k)) }; });
    }
    function spark(x, y, s) {
      ctx.strokeStyle = "rgba(255,255,255,.95)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x - s, y); ctx.lineTo(x + s, y); ctx.moveTo(x, y - s); ctx.lineTo(x, y + s); ctx.stroke();
      ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(x, y, 2.6, 0, 6.283); ctx.fill();
    }
    function frame(now) {
      var t = (now - start) / 1000; ctx.clearRect(0, 0, w, h);
      var tx = mx > -1e3 ? mx / w - .5 : 0, ty = my > -1e3 ? my / h - .5 : 0;
      px += (tx - px) * .04; py += (ty - py) * .04;
      function P(s) { var x = s.x - px * 24 * s.z + (reduce ? 0 : t * 2.2 * s.z); return [((x % w) + w) % w, s.y - py * 18 * s.z]; }
      ctx.lineWidth = .7;
      links.forEach(function (l) {
        var a = P(l[0]), b = P(l[1]); if (Math.abs(a[0] - b[0]) > w / 2) return;
        ctx.strokeStyle = "rgba(255,255,255," + (.16 * (1 - l[2] * .6)) + ")";
        ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
      });
      var near = [];
      if (mx > -1e3) S.forEach(function (s) { var p = P(s), dd = Math.hypot(p[0] - mx, p[1] - my); if (dd < 170 && s.z > .15) near.push([p[0], p[1], dd]); });
      near.sort(function (a, b) { return a[2] - b[2]; }); near = near.slice(0, 6);
      if (near.length) { ctx.strokeStyle = "rgba(255,255,255,.55)"; ctx.lineWidth = .9; ctx.beginPath(); ctx.moveTo(mx, my); near.forEach(function (p) { ctx.lineTo(p[0], p[1]); }); ctx.stroke(); }
      S.forEach(function (s) {
        var p = P(s), tw = reduce ? 1 : .65 + .35 * Math.sin(t * s.sp + s.tw);
        var lit = mx > -1e3 ? Math.max(0, 1 - Math.hypot(p[0] - mx, p[1] - my) / 170) : 0;
        ctx.fillStyle = "rgba(255,255,255," + Math.min(1, s.b * tw + lit * .6) + ")";
        ctx.beginPath(); ctx.arc(p[0], p[1], s.r * (1 + lit * .8), 0, 6.283); ctx.fill();
      });
      if (labels) hubs(reduce ? 3 : t).forEach(function (hb, q) {
        var ns = S.map(function (s) { var p = P(s); return [p[0], p[1], Math.hypot(p[0] - hb.x, p[1] - hb.y), s.z]; })
          .filter(function (p) { return p[3] > .25; }).sort(function (a, b) { return a[2] - b[2]; }).slice(0, 3);
        ctx.strokeStyle = "rgba(255,255,255,.32)"; ctx.lineWidth = .8;
        ns.forEach(function (p) { ctx.beginPath(); ctx.moveTo(hb.x, hb.y); ctx.lineTo(p[0], p[1]); ctx.stroke(); });
        spark(hb.x, hb.y, 9 + 2 * Math.sin(t * 1.4 + q));
        ctx.font = "500 12.5px 'Schibsted Grotesk', sans-serif"; ctx.fillStyle = "rgba(255,255,255,.82)"; ctx.fillText(labels[q], hb.x + 14, hb.y + 4);
      });
      if (!reduce) {
        if (!shoot && Math.random() < .004) shoot = { x: Math.random() * w * .8 + w * .2, y: Math.random() * h * .4, t: t };
        if (shoot) {
          var age = (t - shoot.t) / .9;
          if (age > 1) shoot = null; else {
            var hx = shoot.x - age * 260, hy = shoot.y + age * 120, g = ctx.createLinearGradient(hx, hy, hx + 90, hy - 42);
            g.addColorStop(0, "rgba(255,255,255," + (1 - age) + ")"); g.addColorStop(1, "rgba(255,255,255,0)");
            ctx.strokeStyle = g; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(hx + 90, hy - 42); ctx.stroke();
          }
        }
      }
    }
    function loop(now) { if (!running) return; frame(now); raf = requestAnimationFrame(loop); }
    function play() { if (reduce || running || !visible || document.hidden) return; running = true; raf = requestAnimationFrame(loop); }
    function stop() { running = false; cancelAnimationFrame(raf); }

    resize(); frame(start + 3000);
    addEventListener("resize", function () { resize(); if (!running) frame(performance.now()); });
    if ("IntersectionObserver" in window) new IntersectionObserver(function (es) { visible = es[0].isIntersecting; visible ? play() : stop(); }).observe(canvas);
    document.addEventListener("visibilitychange", function () { document.hidden ? stop() : play(); });
    host.addEventListener("pointermove", function (e) { if (e.pointerType === "touch") return; var b = canvas.getBoundingClientRect(); mx = e.clientX - b.left; my = e.clientY - b.top; });
    host.addEventListener("pointerleave", function () { mx = my = -1e4; });
    play();
  });
})();

/* ── research strip arrows ─────────────────────────────────────── */
(function () {
  document.querySelectorAll("[data-strip]").forEach(function (nav) {
    var strip = document.getElementById(nav.getAttribute("data-strip")); if (!strip) return;
    var prev = nav.querySelector("[data-dir='-1']"), next = nav.querySelector("[data-dir='1']");
    function step() { var c = strip.querySelector(".card"); return c ? c.getBoundingClientRect().width + 22 : 360; }
    function sync() { prev.disabled = strip.scrollLeft < 4; next.disabled = strip.scrollLeft + strip.clientWidth > strip.scrollWidth - 4; }
    [prev, next].forEach(function (b) { b.addEventListener("click", function () { strip.scrollBy({ left: step() * +b.getAttribute("data-dir"), behavior: "smooth" }); }); });
    strip.addEventListener("scroll", sync, { passive: true }); addEventListener("resize", sync); sync();
  });
})();
