<!-- docs-synced-at: 35f1fcc6b9ac -->

# Code review standards

**When to read:** while implementing any change (these are build constraints, like the linter) and when
reviewing a PR.

## Severity ladder

| Level | Meaning | Action |
|---|---|---|
| P0 | Security, data loss, broken build or release, silent wrong results | Do not merge. Do not hand off. |
| P1 | Incorrect behaviour for a real path, missing tests for changed behaviour, boundary violation | Fix before merge. |
| P2 | Maintainability, naming, duplication, style the tooling does not catch | Fix or open a follow-up. |

## The seven lenses

1. **Works and is verified**: tests exist for the changed behaviour and ran green; the author says how they verified it.
2. **Architecture fit**: respects the boundaries in [ARCHITECTURE.md](ARCHITECTURE.md); no parallel pattern introduced.
3. **Maintainability**: a newcomer can follow it; names say what things are; no dead code.
4. **Atomicity**: one concern per PR; no drive-by changes; migrations and code can ship independently.
5. **Evolution**: the change makes the next change easier, not harder.
6. **Unhappy paths**: every external call handles failure; inputs are validated at the boundary.
7. **Insufficient-review smells**: large diffs with no tests, "minor refactor" touching many files, TODOs without issues, commented-out code.

## Comment format

`[P0|P1|P2] <file:line> <what is wrong> → <what to do instead>`. One finding per comment. Link the doc that defines the rule when one exists.

## Module routing

Use the table in [README.md](README.md). The reviewer checks that the docs it names were respected and updated.

## Known failure modes

Add entries as they happen; this section is institutional memory.

- **Bundle budget exceeded.** A one-line helper or an extra React import can push `dist/esm/index.mjs` or `dist/cjs/index.cjs` past the 1600 B gzip budget in `.size-limit.json` (about 1.48 KB today). Run `npm run build && npm run size` locally before opening the PR; CI runs the same pair in the `size` job.
- **Coverage threshold failure.** New branches without tests fail `npm run test:coverage` even when every test passes. Read the per-file table Vitest prints below the summary.
- **Type and docs drift.** `Step`, `DefaultWizardStepProps.id` and `goTo` share the `number | string` id type; review any change to one of them against the other two, the README and `docs/api/REACT-SWEET-WIZARD.md`.
- **Unhandled `onNext` rejection.** `onNext` returns the callback chain as a promise; a call site that neither awaits nor catches it turns a failed validator into an unhandled rejection. Review every new `onNext(cb)` call for handling.
- **Behaviour change to `goTo`.** Numbers are indexes, strings are ids. Any change here is a breaking change and needs a changelog entry and an ADR.
