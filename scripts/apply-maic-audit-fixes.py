#!/usr/bin/env python3
"""Apply StrReplace patches to maps-ai-core from transcript (post-audit)."""
import json
import os

TRANSCRIPT = "/home/sk/.cursor/projects/home-sk-mdeai/agent-transcripts/fa4e57e5-e2ea-4fb6-a44c-0f28799f756c/fa4e57e5-e2ea-4fb6-a44c-0f28799f756c.jsonl"
ROOT = "/home/sk/mdeai"

patches = []

with open(TRANSCRIPT) as f:
    for line in f:
        if "maps-ai-core" not in line or "StrReplace" not in line:
            continue
        try:
            o = json.loads(line)
        except json.JSONDecodeError:
            continue
        if o.get("role") != "assistant":
            continue
        for part in o.get("message", {}).get("content", []):
            if part.get("type") != "tool_use" or part.get("name") != "StrReplace":
                continue
            inp = part.get("input") or {}
            path = inp.get("path", "")
            if "maps-ai-core" not in path:
                continue
            old, new = inp.get("old_string"), inp.get("new_string")
            if old and new and old != new:
                patches.append((path, old, new))

applied = 0
for path, old, new in patches:
    rel = path.replace(ROOT + "/", "")
    dest = path if path.startswith(ROOT) else os.path.join(ROOT, rel)
    try:
        with open(dest, encoding="utf-8") as fh:
            text = fh.read()
    except FileNotFoundError:
        print(f"SKIP missing {rel}")
        continue
    if old not in text:
        print(f"SKIP no match {rel} ({len(old)} chars)")
        continue
    text = text.replace(old, new, 1)
    with open(dest, "w", encoding="utf-8") as fh:
        fh.write(text)
    applied += 1
    print(f"PATCH {rel}")

print(f"\nApplied {applied}/{len(patches)} patches")
