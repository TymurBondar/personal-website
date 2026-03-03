# Pitfalls Research

**Domain:** Personal portfolio — design system, content pages, SEO on existing Next.js 15 + Tailwind v4 site
**Researched:** 2026-03-03
**Confidence:** HIGH — verified against official Next.js docs, Tailwind v4 docs, and multiple corroborating sources

---

## Critical Pitfalls

### Pitfall 1: `@theme inline` Dark Mode Color Tokens Baked at Build Time

**What goes wrong:**
When defining dark-mode-aware semantic color tokens using `@theme inline` (the pattern that aliases `--color-bg: var(--bg)` where `.dark { --bg: #111 }` overrides the raw variable), Tailwind v4 bakes the variable _values_ into generated utilities at build time. This means `bg-background` computes to the light value and does not update when the `.dark` class is toggled at runtime. Dark mode appears broken — the page uses light colors regardless of the class.

**Why it happens:**
Developers follow the `@theme inline` pattern from shadcn documentation without understanding the key constraint: `@theme inline` resolves variable _references_ at build time for some utility generation paths. When dark mode toggles a CSS variable and the utility was compiled against the initial value, no update propagates.

**How to avoid:**
Use the two-step approach: define raw values in `:root` and `.dark` blocks, then alias into `@theme` using CSS variables — but verify by testing actual runtime theme switching. The confirmed working pattern in Tailwind v4:

```css
@import "tailwindcss";

/* Step 1: raw values per mode */
:root {
  --bg: oklch(0.12 0.02 120);    /* dark bg for dark-first solarpunk */
  --fg: oklch(0.92 0.01 120);
}
.light {
  --bg: oklch(0.96 0.01 120);
  --fg: oklch(0.18 0.02 120);
}

/* Step 2: alias into @theme so utilities are generated */
@theme inline {
  --color-bg: var(--bg);
  --color-fg: var(--fg);
}

/* Step 3: declare class-based dark variant */
@custom-variant dark (&:where(.dark, .dark *));
```

Test dark toggling on a local dev server immediately — do not assume it works before testing.

**Warning signs:**
- Dark mode toggle visually fires (class applied to `<html>`) but colors do not change
- Colors match only the default (pre-toggle) value
- Stale `.next` cache causing phantom style issues — delete `.next/` and restart dev server

**Phase to address:** Design System phase (color tokens + dark mode must be built and verified together as a unit before any other components are styled)

---

### Pitfall 2: Flash of Wrong Theme (FOWT) Without Blocking Inline Script

**What goes wrong:**
The dark/light toggle stores user preference in `localStorage`. On page load, Next.js SSR renders the HTML without knowing the user's saved preference (localStorage is browser-only). React hydrates on the client, then JavaScript reads localStorage and applies the correct class. This creates a visible flash: the page renders in the wrong theme for ~100–300ms before the correct class is applied.

**Why it happens:**
`localStorage` is not accessible during SSR. Any theme state read from `localStorage` runs after the browser paints, causing a FOUC/FOWT. Adding `"use client"` to a ThemeProvider does not prevent this — even client components are pre-rendered on the server.

**How to avoid:**
Inject a blocking inline script in the `<head>` that runs _before_ the browser paints. In Next.js 15 App Router, add it inside `<head>` in `layout.js`:

```jsx
// layout.js
export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            var theme = localStorage.getItem('theme');
            var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (theme === 'dark' || (!theme && prefersDark)) {
              document.documentElement.classList.add('dark');
            }
          })();
        `}} />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

`suppressHydrationWarning` is required on `<html>` because the class attribute will differ between server render and client hydration.

**Warning signs:**
- White flash before dark theme applies on page load
- In Lighthouse traces: class applied to `<html>` _after_ first paint
- Theme "snaps" rather than being present from the initial render

**Phase to address:** Dark mode implementation — must include this blocking script, not just the toggle UI

---

### Pitfall 3: `usePathname` Forces Entire Navbar Into Client Bundle

