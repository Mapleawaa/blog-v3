[根目录](../CLAUDE.md) > **app/**

# app/ — 应用层

> 变更记录 (Changelog)
>
> | 日期 | 变更内容 | 作者 |
> |------|----------|------|
> | 2026-04-29 | 初始化模块文档 | Claude (架构师) |

## 模块职责

Nuxt 3 应用层，是博客的前端核心。包含 Vue 组件、页面路由、状态管理、组合式函数、插件、类型定义和静态资源。所有 UI 渲染、用户交互、内容展示均在此模块中实现。

## 入口与启动

| 文件 | 用途 |
|------|------|
| `app.vue` | 根布局组件，定义页面骨架（侧边栏、内容区、底栏、面板） |
| `app.config.ts` | 运行时应用配置（导航菜单、页脚链接、分页设置、主题选项） |
| `shiki.config.ts` | 代码高亮配置（Catppuccin Latte / One Dark Pro 主题 + 转换器链） |
| `feeds.ts` | 友链订阅源数据（FeedGroup 数组，包含朋友和常用服务两组） |

## 对外接口

### 路由页面

| 路由 | 文件 | 功能 |
|------|------|------|
| `/` | `pages/index.vue` | 文章列表首页，支持分页和排序 |
| `/**` | `pages/[...slug].vue` | 文章详情页，渲染 Markdown 内容 |
| `/archive` | `pages/archive.vue` | 文章归档页，按年份分组 |
| `/link` | `pages/link.vue` | 友链页面，展示 Feed 订阅源 |
| `/preview` | `pages/preview.vue` | 预览文章列表 |

### Pinia Stores（状态管理）

| Store | 文件 | 职责 |
|-------|------|------|
| `useContentStore` | `stores/content.ts` | 文章元数据（TOC、meta slots），路由切换时自动清除 |
| `useLayoutStore` | `stores/layout.ts` | 页面布局状态（右侧栏 widget 显隐控制） |
| `useSearchStore` | `stores/search.ts` | 全站搜索状态管理 |

### 组合式函数 (Composables)

| 文件 | 功能 |
|------|------|
| `composables/useArticle.ts` | 文章列表排序、筛选逻辑 |
| `composables/useCopy.ts` | 代码块复制功能 |
| `composables/usePagination.ts` | 文章列表分页 |
| `composables/useToc.ts` | 文章目录（Table of Contents）高亮跟踪 |
| `composables/useWidgets.ts` | 右侧栏 Widget 切换逻辑 |

## 关键依赖与配置

- **Vue 3.5** + **Vue Router 5** — 前端框架与路由
- **Nuxt 4** — 全栈框架（SSR/SSG）
- **Pinia** — 状态管理
- **@nuxt/content** — Markdown 内容管理
- **Shiki** — 语法高亮（含 colorized-brackets、transformers）
- **@vueuse/core** — 组合式工具集
- **es-toolkit** — 工具函数库
- **temporal-polyfill** — 日期时间处理
- **embla-carousel** — 轮播/Slide 组件
- **vue-tippy** — Tooltip 提示
- **minisearch** — 客户端全文搜索

## 数据模型

### 文章类型 (`types/article.ts`)
定义文章相关的 TypeScript 接口：文章排序选项、分类数据等。

### 订阅源类型 (`types/feed.ts`)
定义 FeedEntry、FeedGroup 接口，用于友链页面数据。

### 导航类型 (`types/nav.ts`)
定义 NavItem、Nav 接口，用于导航菜单配置。

### 全局类型扩充 (`types/index.ts`)
全局 TypeScript 类型扩充定义。

## 测试与质量

**当前状态：无测试框架。** 质量保障依赖：
- ESLint（`@antfu/eslint-config`）：Vue 组件强制 `<script lang="ts">`、`<style lang="scss" scoped>`
- Stylelint（`@zinkawaii/stylelint-config`）：SCSS 规范检查
- 开发模式 HMR：即时反馈

## 常见问题 (FAQ)

**Q: 为什么组件前缀是 `Z`？**
A: `components/partial/` 下的通用组件使用 `Z` 前缀（如 `ZButton`、`ZPagination`），在 `nuxt.config.ts` 中通过 `components` 配置的 `prefix` 选项自动注册，避免与业务组件命名冲突。

**Q: 如何添加新的 widget 到侧边栏？**
A: 在 `components/widget/` 下创建组件，然后在 `composables/useWidgets.ts` 中注册。

**Q: 如何修改代码高亮主题？**
A: 编辑 `app/shiki.config.ts`，修改 `themes` 对象中的 `light` 和 `dark` 主题导入路径。

## 相关文件清单

### 组件目录结构

```
app/components/
├── blog/           # 博客外壳组件
│   ├── BlogAside.vue
│   ├── BlogFooter.vue
│   ├── BlogHeader.global.vue
│   ├── BlogPanel.vue
│   ├── BlogWidget.vue
│   ├── Mask.vue
│   ├── SkipToContent.vue
│   └── ThemeToggle.vue
├── content/        # 内容渲染组件
│   ├── Alert.vue
│   ├── Badge.vue
│   ├── Blur.vue
│   ├── CardList.vue
│   ├── Chat.vue
│   ├── Copy.vue
│   ├── EmojiClock.vue
│   ├── FeedCard.vue
│   ├── FeedGroup.vue
│   ├── Folding.vue
│   ├── Key.vue
│   ├── LinkBanner.vue
│   ├── LinkCard.vue
│   ├── MdTitle.vue
│   ├── MusicScore.vue
│   ├── Pic.vue
│   ├── Poetry.vue
│   ├── ProseA.vue
│   ├── ProseCode.vue
│   ├── ProsePre.vue
│   ├── ProseTable.vue
│   ├── Quote.vue
│   ├── Tab.vue
│   ├── Timeline.vue
│   ├── Tip.vue
│   └── VideoEmbed.vue
├── partial/        # 通用组件（Z 前缀）
│   ├── Button.vue
│   ├── DlGroup.vue
│   ├── Dropdown.vue
│   ├── Error.vue
│   ├── Expand.vue
│   ├── IconNavList.vue
│   ├── Pagination.vue
│   ├── RadioGroup.vue
│   ├── Secret.vue
│   ├── Slider.vue
│   └── Toggle.vue
├── popover/        # 浮层组件
│   ├── Lightbox.vue
│   ├── Search.vue
│   └── SearchItem.vue
├── post/           # 文章展示组件
│   ├── Archive.vue
│   ├── Article.vue
│   ├── Comment.vue
│   ├── Excerpt.vue
│   ├── OrderToggle.vue
│   ├── PostFooter.vue
│   ├── PostHeader.vue
│   ├── PostSurround.vue
│   └── Slide.vue
├── util/           # 工具组件
│   ├── Date.vue
│   ├── HydrateSafe.vue
│   ├── Img.vue
│   └── Link.vue
└── widget/         # 侧边栏挂件
    ├── BlogLog.vue
    ├── BlogStats.vue
    ├── BlogTech.vue
    ├── Empty.vue
    └── Toc.vue
```
