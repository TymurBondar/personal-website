# Architecture Research

**Domain:** Software engineer personal portfolio website — v2.0 Design & Content milestone
**Researched:** 2026-03-03
**Confidence:** HIGH

---

## Context: What v2.0 Adds to v1.0

The existing codebase has 5 source files and a flat `src/components/` directory. v2.0 must integrate:
a Tailwind `@theme` solarpunk palette, a 21st.dev hero component, three new pages (About, Portfolio,
Contact), dark/light mode toggle (nice-to-have), per-page SEO metadata, sitemap, and portfolio images.
This document answers seven specific integration questions with exact file paths and component names.

---

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                          Browser                                     │
├─────────────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐ │
│  │  / Home  │  │ /about   │  │/portfolio│  │     /contact         │ │
│  │  Hero    │  │ Timeline │  │ Projects │  │  Email + Socials     │ │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └─────────┬────────────┘ │
│       │             │             │                   │              │
├───────┴─────────────┴─────────────┴───────────────────┴──────────────┤
│  Root Layout (Server Component) — app/layout.js                       │
│  ThemeProvider (Client) │ Navbar (Client) │ Footer (Server)           │
├─────────────────────────────────────────────────────────────────────┤
│  Design Token Layer — src/app/globals.css                             │
│  @theme solarpunk palette + @custom-variant dark                      │
├─────────────────────────────────────────────────────────────────────┤
│  Static Data Layer — src/lib/data/                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────────────┐   │
│  │  projects.js │  │  timeline.js │  │  config.js (site constants)│  │
│  └──────────────┘  └──────────────┘  └───────────────────────────┘   │
├─────────────────────────────────────────────────────────────────────┤
│  Build → Vercel CDN (Static HTML + Edge-cached images)                │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Answer 1: File Structure

### New files vs. modified files

**Modified (existing files that change):**

| File | Change |
|------|--------|
| `src/app/globals.css` | Add `@theme` block, `@custom-variant dark`, remove interim body styles |
| `src/app/layout.js` | Add `metadataBase`, title template, OG defaults; wrap body in ThemeProvider |
| `src/components/Navbar.js` | Move to `src/components/layout/Navbar.js`, add nav links + dark toggle |
| `src/components/Footer.js` | Move to `src/components/layout/Footer.js`, pull data from `lib/config.js` |

**New files:**

```
src/
├── app/
│   ├── globals.css                    # MODIFIED — @theme + dark variant
│   ├── layout.js                      # MODIFIED — metadata, ThemeProvider
│   ├── page.js                        # MODIFIED — import Hero component
│   ├── sitemap.js                     # NEW — /sitemap.xml (auto-served)
│   ├── robots.js                      # NEW — /robots.txt (auto-served)
│   ├── about/
│   │   └── page.js                    # NEW — career timeline page
│   ├── portfolio/
│   │   └── page.js                    # NEW — projects grid page
│   └── contact/
│       └── page.js                    # NEW — email + social links page
├── components/
│   ├── layout/
│   │   ├── Navbar.js                  # MOVED + MODIFIED — multi-page nav
│   │   └── Footer.js                  # MOVED + MODIFIED — uses lib/config
│   ├── ui/
│   │   ├── Hero.js                    # NEW — 21st.dev hero component source
│   │   ├── ProjectCard.js             # NEW — single project display
│   │   └── TimelineItem.js            # NEW — single career milestone
│   └── providers/
│       └── ThemeProvider.js           # NEW — 'use client' next-themes wrapper
├── lib/
│   ├── config.js                      # NEW — site constants (name, email, nav, socials)
│   └── data/
│       ├── projects.js                # NEW — 3 project entries
│       └── timeline.js                # NEW — career milestones array
└── public/
    └── images/
        └── projects/
            ├── rover-team.jpg         # NEW — Rover Team project image(s)
            └── og-image.jpg           # NEW — OG social sharing image (1200x630)
```

### Structure rationale

- `components/layout/` separates chrome (Navbar, Footer, present on every page) from
  `components/ui/` (page-specific content components). At 8+ components this distinction
  prevents guesswork.
- `components/providers/` isolates all `'use client'` wrapper components so the boundary
  is visible at the filesystem level. ThemeProvider must be a Client Component but wraps
  the entire layout — this directory signals that intent.
