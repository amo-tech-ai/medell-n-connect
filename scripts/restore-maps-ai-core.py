#!/usr/bin/env python3
"""Restore tasks/maps-ai-core from agent transcript Write payloads."""
import json
import os
import re

TRANSCRIPT = "/home/sk/.cursor/projects/home-sk-mdeai/agent-transcripts/fa4e57e5-e2ea-4fb6-a44c-0f28799f756c/fa4e57e5-e2ea-4fb6-a44c-0f28799f756c.jsonl"
ROOT = "/home/sk/mdeai"

writes: dict[str, str] = {}

with open(TRANSCRIPT) as f:
    for line in f:
        if "maps-ai-core" not in line:
            continue
        try:
            o = json.loads(line)
        except json.JSONDecodeError:
            continue
        if o.get("role") != "assistant":
            continue
        for part in o.get("message", {}).get("content", []):
            if part.get("type") != "tool_use" or part.get("name") != "Write":
                continue
            inp = part.get("input") or {}
            path = inp.get("path", "")
            contents = inp.get("contents", "")
            if "maps-ai-core" in path and contents:
                writes[path] = contents

for path, contents in sorted(writes.items()):
    rel = path.replace(ROOT + "/", "")
    dest = os.path.join(ROOT, rel)
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    with open(dest, "w", encoding="utf-8") as out:
        out.write(contents)
    print(f"OK {len(contents):6d} {rel}")

print(f"\nRestored {len(writes)} files")
