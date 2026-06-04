---
title: Workspace — Filesystem (mdeai)
source: https://mastra.ai/docs/workspace/filesystem
personas: [Sofía, Patricia]
phase: 2+ / VPS
---

# Workspace filesystem — mdeai

## At a glance

| | |
|---|---|
| **What it is** | A storage **provider** behind workspace file tools: read, write, list, grep, copy, move, delete. |
| **Purpose** | Let agents read/write **files as files** — CSV exports, skill docs, generated SQL — without shell-only hacks. |
| **Goals** | Containment (stay inside `basePath`), optional `allowedPaths`, read-only modes for auditors. |
| **What it does** | `LocalFilesystem`, `S3Filesystem`, `GCSFilesystem`, etc. → agent tools `read_file`, `write_file`, … |
| **Benefits** | Same API for disk or cloud; `grep` across docs; dynamic resolver per tenant/role. |
| **mdeai** | Local disk on VPS; **not** Camila-facing. |

**Official:** [Filesystem](https://mastra.ai/docs/workspace/filesystem)

---

## mdeai patterns

| Provider | Use |
|----------|-----|
| `LocalFilesystem({ basePath: './workspace', contained: true })` | Default VPS enrichment |
| `allowedPaths: ['~/.claude/skills']` | Read skills without disabling containment |
| `readOnly: true` | Patricia audit agent — no writes |
| `S3Filesystem` | Archived host PDFs before RAG ingest ([../rag/02-chunking-and-embedding.md](../rag/02-chunking-and-embedding.md)) |

---

## User stories

**Sofía**  
As Sofía, the enrichment agent `grep`s `errors.log` in `./workspace` after a failed Firecrawl run — faster than pasting logs into chat.

**Patricia**  
As Patricia, a read-only filesystem agent lists `host-policy/` but cannot `write_file` — compliance review without risk.

**Roberto (indirect)**  
As Roberto, my uploaded venue PDF lands in S3 via edge fn; a **batch** workspace agent reads it for chunking — not the live wizard agent.

---

## Journey — ingest host PDF (batch)

1. Roberto uploads PDF → Supabase Storage / S3 (product UI).
2. VPS agent: `read_file` not used on binary — use parse step first.
3. Text extracted → `write_file('/chunks/host-{id}.md')`.
4. RAG pipeline embeds ([../rag/00-index.md](../rag/00-index.md)).
5. `hostEventAgent` Phase 2 uses `createVectorQueryTool`, not filesystem in chat.

**CopilotKit:** File tools never exposed in browser runtime.

**Related:** [01-overview](01-overview.md) · [06-search](06-search.md)