- `lib/config.js` is the single source of truth for nav links, social URLs, email, and
  site domain. Navbar, Footer, and metadata all import from here — no duplication.
- `lib/data/` holds plain JS arrays for content. Updating a project or timeline entry
  means editing one file, not hunting through JSX.

---

## Answer 2: @theme Block Placement

**Decision: Keep `@theme` in `src/app/globals.css`.** A separate file is only warranted for multi-theme design systems with many theme files. For a single-palette site, splitting adds indirection without benefit.

### Complete globals.css structure

```css
/* src/app/globals.css */

@import "tailwindcss";

/* ─── Solarpunk Design Tokens ─────────────────────────────────────────── */
@theme {
  /* Brand colors */
  --color-forest:     #1a3d2b;   /* deep forest green — primary surface */
  --color-emerald:    #2d7a4f;   /* emerald — interactive elements */
  --color-moss:       #4a9e6b;   /* moss green — accents, highlights */
  --color-canopy:     #7bc99a;   /* light canopy — text on dark surfaces */
  --color-sunlight:   #f5e642;   /* solar yellow — CTA, emphasis */
  --color-bark:       #2c1a0e;   /* warm dark brown — dark background */
  --color-soil:       #1a0f06;   /* deeper brown — darkest background */
  --color-parchment:  #f8f4e8;   /* warm off-white — light mode background */
  --color-stone:      #4a3728;   /* warm mid-tone — borders, dividers */

  /* Typography */
  --font-sans: var(--font-inter), ui-sans-serif, system-ui, sans-serif;

  /* Spacing / radius overrides (optional, fine-tune in implementation) */
  --radius-card: 0.75rem;
}

/* ─── Dark Mode Custom Variant ────────────────────────────────────────── */
/* Enables dark: utility prefix controlled by .dark class on <html>        */
/* next-themes adds/removes the .dark class; suppressHydrationWarning      */
/* on <html> prevents SSR hydration mismatch.                              */
@custom-variant dark (&:is(.dark *));

/* ─── Base styles ─────────────────────────────────────────────────────── */
@layer base {
  :root {
    /* Light mode semantic tokens */
    --bg-page:      var(--color-parchment);
    --text-primary: var(--color-forest);
    --text-muted:   var(--color-stone);
  }

  .dark {
    /* Dark mode semantic token overrides */
    --bg-page:      var(--color-bark);
    --text-primary: var(--color-canopy);
    --text-muted:   var(--color-stone);
  }

  body {
    background-color: var(--bg-page);
    color: var(--text-primary);
  }
}
```

