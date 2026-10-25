<!-- docs-synced-at: 35f1fcc6b9ac -->

# Agent instructions (react-sweet-wizard)

Instructions for every coding agent and for humans working in this repository. The `docs/` folder is
the source of truth for architecture and conventions; this file tells you when to read what.

## Commands

| Task | Command |
|---|---|
| Lint | `npm run lint` |
| Type check | `npm run lint:types` |
| Unit tests | `npm run test` |
| Build | `npm run build` |
| Size budget | `npm run size` |
| Install | `npm install` |

Node 24.22.0 (current LTS, pinned in .nvmrc) from .nvmrc (engines: >=20). Package manager: npm.

## Mandatory for every change to application code

| Step | Requirement |
|---|---|
| Before coding | Read [docs/README.md](docs/README.md) and open every doc its table maps to the paths you will touch. Read the matching `docs/api/*` entry when the area is product-specific. State which docs you read. |
| While coding | Keep the change atomic: no drive-by refactors, no unrelated files. Handle unhappy paths for every new external call. Tests first for behaviour changes; match the conventions in [docs/TESTING-GUIDE.md](docs/TESTING-GUIDE.md). |
| Before handoff | Run the commands above in order and fix failures; never hand off with a red gate. Update support files in the same PR (below). Summarise what was verified and how. |

## Support files travel with the code

A change that makes a doc, rule or template wrong or incomplete fixes it in the same PR. Check
`docs/README.md`'s table for the docs that cover the paths you changed. When nothing needs an update,
say so explicitly in the PR description: `Support files: no update needed`.

## Path to doc routing

See the table in [docs/README.md](docs/README.md). Add a row whenever a new area gets a doc.

## Git

- Branch from `main`; name branches `<type>/<short-slug>, for example feat/step-numeric-id`.
- Commit only when asked. Never force-push shared branches. Small, reviewable PRs.
- Never commit secrets or `.env*` files. Reference where a secret lives, not its value.

## Documentation rules

- Public API behaviour lives in `docs/api/`, updated in the same PR as the code; a breaking change needs a changelog entry and an ADR.
- Architectural decisions that change a boundary get an ADR in `docs/decisions/`.
- Keep this file under 200 lines; move detail into `docs/`.
