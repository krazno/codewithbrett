#!/usr/bin/env bash
cd "$(dirname "$0")"

if ! command -v npm >/dev/null 2>&1; then
  echo "npm is required. Install Node.js, then run: npm install && npm run dev"
  exit 1
fi

if [ ! -d node_modules ]; then
  echo "Installing dependencies…"
  npm install
fi

echo "codewithbrett preview"
echo "  http://127.0.0.1:3000/"
echo "  http://127.0.0.1:3000/ursuline-ai/"
echo ""
exec npm run dev -- --hostname 127.0.0.1
