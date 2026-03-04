# Feature Research

**Domain:** Software engineer personal portfolio website — v2.0 Design & Content milestone
**Researched:** 2026-03-03
**Confidence:** MEDIUM-HIGH — patterns consistent across 10+ sources; solarpunk specifics are MEDIUM (niche, fewer authoritative references); Next.js 15 SEO is HIGH (official docs corroborated)

---

## Context: What Already Exists

The v1.0 foundation is live. Research covers only NEW v2.0 features:

- **Exists:** Home page with bio, responsive Navbar (name-only), Footer with LinkedIn/Telegram/GitHub, ESLint + CI
- **Building now:** Solarpunk design system, 21st.dev hero, About page + career timeline, Portfolio page (3 projects), Contact page (email + social, no form), multi-page Navbar, full SEO

---

## Feature Landscape by Category

---

### Category 1: Hero Section

#### What makes a great portfolio hero (2026 patterns)

**Table Stakes — visitors expect these:**

| Feature | Why Expected | Complexity | Dependency on Existing Code |
|---------|--------------|------------|----------------------------|
| Name + role headline above fold | Answers "who is this?" in 3 seconds — universally expected | LOW | Exists in current Home page; needs visual upgrade |
| One-sentence positioning statement | "Software engineer focused on AI systems / Toronto" — filters right visitors fast | LOW | Replace current bio copy, no structural change |
| Primary CTA button ("View Work" or "Contact") | Directs visitor to next step; without it hero is decorative, not functional | LOW | None — add new link component |
| Responsive layout (mobile hero = stacked, not broken) | Majority of initial views are mobile; broken mobile hero = instant exit | MEDIUM | Current home page needs Tailwind v4 responsive classes verified |

**Differentiators — what separates memorable from forgettable:**

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| 21st.dev hero component (pre-selected) | Production-ready, animated, distinct without requiring custom animation code | LOW-MEDIUM | PROJECT.md decision: Claude selects component; integrates with Next.js App Router via `npm install` + copy-paste pattern; shadcn/ui-based |
| Subtle fade-in or slide-in on load | Polish signal — makes the page feel alive without being distracting | LOW | CSS `@keyframes` or Tailwind `animate-*` utilities; avoid GSAP unless already in bundle |
| Secondary CTA ("Download Resume" or "About Me") | Gives two visitor types a path — recruiters and curious visitors | LOW | Static PDF in `/public/`, simple `<a>` link |
| Solarpunk color on hero headline or accent | Distinguishes from generic dark portfolio; signals intentionality | LOW | Depends on color token system being defined first |
| Current status indicator ("Open to opportunities" or "Building AI systems") | Humanizes and provides context; top-tier portfolios include this | LOW | Static text component; update manually |

**Anti-Features — avoid these:**

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| GSAP or Framer Motion hero animations from scratch | "Impressive" and "shows skill" | Adds 50–200KB to bundle; hard to get right; distracts from content; PROJECT.md already rules out 3D/particles | Use the 21st.dev component which handles its own animation correctly |
| Full-screen video background | Cinematic feel | Kills performance; wrong aesthetic for minimal solarpunk; mobile data cost | Solid color or subtle CSS gradient with animated text |
| Typing/typewriter text animation | Shows dynamism | Overused; slows perceived load; "junior developer" signal in 2026 | Static bold headline with strong copy |
| Headshot in hero | Personal touch | For a developer brand, headshot in hero competes with the name/role message; better on About page | Move headshot to About page; keep hero typographic |
| Particle / canvas effects | "Creative developer" signal | Heavy JS payload; not appropriate for minimal solarpunk aesthetic; PROJECT.md explicitly out of scope | Emerald green accent lines or botanical SVG motifs in CSS |

**Recommendation:** Clean typographic hero — name in large weight, role/bio in muted color, two CTA buttons, subtle fade-in. The 21st.dev component provides the visual distinction. No additional animation library needed.

---

### Category 2: Career Timeline (About Page)

#### Patterns for displaying Purdue, Spelling Bee, IT & DM role

