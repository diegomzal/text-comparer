# Text Comparer — Design System

Extracted from existing code (src/App.tsx, src/components/**, src/index.css).

## Foundation

- Tailwind CSS v4 + shadcn/ui primitives (radix-ui), semantic tokens defined in `src/index.css` as oklch CSS variables.
- Dark mode: class strategy — `.dark` on `<html>`, set pre-paint by an inline script in `index.html`, toggled by `useTheme`.

## Spacing

- Base: 4px (Tailwind scale). Steps in use: 4, 8, 12, 16, 24, 32 (`p-1`…`p-8`).
- Panel/header padding: `p-3` (12px) for bars, `p-4` (16px) for chrome, `p-6`/`p-8` (24/32px) for content wells.
- Gaps: `gap-1` (icon clusters), `gap-2/3` (related controls), `gap-4/6` (control groups).

## Radius

- Token-driven: `--radius: 0.625rem` (10px); components use shadcn `rounded-sm/md/lg` derived values. No hardcoded radii.

## Depth

- Borders-only at app level: `border`, `border-b` bars, `w-px` dividers. No app-level shadows.
- Shadows only where shadcn primitives ship them (dialog `shadow-lg`, tab triggers `shadow-sm`).

## Typography

- Title: `text-2xl font-bold tracking-tight`.
- Body/labels: `text-sm`; secondary via `text-muted-foreground`.
- Micro-labels (pane headers): `text-xs uppercase tracking-widest text-muted-foreground`.
- All diff/text content: `font-mono text-sm leading-relaxed whitespace-pre-wrap`.
- Counters use `tabular-nums`.

## Color

- Chrome uses semantic tokens only: `bg-background`, `bg-card`, `bg-muted/*`, `text-foreground`, `text-muted-foreground`, `border-border`. Never hardcoded neutrals.
- Domain colors (the only allowed literal palette colors):
  - Added: `bg-green-100 text-green-800` light / `dark:bg-green-900/70 dark:text-green-100`; stat accent `text-green-600 dark:text-green-400`.
  - Removed: `bg-red-100 text-red-800` + `line-through decoration-red-500 decoration-2` / `dark:bg-red-900/70 dark:text-red-100`; stat accent `text-red-600 dark:text-red-400`.
  - Added/removed tints are symmetric in weight — tone marks the change, decoration (strikethrough) distinguishes removal.
  - Active change: `outline-2 outline-offset-1 outline-blue-500`.
  - Primary accent (switch checked): `bg-blue-600`.
- Diff highlight classes live in `src/components/diff/view-utils.ts` — never inline them.

## Patterns

- Buttons: shadcn `Button`. Default for primary actions; `variant="ghost" size="icon"` for toolbar toggles; `variant="outline" size="icon"` + `size-7` for compact nav controls.
- Cards: `border-muted/40 bg-card/50`, header `pb-3`.
- Bars (pane/dialog headers): `p-3`/`p-4`, `bg-muted/50`, `border-b`, micro-label typography.
- Vertical separators: `h-4 w-px bg-border`.
