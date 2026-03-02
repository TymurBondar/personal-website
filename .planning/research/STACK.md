# Stack Research

**Domain:** Personal portfolio website (software engineer)
**Researched:** 2026-03-02
**Confidence:** HIGH (all recommendations verified against official docs and npm registry)

## Context

Modernizing an existing Next.js 14.1.4 site. Stack constraints from PROJECT.md:
- Keep Next.js + Tailwind CSS. No new frameworks.
- Stay on Vercel. Remove DaisyUI.
- Keep JavaScript (no TypeScript migration).
- One 21st.dev hero component (copy-paste, no package install).
- Essential CI/CD only: linting + auto-deploy on push to main.

---

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Next.js | 15.x (latest 15.x) | React framework, routing, SSG | v15 is stable, production-ready. v16 requires Node 20.9+ and has breaking async API changes that are harder to migrate — v15 is the right upgrade target for this project. v14.1.4 has a known security CVE (React Server Components). Automated codemod handles most migration work. |
| React | 19.x | UI rendering | Required by Next.js 15. React 19 is stable. Ships React Compiler support. |
| Tailwind CSS | 4.2.1 | Utility-first styling | v4 is the 2025/2026 standard. Zero-config content detection, no tailwind.config.js needed, CSS-first `@theme` configuration. Autoprefixer is built-in. Dramatically faster builds (5x full, 100x+ incremental). Single `@import "tailwindcss"` replaces old `@tailwind` directives. |
| @tailwindcss/postcss | 4.2.1 | PostCSS integration for Tailwind v4 | In v4, the PostCSS plugin was extracted into a separate package. Required alongside tailwindcss for Next.js integration. |

### Infrastructure

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Vercel (native GitHub integration) | N/A | Hosting + auto-deploy | Already in use. Native GitHub integration (not GitHub Actions) is the correct approach for a personal portfolio: zero-configuration, auto-deploys on push to main, Preview URLs on PRs. GitHub Actions adds unnecessary complexity with no benefit for a static portfolio. |
| Node.js | 20.x (LTS) | Runtime | Next.js 15 minimum is 18.18; Node 20.x is LTS and compatible. The `@tailwindcss/upgrade` codemod requires Node 20+. Use 20.x for CI consistency. |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| ESLint 9 (flat config) | Linting | ESLint v9 flat config (`eslint.config.mjs`) is the 2025/2026 standard. Next.js 16 already removed `next lint`; getting ahead of this now makes sense. Use `@next/eslint-plugin-next` + `eslint` directly. |
| @next/eslint-plugin-next | Next.js-specific lint rules | Catches RSC violations, missing alt text, invalid href, etc. |
| GitHub Actions | CI (lint check on push) | Run `eslint .` before merging. Vercel native integration handles the deploy. Actions only needed for the lint gate. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| 21st.dev components | N/A (copy-paste) | Hero section UI | Copy-paste from 21st.dev community registry. No npm install. Paste the component code directly into `app/components/`. User will provide the specific component. |

---

## Installation

```bash
# Upgrade Next.js and React (use codemod for breaking change migration)
npx @next/codemod@canary upgrade latest

# Or manually:
npm install next@latest react@latest react-dom@latest

# Tailwind CSS v4 (replaces tailwindcss@3, daisyui, autoprefixer)
npm uninstall tailwindcss daisyui autoprefixer
npm install -D tailwindcss@latest @tailwindcss/postcss@latest postcss

# ESLint v9 flat config
npm install -D eslint @eslint/js @next/eslint-plugin-next globals
```

**postcss.config.mjs after v4 migration:**
```js
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

**globals.css after v4 migration:**
```css
@import "tailwindcss";

@theme {
  /* Custom design tokens here — replaces tailwind.config.js theme.extend */
}
```

**eslint.config.mjs (minimal flat config):**
```js
import { defineConfig } from 'eslint/config'
import js from '@eslint/js'
import eslintNextPlugin from '@next/eslint-plugin-next'
import globals from 'globals'

export default defineConfig([
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    plugins: { next: eslintNextPlugin },
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      ...eslintNextPlugin.configs.recommended.rules,
    },
  },
  {
    ignores: ['.next/**', 'out/**', 'dist/**'],
  },
])
```

**package.json scripts after migration:**
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint ."
  }
}
```

**GitHub Actions workflow (.github/workflows/ci.yml) — lint gate only:**
```yaml
name: CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: actions/setup-node@v6
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
```

---

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Next.js 15 | Next.js 16 | When project is greenfield, you're on Node 20.9+, and can handle the fully async request API breaking changes (no sync access to cookies/headers/params). For a modernization of an existing codebase, 15 is safer. |
| Tailwind v4 | Tailwind v3 (stay) | Only if supporting Safari < 16.4 or browsers without `@property` support. Not relevant for a modern developer portfolio with modern audience. |
| Vercel native git integration | GitHub Actions for deploy | Only when you need custom pre-deploy gates (test suites, migrations, etc.). Overkill for a static portfolio. |
| ESLint 9 flat config | Prettier + ESLint | Add Prettier if team size > 1 or if codebase has formatting inconsistency issues. Solo project: ESLint only is fine. |
| 21st.dev (copy-paste) | shadcn/ui | Use shadcn/ui if you need more than one or two components and want a consistent system. For a single hero component, copy-paste is lower overhead. |

