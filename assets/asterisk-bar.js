/*
 * asterisk-bar.js — the Asterisk nav bar for pages built outside the main
 * Jekyll site (project repos served under asterisk.coop/<name>/, e.g. /taco/).
 *
 * Usage: add one line to the page, near the end of <body>:
 *   <script src="https://asterisk.coop/assets/asterisk-bar.js" defer></script>
 *
 * It injects the same navbar as the main site (logo + about/projects/tools/
 * contact, League Spartan, link colour rgba(25,25,25,.5) -> indigo on hover),
 * white with the three brand colours as an underline, inside a Shadow DOM so it
 * cannot clash with the host page's CSS. Metrics mirror _includes/header.html
 * and assets/css/style.css: 40px logo, 1.75rem wordmark, 1.2rem links.
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

  // Load League Spartan (the same typeface the main site self-hosts) from Google
  // Fonts. A document-level stylesheet is usable inside the shadow root, and
  // Google Fonts serves with correct CORS from any origin.
  if (!document.getElementById("asterisk-bar-font")) {
    var pre = document.createElement("link");
    pre.rel = "preconnect"; pre.href = "https://fonts.gstatic.com"; pre.crossOrigin = "";
    document.head.appendChild(pre);
    var css = document.createElement("link");
    css.id = "asterisk-bar-font";
    css.rel = "stylesheet";
    css.href = "https://fonts.googleapis.com/css2?family=League+Spartan:wght@500;700&display=swap";
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
      "display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;" +
      "background:#fff;padding:8px 22px;" +
      "border-bottom:3px solid transparent;" +
      "border-image:linear-gradient(90deg,#f7cc09 0 33%,#c4ffc2 33% 66%,#492ae8 66% 100%) 1}" +
    ".brand{display:flex;align-items:center;gap:10px;text-decoration:none;color:#000;" +
      "font-weight:500;font-size:1.75rem;line-height:1.2}" +
    ".brand:hover{color:#492ae8}" +
    ".brand img{height:40px;width:auto;display:block}" +
    ".links{display:flex;align-items:center;gap:1rem}" +
    ".links a{text-decoration:none;font-weight:700;font-size:1.2rem;color:rgba(25,25,25,.5);line-height:1.2;transition:color .15s}" +
    ".links a:hover{color:#492ae8}" +
    "@media(max-width:560px){.brand{font-size:1.4rem}.brand img{height:32px}.links a{font-size:1rem}.links{gap:.7rem}.abar{padding:6px 14px}}" +
    "</style>" +
    '<div class="abar">' +
      '<a class="brand" href="' + ORIGIN + '/"><img src="' + ORIGIN + '/assets/imgs/logo-asterisk-alt.png" alt="">asterisk labs</a>' +
      '<nav class="links">' + nav + "</nav>" +
    "</div>";

  function mount() { document.body.insertBefore(host, document.body.firstChild); }
  if (document.body) mount();
  else document.addEventListener("DOMContentLoaded", mount);
})();
