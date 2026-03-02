# Architecture Research

**Domain:** Software engineer personal portfolio website (Next.js, Tailwind CSS)
**Researched:** 2026-03-02
**Confidence:** HIGH

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      Browser (Client)                        │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                   │
│  │  Home /  │  │  About   │  │Portfolio │                   │
│  │  Hero    │  │  Page    │  │  Page    │                   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘                   │
│       │             │             │                          │
├───────┴─────────────┴─────────────┴──────────────────────────┤
│                  Root Layout (Server Component)               │
│       Navbar ─────────────────────────── Footer              │
├─────────────────────────────────────────────────────────────┤
│                  Static Data Layer (lib/data/)                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │  projects   │  │  timeline   │  │   config    │          │
│  │  .js        │  │  .js        │  │   .js       │          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
├─────────────────────────────────────────────────────────────┤
│               Build-time / Vercel CDN (Edge)                  │
│                 Static HTML/CSS/JS output                     │
└─────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| `app/layout.js` | Root layout, wraps all pages with Navbar + Footer | Server Component, exports metadata |
| `app/page.js` | Home page with hero section | Server Component, imports Hero |
| `app/about/page.js` | About / career timeline | Server Component, imports timeline data from lib/ |
| `app/portfolio/page.js` | Projects showcase grid | Server Component, imports projects data from lib/ |
| `components/layout/Navbar.js` | Site navigation, responsive mobile menu | Client Component (needs event handlers for mobile toggle) |
| `components/layout/Footer.js` | Social links, contact email | Server Component (purely static) |
| `components/ui/Hero.js` | 21st.dev hero component (provided externally) | Client or Server depending on 21st.dev implementation |
| `components/ui/ProjectCard.js` | Individual project display card | Server Component (static display) |
| `components/ui/TimelineItem.js` | Single career milestone in timeline | Server Component (static display) |
| `lib/data/projects.js` | Array of project objects | Plain JS data file, no component |
| `lib/data/timeline.js` | Array of career milestone objects | Plain JS data file, no component |
| `lib/config.js` | Site metadata, nav links, social URLs | Plain JS constants, shared everywhere |

## Recommended Project Structure

```
src/
├── app/
│   ├── globals.css           # Global styles, Tailwind directives
│   ├── layout.js             # Root layout — Navbar + Footer + metadata
│   ├── page.js               # Home page (hero section)
│   ├── about/
│   │   └── page.js           # Career timeline page
│   └── portfolio/
│       └── page.js           # Projects grid page
├── components/
│   ├── layout/
│   │   ├── Navbar.js         # Site-wide navigation
│   │   └── Footer.js         # Site-wide footer with socials
│   └── ui/
│       ├── Hero.js           # 21st.dev hero (drop-in or custom)
│       ├── ProjectCard.js    # Project display card
│       └── TimelineItem.js   # Career milestone card
└── lib/
    ├── config.js             # Site name, nav links, social URLs, metadata
    ├── data/
    │   ├── projects.js       # Project entries (title, desc, links, tags)
    │   └── timeline.js       # Career milestones (year, title, description)
    └── utils.js              # Shared helper functions (optional)
```

### Structure Rationale

- **`app/`:** Next.js App Router convention — only `page.js` files create routes. Layout wraps all pages, eliminating duplicate Navbar/Footer code.
- **`components/layout/`:** Separates structural/chrome components (Navbar, Footer) from content components. Makes the layout layer obvious to any reader.
- **`components/ui/`:** Reusable presentational components. ProjectCard and TimelineItem are pulled out of pages because they render arrays of data — isolating them makes content updates trivial.
- **`lib/data/`:** All site content lives as plain JS objects here, not hardcoded in JSX. When Tymur wants to add a project or update his timeline, he edits one data file, not a page component. This is the key maintainability decision.
- **`lib/config.js`:** Single source of truth for site-level constants (name, email, social URLs, nav structure). Navbars, footers, and metadata all import from here — no duplication.

## Architectural Patterns

### Pattern 1: Data-in-lib, Display-in-components

**What:** Extract all site content (projects, timeline entries) into plain JS arrays in `lib/data/`. Import these arrays into page components and map them to display components.

**When to use:** Always for a portfolio site. Content changes more often than structure.

**Trade-offs:** Adds one more file to edit for content changes, but eliminates hunting through JSX to update text.

