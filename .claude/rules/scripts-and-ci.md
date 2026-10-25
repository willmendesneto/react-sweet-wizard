---
paths: ["package.json", "scripts/**", ".github/workflows/**", ".nvmrc", "*.config.*"]
---
# Scripts, dependencies and CI

- Use the package manager the lockfile dictates. Never commit a second lockfile. Install with the frozen/ci variant (`npm ci`, `yarn --frozen-lockfile`, `pnpm install --frozen-lockfile`).
- Respect `.nvmrc`/`engines.node`. New scripts must run on the pinned Node version in CI.
- Scripts in `package.json` are the public interface for humans and agents: keep `lint`, `test`, `build` working with no arguments; add `:ci` or `:watch` variants rather than changing their meaning.
- Cross-platform scripts: no bash-only syntax inside `package.json` scripts; put logic in `scripts/*.mjs` or `scripts/*.sh` with a shebang.
- Dependencies: pin exact versions only for tooling that breaks on minor bumps; prefer `^` otherwise. Remove a dependency in the same PR that removes its last import.
- Every CI job must be reproducible locally with one documented command. Do not add `continue-on-error` to hide failures.
- Changelog: when the repo uses `version-changelog`/`changelog-verify`, add the entry under `## [Unreleased]` in the same PR as the change.
