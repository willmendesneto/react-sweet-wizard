#!/usr/bin/env node
// Prints the CHANGELOG.md section for one version (Keep a Changelog headings `## [x.y.z][] - date`).
// Usage: node scripts/changelog-section.mjs <version|Unreleased>   (a leading "v" is ignored)
import { readFileSync } from 'node:fs';

const wanted = (process.argv[2] ?? '').replace(/^v/, '');
if (!wanted) {
  console.error('usage: changelog-section.mjs <version|Unreleased>');
  process.exit(2);
}

const lines = readFileSync('CHANGELOG.md', 'utf8').split('\n');
const heading = /^## \[([^\]]+)\]/;
const start = lines.findIndex(line => heading.exec(line)?.[1] === wanted);
if (start === -1) {
  console.error(
    `changelog-section: no "## [${wanted}]" heading in CHANGELOG.md`
  );
  process.exit(1);
}
const rest = lines.slice(start + 1);
const end = rest.findIndex(line => heading.test(line));
const body = (end === -1 ? rest : rest.slice(0, end)).join('\n').trim();
if (!body) {
  console.error(`changelog-section: the "${wanted}" section is empty`);
  process.exit(1);
}
process.stdout.write(`${body}\n`);