**Key rules:**
- `@theme` defines design tokens that Tailwind converts to utility classes (`bg-forest`, `text-emerald`, etc.)
- `@custom-variant dark` replaces the removed `darkMode: 'class'` config from v3
- `:root` / `.dark` in `@layer base` provides semantic tokens that override per-mode
- The `--color-*` tokens from `@theme` are accessible as CSS variables anywhere (including the 21st.dev hero component's custom CSS)

**Confidence:** HIGH — verified against [Tailwind v4 official docs](https://tailwindcss.com/docs/theme) and multiple community sources confirming CSS-first approach.

---

## Answer 3: Dark/Light Mode Architecture

### Decision: next-themes + Tailwind `@custom-variant`

**Why next-themes over raw CSS `prefers-color-scheme`:**
- Provides user toggle that persists across sessions (localStorage)
- Handles the SSR hydration timing problem automatically with `suppressHydrationWarning`
- Respects system preference as default when no user preference is stored
- Is the dominant pattern across the Next.js + Tailwind v4 ecosystem (MEDIUM-HIGH confidence)

**Cost:** +1 npm package, +1 Client Component wrapper. For a "nice to have" feature, this is minimal.

### Component chain

```
app/layout.js (Server Component)
└── <html lang="en" suppressHydrationWarning>    ← required for next-themes
    └── <body>
        └── ThemeProvider (Client Component)      ← next-themes wrapper
            ├── Navbar (Client Component)          ← contains ThemeToggle button
            ├── <main>{children}</main>
            └── Footer (Server Component)
```

### ThemeProvider implementation

```javascript
// src/components/providers/ThemeProvider.js
'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';

export default function ThemeProvider({ children }) {
  return (
    <NextThemesProvider
      attribute="class"        // adds/removes .dark class on <html>
      defaultTheme="system"    // respects OS preference by default
      enableSystem             // allows system preference detection
      disableTransitionOnChange // prevents flash on theme switch
    >
      {children}
    </NextThemesProvider>
  );
}
```

### Layout integration

```javascript
// src/app/layout.js
import ThemeProvider from '../components/providers/ThemeProvider';

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <ThemeProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### ThemeToggle button (inside Navbar)

```javascript
// Inside src/components/layout/Navbar.js (already 'use client')
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch — render nothing until mounted on client
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      {theme === 'dark' ? 'Light' : 'Dark'}
    </button>
  );
}
```

**Critical:** The `mounted` guard is required. Without it, SSR renders the server state
(unknown theme) and the client renders a different state, causing a hydration error.

### Using dark: utilities in components

```javascript
// Example: solarpunk-themed heading
<h1 className="text-forest dark:text-canopy">...</h1>
```

The `@custom-variant dark (&:is(.dark *))` in globals.css makes the `dark:` prefix
work against the `.dark` class that `next-themes` applies to `<html>`.

**Confidence:** HIGH — [next-themes GitHub](https://github.com/pacocoursey/next-themes) + verified Tailwind v4 custom variant documentation.

---

## Answer 4: 21st.dev Component Integration

### What 21st.dev is

21st.dev is a copy-paste component marketplace (73+ hero components). Components are React
source code — not an npm package. Installation means copying the component code into your
project, not running `npm install 21st.dev`.

**Integration model:**
1. Browse [21st.dev](https://21st.dev) hero section
2. Copy component source
3. Paste into `src/components/ui/Hero.js`
4. Adapt Tailwind classes to match the solarpunk `@theme` tokens
5. Import in `src/app/page.js`

### Server/Client boundary handling

Most 21st.dev components use animations (Framer Motion) or scroll hooks → they will include
`'use client'`. This is fine. Server Components can import Client Components without issue.

```javascript
// src/app/page.js — Server Component
import Hero from '../components/ui/Hero';  // Hero may be 'use client' internally

export default function HomePage() {
  return (
    <div>
      <Hero />              {/* Client Component nested in Server Component — valid */}
    </div>
  );
}
```

**Rule:** Do NOT add `'use client'` to `src/app/page.js` itself. Keep the page as a
Server Component. Only `Hero.js` carries the directive if needed.

### Adapting 21st.dev classes to solarpunk palette

21st.dev components typically use shadcn/ui CSS variables (`--background`, `--foreground`,
`--primary`). Map these to the solarpunk tokens by either:
- Renaming utility classes in the copied source to use `bg-bark`, `text-canopy`, etc.
- Or adding compatibility aliases in globals.css:

```css
@layer base {
  :root {
    --background: var(--color-parchment);
    --foreground: var(--color-forest);
    --primary:    var(--color-emerald);
  }
  .dark {
    --background: var(--color-bark);
    --foreground: var(--color-canopy);
    --primary:    var(--color-moss);
  }
}
```

**Recommendation:** Adapt the classes directly in the copied source. Fewer CSS variables
to maintain, explicit rather than implicit mapping.

### If the component uses Framer Motion

Framer Motion is not in the current stack. If the chosen 21st.dev component requires it:
```bash
npm install framer-motion
```
This is acceptable — it only affects the Hero component bundle, not the rest of the site.
However, prefer components that use CSS animations over Framer Motion to keep the bundle lean.

**Confidence:** MEDIUM — 21st.dev docs confirm copy-paste model. Specific component requirements
depend on which hero is selected during implementation.

---

## Answer 5: Image Handling

### Portfolio project images

**Location:** `public/images/projects/`

```
public/
├── HeroPic.jpg               # existing — keep in place (page.js imports directly)
└── images/
    └── projects/
        ├── rover-team-1.jpg  # YOLOv5 model screenshot
        ├── rover-team-2.jpg  # Robot/hardware photo (optional)
        └── og-image.jpg      # OG social sharing image 1200×630px
