# Project Research Summary

**Project:** Personal Portfolio Website Modernization (Tymur Bondar)
**Domain:** Software engineer personal portfolio — Next.js modernization
**Researched:** 2026-03-02
**Confidence:** HIGH (stack and architecture from official docs; features and pitfalls from multiple corroborating sources)

## Executive Summary

This project is a focused modernization of an existing Next.js 14 portfolio, not a greenfield build. The site already has the right structure (App Router, 4-page multi-page layout, Vercel hosting), but carries three forms of technical debt that undermine its professional credibility: DaisyUI coupling throughout the component tree, stale content referencing the wrong location and employer history, and boilerplate metadata left over from `create-next-app`. The modernization goal is clean, fast, and self-contained — no CMS, no blog, no backend.

The recommended approach is to upgrade to Next.js 15 with React 19 and Tailwind CSS v4, remove DaisyUI completely and replace its semantic classes with explicit Tailwind utilities, update all content to reflect Toronto/Purdue/Spelling Bee of Canada/current role, and drop in one 21st.dev hero component as the visual centerpiece. CI/CD is scoped to a GitHub Actions lint gate plus Vercel's native git integration for zero-config auto-deploy. The `lib/data/` pattern for separating content from components is the key architectural decision for long-term maintainability.

The primary risk is the DaisyUI removal: it is not just a plugin removal but a behavior replacement, because DaisyUI's dropdown and mobile menu components use CSS-only focus tricks that will silently break after the plugin is removed. The correct mitigation is to audit every DaisyUI class before removing the plugin, replace interactive components with React state, and only remove DaisyUI as the final cleanup step after a full visual pass. Secondary risks are stale metadata shipping to production and the 21st.dev hero component's CSS variables conflicting with the custom Tailwind palette — both are low-effort to prevent if addressed in the right phase order.

---

## Key Findings

### Recommended Stack

The stack stays conservative and builds on what already works. Next.js 15 is the right upgrade target (not v16, which has breaking async API changes harder to retrofit onto an existing codebase). React 19 is required by Next.js 15's App Router. Tailwind CSS v4 replaces both Tailwind v3 and DaisyUI — its CSS-first `@theme` block in `globals.css` directly replaces `tailwind.config.js` theme extensions, and its built-in Lightning CSS autoprefixer eliminates the `autoprefixer` PostCSS dependency. ESLint 9 with flat config (`eslint.config.mjs`) is the 2025/2026 standard and is worth adopting now since Next.js 16 removed `next lint` entirely.

Vercel's native GitHub integration handles all deployment — no GitHub Actions deploy step needed. GitHub Actions is used only for the lint gate on push to main. The 21st.dev hero is a copy-paste component installed into `app/components/ui/Hero.js`, not an npm package.

**Core technologies:**
- **Next.js 15.x** — React framework, routing, SSG — safer upgrade than v16 for an existing codebase; CVE patch from v14
- **React 19.x** — UI rendering — required by Next.js 15 App Router
- **Tailwind CSS 4.2.1** — styling — replaces DaisyUI and autoprefixer; CSS-first `@theme` config; built-in Lightning CSS
- **@tailwindcss/postcss 4.2.1** — PostCSS integration — required alongside tailwindcss for Next.js
- **ESLint 9 (flat config)** — linting — future-proof; Next.js 16 already removed `next lint`
- **Vercel native git integration** — hosting + deploy — zero config, auto-deploys on push to main
- **GitHub Actions (lint only)** — CI gate — runs `eslint .` before merging; no deploy logic needed here
- **21st.dev hero component (copy-paste)** — hero section — no npm install; paste into `components/ui/Hero.js`

**Critical version requirement:** `tailwindcss` and `@tailwindcss/postcss` must always be the same version — they are released together.

### Expected Features

The 4-page structure (Home, About, Portfolio, Contact) already exists and is the right shape. v1 is about filling it with accurate content and professional polish, not adding new pages.

**Must have (table stakes — P1 for launch):**
- Hero section — name, title, 1-liner bio, CTA to projects and contact
- Projects showcase — Fretly leads (published app, rare at junior level) + 2-3 additional projects; each with tech tags, GitHub link, live link
- About page — brief story, career timeline (Binghamton → Purdue, NYC → Toronto, Spelling Bee of Canada internship, IT & Digital Marketing role), headshot
- Contact section — Formspree/EmailJS form (no backend) + email link + GitHub/LinkedIn/Telegram
- Downloadable PDF resume — linked from nav or hero CTA
- Skills section — grouped by category, tag-style, no percentage bars
- Responsive design — mobile-first; tested on real devices
- Basic SEO — unique title + description per page, Open Graph tags, favicon
- Footer — social links already exist; ensure GitHub/LinkedIn/Telegram are prominent

