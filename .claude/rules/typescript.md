---
paths: ["**/*.ts", "**/*.tsx", "**/*.mts"]
---
# TypeScript

- `strict` stays on. Never add `any`; use `unknown` and narrow, or write the real type. Never use `// @ts-ignore`; `// @ts-expect-error` with a reason is the only escape hatch.
- `interface` for object shapes and public contracts; `type` for unions, intersections and mapped/conditional types. No `enum`; use `as const` objects or string unions.
- Exported functions declare their return type. Internal helpers may infer.
- More than four positional parameters means an options object named `<FunctionName>Params`.
- Validate external data (HTTP, env, storage) at the boundary with the repo's schema library or explicit guards; the rest of the code trusts the typed result.
- Prefer `readonly` arrays and properties for data that is not mutated. Prefer `satisfies` over casts to keep literal types.
- Do not export types from implementation files that are not meant to be public; keep shared types in a `types/` module.
