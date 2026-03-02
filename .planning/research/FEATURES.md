# Feature Research

**Domain:** Software engineer personal portfolio website (solo developer, CS student, early career)
**Researched:** 2026-03-02
**Confidence:** MEDIUM-HIGH (multiple corroborating web sources; patterns consistent across 10+ authoritative references)

---

## Feature Landscape

### Table Stakes (Users Expect These)

Features recruiters and hiring managers assume exist. Missing these = portfolio feels unprofessional or incomplete.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Hero / intro section | First impression — must answer "who is this person and what do they do" in 3 seconds | LOW | Name, title, 1-liner bio, primary CTA ("View Work" or "Contact Me") |
| About page or section | Humanizes you — recruiters want personality, not just tech | LOW | Include headshot, brief story, current role/education, what drives you |
| Projects showcase | Core proof of skill — 87% of hiring managers value portfolios over resumes alone | MEDIUM | 3–5 curated projects max; each needs: description, tech used, role, links to live + repo |
| Contact section or page | Employers need a friction-free path to reach you | LOW | Email link at minimum; contact form preferred for spam protection |
| GitHub link | Expected signal of active development; recruiters check this | LOW | Prominent in nav or footer; profile should have pinned repos |
| LinkedIn link | Standard professional social proof | LOW | Footer or nav; consistent profile with site |
| Responsive design (mobile-first) | Recruiters browse on mobile; non-responsive = instant credibility loss | MEDIUM | Must look and work correctly on iOS/Android; test real devices |
| Custom domain (yourname.com or .dev) | Without it, the site looks amateur | LOW | tymurbondar.com or tymurbondar.dev — already handled if site is live |
| Fast load performance | Slow portfolio signals poor engineering quality — ironic and fatal | MEDIUM | Optimize images, use Next.js SSG/ISR, target Lighthouse score >90 |
| Downloadable PDF resume | Recruiters want a hard copy — always | LOW | Button in nav or contact section; PDF must be current |
| Proper page title and meta description | SEO + social sharing — shows up in Google and Slack link previews | LOW | "Tymur Bondar — Software Engineer" style; unique per page |
| Skills overview | Recruiters scan for tech keywords; this is fast filterable signal | LOW | Group by category (languages, frameworks, tools); only list things used in real projects |

---

### Differentiators (Competitive Advantage)

Features that set the portfolio apart from generic template sites. Not required, but they signal craft and intentionality.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Dark/light mode toggle | 82% of users have dark mode enabled; offering toggle shows UX sensibility | MEDIUM | Implement with CSS custom properties + `prefers-color-scheme`; store in localStorage; prevent FOUC |
| Open Graph / Twitter Card meta tags | Rich previews when site URL is shared on LinkedIn, Slack, iMessage — free marketing | LOW | `og:title`, `og:description`, `og:image`, `twitter:card`; use a static preview image |
| Smooth scroll and subtle transitions | Polished feel without requiring 3D or heavy animations | LOW-MEDIUM | Framer Motion or CSS transitions; avoid animation-for-animation's-sake |
| JSON-LD structured data (Person schema) | Tells Google exactly who you are — improves rich results in search | LOW | One `<script type="application/ld+json">` block with name, jobTitle, sameAs GitHub/LinkedIn |
| Project case studies (not just project cards) | Shows how you think, not just what you built — strongest differentiator at junior level | MEDIUM | Per-project detail page or expanded modal: problem → your role → decisions → outcome |
| Timeline / career story | Turns a resume into a narrative — Purdue, Spelling Bee of Canada, IT & Digital Marketing all fit | MEDIUM | Visual timeline on About page; shows growth trajectory clearly |
| Published app showcase (Fretly) | Real-world shipped product is rare at junior level — leads the projects section | LOW | App store link, screenshots, brief description of problem it solves |
| GitHub contribution activity | Secondary proof of consistent coding habits | LOW | Embed GitHub contribution graph or link prominently to GitHub |
| Favicon and site icon | Tiny detail that signals attention to craft | LOW | Custom favicon matching personal brand color |
| 404 page | Shows personality and attention to detail | LOW | Simple custom 404 with nav back to home |

