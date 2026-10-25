#!/usr/bin/env node
// Lints the publishable tarball with publint and @arethetypeswrong/cli. Packs with --ignore-scripts
// into a temp folder so it never re-runs prepack (lint, types, tests, build); run `npm run build`
// first. Exit code is the first failing tool's.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const dir = mkdtempSync(join(tmpdir(), 'react-sweet-wizard-pack-'));
const run = (cmd, args) =>
  execFileSync(cmd, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

try {
  const [{ filename }] = JSON.parse(
    execFileSync(
      'npm',
      ['pack', '--ignore-scripts', '--json', '--pack-destination', dir],
      { encoding: 'utf8', shell: process.platform === 'win32' }
    )
  );
  const tarball = join(dir, filename);
  run('npx', ['publint', tarball]);
  run('npx', ['attw', tarball, '--profile', 'node16']);
} catch (error) {
  process.exitCode = error.status ?? 1;
} finally {
  rmSync(dir, { recursive: true, force: true });
}