**What goes wrong:**
To show active link state in the Navbar, developers add `usePathname()` at the top of `Navbar.js` and add `"use client"` to that file. This converts the entire Navbar into a client component, pulling all its imports into the JS bundle. Any data fetching or static content in the Navbar is now client-side and loses SSR benefits.

**Why it happens:**
`usePathname()` is a React hook and requires a client component. The simplest fix appears to be marking the whole Navbar client — but this is a poor RSC boundary placement.

**How to avoid:**
Extract only the interactive link logic into a small `NavLink` client component. The outer Navbar wrapper stays a Server Component:

```jsx
// components/NavLink.js  ("use client")
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLink({ href, children }) {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={isActive ? "text-emerald-400 font-semibold" : "text-gray-300 hover:text-white"}
    >
      {children}
    </Link>
  );
}

// components/Navbar.js  (Server Component — no "use client")
import NavLink from "./NavLink";
export default function Navbar() {
  return (
    <nav>
      <NavLink href="/">Home</NavLink>
      <NavLink href="/about">About</NavLink>
    </nav>
  );
}
```

**Warning signs:**
- `"use client"` at the top of `Navbar.js` (not `NavLink.js`)
- Bundle analysis shows Navbar pulling in large dependencies client-side
- No `aria-current="page"` on the active link (accessibility regression)

**Phase to address:** Navigation phase — establish this RSC boundary from the start, not as a refactor

---

### Pitfall 4: Missing `metadataBase` Breaks All OG Images in Production

**What goes wrong:**
Social platforms (LinkedIn, Twitter/X, Slack, Discord) cannot fetch OG images from relative URLs. Without `metadataBase` set in the root layout's `metadata` export, every OG image URL becomes relative (`/og-image.png`) rather than absolute (`https://tymur.dev/og-image.png`). Social previews show a broken image or no image at all — a critical first impression failure for a professional portfolio.

**Why it happens:**
In development, preview tools often resolve relative URLs against localhost. The bug is invisible locally and only surfaces when the site is shared on social platforms after production deployment.

**How to avoid:**
Add `metadataBase` to the root `layout.js` metadata export before any OG image work begins:

```js
export const metadata = {
  metadataBase: new URL("https://tymur.dev"), // production URL
  title: "Tymur Bondar",
  description: "...",
  openGraph: {
    images: ["/og-image.png"], // this becomes absolute via metadataBase
  },
};
```

Validate using `opengraph.xyz` or the LinkedIn post inspector against the production URL — not localhost.

**Warning signs:**
- OG image `<meta>` tag shows a relative path (`content="/og-image.png"`)
- LinkedIn share preview shows no image
- Pasting URL in Slack shows no thumbnail

**Phase to address:** SEO phase — set `metadataBase` as the first SEO task, before adding any images

---

### Pitfall 5: JSON-LD XSS via Unescaped `<` Characters

**What goes wrong:**
Injecting JSON-LD via `dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}` creates an XSS vector. If any string value in the schema object contains `</script>`, the browser's HTML parser terminates the `<script>` tag early, allowing arbitrary HTML injection. For a portfolio, this is LOW severity (no user-controlled content), but it is still a code quality failure and validation tools flag it.

**Why it happens:**
`JSON.stringify` produces valid JSON but does not escape HTML-sensitive characters. The string `"</script>"` inside JSON becomes a literal script-closing tag in the browser's HTML stream.

**How to avoid:**
Always escape `<` when embedding JSON-LD:

```jsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
  }}
/>
```

This is the pattern recommended in official Next.js documentation.

**Warning signs:**
- JSON-LD script tag contains literal `</script>` strings
- Schema validators report "invalid script termination" warnings
- Missing `.replace(/</g, "\\u003c")` in the dangerouslySetInnerHTML call

**Phase to address:** SEO phase — apply to every JSON-LD component on creation

---

### Pitfall 6: 21st.dev Hero Components Expect `framer-motion` and Tailwind v3 Conventions

**What goes wrong:**
21st.dev components are copy-paste React components, not an installed package. Many hero components in that ecosystem (and peer libraries like Aceternity UI, hover.dev) depend on `framer-motion` for animations. If the component is pasted without installing `framer-motion`, the build fails with a module-not-found error. Additionally, many components use Tailwind v3-style arbitrary values or class name patterns that do not map cleanly to v4's CSS-first approach — specifically, the `tailwind.config.js` customization pattern.

