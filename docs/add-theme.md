# Add or change a theme

A theme is a named bundle of CSS variables. Adding one is **one object in one file** (`theme/templates.js`). No CSS file, no registration list, no picker code: the eye-menu card and its mini-preview are generated from the object.

## How it works (so you do not break it)

- `templates.js` holds `THEMES = { id: { name, vars } }`.
- `apply()` runs at load, on `__zg.set()`, and on the cross-window `storage` event. It (1) removes every property named in the union of all themes' `vars` from `document.documentElement.style`, then (2) sets the selected theme's `vars` on `<html>` as inline styles.
- Inline `<html>` styles beat the defaults declared in `:root { … }` in `glass.css`. The CSS then reads the variables everywhere (`var(--zg-…)`, `rgb(var(--zg-primary) / .3)`).
- Consequence: **if your theme omits a key, that key falls back to the `glass.css` default (the purple Glass palette), not to something neutral.** A missing key therefore shows up as an unexplained purple tint. Always provide all 15 keys.
- Selection is stored in `localStorage["zg-tpl"].theme` as your object key. An unknown id falls back to `glass`.

## The 15 variables

Use the exact formats; the CSS composes them in ways that break otherwise.

| Variable | Format | Role | Example |
|---|---|---|---|
| `--zg-primary` | `"R G B"` (space separated integers, no commas, no `rgb()`) | Primary buttons, outgoing message bubble, focus ring | `"110 96 255"` |
| `--zg-accent` | `"R G B"` | Selected-item highlight, light accents (dark mode) | `"139 120 255"` |
| `--zg-ink` | `"R G B"` | Borders / dividers / shadows in light mode (should be a dark tone of the hue) | `"60 50 140"` |
| `--zg-ink2` | `"R G B"` | Sidebar icons in light mode (dark, readable on a pale glass background) | `"74 69 144"` |
| `--zg-bg-d` | hex colour | Base page colour in dark mode (very dark) | `"#070814"` |
| `--zg-bg-l` | hex colour | Base page colour in light mode (very pale) | `"#eef0fb"` |
| `--zg-d1` … `--zg-d5` | `rgba(r, g, b, a)` | Five ambient gradient blobs, dark mode. Alpha roughly 0.15–0.45 | `"rgba(124, 92, 255, 0.42)"` |
| `--zg-l1` … `--zg-l4` | `rgba(r, g, b, a)` | Four ambient gradient blobs, light mode. Alpha roughly 0.25–0.45. (`l5` does not exist) | `"rgba(150, 125, 255, 0.45)"` |

Count: 4 + 2 + 5 + 4 = 15.

Where blobs sit (so you can reason about the look): `d1/l1` top-left, `d2/l2` top-right, `d3/l3` bottom-right, `d4/l4` bottom-left, `d5` centre (dark only). The picker preview draws `d1`/`l1` and `d3`/`l3` over `bg-d`/`bg-l`, so make those two differ clearly in hue to get a representative card.

## Steps

1. Pick an id: lowercase ASCII letters/digits, no spaces (`rose`, `mint`). This is permanent.
2. Open `theme/templates.js`. Find the end of the `THEMES` object (the line `forest: { … } },` followed by `};`). Add your entry **before** the closing `};`, same indentation, trailing comma:
   ```js
   rose: { name: "Hồng", vars: {
     "--zg-primary": "225 29 110", "--zg-ink": "130 30 80", "--zg-ink2": "140 50 95", "--zg-accent": "251 113 160", "--zg-bg-d": "#14060c", "--zg-bg-l": "#fbeef3",
     "--zg-d1": "rgba(236, 72, 130, 0.38)", "--zg-d2": "rgba(255, 140, 90, 0.24)", "--zg-d3": "rgba(190, 60, 200, 0.26)", "--zg-d4": "rgba(255, 190, 80, 0.14)", "--zg-d5": "rgba(240, 100, 150, 0.16)",
     "--zg-l1": "rgba(250, 130, 175, 0.42)", "--zg-l2": "rgba(255, 175, 130, 0.35)", "--zg-l3": "rgba(210, 120, 225, 0.30)", "--zg-l4": "rgba(255, 210, 120, 0.25)" } },
   ```
   `name` is the Vietnamese card label (short, ideally ≤ 12 characters; the card is 104 px wide).
3. Choose colours deliberately:
   - `primary` must be dark/saturated enough that white text on it (outgoing bubble at ~34 % alpha over a dark glass, and solid button) stays readable. Avoid pale yellows/limes for `primary`.
   - `ink`/`ink2` are used for light-mode lines and icons: they must be **dark** (low RGB values). If you put a light colour here, light-mode borders and sidebar icons become invisible.
   - `bg-d` near black with a slight hue; `bg-l` near white with a slight hue.
4. Syntax check: `node --check theme/templates.js`.
5. Install and verify per `build-and-verify.md`, then run the checklist below.

## Verification checklist

- [ ] Eye button in the sidebar → "Giao diện": a new card with the right name and a preview whose colours match the theme.
- [ ] Click the card: the app recolours immediately, without reload; the card shows the selected border.
- [ ] **Dark mode** (Zalo settings → dark): background, ambient blobs, outgoing bubble, buttons, selected conversation all use the new hue; nothing stays purple.
- [ ] **Light mode**: same, plus borders and sidebar icons readable.
- [ ] Switch back to another theme: no leftover tint from this one (proves all keys are present and removable).
- [ ] Quit and reopen Zalo: selection persisted.
- [ ] Open an image (viewer window) and check it follows the theme.
- [ ] Any hard-coded purple remaining? In the app, look for purple items. A hit means some CSS hardcodes a colour instead of using `--zg-*`; fix that CSS (see below), do not special-case your theme.

## Changing the default Glass theme

The `glass` entry in `THEMES` **must equal** the defaults in `glass.css` `:root { … }` (the `--zg-*` block under the "ambient" comment), because the CSS defaults are what shows before JS runs and what other themes fall back on. If you edit one, edit the other identically. Light-mode defaults are the same `:root` block (`--zg-l1…l4`, `--zg-bg-l`).

## Making a component follow the theme (CSS)

Only use theme variables for hue:

```css
/* correct */
border-color: rgb(var(--zg-primary));
background: rgb(var(--zg-accent) / 0.22);
/* wrong: hardcoded hue never changes with the theme */
background: rgba(110, 96, 255, 0.22);
```

To override one of Zalo's own tokens, set it on `body` with `!important` inside `glass.css` (dark) or `glass-light.css` (light), exactly like the existing lines. Remember `glass.css` and `dark-base.css` are wrapped to dark mode by `install.mjs`; a rule you write there under a top-level `body {` applies in dark mode only, so mirror it in `glass-light.css` if both modes need it.

## Common mistakes

| Mistake | Symptom |
|---|---|
| Commas or `rgb()` in `primary/accent/ink/ink2` | Buttons/bubbles lose colour entirely (invalid `rgb(var(...) / a)`) |
| Hex or `rgb()` in `--zg-d*/--zg-l*` | Gradient blob missing |
| Missing a key | Purple tint from the Glass default |
| Renaming an existing id | Users' saved theme resets to Glass |
| Editing `glass` in `templates.js` only | Flash of old colours on start, wrong fallback for other themes |
| Light colours in `ink`/`ink2` | Invisible light-mode borders and icons |
| Pale `primary` | Illegible bubble/button text |
