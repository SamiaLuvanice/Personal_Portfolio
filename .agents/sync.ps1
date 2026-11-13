# Wrapper: a implementação única é .agents/scripts/sync.mjs (Node >= 20).
node (Join-Path $PSScriptRoot 'scripts/sync.mjs') @args
exit $LASTEXITCODE
