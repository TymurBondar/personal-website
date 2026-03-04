# Stack Research

**Domain:** Personal portfolio website — v2.0 Design & Content features
**Researched:** 2026-03-03
**Confidence:** HIGH

---

## Context: What Already Exists (Do Not Re-add)

The v1.0 foundation is locked in. These are already installed and working — this document covers only what v2.0 needs on top.

| Technology | Version | Status |
|------------|---------|--------|
| Next.js | 15 (App Router) | Installed |
| React | 19.2.4 | Installed |
| Tailwind CSS | 4.2.1 | Installed |
| @tailwindcss/postcss | 4.2.1 | Installed |
| ESLint | 9 | Installed |
| eslint-config-next | 16.1.6 | Installed |
| Vercel | — | Deployed |

**Key existing config:** CSS-first setup — `globals.css` contains only `@import "tailwindcss"` with no `tailwind.config.js`. This is already the correct Tailwind v4 starting point.

---

## Recommended Stack

### Core Technologies

No new core frameworks are needed. All v2.0 features are satisfied by capabilities already in the stack.

### Supporting Libraries (New Installs)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `next-themes` | `^0.4.6` | Dark/light mode toggle with system preference detection | Only if the dark/light toggle (nice-to-have) is built. Zero-code system preference works without it. |
| `framer-motion` | `^12.x` | Animations for 21st.dev hero component | Only if the chosen 21st.dev hero component requires it. Check component deps before installing. |

**Both are conditional.** The minimum-viable v2.0 requires zero new npm packages. The dark mode toggle and animated hero component each add one dependency if implemented.

### Development Tools

No new dev tools needed. Existing ESLint 9 flat config catches all relevant issues.

---

## Feature Implementation: Built-in Capabilities (No New Packages)

All core v2.0 features work with capabilities already bundled in Next.js 15 and Tailwind CSS v4.

---

### Feature 1: Solarpunk Color Palette via Tailwind @theme

**Mechanism:** Define custom color tokens in `src/app/globals.css` using the `@theme` directive. Tailwind v4 CSS-first — no `tailwind.config.js` needed, and creating one is the legacy path.

**Implementation:**
```css
/* src/app/globals.css */
@import "tailwindcss";

@theme {
  /* Solarpunk palette — forest greens on warm dark backgrounds */

  /* Green scale (emerald/forest) */
  --color-forest-50:  oklch(0.97 0.03 145);
  --color-forest-100: oklch(0.93 0.06 145);
  --color-forest-200: oklch(0.87 0.10 145);
  --color-forest-300: oklch(0.78 0.14 145);
  --color-forest-400: oklch(0.68 0.17 145);
  --color-forest-500: oklch(0.57 0.19 145);  /* base shade */
  --color-forest-600: oklch(0.48 0.17 145);
  --color-forest-700: oklch(0.39 0.14 145);
  --color-forest-800: oklch(0.31 0.10 145);
  --color-forest-900: oklch(0.24 0.06 145);

  /* Accent + backgrounds */
  --color-emerald-accent: oklch(0.72 0.20 155);  /* bright highlight */
  --color-warm-dark:      oklch(0.14 0.02 80);   /* warm near-black bg */
  --color-warm-surface:   oklch(0.19 0.02 80);   /* card/panel bg */
}

/* Replace interim body styles from v1 */
@layer base {
  body {
    background-color: var(--color-warm-dark);
    color: var(--color-forest-100);
  }
}
```

**Result:** Tailwind auto-generates utility classes — `bg-forest-500`, `text-forest-300`, `bg-warm-dark`, `bg-warm-surface`, `text-emerald-accent`. These are CSS custom properties at runtime, not build-time values.

**Why OKLCH:** Perceptually uniform lightness — consistent palette without muddy mid-tones. All modern browsers support it. Tailwind v4 docs recommend it explicitly.

**How to disable default Tailwind colors** (if cleaner output is desired):
```css
@theme {
  --color-*: initial;  /* clears all defaults */
  /* then define only your tokens above */
}
```

