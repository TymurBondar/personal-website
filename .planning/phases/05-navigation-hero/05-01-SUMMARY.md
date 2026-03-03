---
phase: 05-navigation-hero
plan: 01
subsystem: ui
tags: [navbar, navigation, mobile-menu, sticky-nav, server-component]
dependency_graph:
  requires: [04-01]
  provides: [multi-page-nav, stub-pages, active-link-detection]
  affects: [layout.js, all-pages]
tech_stack:
  added: []
  patterns: [RSC-boundary-isolation, usePathname-in-leaf-component, CSS-only-transitions]
key_files:
  created:
    - src/components/NavLink.js
    - src/components/NavMobileMenu.js
    - src/app/about/page.js
    - src/app/portfolio/page.js
    - src/app/contact/page.js
  modified:
    - src/components/Navbar.js
key_decisions:
  - "NavLink uses pathname === '/' for root and pathname.startsWith(href) for others -- prevents '/' matching every page"
  - "Static bg-bark-950/90 backdrop-blur-md on Navbar -- no scroll listener needed, keeps Navbar as Server Component"
  - "Hamburger animation uses CSS transform on three spans -- no framer-motion dependency for nav"
  - "Mobile dropdown uses opacity/translate-y transition with pointer-events-none when closed -- accessible, no layout shift"
requirements_completed: [NAV-01, NAV-02, NAV-03, NAV-04]
metrics:
  duration: 1min
  completed: "2026-03-03T19:18:00Z"
---

# Phase 5 Plan 01: Navbar Refactor Summary

Multi-page sticky navbar with RSC boundary isolation, NavLink active detection via usePathname, CSS-animated hamburger menu, and three stub pages

## What Was Built

### NavLink Client Component (src/components/NavLink.js)
- `"use client"` component importing `usePathname` from `next/navigation`
- Active detection: `pathname === '/'` for root, `pathname.startsWith(href)` for sub-pages
- Active styling: `text-forest-400 font-semibold border-b-2 border-forest-400 pb-0.5`
- Inactive styling: `text-cream-200 hover:text-cream-100 transition-colors`
- Accepts optional `onClick` prop for mobile menu close behavior

### NavMobileMenu Client Component (src/components/NavMobileMenu.js)
- `"use client"` component with `useState` toggle
- Hamburger: three `<span>` bars with CSS `rotate-45`/`opacity-0`/`-rotate-45` transforms
- Dropdown: absolute positioned `bg-bark-900` panel with `opacity`/`translate-y` transition
- Closed state uses `pointer-events-none` to prevent invisible click targets
- Each NavLink passes `onClick={() => setOpen(false)}` for auto-close on navigation

### Updated Navbar Server Component (src/components/Navbar.js)
- Remains a Server Component (no `"use client"`)
- `sticky top-0 z-50 bg-bark-950/90 backdrop-blur-md` for persistent top-of-viewport positioning
- Desktop: `hidden md:flex gap-6` row with 4 NavLinks (Home, About, Portfolio, Contact)
- Mobile: `NavMobileMenu` visible only below `md` breakpoint
- Links array defined as plain data, passed to both desktop NavLinks and mobile menu

### Stub Pages
- `/about`, `/portfolio`, `/contact` -- each renders "Coming soon" centered in `min-h-[80vh]`
- All three routes confirmed in `next build` output as static pages

## Verification Results

- `next build`: All 5 routes generated successfully (/, /about, /contact, /portfolio, /_not-found)
- NavLink.js contains `"use client"` and `usePathname`
- NavMobileMenu.js contains `"use client"` and `useState`
- Navbar.js does NOT contain `"use client"` -- confirmed Server Component
- Navbar.js contains `sticky top-0` and `backdrop-blur-md`
- All three stub page files exist and export default functions

## Commits

| Task | Description | Hash | Files |
|------|-------------|------|-------|
| 1 | Create NavLink and NavMobileMenu client components | 559ad11 | NavLink.js, NavMobileMenu.js |
| 2 | Update Navbar with sticky blur, add stub pages | dc758a7 | Navbar.js, about/page.js, portfolio/page.js, contact/page.js |

## Deviations from Plan

None -- plan executed exactly as written.

## Decisions Made

1. **Root path matching strategy**: `pathname === '/'` strict equality for Home link prevents the root "/" from matching every page via `startsWith`. All other links use `startsWith(href)` for nested route support.
2. **Static backdrop approach**: `bg-bark-950/90 backdrop-blur-md` applied statically -- no scroll event listener, no `useEffect`, no client-side JS needed in Navbar. This keeps Navbar as a pure Server Component.
3. **CSS-only hamburger animation**: Three `<span>` elements with Tailwind `rotate-45`/`translate-y`/`opacity-0` transforms. No framer-motion import -- that dependency is reserved for the hero component in Plan 05-02.
4. **Pointer-events-none on closed dropdown**: Prevents invisible menu from intercepting clicks when visually hidden via opacity-0 transition.

## Self-Check: PASSED

- All 6 created/modified files verified on disk
- Both commit hashes (559ad11, dc758a7) verified in git log
- next build completed successfully with all 5 routes
