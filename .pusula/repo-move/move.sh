#!/usr/bin/env bash
# Extract pusula/ and .pusula/ (history kept) into a standalone repo folder.
# Usage: move.sh SOURCE_REPO BRANCH OUT_DIR [REMOTE_URL]
# Needs git-filter-repo on PATH or PYTHONPATH. Pushes only when REMOTE_URL is given.
set -euo pipefail
src=$1; branch=$2; out=$3; remote=${4:-}
here=$(cd "$(dirname "$0")" && pwd)
git clone -q --no-local "$src" "$out"
cd "$out"
git checkout -q "$branch"
git filter-repo --path pusula --path .pusula --force
git branch -M main
cp "$here/root-README.md" README.md
cp "$here/root-gitignore" .gitignore
git rm -q -r --cached .pusula/repo-move 2>/dev/null || true
rm -rf .pusula/repo-move
git add -A
git -c user.name="${GIT_AUTHOR_NAME:-Pusula}" -c user.email="${GIT_AUTHOR_EMAIL:-noreply@anthropic.com}" commit -q -m "Add root README and .gitignore for the standalone repo

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01RrLxaQMBLkRTfkDDMY8uhr"
if [ -n "$remote" ]; then
  git remote add origin "$remote"
  git push -u origin main
fi
git log --oneline | wc -l
