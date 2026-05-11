# NoBanners

**Actually clicks reject. Zero telemetry. Open source.**

NoBanners automatically clicks the "Reject All" button on cookie consent banners. When no reject button exists, it hides the banner — and tells you it did so.

It never silently accepts cookies on your behalf.

---

## Why another one?

- **I Don't Care About Cookies** was acquired by Avast (a data-selling company) in 2022. The OhMyGuus fork captures ~200K users but mostly hides banners rather than rejecting them.
- **Consent-O-Matic** actually rejects — it's the right approach — but works on ~40-60% of pages per user reports and has no active rule maintenance for new CMP deployments.
- **uBlock Origin's annoyance filters** hide banners with CSS. They don't send a reject signal to the site.
- **Brave's native blocking** works for Brave users. This is for everyone else.

NoBanners covers more CMPs, uses simpler rules that the community can contribute to, and is GPL-3.0 licensed — which structurally prevents the acquisition-and-close-source scenario that ended IDCAC.

## What it does

1. Detects which consent management platform (CMP) a site is using
2. Clicks the reject button using that CMP's known selectors
3. Falls back to hiding the banner if no reject button is found (and logs this to the console)
4. Counts rejections locally — nothing is ever transmitted anywhere

## Permissions

`host_permissions: <all_urls>` is required to automatically detect and interact with cookie consent banners on every website you visit, without requiring you to click a button each time. The extension makes zero network requests at runtime. You can verify this: open DevTools → Network tab, and you'll see no requests from NoBanners.

## Covered CMPs (v1.0)

OneTrust · Cookiebot · CookieYes · Cookie Control · TrustArc · Usercentrics · Quantcast · Didomi

More added with each release. [Request a CMP →](https://github.com/nobanners/rules/issues/new?template=new-rule.yml)

## Contributing

Rule contributions are the most valuable thing you can do. See [CONTRIBUTING.md](CONTRIBUTING.md) for a step-by-step guide — no programming experience required for rule submissions.

## Privacy

NoBanners collects nothing. The rejection counter is stored in your browser via `chrome.storage.local` and never leaves your device. There are no analytics, no crash reporting, no usage tracking.

Full privacy policy: [nobanners.github.io/nobanners/privacy](https://nobanners.github.io/nobanners/privacy)

## About

NoBanners is built in collaboration between humans and AI. All code is human-reviewed before merge.

Licensed under [GPL-3.0-or-later](LICENSE).
