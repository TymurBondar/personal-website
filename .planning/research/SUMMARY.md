# Project Research Summary

**Project:** Tymur Bondar Personal Portfolio — v2.0 Design & Content
**Domain:** Software engineer personal portfolio website
**Researched:** 2026-03-03
**Confidence:** HIGH

## Executive Summary

This is a visual and content upgrade to an existing Next.js 15 + Tailwind CSS v4 portfolio that is already live on Vercel. The v1.0 foundation (App Router, React 19, ESLint, deployment) is locked in and working. v2.0 adds a solarpunk design system, a 21st.dev hero component, three new pages (About with career timeline, Portfolio with project cards, Contact), multi-page navigation with active state, and full SEO coverage. The recommended approach is to build the color token system first — every subsequent component depends on it — then layer layout infrastructure, the hero, content pages, and SEO in strict dependency order. Zero new npm packages are required for the core work; at most two optional packages (`next-themes` for dark mode toggle, `framer-motion` if the chosen 21st.dev component requires it) may be added.

The solarpunk aesthetic is Tymur's strongest differentiator in the developer portfolio space. The practical implementation is a warm dark background (not pure black), vibrant emerald/forest green accents, and warm amber secondary tones — defined entirely via Tailwind v4's CSS-first `@theme` directive in `globals.css`. No `tailwind.config.js` should be created; Tailwind v4's CSS-first path makes it unnecessary and the legacy pattern. The 21st.dev hero is a copy-paste component (not an npm package) and must be adapted to match the solarpunk color tokens. All three portfolio projects have compelling visual outputs (YOLOv5 detection screenshots for the rover team, a live site screenshot for Spelling Bee of Canada) that should be used aggressively.

The biggest risks are implementation-time mistakes rather than architectural unknowns: incorrect Tailwind v4 dark mode setup that bakes values at build time instead of toggling at runtime, a flash of wrong theme on page load without a blocking inline script, forgetting `metadataBase` so all OG images produce broken social previews, and adding `"use client"` to the entire Navbar when only a small `NavLink` component needs it. All seven identified pitfalls have clear, low-effort prevention strategies and are well-documented in official sources. The domain is mature and the implementation patterns are well-established — confidence across all four research areas is HIGH.

---

## Key Findings

### Recommended Stack

The v1.0 stack (Next.js 15 App Router, React 19, Tailwind CSS v4, ESLint 9, Vercel) satisfies all v2.0 requirements with zero new core packages. All SEO features (metadata API, OG tags, sitemap.xml, robots.txt, JSON-LD), image optimization (`next/image`), and multi-page routing are built into Next.js 15. The `@theme` directive in Tailwind v4 generates all custom color utilities from a single CSS block in `globals.css`. This is the correct v4 approach — creating a `tailwind.config.js` for color customization is the deprecated v3 pattern.

**Core technologies:**
- Next.js 15 (App Router): routing, metadata API, image optimization, static generation — already installed
- React 19: component model, Server/Client Component boundary — already installed
- Tailwind CSS v4 (CSS-first via `@theme`): design token generation, dark variant, utility classes — already installed
- Vercel: deployment, CDN edge caching, automatic CI on push — already configured

**Optional additions (conditional only):**
- `next-themes ^0.4.6`: dark/light mode toggle that persists via localStorage — only if manual toggle is built; system preference detection is zero-code via `prefers-color-scheme`
- `framer-motion ^12.x`: animations for the chosen 21st.dev hero component — only if required by the specific component selected; React 19 compatible

### Expected Features

**Must have (table stakes — v2.0 launch blockers):**
- Solarpunk color token system (`@theme` block in `globals.css`) — foundation for all visual work; every other feature depends on this
- 21st.dev hero component on Home page — replaces current plain intro; defines the portfolio's visual identity
- Multi-page Navbar — all 4 routes accessible; active page indicator via `usePathname`; RSC boundary with small `NavLink` client component
- About page with vertical alternating career timeline — 4-5 entries (IT & DM role, Spelling Bee, Rover Team, Purdue CS); CSS-only; tech tags per entry
- Portfolio page with 3 project cards — `next/image` screenshots; hover overlay; GitHub and live links; tech tags
- Contact page — styled email CTA + labeled social links (LinkedIn, GitHub, Telegram); no form backend
- Core SEO — `metadataBase`, unique title/description per page, OG tags, JSON-LD Person schema, favicon, sitemap.js, robots.js
- Favicon + apple-touch-icon — visible from first Vercel preview deploy; file-based convention in `src/app/`

