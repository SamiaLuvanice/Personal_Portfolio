#!/usr/bin/env bash
# Wrapper: a implementação única é .agents/scripts/sync.mjs (Node >= 20).
set -euo pipefail
exec node "$(dirname "${BASH_SOURCE[0]}")/scripts/sync.mjs" "$@"
