#!/usr/bin/env node
// Refresh /home/sk/mdeai/.claude/docs mirrors from code.claude.com + platform.claude.com llms.txt.
// Preserves local frontmatter (title/description/category), replaces body, stamps updated date.
// Skips: files with custom `sources:` frontmatter, ambiguous basename matches, fetch failures.

import fs from 'node:fs';
import path from 'node:path';

const ROOT = '/home/sk/mdeai/.claude/docs';
const TODAY = '2026-06-09';
const INDEXES = [
  { file: '/tmp/cc-llms.txt' },
  { file: '/tmp/pc-llms.txt' },
];

// dir → substrings that disambiguate URL candidates
const DIR_HINTS = {
  'claude-code': ['code.claude.com'],
  'agents': ['/agent-sdk/', '/agents/', 'code.claude.com'],
  'skills': ['/agent-skills/', '/skills/'],
  'tools': ['/tool-use/'],
  'reference': ['/api/', '/resources/', '/release-notes/'],
  'security': ['/security', '/legal', '/admin'],
  'best-practices': ['/best-practices', '/prompt-engineering', 'code.claude.com'],
  '.': ['code.claude.com', '/build-with-claude/', '/agents-and-tools/'],
};

const urls = new Set();
for (const idx of INDEXES) {
  const txt = fs.readFileSync(idx.file, 'utf8');
  for (const m of txt.matchAll(/https:\/\/[^\s)]+\.md/g)) urls.add(m[0]);
}
const byBase = new Map();
for (const u of urls) {
  const b = path.basename(u);
  if (!byBase.has(b)) byBase.set(b, []);
  byBase.get(b).push(u);
}

function pickUrl(dir, base) {
  const cands = byBase.get(base) || [];
  if (cands.length === 0) return { url: null, reason: 'no-match' };
  if (cands.length === 1) return { url: cands[0] };
  const hints = DIR_HINTS[dir] || [];
  const scored = cands.map(u => ({ u, s: hints.reduce((a, h, i) => a + (u.includes(h) ? (hints.length - i) : 0), 0) }))
    .sort((a, b) => b.s - a.s);
  if (scored[0].s > 0 && (scored.length < 2 || scored[0].s > scored[1].s)) return { url: scored[0].u };
  return { url: null, reason: `ambiguous: ${cands.join(' | ')}` };
}

function splitFrontmatter(txt) {
  if (txt.startsWith('---\n')) {
    const end = txt.indexOf('\n---', 4);
    if (end !== -1) return { fm: txt.slice(0, end + 4), body: txt.slice(end + 4) };
  }
  return { fm: null, body: txt };
}

async function fetchText(url) {
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const t = await res.text();
  if (t.trimStart().startsWith('<!DOCTYPE') || t.trimStart().startsWith('<html')) throw new Error('got HTML');
  if (t.length < 200) throw new Error(`too short (${t.length})`);
  return t;
}

const dirs = ['claude-code', 'agents', 'skills', 'tools', 'reference', 'security', 'best-practices', '.'];
const results = { updated: [], unchanged: [], skipped: [], failed: [] };

for (const dir of dirs) {
  const full = path.join(ROOT, dir);
  if (!fs.existsSync(full)) continue;
  const files = fs.readdirSync(full).filter(f => f.endsWith('.md') && (dir !== '.' || f !== 'README.md'));
  for (const f of files) {
    const fp = path.join(full, f);
    if (!fs.statSync(fp).isFile()) continue;
    const local = fs.readFileSync(fp, 'utf8');
    if (/^sources:/m.test(local.split('\n---')[0] || '')) { results.skipped.push(`${dir}/${f} (custom, has sources:)`); continue; }
    const { url, reason } = pickUrl(dir, f);
    if (!url) { results.skipped.push(`${dir}/${f} (${reason})`); continue; }
    try {
      const remote = await fetchText(url);
      const { fm } = splitFrontmatter(local);
      let newFm = fm;
      if (newFm) {
        newFm = /^updated:/m.test(newFm)
          ? newFm.replace(/^updated:.*$/m, `updated: ${TODAY}`)
          : newFm.replace(/\n---$/, `\nupdated: ${TODAY}\nsource: ${url}\n---`);
        if (!/^source:/m.test(newFm)) newFm = newFm.replace(/\n---$/, `\nsource: ${url}\n---`);
      } else {
        newFm = `---\nupdated: ${TODAY}\nsource: ${url}\n---`;
      }
      const out = `${newFm}\n\n${remote.trimStart()}`;
      const { body: oldBody } = splitFrontmatter(local);
      if (oldBody.trim() === remote.trim()) { results.unchanged.push(`${dir}/${f}`); }
      else { fs.writeFileSync(fp, out, 'utf8'); results.updated.push(`${dir}/${f} <- ${url}`); }
      await new Promise(r => setTimeout(r, 120));
    } catch (e) {
      results.failed.push(`${dir}/${f} (${url}: ${e.message})`);
    }
  }
}

console.log(`\n== UPDATED (${results.updated.length}) ==`); results.updated.forEach(x => console.log('  ' + x));
console.log(`\n== UNCHANGED (${results.unchanged.length}) ==`); results.unchanged.forEach(x => console.log('  ' + x));
console.log(`\n== SKIPPED (${results.skipped.length}) ==`); results.skipped.forEach(x => console.log('  ' + x));
console.log(`\n== FAILED (${results.failed.length}) ==`); results.failed.forEach(x => console.log('  ' + x));
