# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun run dev          # Start dev server on port 3000
bun run build        # Production build
bun run preview      # Preview production build on port 5000
bun run lint:check   # Run ESLint
bun run lint:fix     # Auto-fix ESLint issues
bun run format:check # Check Prettier formatting
bun run format:fix   # Auto-fix formatting
```

No test runner is configured.

## Architecture

**Nookipedia** is a single-page Animal Crossing character encyclopedia. There is no client-side routing — all views are state-driven.

### Data flow

`App.tsx` fetches characters from Supabase on mount using `VITE_URL` and `VITE_API_KEY` env vars. All filtering (search by name, filter by birth month) and pagination (35 items/page) happen client-side in `App.tsx` state. A clicked character sets `selectedItem`, which opens `Modal.tsx`.

Key state in `App.tsx`:
- `data` — raw API response (`CharList[]`)
- `filteredData` — result after search/month filter
- `isSearched` / `isMonth` — which filter mode is active
- `currentPage` — pagination cursor
- `selectedItem` — character passed to modal

### Type definitions

`src/@types/global.d.ts` defines the two global interfaces:
- `CharList` — `{ name, image_url, gender, birthday_month }`
- `CharacterInfo extends CharList` — adds optional `quote`

### Path aliases (tsconfig + vite)

- `@/*` → `src/*`
- `@components/*` → `src/components/*`
- `@assets/*` → `src/assets/*`

### Styling conventions

Tailwind CSS 4 with CSS layers (`theme` → `base` → `utilities`). Base styles live in `src/styles/common/`. Custom animations are in `_animation.css`.

### Code style

Prettier config: no semicolons, single quotes, 2-space indent, trailing commas (ES5). ESLint enforces TypeScript strict mode, React hooks rules, and jsx-a11y. Run `format:fix` and `lint:fix` before committing.
