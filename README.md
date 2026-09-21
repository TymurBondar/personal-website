# tymurbondar.com

A shelf of small apps by Tymur Bondar. Each app lives at its own subdomain
(`name.tymurbondar.com`) as its own project; this repo is only the index page.

Built on the **BONDAR design system**: white paper on a grey table, one deep
green band, ruled registers instead of cards, EB Garamond and Barlow, brass
only in the double rule. No rounded corners, no shadows, no motion.

## Stack

- Plain HTML + CSS — no framework, no build step, no JavaScript, zero dependencies.
- EB Garamond and Barlow vendored locally (`assets/fonts/`).
- Deployed on Vercel as a static site (`vercel.json` enables clean URLs).

## Structure

```
index.html            the page (headline / apps register / about / contact)
assets/styles.css     BONDAR tokens, the bd- components used, site- layout
assets/fonts/         EB Garamond (variable, roman + italic), Barlow 400/500/600
assets/portrait.jpg   about photo
archive/v1/           the previous Swiss-style site, self-contained, noindex
```

## Add an app

In `index.html`, find the `TO ADD AN APP` comment inside the register, copy the
row template, and fill in the number, name, subdomain, one-line description
and year.

## Archive

The previous site ("Websites that make money") is tagged `v1-swiss` and served
unlinked at `/archive/v1`.

## Develop

No tooling required — serve the folder:

```
python3 -m http.server 8000
```
