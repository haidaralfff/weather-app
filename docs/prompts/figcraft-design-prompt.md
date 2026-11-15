# Prompt Desain Figcraft — Cuaca Kebumen (BMKG · Tactile Design)

Gunakan prompt di bawah ini untuk menghasilkan atau merevisi desain UI **Cuaca Kebumen** di Figcraft/Figma agar selaras dengan [PRD.md](../PRD.md) dan prinsip **Tactile Design** (full-height docked sidebar hover, asymmetric 2-column Bento grid, hierarchy via contrast steps, semantik warna ketat, dan Material Icons).

---

```text
Design a tactile, quiet, dark-mode first (with optional Light Mode toggle) web app UI in Indonesian called "Cuaca Kebumen" — a focused weather & daily rain-check instrument specifically for Kota Kebumen (Kelurahan Kebumen, Kec. Kebumen, Jawa Tengah) powered by BMKG data.

PRIMARY GOAL:
Users must know within 3 seconds whether Kebumen will rain today and over the next 3 days (Hari Ini, Besok, Lusa), and at which exact hours (WIB) rain is predicted — visible above the fold on 1440×900 desktop without endless scrolling.

STRICT CONSTRAINTS (DO NOT INCLUDE):
- NO city search bar, NO region dropdown, NO map widget, NO login/profile, NO 7-day or 14-day forecast (BMKG public API provides 3 days in 3-hour intervals).
- NO technical/developer typography or jargon: NO monospace coding fonts (`JetBrains Mono` / `Cascadia Mono`), NO internal area codes (`adm4 33.05.12.1024`, `Kode wilayah`), NO API/engineering terms (`slot`, `cache`, `Rilis analisis`, `Data langsung`). Use clean proportional sans-serif with `tabular-nums` for aligned times and temperatures, and natural Indonesian phrasing (`Terbaru`, `jadwal`, `Pukul 21:00 WIB`, `Diperbarui pukul 21:00 WIB`).
- NO ALL-CAPS eyebrow labels, NO em dashes (—) in UI copy, NO Title Case headings (use natural Indonesian sentence case), NO thick 4px colored top borders on cards, NO big blurry drop shadows, NO floating detached sidebar islands in empty margins.
- BRAND LOGO: Custom tactile squircle emblem (40×40 grid, `rx=10`, deep coastal slate `#16222F` with `#2D3F52` border) containing an amber sun orb (`#E29A3B`), crisp cloud canopy (`#EAF1F8`), and twin angled rain capsules (`#3BA4D1`). Used in the sidebar brand slot, mobile header, drawer header, and browser favicon.
- Use Google Material Icons / Material Symbols (Rounded) consistently for ALL weather condition, sidebar navigation, and UI icons (today, calendar_view_day, schedule, water_drop, dark_mode, light_mode, refresh, menu, close, location_on, sunny, partly_cloudy_day, bedtime, nights_stay, cloud, rainy, thunderstorm, foggy, air, check_circle, cloud_off).

TYPOGRAPHY & VISUAL HIERARCHY:
- Display font: `Outfit` (SemiBold, tight negative tracking `-0.025em` to `-0.035em`) for primary focal points:
  - Hero temperature anchor (`44px`–`48px`), Page title (`26px`), and Section titles (`18px`).
- Body & Data font: `Onest` with `font-variant-numeric: tabular-nums` on times, temperatures, and rainfall so numeric columns stay aligned without coding-font styling.
- Clear 5-level hierarchy: Display temp (`44px+`) -> Page & section titles (`26px` / `18px`) -> Card titles & key values (`15px` SemiBold) -> Verdict & condition copy (`14.5px` Regular) -> Muted timestamps & labels (`12.5px` Medium `--ink-muted`).

TACTILE DESIGN SYSTEM (DARK-FIRST & LIGHT TOGGLE):
- Tactile Elevation (Dark Mode — Default):
  - Page ground: #0B1117, Raised card/rail: #131C26 with solid 0.5px #2A3746 outline + tight black drop shadow (never use glow shadows or lit top edges).
  - Control fill (buttons): #1E2B3A with solid 0.5px #3A4B5E outline + tight black drop.
  - Sunken wells / active rail item: #192430.
