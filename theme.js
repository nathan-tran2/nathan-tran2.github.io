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