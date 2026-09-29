#!/bin/bash
# init.sh — oturum zemini: hepsi yeşilse 0, biri kırmızıysa 1 döner.
set -e
[ -d node_modules ] || npm install
echo "== TİP ==";  npx tsc --noEmit
echo "== LINT =="; npm run --silent lint
echo "== TEST =="; npm test --silent
echo "== ÇALIŞMA AĞACI =="; git status --short
echo "ZEMİN YEŞİL"
