/*
 * asterisk-bar.js — a thin Asterisk nav bar for pages built outside the main
 * Jekyll site (project repos served under asterisk.coop/<name>/, e.g. /taco/).
 *
 * Usage: add one line to the page, near the end of <body>:
 *   <script src="https://asterisk.coop/assets/asterisk-bar.js" defer></script>
 *
 * It injects a slim top bar (logo + about/projects/tools/contact) matching the
 * main site's navbar — League Spartan, white with the three brand colours as an
 * underline — inside a Shadow DOM, so it cannot clash with the host page's CSS.
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

  // Register League Spartan at the document level. An @font-face inside a shadow
  // root is ignored by browsers, but a document-level face is usable in the shadow.
  if (!document.getElementById("asterisk-bar-font")) {
    var font = document.createElement("style");
    font.id = "asterisk-bar-font";
    font.textContent =
      "@font-face{font-family:'League Spartan';font-style:normal;font-weight:500;font-display:swap;" +
      "src:url('" + ORIGIN + "/assets/fonts/league-spartan-v11-latin_latin-ext-500.woff2') format('woff2')}" +
      "@font-face{font-family:'League Spartan';font-style:normal;font-weight:700;font-display:swap;" +
      "src:url('" + ORIGIN + "/assets/fonts/league-spartan-v11-latin_latin-ext-700.woff2') format('woff2')}";
    document.head.appendChild(font);
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
      "display:flex;align-items:center;justify-content:space-between;gap:16px;" +
      "background:#fff;height:46px;padding:0 20px;" +
      "border-bottom:3px solid transparent;" +
      "border-image:linear-gradient(90deg,#f7cc09 0 33%,#c4ffc2 33% 66%,#492ae8 66% 100%) 1}" +
    ".brand{display:flex;align-items:center;gap:10px;text-decoration:none;color:#000;" +
      "font-weight:500;font-size:1.4rem;line-height:1}" +
    ".brand:hover{color:#492ae8}" +
    ".brand img{height:30px;width:auto;display:block}" +
    ".links{display:flex;gap:1rem}" +
    ".links a{text-decoration:none;font-weight:700;font-size:1.05rem;color:rgba(25,25,25,.5);transition:color .15s}" +
    ".links a:hover{color:#492ae8}" +
    "@media(max-width:460px){.abar{padding:0 12px}.links{gap:.7rem}.links a{font-size:.95rem}.brand{font-size:1.2rem}}" +
    "</style>" +
    '<div class="abar">' +
      '<a class="brand" href="' + ORIGIN + '/"><img src="' + ORIGIN + '/assets/imgs/logo-asterisk-alt.png" alt="">asterisk labs</a>' +
      '<nav class="links">' + nav + "</nav>" +
    "</div>";

  function mount() { document.body.insertBefore(host, document.body.firstChild); }
  if (document.body) mount();
  else document.addEventListener("DOMContentLoaded", mount);
})();