**Should have (competitive differentiators — high value, low cost):**
- Semantic color token layer (surface/accent/text aliases over raw scale) — enables dark mode without component rework
- Current status indicator on hero ("Open to opportunities") — humanizes and provides context
- Hover overlay on portfolio cards revealing description — modern feel, CSS-only
- Emerald green accent on active nav link — consistent palette signal
- Sticky navbar with backdrop blur — allows navigation from any scroll position
- `aria-current="page"` on active nav link — accessibility standard

**Defer to v2.1:**
- Dark/light mode toggle — requires all components using semantic tokens; add after v2.0 CSS is stable; blocking FOWT script required
- Scroll-reveal on career timeline — `IntersectionObserver`, no library, pure polish
- Custom 404 page — personality signal, minimal effort

**Defer to v3+:**
- Per-project detail pages — case study format; requires writing time
- Dynamic OG images via `@vercel/og` — significant complexity for a 4-page static site
- Blog — explicitly out of scope per PROJECT.md

**Anti-features to reject:** GSAP/Framer Motion hero animations from scratch, full-screen video background, typing/typewriter text animation, particle effects, headshot in hero (belongs on About page), contact form with a backend service, skills percentage bars, any additional full component library (shadcn, HeroUI).

### Architecture Approach

The architecture is a fully static Next.js App Router site with three distinct layers: a design token layer (CSS custom properties in `globals.css`), a static data layer (plain JS arrays in `src/lib/data/`), and a component layer (Server Components for content rendering, Client Components isolated to interactive boundaries only). All four pages statically generate at build time — no server runtime, no database, no API calls. Data for the timeline and portfolio cards lives in `src/lib/data/timeline.js` and `src/lib/data/projects.js` and is imported into page files. Site-wide constants (name, email, nav links, social URLs) live in `src/lib/config.js` as the single source of truth consumed by layout, Navbar, Footer, and the Contact page.

**Major components:**
1. `src/app/globals.css` — `@theme` solarpunk palette + `@custom-variant dark`; every component's visual foundation
2. `src/lib/config.js` + `src/lib/data/` — static data arrays; no content duplication across components
3. `src/components/layout/Navbar.js` (Server) + `src/components/ui/NavLink.js` (Client) — multi-page nav with minimal client boundary
4. `src/components/ui/Hero.js` (Client, copy-paste from 21st.dev) — visual centerpiece of home page
5. `src/components/ui/TimelineItem.js` + `src/components/ui/ProjectCard.js` (Server) — content display components
6. `src/components/providers/ThemeProvider.js` (Client, optional) — isolates next-themes `"use client"` requirement
7. `src/app/layout.js` — root metadata, JSON-LD Person schema, layout chrome

**Key file structure additions:**
```
src/
├── app/
│   ├── about/page.js
│   ├── portfolio/page.js
│   ├── contact/page.js
│   ├── sitemap.js
│   └── robots.js
├── components/
│   ├── layout/ (Navbar.js, Footer.js)
│   ├── ui/ (Hero.js, ProjectCard.js, TimelineItem.js, NavLink.js)
│   └── providers/ (ThemeProvider.js — optional)
└── lib/
    ├── config.js
    └── data/ (projects.js, timeline.js)
```

### Critical Pitfalls

1. **`@theme inline` dark mode baked at build time** — Use the two-step pattern: raw values in `:root`/`.dark` blocks, then alias into `@theme`; test runtime toggle immediately on local dev before assuming it works. Colors must switch visually when `.dark` class is toggled — this is the verification gate.

2. **Flash of wrong theme on page load (FOWT)** — Inject a blocking inline `<script>` in `<head>` that reads localStorage and sets the `.dark` class before the browser paints; add `suppressHydrationWarning` to `<html>`; this must accompany any manual theme toggle feature.

3. **Missing `metadataBase` breaks all OG images in production** — Set `metadataBase: new URL("https://tymurbondar.com")` in root `layout.js` as the very first SEO task; without it, all OG image URLs are relative and social platforms cannot fetch them; validate with opengraph.xyz against the production URL, not localhost.

4. **`"use client"` on entire Navbar** — Extract only a `NavLink.js` Client Component for `usePathname`; the outer Navbar stays a Server Component; establish this RSC boundary from the start — refactoring later is avoidable work.