**Should have (P2 — add after launch):**
- Dark/light mode toggle — high value; requires DaisyUI removal complete and CSS custom properties design system solid first
- JSON-LD structured data (Person schema) — low effort, high SEO value
- Smooth scroll and subtle transitions — polish layer after content is finalized
- Custom 404 page — 30-minute task; personality signal
- Open Graph preview image — static image for link sharing

**Defer (v2+):**
- Blog — out of scope per PROJECT.md; requires sustained content commitment before building
- Project case studies (full per-project pages) — valuable but write-intensive; content doesn't exist yet
- Testimonials — defer until quotes are collected from Spelling Bee manager or Fretly collaborators

**Anti-features to reject outright:** Skills progress bars (meaningless percentages), 3D hero (heavy bundle, wrong aesthetic), CMS (overkill for static solo content), full analytics dashboard visible to users, infinite scroll on projects.

### Architecture Approach

The architecture is a fully static Next.js App Router site: all pages are Server Components by default, statically generated at build time, served from Vercel's CDN edge with no runtime server. The only Client Component is `Navbar` (mobile menu toggle state). There is no global state — all content flows from plain JS data files in `lib/data/` imported directly into Server Component pages.

The defining architectural decision is the **data-in-lib pattern**: project descriptions, career timeline entries, and site constants (name, email, social URLs) live in `lib/data/projects.js`, `lib/data/timeline.js`, and `lib/config.js`. Page components import from these files and map entries to display components. This keeps content updates isolated from layout code — critical for a portfolio that needs regular updates.

**Major components:**
1. `app/layout.js` (Server Component) — root layout wrapping all pages; exports metadata; renders Navbar + Footer
2. `components/layout/Navbar.js` (Client Component) — only component needing `'use client'`; manages mobile menu state with `useState`
3. `components/ui/Hero.js` — 21st.dev copy-paste component; drop in here; may declare `'use client'` if it uses animations
4. `components/ui/ProjectCard.js` (Server Component) — receives project data as props; purely presentational
5. `components/ui/TimelineItem.js` (Server Component) — renders single career milestone
6. `lib/data/projects.js` — plain JS array of project objects; the only place to edit when adding a project
7. `lib/data/timeline.js` — plain JS array of career milestones; single source of truth for About page
8. `lib/config.js` — site constants (name, email, social URLs, nav structure); imported everywhere; never duplicated

### Critical Pitfalls

1. **DaisyUI behavior classes silently break after plugin removal** — DaisyUI's `dropdown`, `dropdown-content`, `menu-sm` use CSS-only focus tricks. The mobile nav will stop functioning entirely. Mitigation: audit every DaisyUI class name before removing the plugin; rebuild Navbar mobile menu with React `useState` + click handler; only remove DaisyUI as the final step after visual verification.

2. **DaisyUI CSS variables left behind in markup** — Classes like `bg-base-100`, `bg-base-300` resolve to transparent after plugin removal, causing invisible backgrounds and layout collapse. Mitigation: grep for all DaisyUI semantic classes (`bg-base-`, `btn`, `navbar`, `menu`, `dropdown`, `hero`, `timeline`) and replace with explicit Tailwind utilities before removing the plugin.

3. **Stale metadata ships to production** — Current `layout.js` has `description: "Generated by create next app"`. Without fixing `metadataBase` and per-page metadata, LinkedIn shares will show embarrassing boilerplate. Mitigation: set `metadataBase` in root layout immediately; write unique title and description per page; verify via `opengraph.xyz` before launch.

4. **Outdated content erodes professional credibility** — Site currently says "New York BASED" and references NYC. Mismatches with actual situation (Toronto, Purdue, Spelling Bee of Canada) are noticed by any recruiter who cross-references with LinkedIn. Mitigation: treat content update as Phase 1, not a finishing step.

5. **21st.dev hero CSS variables conflict with custom Tailwind palette** — 21st.dev components use shadcn-style CSS variables (`--background`, `--foreground`, `--primary`). Without defining matching variables, the hero will look visually inconsistent. Mitigation: inspect the hero component's CSS variable requirements before styling the rest of the site; define variables in `globals.css` `:root` first.

