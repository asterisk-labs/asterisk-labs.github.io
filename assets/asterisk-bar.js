/*
 * asterisk-bar.js — the Asterisk nav bar for pages built outside the main
 * Jekyll site (project repos served under asterisk.coop/<name>/, e.g. /taco/).
 *
 * Usage: add one line to the page, near the end of <body>:
 *   <script src="https://asterisk.coop/assets/asterisk-bar.js" defer></script>
 *
 * Matches the main site's rendered navbar: League Spartan, links at weight 400
 * in rgba(25,25,25,.5) -> indigo on hover, wordmark at weight 500. (The site's
 * markup has `fw-bold`, but that is a Bootstrap-5 class and the site runs
 * Bootstrap 4, so the real links render at 400 — not 700.) Slimmer and gentler
 * than the full header. Injected via Shadow DOM so it can't clash with the host
 * page's CSS.
 */
(function () {
  var ID = "asterisk-bar-host";
  if (document.getElementById(ID)) return; // never inject twice

  var ORIGIN = "https://asterisk.coop";
  var LINKS = [
    ["about", "/about.html"],
    ["projects", "/projects.html"],
    ["tools", "/tools.html"],
    ["contact", "/contact.html"]
  ];

  // League Spartan (the typeface the main site self-hosts) from Google Fonts —
  // a document-level stylesheet is usable in the shadow root and serves with CORS.
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
    '.abar{font-family:"League Spartan","Arial Narrow",system-ui,sans-serif;' +
      "display:flex;justify-content:center;" +
      "background:#fff;padding:6px 18px;" +
      "border-bottom:2px solid transparent;" +
      "border-image:linear-gradient(90deg,#f7cc09 0 33%,#c4ffc2 33% 66%,#492ae8 66% 100%) 1}" +
    ".inner{width:100%;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:16px}" +
    ".brand{display:flex;align-items:center;gap:9px;text-decoration:none;color:#000;" +
      "font-weight:500;font-size:1.3rem;line-height:1.2;justify-self:start}" +
    ".brand:hover{color:#492ae8}" +
    ".brand img{height:28px;width:auto;display:block}" +
    ".links{display:flex;align-items:center;gap:1rem;justify-self:center}" +
    ".links a{text-decoration:none;font-weight:400;font-size:1rem;color:rgba(25,25,25,.5);line-height:1.2;transition:color .15s}" +
    ".links a:hover{color:#492ae8}" +
    "@media(max-width:560px){.inner{grid-template-columns:1fr;justify-items:center;gap:4px}.brand{font-size:1.15rem}.brand img{height:24px}.links a{font-size:.9rem}.links{gap:.7rem}.abar{padding:5px 12px}}" +
    "</style>" +
    '<div class="abar"><div class="inner">' +
      '<a class="brand" href="' + ORIGIN + '/"><img src="' + ORIGIN + '/assets/imgs/logo-asterisk-alt.png" alt="">asterisk labs</a>' +
      '<nav class="links">' + nav + "</nav>" +
    "</div></div>";

  function mount() { document.body.insertBefore(host, document.body.firstChild); }
  if (document.body) mount();
  else document.addEventListener("DOMContentLoaded", mount);
})();
