"""Export each team member's profile hexagon as a standalone PNG.

Reproduces the hexagon shown on team.html — the member's brand colour behind
their transparent cut-out portrait, cropped to the CSS `clip-path` hexagon — and
writes each one as a PNG with a transparent background outside the hexagon, ready
to paste into a slide deck.

Usage:
    python scripts/export_member_hexes.py [--size 1024] [--out hex-exports.zip]

`--out` ending in `.zip` writes a single zip (the default); any other value is
treated as a directory of loose PNGs.
"""

from __future__ import annotations

import argparse
import io
import re
import zipfile
from pathlib import Path

import yaml
from PIL import Image, ImageDraw

# Repo root = parent of this script's directory.
REPO_ROOT = Path(__file__).resolve().parent.parent
MEMBERS_YML = REPO_ROOT / "_data" / "members.yml"

# The hexagon vertices from style.css `.hexagon` clip-path, as fractions of the box:
#   polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)
HEX_POLYGON = [
    (0.50, 0.00),
    (0.93, 0.25),
    (0.93, 0.75),
    (0.50, 1.00),
    (0.07, 0.75),
    (0.07, 0.25),
]

# Supersampling factor for a smooth (anti-aliased) hexagon edge.
SUPERSAMPLE = 4


def hex_to_rgb(value: str) -> tuple[int, int, int]:
    """Parse a #RGB / #RRGGBB / #RRGGBBAA colour string to an (R, G, B) tuple."""
    h = value.lstrip("#")
    if len(h) == 3:
        h = "".join(c * 2 for c in h)
    return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16))


def slugify(name: str) -> str:
    """Turn a display name into a lowercase, hyphenated filename stem."""
    slug = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
    return slug or "member"


def cover_resize(img: Image.Image, size: int) -> Image.Image:
    """Scale and centre-crop `img` to fill a `size`x`size` square (CSS object-fit: cover)."""
    w, h = img.size
    scale = max(size / w, size / h)
    new = (max(1, round(w * scale)), max(1, round(h * scale)))
    resized = img.resize(new, Image.LANCZOS)
    left = (resized.width - size) // 2
    top = (resized.height - size) // 2
    return resized.crop((left, top, left + size, top + size))


def hexagon_mask(size: int) -> Image.Image:
    """Return an `size`x`size` L-mode mask that is opaque inside the hexagon, transparent outside."""
    big = size * SUPERSAMPLE
    mask = Image.new("L", (big, big), 0)
    points = [(x * big, y * big) for x, y in HEX_POLYGON]
    ImageDraw.Draw(mask).polygon(points, fill=255)
    return mask.resize((size, size), Image.LANCZOS)


def build_hex(color: str, image_path: Path, size: int) -> Image.Image:
    """Composite one member hexagon: brand colour behind their portrait, clipped to the hexagon."""
    base = Image.new("RGBA", (size, size), hex_to_rgb(color) + (255,))
    portrait = Image.open(image_path).convert("RGBA")
    base.alpha_composite(cover_resize(portrait, size))
    base.putalpha(hexagon_mask(size))  # clip to hexagon; outside becomes transparent
    return base


def render_all(size: int) -> list[tuple[str, Image.Image]]:
    """Build every member's hexagon; return a list of (filename, image) pairs."""
    hexes: list[tuple[str, Image.Image]] = []
    for member in yaml.safe_load(MEMBERS_YML.read_text()):
        image_path = REPO_ROOT / member["image"].lstrip("/")
        if not image_path.exists():
            print(f"  SKIP {member['name']}: missing image {image_path}")
            continue
        hexes.append((f"{slugify(member['name'])}.png", build_hex(member["color"], image_path, size)))
        print(f"  rendered {member['name']}  ({member['color']})")
    return hexes


def write_zip(hexes: list[tuple[str, Image.Image]], zip_path: Path) -> None:
    """Write the rendered hexagons into a single zip archive."""
    zip_path.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
        for name, image in hexes:
            buffer = io.BytesIO()
            image.save(buffer, format="PNG")
            zf.writestr(name, buffer.getvalue())


def write_dir(hexes: list[tuple[str, Image.Image]], out_dir: Path) -> None:
    """Write the rendered hexagons as loose PNG files in a directory."""
    out_dir.mkdir(parents=True, exist_ok=True)
    for name, image in hexes:
        image.save(out_dir / name)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--size", type=int, default=1024, help="output PNG size in px (default 1024)")
    parser.add_argument(
        "--out",
        default="hex-exports.zip",
        help="output path; a .zip writes an archive (default), anything else a directory",
    )
    args = parser.parse_args()

    out_path = (REPO_ROOT / args.out).resolve()
    hexes = render_all(args.size)
    if not hexes:
        print("\nNothing to export.")
        return

    if out_path.suffix.lower() == ".zip":
        write_zip(hexes, out_path)
    else:
        write_dir(hexes, out_path)

    try:
        shown = out_path.relative_to(REPO_ROOT)
    except ValueError:
        shown = out_path  # output lives outside the repo; show the absolute path
    print(f"\nDone — {len(hexes)} × {args.size}px hexagons in {shown}")


if __name__ == "__main__":
    main()