**Example:**
```javascript
// lib/data/projects.js
export const projects = [
  {
    id: 'fretly',
    title: 'Fretly',
    description: 'Guitar companion app for tuning, tabs, and practice tracking.',
    tech: ['Flutter', 'Dart'],
    githubUrl: 'https://github.com/TymurBondar/Fretly',
    liveUrl: null,
    image: '/fretlylogo.jpg',
  },
  // add new projects here
];

// app/portfolio/page.js
import { projects } from '@/lib/data/projects';
import ProjectCard from '@/components/ui/ProjectCard';

export default function PortfolioPage() {
  return (
    <main>
      {projects.map((project) => (
        <ProjectCard key={project.id} {...project} />
      ))}
    </main>
  );
}
```

### Pattern 2: Server Components by Default, Client Only When Needed

**What:** All components are Server Components unless they require browser APIs, event handlers, or React hooks (`useState`, `useEffect`). Add `'use client'` only at the leaf level.

**When to use:** Always. For a static portfolio, the only Client Component is Navbar (mobile menu toggle state).

**Trade-offs:** Slightly more cognitive overhead to track the server/client boundary. Payoff is smaller JS bundle and better Core Web Vitals.

**Example:**
```javascript
// components/layout/Navbar.js — needs state for mobile menu
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  // ...
}

// components/layout/Footer.js — no interactivity needed
// No 'use client' directive — stays as Server Component
import Link from 'next/link';
import { siteConfig } from '@/lib/config';

export default function Footer() {
  return (
    <footer>
      <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
      {/* social links */}
    </footer>
  );
}
```

### Pattern 3: Centralized Metadata via layout.js

**What:** Define SEO metadata (title, description, Open Graph) in `app/layout.js` as a root default, then override per-page with exported `metadata` objects.

**When to use:** Always in Next.js App Router. Much cleaner than managing meta tags manually.

**Trade-offs:** None for a portfolio — this is the framework-native approach.

**Example:**
```javascript
// app/layout.js
export const metadata = {
  title: {
    default: 'Tymur Bondar — Software Engineer',
    template: '%s | Tymur Bondar',
  },
  description: 'Software engineer based in Toronto, Canada.',
  openGraph: {
    url: 'https://tymurbondar.com',
    siteName: 'Tymur Bondar',
  },
};

// app/portfolio/page.js — overrides title for this page
export const metadata = {
  title: 'Projects',
};
```

## Data Flow

### Request Flow (Static — portfolio is statically generated)

```
Build time:
  lib/data/projects.js (JS array)
      ↓ import
  app/portfolio/page.js (Server Component)
      ↓ renders
  components/ui/ProjectCard.js (Server Component)
      ↓
  Static HTML generated by Next.js build
      ↓
  Vercel CDN serves HTML instantly

Runtime (user visits):
  Browser requests /portfolio
      ↓
  Vercel CDN returns pre-built HTML (no server round-trip)
      ↓
  Next.js hydrates only Client Components (Navbar mobile toggle)
```

### State Management

```
No global state needed for this portfolio.

Navbar (Client Component)
  └── local useState: mobileMenuOpen (boolean)
        ↓ toggle via button click
      Controls mobile nav visibility

Everything else is stateless props-down from Server Components.
```

### Key Data Flows

1. **Content update flow:** Edit `lib/data/projects.js` or `lib/data/timeline.js` → `next build` regenerates static HTML → Vercel deploys updated CDN asset. No runtime database or API call.

2. **21st.dev hero integration:** Hero component drops into `components/ui/Hero.js`. If it requires client features (animations, scroll hooks), it declares `'use client'`. `app/page.js` imports it as a child — Server Component can import Client Component without issues.

3. **Metadata flow:** `lib/config.js` exports site constants → `app/layout.js` imports and spreads into `metadata` export → Next.js injects correct `<head>` tags at build time per page.

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| Current (1 dev, ~5 pages) | Flat structure as described. Everything in lib/data/ is fine. |
| Adding blog posts | Add `app/blog/[slug]/page.js` with MDX or Contentlayer. Keep posts in `content/posts/`. No structural refactor needed. |
| Adding more pages (resume, speaking) | Add new route in `app/`. Data stays in `lib/data/`. Zero impact on existing pages. |
| Adding contact form | One Client Component for the form (`'use client'`), one API route (`app/api/contact/route.js`) or use a third-party service (Formspree). No structural changes. |

### Scaling Priorities

1. **First bottleneck:** Content duplication — bio text or social links copy-pasted across components. Fixed by centralizing in `lib/config.js` from day one.
2. **Second bottleneck:** Adding new projects means editing a page component with mixed data and JSX. Fixed by the data-in-lib pattern from the start.

## Anti-Patterns

### Anti-Pattern 1: Hardcoded Content in Page JSX

**What people do:** Write project titles, descriptions, and career milestones directly as JSX string literals inside page components.

