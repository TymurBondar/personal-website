---
phase: "03"
plan: "01"
subsystem: cicd
tags: [eslint, github-actions, lint, ci]
dependency_graph:
  requires: []
  provides: [lint-gate, eslint-flat-config]
  affects: [all-source-files]
tech_stack:
  added: [eslint@9, eslint-config-next, typescript]
  patterns: [eslint-flat-config, defineConfig, github-actions-workflow]
key_files:
  created:
    - eslint.config.mjs
    - .github/workflows/lint.yml
  modified:
    - package.json
    - yarn.lock
decisions:
  - Downgraded from ESLint 10 to ESLint 9 — eslint-config-next not yet compatible with ESLint 10 API changes (addGlobals missing)
  - Added typescript as dev dep — required peer dependency for eslint-config-next even in JS-only projects
  - Used --ignore-engines flag for yarn install — Node 23.10.0 outside supported range of @eslint/plugin-kit@0.6.0
metrics:
  duration: 2min
  completed: "2026-03-03"
---

# Phase 03 Plan 01: ESLint 9 Flat Config and Lint Gate Summary

ESLint 9 flat config with eslint-config-next/core-web-vitals preset, GitHub Actions lint gate on push/PR to main.

**Status:** Complete
**Commits:** f2244e1, b32aa4d

## What Was Done

- **Task 1:** Installed eslint@9, eslint-config-next, and typescript (required peer dep) as dev dependencies. Created eslint.config.mjs using defineConfig pattern with core-web-vitals preset and globalIgnores for .next/out/build. Updated package.json lint script from "next lint" to "eslint .". Resolved compatibility issue where ESLint 10 was initially installed but is incompatible with eslint-config-next due to missing addGlobals API.
- **Task 2:** Created .github/workflows/lint.yml with push/PR triggers on main branch. Workflow uses actions/checkout@v4, actions/setup-node@v4 with Node 20 and yarn cache, then runs yarn install --frozen-lockfile and npx eslint .

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Downgraded from ESLint 10 to ESLint 9**
- **Found during:** Task 1 verification
- **Issue:** ESLint 10.0.2 (latest at time of install) is incompatible with eslint-config-next — TypeError: scopeManager.addGlobals is not a function
- **Fix:** Ran `yarn add --dev eslint@9 --ignore-engines` to pin ESLint to v9
- **Files modified:** package.json, yarn.lock
- **Commit:** f2244e1

**2. [Rule 3 - Blocking] Installed TypeScript as peer dependency**
- **Found during:** Task 1, first ESLint run
- **Issue:** eslint-config-next bundles typescript-eslint which requires TypeScript to be installed even for JS projects
- **Fix:** Ran `yarn add --dev typescript --ignore-engines`
- **Files modified:** package.json, yarn.lock
- **Commit:** f2244e1

**3. [Rule 3 - Blocking] Used --ignore-engines for all installs**
- **Found during:** Initial yarn add
- **Issue:** Node 23.10.0 is outside the supported range of @eslint/plugin-kit@0.6.0 (requires ^20.19.0 || ^22.13.0 || >=24)
- **Fix:** Added --ignore-engines flag to bypass engine check — Node 23 works functionally
- **Files modified:** yarn.lock
- **Commit:** f2244e1

## Requirements Completed

- CICD-01: GitHub Actions lint workflow
- CICD-02: ESLint 9 with flat config

## Self-Check: PASSED
- [x] eslint.config.mjs exists with defineConfig
- [x] package.json lint script is "eslint ."
- [x] npx eslint . runs without config errors (exit code 0)
- [x] .github/workflows/lint.yml exists and is valid YAML
- [x] No .eslintrc* files exist