**Why it happens:**
Components are authored against the library ecosystem at time of creation. The 21st.dev site may run on Next.js internally but individual components are author-maintained and may lag behind Tailwind v4 adoption.

**How to avoid:**
Before pasting any 21st.dev component:
1. Read the component source fully — identify every import. Note any `framer-motion`, `clsx`, `tailwind-merge`, or `@radix-ui` imports.
2. Install only what is actually needed: `npm install framer-motion` if animations are required.
3. Check for arbitrary Tailwind values that reference `theme()` calls or JS config (e.g., `bg-[color:var(--brand)]` vs `bg-brand`) — v4 handles these differently.
4. If `framer-motion` conflicts with existing Tailwind `transition-*` classes, remove conflicting `transition-` utilities from the pasted component (Motion animates via inline styles which override class-based transitions, causing stuttery animations when both exist).

**Warning signs:**
- Build error: `Module not found: Can't resolve 'framer-motion'`
- Animation looks stuttery or snaps unexpectedly (transition class conflict with Motion)
- Hero colors do not respond to solarpunk CSS token overrides

**Phase to address:** Hero integration phase — dependency audit before paste, token alignment after paste

---

### Pitfall 7: Portfolio Images Causing CLS Without Explicit Dimensions

**What goes wrong:**
Adding project screenshots (Rover Team YOLOv5 images) as `<img>` tags or `<Image>` without explicit `width`/`height` causes the browser to allocate zero space until the image loads. When the image downloads, it pushes surrounding content down — a Cumulative Layout Shift (CLS) penalty that directly hurts Core Web Vitals scores and Lighthouse performance ratings.

**Why it happens:**
When images are added quickly (copying from a source), developers often use the raw `<img>` tag or forget the required props. Next.js's `<Image>` component requires either explicit `width`/`height` or the `fill` prop with a sized parent container — neither is the default in quick copy-paste.

**How to avoid:**
For static local images (stored in `/public`), use a static import to let Next.js auto-detect dimensions:

```jsx
import roverImage from "/public/images/rover-yolo.jpg";
import Image from "next/image";

<Image src={roverImage} alt="YOLOv5 object recognition on Rover Team robot" />
```

For images where dimensions cannot be detected statically, use `fill` with a sized parent:

```jsx
<div className="relative aspect-video w-full">
  <Image src="/project-screenshot.png" alt="..." fill className="object-cover" />
</div>
```

Never use raw `<img>` for portfolio images. Add `priority={true}` to the hero image (first visible image on the page).

**Warning signs:**
- ESLint `@next/next/no-img-element` warning (enforced by `next/core-web-vitals`)
- Lighthouse CLS score above 0.1
- Page content visibly jumps as images load during development
- `<Image>` used without `width`/`height` and without `fill` prop

**Phase to address:** Portfolio page phase — image handling pattern established before any images are added

---

## Technical Debt Patterns

Shortcuts that seem reasonable but create long-term problems.

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Define colors with raw hex in body styles (current state) | Works immediately | Does not generate Tailwind utilities; bypasses token system; `text-bg`, `border-bg` classes won't exist | Only as interim (current) — replace in Design System phase |
| Add `"use client"` to entire Navbar for `usePathname` | Simpler code | Entire Navbar tree goes client-side, bloating JS bundle | Never — extract only the active-link logic |
| Skip `suppressHydrationWarning` on `<html>` | Fewer lines | React throws hydration error when dark class differs between SSR and CSR | Never when using class-based theme toggle |
| Use raw `<img>` for "just one" portfolio image | Faster initial coding | CLS violation, no lazy loading, no WebP format, ESLint error | Never — `next/image` is the only correct approach |
| Skip `metadataBase` and test OG locally | OG tags appear valid in dev | OG images silently break as relative URLs in production social sharing | Never — set from the first SEO commit |
| Install a full component library (shadcn, HeroUI) for one hero | Convenient | DaisyUI removal was done for good reasons; adding another opinionated library repeats the same tradeoff | Never — copy-paste the single 21st.dev component instead |
| Define all dark mode colors with `!important` | Overrides conflicts immediately | Makes future style changes require `!important` too; cascade layers provide the same result cleanly | Never — use `@layer` and `@custom-variant` |

