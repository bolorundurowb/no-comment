# No Comment

Browser extension that hides comments on **YouTube**, **Facebook**, and **Reddit** so you can focus on the main content and form your own view without reading the comment thread first.

**Author:** Winner-Timothy Bolorunduro  
**License:** See [LICENSE](LICENSE).

**Locale:** User-facing strings and the manifest listing use **English (Nigeria)** (`en_NG`) via WebExtension i18n (`default_locale` and `_locales/en_NG/` under **`src/`**). The popup document is marked `lang="en-NG"`. Copy follows Nigerian / British English norms (e.g. *grey out*, *behaviour*).

---

## What it does

- **YouTube** (`https://*.youtube.com/watch*`): Hides the comments panel (including `#comments` and `ytd-comments` when they appear after the page loads).
- **Facebook** (`https://*.facebook.com/*`): Hides comment blocks matched by the page structure and keeps them collapsed while you scroll.
- **Reddit** (`https://*.reddit.com/*`, `https://reddit.com/*`): Hides the main comment UI (including `shreddit-*` components and old Reddit’s `.commentarea`).

You control everything from the extension popup:

- **Enable extension** — master switch.
- **Enable for YouTube** / **Facebook** / **Reddit** — per-site toggles (only apply when the extension is enabled).

Settings are stored with `chrome.storage.sync` (or the Firefox equivalent) so they can follow your profile when sync is available. Changes are pushed to **all** open matching YouTube, Facebook, and Reddit tabs, not only the active one.

---

## Browsers and manifest

The project targets **Manifest V3** and is meant to run in:

| Engine | Notes |
|--------|--------|
| **Chromium** (Chrome, Edge, Opera, Brave, …) | `minimum_chrome_version` **121** (dual `background.service_worker` + `background.scripts` for cross-browser parity). |
| **Firefox** | `browser_specific_settings.gecko` in [src/manifest.json](src/manifest.json): `id`, `strict_min_version`, and optional `data_collection_permissions`. Change `id` when publishing under your own Mozilla account. |

The background script enables the toolbar action only on matching YouTube, Facebook, and Reddit URLs (no Chrome-only `declarativeContent`; logic is tab-based so Firefox behaves the same).

---

## Permissions

| Permission | Why |
|------------|-----|
| `storage` | Save your enable/disable preferences. |
| `activeTab` | Reserved for typical extension patterns; primary behaviour uses declared hosts. |
| **Host access** (YouTube, Facebook, Reddit patterns in [src/manifest.json](src/manifest.json)) | Inject the content script, read tab URLs to show or **grey out** the toolbar action, and send setting updates to those tabs. |

No remote code: all logic ships with the extension (vanilla JavaScript, no jQuery).

---

## Repository layout

All extension assets that ship in the build live under **`src/`** (same idea as [ytm-playlist-exporter](https://github.com/bolorundurowb/ytm-playlist-exporter)): load **that** directory as the unpacked extension.

```
src/
  manifest.json        # MV3 manifest (paths in this file are relative to src/)
  _locales/en_NG/      # English (Nigeria) strings (__MSG_*__ + runtime i18n)
  background/          # Service worker (Chromium) / background scripts (Firefox)
  content/             # Runs on YouTube, Facebook, and Reddit
  popup/               # Toolbar popup UI (HTML, CSS, JS)
  icons/               # SVGs used in the popup
  images/              # Toolbar / extension PNG icons (paths referenced in manifest)
LICENSE                # Repo licence (optional extra in release zip)
```

Add the **PNG** files under **`src/images/`** as referenced in `manifest.json` (`logo_16.png`, …) before packaging or the store will reject missing icons.

---

## Local development

### Chromium

1. Open `chrome://extensions` (or your browser’s extensions page).
2. Turn on **Developer mode**.
3. **Load unpacked** and choose the **`src`** folder (the directory that contains `manifest.json`, `_locales/`, `images/`, and the rest of the extension).

### Firefox

1. Open **`about:debugging`** → **This Firefox** → **Load Temporary Add-on…**
2. Select **`src/manifest.json`**.

For testing and debugging guidance, see the [Extension Workshop](https://extensionworkshop.com/documentation/develop/testing-and-debugging/). Before listing on AMO, run your packaged zip through the [source add-on validator](https://addons.mozilla.org/en-US/developers/addon/validate) if you like — this project does not depend on Node or `web-ext`.

---

## Releases and GitHub Actions

When **`version`** in **`src/manifest.json`** changes on a push to **`main`** or **`master`** that touches **`src/manifest.json`**, the workflow [`.github/workflows/release-extension.yml`](.github/workflows/release-extension.yml):

1. Compares the new version to the previous commit’s **`src/manifest.json`**.
2. Builds **`dist/no-comment-<version>.zip`** with the **contents of `src/`** at the zip root (`manifest.json`, `_locales/`, `background/`, `content/`, `popup/`, `icons/`, `images/`, …), then adds **`LICENSE`** from the repo root if present.
3. Creates git tag **`v<version>`** and publishes a **GitHub Release** with that zip and generated release notes.

If the tag already exists, the job fails so you do not publish duplicates—bump `version` in **`src/manifest.json`** or remove the tag first.

---

## Versioning

Use [Semantic Versioning](https://semver.org/) in **`src/manifest.json`** (for example `"version": "1.3.1"`). The release workflow keys off that field only.

---

## Maintenance

Comment hiding depends on each site’s DOM. When YouTube, Facebook, or Reddit change layout, update the selectors in **`src/content/content.js`** and bump **`src/manifest.json`** if you rely on automated releases.

To add another language, create **`src/_locales/<locale>/messages.json`** with the same message keys as `en_NG`, and set `default_locale` if you change the primary listing language.