5. **21st.dev component dependency conflicts** — Read full component source before pasting; identify every import; install `framer-motion` if required; remove Tailwind `transition-*` classes from Motion-animated elements (Motion uses inline styles that conflict with class-based transitions, causing stuttery animations).

6. **Portfolio images causing CLS** — Use `next/image` with static imports (auto-detects dimensions) or `fill` with an `aspect-video` wrapper for all project screenshots; never use raw `<img>` tags; add `priority` to the first visible image on each page only.

7. **JSON-LD XSS via unescaped `<` characters** — Always apply `.replace(/</g, "\\u003c")` to every `JSON.stringify(schema)` call; this is documented in the official Next.js JSON-LD guide.

---

## Implications for Roadmap

Based on the dependency chain discovered in research, the build order is strictly determined by what each phase depends on. The suggested phase structure maps directly to the Architecture research build order.

### Phase 1: Design System (Color Tokens)

**Rationale:** Every visual component in every subsequent phase depends on the `@theme` color token system. Building this first means all subsequent components use the correct classes in a single pass. Building it later requires retroactively updating classes in every component — avoidable double-work.

**Delivers:** Tailwind utility classes for all solarpunk colors (`bg-bark`, `text-canopy`, `text-emerald`, etc.); `@custom-variant dark` for future dark mode; semantic token aliases; existing pages updated to use new tokens instead of interim `bg-gray-900` / `text-gray-*` classes.

**Addresses:** Solarpunk color palette (table stakes foundation), dark/light mode foundation (semantic token layer ready for Phase 6)

**Avoids pitfalls:** `@theme inline` baked values — test runtime toggling immediately; token naming conflicts — use unique names (`forest`, `bark`, `canopy`) that do not shadow Tailwind defaults

**Research flag:** Standard Tailwind v4 patterns — HIGH confidence, no deeper research needed

---

### Phase 2: Layout Infrastructure

**Rationale:** Pages import from layout components. The Navbar must have all 4 nav links before any new pages are created so navigation works immediately once routes exist. `lib/config.js` must be the single source of truth for nav links, social URLs, and site constants before Footer, Navbar, and metadata all independently need them.

**Delivers:** `src/lib/config.js` with site constants; `Navbar.js` moved to `src/components/layout/` with multi-page links and RSC boundary; `Footer.js` moved and importing from config; imports updated in `layout.js`

**Addresses:** Multi-page navigation (table stakes), active page indicator, footer social link consistency

**Avoids pitfalls:** `"use client"` on entire Navbar — establish `NavLink.js` Client Component boundary here at origin, not in a later refactor

**Research flag:** Standard Next.js App Router patterns — HIGH confidence, no deeper research needed

---

### Phase 3: Hero Component

**Rationale:** The home page is the first thing visitors see and defines the visual identity of the portfolio. With the design system in place (Phase 1), adapting the hero's classes is a single pass. Doing this before content pages means any visual adjustments to the solarpunk aesthetic are calibrated before they cascade.

**Delivers:** 21st.dev hero component integrated at `src/components/ui/Hero.js`; Tailwind classes adapted to solarpunk tokens; imported into `src/app/page.js` as a Client Component nested cleanly within a Server Component page

**Addresses:** 21st.dev hero (primary visual differentiator), solarpunk visual identity, hero CTA buttons

**Avoids pitfalls:** 21st.dev dependency audit — read full component source first; install framer-motion if needed; remove conflicting Tailwind `transition-*` classes from Motion-animated elements

**Research flag:** MEDIUM confidence — specific component selection determines dependencies. A brief 5-minute dependency audit (reading the component source before pasting) is required during planning. The copy-paste integration model itself is HIGH confidence.

---

### Phase 4: Content Pages

**Rationale:** About, Portfolio, and Contact pages can only be built after the design system and navigation exist. About comes before Portfolio because it has no image complexity (validates the data-in-lib pattern before adding image handling). Portfolio comes before Contact because it is the most technically complex. Contact is trivially simple and closes the phase.

**Delivers:**
- `src/lib/data/timeline.js` + `src/components/ui/TimelineItem.js` + `src/app/about/page.js` (vertical alternating CSS-only timeline with tech tags)
- `src/lib/data/projects.js` + project images in `public/images/projects/` + `src/components/ui/ProjectCard.js` + `src/app/portfolio/page.js` (3 project cards with hover overlay)
- `src/app/contact/page.js` (styled email CTA + labeled social links)

**Addresses:** Career timeline, portfolio project cards, contact page (all P1 table stakes)

