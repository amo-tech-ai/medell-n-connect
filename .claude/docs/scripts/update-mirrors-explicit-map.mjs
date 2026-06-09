#!/usr/bin/env node
// Second pass: explicit local-file → URL map for the cases pass 1 skipped as ambiguous/renamed.
import fs from 'node:fs';

const ROOT = '/home/sk/mdeai/.claude/docs';
const TODAY = '2026-06-09';
const CC = 'https://code.claude.com/docs/en';
const MA = 'https://platform.claude.com/docs/en/managed-agents';
const PC = 'https://platform.claude.com/docs/en';

const MAP = {
  'claude-code/mcp.md': `${CC}/mcp.md`,
  'claude-code/permissions.md': `${CC}/permissions.md`,
  'claude-code/webhooks.md': `${MA}/webhooks.md`,
  'agents/webhooks.md': `${MA}/webhooks.md`,
  'agents/Agents-overview.md': `${MA}/overview.md`,
  'agents/agent-cloud-containers.md': `${MA}/cloud-sandboxes-reference.md`,
  'agents/agent-define-outcomes.md': `${MA}/define-outcomes.md`,
  'agents/agent-dreams.md': `${MA}/dreams.md`,
  'agents/agent-environments.md': `${MA}/environments.md`,
  'agents/agent-events-and-streaming.md': `${MA}/events-and-streaming.md`,
  'agents/agent-files.md': `${MA}/files.md`,
  'agents/agent-github.md': `${MA}/github.md`,
  'agents/agent-mcp-connector.md': `${MA}/mcp-connector.md`,
  'agents/agent-memory.md': `${MA}/memory.md`,
  'agents/agent-multi-agent.md': `${MA}/multi-agent.md`,
  'agents/agent-sessions.md': `${MA}/sessions.md`,
  'agents/agent-skills.md': `${MA}/skills.md`,
  'agents/agent-tools.md': `${MA}/tools.md`,
  'agents/agent-vaults.md': `${MA}/vaults.md`,
  'agents/agent-webhooks.md': `${MA}/webhooks.md`,
  'tools/files.md': `${PC}/build-with-claude/files.md`,
  'tools/tools-overview.md': `${PC}/agents-and-tools/tool-use/overview.md`,
  'reference/hooks.md': `${CC}/hooks.md`,
};

function splitFrontmatter(txt) {
  if (txt.startsWith('---\n')) {
    const end = txt.indexOf('\n---', 4);
    if (end !== -1) return { fm: txt.slice(0, end + 4), body: txt.slice(end + 4) };
  }
  return { fm: null, body: txt };
}

let ok = 0, fail = 0;
for (const [rel, url] of Object.entries(MAP)) {
  const fp = `${ROOT}/${rel}`;
  try {
    const res = await fetch(url, { redirect: 'follow' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const remote = await res.text();
    if (remote.trimStart().startsWith('<') || remote.length < 200) throw new Error('bad content');
    const local = fs.readFileSync(fp, 'utf8');
    let { fm } = splitFrontmatter(local);
    if (fm) {
      fm = /^updated:/m.test(fm) ? fm.replace(/^updated:.*$/m, `updated: ${TODAY}`) : fm.replace(/\n---$/, `\nupdated: ${TODAY}\n---`);
      fm = /^source:/m.test(fm) ? fm.replace(/^source:.*$/m, `source: ${url}`) : fm.replace(/\n---$/, `\nsource: ${url}\n---`);
    } else {
      fm = `---\nupdated: ${TODAY}\nsource: ${url}\n---`;
    }
    fs.writeFileSync(fp, `${fm}\n\n${remote.trimStart()}`, 'utf8');
    console.log(`OK  ${rel} <- ${url}`);
    ok++;
    await new Promise(r => setTimeout(r, 120));
  } catch (e) {
    console.log(`FAIL ${rel} (${url}): ${e.message}`);
    fail++;
  }
}
console.log(`\n${ok} updated, ${fail} failed`);