```

**Why `public/images/projects/` not project root:** Keeps `public/` organized as files grow.
`HeroPic.jpg` stays at `public/HeroPic.jpg` (already imported in `src/app/page.js` —
moving it would require updating the import).

### next/image usage for portfolio cards

```javascript
// src/components/ui/ProjectCard.js
import Image from 'next/image';

export default function ProjectCard({ title, description, imageSrc, imageAlt }) {
  return (
    <div className="rounded-card overflow-hidden">
      {imageSrc && (
        <Image
          src={imageSrc}          // e.g., "/images/projects/rover-team-1.jpg"
          alt={imageAlt}
          width={600}
          height={400}
          className="w-full h-auto object-cover"
        />
      )}
    </div>
  );
}
```

**Optimization strategy:**
- All portfolio images: use `next/image` — auto WebP/AVIF conversion, responsive srcset
- `priority` only on hero image (already set in `page.js`) — not on portfolio cards
- `placeholder="blur"` available for local images (Next.js generates blurDataURL automatically
  for static imports; for path-string src, provide blurDataURL or omit placeholder)
- Recommended image sizes: 600–900px wide at 2x (1200–1800px source). Rover Team images
  should be exported/resized before committing — large source images slow builds

### OG image

Place `public/images/projects/og-image.jpg` at 1200×630px. Reference in layout.js metadata:
```javascript
openGraph: {
  images: [{ url: '/images/projects/og-image.jpg', width: 1200, height: 630 }],
}
```

**Confidence:** HIGH — [Next.js official image docs](https://nextjs.org/docs/app/getting-started/images) + public folder rules verified.

---

## Answer 6: Per-Page Metadata

### Root layout — shared defaults

```javascript
// src/app/layout.js
export const metadata = {
  metadataBase: new URL('https://tymurbondar.com'),  // required for OG image absolute URLs
  title: {
    default: 'Tymur Bondar — Software Engineer',
    template: '%s | Tymur Bondar',
  },
  description: 'Software engineer based in Toronto, Canada. CS student at Purdue. Building automated AI systems.',
  openGraph: {
    type: 'website',
    siteName: 'Tymur Bondar',
    locale: 'en_CA',
    images: [{ url: '/images/projects/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
  },
};
```

### Per-page overrides

```javascript
// src/app/about/page.js
export const metadata = {
  title: 'About',        // renders as "About | Tymur Bondar"
  description: 'CS student at Purdue, developer at Spelling Bee of Canada, rover team ML engineer.',
  openGraph: {
    title: 'About — Tymur Bondar',
    description: 'CS student at Purdue, developer at Spelling Bee of Canada, rover team ML engineer.',
  },
};

// src/app/portfolio/page.js
export const metadata = {
  title: 'Projects',
  description: 'ML object recognition for robotics, frontend development, and personal projects.',
  openGraph: {
    title: 'Projects — Tymur Bondar',
  },
};

// src/app/contact/page.js
export const metadata = {
  title: 'Contact',
  description: 'Get in touch — tymurbondar@outlook.com.',
  openGraph: {
    title: 'Contact — Tymur Bondar',
  },
};
```

**Shallow merge gotcha:** If a child page sets `openGraph`, the entire `openGraph` object from
the parent layout is **replaced**, not merged field-by-field. Include all desired OG fields in
each page's override, or use a shared-metadata pattern:

```javascript
// src/lib/metadata.js — shared OG image reference
export const sharedOgImage = {
  url: '/images/projects/og-image.jpg',
  width: 1200,
  height: 630,
};

// In page.js:
import { sharedOgImage } from '@/lib/metadata';
export const metadata = {
  title: 'About',
  openGraph: { title: 'About — Tymur Bondar', images: [sharedOgImage] },
};
```

### JSON-LD Person schema

Add to `src/app/layout.js` as a script tag (not via the metadata API — JSON-LD is injected
manually):

```javascript
// src/app/layout.js
const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Tymur Bondar',
  url: 'https://tymurbondar.com',
  email: 'tymurbondar@outlook.com',
  jobTitle: 'Software Engineer',
  alumniOf: 'Purdue University',
  address: { '@type': 'PostalAddress', addressLocality: 'Toronto', addressCountry: 'CA' },
  sameAs: [
    'https://www.linkedin.com/in/tymurbondar/',
    'https://github.com/TymurBondar',
    'https://t.me/BondarTymur',
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        {/* rest of layout */}
      </body>
    </html>
  );
}
```

### Sitemap and robots

```javascript
// src/app/sitemap.js — auto-served at /sitemap.xml
export default function sitemap() {
  return [
    { url: 'https://tymurbondar.com',            priority: 1.0 },
    { url: 'https://tymurbondar.com/about',      priority: 0.8 },
    { url: 'https://tymurbondar.com/portfolio',  priority: 0.8 },
    { url: 'https://tymurbondar.com/contact',    priority: 0.6 },
  ];
}

// src/app/robots.js — auto-served at /robots.txt
export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://tymurbondar.com/sitemap.xml',
  };
}
```

No npm packages needed — built into Next.js 15.

**Confidence:** HIGH — verified against [Next.js generateMetadata docs](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) and [sitemap docs](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap), both fetched from official Next.js docs updated 2026-02-27.

---

## Answer 7: Build Order

Build order is driven by dependency chains. Build the foundation before the features that depend on it.

### Recommended sequence

**Phase 1 — Design tokens (no new pages, no rework risk)**
1. Update `src/app/globals.css` — add `@theme` solarpunk palette + `@custom-variant dark`
2. Update existing inline `bg-gray-900`/`text-gray-*` classes in `layout.js`, `page.js`, `Navbar.js`, `Footer.js` to use new tokens
3. Verify build passes, existing single page looks right

**Why first:** Every subsequent component will use these token classes. Doing this last means updating token classes in every component twice.

**Phase 2 — Layout infrastructure**
4. Create `src/lib/config.js` with site constants (name, email, nav links, social URLs)
5. Move `Navbar.js` to `src/components/layout/Navbar.js`, add multi-page nav links (About, Portfolio, Contact)
6. Move `Footer.js` to `src/components/layout/Footer.js`, import email/socials from `lib/config.js`
7. Update `src/app/layout.js` imports to new paths

**Why before pages:** Pages import from components. The nav needs the new links before pages exist (so navigation works immediately once pages are created).

**Phase 3 — Hero component**
8. Select 21st.dev hero from the marketplace
9. Copy source into `src/components/ui/Hero.js`
10. Adapt Tailwind classes to solarpunk tokens
11. Import into `src/app/page.js`, replace current hero JSX

**Why before other pages:** The home page is the first thing visitors see. Having the design system in place (Phase 1) means adapting the hero's classes is a single pass.

**Phase 4 — Content pages**
12. Create `src/lib/data/timeline.js` with career milestones
13. Create `src/components/ui/TimelineItem.js`
14. Create `src/app/about/page.js` with metadata
15. Create `src/lib/data/projects.js` with 3 project entries
16. Add `public/images/projects/` images (rover-team.jpg)
17. Create `src/components/ui/ProjectCard.js`
18. Create `src/app/portfolio/page.js` with metadata
19. Create `src/app/contact/page.js` with metadata

**Why this order:** About page is simpler (no images) so it validates the data-in-lib pattern before
Portfolio adds image complexity. Contact is trivially simple — last.

**Phase 5 — SEO**
20. Update `src/app/layout.js` metadata (metadataBase, title template, OG defaults, JSON-LD)
21. Add per-page metadata exports to each page
22. Create `src/app/sitemap.js`
23. Create `src/app/robots.js`
24. Add favicon to `public/` (or `src/app/icon.png` for file-based approach)

**Why last:** SEO metadata wraps existing pages. All pages must exist before sitemap entries are accurate.

**Phase 6 — Dark mode (nice-to-have, isolated, zero rework risk)**
25. `npm install next-themes`
26. Create `src/components/providers/ThemeProvider.js`
27. Wrap layout body in ThemeProvider
28. Add `suppressHydrationWarning` to `<html>` tag
29. Add `ThemeToggle` button inside Navbar
30. Verify `dark:` utilities working via browser DevTools (add `.dark` class to `<html>`)

**Why last:** Dark mode is explicitly "nice to have." Building it last means it doesn't block any other
phase. If deferred, zero rework — the `@custom-variant dark` in globals.css is already there from Phase 1;
adding next-themes is additive only.

---

## Component Responsibilities

| Component | File | Type | Responsibility |
|-----------|------|------|----------------|
| `RootLayout` | `src/app/layout.js` | Server | Wraps all pages; exports root metadata; renders ThemeProvider, Navbar, Footer |
| `ThemeProvider` | `src/components/providers/ThemeProvider.js` | Client | Wraps next-themes; must be Client Component; adds/removes `.dark` on `<html>` |
| `Navbar` | `src/components/layout/Navbar.js` | Client | Navigation links; mobile menu toggle state; ThemeToggle button |
| `Footer` | `src/components/layout/Footer.js` | Server | Email + social links from `lib/config.js` |
| `Hero` | `src/components/ui/Hero.js` | Client (likely) | 21st.dev hero — copy-paste source; adapt classes to solarpunk tokens |
| `ProjectCard` | `src/components/ui/ProjectCard.js` | Server | Single project: image, title, description, tech tags, links |
| `TimelineItem` | `src/components/ui/TimelineItem.js` | Server | Single career milestone: date, role, company, description |
| `HomePage` | `src/app/page.js` | Server | Renders Hero; no data fetching |
| `AboutPage` | `src/app/about/page.js` | Server | Maps `timeline.js` to TimelineItem components; exports metadata |
| `PortfolioPage` | `src/app/portfolio/page.js` | Server | Maps `projects.js` to ProjectCard components; exports metadata |
| `ContactPage` | `src/app/contact/page.js` | Server | Static email + social links display; exports metadata |

---

## Data Flow

### Build-time (static generation — no server, no API)

```
lib/config.js (site constants)
    ↓ import