- Tactile Elevation (Light Mode — Optional Toggle):
  - Page ground: #EEF3F7 (soft mist), Card/Button/Rail surface: #FFFFFF
  - Crisp ring + tight drop only: 1px ring rgba(15, 30, 46, 0.08) + tight shadow (0 1px 2px rgba(15,30,46,0.10), 0 3px 4px -2px rgba(15,30,46,0.06)).
  - Sunken info wells (metric tiles, active sidebar row, past tags): #F4F7FA (no heavy border).
- Unified Radius Ladder:
  - Cards: 12px · Controls, sidebar rows & metric wells: 8px · Pills & status tags: 999px.
- Strict Color Semantics (Hue carries meaning ONLY, never selection rank):
  - Neutral ink steps (pass >= 4.5:1 contrast): Dark (#EAF1F8 strong, #A6B6C6 secondary, #7E90A3 muted); Light (#0F1E2E strong, #3B4D61 secondary, #5C7085 muted).
  - Selection state on day cards: Neutral high-contrast ring (1.5px #EAF1F8 in dark, #0F1E2E in light) — NEVER use blue for selection so it never collides with Rain semantics.
  - Rain status ONLY: Dark (#3BA4D1 accent, #102A3A tint, #245A76 border, #8CD3F2 ink); Light (#0B6E99 accent/bar, #E4F2F8 tint, #9FD0E6 border, #074C6B ink).
  - Clear / No-rain status: Dark (#E29A3B accent, #2A1F10 tint, #694B20 border, #F4C37A ink); Light (#B86A0B accent, #FDF2DF tint, #F0CFA0 border, #7D4504 ink).
  - Offline / stale cache banner: Dark (#272010 bg, #695320 border, #F2CA6B text); Light (#FFF8E6 bg, #E8CA7D border, #7A5400 text).

DESKTOP ARCHITECTURE (1440×900 — ABOVE THE FOLD):
1. Full-Height Docked Left Sidebar Rail (64px collapsed -> 236px smoothly pushed/expanded on hover, anchored edge-to-edge top-to-bottom with 1px right hairline border):
   - Top group: Custom Cuaca Kebumen Brand Emblem (36×36 tactile squircle) + app identity ("Cuaca Kebumen" / "Kebumen, Jawa Tengah") + vertical navigation anchors (`today` "Hari ini", `calendar_view_day` "3 hari ke depan", `schedule` "Rincian 3 jam").
   - Bottom pinned group (`margin-top: auto`): utility controls (`water_drop` "Hanya jam hujan" toggle switch, `dark_mode`/`light_mode` theme switch, `refresh` "Perbarui data").
2. Workspace Header:
   - Left: "Cuaca Kebumen" (26px Outfit SemiBold) + `location_on` "Kelurahan Kebumen, Kec. Kebumen, Jawa Tengah".
   - Right: Status pill ("● Terbaru") + tactile secondary button ("Perbarui").
3. Asymmetric 2-Column Tactile Bento Grid (max-width 1220px):
   - Left Column (430px):
     - Hero Verdict Card: Verdict pill ("Tidak ada hujan hari ini" / "Berpotensi hujan hari ini") + human summary + prominent display temperature ("25°C" 44px Outfit, "Berawan", "Pukul 21:00 WIB") + 2×2 sunken metric wells (Kelembapan, Angin, Curah hujan, Tutupan awan).
     - "Prakiraan 3 hari ke depan": 3 stacked horizontal-row selector cards (Hari Ini, Besok, Lusa) showing Day+Date, status pill, jam hujan/condition, WeatherIcon, and Min/Max temps + jadwal count ("8 jadwal").
   - Right Column (1fr):
     - "Prakiraan per 3 jam · Besok, 16 Nov" + "Total hujan 3.7 mm" -> 8-slot tactile list card displaying all hourly rows side-by-side without scrolling; rain progress bar shown ONLY on actual rain rows.
4. Attribution Footer:
   - Single balanced row below grid with BMKG source link + live dot + "Diperbarui pukul 21:00 WIB · Rilis BMKG 15 Nov 2026, 19:00 WIB".

MOBILE ARCHITECTURE (390px):
- 20px side gutters, 44px touch targets (`Perbarui` + `44×44` `menu` button opening bottom tactile drawer), 2×2 hero metrics with compact wind code (`BL`, `TG`), compact horizontal 3-day cards, and clean 3-hour rows.
```
