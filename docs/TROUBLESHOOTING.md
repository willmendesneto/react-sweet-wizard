<!-- docs-synced-at: 35f1fcc6b9ac -->

# Troubleshooting

**When to read:** when install, build, test or run fails on your machine or in CI.

## Environment

### Node version

Required: Node 24, the current LTS (`.nvmrc` names the major only, so `nvm use` picks the newest installed 24.x; `engines` allows any Node 20 or later). With nvm: `nvm use`. A different major usually shows up as native module build errors or syntax errors in dependencies.

### Install

`npm install`. Delete `node_modules` and the lockfile cache before retrying only when the lockfile itself is suspected; otherwise keep the lockfile.

## Build

- `npm run build` is `rimraf dist && rollup -c`: one Rollup 4 run (`rollup.config.mjs`, `@rollup/plugin-typescript` reading `tsconfig.build.json`) emits `dist/esm/index.js`, `dist/cjs/index.cjs`, their source maps and the declarations under `dist/types/`. There is no UMD build since 3.0.
- `Path of Typescript compiler option 'outDir' must be located inside Rollup 'dir' option`: both outputs use `dir: 'dist'` with `entryFileNames` for the subfolder and the plugin sets `outDir: 'dist'`; keep it that way when adding an output.
- Missing `dist/types/index.d.ts`: the plugin needs `declaration: true`, `declarationDir: 'dist/types'` and `rootDir: 'src'` in `rollup.config.mjs`; `tsconfig.build.json` must not set `declaration: false`.
- `lint:types` runs `tsc --noEmit` against `tsconfig.json`, which includes the test file; a type error in `src/index.test.tsx` fails the gate even though the test file is excluded from the build.

## Tests

- Vitest transpiles TypeScript with esbuild and does not type-check, so type errors in tests only fail `npm run lint:types`.
- Coverage thresholds apply only to `npm run test:coverage`; `npm run test` and `npm run test:watch` skip coverage. A threshold failure prints the per-file table at the end of the run.
- Testing Library warnings about `act(...)` usually mean a test called `onNext` with a callback and did not wrap it in `await act(async () => ...)`.
- `ReferenceError: describe is not defined`: `globals` is off in `vitest.config.ts`; import the API from `vitest`.
- `Vitest 5` or `jsdom 30` fail to install or run on Node 20: both require Node 22.12 or later. The repo pins Vitest 4 and jsdom 26 while Node 20 is in the CI matrix.

## Size budget

### `Error: dlopen(...iltorb.node...) library load disallowed by system policy` (`ERR_DLOPEN_FAILED`)

History, fixed in 3.0. Up to 2.0.1 the size gate ran `bundlesize`, which required the native `iltorb` binding at load time; its prebuilt binary did not load on Node 20 or later. The gate now runs `size-limit` (`npm run size`, config in `.size-limit.json`), which is pure JavaScript. If you check out a 2.x tag, use Node 18 or compare `gzip -c <file> | wc -c` against the budgets by hand.

## Gates in CI but not locally

GitHub Actions (`.github/workflows/ci.yml`) runs the same five gates with three differences. The `test` job adds `--coverage --coverageReporters=lcov` and the Node 24 leg uploads `coverage/lcov.info` to Coveralls with the repository `GITHUB_TOKEN`; a failure there means the repository is not linked on coveralls.io, not a test failure. The `test` and `build` jobs run on Node 20, 22 and 24, so a dependency that drops an older major shows up only in CI; reproduce with `nvm use 20 && npm ci && npm test`. The `size` job runs `npm run build` before `npm run size`, so always build before checking sizes locally. Every job starts with `npm ci`, which fails on peer conflicts that `npm install --legacy-peer-deps` hides; run `npm ci` locally after changing dependencies.

## Add an entry

Title the problem with the exact error text, then cause, then fix. Link the PR that fixed it.
