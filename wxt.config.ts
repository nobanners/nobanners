import { defineConfig } from 'wxt';

export default defineConfig({
  extensionApi: 'chrome',
  suppressWarnings: {
    firefoxDataCollection: true,
  },
  manifest: {
    name: 'NoBanners',
    description: 'Actually clicks reject. Zero telemetry. Open source.',
    version: '1.0.0',
    permissions: ['storage', 'activeTab'],
    host_permissions: ['<all_urls>'],
    browser_specific_settings: {
      gecko: {
        id: 'nobanners@nobanners.dev',
        strict_min_version: '128.0',
      },
    },
  },
});
