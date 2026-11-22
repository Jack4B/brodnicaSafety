#!/usr/bin/env python3
"""Przygotowuje ilustracje z Wikimedia Commons: kadruje (usuwa angielskie podpisy),
nakłada paletę strony (duotone: --ink → --brand → --brand-soft → biel; czerwone akcenty → --danger)
i zapisuje WebP do src/illustrations/open/.

Użycie: python3 scripts/ilustracje-paleta.py KATALOG_Z_ORYGINAŁAMI
Oryginały (PNG, pobrane ze stron z src/illustrations/open/licencje.json) nazwij jak klucze w tym pliku.
Wymaga Pillow.
"""
import json, sys, os
from PIL import Image, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'src', 'illustrations', 'open')
META = json.load(open(os.path.join(OUT, 'licencje.json'), encoding='utf-8'))

# Paleta z src/assets/style.css
STOPS = [(0.00, (0x14, 0x21, 0x3D)),   # --ink
         (0.33, (0x1D, 0x3F, 0x8F)),   # --brand
         (0.68, (0xA9, 0xBC, 0xE6)),
         (0.88, (0xE6, 0xEC, 0xF8)),   # --brand-soft
         (1.00, (0xFF, 0xFF, 0xFF))]
DANGER = (0xB3, 0x26, 0x1E)

def lut():
    table = []
    for v in range(256):
        t = v / 255
        for (a, ca), (b, cb) in zip(STOPS, STOPS[1:]):
            if a <= t <= b:
                k = (t - a) / (b - a)
                table.append(tuple(round(ca[i] + (cb[i] - ca[i]) * k) for i in range(3)))
                break
    return table

LUT = lut()

def process(key, meta, src_dir):
    im = Image.open(os.path.join(src_dir, key + '.png')).convert('RGBA')
    bg = Image.new('RGBA', im.size, 'white'); bg.alpha_composite(im); im = bg.convert('RGB')
    l, t, r, b = meta.get('kadr', [0, 0, 1, 1])
    W, H = im.size
    im = im.crop((round(l * W), round(t * H), round(r * W), round(b * H)))
    # przytnij białe marginesy
    box = ImageOps.invert(im.convert('L')).point(lambda p: 255 if p > 12 else 0).getbbox()
    if box:
        pad = 12
        im = im.crop((max(box[0] - pad, 0), max(box[1] - pad, 0), min(box[2] + pad, im.width), min(box[3] + pad, im.height)))
    gray = ImageOps.autocontrast(im.convert('L'), cutoff=0.5)
    out = Image.new('RGB', im.size)
    px, g, o = im.load(), gray.load(), out.load()
    keep_red = meta.get('czerwien', False)  # tylko gdy czerwień niesie znaczenie (np. strzałka ucisku)
    for y in range(im.height):
        for x in range(im.width):
            r_, g_, b_ = px[x, y]
            o[x, y] = DANGER if (keep_red and r_ > 150 and g_ < 70 and b_ < 70) else LUT[g[x, y]]
    if out.width > 760:
        out = out.resize((760, round(out.height * 760 / out.width)), Image.LANCZOS)
    dest = os.path.join(OUT, key + '.webp')
    out.save(dest, 'WEBP', quality=80, method=6)
    meta['szerokosc'], meta['wysokosc'] = out.size
    print(f'{key}: {out.size[0]}×{out.size[1]}, {os.path.getsize(dest) // 1024} KB')

if __name__ == '__main__':
    src = sys.argv[1]
    for key, meta in META.items():
        process(key, meta, src)
    json.dump(META, open(os.path.join(OUT, 'licencje.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
