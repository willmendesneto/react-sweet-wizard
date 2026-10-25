---
paths: ["**/*.tsx", "**/hooks/**/*.ts", "**/use*.ts"]
---
# React components and hooks

- Function components only. Props are an exported `interface <Component>Props`; defaults live in the component signature, not at call sites.
- Keep components small: presentational JSX in the component, data fetching and side effects in hooks (`useX`), pure logic in utilities. A file over ~200 lines is a signal to split.
- Event handlers are named `handleX` inside the component and passed as `onX` props.
- Derive state instead of syncing it; a `useEffect` that only copies props into state is a bug. Reach for `useMemo`/`useCallback` only for measured re-render costs or stable identities required by children.
- Lists need stable `key`s from data, never array indexes when items can reorder.
- Styling follows the repo's system (CSS modules, Tailwind with a `cn()` helper, or the component library). Never inline style objects for static styles.
- Error boundaries wrap independent regions that can fail (widgets, third-party embeds). Loading states are explicit components, not `null`.
- Context providers expose a typed hook (`useX`) that throws when used outside the provider.
