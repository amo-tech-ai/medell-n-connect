#!/usr/bin/env node
/**
 * Add or refresh YAML frontmatter (title, description, category) on
 * markdown files under .claude/docs. Idempotent: re-run to fix extraction.
 */
import fs from "node:fs/promises";
import path from "node:path";

const DOCS_ROOT = path.resolve(import.meta.dirname, "..");
const META_KEYS = ["title", "description", "category"];

/** @returns {{ front: string, body: string } | null} */
function splitFrontmatter(raw) {
  if (!raw.startsWith("---\n")) return null;
  const end = raw.indexOf("\n---\n", 4);
  if (end === -1) return null;
  const inner = raw.slice(4, end);
  const body = raw.slice(end + 5);
  if (inner.trimStart().startsWith("#")) return null;
  const looksYaml =
    /^[\w-]+\s*:/m.test(inner) ||
    /^-\s+\w/m.test(inner) ||
    inner.split("\n").some((l) => /^\w[\w-]*\s*:/.test(l));
  if (!looksYaml) return null;
  return { front: inner, body };
}

function humanizeBasename(name) {
  return name
    .replace(/\.md$/i, "")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (c) => c.toUpperCase());
}

/**
 * Document title: only trust a lone `# ` heading near the top (notebook files
 * use `#` for sections much later).
 */
function extractTitle(body, basename) {
  const lines = body.split("\n");
  const h1Scan = Math.min(lines.length, 32);
  for (let i = 0; i < h1Scan; i++) {
    const line = lines[i];
    if (/^#\s+/.test(line) && !/^##+\s/.test(line)) {
      return line.replace(/^#\s+/, "").trim();
    }
  }
  for (let i = 0; i < Math.min(lines.length, 24); i++) {
    const t = lines[i].trim();
    if (!t || t.startsWith("```") || t.startsWith("<") || t.startsWith("|") || t.startsWith(">"))
      continue;
    if (t.length >= 8 && t.length <= 120) return t;
  }
  return humanizeBasename(basename);
}

function isBadBlockquoteLine(text) {
  const s = text.trim();
  if (/^#{1,6}\s/.test(s)) return true;
  if (/documentation index/i.test(s)) return true;
  if (/llms\.txt/i.test(s)) return true;
  if (/Fetch the complete documentation index/i.test(s)) return true;
  if (/^Use this file to discover/i.test(s)) return true;
  return false;
}

function extractDescription(body) {
  const lines = body.split("\n");
  for (let i = 0; i < Math.min(lines.length, 50); i++) {
    const m = lines[i].match(/^>\s*(.+)$/);
    if (!m) continue;
    const t = m[1].trim();
    if (isBadBlockquoteLine(t)) continue;
    if (t.length >= 8 && t.length <= 400) return t.length > 350 ? `${t.slice(0, 347)}...` : t;
  }
  const afterH1 = body.replace(/^#\s+.+\n+/, "");
  const paras = afterH1.trim().split(/\n\n+/);
  for (const chunk of paras) {
    if (
      !chunk ||
      chunk.startsWith("#") ||
      chunk.startsWith("```") ||
      chunk.startsWith("|") ||
      chunk.startsWith("<") ||
      chunk.length >= 420
    ) {
      continue;
    }
    const flat = chunk.replace(/\s+/g, " ").trim();
    return flat.length > 350 ? `${flat.slice(0, 347)}...` : flat;
  }
  return "";
}

function categoryFromRel(rel) {
  const dir = path.dirname(rel);
  if (dir === ".") return "root";
  return dir.split(path.sep)[0];
}

function yamlScalarString(s) {
  if (!s) return '""';
  const safe = s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  return `"${safe}"`;
}

/** Remove title / description / category lines (single-line keys only). */
function stripMetaKeys(front) {
  return front
    .split("\n")
    .filter((line) => !META_KEYS.some((k) => new RegExp(`^${k}\\s*:`).test(line)))
    .join("\n")
    .trimEnd();
}

async function walk(dir, out = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === "scripts") continue;
      await walk(p, out);
    } else if (e.isFile() && e.name.endsWith(".md")) out.push(p);
  }
  return out;
}

async function main() {
  const files = await walk(DOCS_ROOT);
  let updated = 0;
  let skipped = 0;

  for (const abs of files.sort()) {
    const rel = path.relative(DOCS_ROOT, abs);
    let raw = await fs.readFile(abs, "utf8");
    if (raw.charCodeAt(0) === 0xfeff) raw = raw.slice(1);

    const basename = path.basename(abs);
    const split = splitFrontmatter(raw);
    const body = split ? split.body : raw;
    const title = extractTitle(body, basename);
    let description = extractDescription(body);
    if (!description) {
      description = `Reference note under .claude/docs (${categoryFromRel(rel)}).`;
    }
    const category = categoryFromRel(rel);

    const triple = [
      `title: ${yamlScalarString(title)}`,
      `description: ${yamlScalarString(description)}`,
      `category: ${yamlScalarString(category)}`,
    ].join("\n");

    let newFront;
    if (split) {
      const rest = stripMetaKeys(split.front);
      newFront = rest ? `${triple}\n${rest}` : triple;
    } else {
      newFront = triple;
    }

    const next = `---\n${newFront}\n---\n${body}`;
    if (next === raw) {
      skipped++;
      continue;
    }
    await fs.writeFile(abs, next, "utf8");
    updated++;
  }

  console.error(`add-frontmatter: updated ${updated}, unchanged ${skipped}, total ${files.length}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