**Table Stakes:**

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Chronological order (most recent first) | Standard resume convention; recruiters scan newest experience first | LOW | Reverse-chron: IT & DM role → Spelling Bee internship → Binghamton Rover Team → Purdue |
| Date ranges for each entry | Without dates, timeline reads as a list, not a career story | LOW | "Jun 2025 – Aug 2025" format |
| Role title + organization per entry | Core identification — what and where | LOW | "Frontend Developer — Spelling Bee of Canada" |
| Brief description (1–2 sentences) | Context on what was done and why it matters | LOW | Avoid bullet lists; prose reads more personal on an About page |
| Responsive (stacks on mobile) | Mobile visitors must read without horizontal scroll | MEDIUM | Vertical timeline collapses naturally; horizontal timeline requires JS |

**Differentiators:**

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Vertical alternating layout | Cleaner than a plain list; creates visual rhythm; scroll-friendly; works perfectly on mobile | LOW-MEDIUM | CSS only — left-aligned connector line with alternating left/right content blocks; Tailwind utilities |
| Icon or category tag per entry | Instant visual classification ("Education", "Work", "Project") without reading text | LOW | Simple SVG icon or color-coded pill; Tailwind colors |
| Highlight key tech per entry | Reinforces skills without a separate skills section; directly tied to real experience | LOW | Tech tags (pill badges) within each timeline item |
| Subtle scroll-reveal animation | Makes timeline feel progressive; each item appearing as you scroll creates narrative pacing | MEDIUM | CSS `@keyframes` with `IntersectionObserver` — no library needed in Next.js 15; adds ~20 lines of JS |

**Anti-Features:**

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Horizontal scrolling timeline | "Unique" and "creative" | Breaks on mobile without complex JS; hidden content = missed information; requires carousel logic | Vertical alternating layout — all content visible, scroll-friendly |
| Interactive click-to-expand timeline | Shows "interactivity skill" | Hides information behind clicks; recruiters want scannable, not interactive; adds React state complexity | Short (2-sentence) descriptions visible by default |
| Animation-heavy timeline (GSAP sequences) | Impressive technically | Delays information display; wrong tone for professional portfolio | CSS scroll-reveal only |

**Recommendation:** Vertical alternating timeline (pure CSS + Tailwind). Center line, alternating left/right content cards. Each card: date, role, organization, 1–2 sentence description, 2–3 tech tags. Subtle opacity fade-in on scroll via `IntersectionObserver`. No external library. This is the pattern used by top-cited portfolios (Brittany Chiang style) and maps cleanly to Tailwind v4 utilities.

