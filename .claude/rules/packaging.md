---
paths: ["package.json", "tsdown.config.*", "rollup.config.*", "vite.config.*", "ng-package.json", "projects/*/package.json"]
---
# Packaging

- `exports` map with `types` first, then `import`/`require` (and `default`), per entry. Keep `main`, `module`, `types` for older tooling only if already present.
- Build outputs go to `dist/` and are never committed. `files` whitelist in `package.json` lists `dist` plus README, LICENSE and CHANGELOG.
- Validate the package before publishing: `publint` and `@arethetypeswrong/cli` (`lint:package` script) must pass; `size-limit`/`bundlesize` budgets are updated deliberately, never silently raised.
- `prepack`/`prepublishOnly` run the build; `preversion` runs lint, format check, types and tests; `version` runs `version-changelog CHANGELOG.md && changelog-verify CHANGELOG.md` and stages the changelog.
- Smoke tests (`test:smoke`, `test:ssr`) import the built artefact, not the source, to catch packaging mistakes.
- Keep `engines.node` aligned with what the build output actually supports.
