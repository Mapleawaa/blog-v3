# AGENTS.md — Coding Agent Guidelines for blog-v3

## Project Overview

A Nuxt 4 blog ("Clarity" theme) using Vue 3 Composition API, TypeScript, SCSS, @nuxt/content for Markdown, Pinia for state, and pnpm workspaces with dependency catalogs.

---

## Build / Lint / Test Commands

```bash
pnpm dev            # Start dev server (opens browser)
pnpm build          # Production build
pnpm generate       # Static site generation
pnpm preview        # Preview production build locally
pnpm prepare        # Clean caches + nuxt prepare (auto-runs postinstall)

pnpm lint           # Run ESLint + Stylelint
pnpm lint:fix       # Auto-fix ESLint + Stylelint violations

pnpm new            # Create a new blog post (interactive via tsx scripts/new-blog)
pnpm init-project   # Initialize project configuration
pnpm check:feed     # Validate Atom feed
```

**Testing**: No test framework is configured (no vitest/jest). Rely on `pnpm lint` and `pnpm build` for correctness verification.

**Run a single file lint**: `npx eslint <file>` or `npx stylelint <file>`

---

## Code Style

### Formatting

- **Indentation**: Tabs (all files except JSON/YAML/Markdown which use 2-space)
- **Line endings**: LF (`end_of_line = lf` in `.editorconfig`)
- **Trailing whitespace**: Trimmed
- **JSON**: No trailing newline, 2-space indent
- **YAML**: 2-space indent

### ESLint Config (`@antfu/eslint-config`)

- TypeScript enabled by default
- Stylistic rules active with tab indentation
- Vue `<script>` must use `lang="ts"` (warning)
- Vue `<style>` must use `lang="scss"` and `scoped` (warning)
- `content/**` directory has relaxed rules (no strict eqeqeq, quotes, semicolons)

### Imports

- Use `~/` alias for `app/` directory (e.g., `~/types/article`, `~/components/blog/...`)
- Use `~~/` alias for project root (e.g., `~~/blog.config`, `~~/package.json`)
- Use `@/` for CSS/SCSS assets (e.g., `@/assets/css/main.scss`)
- Import types with `import type { ... }` syntax
- Prefer named exports; default exports only for config files (`blog.config.ts`, `app.config.ts`)
- Use `es-toolkit` instead of lodash (e.g., `es-toolkit/array`, `es-toolkit/string`)
- Use `@vueuse/core` for composable utilities

### TypeScript

- Interfaces for component options use `PascalCase` with descriptive names (e.g., `UseArticleSortOptions`)
- Enums for fixed value sets (e.g., `OicqAvatarSize`)
- Type assertions via `<Type>` syntax in object literals (e.g., `<Record<number, StatsEntry>>{}`)
- Global type augmentations in `app/types/index.ts`

### Naming Conventions

| Item | Convention | Example |
|---|---|---|
| Vue components | PascalCase | `ThemeToggle.vue`, `BlogSidebar.vue` |
| Partial components | `Z` prefix | `ZButton.vue`, `ZPagination.vue` (in `components/partial/`) |
| Composables | `use` prefix | `useArticle.ts`, `useToc.ts` |
| Pinia stores | `use*Store` | `useContentStore` |
| Server routes | RESTful filename | `stats.get.ts`, `atom.xml.get.ts` |
| Utility files | Short camelCase | `str.ts`, `img.ts`, `time.ts` |
| Config annotations | `// @keep-sorted` | Mark sorted lists for maintainers |

### Vue Components

```vue
<script setup lang="ts">
// Composition API only — no Options API
// Auto-imports: no need to import ref/computed/watch/useRouter etc.
</script>

<template>
<!-- Tab indentation in templates -->
</template>

<style lang="scss" scoped>
// SCSS variables auto-injected via @use "@/assets/css/_variable.scss" as *
// Use --c-* CSS custom properties for theming
</style>
```

### CSS / SCSS

- Use CSS custom properties (`var(--c-border)`, `var(--c-bg-2)`) for theme-aware values
- SCSS `@use` instead of `@import`
- Stylelint via `@zinkawaii/stylelint-config` with tab indentation and `prefix` media feature notation

### Error Handling

- Server routes: use `defineEventHandler(async (event) => { ... })`
- Graceful fallbacks with `??` and optional chaining `?.`
- Log warnings via `console.warn` for non-fatal issues

---

## Directory Structure

```
app/
  assets/css/       # Global SCSS (auto-injected variables)
  components/       # Vue components (auto-imported)
    partial/        # Reusable primitives (Z-prefix)
  composables/      # use* composables (auto-imported)
  pages/            # File-based routing
  stores/           # Pinia stores
  types/            # TypeScript type definitions
  utils/            # Utility functions (auto-imported)
server/
  api/              # API routes (*.get.ts, *.post.ts)
  routes/           # Page routes (atom.xml, opml)
modules/            # Custom Nuxt modules
shared/utils/       # Shared between client/server (str, time, icon, link)
remark-plugins/     # Custom remark/rehype plugins
content/            # Markdown blog posts (relaxed ESLint rules)
scripts/            # CLI scripts (new-blog, init-project, feed checks)
patches/            # pnpm patch files for dependencies
```

---

## Key Libraries

- **es-toolkit**: Utility functions (replaces lodash)
- **temporal-polyfill**: Date/time handling (Temporal API)
- **shiki**: Syntax highlighting with custom transformers
- **@vueuse/core** + **@vueuse/nuxt** + **@vueuse/router**: Reactive utilities
- **vue-tippy**: Tooltips
- **embla-carousel**: Carousel/slider components
- **minisearch**: Client-side full-text search
- **parse-domain**: URL domain parsing

---

## Commit Conventions

- Follow existing commit message style in git history
- Reference relevant issues when applicable
- Keep commits focused on a single change

---

## Notes for Agents

1. Always run `pnpm lint` after making code changes to verify correctness.
2. Vue components in `components/partial/` are prefixed with `Z` and registered globally.
3. The `// @keep-sorted` comment marks alphabetically-sorted object keys — maintain the sort order when modifying.
4. Use `blogConfig` from `~~/blog.config` for site-wide configuration; `appConfig` from `~/app.config` for runtime UI config.
5. Content directory (`content/`) has relaxed lint rules — don't apply strict formatting there.
6. No test framework exists — verify changes via `pnpm lint` and `pnpm build`.
