---
paths: ["**/*.test.tsx", "**/*.spec.tsx", "**/*.test.ts", "**/*.spec.ts"]
---
# Testing React

- Render real components. Mock hooks, HTTP (MSW) and the environment, never sibling components from the same codebase.
- Query by role and accessible name first (`getByRole('button', { name: /save/i })`), then label and text; `data-testid` only for elements without semantics.
- `fireEvent` for component and hook tests; `userEvent` for page-level flows. With fake timers, create `userEvent.setup({ advanceTimers })`.
- Assert existence before acting: `expect(el).toBeInTheDocument()` then interact. No `if (el)` around assertions.
- Assert mock calls precisely (`toHaveBeenCalledWith`) and the number of calls when it matters.
- Cover the unhappy path for every happy path: empty data, error response, disabled state.
