---
paths: ["**/*.tsx", "**/*.vue", "**/*.component.html"]
---
# Accessibility

- Use semantic elements: `button` for actions, `a` for navigation, headings in order, landmarks (`nav`, `main`, `header`, `footer`). Never put `onClick` on a `div` or `span`.
- Every interactive element has an accessible name: visible text, `aria-label`, or a linked `label`. Icon-only buttons always carry `aria-label`.
- Keyboard: everything clickable is reachable with Tab and operable with Enter/Space; dialogs trap focus and return it on close; `Escape` closes overlays.
- Forms: inputs linked to labels, errors announced with `aria-describedby` and `role="alert"` where appropriate.
- Images carry meaningful `alt`, or `alt=""` when decorative. Do not rely on colour alone to convey state.
- Live updates (toasts, async results) use `aria-live` regions.
