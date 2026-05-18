#!/bin/bash
set -e
cd /Users/matejdusic/Projects/pst-qa-showcase
OUT=/Users/matejdusic/Projects/pst-qa-showcase/test_results.txt
echo "=== api ===" > "$OUT"
npx playwright test --project=api --reporter=list --timeout=15000 2>&1 | head -80 >> "$OUT"
echo "" >> "$OUT"
echo "=== mock ===" >> "$OUT"
npx playwright test --project=mock --reporter=list --timeout=30000 2>&1 | head -80 >> "$OUT"
echo "" >> "$OUT"
echo "=== a11y ===" >> "$OUT"
npx playwright test --project=a11y --reporter=list --timeout=45000 2>&1 | head -80 >> "$OUT"
echo "" >> "$OUT"
echo "=== anonymous ===" >> "$OUT"
npx playwright test --project=anonymous --reporter=list --timeout=45000 2>&1 | head -150 >> "$OUT"
echo "" >> "$OUT"
echo "=== integration ===" >> "$OUT"
npx playwright test --project=integration --reporter=list --timeout=45000 2>&1 | head -100 >> "$OUT"
echo "DONE" >> "$OUT"
