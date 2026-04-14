# PaintRank — Changes Summary (branch: feat/fixes-and-polish)

## Bug Fixes

### P0 FIX #1 — `forceLevelUp` used stale `currentModule` instead of next module
**File:** `paintrank.html` (~line 3548)  
**Problem:** The confirm callback re-fetched fresh painter data, but then passed `fresh.currentModule` as `completedKey` to `triggerLevelUp`. Since `triggerLevelUp` sets `currentModule = moduleCompleted`, passing the current module resulted in no advancement — the painter stayed at their existing level.  
**Fix:** After re-fetching, compute the actual target via `getActiveModule(fresh)` (falls back to `"master"` if on `mod3c`). Abort with an alert if already at maximum level.

### P0 FIX #2 — `toggleMasterBonus` passed `"mod3c"` instead of `"master"`
**File:** `paintrank.html` (~line 3351)  
**Problem:** When enabling the master bonus, the call was `triggerLevelUp(painterId, p, "mod3c", true)`. This set `currentModule` to `mod3c` — the level the painter was already on — rather than advancing to `"master"`.  
**Fix:** Changed argument to `"master"`.

### P1 FIX #3 — Stale painter closures in override buttons
**File:** `paintrank.html` (~lines 3857–3868)  
**Problem:** The force level-up and level-down buttons captured the `painter` object in their click-handler closures at the time the dropdown changed. If a level change happened while the same painter was selected, the buttons would operate on stale data.  
**Fix:** Both click handlers now look up the painter fresh from `_adminPainters` by ID at click time.

### P1 FIX #4 — Activity log filtering used client-side filter instead of Firestore query
**File:** `paintrank.html` (~line 3375)  
**Problem:** When filtering by painter, the code fetched 200 latest records and then filtered client-side — so a painter with many entries far back in time would show fewer than 200 results after filtering.  
**Fix:** When `filterPainterId` is set, use a Firestore compound query with `.where("painterId", "==", filterPainterId)` before `.limit(200)`.

### P1 FIX #5 — Theme not persisted across page loads
**File:** `paintrank.html` (~lines 3779, 3825)  
**Problem:** `toggleTheme` called `applyTheme` directly without saving, and `DOMContentLoaded` always applied `"dark"` unconditionally.  
**Fix:** `toggleTheme` now writes the chosen theme to `localStorage.setItem("paintrank-theme", next)`. On init, `localStorage.getItem("paintrank-theme") || "dark"` is used.

### P1 FIX #6 — Lucide version unpinned
**File:** `paintrank.html` (line 24)  
**Problem:** `lucide@latest` could silently break the app on icon API changes.  
**Fix:** Pinned to `lucide@0.460.0`.

### P2 FIX #7 — Case-sensitive painter URL matching
**File:** `paintrank.html` (~line 1654)  
**Problem:** The Firestore query used the URL parameter value as-is for an exact-match query, but names are stored lowercase. Navigating to `/painter/Alice` would fail even if `alice` exists.  
**Fix:** Applied `.toLowerCase()` to `nameOrId` before the Firestore query.

### P2 FIX #8 — README missing clarification on level-down granularity
**File:** `README.md` (~line 240)  
**Added:** A technical note explaining that automatic reversion only recedes one module per recalculation, and that manual level-down is required for larger adjustments.

### P2 FIX #9 — Firestore rules security comment was incomplete
**File:** `firestore.rules` (~line 6)  
**Added:** A `DELIBERATE TRADEOFF` comment block clarifying that `/painters` and `/checkins` are intentionally open to all writes, the accepted risk profile, and a recommendation for hardening via Firebase Auth.

---

## UI/UX Polish

### Polish A — Painter dashboard header card
**File:** `paintrank.html` (~line 363)  
Converted the plain centered header into a proper card: added `background: var(--color-surface)`, `border: 1px solid var(--color-border)`, `border-radius: 16px`, horizontal padding, and `margin-bottom: 1rem`. Also tightened the `.painter-name` bottom margin and `.painter-team` top margin.

### Polish B — Streak block border
**File:** `paintrank.html` (~line 390)  
Added `border: 1px solid var(--color-border)` to `.streak-block` for visual consistency with other surface cards.

### Polish C — "Days remaining" label in streak block
**File:** `paintrank.html` (HTML ~line 1140, JS ~lines 2286–2302)  
- Added a `<p id="streak-remaining">` element below the progress bar in the streak block HTML.
- In `renderPainter`, after updating the progress bar width, the remaining label is computed as `STREAK_REQUIRED - streakCount` days and populated.
- In the else branch (no active module / master), the label is cleared.

### Polish D — Leaderboard skeleton loading hint
**File:** `paintrank.html` (~line 1988)  
Added a "Calcul des streaks…" hint paragraph below the skeleton cards during the async streak computation phase.

### Polish E — Meta description and emoji favicon
**File:** `paintrank.html` (lines 7–8)  
Added `<meta name="description">` with a French description of the app, and an inline SVG data-URI favicon using the 🎨 emoji.

### Polish F — Activity log badge color-coding
**File:** `paintrank.html` (~lines 789–791)  
Changed `.activity-badge.levelup` and `.activity-badge.force_levelup` from hard-coded dark-mode colors (`#1a2e4a` / `#60a5fa`) to theme-aware CSS variables (`var(--color-success-highlight)` / `var(--color-success)`), matching the existing `.activity-badge.check` style.

### Polish G — Payroll table alternating row shading
**File:** `paintrank.html` (~line 813)  
Added `.payroll-table tr:nth-child(even) td { background: var(--color-surface-2); }` for improved readability on mobile.

### Polish H — Override calendar color legend
**File:** `paintrank.html` (~line 1247)  
Added a small flex legend above the 30-day calendar grid explaining the 🔥 streak, ❌ fail, and — neutral day block states.

---

## Verification Results

| Check | Result |
|---|---|
| `triggerLevelUp` call sites | 4 occurrences — P0 fixes confirmed at lines 3379, 3588 |
| `localStorage` usage | 2 occurrences — set on toggle (3781), read on init (3825) |
| Lucide version pinned | `lucide@0.460.0` at line 24 |
| `toLowerCase` in showPainter | line 1654 |
| Total line count | **3939** (expected 3920–3940) ✓ |
