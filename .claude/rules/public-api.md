---
paths: ["src/index.ts", "src/public-api.ts", "src/**/index.ts", "projects/*/src/public-api.ts"]
---
# Public API of a published library

- Everything exported from the entry point is a contract. Adding is a minor bump; renaming, removing or changing a signature is a major bump and needs a `BREAKING CHANGE` line in the changelog.
- Export types for every public option and result. Consumers must be able to type their code without `import` from internal paths.
- No default exports in the entry point; named exports only, so tree shaking and re-exports stay predictable.
- Side-effect free modules: no top-level I/O, timers or global mutation at import time. Mark `"sideEffects": false` in `package.json` when true.
- Peer dependencies for frameworks (React, Vue, Angular): declare the supported range, never bundle them, and keep a `check:min-peer` style script honest.
- SSR safety: never touch `window`, `document` or `navigator` at module scope; guard at call time.
