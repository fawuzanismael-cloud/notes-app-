# Notes

React + Vite notes app with All / Pinned / Archived views.

- `src/hooks/useLocalStorage.js` – persistent state hook (syncs across tabs)
- `src/hooks/useNotes.js` – `add`, `update`, `remove`, derived `pinned`
- `src/context/ThemeContext.jsx` – `ThemeProvider` + `useTheme`, theme saved in localStorage

## Run

```bash
pnpm install
pnpm dev
pnpm build
```

## Deploy (Vercel)

```bash
pnpm dlx vercel --prod
```
Build command: `pnpm build` · Output directory: `dist`