---

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem appealing but create maintenance burden, scope creep, or quality problems.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Blog section | Thought leadership, SEO, content marketing | Requires ongoing content to not look abandoned; a blog with 1–2 posts reads worse than no blog; significant maintenance burden | Defer to v2; PROJECT.md explicitly marks this out of scope — the right call |
| Skills progress bars / percentage ratings | Looks quantified and credible | Entirely made-up numbers; "90% JavaScript" is meaningless and recruiters know it; creates false precision | Simple skill tag list grouped by category — honest and scannable |
| Animated particle effects / canvas backgrounds | Eye-catching, "creative developer" vibe | Distracting from content; hurts performance; dates quickly; not appropriate for minimalist aesthetic | Subtle CSS animation on hero (e.g., fade-in text) if any |
| Full contact form with many fields | Seems professional | Backend/serverless required; spam magnet; high-friction for recruiter; over-engineered for one-person site | Simple form (name, email, message) via Formspree or EmailJS — no backend needed |
| Testimonials carousel | Social proof | Junior engineers rarely have strong testimonials; a thin carousel looks desperate; carousels are bad UX in general | If testimonials exist (e.g., from Spelling Bee internship), display as static quotes near relevant context |
| Visitor analytics dashboard (visible to user) | Interesting data | Adds complexity; no value to site visitor; distracts from content goal | Add Google Analytics or Plausible in background for personal insight — never surface to visitors |
| Dark 3D hero (Three.js scene, etc.) | Impressive demo of skill | Heavy bundle; slow load; distracting from personal brand; hard to maintain; Bruno Simon can do this — early career engineers shouldn't try to copy it | Clean typographic hero with one 21st.dev component (already planned) |
| "Hire me" / availability status badge | Direct, honest | Can read as desperate if not framed right; also locks you into updating it | Let contact page / LinkedIn convey availability naturally |
| Infinite scroll on projects | Seems scalable | Creates navigation confusion; 3–5 projects is the right amount — pagination is unnecessary | Static grid of project cards; quality over quantity |
| CMS (Contentful, Sanity, etc.) | Easy content updates | Complete overkill for a solo dev site with static content; adds API keys, cost, complexity, and a dependency | Content in code (already PROJECT.md decision) — the right call |

---

## Feature Dependencies

```
Custom domain
    └──enables──> Proper SEO (canonical URLs work)
                      └──requires──> Meta tags (title, description, OG)
                                         └──enhances──> Open Graph tags

Projects showcase
    └──requires──> Project content (descriptions, screenshots, links)
                       └──enhances──> Case study pages (per-project detail)

Dark/light mode toggle
    └──requires──> CSS custom properties design system
                       └──requires──> DaisyUI removal (already planned)

Contact form
    └──requires──> Form endpoint (Formspree/EmailJS) — no backend needed
    └──enhances──> Contact page

PDF resume
    └──requires──> Resume is current and accurate
    └──enhances──> Contact page ("Download Resume" CTA)

Responsive design
    └──required by──> All pages (not optional — foundational)

Performance optimization
    └──required by──> SEO (Core Web Vitals are ranking signals)
    └──required by──> Professionalism (slow portfolio = ironic failure)
```

### Dependency Notes

- **Meta tags require page structure first:** Can't write unique meta descriptions until pages and content are finalized. Meta tags should be one of the last implementation steps per page.
- **Dark mode requires DaisyUI removal:** DaisyUI's theming system conflicts with custom CSS property-based dark mode. Since DaisyUI removal is already planned, dark mode implementation follows naturally.
- **Case studies enhance but don't block projects section:** Project cards are MVP; case study detail pages are v1.x. Don't block launch on detailed case studies.
- **Skills section is standalone:** No dependencies. Can be implemented independently as a component within About or a separate section.