**Avoids pitfalls:** Portfolio image CLS — use static imports or `fill` + `aspect-video` wrapper; never raw `<img>` tags

**Research flag:** Standard patterns — HIGH confidence across all three pages. Portfolio images require attention to `next/image` props; well-documented.

---

### Phase 5: SEO

**Rationale:** SEO metadata wraps all existing pages — unique descriptions and titles can only be written once the pages exist and their content is final. `metadataBase` is the critical first task within this phase; all OG image URLs depend on it being set before any images are referenced.

**Delivers:** `metadataBase` in root layout; unique title/description per page; OG tags; JSON-LD Person schema (with XSS escape); favicon + apple-touch-icon (file-based in `src/app/`); `src/app/sitemap.js`; `src/app/robots.js`

**Addresses:** Full SEO coverage, JSON-LD Person schema for Google and AI search engines, sitemap.xml, robots.txt

**Avoids pitfalls:** Missing `metadataBase` — set first, validate production URL with opengraph.xyz; JSON-LD XSS — `.replace(/</g, "\\u003c")`; static `public/sitemap.xml` blocking generated version — use only the `app/sitemap.js` file convention

**Research flag:** Standard Next.js 15 patterns — HIGH confidence across all SEO tasks. No deeper research needed.

---

### Phase 6: Dark Mode Toggle (Optional)

**Rationale:** Dark mode is a nice-to-have per PROJECT.md. It is isolated from all other phases — the `@custom-variant dark` defined in Phase 1 means adding the toggle is purely additive. Building last ensures zero rework risk. If time-constrained, system preference detection (via `prefers-color-scheme` media query) is zero-code and requires no npm package.

**Delivers:** `next-themes` install; `src/components/providers/ThemeProvider.js`; ThemeToggle button in Navbar with `mounted` guard; `suppressHydrationWarning` on `<html>`; blocking inline script for FOWT prevention

**Addresses:** Dark/light mode toggle with localStorage persistence and system preference fallback

**Avoids pitfalls:** FOWT — blocking inline `<script>` in `<head>` before first paint; ThemeProvider SSR errors — Client Component wrapper in `providers/`; hydration mismatch on ThemeToggle — `mounted` guard before rendering toggle UI

**Research flag:** Standard patterns — HIGH confidence. `next-themes` is the dominant Next.js dark mode solution and its integration with Tailwind v4 is well-documented.

---

### Phase Ordering Rationale

- **Tokens before components:** Color tokens are a hard dependency for every component. There is no safe way to build components before tokens exist without doing all the styling work twice.
- **Layout before pages:** Pages import layout components. Nav links must exist before routes are created — otherwise navigation is broken for the first several builds.
- **Hero before content pages:** Establishes the visual baseline. Any design system calibrations happen here before they propagate to other pages.
- **Content pages in complexity order:** About (simplest — no images) validates the data-in-lib pattern; Portfolio (images and hover states) applies the pattern under more complex conditions; Contact (static) closes the phase quickly.
- **SEO last in v2.0 core:** Metadata requires all pages to exist; unique descriptions are written against finalized page content.
- **Dark mode isolated and optional:** Zero dependency on any other phase after Phase 1; purely additive; can be deferred indefinitely without blocking anything else.

### Research Flags

Phases needing extra attention during planning:
- **Phase 3 (Hero):** Component selection at planning time requires reading the specific 21st.dev component's source code to identify dependencies before pasting. This is a brief audit during planning, not a research task — but it must happen before implementation begins.

Phases with well-established patterns (no deeper research needed):
- **Phase 1 (Design System):** Tailwind v4 `@theme` is thoroughly documented with official sources; OKLCH color notation is Tailwind's own recommendation
- **Phase 2 (Layout):** Next.js App Router RSC boundaries are standard, well-documented patterns
- **Phase 4 (Content Pages):** CSS timeline, `next/image` with static imports, static contact page — all well-documented in official sources
- **Phase 5 (SEO):** Next.js 15 metadata API is fully documented; official docs are the sufficient reference
- **Phase 6 (Dark Mode):** `next-themes` + Tailwind v4 combination has multiple high-quality guides matching official docs

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All recommendations verified against official Next.js 15 and Tailwind v4 documentation updated 2026-02-27; zero ambiguity on package requirements; minimum install for v2.0 is zero new packages |
| Features | HIGH | SEO and navigation patterns from official docs; portfolio, timeline, and contact patterns consistent across 10+ sources; solarpunk-specific aesthetics are MEDIUM (niche, fewer authoritative references) but design decisions are clear |
| Architecture | HIGH | File structure, RSC boundaries, data flow, and component responsibilities all verified against official Next.js App Router patterns; dark mode architecture corroborated by multiple community sources matching official docs |
| Pitfalls | HIGH | All 7 critical pitfalls identified with specific prevention strategies; all sourced from official Next.js and Tailwind v4 docs or directly corroborated against them |

