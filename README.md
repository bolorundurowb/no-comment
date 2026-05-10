# No Comment

Browser extension that hides comments on **YouTube**, **Facebook**, and **Reddit** so you can focus on the main content and form your own view without reading the comment thread first.

**Author:** Winner-Timothy Bolorunduro  
**License:** See [LICENSE](LICENSE).

**Locale:** User-facing strings and the manifest listing use **English (Nigeria)** (`en_NG`) via WebExtension i18n (`default_locale` and `_locales/en_NG/`). The popup document is marked `lang="en-NG"`. Copy follows Nigerian / British English norms (e.g. *grey out*, *behaviour*).

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
| **Firefox** | `browser_specific_settings.gecko` in [manifest.json](manifest.json): `id`, `strict_min_version`, and optional `data_collection_permissions`. Change `id` when publishing under your own Mozilla account. |

The background script enables the toolbar action only on matching YouTube, Facebook, and Reddit URLs (no Chrome-only `declarativeContent`; logic is tab-based so Firefox behaves the same).

---

## Permissions

| Permission | Why |
|------------|-----|
| `storage` | Save your enable/disable preferences. |
| `activeTab` | Reserved for typical extension patterns; primary behaviour uses declared hosts. |
| **Host access** (YouTube, Facebook, Reddit patterns in [manifest.json](manifest.json)) | Inject the content script, read tab URLs to show or **grey out** the toolbar action, and send setting updates to those tabs. |

No remote code: all logic ships with the extension (vanilla JavaScript, no jQuery).

---

## Repository layout

```
manifest.json          # MV3 manifest, default_locale, permissions, content_scripts
_locales/en_NG/        # English (Nigeria) strings (manifest __MSG_*__ + runtime i18n)
src/
  background/          # Service worker (Chromium) / background scripts (Firefox)
  content/             # Runs on YouTube, Facebook, and Reddit
  popup/               # Toolbar popup UI (HTML, CSS, JS)
  icons/               # SVGs used in the popup
images/                # Toolbar / extension PNG icons (paths referenced in manifest)
LICENSE
```

Add the **PNG** files under `images/` as referenced in `manifest.json` (`logo_16.png`, …) before packaging or the store will reject missing icons. The popup SVGs live under `src/icons/`.

---

## Local development

### Chromium

1. Open `chrome://extensions` (or your browser’s extensions page).
2. Turn on **Developer mode**.
3. **Load unpacked** and choose this repository folder (the directory that contains `manifest.json`).

### Firefox

1. Open **`about:debugging`** → **This Firefox** → **Load Temporary Add-on…**
2. Select **`manifest.json`** in this repository root (the folder that contains `manifest.json`, `src/`, and `_locales/`).

For testing and debugging guidance, see the [Extension Workshop](https://extensionworkshop.com/documentation/develop/testing-and-debugging/). Before listing on AMO, run your packaged zip through the [source add-on validator](https://addons.mozilla.org/en-US/developers/addon/validate) if you like — this project does not depend on Node or `web-ext`.

---

## Releases and GitHub Actions

When **`version`** in [manifest.json](manifest.json) changes on a push to **`main`** or **`master`** that touches `manifest.json`, the workflow [`.github/workflows/release-extension.yml`](.github/workflows/release-extension.yml):

1. Compares the new version to the previous commit’s manifest.
2. Builds **`dist/no-comment-<version>.zip`** (extension root: `manifest.json`, `src/`, `_locales/`, optional `images/`, optional `LICENSE`).
3. Creates git tag **`v<version>`** and publishes a **GitHub Release** with that zip and generated release notes.

If the tag already exists, the job fails so you do not publish duplicates—bump `version` or remove the tag first.

---

## Versioning

Use [Semantic Versioning](https://semver.org/) in `manifest.json` (for example `"version": "1.3.1"`). The release workflow keys off that field only.

---

## Maintenance

Comment hiding depends on each site’s DOM. When YouTube, Facebook, or Reddit change layout, update the selectors in `src/content/content.js` and bump the manifest version if you rely on automated releases.

To add another language, create `_locales/<locale>/messages.json` with the same message keys as `en_NG`, and set `default_locale` if you change the primary listing language.
