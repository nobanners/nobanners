import contributors from '../../assets/contributors.json';

const GITHUB_ISSUES_URL = 'https://github.com/nobanners/rules/issues/new';

async function getActiveTab(): Promise<chrome.tabs.Tab | null> {
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  return tab ?? null;
}

async function getDetectedCmp(tabId: number): Promise<string | null> {
  const result = await browser.storage.local.get(`cmp_${tabId}`);
  return (result[`cmp_${tabId}`] as string) ?? null;
}

function buildReportUrl(domain: string, cmp: string | null): string {
  const title = `Site broken: ${domain}`;
  const params = new URLSearchParams({
    template: 'broken-site.yml',
    title,
    labels: 'broken-site',
  });
  if (cmp) params.set('cmp', cmp);
  return `${GITHUB_ISSUES_URL}?${params.toString()}`;
}

async function init() {
  // Counter
  const { count = 0 } = await browser.storage.local.get('count');
  const counterEl = document.getElementById('counter')!;
  counterEl.textContent = (count as number).toLocaleString();

  // Toggle
  const toggle = document.getElementById('enabled-toggle') as HTMLInputElement;
  const { enabled = true } = await browser.storage.local.get('enabled');
  toggle.checked = enabled as boolean;
  toggle.addEventListener('change', () => {
    browser.storage.local.set({ enabled: toggle.checked });
  });

  // Broken-site reporter
  const reportBtn = document.getElementById('report-btn')!;
  reportBtn.addEventListener('click', async () => {
    const tab = await getActiveTab();
    if (!tab?.url || !tab.id) return;
    const domain = new URL(tab.url).hostname;
    const cmp = await getDetectedCmp(tab.id);
    const url = buildReportUrl(domain, cmp);
    browser.tabs.create({ url });
    window.close();
  });

  // Contributors
  const contributorsEl = document.getElementById('contributors')!;
  if (contributors.length > 0) {
    const names = contributors.slice(0, 3).map((c) => `@${c.login}`).join(', ');
    const extra = contributors.length > 3 ? ` +${contributors.length - 3}` : '';
    contributorsEl.textContent = `Built by ${names}${extra}`;
  }
}

init();
