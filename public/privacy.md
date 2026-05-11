# Privacy Policy — NoBanners

**Last updated:** 2026-05-10

## What data NoBanners collects

**None.** NoBanners does not collect, transmit, store externally, or share any data about you or your browsing activity.

## The rejection counter

NoBanners displays a count of cookie banners it has rejected. This number is stored locally in your browser using `chrome.storage.local`. It never leaves your device. It is not synced, not transmitted, and not accessible to anyone other than you.

## Network requests

NoBanners makes zero network requests at runtime. All CMP detection rules are bundled inside the extension package. You can verify this by opening DevTools → Network tab — no requests from NoBanners will appear.

## Permissions

- `storage` — used to store your rejection count and enabled/disabled preference locally.
- `activeTab` — used to read the current tab's URL when you click the "Report it" button in the popup, so the domain can be pre-filled in the GitHub issue form. This only runs when you explicitly click the button.
- `host_permissions: <all_urls>` — required to automatically detect and interact with cookie consent banners on every website you visit, without requiring manual activation.

## Third-party services

NoBanners does not integrate with any third-party analytics, crash reporting, or telemetry services.

## Changes to this policy

If this policy changes, the updated version will be published here and the extension version number will be incremented.

## Contact

Open an issue at [github.com/nobanners/nobanners](https://github.com/nobanners/nobanners/issues).
