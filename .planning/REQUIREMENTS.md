# Requirements: Tymur Bondar — Personal Website

**Defined:** 2026-03-03
**Core Value:** A clean, polished site that accurately represents who Tymur is as a software engineer

## v2.0 Requirements

Requirements for the design and content release. Solarpunk visual identity + multi-page portfolio.

### Design System

- [x] **DSGN-01**: Define solarpunk color palette in Tailwind @theme block (emerald/forest greens, warm dark background, amber accent, OKLCH tokens)
- [ ] **DSGN-02**: Integrate 21st.dev hero component on Home page with solarpunk styling
- [x] **DSGN-03**: Define typography scale and spacing tokens in @theme block

### Navigation

- [x] **NAV-01**: Update Navbar to multi-page structure (Home, About, Portfolio, Contact links)
- [x] **NAV-02**: Add active page indicator using usePathname() in isolated NavLink component
- [x] **NAV-03**: Add mobile hamburger menu with smooth open/close transition
- [x] **NAV-04**: Sticky nav with backdrop-blur effect on scroll

### Pages

- [ ] **PAGE-01**: About page with vertical career timeline (Purdue, Binghamton Rover Team, Spelling Bee of Canada internship, IT & Digital Marketing Specialist role)
- [ ] **PAGE-02**: Portfolio page with 3 project cards in responsive grid (Rover Team, Spelling Bee of Canada, this personal website)
- [ ] **PAGE-03**: Contact page with styled email address and social links (LinkedIn, Telegram, GitHub)

### Content

- [ ] **CONT-01**: Rover Team project card with YOLOv5 object recognition description and images
- [ ] **CONT-02**: Spelling Bee of Canada project card with link to spellingbeeofcanada.ca
- [ ] **CONT-03**: Personal website project card showcasing Next.js 15 + React 19 + Tailwind v4 tech stack

## v2.1 Requirements

Deferred to next milestone. Build on the polished v2.0 foundation.

### Dark Mode

- **DARK-01**: Dark/light mode toggle with next-themes and @custom-variant dark
- **DARK-02**: System preference detection (prefers-color-scheme)
- **DARK-03**: Blocking inline script to prevent FOWT (flash of wrong theme)

### SEO & Polish

- **SEO-02**: Open Graph tags for LinkedIn/social sharing
- **SEO-03**: Custom favicon
- **SEO-04**: JSON-LD Person schema
- **SEO-05**: sitemap.xml via Next.js file convention
- **SEO-06**: robots.txt via Next.js file convention

## Out of Scope

| Feature | Reason |
|---------|--------|
| Blog / writing section | Not requested, can add in future milestone |
| Testing suite | Not priority for portfolio site |
| TypeScript migration | Keeping JavaScript for now |
| Contact form (Formspree/EmailJS) | Email + social links sufficient, no third-party dependency |
| Dynamic OG images | High effort, minimal gain for 4-page portfolio |
| Resume PDF download | Not in current scope, can add in v2.1 |
| Skills progress bars | Universally flagged as unprofessional |
| 3D hero / particle effects | Wrong aesthetic for minimal site |
| Horizontal timeline | Anti-pattern at mobile scale |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| DSGN-01 | Phase 4 | Complete |
| DSGN-03 | Phase 4 | Complete |
| NAV-01 | Phase 5 | Complete |
| NAV-02 | Phase 5 | Complete |
| NAV-03 | Phase 5 | Complete |
| NAV-04 | Phase 5 | Complete |
| DSGN-02 | Phase 5 | Pending |
| PAGE-01 | Phase 6 | Pending |
| PAGE-02 | Phase 6 | Pending |
| PAGE-03 | Phase 6 | Pending |
| CONT-01 | Phase 6 | Pending |
| CONT-02 | Phase 6 | Pending |
| CONT-03 | Phase 6 | Pending |

**Coverage:**
- v2.0 requirements: 13 total
- Mapped to phases: 13
- Unmapped: 0

---
*Requirements defined: 2026-03-03*
*Last updated: 2026-03-03 after roadmap creation — all 13 requirements mapped*