**Overall confidence: HIGH**

### Gaps to Address

- **21st.dev specific component:** The exact hero component is not selected in research. Selection happens during Phase 3 planning. The copy-paste integration model is HIGH confidence; the specific component's dependencies (framer-motion or not) are unknown until selection. Resolution: choose a component during phase planning, read its full imports, install only what is actually needed.

- **Solarpunk token values:** Two research files propose slightly different color scales (STACK.md uses a forest-named scale; FEATURES.md uses a surface/accent/warm-secondary semantic approach). Both are consistent in hue direction. The FEATURES.md token set is more semantically structured and should be the canonical reference; ARCHITECTURE.md's named approach (forest/bark/canopy) provides the naming convention. Resolution: reconcile during Phase 1 planning into a single authoritative token set.

- **Project images:** Actual screenshots for rover-team.jpg and spelling-bee.jpg need to be captured and placed in `public/images/projects/` before Phase 4 can complete. This is a content dependency, not a technical uncertainty.

- **Social profile exact URLs:** The JSON-LD schema and `lib/config.js` need confirmed GitHub, LinkedIn, and Telegram profile URLs. ARCHITECTURE.md references `TymurBondar` for GitHub and `/tymurbondar` for LinkedIn — verify exact usernames before Phase 5 SEO work.

---

## Sources

### Primary (HIGH confidence — official documentation)
- [Tailwind CSS v4 Colors / @theme Directive](https://tailwindcss.com/docs/colors) — `@theme` syntax, OKLCH recommendation
- [Tailwind CSS v4 Dark Mode](https://tailwindcss.com/docs/dark-mode) — `@custom-variant dark` replacing `darkMode: "class"`
- [Next.js Metadata and OG Images](https://nextjs.org/docs/app/getting-started/metadata-and-og-images) — metadata export, file conventions; last updated 2026-02-27
- [Next.js generateMetadata API Reference](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) — full metadata fields
- [Next.js JSON-LD Guide](https://nextjs.org/docs/app/guides/json-ld) — plain script tag pattern, XSS escape
- [Next.js sitemap.xml File Convention](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)
- [Next.js robots.txt File Convention](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots)
- [Next.js App Icons File Convention](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons) — last updated 2026-02-27
- [Next.js Image Component API Reference](https://nextjs.org/docs/app/api-reference/components/image) — sizes, placeholder, priority props
- [Next.js usePathname Docs](https://nextjs.org/docs/app/api-reference/functions/use-pathname)
- [Next.js Server and Client Components Guide](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- [next-themes GitHub](https://github.com/pacocoursey/next-themes) — v0.4.6 current

### Secondary (MEDIUM confidence — community sources corroborating official docs)
- [Dark Mode in Next.js 15 + Tailwind v4 — sujalvanjare.com](https://www.sujalvanjare.com/blog/dark-mode-nextjs15-tailwind-v4)
- [Theming in Tailwind CSS v4 — Medium/Ramin Yavari](https://medium.com/@sir.raminyavari/theming-in-tailwind-css-v4-support-multiple-color-schemes-and-dark-mode-ba97aead5c14)
- [21st.dev Hero Components](https://21st.dev/community/components/s/hero) — 73+ components; copy-paste model confirmed
- [OKLCH for Design Tokens — Evil Martians](https://evilmartians.com/chronicles/better-dynamic-themes-in-tailwind-with-oklch-color-magic)
- [Portfolio best practices — Colorlib 2026](https://colorlib.com/wp/developer-portfolios/), [SiteBuilderReport 2026](https://www.sitebuilderreport.com/inspiration/engineer-portfolios)
- [RSC Performance Pitfalls — LogRocket](https://blog.logrocket.com/react-server-components-performance-mistakes)
- [Active nav links in Next.js App Router — spacejelly.dev](https://spacejelly.dev/posts/how-to-style-active-links-in-next-js-app-router)
- [Tailwind v4 @theme Discussion — GitHub](https://github.com/tailwindlabs/tailwindcss/discussions/18471)

---
*Research completed: 2026-03-03*
*Ready for roadmap: yes*