**Confidence:** HIGH — verified against Tailwind v4 official docs (tailwindcss.com/docs/colors).

---

### Feature 2: Dark/Light Mode Toggle (Nice-to-Have)

**Decision:** "Defer if complex" per PROJECT.md. The zero-code path (system preference auto-detection) works immediately. The manual toggle adds `next-themes` and a hydration-safe wrapper component.

**Zero-code path (system preference, no dependencies):**

Tailwind v4's default dark mode uses `prefers-color-scheme` automatically. Define dark overrides using `@media`:
```css
@layer base {
  body {
    background-color: var(--color-warm-dark);
    color: var(--color-forest-100);
  }

  @media (prefers-color-scheme: light) {
    body {
      background-color: var(--color-forest-50);
      color: var(--color-forest-900);
    }
  }
}
```
Or use `dark:` utility variants which work automatically with system preference.

**Manual toggle path (requires `next-themes`):**

Step 1 — Enable class-based dark variant in `globals.css`:
```css
@import "tailwindcss";

/* Tailwind v4: replaces deprecated tailwind.config.js darkMode: "class" */
@custom-variant dark (&:where(.dark, .dark *));
```

Step 2 — Install:
```bash
npm install next-themes
```

Step 3 — Create `ThemeProvider` wrapper (Client Component required for App Router):
```jsx
// src/components/ThemeProvider.js
"use client";
import { ThemeProvider as NextThemesProvider } from "next-themes";
export default function ThemeProvider({ children, ...props }) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
```

Step 4 — Wrap `layout.js` body:
```jsx
// src/app/layout.js
import ThemeProvider from "../components/ThemeProvider";

// In the JSX:
<ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
  {children}
</ThemeProvider>
```

Step 5 — Hydration-safe toggle component:
```jsx
"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Delay render until client to avoid hydration mismatch
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      {theme === "dark" ? "Light" : "Dark"}
    </button>
  );
}
```

**Confidence:** HIGH — verified against next-themes npm (v0.4.6 current), Tailwind v4 official dark mode docs, and multiple Next.js 15 implementation guides.

---

### Feature 3: next/image — Portfolio Project Images

**Already installed.** `next/image` is part of Next.js core. The current `page.js` already uses it with `HeroPic.jpg`. No changes needed to `next.config.js` for local image optimization.

**Usage pattern for portfolio project cards:**
```jsx
import Image from "next/image";
import roverTeamImage from "../../../public/projects/rover-team.jpg";

// In a card component:
<Image
  src={roverTeamImage}        // local static import — auto-computes width/height/blurDataURL
  alt="Binghamton Rover Team YOLOv5 object detection in action"
  placeholder="blur"          // uses auto-computed blurDataURL for smooth load
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  className="rounded-lg object-cover w-full h-48"
/>
```

**Key props for portfolio grid:**

| Prop | Usage | Why |
|------|-------|-----|
| `placeholder="blur"` | All portfolio images | Auto-generated for local imports — polished loading UX |
| `sizes` | Grid images | Critical — prevents 9x file size waste on mobile; Tailwind breakpoints map to `640px`, `768px`, `1024px` |
| `priority` | Hero image only (already set) | Preloads LCP image; do not add to below-fold images |
| `fill` | Aspect-ratio containers | Use with `position: relative` parent for consistent card heights |

**What NOT to do:** Do not skip `sizes` on grid images (Next.js defaults to `100vw` which downloads full-width images unnecessarily). Do not use `unoptimized`. Do not use `priority` on images below the fold.

**Confidence:** HIGH — verified against Next.js 15 official image component docs (nextjs.org/docs/app/api-reference/components/image, last updated 2026-02-27).

---

### Feature 4: SEO — Metadata API (OG Tags, Per-Page Titles)

**Already available.** `layout.js` already exports `metadata`. Extend it with `metadataBase` and `openGraph`.

