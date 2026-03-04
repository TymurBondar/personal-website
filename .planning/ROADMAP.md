# Roadmap: Tymur Bondar — Personal Website

## Milestones

- ✅ **v1.0 MVP** — Phases 1-3 (shipped 2026-03-03)
- 🚧 **v2.0 Design & Content** — Phases 4-6 (in progress)

## Phases

<details>
<summary>✅ v1.0 MVP (Phases 1-3) — SHIPPED 2026-03-03</summary>

- [x] Phase 1: Foundation (2/2 plans) — completed 2026-03-03
- [x] Phase 2: Pages (2/2 plans) — completed 2026-03-03
- [x] Phase 3: Launch (2/2 plans) — completed 2026-03-03

Full details: `.planning/milestones/v1.0-ROADMAP.md`

</details>

### 🚧 v2.0 Design & Content (In Progress)

**Milestone Goal:** Transform the clean v1.0 foundation into a polished multi-page portfolio with solarpunk design system, 21st.dev hero component, career timeline, project showcases, and full content pages.

- [x] **Phase 4: Design System** - Define solarpunk color palette and typography in Tailwind @theme (completed 2026-03-03)
- [x] **Phase 5: Navigation + Hero** - Multi-page nav with active state and 21st.dev hero on Home (completed 2026-03-03)
- [ ] **Phase 6: Content Pages** - About timeline, Portfolio cards, and Contact page

## Phase Details

### Phase 4: Design System
**Goal**: The solarpunk visual identity is defined as reusable Tailwind utilities that every subsequent component can consume in a single pass
**Depends on**: Phase 3 (v1.0 foundation)
**Requirements**: DSGN-01, DSGN-03
**Success Criteria** (what must be TRUE):
  1. Tailwind utility classes for solarpunk colors (emerald/forest greens, warm dark background, amber accent) are available throughout the codebase via @theme in globals.css
  2. Typography scale and spacing tokens are defined in @theme and applied consistently across the existing single-page site
  3. Existing pages (Home, Navbar, Footer) visually reflect the solarpunk palette — no remaining interim gray-900/gray-* classes from v1.0
  4. Color tokens are named with unique identifiers (forest, bark, canopy, etc.) that do not shadow Tailwind defaults
**Plans**: 1 plan

Plans:
- [ ] 04-01: Define solarpunk @theme tokens and apply across all pages

### Phase 5: Navigation + Hero
**Goal**: Users can navigate to all four site pages with clear active-state feedback, and the Home page leads with a polished 21st.dev hero component styled to the solarpunk palette
**Depends on**: Phase 4
**Requirements**: NAV-01, NAV-02, NAV-03, NAV-04, DSGN-02
**Success Criteria** (what must be TRUE):
  1. Navbar displays Home, About, Portfolio, and Contact links; the active page link is visually distinguished with an emerald green indicator
  2. Mobile hamburger menu opens and closes with a smooth transition, providing full navigation on small screens
  3. Navbar sticks to the top of the viewport on scroll with a visible backdrop-blur effect
  4. Home page displays the 21st.dev hero component styled with solarpunk color tokens — not the v1.0 plain intro text
  5. usePathname() is isolated to a small NavLink client component; the outer Navbar remains a Server Component
**Plans**: 2 plans (Wave 1 parallel)

Plans:
- [x] 05-01: Multi-page Navbar with NavLink RSC boundary, mobile menu, sticky blur, stub pages
- [ ] 05-02: 21st.dev typographic hero with motion text animation and CTA buttons

### Phase 6: Content Pages
**Goal**: Users can visit About, Portfolio, and Contact pages and find complete, accurate, polished content representing Tymur's career history, projects, and contact information
**Depends on**: Phase 5
**Requirements**: PAGE-01, PAGE-02, PAGE-03, CONT-01, CONT-02, CONT-03
**Success Criteria** (what must be TRUE):
  1. About page displays a vertical career timeline with all four entries (Purdue CS, Binghamton Rover Team, Spelling Bee of Canada internship, IT & Digital Marketing Specialist) including tech tags per entry
  2. Portfolio page shows three project cards in a responsive grid — Rover Team (with YOLOv5 images via next/image), Spelling Bee of Canada (with link to spellingbeeofcanada.ca), and this personal website — with no cumulative layout shift from images
  3. Contact page displays a styled email address and labeled social links (LinkedIn, Telegram, GitHub) with no form or backend dependency
  4. All three pages are reachable via the Navbar and render correctly on mobile and desktop
**Plans**: 3 plans (Wave 1 parallel)

Plans:
- [ ] 06-01-PLAN.md — About page with vertical career timeline and scroll animations
- [ ] 06-02-PLAN.md — Portfolio page with three project cards in responsive grid
- [ ] 06-03-PLAN.md — Contact page with email display and social links

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Foundation | v1.0 | 2/2 | Complete | 2026-03-03 |
| 2. Pages | v1.0 | 2/2 | Complete | 2026-03-03 |
| 3. Launch | v1.0 | 2/2 | Complete | 2026-03-03 |
| 4. Design System | v2.0 | Complete    | 2026-03-03 | - |
| 5. Navigation + Hero | v2.0 | Complete    | 2026-03-03 | - |
| 6. Content Pages | 1/3 | In Progress|  | - |
