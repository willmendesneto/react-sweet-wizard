#!/usr/bin/env node
// Checks the publishable package after `npm run build`: every entry point exists in the tarball,
// retired fields are gone, the ESM output has the expected shape, and the package actually loads
// through its own `exports` map with both `import` and `require`. Exit 1 on any failure.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const failures = [];
const fail = msg => failures.push(msg);

const forbiddenFields = ['browser', 'jsnext:main', 'es2015', 'es2020', 'cjs'];
for (const field of forbiddenFields) {
  if (field in pkg) fail(`package.json still has the "${field}" field`);
}

const root = pkg.exports?.['.'];
const branches = { import: root?.import, require: root?.require };
for (const [condition, branch] of Object.entries(branches)) {
  if (!branch || typeof branch !== 'object') {
    fail(`exports["."].${condition} is missing`);
    continue;
  }
  if (Object.keys(branch)[0] !== 'types')
    fail(`exports["."].${condition} must list "types" first`);
  if (!branch.default) fail(`exports["."].${condition} lacks "default"`);
}
if (pkg.exports?.['./package.json'] !== './package.json')
  fail('exports["./package.json"] is missing');

const strip = path => path.replace(/^\.\//, '');
const referenced = new Set(
  [
    pkg.main,
    pkg.module,
    pkg.types,
    ...Object.values(branches).flatMap(b => Object.values(b ?? {})),
  ]
    .filter(v => typeof v === 'string')
    .map(strip)
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
for (const required of ['README.md', 'LICENSE', 'CHANGELOG.md']) {
  if (!files.has(required)) fail(`${required} is not in the tarball`);
}

const esmPath = strip(branches.import?.default ?? '');
const esm = existsSync(esmPath) ? readFileSync(esmPath, 'utf8') : '';
if (!esm)
  fail(`${esmPath || 'the ESM entry'} does not exist; run npm run build`);
if (!esm.includes('react/jsx-runtime'))
  fail('the ESM entry does not use react/jsx-runtime');
if (esm.includes('displayName'))
  fail('the ESM entry still assigns displayName');
if (esm.includes('NODE_ENV'))
  fail('the ESM entry still checks process.env.NODE_ENV');

// Smoke test through the package's own name (Node resolves self-references via `exports`).
const expected = 'Step,Steps,WizardProvider,useWizardContext';
const load = (args, label) => {
  try {
    const out = execFileSync(process.execPath, args, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    }).trim();
    if (out !== expected)
      fail(`${label} exported "${out}", expected "${expected}"`);
  } catch (error) {
    fail(
      `${label} failed: ${String(error.stderr || error.message).split('\n')[0]}`
    );
  }
};
load(
  [
    '--input-type=module',
    '-e',
    `const m = await import('${pkg.name}'); console.log(Object.keys(m).sort().join(','));`,
  ],
  'import()'
);
load(
  ['-e', `console.log(Object.keys(require('${pkg.name}')).sort().join(','));`],
  'require()'
);

if (failures.length) {
  console.error('check-package: FAIL');
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log(
  `check-package: OK (${files.size} files in tarball; import and require load; entry points: ${[...referenced].join(', ')})`
);