**Root layout** (`src/app/layout.js`):
```js
export const metadata = {
  metadataBase: new URL("https://tymurbondar.com"),  // required for absolute OG URLs
  title: {
    template: "%s | Tymur Bondar",
    default: "Tymur Bondar — Software Engineer",
  },
  description: "Software engineer based in Toronto. CS student at Purdue, building automated AI systems for software engineering and digital marketing.",
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: "https://tymurbondar.com",
    siteName: "Tymur Bondar",
    images: [
      {
        url: "/opengraph-image.jpg",  // file placed in src/app/
        width: 1200,
        height: 630,
        alt: "Tymur Bondar — Software Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
};
```

**Per-page metadata** (each page file):
```js
// src/app/about/page.js
export const metadata = {
  title: "About",         // renders: "About | Tymur Bondar"
  description: "CS student at Purdue University. Software engineer in Toronto passionate about AI systems.",
};
```

**Critical:** `metadataBase` is required. Without it, relative OG image URLs (`/opengraph-image.jpg`) do not resolve and Next.js emits a build warning. Set it to the production domain.

**Confidence:** HIGH — verified against Next.js official metadata docs (nextjs.org/docs/app/getting-started/metadata-and-og-images, last updated 2026-02-27).

---

### Feature 5: SEO — JSON-LD Person Schema

**Already available.** Render as a plain `<script>` tag inside a Server Component. No library needed.

```jsx
// src/app/layout.js (Server Component — no "use client" directive)
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Tymur Bondar",
  url: "https://tymurbondar.com",
  jobTitle: "Software Engineer",
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Purdue University",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Toronto",
    addressCountry: "CA",
  },
  sameAs: [
    "https://github.com/tymurbondar",
    "https://linkedin.com/in/tymurbondar",
  ],
};

// In the layout JSX (inside <head> or anywhere in <body> — both valid):
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
/>
```

**Why plain `<script>` not Next.js `<Script>`:** The `<Script>` component (from `next/script`) causes JSON-LD to appear in the client-side hydration payload — creating unnecessary bundle bloat. A plain `<script>` tag in a Server Component renders at the HTML level and is not hydrated. This is the official Next.js recommendation.

**Why no `schema-dts`:** Adds a dev dependency for type safety not needed in this JavaScript project with a simple, static Person schema.

**Confidence:** HIGH — verified against official Next.js JSON-LD guide (nextjs.org/docs/app/guides/json-ld).

---

### Feature 6: SEO — sitemap.xml

**Already available via Next.js 15.** Create `src/app/sitemap.js`. No `next-sitemap` package needed — the built-in file convention handles all 4 routes cleanly.

```js
// src/app/sitemap.js
export default function sitemap() {
  return [
    {
      url: "https://tymurbondar.com",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: "https://tymurbondar.com/about",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://tymurbondar.com/portfolio",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://tymurbondar.com/contact",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];
}
```

Serves automatically at `/sitemap.xml`. No configuration required.

**Warning:** Do not place a `sitemap.xml` file in `public/` — it will block Next.js from serving the generated version.

**Confidence:** HIGH — verified against Next.js official sitemap docs (nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap).

---

### Feature 7: SEO — robots.txt

**Already available via Next.js 15.** Create `src/app/robots.js`.

```js
// src/app/robots.js
export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://tymurbondar.com/sitemap.xml",
  };
}
```

Serves automatically at `/robots.txt`.

**Confidence:** HIGH — verified against Next.js official robots docs (nextjs.org/docs/app/api-reference/file-conventions/metadata/robots).

---

### Feature 8: Favicon

**Already available via Next.js 15.** Drop files in `src/app/` — Next.js auto-injects the correct `<link>` tags. No code needed.

```
src/app/
  favicon.ico          # Browser tab (required, root app/ only)
  icon.png             # Modern browsers (512x512 recommended)
  apple-icon.png       # iOS home screen (180x180)
  opengraph-image.jpg  # Social share preview (1200x630)
```

