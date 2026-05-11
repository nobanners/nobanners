import { defineBackground } from 'wxt/utils/define-background';

export default defineBackground(() => {
  browser.runtime.onMessage.addListener((message) => {
    if (message.type !== 'BANNER_HANDLED') return;

    // Increment lifetime counter
    browser.storage.local.get('count').then(({ count = 0 }) => {
      browser.storage.local.set({ count: (count as number) + 1 });
    });

    // Store last detected CMP per tab for broken-site reporter
    if (message.tabId) {
      browser.storage.local.set({ [`cmp_${message.tabId}`]: message.cmp });
    }
  });

  // Clean up per-tab CMP data when tab closes
  browser.tabs.onRemoved.addListener((tabId) => {
    browser.storage.local.remove(`cmp_${tabId}`);
  });
});