---

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| DaisyUI | Conflicts with custom minimal design goal; forces opinionated CSS variable naming; creates coupling to their component API even for simple layouts. Being removed per PROJECT.md. | Custom Tailwind utilities + 21st.dev component for hero |
| autoprefixer | Tailwind v4 ships autoprefixer built-in via Lightning CSS. Installing it separately in PostCSS config causes conflicts and slows builds. | Built-in Tailwind v4 behavior — just remove it |
| tailwind.config.js | Tailwind v4 replaced JS config with CSS-first `@theme` directives. Creating a config.js in v4 works but is the legacy path and defeats v4's zero-config philosophy. | `@theme` block in globals.css |
| `@tailwind base/components/utilities` directives | Removed in Tailwind v4. Causes build errors if left in CSS files during migration. | `@import "tailwindcss"` |
| next lint / eslint option in next.config.js | Deprecated in Next.js 15.5, removed in Next.js 16. Getting ahead of this now avoids a future breaking change during upgrade. | `eslint .` directly in scripts and CI |
| GitHub Actions for Vercel deploy | Unnecessary complexity — requires VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID secrets, YAML configuration, and duplicates what Vercel's native integration already does for free. | Vercel native GitHub integration |
| React 18 with Next.js 15 | While technically possible (Next.js 15 maintains Pages Router compat with React 18), App Router in Next.js 15 requires React 19. This project uses App Router. | React 19 |

---

## Stack Patterns by Variant

**For the hero section (21st.dev component):**
- Paste component code directly into `app/components/hero.jsx`
- Component dependencies (framer-motion, etc.) are specified inline — install only what that specific component needs
- Do NOT install full component libraries just to support one component

**For custom styling (replacing DaisyUI):**
- Use Tailwind utility classes directly in JSX
- Define custom design tokens (colors, fonts, spacing scale) in `@theme` block in globals.css
- Avoid CSS modules for simple layout work — Tailwind is sufficient

**For page structure:**
- Continue using App Router (`app/` directory) — already set up and correct approach for Next.js 15
- Static pages only (no server-side data fetching needed for a portfolio)
- Use `export const dynamic = 'force-static'` if any route handler is added

---

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| next@15.x | react@19.x, react-dom@19.x | React 19 is required for App Router in Next.js 15 |
| tailwindcss@4.2.1 | @tailwindcss/postcss@4.2.1 | Always keep versions in sync — they are released together |
| tailwindcss@4.x | postcss@8.x | postcss@8 is still required as the runner |
| eslint@9.x | @next/eslint-plugin-next@15.x | Use matching versions; eslint-config-next is not needed when using the plugin directly |
| Node.js 20.x | next@15.x, @tailwindcss/upgrade | Tailwind upgrade codemod requires Node 20+. Node 20.x is LTS and the safe choice. |

---

## Sources

- [Next.js v15 upgrade guide](https://nextjs.org/docs/app/guides/upgrading/version-15) — async API breaking changes, React 19 requirement, caching defaults (HIGH confidence — official docs, fetched 2026-02-27)
- [Next.js v16 upgrade guide](https://nextjs.org/docs/app/guides/upgrading/version-16) — Node 20.9+ requirement, Turbopack default, ESLint/next lint removal (HIGH confidence — official docs, fetched 2026-02-27)
- [Tailwind CSS v4.0 announcement](https://tailwindcss.com/blog/tailwindcss-v4) — CSS-first config, @tailwindcss/postcss, performance benchmarks (HIGH confidence — official docs)
- [Tailwind CSS + Next.js installation guide](https://tailwindcss.com/docs/guides/nextjs) — verified @tailwindcss/postcss setup, postcss.config.mjs format (HIGH confidence — official docs)
- npm registry: `next` — v16.1.6 current (verified 2026-03-02)
- npm registry: `tailwindcss` — v4.2.1 current (verified 2026-03-02)
- npm registry: `@tailwindcss/postcss` — v4.2.1 current (verified 2026-03-02)
- [Vercel for GitHub docs](https://vercel.com/docs/git/vercel-for-github) — native integration capabilities (HIGH confidence — official docs)
- [Next.js 16 ESLint config](https://nextjs.org/docs/app/api-reference/config/eslint) — flat config, next lint removal (HIGH confidence — official docs)
- [GitHub Actions setup-node@v6](https://github.com/actions/setup-node/tree/v6) — v6 is current with Node 24 default (MEDIUM confidence — verified via GitHub repo)
- [21st.dev hero components](https://21st.dev/community/components/s/hero) — copy-paste model confirmed, no package install (MEDIUM confidence — WebFetch of site)

---

*Stack research for: Personal portfolio website (Next.js modernization)*
*Researched: 2026-03-02*
