# PaintRank v2 — Change Log

## Summary

All changes are confined to `paintrank.html` (single-file SPA). No build tools or external files were added.
Final line count: **4151 lines** (up from 3992).

---

## Bug Fixes

### BUG FIX 1 — Checklist tasks don't update after admin level change

**Root cause:** The painter doc `onSnapshot` listener called `renderPainter` but did NOT re-render the checklist when a painter's module changed.

**Fix:** In `startPainterListeners`, after `renderPainter`, the handler now fetches today's checkins fresh and calls `renderChecklist` with the new module's tasks.

**Lines affected:** ~1916-1921

---

### BUG FIX 2 — Painter select dropdown is empty / slow

**Root cause:** `_populatePainterDropdown` used a cold one-shot Firestore `.get()` fetch that could fail silently before Firebase initialized.

**Fix:** Replaced with a real-time `listenPainters` subscription. Shows "Chargement…" immediately, then populates as soon as Firestore responds. The listener unsub is pushed to `_unsubscribers` for proper cleanup.

**Lines affected:** ~1829-1846

---

### BUG FIX 3 — Add painter form is slow and has duplicate event listeners

**Root cause:** The form HTML was generated inside `renderPaintersTab` (called on every Firestore snapshot), meaning the form was not available until the first snapshot arrived and the confirm button had a new event listener added every re-render.

**Fix (3 steps):**
1. The `add-painter-form` HTML moved to **static HTML** in `tab-painters` so it exists immediately on page load.
2. `renderPaintersTab` no longer generates `formHtml` or restores form visibility — those ~22 lines deleted.
3. `confirmBtn` and `cancelBtn` now use a `_wired` flag so listeners are added only once.

**Lines affected:** HTML ~1347-1368, JS ~3419-3452

---

## New Features

### FEATURE 1 — Visual fire/pulse animation on task completion

When a task is checked, it now:
- Triggers a `task-pulse` CSS keyframe animation (red glow ring, 0.6s)
- Spawns a 🔥 emoji that floats upward and fades out (0.8s)
- Adds `.just-completed` class which also scales the checkbox to 1.2×

**CSS added:** `@keyframes task-pulse`, `.task-item.just-completed`, `.task-item.just-completed .task-checkbox` (~lines 559-573)

**JS added:** fire animation block inside `handleToggle` in `renderChecklist` (~lines 2590-2603)

---

### FEATURE 2 — Horizontal bar chart above the leaderboard

A pure-CSS horizontal bar chart now appears above the rank cards in the leaderboard. It shows each painter's streak count as a proportional bar (scaled to 14 days max), sorted by streak desc.

No external chart library — uses CSS flexbox + `linear-gradient` bars with `transition: width 0.6s ease`.

**CSS added:** `.leaderboard-chart`, `.chart-bar-row`, `.chart-bar-name`, `.chart-bar-track`, `.chart-bar-fill`, `.chart-bar-label`, `.chart-bar-count` (~lines 277-333)

**JS added:** `chartHtml` generation block in `renderLeaderboard`, injected via `rankContainer.innerHTML = chartHtml` before appending rank cards (~lines 2153-2180)

---

## Visual Overhaul

### A — Gradient hero header for leaderboard

Added `.view-header` CSS with a subtle top gradient using `color-mix(var(--color-primary) 8%, transparent)` and rounded bottom corners. The `<h2>Classement</h2>` is now wrapped in a `<div class="view-header">` with a subtitle line: *"Progression de l'équipe — streaks et niveaux"*.

**CSS lines:** ~1165-1179  
**HTML lines:** ~1213-1216

---

### B — More tactile task items

`.task-item` updated:
- `border-radius: 14px` (was 12px)
- `border: 1.5px` (was 1px)
- `min-height: 56px` (was 64px)
- Added `:hover` rule: primary-color border + subtle box-shadow
- Added `:active` rule: `scale(0.98)` press feedback
- Added `.task-item.done .task-label` with `text-decoration: line-through; opacity: 0.6`

**CSS lines:** ~490-514

---

### C — Rank cards with visual hierarchy

`.rank-card` now has explicit `display: flex`, `border: 1.5px`, `border-radius: 14px`, `transition: transform, box-shadow`.

`.rank-card:first-child` rule added: primary-color border + `box-shadow: 0 2px 12px rgba(239, 68, 68, 0.1)` for the #1 ranked card.

**CSS lines:** ~333-347

---

### D — Frosted glass nav bar

`#app-header` background changed from solid `var(--color-surface)` to `color-mix(in srgb, var(--color-surface) 85%, transparent)` with `backdrop-filter: blur(12px)` and `-webkit-backdrop-filter` for Safari.

**CSS lines:** ~198-206

---

### E — Smooth view transitions

`.view-panel` class added with `animation: viewFadeIn 0.25s ease`. The keyframe fades in from `opacity: 0; translateY(6px)` to fully visible.

Class added to all three view containers: `#view-leaderboard`, `#view-painter`, `#view-admin`.

**CSS lines:** ~1181-1186  
**HTML lines:** 1211, 1232, 1307

---

## Verification Checksums

| Check | Result |
|---|---|
| `grep -c "just-completed" paintrank.html` | 4 occurrences |
| `grep -c "leaderboard-chart" paintrank.html` | 2 occurrences |
| `grep -c "view-panel" paintrank.html` | 4 occurrences |
| `grep -c "chart-bar" paintrank.html` | 13 occurrences |
| `grep -c "add-painter-form-el" paintrank.html` | 4 occurrences |
| `wc -l paintrank.html` | 4151 lines |
