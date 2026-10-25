<!-- docs-synced-at: 35f1fcc6b9ac -->

# Troubleshooting

**When to read:** when install, build, test or run fails on your machine or in CI.

## Environment

### Node version

Required: 22.22.3 (.nvmrc; `engines` allows any Node 20 or later). With nvm: `nvm use`. A different major usually shows up as native module build errors or syntax errors in dependencies.

### Install

`npm install`. Delete `node_modules` and the lockfile cache before retrying only when the lockfile itself is suspected; otherwise keep the lockfile.

## Build

- `npm run build` runs `build:clean` first and deletes `dist/`, `.jest/` and `coverage/`. `build:cjs` and `build:esm` run in parallel through `npm-run-all`; `build:umd` runs after them because Rollup takes `dist/esm/index.js` as input (it imports `module` and `browser` from `package.json`). If `build:umd` fails with a missing input, run `npm run build:esm` first.
- `build:umd:min` shells out to `uglifyjs` and `gzip`; `gzip` must exist on your PATH (it does on macOS and Linux CI).
- Declarations come only from `build:cjs` (`tsconfig.build.json` sets `declaration: false` and the CJS script passes `--declaration`), so `types` resolves to `dist/cjs/index.d.ts`. If types are missing, check that script.
- `lint:types` runs `tsc --noEmit` against `tsconfig.json`, which includes the test file; a type error in `src/index.test.tsx` fails the gate even though the test file is excluded from the build.

## Tests

- Jest uses Babel (`babel.config.js`, `env.test`) rather than `ts-jest`, so TypeScript type errors do not fail tests; they only fail `npm run lint:types`.
- `collectCoverage` is always on, so the thresholds apply to `npm run test:watch` too. Use `--coverage=false` locally when iterating on a single test.
- Testing Library warnings about `act(...)` usually mean a test called `onNext` with a callback and did not await it.
- The Jest cache lives in `.jest/` (gitignored). `npm run build` deletes it; a stale cache after dependency changes is fixed by `npx jest --clearCache`.

## Size budget

### `Error: dlopen(...iltorb.node...) library load disallowed by system policy` (`ERR_DLOPEN_FAILED`)

History, fixed in 3.0. Up to 2.0.1 the size gate ran `bundlesize`, which required the native `iltorb` binding at load time; its prebuilt binary did not load on Node 20 or later. The gate now runs `size-limit` (`npm run size`, config in `.size-limit.json`), which is pure JavaScript. If you check out a 2.x tag, use Node 18 or compare `gzip -c <file> | wc -c` against the budgets by hand.

## Gates in CI but not locally

CircleCI runs the same commands as the gates above, with two differences. Tests run as `npm run test:ci`, which adds `--coverage --coverageReporters=text-lcov | coveralls` and needs the `COVERALLS_REPO_TOKEN` from `.coveralls.yml` or the project settings; locally run plain `npm run test`. The `bundle_size` job runs `npm run build` before `npm run size`, so always build before checking sizes locally. CI pins `cimg/node:22.22.3`, matching `.nvmrc`; `engines` allows `>=20` but only Node 22 is exercised.

## Add an entry

Title the problem with the exact error text, then cause, then fix. Link the PR that fixed it.