---

## Implications for Roadmap

Based on combined research, the dependencies are clear: content and DaisyUI removal must come first because they create the stable foundation that all styling and feature work builds on. The Tailwind v4 and Next.js upgrades are mechanical (codemod-assisted) and can run alongside the first phase. The hero component integration comes after the design system is established. CI/CD is a one-time setup with no phase dependency.

### Phase 1: Foundation — Content Audit, DaisyUI Removal, Stack Upgrade

**Rationale:** Content staleness and DaisyUI coupling are the two highest-risk issues. Fixing content first ensures no styling work is done on incorrect copy. Removing DaisyUI before any new styling prevents confusion about which classes are active. The Next.js 15 + Tailwind v4 upgrade is codemod-assisted and creates the clean baseline everything else builds on.

**Delivers:** A site with correct, accurate content; no DaisyUI dependency; upgraded to Next.js 15 + React 19 + Tailwind v4; Navbar rebuilt with React state.

**Addresses:** Hero section (placeholder), About page content, footer social links (already exist), responsive foundation.

**Avoids:** DaisyUI CSS variable ghost classes breaking layouts; outdated content launching into production; Tailwind v4 conflicts with DaisyUI if both are present.

**Key tasks:**
- Update location, university, employer, timeline entries across all pages
- Audit and replace all DaisyUI class names with Tailwind utilities
- Rebuild Navbar mobile menu with `useState` + click handler
- Remove DaisyUI from dependencies only after full visual check
- Run `npx @next/codemod@canary upgrade latest` for Next.js 15 migration
- Migrate to Tailwind v4: `npm uninstall tailwindcss daisyui autoprefixer && npm install -D tailwindcss@latest @tailwindcss/postcss@latest`
- Convert `globals.css` to `@import "tailwindcss"` + `@theme` block

### Phase 2: Structure and Architecture

**Rationale:** Before adding content, establish the `lib/data/` pattern to ensure all subsequent content work goes into the right files. Setting up the data layer and component structure first means every future content change is a one-line edit in a data file, not a search through JSX.

**Delivers:** Clean project structure with `lib/data/projects.js`, `lib/data/timeline.js`, `lib/config.js`; `components/layout/` and `components/ui/` separation established; root layout metadata configured with correct `metadataBase`.

**Addresses:** Projects showcase (data structure), career timeline (data structure), SEO metadata base layer.

**Avoids:** Hardcoded content in page JSX (anti-pattern); duplicate social URLs and site constants scattered across components; missing `metadataBase` causing OG images to break as relative URLs in production.

**Key tasks:**
- Create `lib/data/projects.js` with Fretly + additional projects
- Create `lib/data/timeline.js` with career milestones
- Create `lib/config.js` with site name, email, social URLs, nav structure
- Wire ProjectCard and TimelineItem components to data files
- Set `metadataBase` in root layout; configure title template

### Phase 3: Visual Design and Hero Integration

**Rationale:** Once DaisyUI is removed and the data layer is set, establish the design system (color palette, typography, spacing) in Tailwind's `@theme` block before integrating the 21st.dev hero — this prevents CSS variable conflicts.

**Delivers:** Consistent visual design across all pages; 21st.dev hero component integrated and matching site palette; image optimization using `next/image` throughout; responsive layout verified on mobile.

**Addresses:** Hero section (primary differentiator), responsive design (table stakes), performance (LCP, CLS from image optimization).

**Avoids:** 21st.dev hero CSS variables conflicting with site palette; raw `<img>` tags causing CLS layout shift and poor LCP; DaisyUI-specific spacing or sizing bleeding into new components.

**Key tasks:**
- Define color palette, typography, and spacing in `globals.css` `@theme` block
- Identify CSS variables required by chosen 21st.dev hero component; define them in `:root`
- Drop in hero component into `components/ui/Hero.js`
- Replace all `<img>` with `next/image` with explicit `width`/`height` or `fill`; add `priority` to hero image
- Test on real mobile device (not just browser resize)

### Phase 4: Content Polish and SEO

**Rationale:** After structure and design are stable, fill in the content details and SEO layer. Meta tags require final page content to write accurately — they should be the last step, not the first.

**Delivers:** Unique page titles and descriptions per page; Open Graph tags verified via `opengraph.xyz`; JSON-LD Person schema; contact section with Formspree form; PDF resume linked; skills section finalized.

