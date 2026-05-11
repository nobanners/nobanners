## What does this PR do?

<!-- Brief description: new rule, rule fix, core change, etc. -->

## Checklist

- [ ] Rule tested manually on the target site (banner is gone, network tab shows no consent signal sent)
- [ ] Rule tested in Chrome and Firefox
- [ ] `format_version: "nobanners-1.0"` is present in any new rule file
- [ ] No hardcoded timeouts or `sleep()` calls added
- [ ] Playwright test added or updated (for rule changes)

## Sites tested

| Site | Result |
|------|--------|
| https://example.com | ✅ Banner rejected |

## Notes for reviewer

<!-- Anything unusual about this CMP? Shadow DOM, iframes, multi-step flows? -->
