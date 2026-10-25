# 0001. Rebuild the toolchain for 3.0: Vitest, Rollup 4, flat ESLint, size-limit, GitHub Actions

- Status: accepted
- Date: 2026-10-25
- Deciders: maintainer

## Context

The 2.x toolchain froze around 2021: Jest 27 through Babel, ESLint 8 with a 343-line config, Rollup 2
plus `uglify-js` for a UMD bundle, Prettier 2, Husky 7, CircleCI, and `bundlesize`, whose native
`iltorb` binding no longer loaded on current Node. Forty-one dev dependencies were one or more majors
behind. The library itself (about 200 lines) had known debt: `Step` typed `id` as `string` while the
docs promised numbers, step registration was count-based, `Steps` called hooks after conditional
throws, `onNext` was `async` but typed `void`, and `package.json` published entry fields the build
never produced. A major release was the only honest way to move all of it at once.

## Decision

Ship 3.0.0 on a current toolchain and fix the known API inconsistencies, accepting a set of breaking
changes documented in `CHANGELOG.md`:

- **Tests:** Vitest 5 with `@vitest/coverage-v8`, Testing Library 16 and jsdom 30 (Jest, Babel and
  `@testing-library/react-hooks` removed).
- **Build:** one Rollup 4 configuration with `@rollup/plugin-typescript` emitting ESM, CommonJS
  (ES2019) as `.mjs` and `.cjs`, `rollup-plugin-dts` bundling `.d.mts` and `.d.cts`, automatic JSX runtime, `exports` map with import and require branches, each types-first; publint and attw check it. The UMD build is
  removed.
- **Lint and format:** ESLint 9 flat config (39 lines) with typescript-eslint, react, react-hooks,
  jsx-a11y, testing-library, vitest and prettier; Prettier 3; Husky 9 with lint-staged.
- **Size:** `size-limit` with gzip budgets of 1500 B for each artefact, raised deliberately (twice, with
  the maintainer) to pay for id-based, reducer-side step registration and index clamping (3.0 measures
  about 1.45 KB for each; 2.0.1 shipped 1199 B ESM and 2653 B ES5 CJS).
- **CI:** GitHub Actions on a Node 22/24 by React 18/19 matrix, Coveralls through the official
  action, Dependabot, and a tag-triggered workflow that creates the GitHub Release from the changelog.
  Publishing to npm stays a maintainer step. CircleCI is removed.
- **Runtimes:** React peer `>=18.0.0` (`react-dom` dropped: never imported); `engines.node >=22` (Node 20 reached end of life on 2026-04-30 and several dev tools already require 22); development pinned to Node 24.22.0.
- **API:** `goTo` keeps its 2.x semantics (number = index, string = id); `Step` accepts numeric ids;
  registration follows ids; `onNext` returns its promise; `isLastStep` is `false` with no steps;
  `WizardContextValue<T>` is exported.

## Alternatives considered

| Option | Why not |
|---|---|
| Keep Jest, upgrade to 30 | Still needs a transformer (Babel or ts-jest) and a second config; Vitest reads `tsconfig` and the Rollup-style config directly and runs the suite in under a second. |
| `tsup` or `rolldown` instead of Rollup 4 | Less configuration, but the repo already had a Rollup config and plugin ecosystem; Rollup 4 was the smallest step that still removed Babel. |
| Keep the UMD bundle | It existed for script-tag consumers through unpkg; nobody maintains that path and it doubled the build and the budgets. Those consumers stay on 2.x. |
| Keep React 17 in the peer range | Testing Library 16 and the automatic JSX runtime target React 18+; a React 17 CI leg would need Testing Library 12 or a render-only smoke test. |
| Change `goTo(number)` to match ids (with a new `goToIndex`) | Rejected by the maintainer: the index semantics are simple and sufficient; the rule is now stated explicitly in the docs instead. |
| Keep the 2.0.1 size budgets | Id-based registration costs about 55 B gzipped; the maintainer chose correctness over the last bytes and raised the budgets once, deliberately. |
| Keep Node 20 (engines >=20) | End of life since 2026-04-30; Vitest 5, jsdom 30, jest-dom 7, lint-staged 17 and size-limit 14 already need Node 22, so supporting it meant pinning older majors. Raising the floor is free in a major release. |

## Consequences

- Positive: one build, one test runner, one lint config; 100% coverage on 35 tests; `npm ci` resolves
  without `--legacy-peer-deps`; every CI job is reproducible with one documented command; the
  published tarball is verified by `scripts/check-package.mjs` on every build.
- Negative: four breaking changes for consumers (React 18, Node 22, no UMD, `exports` map) and two
  behavioural ones (`onNext` promise, `isLastStep` with no steps), all with migration notes. The
  lockfile was regenerated because npm 10 and 11 crashed in arborist when adding the new set to the
  old tree.
- Accepted risk: `version-changelog` and `changelog-verify` (latest releases, 2022) pull dev-only
  advisories (meow, trim-newlines, yargs-parser, cross-spawn). They run only on the maintainer machine
  during `npm version`, on the repo's own CHANGELOG; nothing ships to consumers.
- Neutral: `goTo` keeps its ambiguity for numeric ids (documented); the budgets must be revisited if the
  library grows.