**Addresses:** All table-stakes SEO (unique titles, descriptions, OG tags); contact form (Formspree/EmailJS — no backend); downloadable PDF resume; skills section.

**Avoids:** "Generated by create next app" shipping to production on LinkedIn share; OG images as broken relative URLs; missing `robots.txt` and `sitemap.xml` blocking Google indexing.

**Key tasks:**
- Write unique `title` and `description` for each page
- Add `og:title`, `og:description`, `og:image`, `twitter:card` metadata
- Add `robots.ts` and `sitemap.ts` (Next.js serves at correct paths automatically)
- Add JSON-LD Person schema block to layout
- Integrate Formspree or EmailJS for contact form (no backend)
- Link PDF resume from nav and/or hero CTA
- Verify all metadata via LinkedIn post inspector and `opengraph.xyz`

### Phase 5: CI/CD and Launch Verification

**Rationale:** CI/CD is a one-time setup with no content dependency, but it is placed last because the lint gate should run against final code to catch real issues, not noise from migration churn.

**Delivers:** GitHub Actions lint workflow on push to main; confirmed Vercel native git integration (not both simultaneously); launch checklist verified.

**Addresses:** Essential CI/CD (per PROJECT.md scope); double-deploy prevention; mobile nav verification; Lighthouse performance check.

**Avoids:** GitHub Actions deploy running alongside Vercel native integration (double-deploy); lint job using `next build` instead of `eslint .` (lint errors swallowed); CI workflow that includes a Vercel deploy step unnecessarily.

**Key tasks:**
- Create `.github/workflows/ci.yml` with lint job only (no deploy)
- Confirm Vercel's native git integration is handling deploy (not GitHub Actions)
- Run full "looks done but isn't" checklist: mobile nav, OG tags, image CLS, Lighthouse score, single deploy per push
- Confirm zero mentions of "New York" or "NYC" anywhere in codebase

### Phase 6: Post-Launch Polish (v1.x)

**Rationale:** These features are high-value but require the v1 foundation to be stable first. Dark mode in particular requires DaisyUI to be fully removed and the CSS custom properties system to be solid.

**Delivers:** Dark/light mode toggle; custom 404 page; smooth scroll and subtle transitions; possibly Open Graph preview image.

**Addresses:** Dark/light mode (82% of users prefer dark; signals UX sensibility); 404 page (attention to detail signal).

**Avoids:** Dark mode implementation conflicting with any remaining DaisyUI variable references.

---

### Phase Ordering Rationale

- **Content before styling:** Stale content is the highest-credibility risk. If visual work happens on incorrect copy, the copy gets buried and forgotten.
- **DaisyUI removal before new styling:** Attempting to add new styles while DaisyUI is still present creates confusion about which CSS is active. Full removal first gives a clean palette.
- **Data layer before content fill:** If content is hardcoded into JSX before the data layer is established, migrating it later is tedious. Setting up `lib/data/` first takes 30 minutes and prevents hours of refactoring.
- **Design system before hero integration:** The 21st.dev hero requires CSS variables that must match the surrounding design tokens. Establishing the `@theme` block first means the hero is integrated into a coherent system, not bolted on top of undefined variables.
- **Content before SEO metadata:** Meta descriptions must accurately describe page content. Writing them before content is final produces boilerplate that won't be updated.
- **CI/CD last:** The lint gate catches real errors best when run against finished code. Running it against migration churn generates noise.

### Research Flags

Phases with standard, well-documented patterns (no additional research needed):
- **Phase 1 (Foundation):** Next.js 15 upgrade is codemod-assisted with official migration guide. Tailwind v4 migration has official docs. DaisyUI class inventory is already compiled in PITFALLS.md.
- **Phase 3 (Visual Design):** Tailwind v4 `@theme` configuration is well-documented. `next/image` API is stable and officially documented.
- **Phase 5 (CI/CD):** GitHub Actions lint-only workflow is straightforward. Vercel native git integration is well-documented.