Navbar.js, Footer.js, layout.js metadata

lib/data/projects.js (JS array)
    ↓ import
src/app/portfolio/page.js
    ↓ .map()
ProjectCard.js × 3
    ↓
Static HTML via next build → Vercel CDN

lib/data/timeline.js (JS array)
    ↓ import
src/app/about/page.js
    ↓ .map()
TimelineItem.js × N
    ↓
Static HTML via next build → Vercel CDN
```

### Runtime theme toggle (client-side only)

```
User clicks ThemeToggle button
    ↓
useTheme().setTheme('dark')
    ↓
next-themes writes 'dark' to localStorage
    ↓
next-themes adds/removes .dark class on <html>
    ↓
@custom-variant dark activates dark: utilities
    ↓
CSS variables in .dark block override :root variables
    ↓
Colors switch instantly, no page reload
```

---

## Integration Points

### Server-to-Client Component boundaries

| Boundary | Pattern | Notes |
|----------|---------|-------|
| `layout.js` → `ThemeProvider` | Server imports Client | Valid. Server Components can import Client Components. ThemeProvider receives `children` as a prop. |
| `ThemeProvider` → `Navbar` | Client wraps Client | Both Client Components. Normal React tree. |
| `layout.js` → `Footer` | Server renders Server | No boundary crossing. |
| `page.js` → `Hero` | Server imports Client | Valid. Hero is likely `'use client'` for animations. Server Component passes no functions as props. |
| `page.js` → `ProjectCard` | Server imports Server | Both Server Components. ProjectCard receives serializable props from page. |

### Shared data across components

| Data | Source | Consumers |
|------|--------|-----------|
| Site name, email | `lib/config.js` | layout.js (metadata), Footer.js, contact/page.js |
| Nav links | `lib/config.js` | Navbar.js |
| Social URLs | `lib/config.js` | Footer.js, contact/page.js |
| Project entries | `lib/data/projects.js` | portfolio/page.js |
| Timeline entries | `lib/data/timeline.js` | about/page.js |
| OG image reference | `lib/metadata.js` | layout.js, each page's metadata export |

---

## Anti-Patterns

### Anti-Pattern 1: Adding `'use client'` to page.js to accommodate Hero

**What people do:** The 21st.dev hero has `'use client'`, so they add `'use client'` to `src/app/page.js` as well.

**Why it's wrong:** Making a page a Client Component means its entire subtree loses Server Component benefits. It increases JS bundle and prevents proper static generation.

**Do this instead:** Leave `page.js` as a Server Component. Import `Hero.js` (which has `'use client'`) directly. Next.js handles the server/client boundary at the Hero component boundary, not the page boundary.

### Anti-Pattern 2: Placing ThemeProvider in a Server Component without the wrapper

**What people do:** Import `ThemeProvider` from `next-themes` directly in `layout.js` (which is a Server Component).

**Why it's wrong:** `next-themes`'s `ThemeProvider` uses React context internally — it is a Client Component. Importing it directly in a Server Component without a `'use client'` wrapper causes a build error.

**Do this instead:** Create `src/components/providers/ThemeProvider.js` with `'use client'` at the top. Wrap `NextThemesProvider` from next-themes inside this file. Import this wrapper from layout.js.

### Anti-Pattern 3: Skipping `metadataBase` in layout.js

**What people do:** Set OG image as `/images/og-image.jpg` without setting `metadataBase`.

**Why it's wrong:** Social platforms (LinkedIn, Twitter) try to fetch the OG image using the raw URL. A relative URL like `/images/og-image.jpg` is not a valid absolute URL — the image will never load in link previews.

**Do this instead:** Set `metadataBase: new URL('https://tymurbondar.com')` in root layout.js metadata. Then relative OG image paths are automatically resolved to absolute URLs.

### Anti-Pattern 4: Defining `@theme` tokens that shadow Tailwind defaults without intent

**What people do:** Name custom colors with names that conflict with Tailwind's built-in palette (`--color-green-500`, `--color-gray-900`).

**Why it's wrong:** Overwrites Tailwind's default scale for that color, breaking any component (including the 21st.dev hero) that uses the default color utilities.

**Do this instead:** Use unique names (`--color-forest`, `--color-bark`, `--color-canopy`) that do not exist in Tailwind's default palette. The full default palette remains available alongside custom tokens.

### Anti-Pattern 5: Rendering ThemeToggle without a `mounted` guard

**What people do:** Render the sun/moon icon or theme label based on `useTheme().theme` immediately on first render.

**Why it's wrong:** On the server and initial hydration, `theme` is `undefined` (next-themes cannot know the theme server-side). The server renders one state, the client renders another — React hydration error.

**Do this instead:** Use a `mounted` state initialized to `false`, set to `true` in `useEffect`. Only render the toggle UI when `mounted` is `true`. Render `null` or a placeholder before mount.

---

## Sources

- [Tailwind CSS v4 Theme Docs](https://tailwindcss.com/docs/theme) — HIGH confidence, official documentation
- [Tailwind v4 Dark Mode](https://tailwindcss.com/docs/dark-mode) — HIGH confidence, official documentation
- [next-themes GitHub](https://github.com/pacocoursey/next-themes) — HIGH confidence, official repository
- [Next.js generateMetadata Docs](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) — HIGH confidence, official docs, fetched 2026-03-03 (version 16.1.6)
- [Next.js Sitemap Docs](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap) — HIGH confidence, official documentation
- [Next.js Robots Docs](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots) — HIGH confidence, official documentation
- [Next.js Image Optimization](https://nextjs.org/docs/app/getting-started/images) — HIGH confidence, official documentation
- [21st.dev](https://21st.dev) — MEDIUM confidence, official site (copy-paste model confirmed)
- [Implementing Dark Mode Tailwind v4 + next-themes](https://jianliao.github.io/blog/tailwindcss-v4) — MEDIUM confidence, verified against official docs
- [Theming in Tailwind CSS v4 (Medium)](https://medium.com/@sir.raminyavari/theming-in-tailwind-css-v4-support-multiple-color-schemes-and-dark-mode-ba97aead5c14) — MEDIUM confidence, multiple community sources agree
- [Dark Mode Next.js 15 + Tailwind v4 (sujalvanjare.com)](https://www.sujalvanjare.com/blog/dark-mode-nextjs15-tailwind-v4) — MEDIUM confidence, consistent with official docs
- [Tailwind v4 @theme Discussion (GitHub)](https://github.com/tailwindlabs/tailwindcss/discussions/18471) — MEDIUM confidence, Tailwind Labs official discussion thread

---

*Architecture research for: Tymur Bondar portfolio v2.0 — design system, content pages, SEO*
*Researched: 2026-03-03*
