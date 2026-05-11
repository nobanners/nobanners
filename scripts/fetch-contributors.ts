import { writeFileSync } from 'fs';
import { join } from 'path';

const REPOS = ['nobanners/nobanners', 'nobanners/rules'];
const OUT_PATH = join(import.meta.dirname, '../assets/contributors.json');

interface Contributor {
  login: string;
  html_url: string;
  contributions: number;
}

async function fetchContributors(repo: string): Promise<Contributor[]> {
  const res = await fetch(`https://api.github.com/repos/${repo}/contributors?per_page=100`, {
    headers: {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'nobanners-build',
      ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
    },
  });

  if (!res.ok) {
    // Graceful fallback — don't fail the build if GitHub is unreachable
    console.warn(`[contributors] Could not fetch ${repo}: ${res.status}`);
    return [];
  }

  const data = (await res.json()) as Array<{ login: string; html_url: string; contributions: number; type: string }>;
  return data
    .filter((c) => c.type !== 'Bot')
    .map(({ login, html_url, contributions }) => ({ login, html_url, contributions }));
}

async function main() {
  const all = await Promise.all(REPOS.map(fetchContributors));

  // Merge and deduplicate across repos, sum contributions
  const merged = new Map<string, Contributor>();
  for (const list of all) {
    for (const c of list) {
      const existing = merged.get(c.login);
      if (existing) {
        existing.contributions += c.contributions;
      } else {
        merged.set(c.login, { ...c });
      }
    }
  }

  const sorted = [...merged.values()].sort((a, b) => b.contributions - a.contributions);
  writeFileSync(OUT_PATH, JSON.stringify(sorted, null, 2));
  console.log(`[contributors] Wrote ${sorted.length} contributors to ${OUT_PATH}`);
}

main().catch((err) => {
  console.error('[contributors] Failed:', err);
  // Write empty array so the build doesn't break
  writeFileSync(OUT_PATH, '[]');
});
