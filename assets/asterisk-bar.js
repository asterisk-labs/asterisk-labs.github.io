/*
 * asterisk-bar.js — the Asterisk nav bar for pages built outside the main
 * Jekyll site (project repos served under asterisk.coop/<name>/, e.g. /taco/).
 *
 * Usage: add one line to the page, near the end of <body>:
 *   <script src="https://asterisk.coop/assets/asterisk-bar.js" defer data-status="hot code"></script>
 *
 * At rest the page shows only a thin three-colour strip pinned to the very top.
 * Hover it (or tap it, or tab to it) and the white nav panel slides down over
 * the page — logo far-left, nav centered, matching the main site (League
 * Spartan, weight-400 links). An optional data-status shows a label top-left.
 * Rendered in a Shadow DOM so it can't clash with the host page's CSS.
 */
(function () {
  var ID = "asterisk-bar-host";
  if (document.getElementById(ID)) return; // never inject twice

  var ORIGIN = "https://asterisk.coop";
  var GRAD = "linear-gradient(90deg,#f7cc09 0 33%,#c4ffc2 33% 66%,#492ae8 66% 100%)";
  var LINKS = [
    ["about", "/about.html"],
    ["projects", "/projects.html"],
    ["tools", "/tools.html"],
    ["contact", "/contact.html"]
  ];

  // League Spartan (the typeface the main site self-hosts) from Google Fonts.
  if (!document.getElementById("asterisk-bar-font")) {
    var pre = document.createElement("link");
    pre.rel = "preconnect"; pre.href = "https://fonts.gstatic.com"; pre.crossOrigin = "";
    document.head.appendChild(pre);
    var css = document.createElement("link");
    css.id = "asterisk-bar-font";
    css.rel = "stylesheet";
    css.href = "https://fonts.googleapis.com/css2?family=League+Spartan:wght@400;500&display=swap";
    document.head.appendChild(css);
  }

  // Optional status label (top-left), from data-status on the embedding <script>.
  var self = document.currentScript || document.querySelector('script[src*="asterisk-bar.js"]');
  var status = self && self.getAttribute("data-status");
  var statusLabel = "";
  if (status) {
    var slug = status.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    statusLabel = '<div class="status-under status-' + slug + '">' + status + "</div>";
  }

  var host = document.createElement("div");
  host.id = ID;
  host.style.cssText = "all: initial; display: block;";
  var root = host.attachShadow({ mode: "open" });

  var nav = LINKS.map(function (l) {
    return '<a href="' + ORIGIN + l[1] + '">' + l[0] + "</a>";
  }).join("");

  root.innerHTML =
    "<style>" +
    ":host{all:initial;display:block}" +
    "*{box-sizing:border-box}" +
    ".wrap{position:fixed;top:0;left:0;right:0;z-index:2147483000}" +
    ".tab{height:6px;cursor:pointer;background:" + GRAD + "}" +
    ".panel{position:absolute;top:0;left:0;right:0;background:#fff;" +
      "transform:translateY(-100%);transition:transform .28s ease;" +
      "box-shadow:0 3px 14px rgba(0,0,0,.09);" +
      "border-bottom:3px solid transparent;border-image:" + GRAD + " 1}" +
    ".wrap:hover .panel,.wrap:focus-within .panel,.wrap.open .panel{transform:translateY(0)}" +
    '.inner{width:100%;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:16px;' +
      'padding:6px 18px;font-family:"League Spartan","Arial Narrow",system-ui,sans-serif}' +
    ".brand{display:flex;align-items:center;gap:9px;text-decoration:none;color:#000;" +
      "font-weight:500;font-size:1.3rem;line-height:1.2;justify-self:start}" +
    ".brand:hover{color:#492ae8}" +
    ".brand img{height:28px;width:auto;display:block}" +
    ".links{display:flex;align-items:center;gap:1rem;justify-self:center}" +
    ".links a{text-decoration:none;font-weight:400;font-size:1rem;color:rgba(25,25,25,.5);line-height:1.2;transition:color .15s}" +
    ".links a:hover{color:#492ae8}" +
    '.status-under{position:fixed;top:13px;left:18px;z-index:2147482999;display:inline-flex;align-items:center;' +
      'font-family:"League Spartan","Arial Narrow",system-ui,sans-serif;font-size:14px;font-weight:600;' +
      "padding:4px 13px;border-radius:999px;white-space:nowrap}" +
    ".status-under::before{margin-right:6px}" +
    '.status-experimental{background:#f7cc09;color:#5a4600}.status-experimental::before{content:"🧪"}' +
    '.status-hot-code{background:#ffd7d1;color:#9e2a17}.status-hot-code::before{content:"🔥"}' +
    '.status-stable{background:#c4ffc2;color:#16511a}.status-stable::before{content:"✅"}' +
    '.status-archived{background:#ededea;color:#666}.status-archived::before{content:"📦"}' +
    "@media(max-width:560px){.inner{grid-template-columns:1fr;justify-items:center;gap:4px;padding:5px 12px}" +
      ".brand{font-size:1.15rem}.brand img{height:24px}.links a{font-size:.9rem}.links{gap:.7rem}}" +
    "</style>" +
    '<div class="wrap">' +
      '<div class="panel"><div class="inner">' +
        '<a class="brand" href="' + ORIGIN + '/"><img src="' + ORIGIN + '/assets/imgs/logo-asterisk-alt.png" alt="">asterisk labs</a>' +
        '<nav class="links">' + nav + "</nav>" +
      "</div></div>" +
      '<div class="tab" role="button" tabindex="0" aria-label="Open Asterisk menu"></div>' +
    "</div>" +
    statusLabel;

  function mount() {
    document.body.insertBefore(host, document.body.firstChild);
    var wrap = root.querySelector(".wrap");
    var tab = root.querySelector(".tab");
    var panel = root.querySelector(".panel");
    // Touch / keyboard: tap or Enter on the strip toggles the panel open.
    tab.addEventListener("click", function () { wrap.classList.toggle("open"); });
    tab.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); wrap.classList.toggle("open"); }
    });
    // Desktop: open whenever the pointer is within the top band the open bar
    // fills (not just the 6px strip). A pointer-position check, not an overlay,
    // so it never blocks clicks on the host page's own content.
    var zone = 56;
    try { zone = Math.max(48, panel.offsetHeight + 8); } catch (e) {}
    document.addEventListener("mousemove", function (e) {
      if (e.clientY <= zone) wrap.classList.add("open");
      else wrap.classList.remove("open");
    });
  }
  if (document.body) mount();
  else document.addEventListener("DOMContentLoaded", mount);
})();
