from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630

BG       = (15,  23,  42)
SURFACE  = (30,  41,  59)
MAIN     = (14,  165, 233)   # #0EA5E9 sky blue
POINT    = (167, 139, 250)   # #A78BFA lavender
ACCENT   = (251, 113, 133)   # #FB7185 coral pink
TEXT_HI  = (241, 245, 249)   # #f1f5f9
TEXT_MID = (148, 163, 184)   # #94a3b8
TEXT_LO  = (71,  85,  105)   # #475569

# ── 배경 ──────────────────────────────────────
base = Image.new('RGB', (W, H), BG)

# 장식 원 (반투명 오버레이)
overlay = Image.new('RGBA', (W, H), (0, 0, 0, 0))
od = ImageDraw.Draw(overlay)
od.ellipse([-80, -80, 400, 400],   fill=(*MAIN,  22))
od.ellipse([900,  300, 1380, 780], fill=(*POINT, 18))
od.ellipse([850,  -60, 1200, 290], fill=(*ACCENT,14))
od.ellipse([350,  400, 750,  750], fill=(*MAIN,  10))
base = Image.alpha_composite(base.convert('RGBA'), overlay).convert('RGB')

draw = ImageDraw.Draw(base, 'RGBA')

# ── 카드 패널 ──────────────────────────────────
draw.rounded_rectangle([60, 60, W-60, H-60], radius=24,
                        fill=(*SURFACE, 200), outline=(*TEXT_LO, 80), width=1)

# ── 왼쪽 그라디언트 세로 바 ──────────────────────
bar_x, bar_y, bar_h, bar_w = 100, 190, 290, 6
colors = [MAIN, POINT, ACCENT]
for i in range(bar_h):
    t = i / bar_h
    if t < 0.5:
        c = tuple(int(colors[0][j] + (colors[1][j]-colors[0][j]) * (t/0.5)) for j in range(3))
    else:
        c = tuple(int(colors[1][j] + (colors[2][j]-colors[1][j]) * ((t-0.5)/0.5)) for j in range(3))
    draw.rectangle([bar_x, bar_y+i, bar_x+bar_w, bar_y+i+1], fill=c)

# ── 폰트 ──────────────────────────────────────
def load_font(size, bold=False):
    paths = [
        "/System/Library/Fonts/AppleSDGothicNeo.ttc",
        "/System/Library/Fonts/Supplemental/AppleGothic.ttf",
        "/Library/Fonts/NotoSansCJKkr-Regular.otf",
    ]
    idx = 7 if bold else 2
    for p in paths:
        try:
            return ImageFont.truetype(p, size, index=idx)
        except Exception:
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                continue
    return ImageFont.load_default()

f_sub   = load_font(34)
f_name  = load_font(108, bold=True)
f_role  = load_font(30)
f_url   = load_font(24)

# ── 텍스트 ──────────────────────────────────────
tx = 128

# 서브 타이틀
draw.text((tx, 195), "Profile", font=f_sub, fill=TEXT_MID)

# 이름 (그라디언트 효과 — 흰색)
name_y = 290
draw.text((tx, name_y), "김서우", font=f_name, fill=TEXT_HI)

# 역할
draw.text((tx, 430), "노코드 / AI툴 활용  ·  서비스기획자", font=f_role, fill=(*MAIN, 230))

# URL
draw.text((tx, 488), "seowoo92.github.io/rest01", font=f_url, fill=(*TEXT_MID, 160))

# ── 오른쪽 장식 도트 클러스터 ──────────────────────
import math
dots = [
    (920, 280, 8,  MAIN,   180),
    (970, 340, 6,  POINT,  160),
    (890, 380, 10, ACCENT, 150),
    (1020,300, 5,  MAIN,   130),
    (1060,370, 7,  POINT,  140),
    (950, 430, 5,  ACCENT, 120),
    (1000,430, 4,  MAIN,   100),
    (860, 310, 4,  POINT,  110),
]
for (x, y, r, col, alpha) in dots:
    draw.ellipse([x-r, y-r, x+r, y+r], fill=(*col, alpha))

# ── 하단 그라디언트 라인 ──────────────────────────
for x in range(W):
    t = x / W
    if t < 0.33:
        c = tuple(int(MAIN[j]  + (POINT[j]  - MAIN[j])  * (t/0.33))  for j in range(3))
    elif t < 0.66:
        c = tuple(int(POINT[j] + (ACCENT[j] - POINT[j]) * ((t-0.33)/0.33)) for j in range(3))
    else:
        c = ACCENT
    draw.rectangle([x, H-8, x+1, H], fill=c)

base.save("images/og-image.png", "PNG")
print("✅ og-image.png 생성 완료")

# ── 파비콘 (32×32, 64×64) ─────────────────────
for size in [16, 32, 64]:
    fav = Image.new('RGB', (size, size), BG)
    fd  = ImageDraw.Draw(fav, 'RGBA')

    # 배경 원
    fd.ellipse([0, 0, size, size], fill=MAIN)

    # 'K' 텍스트
    try:
        ff = load_font(int(size * 0.58), bold=True)
        bbox = fd.textbbox((0, 0), "K", font=ff)
        tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
        fd.text(((size-tw)//2 - bbox[0], (size-th)//2 - bbox[1]), "K",
                font=ff, fill=(255, 255, 255))
    except Exception:
        pass
    fav.save(f"images/favicon-{size}.png", "PNG")

# .ico 생성 (16, 32 포함)
ico16 = Image.open("images/favicon-16.png")
ico32 = Image.open("images/favicon-32.png")
ico32.save("favicon.ico", format="ICO", sizes=[(16,16),(32,32)])
print("✅ favicon.ico 생성 완료")