---

## MVP Definition

### Launch With (v1)

Minimum viable portfolio — what a recruiter or hiring manager needs to evaluate Tymur professionally.

- [ ] **Hero section** — name, title ("Software Engineer"), 1-line bio, Toronto/Purdue context, CTA to projects and contact
- [ ] **About page** — brief story, career timeline (Binghamton → Purdue transfer, NYC → Toronto move, Spelling Bee internship, IT & Digital Marketing role), headshot
- [ ] **Projects page** — Fretly (published app, leads the section) + 2–3 additional projects; each with tech stack, role, live link, repo link
- [ ] **Contact section** — email link + simple form (Formspree/EmailJS); GitHub and LinkedIn prominent
- [ ] **Downloadable PDF resume** — linked from nav or hero CTA
- [ ] **Skills overview** — grouped by category, tag-style display, on About page or standalone section
- [ ] **Responsive design** — tested on mobile and desktop
- [ ] **Basic SEO** — page titles, meta descriptions, Open Graph tags, favicon
- [ ] **Footer** — GitHub, LinkedIn, Telegram links (already exist); copyright

### Add After Validation (v1.x)

Features to add once core is working and site is live.

- [ ] **Dark/light mode toggle** — high value, but requires CSS design system to be solid first; add after DaisyUI removal is stable
- [ ] **JSON-LD structured data** — low effort, high SEO value; add when meta tags are done
- [ ] **Smooth scroll and page transitions** — polish layer; add after content is finalized
- [ ] **Custom 404 page** — 30-minute task; add during polish pass
- [ ] **Open Graph preview image** — static image for link sharing; add alongside OG tags

### Future Consideration (v2+)

Features to defer — either out of scope for this milestone or requiring content/infrastructure not yet available.

- [ ] **Blog** — explicitly out of scope per PROJECT.md; requires sustained content commitment before building
- [ ] **Project case studies (full pages)** — valuable but write-intensive; defer until time allows writing polished case study copy
- [ ] **Testimonials** — defer until Tymur has collected quotes from Spelling Bee manager or collaborators on Fretly
- [ ] **CI/CD preview deploys** — PROJECT.md scopes to essential CI/CD only; branch protection and PR previews are v2

---

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Hero section | HIGH | LOW | P1 |
| Projects showcase (Fretly + others) | HIGH | MEDIUM | P1 |
| About page with timeline | HIGH | LOW | P1 |
| Contact section | HIGH | LOW | P1 |
| Responsive design | HIGH | MEDIUM | P1 |
| Downloadable PDF resume | HIGH | LOW | P1 |
| GitHub / LinkedIn links | HIGH | LOW | P1 |
| Basic SEO (meta tags, OG) | MEDIUM | LOW | P1 |
| Skills section | MEDIUM | LOW | P1 |
| Dark/light mode toggle | MEDIUM | MEDIUM | P2 |
| JSON-LD structured data | MEDIUM | LOW | P2 |
| Custom 404 page | LOW | LOW | P2 |
| Smooth transitions/animations | LOW | MEDIUM | P2 |
| Case study pages per project | HIGH | HIGH | P3 |
| Blog | MEDIUM | HIGH | P3 |
| Testimonials | MEDIUM | LOW | P3 — defer until quotes exist |

**Priority key:**
- P1: Must have for launch
- P2: Should have, add when possible
- P3: Nice to have, future consideration

---

## Competitor Feature Analysis

Observations from reviewing top-cited developer portfolio examples (Brittany Chiang, Tamal Sen, Ryan Furrer, Olaolu, and others cited in search results):

