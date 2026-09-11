# Folklore vivant — The Chanson Project

Source for the Chanson Project website, a Jekyll site cataloguing early
French-Canadian folk song (*chansons*) with searchable metadata, score
playback, and bilingual (EN/FR) UI.

This codebase was forked from **[The 1520s Project](https://github.com/benory/1520s-project-website)**
(a database of European polyphony ca. 1510–1540) and repurposed for a
different repertoire.

- **Live site:** https://folklore-vivant.humdrum.org
- **License:** [CC BY-NC 4.0](LICENSE)

---

## Contents

- [How the site works](#how-the-site-works)
- [Technology stack](#technology-stack)
- [Directory map](#directory-map)
- [The data pipeline](#the-data-pipeline-google-sheets--github--pages)
- [Internationalization](#internationalization)
- [Audio playback](#audio-playback)
- [Local development](#local-development)
- [Updating content](#updating-content)
- [Deployment](#deployment)

---

## How the site works

There is no application server or database. Every page is a static HTML
file built by Jekyll; all search, filtering, and playback happen in the
browser with plain JavaScript operating on JSON that Jekyll embeds directly
into the page at build time:

```javascript
let METADATA = {% include metadata/works.json %};
```

The catalogue's source of truth is a **Google Spreadsheet**. A Google Apps
Script deployed against that sheet serves its contents as JSON over HTTP;
the site's build process (`make`) downloads that JSON into the repo before
Jekyll builds the HTML. See [The data pipeline](#the-data-pipeline-google-sheets--github--pages)
for the full path from spreadsheet cell to rendered page.

## Technology stack

| Layer | Technology | Notes |
|---|---|---|
| Static site generator | [Jekyll](https://jekyllrb.com/) 4.3.x | Ruby, via Bundler |
| Hosting | GitHub Pages | Custom domain `folklore-vivant.humdrum.org`, configured in repo Settings → Pages (no `CNAME` file checked in) |
| CI/CD | GitHub Actions (`.github/workflows/jekyll.yml`) | Builds and deploys on every push to `main` |
| Metadata source | Google Sheets + Google Apps Script web app | Returns spreadsheet rows as JSON |
| Metadata format | [Humdrum](https://www.humdrum.org/) reference records (`!!!COM`, `!!!OTL@@FR`, etc.) | Field names are configurable, see [Field name mapping](#field-name-mapping) |
| Score encoding | [**kern](https://www.humdrum.org/rep/kern/) files in the sibling [`chanson-project/chanson-encoding`](https://github.com/chanson-project/chanson-encoding) repo | Downloaded/read by the build scripts in `bin/`, not vendored here |
| Client-side search | Hand-written JS (no framework) | Text, composer/origin/collection filters, and melodic ("hum a tune") search over a pitch/scale-degree index |
| Audio playback | Custom `KernPlayer` (Web Audio) + `_includes/Jnsgm2.sf2` soundfont | Renders **kern note tokens to MIDI-ish pitch/duration and plays them |
| i18n | Custom ATON-based translator (`_includes/translations.aton` + `_includes/i18n.html`) | No plugin/gem — pure Liquid + JS, language persisted in `localStorage` |
| Feedback | `mailto:` link | The "Feedback" button opens the visitor's mail client (see `sendFeedback()` in `_includes/header.html`) |

## Directory map

```
_config.yml           Site settings, nav pages, and the Humdrum field-name mapping (see below)
Makefile              Top-level build pipeline: make = download + melodic-index + scans-index
bin/
  build-melodic-index.py   Builds assets/melodic-index.json from the encoding repo
  build-scans-index.py     Builds _includes/metadata/scans.json (work ID → scan PDF URL)
_includes/
  metadata/
    Makefile           Downloads works.json / sources.json from the Apps Script endpoint
    works.json         All catalogued chansons (Humdrum reference-record JSON)
    sources.json       Anthology/collection sources
    scans.json         Work ID → raw GitHub URL of the source scan PDF
  scripts/
    field-names.html    Emits the FIELD/SOURCE_FIELD JS objects from _config.yml's `fields:` map
    getCgiParameters.js  Parses ?c=&o=&x=&q= URL params for the repertoire search
    kern-player.html     KernPlayer — browser playback of **kern data
  styles/               Shared CSS partials
  header.html           Site nav, language toggle, feedback modal
  footer.html           Site footer
  i18n.html             ATON parser + translation application (data-i18n-* attributes)
  translations.aton     All EN/FR UI strings
  Jnsgm2.sf2            Soundfont used for MIDI-ish playback
_layouts/
  work.html             Per-work detail page layout
<page>/                 One directory per top-level page (about, repertoire, work, sources,
                         performances, musicians, education, lesson-plans, sing, laforte,
                         documentation, guide), each with index.markdown/.md,
                         scripts-local.html, scripts-listeners.html, styles-local.html
assets/melodic-index.json  Generated melodic search index (pitches + scale degrees per work)
education-source/       Source Word docs/PDFs used to write the education/ page content
                         (gitignored — not part of the built site)
```

Each page directory follows the same convention described in `CLAUDE.md`:
`index.markdown` (front matter + Liquid body), `scripts-local.html`
(page JS), `scripts-listeners.html` (event wiring), `styles-local.html`
(page CSS). Global chrome (nav, footer, fonts, i18n) lives in `_includes/`.

## The data pipeline: Google Sheets → GitHub → Pages

```
Google Sheet (editors add/edit rows)
        │
        ▼
Google Apps Script, deployed as a Web App  ──  serves rows as JSON at
        │                                        https://script.google.com/macros/s/<SID>/exec
        ▼
`make` (curl)  →  _includes/metadata/{works,sources}.json   [committed to the repo]
        │
        ├─▶ bin/build-melodic-index.py  →  assets/melodic-index.json
        │      (downloads chanson-project/chanson-encoding as a zip, extracts the
        │       primary **kern melodic line per work, converts to pitch classes
        │       and scale degrees relative to each work's key)
        │
        └─▶ bin/build-scans-index.py    →  _includes/metadata/scans.json
               (lists PDFs under bc100/pdf, eg104/pdf, mb157/pdf in the encoding
                repo via the GitHub Contents API, maps work ID → raw file URL)
        │
        ▼
`bundle exec jekyll build`  — Liquid `{% include metadata/*.json %}` inlines
        the JSON as a JS variable (METADATA, etc.) directly into each page's
        <script> block at build time
        │
        ▼
Static HTML/CSS/JS in `_site/`  →  GitHub Pages  (all filtering/search/
        playback happens client-side in the visitor's browser)
```

### Running it

```bash
make               # runs the full pipeline: download + melodic-index + scans-index
# or, individually:
make download      # _includes/metadata/{works,sources}.json only (cd's into _includes/metadata)
make melodic-index # assets/melodic-index.json (needs works.json already downloaded)
make scans-index    # _includes/metadata/scans.json
```

`make download` needs no credentials — the Apps Script endpoint is public.
`melodic-index` and `scans-index` make plain unauthenticated requests to
GitHub (the encoding repo is public), so no token is needed either, though
the GitHub Contents API is rate-limited for anonymous requests.

### If the Apps Script is redeployed

The endpoint URL is pinned by a deployment ID (`SID`) hardcoded in
`_includes/metadata/Makefile`:

```make
SID = AKfycbwGO6_cglQQ9cEbrk38h7U5ovmj_Se6v9IwQohdrvh8fvYSgiPYBJqoVRwUZ4JL53Kl
```

Redeploying the Apps Script (e.g. after editing its code, not just the
spreadsheet data) issues a new deployment ID and breaks this URL. Update
`SID` there to the new value. Editing spreadsheet *data* alone does not
require this — the existing deployment serves live data.

### Field name mapping

The JSON from the spreadsheet uses Humdrum reference-record keys
(`!!!COM`, `!!!OTL@@FR`, `!!!ARE`, …) rather than plain field names. The
mapping from logical name (`composer`, `title`, `origin`, …) to spreadsheet
key lives in one place, `_config.yml`'s `fields:` block, and is compiled
into a JS object by `_includes/scripts/field-names.html`:

```yaml
fields:
  works:
    composer:  "!!!COM"
    title:     "!!!OTL@@FR"
    origin:    "!!!ARE"
    # ...
```

**If the spreadsheet's column headers (Humdrum keys) change, update them
here — nowhere else.** All page scripts read `FIELD.composer`,
`FIELD.origin`, etc., not the raw `!!!...` strings.

### The encoding repository

Score encodings (**kern files) and scan PDFs are *not* stored in this repo
— they live in the sibling repo
[`chanson-project/chanson-encoding`](https://github.com/chanson-project/chanson-encoding).
The build scripts in `bin/` pull from it by downloading a zip of `main`
(melodic index) or listing directories via the GitHub API (scans index).
The footer's "GitHub" link also points at this repo
(`site.github_username: chanson-project/chanson-encoding` in `_config.yml`),
not at this website's own repo.

## Internationalization

There's no Jekyll i18n plugin. `_includes/translations.aton` holds every UI
string in a simple [ATON](https://aton.sapp.org/)-flavored format under two
sections, `@@START:en` / `@@START:fr`. `_includes/i18n.html` Liquid-includes
that file as a JS template literal, parses it in the browser, and exposes:

- `data-i18n="key"` — replaces an element's text content
- `data-i18n-placeholder="key"` — sets an input's placeholder
- `data-i18n-html="key"` — sets innerHTML (for strings containing markup)
- `data-lang="en"` / `data-lang="fr"` — shows/hides whole blocks per language
- `window.t(key)` — look up a string from JS
- `window.setLang(lang)` — switch language (persists in `localStorage`, reloads)

To add or edit UI text, edit `translations.aton` only — add the same key
under both `en` and `fr` sections.

## Audio playback

`_includes/scripts/kern-player.html` defines `KernPlayer`, a small
Web-Audio-based player that converts **kern pitch/duration tokens straight
to playable notes (no MIDI file, no Verovio) and plays them through
`_includes/Jnsgm2.sf2`. Work pages call `KernPlayer.load(kernText)` after
fetching a work's encoding from the `chanson-encoding` repo.

## Local development

```bash
bundle install                       # first time only
bundle exec jekyll serve --incremental --trace --watch --port 8888
# equivalently:
cat .serve   # prints the exact command above
```

Metadata JSON already lives in `_includes/metadata/` (committed), so you
can serve the site immediately without network access. Run `make` first
only if you need to refresh it against the live spreadsheet or need
`assets/melodic-index.json` / `scans.json` regenerated.

Requires Ruby + Bundler and Python 3 (for the `bin/` scripts). No Node/npm
build step — all JS is hand-written and included via Liquid.

## Updating content

| What changed | What to do |
|---|---|
| Spreadsheet rows (works/sources) | Run `make download`, then commit the updated `_includes/metadata/*.json`. The GitHub Actions build also re-fetches automatically on every deploy, but committing keeps local dev in sync with production data. |
| New score encodings / scans in `chanson-encoding` | Run `make melodic-index` and/or `make scans-index`, commit the regenerated files. |
| Spreadsheet column headers renamed | Update `fields:` in `_config.yml` (see [Field name mapping](#field-name-mapping)). |
| UI copy (either language) | Edit `_includes/translations.aton`. |
| Nav structure | Edit the `<nav class="site-nav">` block in `_includes/header.html`; `site.header_pages` in `_config.yml` controls which pages Jekyll considers, but the visible menu/dropdowns are hand-written HTML, not auto-generated from page front matter. |
| A page's own content | Edit that page's `index.markdown`/`index.md` and its `scripts-local.html` / `styles-local.html`. |

## Deployment

Deployment is fully automatic: `.github/workflows/jekyll.yml` runs on every
push to `main` (and can be triggered manually via **Actions → Deploy Jekyll
site to Pages → Run workflow**):

1. Checkout, set up Ruby 3.1 + Bundler (gems cached).
2. `make` — refetches `works.json`/`sources.json` from the Apps Script and
   regenerates the melodic/scans indexes, so production always builds
   against live spreadsheet data even if the committed JSON is stale.
3. `bundle exec jekyll build --baseurl "<pages base path>" --config _config.yml`
   with `JEKYLL_ENV=production`.
4. Upload `_site/` as a Pages artifact and deploy it.

There is no separate staging environment — every push to `main` goes live.
Branch before making risky changes and preview locally with `jekyll serve`
first.
