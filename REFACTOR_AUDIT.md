Refactor audit summary

Findings:
- Duplicate i18n implementations: `utils/dictionary.ts` and `lib/i18n.ts` (missing). Consolidated shim created at `src/lib/i18n.ts` to normalize imports.
- Supabase helpers were referenced at `@/lib/supabase/*` but actual helper lived in `utils/supabase/client.ts`. Added `src/lib/supabase/browser.ts` and `src/lib/supabase/server.ts` shims to centralize access.
- Multiple layout duplication: `src/app/[lang]/layout.tsx` contained `html`/`body`. Created root `src/app/layout.tsx` and adjusted `[lang]/layout.tsx` to avoid duplicate `html`/`body` tags.
- UI components split between `/components` and `/src/components` (duplicates like `button.tsx`). Recommend consolidating UI primitives into `src/components/ui` and updating imports.

Recommendations / next steps:
1. Consolidate and migrate components from `/components` into `src/components` (primitives first).
2. Move feature folders into route groups inside `src/app/[lang]/(feature)` to avoid duplicated layouts and share group layouts.
3. Replace direct Supabase usage in components with hooks from `src/lib/supabase` (e.g., `useAuth`).
4. Centralize locale files under `src/locales/{fr,ar}` and implement a small `i18n` loader that supports namespace files per feature.
5. Run tests and manual smoke-testing of auth flows after server supabase shim (server session handling uses cookies via `@supabase/ssr`).
