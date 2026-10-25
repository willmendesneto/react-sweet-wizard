<!-- docs-synced-at: 35f1fcc6b9ac -->

# Development standards

**When to read:** before writing or reviewing code in this repository. These are the conventions the
code already follows; keep new code consistent with them.

## Toolchain

| Concern | Tool | Command |
|---|---|---|
| Language | TypeScript 4.4, `strict: true`, React JSX (`jsx: react`) | |
| Formatting | Prettier 2 (`.prettierrc.js`; also enforced through `eslint-plugin-prettier` and `lint-staged` on commit) | `npx prettier --write src/` |
| Linting | ESLint 8 (`.eslintrc.js`: react, react-hooks, jsx-a11y, import, sonarjs, jest, testing-library, unicorn) | `npm run lint` |
| Types | tsc (`tsconfig.json`) | `npm run lint:types` |
| Package manager | npm | `npm install` |
| Node | 18.16.0 | from .nvmrc |

## File and naming conventions

- Single entry point `src/index.tsx`; every public symbol is a named export from it. The whole library is one file today; split into one component per file only when it grows, and keep exports flowing through `src/index.tsx`. No default exports (`import/no-default-export` is enforced; the Rollup config carries the one disable comment).
- Components and hooks follow React naming: `PascalCase` for `WizardProvider`, `Steps`, `Step`; `useXxx` for hooks; `camelCase` callbacks prefixed `on` for navigation (`onNext`, `onPrevious`).
- Public types are `PascalCase` interfaces (`DefaultWizardStepProps`). Internal types and the reducer stay unexported.
- Tests sit next to the code as `*.test.tsx` and are matched by `jest.config.js` `testMatch`.
- Prettier settings: 2 spaces, single quotes, semicolons, 80 columns, `arrowParens: avoid`, `trailingComma: es5`.

<!-- pack:base-js -->

### Quality gates

Run these before handing off, in this order. All must pass.

1. `npm run lint` (Lint)
2. `npm run lint:types` (Type check)
3. `npm run test` (Unit tests)
4. `npm run build` (Build)
5. `npm run size` (Size budget)

### Conventions

- Code style, TypeScript and script rules live in `.claude/rules/` and are summarised here. The formatter is the source of truth for layout; do not argue with it in review.
- Commits: imperative subject under 72 characters, body explains why. One logical change per commit.
- Changelog entries go under `## [Unreleased]` in `CHANGELOG.md` in the same PR as the change.

<!-- /pack:base-js -->

<!-- pack:framework -->

### Components

- Public components are exported from the package entry point only; internal helpers stay unexported. One component per file, named export, `PascalCase.tsx`.
- Props interface exported next to the component; defaults in the signature.
- The library never fetches or reads global state on its own; consumers pass data and callbacks through props or a provider.
- Tests sit next to the component or under `test/` mirroring the path, with `jest` and Testing Library.

### State and data

- Keep state inside the provider or hook that owns it; expose it through a small, documented hook API.
- Error and loading states are explicit components.

<!-- /pack:framework -->

## Error handling and logging

The library fails fast at development time with explicit `Error`s rather than degrading silently: `useWizardContext` throws when there is no `WizardProvider` above it, and `Steps` throws when it has no children or when a child is not a `Step`. Navigation actions never throw; out-of-range `onNext`, `onPrevious` and `goTo` calls are ignored by the reducer. There is no logging. Keep this contract: misuse of the API throws with an actionable message, runtime state transitions are no-ops when invalid, and the library never swallows a consumer callback's error (`onNext` awaits the callback and lets a rejection propagate).

## Dependencies

- Add a dependency only when the standard library or an existing dependency cannot do the job.
- Pin or range versions the same way the rest of `package.json` does.
- Runtime dependencies of a published library are a cost for every consumer; prefer peer or dev dependencies.

## Git and commits

- Branch from `main`, pattern `<type>/<short-slug>, for example feat/step-numeric-id`.
- Commit messages: Conventional Commits style as in the existing history (`feat:`, `fix:`, `refactor:`), imperative subject under 72 characters, body explains why.
- `CHANGELOG.md` follows Keep a Changelog; `npm version <patch|minor|major>` verifies it.

## Related documentation

- [TESTING-GUIDE.md](TESTING-GUIDE.md)
- [CODE-REVIEW-STANDARDS.md](CODE-REVIEW-STANDARDS.md)