---

## Integration Gotchas

Common mistakes when connecting external dependencies or services.

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| 21st.dev hero component | Paste component without checking imports, then get a broken build | Read source fully, install deps (`framer-motion` if needed), then paste |
| `next-themes` (if used for dark mode) | Wrapping entire layout in ThemeProvider without a separate `"use client"` wrapper | Create `Providers.js` with `"use client"`, export `ThemeProvider` from it, import only that in layout |
| `framer-motion` + Tailwind `transition-*` | Applying `transition-all` or `transition-colors` to the same element Motion animates | Remove Tailwind `transition-` classes from Motion-animated elements — Motion uses inline styles |
| `next/image` + external images (Rover Team, Spelling Bee) | Forgetting to add external domains to Next.js image config | Add `images.remotePatterns` in `next.config.js` for any `src` URLs not from `/public` |
| OG image with `opengraph-image.js` | Using a local font in the OG image without including it via `fetch` | OG images use a Node.js environment — use `satori` font loading pattern from official Next.js docs |
| Google Search Console | Deploying sitemap but not submitting it | After first production deploy, submit `https://tymur.dev/sitemap.xml` to Search Console |
| `sitemap.ts` missing static pages | Auto-generating sitemap only catches dynamic routes | Explicitly list `/`, `/about`, `/portfolio`, `/contact` with appropriate `priority` and `changeFrequency` |

---

## Performance Traps

Patterns that hurt Core Web Vitals immediately, not at scale.

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| `"use client"` on Navbar | Full Navbar (all links, logo, layout) in client JS bundle | Extract only `NavLink` as client component | Immediate — every page load costs extra JS parse |
| Dark mode toggle without blocking inline script | White flash for 100–300ms before dark theme applies | Blocking `<script>` in `<head>` before first paint | Immediate — visible on every page load with saved dark preference |
| Portfolio `<img>` without dimensions | Page content jumps as images load (CLS > 0.1) | `next/image` with static import or explicit dimensions | Immediate — visible during every page load |
| `priority` prop missing on hero image | Hero image lazy-loads, hurting LCP | Add `priority={true}` to the first visible image on each page | Immediate — LCP degrades, Lighthouse scores drop |
| `framer-motion` imported at component level | `framer-motion` ships to all routes that import the hero | Use `next/dynamic` with `{ ssr: false }` for heavy animated components | When hero is server-rendered — causes hydration error if Motion uses browser APIs |
| Importing font multiple times | Two copies of Inter in the bundle | Define font once in `layout.js`, apply via `inter.className` on `<body>` | Immediately increases bundle size |
| CSS variables defined in `:root` without `@theme` mapping | Variables exist but no Tailwind utilities generated for them | Always map `:root` variables through `@theme` if you want `bg-*`, `text-*` utility classes | During Design System phase — classes work but utilities don't exist |

---

## UX Pitfalls

Common user experience mistakes specific to this portfolio's context.

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Active nav link has no visual indicator | User cannot tell what page they are on; navigation feels broken | Add `aria-current="page"` plus a visible active style (underline, color change, font weight) |
| Mobile hamburger menu opens but cannot be closed by keyboard | Screen reader and keyboard users are trapped; WCAG 2.1 failure | `<button>` with `aria-expanded`, `aria-controls`, and focus management on open/close |
| Dark mode toggle has no accessible label | Screen reader announces "button" with no context | Add `aria-label="Toggle dark mode"` and `aria-pressed={isDark}` to the toggle button |
| Career timeline renders as flat list without visual hierarchy | Timeline entries blur together; the story of career progression is lost | Use `<time dateTime="...">` for dates, strong visual separation between entries, and a vertical line element |
| Portfolio project cards with no "live link" or "code link" | Recruiter cannot evaluate the work without extra searching | Every project card needs at minimum: title, description, tech stack, and one link (live site or repo) |
| OG image uses default Next.js placeholder | Social preview shows site name only, no visual | Create a minimal `opengraph-image.js` with solarpunk background + name + role |