**Why it's wrong:** Every content update requires a developer to navigate through JSX, risk breaking layout, and deploy. For a portfolio that needs regular content updates (new jobs, new projects), this becomes friction that causes the site to go stale.

**Do this instead:** Put all data in `lib/data/` as plain JS objects. Page components only map data to display components.

### Anti-Pattern 2: Marking Everything as Client Components

**What people do:** Add `'use client'` to every component "just in case" or because they saw it in an example.

**Why it's wrong:** Client Components ship their code as JavaScript to the browser. For a static portfolio, this inflates the JS bundle and hurts Core Web Vitals (LCP, INP) unnecessarily.

**Do this instead:** Default to Server Components. Only add `'use client'` to components that actually use hooks or browser events. For this portfolio, that is only Navbar (mobile menu state). The 21st.dev hero may also need it depending on its implementation.

### Anti-Pattern 3: Global State Management for Static Content

**What people do:** Reach for Context or Zustand to share data across pages.

**Why it's wrong:** A portfolio has no shared mutable state. Projects and timeline data are static — they do not change at runtime.

**Do this instead:** Import data directly from `lib/data/` in each page that needs it. No state management library needed. If data is needed in multiple places (e.g., a featured project shown on home and portfolio pages), import the same data file in both places.

### Anti-Pattern 4: Flat components/ Directory with No Subfolders

**What people do:** Dump all components into `src/components/` — `Navbar.js`, `Footer.js`, `Hero.js`, `ProjectCard.js` all at the same level.

**Why it's wrong:** Works fine at 5 files. At 10+ it becomes impossible to distinguish layout chrome from content UI. Searching becomes guesswork.

**Do this instead:** Separate `components/layout/` (Navbar, Footer) from `components/ui/` (Hero, ProjectCard, TimelineItem) immediately. The distinction is clear: layout components appear on every page; UI components are used by specific pages.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Vercel | Push to main branch triggers auto-deploy | Already set up. Static output served from CDN edge. |
| Google Fonts (next/font) | Import in `app/layout.js` using `next/font/google` | Already using Inter. Keep this approach — zero layout shift. |
| 21st.dev hero component | Copy component source into `src/components/ui/Hero.js` | 21st.dev provides source, not an npm package. Customize directly. |
| GitHub (project links) | External href in ProjectCard | No API call — just static links in lib/data/projects.js |
| LinkedIn/Telegram/GitHub (footer) | Static hrefs from lib/config.js | No OAuth, no API — purely presentational |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| `lib/data/` to pages | Direct import — `import { projects } from '@/lib/data/projects'` | One-way. Data files have no knowledge of components. |
| `lib/config.js` to all components | Direct import wherever needed | Single source of truth for site constants. Never duplicated. |
| `app/layout.js` to pages | Next.js App Router wrapping — layout renders `{children}` | Navbar and Footer live here, not in individual pages. |
| Server Components to Client Components | Props only — pass serializable data down | Cannot pass functions or class instances from Server to Client. Pass raw data instead. |
| 21st.dev Hero to `app/page.js` | Import as child component | If Hero is a Client Component, it can be imported from a Server Component without issues. |

## Sources

- [Next.js Official Docs: Project Structure](https://nextjs.org/docs/app/getting-started/project-structure) — HIGH confidence, official documentation, updated 2026-02-27
- [Next.js Official Docs: Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components) — HIGH confidence, official documentation
- [Next.js Official Docs: Layouts and Pages](https://nextjs.org/docs/app/building-your-application/routing) — HIGH confidence, official documentation
- [Best Practices for Organizing Next.js 15 — DEV Community](https://dev.to/bajrayejoon/best-practices-for-organizing-your-nextjs-15-2025-53ji) — MEDIUM confidence, community-validated patterns
- [The Battle-Tested Next.js Project Structure — Medium](https://medium.com/@burpdeepak96/the-battle-tested-nextjs-project-structure-i-use-in-2025-f84c4eb5f426) — MEDIUM confidence, practitioner perspective
- [21st.dev Hero Components](https://21st.dev/s/hero) — MEDIUM confidence, official 21st.dev component marketplace
- [Next.js Best Practices 2026 — Serviots](https://www.serviots.com/blog/nextjs-development-best-practices) — LOW confidence (single source, not verified against official docs)
- [Server vs Client Components 2025 — Codism](https://codism.io/react-server-components-vs-client-components-the-2025-enterprise-guide/) — MEDIUM confidence, consistent with official Next.js documentation

---
*Architecture research for: Software engineer personal portfolio website (Next.js App Router + Tailwind CSS)*
*Researched: 2026-03-02*
