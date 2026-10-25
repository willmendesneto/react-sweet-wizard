<!-- docs-synced-at: 35f1fcc6b9ac -->

# Release workflow

**When to read:** before cutting a version, publishing, or changing anything under `scripts` that the
release depends on.

## Overview

Releases are cut locally by the maintainer. `npm version <bump>` runs the quality gates (`preversion`), rewrites `CHANGELOG.md` (`version`) and creates the tag. There is no `postversion` script, so pushing the commit and tag is a manual step. `npm publish` triggers `prepack`, which re-runs the gates and builds `dist/`. CircleCI runs lint, types, tests and the size budget on every push but never publishes. The README mentions `np`; it is not a dev dependency, so treat it as an optional global helper that wraps the same `npm version` and `npm publish` steps.

## 1. Pre-release checks

- `npm run lint`
- `npm run lint:types`
- `npm run test`
- `npm run build`
- `npm run bundlesize`
- `CHANGELOG.md` has an entry under the next version; `npx changelog-verify CHANGELOG.md` passes.

## 2. Version

`npm version <patch|minor|major>` runs: `preversion` first: `npm run lint -s && npm run lint:types -s && npm run test -s`. Then `version`: `version-changelog CHANGELOG.md` moves the `## [Unreleased]` entries under the new version heading with today's date, `changelog-verify CHANGELOG.md` checks the file still follows Keep a Changelog, and `git add CHANGELOG.md` stages it so npm's version commit includes it. The `## [Unreleased]` section must therefore contain the entries for this release before you run the command.

## 3. Publish

1. `git checkout main && git pull` on a clean tree, Node from `.nvmrc` (`nvm use`), `npm install`.
2. Make sure `CHANGELOG.md` has every change for this release under `## [Unreleased]`.
3. `npm version <patch|minor|major>` (gates, changelog rewrite, commit and tag).
4. `git push --follow-tags origin main`.
5. `npm publish` (runs `prepack`: gates again, then `npm run build`; only `dist/` is published per `files`).
6. Optionally `npm run bundlesize` after the build to confirm the budgets on the published artefacts.

## 4. After publishing

- Check the package page on npm and the unpkg URL used in the README (`https://unpkg.com/react-sweet-wizard/dist/umd/react-sweet-wizard.js`) serve the new version.
- Confirm the CircleCI pipeline for the pushed commit is green and Coveralls updated.
- Create the GitHub release from the tag if you want release notes; the changelog section is the source text.

## Rollback or hotfix

Never unpublish a version consumers may have installed. For a bad release, fix on `main`, add a changelog entry and publish a new patch. If the published build must be hidden, use `npm deprecate react-sweet-wizard@<version> "<reason>"`. For a fix on an older major, branch from the tag, cherry-pick, and publish with `npm publish --tag legacy` so `latest` is not moved.
