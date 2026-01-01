#!/bin/sh

if ! gh auth status >/dev/null 2>&1; then
  echo "Not authenticated. Logging in…"
  gh auth login --with-token < .apitoken
else
  echo "Already authenticated."
fi

gh workflow run pick-game.yml \
  --repo GerardGascon/game-of-the-day \
  --ref master