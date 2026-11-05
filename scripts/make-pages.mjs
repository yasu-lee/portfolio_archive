#!/usr/bin/env node
// Creates site/<cat>/<slug>.html for every entry in site/assets/entries.js.
// Existing files are left untouched (so an agent-made HTML report can replace a page).
// Usage: node scripts/make-pages.mjs [--force]
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'site');
const force = process.argv.includes('--force');
const ctx = { window: {} };
vm.runInNewContext(readFileSync(join(root, 'assets/entries.js'), 'utf8'), ctx);
const { ENTRIES } = ctx.window.STUDY;

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const page = (e) => `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(e.no)} ${esc(e.title)} — STUDY FILES</title>
<meta name="description" content="${esc(e.summary)}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Antonio:wght@600;700&family=Noto+Serif+KR:wght@300;400;600&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans+KR:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../assets/styles.css">
</head>
<body data-entry="${esc(e.id)}" data-base="../">
<div class="overlay" id="overlay">
  <div class="sheet-wrap">
    <main class="sheet" id="sheet"><noscript><p style="padding:80px">${esc(e.title)}</p></noscript></main>
  </div>
</div>
<script src="../assets/entries.js"></script>
<script src="../assets/dossier.js"></script>
<script src="../assets/entry-page.js"></script>
</body>
</html>
`;

let made = 0, kept = 0;
for (const e of ENTRIES) {
  const file = join(root, e.page);
  if (existsSync(file) && !force) { kept++; continue; }
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, page(e));
  made++;
  console.log('created', e.page);
}
console.log(`${made} created, ${kept} kept`);
