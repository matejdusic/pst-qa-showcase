#!/bin/bash
# Run this once from your Mac terminal to push to GitHub:
#   cd ~/Projects/pst-qa-showcase && bash push-to-github.sh

set -e

echo "→ Cleaning stale git lock..."
rm -f .git/index.lock

echo "→ Reinitialising git state..."
git config user.email "matej.dusic@prototyp.digital"
git config user.name "Matej Dusic"
git branch -M main 2>/dev/null || true
git remote set-url origin https://github.com/matejdusic/pst-qa-showcase.git 2>/dev/null \
  || git remote add origin https://github.com/matejdusic/pst-qa-showcase.git

echo "→ Staging all files..."
git add -A

echo "→ Committing..."
git commit -m "feat: initial Playwright QA showcase project

- 33 test cases (TC-001–TC-033) across 10 areas
- Page Object Model: BasePage + 6 feature page objects
- Fixture-based dependency injection (pageFixtures.ts)
- 9 Playwright projects: anonymous, authenticated, mobile, visual,
  api, integration, mock, a11y, setup
- GitHub Actions CI with 8 parallel jobs
- WCAG 2.0 accessibility coverage via axe-core
- Network mock/intercept + API contract tests
- Visual regression baseline structure
- Target: https://practicesoftwaretesting.com" 2>/dev/null \
  || echo "(nothing new to commit, already up to date)"

echo "→ Pushing to GitHub..."
git push -u origin main --force

echo ""
echo "✓ Done! Check: https://github.com/matejdusic/pst-qa-showcase"
echo ""
echo "Next: add repo secrets in GitHub Settings → Secrets → Actions:"
echo "  SITE_USERNAME = customer@practicesoftwaretesting.com"
echo "  SITE_PASSWORD = welcome01"
