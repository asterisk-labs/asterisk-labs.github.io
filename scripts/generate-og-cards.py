#!/usr/bin/env python3
"""Generate 1200x630 social share cards for every local detail page.

Reads _data/tools.yml and _data/projects.yml. For each entry whose `url` is a
local detail page, composites its logo (or emoji, or wordmark text) onto a white
card with the brand corner-triangles and a League Spartan footer. Writes the
cards to assets/imgs/social/cards/ and a {page-url -> card} manifest to
_data/og_cards.yml, which _includes/head-meta.html reads.

Run after adding or changing a page:  python scripts/generate-og-cards.py
Deps: Pillow, PyYAML (fontTools optional, for the brand font; falls back to
DejaVu). Cards are committed; GitHub Pages serves them as static files.
"""
from pathlib import Path
import re, tempfile
from PIL import Image, ImageDraw, ImageFont
import yaml

ROOT = Path(__file__).resolve().parent.parent
IMGS = ROOT / "assets/imgs"
CARDS = IMGS / "social/cards"
FONTS = ROOT / "assets/fonts"
EMOJI_FONT = "/usr/share/fonts/truetype/noto/NotoColorEmoji.ttf"
DEJAVU = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"

W, H = 1200, 630
BLUE, GREEN, YELLOW, GREY = (73, 42, 232), (196, 255, 194), (247, 204, 9), (107, 107, 114)
SCALE = 1.4
SIZES = [(100, 50), (50, 100), (50, 50)]          # bottom, middle, top (per corners.html)
CORNERS = {                                        # anchor x, y, dir x, dir y, [bottom, middle, top]
    "tl": (0, 0,  1,  1, [BLUE, GREEN, YELLOW]),
    "tr": (W, 0, -1,  1, [YELLOW, GREEN, BLUE]),
    "bl": (0, H,  1, -1, [BLUE, YELLOW, GREEN]),
    "br": (W, H, -1, -1, [GREEN, BLUE, YELLOW]),
}


def footer_font(size=40):
    """League Spartan (converted from the site's woff2) if possible, else DejaVu."""
    woff2 = FONTS / "league-spartan-v11-latin_latin-ext-700.woff2"
    try:
        from fontTools.ttLib import TTFont
        tmp = Path(tempfile.gettempdir()) / "LeagueSpartan-700.ttf"
        if not tmp.exists():
            f = TTFont(str(woff2)); f.flavor = None; f.save(str(tmp))
        return ImageFont.truetype(str(tmp), size)
    except Exception:
        return ImageFont.truetype(DEJAVU, size)


def base_card():
    im = Image.new("RGB", (W, H), "white")
    d = ImageDraw.Draw(im)
    for cx, cy, hx, vy, cols in CORNERS.values():
        for (w, h), col in zip(SIZES, cols):
            d.polygon([(cx, cy), (cx + hx * w * SCALE, cy), (cx, cy + vy * h * SCALE)], fill=col)
    return im


def add_footer(im, text="asterisk.coop"):
    d = ImageDraw.Draw(im)
    font = footer_font(40)
    tb = d.textbbox((0, 0), text, font=font)
    d.text(((W - (tb[2] - tb[0])) // 2, 548), text, fill=GREY, font=font)


def place(im, layer, box=(820, 330), dy=-28):
    """Centre an RGBA layer within `box`, nudged up by dy, over the card."""
    lw, lh = layer.size
    s = min(box[0] / lw, box[1] / lh)
    layer = layer.resize((max(1, int(lw * s)), max(1, int(lh * s))), Image.LANCZOS)
    im.paste(layer, ((W - layer.width) // 2, (H - layer.height) // 2 + dy), layer)


def card_from_logo(logo_path, out):
    im = base_card()
    place(im, Image.open(logo_path).convert("RGBA"))
    add_footer(im); im.save(out)


def card_from_text(text, colour, out):
    im = base_card()
    layer = Image.new("RGBA", (1000, 300), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    f = footer_font(180)
    tb = d.textbbox((0, 0), text, font=f)
    d.text((-tb[0], -tb[1]), text, fill=colour, font=f)
    place(im, layer.crop(layer.getbbox()))
    add_footer(im); im.save(out)


def card_from_emoji(emoji, out):
    im = base_card()
    try:
        f = ImageFont.truetype(EMOJI_FONT, 109)                 # NotoColorEmoji has one strike size
        layer = Image.new("RGBA", (220, 220), (0, 0, 0, 0))
        ImageDraw.Draw(layer).text((10, 10), emoji, embedded_color=True, font=f)
        place(im, layer.crop(layer.getbbox()), box=(300, 300))
    except Exception as e:
        print(f"  emoji render failed ({e}); plain card")
    add_footer(im); im.save(out)


def slugify(title):
    return re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")


def is_local(url):
    return bool(url) and not url.startswith("http") and (
        url.startswith("tools-pages/") or url.startswith("project-pages/"))


def main():
    CARDS.mkdir(parents=True, exist_ok=True)
    manifest = {}
    for data_file in ("tools.yml", "projects.yml"):
        items = yaml.safe_load((ROOT / "_data" / data_file).read_text()) or []
        for it in items:
            url = it.get("url", "")
            if not is_local(url):
                continue
            slug = slugify(it["title"])
            out = CARDS / f"{slug}.png"
            img = it.get("image")
            try:
                if img and img.lower().endswith((".png", ".jpg", ".jpeg")):
                    card_from_logo(IMGS / Path(img).name, out)
                elif img and img.lower().endswith(".svg") and "iris" in img.lower():
                    card_from_text("IRIS", (31, 59, 66), out)       # iris-wordmark.svg is just this text
                elif it.get("emoji"):
                    card_from_emoji(it["emoji"], out)
                else:
                    print(f"  {slug}: no raster logo -> default card"); continue
            except Exception as e:
                print(f"  {slug}: FAILED ({e}) -> default card"); continue
            manifest["/" + url] = f"/assets/imgs/social/cards/{slug}.png"
            print(f"  {slug}: {out.name}")

    card_from_logo(IMGS / "logo-asterisk-alt.png", CARDS / "default.png")
    print("  default.png")
    (ROOT / "_data/og_cards.yml").write_text(
        "# Generated by scripts/generate-og-cards.py — do not edit by hand.\n"
        "# Maps a page URL to its social share card; head-meta.html reads this.\n"
        + yaml.safe_dump(manifest, sort_keys=True, default_flow_style=False))
    print(f"wrote _data/og_cards.yml ({len(manifest)} pages)")


if __name__ == "__main__":
    main()
