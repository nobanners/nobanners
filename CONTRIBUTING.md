# Contributing to NoBanners

NoBanners is built in collaboration between humans and AI. All code is human-reviewed before merge.

Community rule contributions are the most valuable thing you can do. CMP vendors update their banners frequently — no solo developer can keep up alone.

## The fastest way to contribute: submit a rule

### Step 1 — Find the reject button selector

1. Visit a site with a cookie banner you want NoBanners to handle
2. Open DevTools (F12) → Elements tab
3. Right-click the "Reject All" or "Decline" button → **Inspect**
4. Find a stable CSS selector — prefer `id` attributes over class names (IDs are more stable across updates)
5. Example: `#onetrust-reject-all-handler`

### Step 2 — Find the CMP presence selector

Still in Elements, find the banner container element. Look for a unique `id` on the outermost `<div>`. This is your `detectCMP` selector.

### Step 3 — Write the rule

Create a file in `rules/` named after the CMP (lowercase, hyphens):

```json
{
  "format_version": "nobanners-1.0",
  "name": "MyCMP",
  "detectCMP": [{ "exists": "#mycmp-banner" }],
  "detectPopup": [{ "exists": "#mycmp-banner" }],
  "prehideSelectors": ["#mycmp-banner"],
  "optOut": [
    { "click": "#mycmp-reject-btn" }
  ],
  "fallbackHide": true
}
```

**Rule format fields:**

| Field | Required | Description |
|-------|----------|-------------|
| `format_version` | Yes | Always `"nobanners-1.0"` |
| `name` | Yes | CMP display name |
| `detectCMP` | Yes | Selectors that confirm this CMP is present |
| `detectPopup` | Yes | Selectors that confirm the banner is currently visible |
| `prehideSelectors` | Yes | Elements to hide while the reject sequence runs |
| `optOut` | Yes | Click sequence to reject. Set `optional: true` for fallback clicks |
| `fallbackHide` | No | If `true`, hide the banner when no reject button is found |
| `shadowRoot` | No | Set `true` if the CMP uses shadow DOM |
| `allFrames` | No | Set `true` if the banner loads inside an iframe |

### Step 4 — Test it

```bash
npm install
npm run test:e2e -- --grep "MyCMP"
```

Or load the unpacked extension in Chrome (Developer mode → Load unpacked → select the `dist/chrome-mv3` folder after `npm run build`) and visit the target site manually.

### Step 5 — Open a PR

Fill out the PR template. Include at least one site where you tested it.

---

## Reporting a broken site

Use the **Report it** button in the extension popup, or open an issue using the [broken-site template](https://github.com/nobanners/rules/issues/new?template=broken-site.yml).

---

## License

All contributions are licensed under GPL-3.0-or-later. No CLA required — by submitting a PR you agree your contribution falls under the project license.
