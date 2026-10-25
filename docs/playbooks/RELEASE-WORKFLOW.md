<!-- docs-synced-at: 35f1fcc6b9ac -->

# Release workflow

**When to read:** before cutting a version, publishing, or changing anything under `scripts` or
`.github/workflows/release.yml` that the release depends on.

## Overview

Releases are cut locally by the maintainer and verified twice by CI. `npm version <bump>` runs the
quality gates (`preversion`), rewrites `CHANGELOG.md` (`version`) and creates the tag. There is no
`postversion` script, so pushing the commit and the tag is a manual step. The pushed tag triggers
`.github/workflows/release.yml`: a `verify` job with a read-only token re-runs every gate, the package
checks and a dry-run pack; only then a `release` job, which installs no dependencies and is the only
one with `contents: write`, creates the GitHub Release with the changelog section of that version (a pre-release when the tag contains a hyphen,
such as `v3.0.0-rc.0`). `npm publish` stays a maintainer command: it triggers `prepack`, which runs
the gates again and builds `dist/`. CI never publishes to npm.

## 1. Pre-release checks

- `npm run lint`
- `npm run lint:types`
- `npm run test:coverage`
- `npm run build`
- `npm run size`
- `node scripts/check-package.mjs`
- `CHANGELOG.md` has every change for this release under `## [Unreleased]`; `npx changelog-verify CHANGELOG.md` passes.
- `node scripts/changelog-section.mjs Unreleased` prints the notes the GitHub Release will carry.

## 2. Version

`npm version <patch|minor|major>` runs: `preversion` first: `npm run lint -s && npm run lint:types -s && npm run test -s`. Then `version`: `version-changelog CHANGELOG.md` moves the `## [Unreleased]` entries under the new version heading with today's date, `changelog-verify CHANGELOG.md` checks the file still follows Keep a Changelog, and `git add CHANGELOG.md` stages it so npm's version commit includes it. The `## [Unreleased]` section must therefore contain the entries for this release before you run the command.

For a release candidate: `npm version 3.0.0-rc.0` (an explicit version works like a bump) and publish
with `--tag next` in step 3 so `latest` does not move.

## 3. Publish

1. `git checkout main && git pull` on a clean tree, Node from `.nvmrc` (`nvm use`), `npm ci`.
2. Make sure `CHANGELOG.md` has every change for this release under `## [Unreleased]`.
3. `npm version <patch|minor|major>` (gates, changelog rewrite, commit and tag).
4. `git push --follow-tags origin main`. The tag starts the `Release` workflow; wait for it to be
   green and check the GitHub Release it created.
5. `npm publish` (runs `prepack`: gates again, then `npm run build`; only `dist/`, `package.json`,
   `README.md`, `LICENSE` and `CHANGELOG.md` are published). For a release candidate:
   `npm publish --tag next`.

## 4. After publishing

- Check the package page on npm serves the new version and that `npm view react-sweet-wizard dist-tags` shows the expected `latest` (or `next`).
- Confirm the GitHub Actions `CI` workflow for the pushed commit and the `Release` workflow for the tag are both green, and Coveralls updated.
- Review the GitHub Release text; it is the changelog section, so fix typos in `CHANGELOG.md` with a follow-up commit rather than editing the release by hand.

## Rollback or hotfix

Never unpublish a version consumers may have installed. For a bad release, fix on `main`, add a changelog entry and publish a new patch. If the published build must be hidden, use `npm deprecate react-sweet-wizard@<version> "<reason>"`. For a fix on an older major, branch from the tag, cherry-pick, and publish with `npm publish --tag legacy` so `latest` is not moved. A tag pushed by mistake can be deleted before the `Release` workflow finishes; a published GitHub Release should be edited to point at the fix instead of deleted.
