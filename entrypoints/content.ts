import { defineContentScript } from 'wxt/utils/define-content-script';
import rulesData from '../assets/rules.json';

interface Rule {
  name: string;
  detectCMP: Array<{ exists: string }>;
  detectPopup: Array<{ exists: string }>;
  prehideSelectors: string[];
  optOut: Array<{ click: string; optional?: boolean }>;
  fallbackHide?: boolean;
  shadowRoot?: boolean;
  allFrames?: boolean;
}

const rules: Rule[] = rulesData.rules;

const POLLING_INTERVAL_MS = 500;
const POLLING_TIMEOUT_MS = 15_000;
const PREHIDE_TIMEOUT_MS = 2_000;
const MUTATION_DEBOUNCE_MS = 250;

// --- Layer 1: CSS prehide ---

function injectPrehide(selectors: string[]): HTMLStyleElement {
  const style = document.createElement('style');
  style.id = '__nobanners-prehide';
  style.textContent = `${selectors.join(', ')} { display: none !important; visibility: hidden !important; }`;
  document.documentElement.appendChild(style);
  return style;
}

function removePrehide(style: HTMLStyleElement | null) {
  style?.remove();
}

// --- Selector matching (including shadow DOM) ---

function queryElement(selector: string, root: Document | ShadowRoot = document): Element | null {
  return root.querySelector(selector);
}

function queryShadowRoot(selector: string, root: Element): Element | null {
  if (root.shadowRoot) {
    const found = root.shadowRoot.querySelector(selector);
    if (found) return found;
    for (const child of root.shadowRoot.querySelectorAll('*')) {
      const deep = queryShadowRoot(selector, child);
      if (deep) return deep;
    }
  }
  return null;
}

function findElement(selector: string, useShadowRoot = false): Element | null {
  const direct = queryElement(selector);
  if (direct) return direct;
  if (!useShadowRoot) return null;
  for (const el of document.querySelectorAll('*')) {
    const found = queryShadowRoot(selector, el);
    if (found) return found;
  }
  return null;
}

// --- Rule matching ---

function detectCMP(rule: Rule): boolean {
  return rule.detectCMP.every(({ exists }) => !!findElement(exists, rule.shadowRoot));
}

function detectPopup(rule: Rule): boolean {
  return rule.detectPopup.every(({ exists }) => !!findElement(exists, rule.shadowRoot));
}

// --- Rule execution ---

async function executeOptOut(rule: Rule): Promise<'rejected' | 'hidden' | null> {
  const prehideStyle = rule.prehideSelectors.length
    ? injectPrehide(rule.prehideSelectors)
    : null;

  const prehideTimer = setTimeout(() => removePrehide(prehideStyle), PREHIDE_TIMEOUT_MS);

  for (const step of rule.optOut) {
    const el = findElement(step.click, rule.shadowRoot);
    if (el instanceof HTMLElement) {
      el.click();
    } else if (!step.optional) {
      clearTimeout(prehideTimer);
      removePrehide(prehideStyle);

      if (rule.fallbackHide && rule.prehideSelectors.length) {
        console.log(`[NoBanners] No reject button found on ${rule.name} — banner hidden. Consider submitting a rule update: https://github.com/nobanners/rules/issues/new?template=broken-site.yml`);
        injectPrehide(rule.prehideSelectors);
        return 'hidden';
      }
      return null;
    }
  }

  clearTimeout(prehideTimer);
  removePrehide(prehideStyle);
  return 'rejected';
}

// --- Main detection loop ---

async function tryAllRules(): Promise<boolean> {
  for (const rule of rules) {
    if (detectCMP(rule) && detectPopup(rule)) {
      const result = await executeOptOut(rule);
      if (result) {
        browser.runtime.sendMessage({ type: 'BANNER_HANDLED', result, cmp: rule.name });
        return true;
      }
    }
  }
  return false;
}

export default defineContentScript({
  matches: ['<all_urls>'],
  runAt: 'document_idle',

  async main() {
    if (await tryAllRules()) return;

    // Layer 3: MutationObserver + polling fallback for SPAs
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;
    let handled = false;

    const observer = new MutationObserver(() => {
      if (handled) return;
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(async () => {
        if (!handled && await tryAllRules()) {
          handled = true;
          observer.disconnect();
        }
      }, MUTATION_DEBOUNCE_MS);
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Polling fallback
    const pollStart = Date.now();
    const poll = setInterval(async () => {
      if (handled || Date.now() - pollStart > POLLING_TIMEOUT_MS) {
        clearInterval(poll);
        observer.disconnect();
        return;
      }
      if (await tryAllRules()) {
        handled = true;
        clearInterval(poll);
        observer.disconnect();
      }
    }, POLLING_INTERVAL_MS);
  },
});
