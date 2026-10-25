<!-- docs-synced-at: 35f1fcc6b9ac -->

# Troubleshooting

**When to read:** when install, build, test or run fails on your machine or in CI.

## Environment

### Node version

Required: Node 24.22.0, the current LTS (pinned in `.nvmrc`; `engines` allows any Node 22 or later). With nvm: `nvm use`. A different major usually shows up as native module build errors or syntax errors in dependencies.

### Install

`npm install`. Delete `node_modules` and the lockfile cache before retrying only when the lockfile itself is suspected; otherwise keep the lockfile.

## Build

- `npm run build` is `rimraf dist && rollup -c`. `rollup.config.mjs` has two passes: `@rollup/plugin-typescript` (reading `tsconfig.build.json`) emits `dist/esm/index.mjs` and `dist/cjs/index.cjs` with source maps, and `rollup-plugin-dts` bundles `dist/esm/index.d.mts` and `dist/cjs/index.d.cts`. There is no UMD build since 3.0.
- `Path of Typescript compiler option 'outDir' must be located inside the same directory as the Rollup 'file' option`: the code outputs use `dir: 'dist'` with `entryFileNames` for the subfolder and the plugin sets `outDir: 'dist'` and `rootDir: 'src'`; keep it that way when adding an output.
- `SyntaxError: Cannot use import statement outside a module` when importing the package on an older Node: the ESM entry must keep the `.mjs` extension (there is no `"type": "module"`). `node scripts/check-package.mjs` imports and requires the package by name to catch this.
- `npm run lint:package` fails: publint reports package.json problems, attw reports type resolution problems per `moduleResolution` (node16 from CJS and ESM, bundler). Rebuild first; both read the packed tarball.
- `lint:types` runs `tsc --noEmit` against `tsconfig.json`, which includes the test files; a type error in a test fails the gate even though tests are excluded from the build.

## Tests

- Vitest transpiles TypeScript with esbuild and does not type-check, so type errors in tests only fail `npm run lint:types`.
- Coverage thresholds apply only to `npm run test:coverage`; `npm run test` and `npm run test:watch` skip coverage. A threshold failure prints the per-file table at the end of the run.
- Testing Library warnings about `act(...)` usually mean a test called `onNext` with a callback and did not wrap it in `await act(async () => ...)`.
- `ReferenceError: describe is not defined`: `globals` is off in `vitest.config.ts`; import the API from `vitest`.
- `Vitest 5`, `jsdom 30`, `lint-staged 17` and `size-limit 14` need a recent Node 22 (22.12 to 22.22, depending on the package) or Node 24; an older 22.x shows engine warnings or syntax errors. Use the version in `.nvmrc`.

## Size budget

### `Error: dlopen(...iltorb.node...) library load disallowed by system policy` (`ERR_DLOPEN_FAILED`)

History, fixed in 3.0. Up to 2.0.1 the size gate ran `bundlesize`, which required the native `iltorb` binding at load time; its prebuilt binary did not load on Node 20 or later. The gate now runs `size-limit` (`npm run size`, config in `.size-limit.json`), which is pure JavaScript. If you check out a 2.x tag, use Node 18 or compare `gzip -c <file> | wc -c` against the budgets by hand.

## Gates in CI but not locally

GitHub Actions (`.github/workflows/ci.yml`) runs the same five gates with three differences. The `test` job runs `npm run test:coverage` on Node 22 and 24 by React 18 and 19 (the React version is installed with `npm install --no-save` after `npm ci`), and the Node 24 / React 19 leg uploads `coverage/lcov.info` to Coveralls with the repository `GITHUB_TOKEN`; a failure there means the repository is not linked on coveralls.io, not a test failure. The `test` and `build` jobs run on Node 22 and 24, so a dependency that drops Node 22 shows up only in CI; reproduce with `nvm use 22 && npm ci && npm test`. The `build` job also runs `node scripts/check-package.mjs` and `npm run lint:package` (publint and attw). The `size` job runs `npm run build` before `npm run size`, so always build before checking sizes locally. Every job starts with `npm ci`, which fails on peer conflicts that `npm install --legacy-peer-deps` hides; run `npm ci` locally after changing dependencies.

## Add an entry

Title the problem with the exact error text, then cause, then fix. Link the PR that fixed it.
