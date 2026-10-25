---
paths: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.mjs", "**/*.vue"]
---
# Code style

- Formatting is owned by the formatter configured in the repo (Prettier or Biome). Never hand-format; run the format script and commit its output.
- One component, class or module per file. File names: `PascalCase.tsx` for React components, `kebab-case.ts` for Angular and Vue files, `camelCase.ts` for utilities and hooks (`useX.ts`).
- Imports in groups: runtime/framework, third-party, internal alias (`@/`), relative. Use `import type` for type-only imports. Prefer the repo's path alias over `../..` chains when one exists.
- Prefer early returns over nested conditionals. Keep functions under ~40 lines; extract helpers with intention-revealing names.
- No commented-out code, no `console.log` left behind (use the repo logger if there is one), no TODO without an owner or ticket.
- Naming: `camelCase` variables and functions, `PascalCase` types and components, `UPPER_SNAKE_CASE` for primitive constants, `handleX` for event handlers, `isX`/`hasX` for booleans.
