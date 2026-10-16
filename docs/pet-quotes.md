# Pet quotes (everything the pet says)

All speech goes through `say(text, ms)` in `pet.js`, which sets `bubble.textContent`. Because it is `textContent`, **no HTML is rendered**: write plain text and emoji only, and do not escape anything.

## Where each kind of quote lives

| Trigger | Source | File / symbol | Per-pet override |
|---|---|---|---|
| Pet created at startup or selected in the menu | `intro` | pet object in `PETS` (`templates.js`) | it is per pet by definition |
| User clicks the pet (when no gag fires) | `lines` | pet object | it is per pet by definition |
| Every 90 s while visible and not busy/talking | `timeLine()` first, else a random `lines` entry | `timeLine()` in `pet.js`, `lines` | `timeLine()` is shared by all pets |
| User types in the editor (`.rich-input`), at most once per 25 s, 30 % chance | `typing` | `TYPING` in `templates.js` | pass `typing: [...]` in `fill` extras |
| 5 clicks in a row, each less than 4 s after the previous | `mad` | `MAD` in `templates.js` | pass `mad: [...]` in `fill` extras |
| A gag plays | gag lines | `GAGS` in `templates.js`: `name: [durationMs, [quote, …]]` | pass a full `gags: {…}` |
| Falls asleep after 60 s idle / wakes up | fixed strings | `sleep()` in `pet.js` | not overridable |
| Big mode starts | fixed string | `setBig()` in `pet.js` | not overridable |
| Late night (23:00–05:00), lunch (11:00–13:00), end of day (17:00–19:00) | `timeLine()` | `pet.js` | not overridable |

## Writing rules

1. **Language:** Vietnamese. Natural, colloquial, slightly self-deprecating office humour (deadlines, KPI, boss messages, coffee, food, cat/rabbit puns). End most lines with one emoji; the emoji is part of the house style.
2. **Length:** one sentence, ideally ≤ 60 characters; hard cap about 90. The bubble is `max-width: 190px` in normal mode (wraps to ~3 lines) and 2.5× larger in big mode. Long lines cover the chat.
3. **Voice per pet:** every pet has a personality (Mochi: whiny, always hungry; Mun: deadpan, few words; Bông: gentle, carrot/health reminders). A new pet needs its own voice; do not copy another pet's lines.
4. **Quantity:** at least 8 lines per pet (Mochi has 20). Fewer than ~6 repeats noticeably.
5. **No real content:** never reference, quote or react to actual message text, contact names, or anything read from the DOM. The pet only knows time of day, typing activity and clicks.
6. **No sensitive or hurtful content:** no insults about real groups, no politics, no sexual jokes, no health claims. Self-mocking work humour is the limit.
7. **No duplicates** within a pet's `lines`; avoid near-duplicates across `lines` and `TYPING`/`MAD`.
8. **Quotes in code:** use double-quoted JS strings. If a line contains a double quote, use the typographic `“ ”` instead of escaping.

## Format reference

```js
// per-pet lines (in PETS)
lines: ["Cà phê là nhiên liệu, drama là gia vị ☕", "…"],

// shared arrays (templates.js)
const TYPING = ["Gõ đi gõ đi, mình đợi, mình có cả ngày 🍿", "…"];
const MAD = ["Thôi nha! Mình giận á 😾", "…"];

// shared gag table: duration in ms the pet stays frozen in the gag, then its lines
const GAGS = { zap: [3200, ["Chích điện cho tỉnh nè ⚡", "…"]], … };
```

`say()` is called as `say(pick(lines), ms - 300)` inside a gag, so the bubble disappears just before the gag ends. When you change a gag's duration, the bubble duration follows automatically.

## Adding a time-of-day line

Edit `timeLine()` in `pet.js`: it returns a string for a time window, or `null` to fall back to a random `lines` entry. Add another `if` before `return null;` with a non-overlapping hour range, keep the style of the existing ones:

```js
if (h >= 14 && h < 15) return "Buồn ngủ quá, cà phê đâu rồi ☕";
```

Time lines are shared by all pets, so keep them pet-neutral (they say "mình").

## Checklist

- [ ] Vietnamese, one sentence each, emoji at end, within length cap
- [ ] No duplicates, no message-content references
- [ ] Distinct voice for a new pet, ≥ 8 lines, `intro` present
- [ ] Valid JS (matching quotes/commas): `node --check theme/templates.js` or `theme/pet.js`
- [ ] Seen in the app: bubble fits, does not overflow the window edge (it is clamped 8 px from the edges), readable in light and dark mode
