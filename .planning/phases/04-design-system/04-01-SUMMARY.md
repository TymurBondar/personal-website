---
phase: 04-design-system
plan: 01
subsystem: ui
tags: [tailwind, tailwind-v4, oklch, css-tokens, next-font, solarpunk]

# Dependency graph
requires: []
provides:
  - Solarpunk @theme color tokens (bark, forest, cream, amber-solarpunk) as Tailwind utilities
  - Typography tokens (font-weight-display, tracking-display) in @theme
  - Spacing tokens (spacing-section, spacing-content) in @theme
  - Inter font wired via @theme inline + next/font variable prop
  - @custom-variant dark placeholder for v2.1
  - All five core source files using solarpunk token classes exclusively
affects:
  - 05-components
  - 06-content

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "@theme OKLCH color tokens as Tailwind utility source"
    - "@theme inline for runtime CSS variable (next/font) consumption"
    - "SVG currentColor pattern — SVGs inherit color from parent text-* class"
    - "next/font variable prop on <html> element, consumed by @theme inline --font-sans"

key-files:
  created: []
  modified:
    - src/app/globals.css
    - src/app/layout.js
    - src/app/page.js
    - src/components/Navbar.js
    - src/components/Footer.js

key-decisions:
  - "OKLCH color space used for all palette tokens — perceptually uniform, wide gamut"
  - "Token prefixes bark/forest/cream/amber-solarpunk chosen to avoid shadowing Tailwind defaults"
  - "@theme inline (not plain @theme) required for --font-inter because next/font sets it at runtime"
  - "SVGs use fill=currentColor with text-cream-100 on parent Link — avoids brittle hardcoded fill=white"
  - "amber-solarpunk included proactively — Phase 5 Navbar hover/active states will need it"

patterns-established:
  - "Token naming: always use non-default prefixes (bark, forest, cream) to avoid Tailwind conflicts"
  - "Font wiring: next/font variable prop on html element, @theme inline maps to --font-sans"
  - "SVG color: fill=currentColor + text-* on parent element, never hardcoded fill=white"
  - "Base styles: @layer base for element defaults, never inline hex colors"

requirements-completed: [DSGN-01, DSGN-03]

# Metrics
duration: 2min
completed: 2026-03-03
---

# Phase 4 Plan 01: Design System - Solarpunk Token Foundation Summary

**Solarpunk @theme palette with 9 OKLCH color tokens, Inter font via @theme inline, and all five source files migrated from gray-* to bark/cream/forest utilities**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-03T18:38:21Z
- **Completed:** 2026-03-03T18:40:40Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments

- Defined complete solarpunk palette in @theme using OKLCH: bark-950/900 (charcoal backgrounds), forest-700/600/500/400 (muted greens), cream-100/200 (warm text), amber-solarpunk (interactive accent)
- Wired Inter font through next/font variable prop + @theme inline, replacing the former direct className approach
- Replaced all interim gray-*, text-white, and hardcoded fill="white" in all five source files with solarpunk token classes — zero remaining interim values

## Task Commits

Each task was committed atomically:

1. **Task 1: Define solarpunk @theme tokens and wire Inter font** - `72e73b3` (feat)
2. **Task 2: Replace all interim gray-* classes with solarpunk tokens** - `9c3a424` (feat)

**Plan metadata:** _(docs commit to follow)_

## Files Created/Modified

- `src/app/globals.css` - Complete @theme block with 9 color tokens, 2 typography tokens, 2 spacing tokens; @theme inline for Inter; @custom-variant dark; @layer base body styles
- `src/app/layout.js` - Inter variable prop on html element, bg-bark-950 on main, text-white removed from body
- `src/app/page.js` - text-gray-100 -> text-cream-100 (h1 + 4 strong tags), text-gray-300 -> text-cream-200 (p tag)
- `src/components/Navbar.js` - bg-gray-900 -> bg-bark-950, text-gray-100 -> text-cream-100
- `src/components/Footer.js` - bg-gray-900 -> bg-bark-950, text-gray-100 -> text-cream-100; all 3 SVGs converted to fill=currentColor with text-cream-100 on parent

## Decisions Made

- Used OKLCH color space for all palette tokens — perceptually uniform and wide-gamut ready
- Token prefixes (bark, forest, cream, amber-solarpunk) chosen to avoid shadowing any Tailwind default color names
- `@theme inline` required (not plain `@theme`) for the --font-inter mapping, because next/font sets --font-inter as a runtime CSS variable and plain @theme resolves at compile time
- SVGs converted to fill=currentColor pattern — color now flows from parent text-cream-100, making it easy to theme later
- amber-solarpunk included proactively per plan guidance — Phase 5 Navbar will need it for hover/active states

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All solarpunk @theme tokens are live and generating Tailwind utilities (bg-bark-950, text-cream-100, text-forest-600, text-amber-solarpunk, etc.)
- Inter font renders correctly via @theme inline
- Phase 5 (Components) can immediately consume bg-bark-950, text-cream-100, text-forest-600, and text-amber-solarpunk for Navbar, hero, and interactive elements
- Dark mode @custom-variant is in place for v2.1 — no dark classes in use yet

---
*Phase: 04-design-system*
*Completed: 2026-03-03*
