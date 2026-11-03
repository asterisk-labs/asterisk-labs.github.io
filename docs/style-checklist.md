# Website style checklist

Keep every page on-brand. The media kit at **/brand** is the source of truth;
this is the short version that all contribution pathways and the Claude skill
point to.

## Colours

- Accents and highlights use the three main brand colours only:
  `#f7cc09` (gold), `#c4ffc2` (mint), `#492ae8` (purple).
- The six-colour twinkle palette is for the title animation only — not for page
  accents.
- Full palette and usage: /brand.

## Type

- Body and headings: League Spartan (self-hosted; already loaded site-wide).
- Futura is the logotype — inside logo artwork only, never page text.

## Buttons

- Use the shared component, don't hand-roll button styles:
  `{% include button.html text="Read more" href="/x.html" variant="primary" %}`
- Variants: `primary` (black → purple), `ghost` (outline), `invert` (white → mint).

## Layout

- Detail pages use `layout: project` with an optional `theme:` hex colour for the
  heading accent bars.
- Multi-page builds (e.g. a tool's own mini-site) must keep the Asterisk nav, or a
  clear way back to the main site.
- Logos: transparent PNG or SVG; a wide "banner" logo (symbol + wordmark) works
  best on cards.

## Content

- No LLM-written prose goes live. Generated copy is placeholder until a human
  rewrites it.
- Pages may look different from one another — consistency is the colours and type,
  not the layout.