**Info to include per entry (Tymur's data):**
1. IT & Digital Marketing Specialist — [current employer] | ongoing
2. Frontend Developer — Spelling Bee of Canada | Jun 2025 – Aug 2025
3. Software Engineer (Rover Team) — Binghamton University | Aug 2024 – May 2025
4. CS Student — Purdue University (online) | ongoing
5. Relocated to Toronto — personal milestone worth mentioning for context

---

### Category 3: Portfolio Project Cards

#### Image handling, hover effects, description length for 3 projects

**Table Stakes:**

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Project name + 1-sentence description | Without this, card is just an image | LOW | "YOLOv5 object recognition model for autonomous rover navigation" |
| Tech stack tags | Recruiters keyword-scan; confirms skills are real | LOW | Pill badges; 3–5 tags per project |
| GitHub link | Expected for all open-source or student projects | LOW | Icon link, opens in new tab |
| Live link (where applicable) | Proves it's real and functional | LOW | Spelling Bee of Canada has live site; Rover Team may not; this website is its own demo |
| Consistent card aspect ratio | Cards that vary in height create messy grids | MEDIUM | CSS aspect-ratio or fixed min-height; all cards same height in a row |

**Differentiators:**

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Project screenshot / image | Visual proof of output; cards with images get significantly more engagement | LOW-MEDIUM | Rover Team has images (YOLOv5 detections); Spelling Bee = screenshot of site; this site = screenshot of itself |
| Hover overlay revealing description | Keeps card grid clean; description revealed on interaction feels modern and intentional | MEDIUM | CSS only: `overflow-hidden` container, `translate-y` or opacity transition on overlay `<div>` |
| Emerald green accent on hover (border or overlay tint) | Reinforces solarpunk palette; distinctive vs generic white hover states | LOW | `hover:border-emerald-400` or overlay with `bg-emerald-900/80` |
| Role clarification ("Led ML pipeline" vs "Contributed to frontend") | Context that resume doesn't give; shows self-awareness of contribution level | LOW | One sentence in card description |
| "Featured" or ordered by impact | Not all 3 projects are equal; ordering signals which you're most proud of | LOW | Rover Team ML work is strongest technical signal; list first |

**Anti-Features:**

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Elaborate card flip animation | "Impressive UX" | Disorienting; hides content behind interaction; mobile touch conflict | Simple overlay or border color change on hover |
| Long descriptions on card (3+ sentences) | "More context" | Cards are scannable — long text defeats the grid's purpose | 1-sentence on card; full description on project detail page (future v2.1) |
| Video autoplay in cards | Dynamic and engaging | Autoplay video = instant accessibility and performance problem; mobile data cost | Static screenshot; link to video in project detail |
| "Lazy load with placeholder blur" for every image | Performance optimization | Adds complexity for 3 images; overkill | Use `next/image` with `priority` on first card; default lazy loading on rest |

**Image handling specifics (Next.js):**
- Use `next/image` for all project images — automatic optimization, WebP conversion, lazy loading
- Rover Team: real YOLOv5 detection screenshots (high technical signal — use them)
- Spelling Bee of Canada: screenshot of spellingbeeofcanada.ca (the work is live — screenshot proves it)
- This website: screenshot of the site itself (meta and interesting; self-referential)
- Aspect ratio: 16:9 for all project images for consistency; crop to fit with `object-cover`
- Store in `/public/projects/` directory; filenames: `rover-team.jpg`, `spelling-bee.jpg`, `personal-site.jpg`

**Description length:**
- Card: 1 sentence (20–30 words max)
- Full project description (card expanded or future detail page): 3–4 sentences covering problem, your role, tech, outcome

---

### Category 4: Contact Section (No Form)

#### Email + social links without a backend form service

**Table Stakes:**

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Clickable email address (`mailto:`) | Direct, universal, no dependencies | LOW | `<a href="mailto:tymur@example.com">` — works everywhere; obfuscate to reduce spam scraping |
| LinkedIn link | Professional standard; recruiters go here first | LOW | Already in footer; repeat prominently on contact page |
| GitHub link | Expected for any developer | LOW | Already in footer; repeat on contact page |
| Inviting headline / copy | "Let's connect" or "Get in touch" — frames the page as welcoming | LOW | Avoid corporate "Contact Us"; be personal |
| Response expectation | "I reply within 24-48 hours" — sets expectation, shows responsiveness | LOW | One short sentence |

**Differentiators:**

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Telegram link (already in footer) | Unusual for a portfolio — signals Tymur's real preferred communication channels; authentic | LOW | Already exists in footer; surface it prominently on Contact page too |
| Large, styled email address | Makes the email the visual hero of the page — confident and direct | LOW | Large type, emerald green color, hover underline effect |
| Intro copy personalizing the ask | "Whether you're hiring, collaborating, or just want to talk AI systems..." | LOW | 2–3 sentences; shows personality |
| CTA to LinkedIn for professional inquiries | Some visitors prefer LinkedIn DMs; give them that path explicitly | LOW | Button or link beneath email |
| "Currently open to..." status | Honest availability signal — saves everyone's time | LOW | Static text; update manually when status changes |

**Anti-Features:**

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Contact form with name/email/message | Seems more professional | Requires Formspree/EmailJS account, API keys, environment variables; PROJECT.md explicitly rules this out ("email + social links, no form service") | Direct mailto: link — already decided |
| Social media icon-only links | Space-efficient | Icons without labels are accessibility failures; recruiters shouldn't have to hover to know what platform it is | Labeled links ("LinkedIn", "GitHub") with icon + text |
| Mailto link that opens in same window | Simple | Navigates away from the portfolio — confusing | `target="_blank"` OR use `mailto:` (opens email client, doesn't navigate away) |
| Embedding a Calendly widget | Convenient for scheduling | Overkill for a personal portfolio; implies you're a consultant booking calls | Simple email contact — if they want a call, they'll ask |

**Recommendation:** Single page, centered layout. Large name or "Say Hello." headline. 2–3 sentences of personal copy. Giant styled email address as the primary CTA. Below that: row of social links (LinkedIn, GitHub, Telegram) with icon + label. Response time note. Clean and confident — no friction, no form.

**Email spam protection without JavaScript obfuscation:** Display email as plain text but use CSS direction trick or split it visually. Or just accept it — spam filters are good in 2026 and personal portfolios don't get significant scraper traffic.

---

### Category 5: Color Palette — Solarpunk Design System

#### Green tokens, dark mode, Tailwind v4 @theme integration

**What solarpunk means for a portfolio (not a game or illustration):**
Solarpunk visual language = nature + technology coexistence, warmth, hope. For a dark developer portfolio the practical interpretation is: warm dark background (not pure black — more like deep forest/charcoal), vibrant emerald/green accents, warm gold or amber as secondary accent, high contrast text. Think "bioluminescent forest at night" not "hacker terminal."

**Table Stakes:**

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Defined color tokens in Tailwind `@theme` | Without tokens, colors are hardcoded throughout — impossible to maintain or change | LOW | CSS-first approach: `@theme { --color-* }` in `globals.css`; Tailwind v4 reads these natively |
| High contrast text on dark background | WCAG AA minimum (4.5:1 ratio) — not optional | LOW | Test with browser devtools contrast checker; oklch values make this easy to calculate |
| Consistent accent color usage | Accent used for links, CTAs, borders, highlights — not randomly throughout | LOW | Semantic token: `--color-accent` → applied consistently |
| Background not pure `#000000` | Pure black looks harsh; warm dark feels intentional | LOW | `oklch(0.12 0.02 155)` — dark with a green hint |

**Differentiators:**

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| OKLCH-based tokens (Tailwind v4 native) | Perceptually uniform; vivid in P3 displays; consistent gradient behavior | LOW | Tailwind v4 already uses OKLCH; just define custom tokens using same notation |
| Semantic token layer | `--color-accent` not `--color-emerald-400` — enables theming without touching component classes | LOW | Two-layer: raw scale (emerald 50–950) + semantic names (accent, surface, muted-text) |
| Warm amber/gold secondary accent | Solarpunk = sun + nature; adding gold as a secondary accent (for dates, tags, highlights) gives warmth and authenticity | LOW | `oklch(0.85 0.15 85)` — warm amber; use sparingly |
| Dark/light mode toggle (nice to have) | Demonstrates design system depth; 82% of users prefer dark mode | MEDIUM | Requires `[data-theme="dark"]` + `[data-theme="light"]` CSS blocks; toggle button stores preference in `localStorage`; prevent FOUC with script in `<head>` |

**Anti-Features:**

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Many green shades used throughout | "Rich palette" | Creates visual chaos; hard to maintain; no clear hierarchy | 2 greens maximum: emerald-400 for primary accent, emerald-800 for dark surfaces |
| True pure black background | "Dark mode" | Harsh contrast; no personality; not solarpunk | Warm dark: `oklch(0.12 0.02 155)` — nearly black with green warmth |
| Bright lime/neon green | "Vibrant solarpunk" | Too aggressive; cyber/hacker aesthetic, not solarpunk | Emerald/forest green family: `oklch(0.79 0.21 151)` is vibrant but not neon |
| Blue links (default browser) | Default behavior | Breaks the palette entirely | Emerald accent for all interactive elements |

**Recommended token set (Tailwind v4 `@theme`):**

```css
@theme {
  /* Surfaces — warm dark base */
  --color-surface-950: oklch(0.10 0.015 155);  /* deepest bg */
  --color-surface-900: oklch(0.14 0.018 155);  /* main page bg */
  --color-surface-800: oklch(0.20 0.022 155);  /* card bg */
  --color-surface-700: oklch(0.27 0.026 155);  /* border, divider */

  /* Accent — emerald family */
  --color-accent-300: oklch(0.87 0.15 154);   /* light text on dark */
  --color-accent-400: oklch(0.79 0.21 151);   /* primary CTA, links */
  --color-accent-500: oklch(0.72 0.22 149);   /* hover state */
  --color-accent-600: oklch(0.63 0.19 149);   /* pressed/active */

  /* Warm secondary — amber/gold */
  --color-warm-400: oklch(0.85 0.15 85);      /* dates, tags, highlights */

  /* Text */
  --color-text-primary: oklch(0.95 0.01 155); /* headlines */
  --color-text-muted:   oklch(0.65 0.04 155); /* body, descriptions */
  --color-text-faint:   oklch(0.45 0.02 155); /* metadata, dates */

  /* Semantic aliases */
  --color-bg:      var(--color-surface-900);
  --color-card:    var(--color-surface-800);
  --color-border:  var(--color-surface-700);
  --color-accent:  var(--color-accent-400);
  --color-accent-hover: var(--color-accent-500);
}
```

**Dependency:** This token set must be defined before any page or component is styled. It is the foundation of all v2.0 work.

---

### Category 6: SEO (OG Tags, JSON-LD, Sitemap)

#### What matters most for a portfolio site in Next.js 15

**Table Stakes:**

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Unique `<title>` per page | Google uses page title as primary signal; duplicate titles split ranking authority | LOW | Next.js `metadata` export per `page.js`; format: "Tymur Bondar — Portfolio" |
| `<meta name="description">` per page | 160 char max; appears in search result snippets; influences click-through rate | LOW | Unique per page; not generic "my portfolio" for every page |
| `og:title`, `og:description`, `og:image` | LinkedIn, Slack, iMessage previews — first impression before someone visits the site | LOW | Static OG image (1200x630px) in `/public/og-image.png`; same image across all pages is fine for a portfolio |
| `metadataBase` in root layout | Without this, all OG image URLs are relative → broken in social previews | LOW | `export const metadata = { metadataBase: new URL('https://tymurbondar.com') }` in `app/layout.js` |
| `canonical` URL per page | Prevents duplicate content signals if the site is ever accessed at different URLs | LOW | `alternates: { canonical: '/about' }` in each page's metadata |
| `robots.txt` | Tells crawlers which pages to index; shows up at `yourdomain.com/robots.txt` | LOW | Next.js 15: `app/robots.js` file returns config object — auto-served |
| `sitemap.xml` | Direct communication to Google about what pages exist; accelerates indexing | LOW | Next.js 15: `app/sitemap.js` file — returns array of URL objects |
| Favicon + apple touch icon | Browser tab and mobile home screen — missing = unprofessional | LOW | `/public/favicon.ico` + `/public/apple-touch-icon.png`; reference in root layout metadata |

**Differentiators:**

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| JSON-LD Person schema | Tells Google (and AI search engines like Perplexity/ChatGPT) exactly who Tymur is — enables rich results | LOW | One `<script type="application/ld+json">` in root layout; see required fields below |
| Dynamic OG image via `opengraph-image.js` | Per-page OG images with page title — higher CTR on social shares | HIGH | Use Next.js `@vercel/og` Image Response API; significant complexity for a portfolio; SKIP for v2.0, use static image instead |
| `og:type = "website"` + `og:locale` | Completeness signal; locale helps Google understand geographic relevance | LOW | Add to root layout metadata |
| Twitter/X card meta (`twitter:card = "summary_large_image"`) | Rich previews on Twitter/X specifically | LOW | 2 extra lines in metadata; include for completeness |

**Anti-Features:**

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Dynamic OG image per page | "Professional" and "higher CTR" | Requires `@vercel/og` setup, Edge runtime config, custom fonts — significant effort for 4 pages | Static 1200x630 OG image covers 90% of the value; skip dynamic for v2.0 |
| `next-sitemap` package | "Easier sitemap generation" | Adds a dependency for something Next.js 15 handles natively via `app/sitemap.js` | Native Next.js 15 `app/sitemap.js` — zero extra packages |
| Indexing `/contact` or `/about` with priority: 1.0 | "Make all pages important" | Only homepage deserves priority 1.0; equal priorities give crawlers no signal | Homepage: 1.0, About/Portfolio: 0.8, Contact: 0.6 |

**JSON-LD Person schema — required fields for Tymur:**

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Tymur Bondar",
  "jobTitle": "Software Engineer",
  "url": "https://tymurbondar.com",
  "sameAs": [
    "https://github.com/[username]",
    "https://linkedin.com/in/[username]"
  ],
  "knowsAbout": ["AI systems", "Next.js", "React", "Machine Learning"],
  "alumniOf": {
    "@type": "CollegeOrUniversity",
    "name": "Purdue University"
  },
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Toronto",
    "addressCountry": "CA"
  }
}
```

**Sitemap priority recommendations:**

| Page | Priority | changefreq |
|------|----------|------------|
| `/` (Home) | 1.0 | monthly |
| `/portfolio` | 0.9 | monthly |
| `/about` | 0.8 | monthly |
| `/contact` | 0.6 | yearly |

**Implementation note:** Next.js 15 App Router handles `sitemap.js` and `robots.js` as special files in `app/` directory — no external package needed. The `metadata` export in each `page.js` file handles OG/Twitter tags. Use `generateMetadata()` for dynamic pages; static `metadata` export for static pages.

---

### Category 7: Navigation

#### Best patterns for 4-page portfolio site

**Pages being added:** Home, About, Portfolio, Contact (multi-page Navbar is explicitly listed in PROJECT.md)

**Table Stakes:**

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Active page indicator | Without it, visitors don't know where they are | LOW | `usePathname()` from Next.js to compare current path; highlight active nav item |
| All 4 pages accessible | Missing a page in nav = that page might as well not exist | LOW | Home / About / Portfolio / Contact |
| Mobile hamburger menu | Navbar with 4 text links is fine on desktop; on mobile needs collapse/toggle | MEDIUM | React `useState` already implemented in v1.0 Navbar — extend it |
| Skip-to-content link for accessibility | Screen reader users need to bypass nav on every page | LOW | `<a href="#main" class="sr-only focus:not-sr-only">Skip to content</a>` |

**Differentiators:**

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Sticky nav (stays at top on scroll) | Allows navigation from any scroll position; expected on multi-page sites | LOW | `position: sticky; top: 0;` + slight backdrop-blur for style |
| Subtle border or backdrop on scroll | Visual feedback that nav is floating above content — polished | LOW | `IntersectionObserver` on a sentinel element OR CSS `backdrop-filter: blur()` |
| Name-as-logo links to Home | Already exists in v1.0 — keep it; acts as persistent home button | NONE | Already implemented |
| Emerald accent on active link | Reinforces color palette consistently across all pages | LOW | `border-b-2 border-accent` on active nav item |
| Smooth page transitions | Polished feel between route changes | MEDIUM | Next.js View Transitions API (experimental in Next.js 15) or simple CSS fade; skip if adds instability |

**Anti-Features:**

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Full-screen overlay hamburger menu | "Creative" and "immersive" | Blocks content; overkill for 4 links; takes longer to open/close | Simple dropdown or off-canvas slide-in for mobile |
| Navigation as a portfolio piece (custom weird nav) | Differentiate through UX | Risky — unusual nav creates confusion; unfamiliar = friction for recruiters | Lean, conventional nav; differentiate through design system and content quality |
| Dropdown menus | Organizes sub-pages | Only 4 pages total — dropdowns add complexity with no benefit at this scale | Flat 4-link nav |
| "Resume" as a nav item | Convenient | Adds a 5th nav item; better placed as a button-style CTA on About page or in hero | CTA button style within page content |

**Recommended structure:**

```
[Tymur Bondar]  ←  name/logo, links to /

                                    [About] [Portfolio] [Contact]
                                     ↑ right-aligned links
