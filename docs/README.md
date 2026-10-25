<!-- docs-synced-at: 35f1fcc6b9ac -->

# Documentation index

Start here. The table maps areas of the codebase to the doc you must read before changing them.
Agents and `docs` tooling parse this table, so keep its three columns and the glob syntax.

## If you change X, read Y

| Doc | Covers | Paths |
|---|---|---|
| [ARCHITECTURE.md](ARCHITECTURE.md) | Modules, boundaries, data flow | `src/**` |
| [DEVELOPMENT-STANDARDS.md](DEVELOPMENT-STANDARDS.md) | Language, formatting, imports, errors | `src/**` |
| [TESTING-GUIDE.md](TESTING-GUIDE.md) | Runners, fixtures, what to test | `src/**/*.test.tsx`, `jest.config.js`, `jest.setup.js` |
| [CODE-REVIEW-STANDARDS.md](CODE-REVIEW-STANDARDS.md) | Review lenses and severity | `**` |
| [TROUBLESHOOTING.md](TROUBLESHOOTING.md) | Environment, build and CI problems | `package.json`, `.nvmrc`, `**/*.config.*`, `.github/workflows/**` |
| [api/REACT-SWEET-WIZARD.md](api/REACT-SWEET-WIZARD.md) | Public API: `WizardProvider`, `Steps`, `Step`, `useWizardContext`, `DefaultWizardStepProps` | `src/index.tsx`, `src/index.test.tsx` |
| [playbooks/RELEASE-WORKFLOW.md](playbooks/RELEASE-WORKFLOW.md) | Versioning and publishing | `package.json`, `CHANGELOG.md` |
| [decisions/](decisions/README.md) | Architecture decision records | `**` |
| [specs/](specs/README.md) | Feature specs in progress | `**` |

## Conventions for this folder

- One topic per file, UPPER-KEBAB-CASE names, H1 is the title, first paragraph says when to read it.
- Each doc starts with a `docs-synced-at` marker; tooling uses it to detect drift against the code.
- Update docs in the same PR as the code they describe. No new top-level doc for routine work; extend an existing one.