Phases that may benefit from deeper research during planning:
- **Phase 3 (21st.dev hero integration):** The specific component chosen by Tymur will determine which CSS variables are needed and whether it requires `'use client'`. Research depends on the actual component selection.
- **Phase 4 (contact form):** Formspree vs. EmailJS trade-offs (rate limits, pricing, spam protection) may need validation at implementation time based on Tymur's preference.

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All recommendations verified against official Next.js, Tailwind CSS, and Vercel docs. npm registry versions confirmed 2026-03-02. |
| Features | MEDIUM-HIGH | Patterns consistent across 10+ authoritative sources (CareerFoundry, BrainStation, Codecademy, DEV community reviews). Feature prioritization is well-supported. |
| Architecture | HIGH | Directly derived from official Next.js App Router documentation. Data-in-lib pattern is practitioner-validated. Component boundaries match official guidance. |
| Pitfalls | MEDIUM | Critical pitfalls are well-supported (official docs for metadata, image optimization). DaisyUI removal specifics are MEDIUM because removal scenarios are not formally documented by DaisyUI; derived from class inventory audit and CSS behavior analysis. |

**Overall confidence:** HIGH

### Gaps to Address

- **21st.dev hero component selection:** Research is generic — actual CSS variable requirements depend on the specific hero component chosen. Address during Phase 3 planning by inspecting the chosen component's source before starting integration.
- **Contact form service selection:** Formspree and EmailJS are both valid. No strong differentiator found in research. Decision can be made at Phase 4 based on current pricing and rate limits at implementation time.
- **Dark mode implementation timing:** Research confirms dark mode is high-value (P2), but the CSS custom properties scope depends on how thorough the `@theme` setup is in Phase 3. Flag for evaluation after Phase 3 is complete.

---

## Sources

### Primary (HIGH confidence)
- [Next.js v15 upgrade guide](https://nextjs.org/docs/app/guides/upgrading/version-15) — async API breaking changes, React 19 requirement, caching defaults
- [Next.js v16 upgrade guide](https://nextjs.org/docs/app/guides/upgrading/version-16) — why v15 is the right target for this project (v16 Node 20.9+ requirement, ESLint removal)
- [Tailwind CSS v4.0 announcement](https://tailwindcss.com/blog/tailwindcss-v4) — CSS-first config, @tailwindcss/postcss, performance benchmarks
- [Tailwind CSS + Next.js installation guide](https://tailwindcss.com/docs/guides/nextjs) — postcss.config.mjs setup verified
- [Next.js Official Docs: Project Structure](https://nextjs.org/docs/app/getting-started/project-structure) — App Router component boundaries
- [Next.js Official Docs: Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components) — server/client boundary patterns
- [Next.js official metadata docs](https://nextjs.org/learn/dashboard-app/adding-metadata) — metadataBase requirement, per-page overrides
- [Next.js official image docs](https://nextjs.org/docs/14/app/building-your-application/optimizing/images) — next/image, CLS prevention
- [Vercel for GitHub docs](https://vercel.com/docs/git/vercel-for-github) — native integration vs. GitHub Actions

### Secondary (MEDIUM confidence)
- [CareerFoundry: Software Engineer Portfolio Guide + 24 Examples](https://careerfoundry.com/en/blog/web-development/software-engineer-portfolio/) — table stakes features
- [BrainStation: How to Build a Software Engineer Portfolio](https://brainstation.io/career-guides/how-to-build-a-software-engineer-portfolio) — feature prioritization
- [DEV Community: 200+ portfolio reviews](https://dev.to/matthewhou/ive-reviewed-200-developer-portfolios-90-make-the-same-4-mistakes-16kd) — UX pitfalls
- [AlterSquare: Dark Mode vs Light Mode UX Guide 2025](https://altersquare.io/dark-mode-vs-light-mode-the-complete-ux-guide-for-2025/) — dark mode usage statistics
- [Shipixen: SEO Checklist for Developer Portfolios](https://shipixen.com/blog/seo-checklist-for-developer-portfolios-and-landing-pages) — SEO requirements
- [Best Practices for Organizing Next.js 15 — DEV Community](https://dev.to/bajrayejoon/best-practices-for-organizing-your-nextjs-15-2025-53ji) — project structure patterns
- npm registry: `next`, `tailwindcss`, `@tailwindcss/postcss` — versions verified 2026-03-02
- [21st.dev hero components](https://21st.dev/community/components/s/hero) — copy-paste model confirmed

### Tertiary (LOW confidence)
- [Next.js Best Practices 2026 — Serviots](https://www.serviots.com/blog/nextjs-development-best-practices) — single source, not verified against official docs; findings consistent with other sources but treat with caution
- DaisyUI removal pitfalls — removal scenario not formally documented by DaisyUI; PITFALLS.md findings derived from class inventory audit and CSS behavior analysis

---
*Research completed: 2026-03-02*
*Ready for roadmap: yes*