**No manual `<link>` tags needed in `layout.js`** — Next.js detects these files by convention.

**Confidence:** HIGH — verified against Next.js official app-icons docs (nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons, last updated 2026-02-27).

---

### Feature 9: Multi-Page Navigation

**Already available.** `next/link` is built-in. The existing `Navbar.js` already uses it.

**Active link styling requires `usePathname`** — this forces `Navbar.js` to become a Client Component:
```jsx
// src/components/Navbar.js
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center justify-between px-4 py-3 bg-warm-dark">
      <Link href="/" className="text-2xl font-bold text-forest-100">
        Tymur Bondar
      </Link>
      <ul className="flex gap-6">
        {links.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              className={pathname === href
                ? "text-emerald-accent font-semibold"
                : "text-forest-300 hover:text-forest-100"
              }
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

**Confidence:** HIGH — built-in Next.js 15 App Router pattern.

---

### Feature 10: 21st.dev Hero Component

**21st.dev is a component marketplace — not an npm package.** Components are copy-paste code built on Tailwind CSS, often with optional Framer Motion animations. No `npm install 21st.dev` exists.

**Integration approach:**
1. Browse `21st.dev/community/components/s/hero` during planning phase
2. Select a hero component that fits the solarpunk aesthetic (dark, organic, minimal)
3. Copy the component code into `src/components/Hero.js`
4. Install any peer dependencies the specific component lists (commonly `framer-motion`)

**Component selection criteria for this project:**
- Works without shadcn/ui primitives (avoid installing full shadcn setup for one component)
- Uses Tailwind utility classes (compatible with our `@theme` tokens)
- Fits dark warm-background aesthetic
- Minimal animation — avoids the "flashy/overdesigned" anti-pattern in PROJECT.md

**If the chosen component uses Framer Motion:**
```bash
npm install framer-motion
```
Framer Motion v12.x is React 19 compatible and tree-shakeable.

**Confidence:** MEDIUM — 21st.dev pages are dynamically rendered; specific component dependencies can only be confirmed when selecting a component during planning. The copy-paste model itself is HIGH confidence (confirmed via multiple sources).

---

## Installation Summary

```bash
# Minimum install for all v2.0 features: ZERO new packages
# All SEO features, @theme colors, next/image, metadata, sitemap, robots
# are built into the existing Next.js 15 + Tailwind v4 stack.

# Optional: dark/light mode manual toggle
npm install next-themes