---

## "Looks Done But Isn't" Checklist

Things that appear complete but are missing critical pieces.

- [ ] **Color tokens:** `bg-bg` and `text-fg` utilities work — verify dark mode actually switches values at runtime (not just the class on `<html>`)
- [ ] **Dark mode toggle:** Toggle button appears and fires — verify no white/light flash on page load with dark preference saved in localStorage
- [ ] **OG tags:** Metadata export includes `openGraph` — verify actual `<meta>` output has absolute URLs by checking page source in production
- [ ] **JSON-LD:** `<script type="application/ld+json">` appears in source — verify output with Google's Rich Results Test (paste JSON, not URL)
- [ ] **Sitemap:** `/sitemap.xml` returns XML — verify it contains all four routes: `/`, `/about`, `/portfolio`, `/contact`
- [ ] **Portfolio images:** Images display — verify Lighthouse CLS score is below 0.1 and no `<img>` elements outside `next/image` exist
- [ ] **Active nav:** Nav links visible — verify `aria-current="page"` is on the active link (check with browser DevTools accessibility inspector)
- [ ] **Mobile nav:** Hamburger appears on small screens — verify keyboard can open, navigate within, and close the menu without mouse
- [ ] **21st.dev hero:** Component renders — verify solarpunk colors from `@theme` are actually applied (not the component's own default colors)
- [ ] **fonts:** Inter loads — verify no FOUT by checking Lighthouse for `font-display` warnings

---

## Recovery Strategies

When pitfalls occur despite prevention, how to recover.

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| `@theme inline` dark mode not switching | MEDIUM — structural CSS change | Refactor to the two-step pattern (`:root`/`.dark` raw vars, then `@theme` aliases); test locally before pushing |
| FOWT (white flash on dark page load) | LOW — script injection | Add blocking inline script to `<head>` in `layout.js`; add `suppressHydrationWarning` to `<html>` |
| `metadataBase` missing, OG URLs broken | LOW — one-line fix | Add `metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL)` to root metadata; redeploy |
| JSON-LD fails Google validation | LOW — regex fix | Add `.replace(/</g, "\\u003c")` to every `JSON.stringify(schema)` call; validate again |
| `framer-motion` missing for hero component | LOW — install package | `npm install framer-motion`; if SSR issues arise, wrap component in `next/dynamic` with `ssr: false` |
| Portfolio image CLS | LOW — prop addition | Add explicit `width`/`height` or convert to `fill` with aspect-ratio wrapper; check with Lighthouse |
| Navbar fully client-side | MEDIUM — component refactor | Extract `NavLink` client component; convert Navbar back to Server Component; verify bundle size improves |
| Sitemap missing routes | LOW — array update | Add missing routes to `sitemap.ts` return array; re-submit to Search Console |

---

## Pitfall-to-Phase Mapping

How roadmap phases should address these pitfalls.

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| `@theme inline` dark mode baked at build time | Design System — color tokens | Runtime toggle switches colors visually on local dev server |
| Flash of wrong theme | Dark Mode — blocking script | Hard refresh with dark preference saved shows correct theme immediately (no flash) |
| Navbar fully client-side | Navigation — RSC boundary | Only `NavLink.js` has `"use client"` directive; Navbar.js does not |
| Missing `metadataBase` | SEO — baseline setup | `view-source:` on production URL shows absolute OG image URL |
| JSON-LD XSS via unescaped `<` | SEO — structured data | `JSON.stringify` output includes `\\u003c` not literal `<` |
| 21st.dev dependency conflicts | Hero Integration — dependency audit | `npm ls framer-motion` shows installed if needed; build succeeds without errors |
| Portfolio CLS from images | Portfolio page | Lighthouse CLS score < 0.1; no raw `<img>` tags in codebase |
| Active nav state missing aria | Navigation phase | Browser accessibility inspector shows `aria-current="page"` on current route link |

---

## Sources

- Tailwind v4 `@theme inline` dark mode caveat: [Tailwind v4 discussion #15083](https://github.com/tailwindlabs/tailwindcss/discussions/15083), [Tailwind v4 theming guide — Medium/Ramin Yavari](https://medium.com/@sir.raminyavari/theming-in-tailwind-css-v4-support-multiple-color-schemes-and-dark-mode-ba97aead5c14) (MEDIUM confidence — Tailwind v4 `@theme inline` behavior confirmed via community issue threads)
- FOWT / FOUC blocking script: [Tailwind CSS dark mode official docs](https://tailwindcss.com/docs/dark-mode), [Next.js dark mode setup — sujalvanjare.com](https://www.sujalvanjare.com/blog/dark-mode-nextjs15-tailwind-v4) (HIGH confidence — official docs confirm inline script approach)
- Hydration mismatch / `suppressHydrationWarning`: [Fixing hydration mismatch — Medium/Pavan Awagan](https://medium.com/@pavan1419/fixing-hydration-mismatch-in-next-js-next-themes-issue-8017c43dfef9), [Next.js 15 dark mode + Tailwind v4 guide — dev.to/darshan_bajgain](https://dev.to/darshan_bajgain/setting-up-2025-nextjs-15-with-shadcn-tailwind-css-v4-no-config-needed-dark-mode-5kl) (HIGH confidence — multiple sources agree)
- `usePathname` requiring client component: [Next.js official `usePathname` docs](https://nextjs.org/docs/app/api-reference/functions/use-pathname), [Active links guide — spacejelly.dev](https://spacejelly.dev/posts/how-to-style-active-links-in-next-js-app-router) (HIGH confidence — official docs)
- RSC boundary placement mistakes: [6 RSC performance pitfalls — LogRocket](https://blog.logrocket.com/react-server-components-performance-mistakes), [Next.js Server and Client Component guide](https://nextjs.org/docs/app/getting-started/server-and-client-components) (HIGH confidence — official docs)
- `metadataBase` OG pitfall: [Next.js SEO guide — adeelhere.com](https://www.adeelhere.com/blog/2025-12-09-complete-nextjs-seo-guide-from-zero-to-hero), [Next.js Metadata API docs](https://nextjs.org/docs/app/getting-started/metadata-and-og-images) (HIGH confidence — official docs)
- JSON-LD XSS: [Next.js official JSON-LD guide](https://nextjs.org/docs/app/guides/json-ld), [JSON-LD in Next.js 15 — Medium/Suresh Kumar](https://medium.com/@sureshdotariya/json-ld-in-next-js-15-app-router-product-blog-and-breadcrumb-schemas-f752b7422c4f) (HIGH confidence — official docs confirm pattern)
- 21st.dev / framer-motion conflicts: [Animating with Tailwind CSS — Motion.dev](https://motion.dev/docs/react-tailwind), [HeroUI + Tailwind v4 issue — GitHub discussion #4962](https://github.com/heroui-inc/heroui/discussions/4962) (MEDIUM confidence — 21st.dev not directly documented; inferred from peer ecosystem)
- `next/image` CLS: [Next.js image optimization docs](https://nextjs.org/docs/app/getting-started/images), [Avoid CLS in Next.js — Medium/Nicholas Russell](https://medium.com/@nicholasrussellconsulting/industry-standard-practices-for-rendering-cls-safe-cms-images-in-next-js-bf99fcc8d7e3) (HIGH confidence — official docs)
- Tailwind v4 `@theme` token naming and conflicts: [Tailwind v4 design tokens guide — Medium/Suresh Kumar](https://medium.com/@sureshdotariya/tailwind-css-4-theme-the-future-of-design-tokens-at-2025-guide-48305a26af06), [Tailwind v4 theme variables — official docs](https://tailwindcss.com/docs/theme) (HIGH confidence — official docs)

---
*Pitfalls research for: v2.0 Design & Content — design system, content pages, SEO on Next.js 15 + Tailwind v4*
*Researched: 2026-03-03*