| Feature | Common Pattern | Exceptional Examples | Recommended Approach for Tymur |
|---------|---------------|---------------------|--------------------------------|
| Page structure | About + Projects + Contact is universal; many are single-page | Brittany Chiang: multi-section single page with sticky left nav | Multi-page (Home, About, Portfolio, Contact) — already exists; matches PROJECT.md |
| Project presentation | Cards with title, description, tech tags, GitHub + live links | Tamal Sen: IDE aesthetic; Adeola Adeoti: playing card animations | Clean card grid; Fretly card leads with App Store link + screenshots |
| Skills display | Tag clouds, icon grids, grouped lists | Avoid progress bars (universal advice) | Grouped tag list by category — no percentages |
| Contact | Contact form + email + social links combo most common | Some minimalists use email-only successfully | Email link + Formspree form + GitHub/LinkedIn/Telegram |
| Dark mode | Increasingly universal among developer portfolios | Many top portfolios default to dark | Choose a default (dark recommended for developer aesthetic), with toggle |
| Animations | Subtle — hover effects, fade-ins, scroll-triggered reveals | Bruno Simon (3D) is the exception, not the model | Subtle hover/fade only; 21st.dev hero component handles visual distinction |
| Resume | Downloadable PDF linked from nav or CTA | Some link directly to LinkedIn — less preferred | Prominent "Resume" or "CV" button in nav |

---

## Page Structure Recommendation

Based on evidence from multiple sources: multi-page structure with 4 pages is optimal for Tymur's profile (not enough content for a 5th standalone page, too much content to cram into one page effectively).

**Recommended pages:**

1. **Home (`/`)** — Hero with name, role, CTA buttons (View Work, Contact); possibly a brief highlights section (1 featured project, skills snapshot, "Currently at..." status)
2. **About (`/about`)** — Bio, career timeline, headshot, skills section, resume download CTA
3. **Portfolio (`/portfolio`)** — Project grid (Fretly + others); each card links to GitHub + live demo
4. **Contact (`/contact`)** — Simple contact form (Formspree/EmailJS) + email + social links

This matches the existing site structure and PROJECT.md requirements. No new pages needed for v1.

---

## Sources

- CareerFoundry: The Complete Software Engineer Portfolio Guide + 24 Examples (https://careerfoundry.com/en/blog/web-development/software-engineer-portfolio/)
- Zencoder: How to Create a Software Engineer Portfolio in 2026 (https://zencoder.ai/blog/how-to-create-software-engineer-portfolio)
- BrainStation: How to Build a Software Engineer Portfolio (https://brainstation.io/career-guides/how-to-build-a-software-engineer-portfolio)
- Codecademy: How To Build a Software Developer Portfolio (https://www.codecademy.com/resources/blog/software-developer-portfolio-tips)
- 8Seneca: Software Engineer Portfolio Guide: What to Include and What to Avoid (https://www.8seneca.com/en/blog/technology/software-engineer-portfolio-guide-what-to-include-and-what-to-avoid)
- Chuck Groom / Medium: A Software Engineer's One-Page Portfolio (https://cgroom.medium.com/a-software-engineers-one-page-portfolio-4f85ab8a20d1)
- WPForms: Contact Form vs Email Address (https://wpforms.com/contact-form-vs-email-address-which-is-better/)
- AlterSquare: Dark Mode vs Light Mode: The Complete UX Guide for 2025 (https://altersquare.io/dark-mode-vs-light-mode-the-complete-ux-guide-for-2025/)
- Shipixen: SEO Checklist for Developer Portfolios and Landing Pages (https://shipixen.com/blog/seo-checklist-for-developer-portfolios-and-landing-pages)
- Nucamp: Portfolio SEO: Making Your Work Discoverable to Employers (https://www.nucamp.co/blog/coding-bootcamp-job-hunting-portfolio-seo-making-your-work-discoverable-to-employers)
- Hostinger: 25 web developer portfolio examples from top developers (https://www.hostinger.com/tutorials/web-developer-portfolio)
- Colorlib: 22 Best Developer Portfolios (2026) (https://colorlib.com/wp/developer-portfolios/)

---

*Feature research for: Software engineer personal portfolio website*
*Researched: 2026-03-02*
