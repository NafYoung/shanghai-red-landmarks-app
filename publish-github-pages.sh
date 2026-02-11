#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "用法: ./publish-github-pages.sh https://github.com/<用户名>/<仓库名>.git"
  exit 1
fi

REPO_URL="$1"

if [[ ! -d .git ]]; then
  git init -b main
fi

if ! git rev-parse --verify main >/dev/null 2>&1; then
  git checkout -b main
fi

git add .
if git diff --cached --quiet; then
  echo "没有新的改动需要提交。"
else
  git commit -m "chore: prepare GitHub Pages deployment"
fi

if git remote get-url origin >/dev/null 2>&1; then
  git remote set-url origin "$REPO_URL"
else
  git remote add origin "$REPO_URL"
fi

git push -u origin main

PATH_PART=$(echo "$REPO_URL" | sed -E 's#^https://github.com/##; s#^git@github.com:##; s#\.git$##')
OWNER=$(echo "$PATH_PART" | cut -d'/' -f1)
REPO=$(echo "$PATH_PART" | cut -d'/' -f2)

echo
echo "推送完成。"
echo "如果仓库是公开的，Pages 地址通常是："
echo "https://${OWNER}.github.io/${REPO}/"
echo
echo "首次发布请到 GitHub 仓库 Settings -> Pages，确认 Source 为 'GitHub Actions'。"
