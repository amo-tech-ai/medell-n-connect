#!/usr/bin/env bash
# Smoke-test Google MCP bridges (no secrets printed)
set -euo pipefail
echo "=== Maps Code Assist (POST tools/list) ==="
curl -sS -X POST \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","method":"tools/list","id":"1"}' \
  --max-time 15 \
  https://mapscodeassist.googleapis.com/mcp \
  | head -c 200
echo ""
echo ""
echo "=== gemini-api-docs-mcp.dev (expect 429 if rate-limited) ==="
code=$(curl -sS -o /dev/null -w "%{http_code}" --max-time 5 https://gemini-api-docs-mcp.dev/ || echo "err")
echo "HTTP $code (use scripts/mcp-gemini-api-docs.sh stdio bridge instead)"
echo ""
echo "=== Maps stdio bridge (5s) ==="
timeout 5 /home/sk/mdeai/scripts/mcp-google-maps-code-assist.sh 2>&1 | grep -E 'Connected|Error|Fatal' | head -3 || echo "stdio started (timeout OK)"
echo ""
echo "=== Gemini stdio bridge (5s, needs uvx) ==="
if command -v uvx >/dev/null; then
  timeout 5 /home/sk/mdeai/scripts/mcp-gemini-api-docs.sh 2>&1 | head -3 || echo "stdio started (timeout OK)"
else
  echo "SKIP: install uv (provides uvx) for gemini-api-docs-mcp bridge"
fi