```

Mobile: hamburger toggles a simple dropdown or full-width menu below navbar. Existing `useState` toggle from v1.0 Navbar is the foundation — extend with the 3 new links.

**Active state implementation (Next.js 15):**
```jsx
'use client'
import { usePathname } from 'next/navigation'
// className includes active styles when pathname matches href
```

---

## Feature Dependencies

```
Solarpunk color tokens (@theme in globals.css)
    └──required by──> ALL components (hero, cards, timeline, nav, contact)
    └──required by──> Dark/light mode toggle (if built)

21st.dev hero component
    └──requires──> Color tokens defined first (or inline-themed)
    └──replaces──> Current plain Home page content

Multi-page Navbar
    └──requires──> About, Portfolio, Contact pages to exist (routes)
    └──builds on──> Existing v1.0 Navbar (useState toggle already there)

About page + Career timeline
    └──standalone──> No hard dependencies; CSS-only timeline
    └──enhances──> JSON-LD Person schema (alumniOf, jobTitle context)

Portfolio page (project cards)
    └──requires──> Project images in /public/projects/
    └──requires──> Color token system for hover states

Contact page
    └──standalone──> mailto: link, no backend
    └──requires──> Social links (already in footer — reuse)

SEO (OG tags + JSON-LD + sitemap)
    └──requires──> All pages built first (can't write unique descriptions for empty pages)
    └──requires──> metadataBase set in root layout (blocks all OG image URLs)
    └──favicon──> Static file in /public/ — earliest dependency, do this first

Dark/light mode (nice to have)
    └──requires──> Color token system defined with semantic layer
    └──requires──> All components use semantic tokens (not raw Tailwind colors)
    └──conflicts──> Doing this in parallel with component development (risk: components hardcode colors before tokens are set)
```

### Critical Dependency Order

1. **Color tokens FIRST** — every visual component depends on them
2. **Pages built** — About, Portfolio, Contact must exist before SEO meta can be written
3. **Images in /public/projects/** — Portfolio cards can't render without them
4. **Favicon early** — visible immediately in Vercel preview deploys; signals craft

---

## MVP Definition

### Launch With (v2.0)

- [ ] **Solarpunk color token system** — `@theme` block in `globals.css`; semantic + raw tokens; dark bg + emerald accent + warm secondary
- [ ] **21st.dev hero component on Home** — replaces current plain intro; Claude selects component during planning
- [ ] **Multi-page Navbar** — extends existing v1.0 Navbar with About/Portfolio/Contact links; active state indicator
- [ ] **About page with vertical alternating timeline** — 4–5 career entries; CSS-only; tech tags per entry
- [ ] **Portfolio page with 3 project cards** — `next/image` for screenshots; hover overlay; tech tags; GitHub + live links
- [ ] **Contact page** — styled email CTA + LinkedIn/GitHub/Telegram labeled links; no form
- [ ] **Core SEO** — `metadataBase`, unique title/description per page, OG tags, favicon, JSON-LD Person schema
- [ ] **`sitemap.js` + `robots.js`** — native Next.js 15 files; correct priorities

### Add After v2.0 Ships (v2.1)

- [ ] **Dark/light mode toggle** — requires all components using semantic tokens; add after v2.0 CSS is stable
- [ ] **Custom 404 page** — 1–2 hours; with nav back to Home and personality
- [ ] **Smooth scroll-reveal on timeline** — `IntersectionObserver`; no library; adds polish without risk

### Future (v3+)

- [ ] **Per-project detail pages** — case study format; problem/role/decisions/outcome; requires writing time
- [ ] **Dynamic OG images** — `@vercel/og`; significant effort; only worthwhile with blog or many pages
- [ ] **Blog** — explicitly out of scope per PROJECT.md

---

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Color token system | HIGH | LOW | P1 — foundation |
| Favicon | MEDIUM | LOW | P1 — do first, visible in previews |
| 21st.dev hero | HIGH | LOW-MEDIUM | P1 |
| Multi-page Navbar | HIGH | LOW | P1 |
| About page + timeline | HIGH | LOW-MEDIUM | P1 |
| Portfolio page (project cards) | HIGH | MEDIUM | P1 |
| Contact page | HIGH | LOW | P1 |
| OG tags + JSON-LD + sitemap | MEDIUM | LOW | P1 — last, needs pages first |
| Dark/light mode toggle | MEDIUM | MEDIUM | P2 |
| Scroll-reveal on timeline | LOW | LOW | P2 |
| Custom 404 page | LOW | LOW | P2 |
| Dynamic OG images | LOW | HIGH | P3 — skip for v2.0 |
| Project detail pages | HIGH | HIGH | P3 — v3 |

---

## What Separates Forgettable from Memorable

Based on reviewing top-tier developer portfolios (Brittany Chiang, Tamal Sen, Cassidy Williams, and engineering portfolio studies from Colorlib and SiteBuilderReport):

**Forgettable portfolios:**
- Generic dark portfolio with template-looking layout
- No clear sense of who the person is beyond tech stack
- Projects described by tech, not by impact or problem solved
- Contact page is literally just a form
- Navigation has no personality

**Memorable portfolios:**
- Design system feels intentional and personal (the solarpunk aesthetic is Tymur's biggest differentiator — very few developer portfolios use this aesthetic)
- Hero answers "why should I care?" in under 5 seconds
- Projects show what was solved, not just what was built ("Built YOLOv5 model that identified terrain obstacles for autonomous rover navigation" not "Used Python and machine learning")
- About page tells a story with progression — geographic moves, education pivots, AI focus
- Every small detail is consistent: same accent color on links, hover states, active nav, CTA buttons

**Tymur's biggest differentiators available:**
1. Solarpunk aesthetic — distinctive, memorable, essentially unique in the developer portfolio space
2. YOLOv5 object recognition project — real ML work with visual outputs (screenshots are compelling)
3. Spelling Bee of Canada live site — shipped, real-world frontend work
4. AI systems focus — a specific, credible niche vs generic "I'm a developer"
5. Toronto + Purdue (online) — international/ambitious story if framed well

---

## Sources

**Hero sections:**
- [Colorlib: 22 Best Developer Portfolios 2026](https://colorlib.com/wp/developer-portfolios/)
- [Hero Section Design Best Practices 2026 — PerfectAfternoon](https://www.perfectafternoon.com/2025/hero-section-design/)
- [21st.dev — React Component Marketplace via shadcn.io](https://www.shadcn.io/template/serafimcloud-21st)
- [DEV Community: The Anthology of a Creative Developer 2026](https://dev.to/nk2552003/the-anthology-of-a-creative-developer-a-2026-portfolio-56jp)

**Career timelines:**
- [uiCookies: 35 Best Clean CSS Timeline Design 2026](https://uicookies.com/css-timeline/)
- [uiCookies: 27 Best Vertical Timeline Templates 2026](https://uicookies.com/vertical-timeline/)
- [Colorlib: 19 Best Portfolio Design Trends In 2026](https://colorlib.com/wp/portfolio-design-trends/)
- [Dribbble: Portfolio Timeline Design Inspiration](https://dribbble.com/search/portfolio-timeline)

**Project cards:**
- [Dribbble: 5 Creative Effects to Upgrade Your Animated Portfolio](https://dribbble.com/stories/2024/11/18/5-creative-effects-to-upgrade-your-animated-portfolio)
- [BricxLabs: 10 Card UI Design Examples That Work in 2025](https://bricxlabs.com/blogs/card-ui-design-examples)
- [Awwwards: Project Card Hover Inspiration](https://www.awwwards.com/inspiration/project-card-hover-camila-rosas-portfolio)
- [Colorlib: 19 Best Portfolio Design Trends In 2026](https://colorlib.com/wp/portfolio-design-trends/)

**Contact patterns:**
- [Wix: 15 Contact Us Page Examples](https://www.wix.com/blog/beautiful-contact-pages)
- [WebPortfolios.dev: Portfolio Contact Page with HTML](https://www.webportfolios.dev/blog/create-portfolio-contact-page-html)
- [WPForms: Contact Form vs Email Address](https://wpforms.com/contact-form-vs-email-address-which-is-better/)

**Color palette / solarpunk:**
- [HueHive: Solarpunk AI Color Palette](https://huehive.co/ai_generated_palettes/8224)
- [Tailwind CSS v4.0 Release — OKLCH Colors](https://tailwindcss.com/blog/tailwindcss-v4)
- [Tailwind Colors v4 — OKLCH Palette Reference](https://tailwindcolor.com/emerald)
- [Evil Martians: Better Dynamic Themes with OKLCH in Tailwind](https://evilmartians.com/chronicles/better-dynamic-themes-in-tailwind-with-oklch-color-magic)
- [DEV Community: The Mystery of Tailwind Colors v4](https://dev.to/matfrana/the-mystery-of-tailwind-colors-v4-hjh)
- [Tailwind CSS Theme Variables — Official Docs](https://tailwindcss.com/docs/theme)
- [Aesthetics Wiki: Solarpunk](https://aesthetics.fandom.com/wiki/Solarpunk)

**SEO:**
- [DEV Community: Next.js 15 SEO Checklist with Code Examples](https://dev.to/vrushikvisavadiya/nextjs-15-seo-checklist-for-developers-in-2025-with-code-examples-57i1)
- [Medium: Next.js SEO Best Practices — Metadata, Sitemaps, Structured Data](https://medium.com/@heshaedmon/next-js-seo-best-practices-metadata-sitemaps-and-structured-data-1bfa7979cdda)
- [Strapi: The Complete Next.js SEO Guide for Crawlable Apps](https://strapi.io/blog/nextjs-seo)
- [AverageDevs: Next.js SEO Best Practices App Router 2025](https://www.averagedevs.com/blog/nextjs-seo-best-practices)

**Navigation:**
- [ParallelHQ: How Users Navigate a Website — UX Guide 2026](https://www.parallelhq.com/blog/how-users-move-through-information-or-navigate-pages-of-website)
- [UXPlaybook: How to Design Portfolio Homepages That Land Jobs 2025](https://uxplaybook.org/articles/6-ux-portfolio-homepage-mistakes-2025)
- [SiteBuilderReport: Engineer Portfolios — Inspiring Examples 2026](https://www.sitebuilderreport.com/inspiration/engineer-portfolios)

---

*Feature research for: Tymur Bondar personal portfolio — v2.0 Design & Content milestone*
*Researched: 2026-03-03*