# Optional: if 21st.dev hero component uses animations
npm install framer-motion
```

---

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Built-in `sitemap.js` file convention | `next-sitemap` npm package | Use `next-sitemap` only if you need sitemap generation from a CMS or database with 1000+ dynamic routes. Overkill for a 4-page static portfolio. |
| Plain `<script>` for JSON-LD | `schema-dts` / `@schemasentry/next` | Use typed libraries if schema complexity grows (multiple entity types, dynamic schemas). Not warranted for a single static Person schema. |
| File-based `favicon.ico` in `app/` | `metadata.icons` JS configuration | The JS config approach works but is redundant when the file convention handles it automatically. |
| OKLCH color space in `@theme` | Hex (#3d7a48) or HSL | OKLCH produces perceptually uniform lightness steps — no muddy grays at mid-tones. Tailwind v4 docs explicitly recommend it. |
| System-preference dark mode (zero-code default) | Full `next-themes` toggle immediately | Start with system preference; add toggle only if user experience requires explicit control. PROJECT.md flags it as "defer if complex." |
| `@custom-variant dark` (Tailwind v4) | `darkMode: "class"` config | `darkMode: "class"` was removed in Tailwind v4. `@custom-variant dark` is the replacement. |

---

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| `tailwind.config.js` for color config | The v4 CSS-first path is `@theme` in CSS. Creating a JS config file works but is the legacy v3 pattern — defeats v4's zero-config design. | `@theme` block in `globals.css` |
| `next-sitemap` npm package | Unnecessary dependency for a static 4-page site. Adds a build step. | `src/app/sitemap.js` file convention (built-in) |
| `darkMode: "class"` configuration | Removed in Tailwind v4 — does not exist. | `@custom-variant dark (&:where(.dark, .dark *))` in CSS |
| `<Script>` component for JSON-LD | Causes hydration payload bloat — JSON-LD gets bundled with JS and hydrated unnecessarily. Active GitHub discussion flagging this as an SEO issue. | Plain `<script>` tag in Server Component with `dangerouslySetInnerHTML` |
| Static `public/sitemap.xml` file | Blocks Next.js from serving the generated dynamic sitemap. Will silently serve the stale static version instead. | `src/app/sitemap.js` dynamic file convention |
| DaisyUI | Already removed in v1.0. Conflicts with custom `@theme` tokens. | Custom Tailwind utilities |
| `next/font` changes | Inter is already loaded correctly in `layout.js`. No changes needed for v2.0. | Leave existing `Inter` setup as-is |

---

## Version Compatibility

| Package | Version | Compatible With | Notes |
|---------|---------|-----------------|-------|
| `next-themes` | `^0.4.6` | Next.js 15 + Tailwind v4 | Requires `"use client"` ThemeProvider; `useTheme` hook needs `mounted` guard against hydration mismatch |
| `tailwindcss` | `4.2.1` | Already installed | `@custom-variant dark` for class toggle; `@theme` for color tokens |
| `framer-motion` | `^12.x` (latest) | React 19 + Next.js 15 | React 19 compatible; install only if chosen hero component requires it |
| Next.js built-in metadata | v15 | App Router only | `export const metadata` and file conventions (sitemap.js, robots.js, favicon.ico) are App Router only — not available in Pages Router |

---

## Sources

- [Tailwind CSS v4 Colors — Official Docs](https://tailwindcss.com/docs/colors) — `@theme` syntax, OKLCH recommendation (HIGH confidence)
- [Tailwind CSS v4 Dark Mode — Official Docs](https://tailwindcss.com/docs/dark-mode) — `@custom-variant dark` syntax replacing `darkMode: "class"` (HIGH confidence)
- [Next.js Metadata and OG Images — Official Docs](https://nextjs.org/docs/app/getting-started/metadata-and-og-images) — metadata export, file conventions, last updated 2026-02-27 (HIGH confidence)
- [Next.js generateMetadata API Reference](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) — full metadata fields including openGraph, twitter, metadataBase (HIGH confidence)
- [Next.js JSON-LD Guide](https://nextjs.org/docs/app/guides/json-ld) — plain script tag pattern, XSS note (HIGH confidence)
- [Next.js sitemap.xml File Convention](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap) — MetadataRoute.Sitemap (HIGH confidence)
- [Next.js robots.txt File Convention](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots) — MetadataRoute.Robots (HIGH confidence)
- [Next.js favicon, icon, apple-icon File Convention](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons) — file-based favicon detection, last updated 2026-02-27 (HIGH confidence)
- [Next.js Image Component API Reference](https://nextjs.org/docs/app/api-reference/components/image) — sizes, placeholder, priority props (HIGH confidence)
- [next-themes on npm](https://www.npmjs.com/package/next-themes) — v0.4.6 current version (HIGH confidence)
- [Dark Mode in Next.js 15 + Tailwind v4 — sujalvanjare.com](https://www.sujalvanjare.com/blog/dark-mode-nextjs15-tailwind-v4) — @custom-variant pattern + next-themes setup (MEDIUM confidence, cross-verified against official docs)
- [21st.dev Hero Components](https://21st.dev/community/components/s/hero) — 73 hero components, copy-paste model (MEDIUM confidence — dynamically rendered page, specific deps require runtime inspection)

---

*Stack research for: Personal portfolio — v2.0 Design & Content features*
*Researched: 2026-03-03*
