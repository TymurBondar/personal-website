# Tymur Bondar — Personal Website

## What This Is

A personal portfolio website for Tymur Bondar, a software engineer based in Toronto, Canada. The site serves as a professional brand presence — showcasing experience, projects, and skills. Built with Next.js and Tailwind CSS, deployed on Vercel.

## Core Value

A clean, polished site that accurately represents who Tymur is as a software engineer — current, professional, and well-crafted.

## Requirements

### Validated

- ✓ Home page with hero introduction — existing
- ✓ About page with career timeline — existing
- ✓ Portfolio page with project showcase — existing
- ✓ Responsive navigation with mobile support — existing
- ✓ Footer with social links (LinkedIn, Telegram, GitHub) — existing
- ✓ Vercel deployment — existing
- ✓ Tailwind CSS styling — existing

### Active

- [ ] Replace DaisyUI with custom minimal Tailwind styling
- [ ] Integrate one 21st.dev hero component (to be provided)
- [ ] Update personal data: Toronto location, Purdue University (online), Spelling Bee of Canada internship, IT & Digital Marketing Specialist role
- [ ] Research-driven page structure (optimal pages for a solo software engineer)
- [ ] Essential CI/CD: linting + auto-deploy on push to main
- [ ] Project documentation (README, contributing guidelines)
- [ ] Clean, polished visual design throughout

### Out of Scope

- Blog / writing section — not requested, can add in future milestone
- Testing suite — not priority for v1 refresh
- TypeScript migration — keeping JavaScript for now
- OAuth / authentication — static portfolio site
- CMS or headless content management — content managed in code
- Full CI/CD pipeline (preview deploys, branch protection, PR templates) — keeping it essential

## Context

**Current state:** Existing Next.js 14 (App Router) site with ~344 lines of code across 6 source files. Uses DaisyUI with Dracula theme. Content is outdated — reflects NYC location, 2024 milestones, single portfolio project (Fretly). No CI/CD, no tests, no documentation.

**Personal updates to reflect:**
- Moved from New York to Toronto, Canada
- Enrolled at Binghamton University, transferred to Purdue University (online)
- Completed internship at Spelling Bee of Canada
- Full-time role as IT & Digital Marketing Specialist

**Design direction:** Minimal, clean aesthetic. Remove DaisyUI component library. Keep Tailwind utility-first approach. Will integrate one specific 21st.dev hero component (to be shared later by user).

## Constraints

- **Stack**: Keep Next.js + Tailwind CSS. Remove DaisyUI. No new frameworks.
- **Hosting**: Stay on Vercel (already deployed there)
- **Design**: Minimal and polished — not flashy or overdesigned
- **21st.dev**: One hero component only (user will provide specifics later)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Remove DaisyUI | Want custom minimal styling, DaisyUI adds too much opinionation | — Pending |
| Keep Next.js 14 vs upgrade | Research will determine if upgrade is worthwhile | — Pending |
| Page structure | Research-driven — will be determined by domain research | — Pending |
| Essential CI/CD only | Quick wins over comprehensive pipeline — can expand later | — Pending |

---
*Last updated: 2026-03-02 after initialization*
