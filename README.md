# tymurbondar.com

Personal portfolio of Tymur Bondar — software engineer & AI enthusiast.

Built in the **Swiss International Typographic Style** (SCHRIFT design system):
strict black / white / `#FF3000` palette, visible grid, massive uppercase
typography, no rounded corners, no shadows, no gradients.

## Stack

- Plain HTML + CSS + vanilla JS — no framework, no build step, zero dependencies.
- Inter vendored locally (`assets/fonts/`) — the site runs fully offline.
- Deployed on Vercel as a static site (`vercel.json` enables clean URLs).

## Structure

```
index.html          single-page site (hero / about / portfolio / contact)
assets/styles.css   design tokens + all component styles
assets/app.js       mobile drawer, scroll reveal
assets/fonts/       Inter 400/500/700/900 (woff2)
assets/noise.svg    paper-grain texture
hero-photo.jpg      hero portrait
```

## Develop

No tooling required — open `index.html` directly, or serve the folder:

```
python -m http.server 8000
```
