#!/usr/bin/env bash
# Cursor stdio bridge → Developer Knowledge MCP (API key from mdeai/.env.local)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="${ROOT}/.env.local"
if [[ ! -f "${ENV_FILE}" ]]; then
  echo "mcp-google-developer-knowledge: missing ${ENV_FILE}" >&2
  exit 1
fi
KEY="$(grep -m1 '^GOOGLE_DEVELOPER_KNOWLEDGE_API_KEY=' "${ENV_FILE}" | cut -d= -f2- | tr -d '\r')"
if [[ -z "${KEY}" ]]; then
  echo "mcp-google-developer-knowledge: GOOGLE_DEVELOPER_KNOWLEDGE_API_KEY not set in .env.local" >&2
  exit 1
fi
export GOOGLE_DEVELOPER_KNOWLEDGE_API_KEY="${KEY}"
exec npx -y mcp-remote@latest "https://developerknowledge.googleapis.com/mcp" \
  --header "X-Goog-Api-Key:${GOOGLE_DEVELOPER_KNOWLEDGE_API_KEY}"
