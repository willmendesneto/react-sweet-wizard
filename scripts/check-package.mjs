#!/usr/bin/env node
// Checks the publishable package after `npm run build`: every entry point exists in the tarball,
// retired fields are gone, and the ESM output has the expected shape. Exit 1 on the first failure.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const failures = [];
const fail = msg => failures.push(msg);

const forbiddenFields = ['browser', 'jsnext:main', 'es2015', 'es2020', 'cjs'];
for (const field of forbiddenFields) {
  if (field in pkg) fail(`package.json still has the "${field}" field`);
}

const entry = pkg.exports?.['.'];
if (!entry || typeof entry !== 'object') {
  fail('package.json exports["."] is missing');
} else {
  for (const condition of ['types', 'import', 'require']) {
    if (!entry[condition])
      fail(`exports["."] lacks the "${condition}" condition`);
  }
  if (Object.keys(entry)[0] !== 'types')
    fail('exports["."] must list "types" first');
}

const referenced = new Set(
  [pkg.main, pkg.module, pkg.types, ...Object.values(entry ?? {})]
    .filter(v => typeof v === 'string')
    .map(v => v.replace(/^\.\//, ''))
);

const packed = JSON.parse(
  execFileSync('npm', ['pack', '--dry-run', '--json', '--ignore-scripts'], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  })
);
const files = new Set(packed[0].files.map(f => f.path));
for (const path of referenced) {
  if (!files.has(path))
    fail(`${path} is referenced by package.json but not in the tarball`);
}

const esm = readFileSync(pkg.module, 'utf8');
if (!esm.includes('react/jsx-runtime'))
  fail(`${pkg.module} does not use react/jsx-runtime`);
if (esm.includes('displayName'))
  fail(`${pkg.module} still assigns displayName`);
if (esm.includes('NODE_ENV'))
  fail(`${pkg.module} still checks process.env.NODE_ENV`);

if (failures.length) {
  console.error('check-package: FAIL');
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log(
  `check-package: OK (${files.size} files in tarball; entry points: ${[...referenced].join(', ')})`
);
