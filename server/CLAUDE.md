[根目录](../CLAUDE.md) > **server/**

# server/ — 服务端 API

> 变更记录 (Changelog)
>
> | 日期 | 变更内容 | 作者 |
> |------|----------|------|
> | 2026-04-29 | 初始化模块文档 | Claude (架构师) |

## 模块职责

基于 Nitro 引擎的服务端 API 层，提供博客站点统计数据和 Atom 订阅源生成。路由通过文件名约定自动注册（`*.get.ts` 响应 GET 请求）。

## 入口与启动

服务端路由由 Nuxt 的 Nitro 引擎自动发现和注册。路由文件放在 `server/api/`（JSON API）和 `server/routes/`（页面路由）下。

## 对外接口

### API 端点

| 端点 | 文件 | 方法 | 功能 |
|------|------|------|------|
| `/api/stats` | `api/stats.get.ts` | GET | 返回博客统计数据（文章数、字数、年度统计、分类统计、标签列表） |

**`/api/stats` 响应结构：**
```typescript
{
  total: { posts: number, words: number }
  annual: Record<number, { posts: number, words: number }>
  categories: { name: string, posts: number, children?: CategoryEntry[] }[]
  tags: string[]
}
```

### 特殊路由

| 端点 | 文件 | 方法 | 功能 |
|------|------|------|------|
| `/atom.xml` | `routes/atom.xml.get.ts` | GET | 生成 Atom 1.0 订阅源 XML |

**Atom 订阅源特性：**
- 最多包含 50 篇文章（由 `blogConfig.feed.limit` 控制）
- 按 `updated` 字段降序排列
- 支持 XSLT 样式（通过 `blogConfig.feed.enableStyle` 控制）
- 使用 `fast-xml-builder` 构建 XML
- 包含文章描述、封面图、分类信息

## 关键依赖与配置

- **Nitro**（Nuxt 内置）：服务端引擎
- **fast-xml-builder**：XML 构建器（用于 Atom 订阅源）
- **temporal-polyfill**：日期格式化（ISO 8601）
- **ci-info**：CI 环境检测（Cloudflare Pages / GitHub Actions / Netlify）
- `nuxt.config.ts` 中的 `routeRules` 配置了 API 路由的预渲染和响应头

## 数据模型

### stats.get.ts

- `StatsEntry` — `{ posts: number, words: number }`
- `CategoryEntry` — `{ name: string, posts: number, children?: CategoryEntry[] }`

数据来源：通过 `queryCollection(event, 'content').all()` 查询全部文章，遍历计算聚合统计。
重复路径检测：使用 `Map` 记录已处理路径，遇到重复时输出 `console.warn`。

### atom.xml.get.ts

- 使用 `XmlBuilder` 构建符合 Atom 1.0 规范的 XML
- 每篇文章条目包含：`id`、`title`、`updated`、`author`、`content`（HTML）、`link`、`summary`、`category`、`published`

## 测试与质量

**当前状态：无测试框架。** 质量保障依赖：
- `pnpm check:feed`：验证 Atom 订阅源输出格式
- TypeScript 类型检查
- 构建时的预渲染验证

## 构建配置

在 `nuxt.config.ts` 中通过 `routeRules` 配置：

```typescript
routeRules: {
  '/api/stats': { prerender: true, headers: { 'Content-Type': 'application/json' } },
  '/atom.xml': { prerender: true, headers: { 'Content-Type': 'application/xml' } },
}
```

两个路由均启用预渲染（SSG），生成时直接输出静态文件。

## 常见问题 (FAQ)

**Q: 如何添加新的 API 端点？**
A: 在 `server/api/` 下创建文件，命名遵循 `{name}.{method}.ts` 约定（如 `comments.get.ts`、`search.post.ts`），使用 `defineEventHandler` 定义处理逻辑，路由会自动注册。

**Q: Atom 订阅源的文章数量如何调整？**
A: 修改 `blog.config.ts` 中的 `feed.limit` 字段。

**Q: 订阅源如何禁用 XSLT 样式？**
A: 设置 `blog.config.ts` 中的 `feed.enableStyle` 为 `false`。

## 相关文件清单

```
server/
├── api/
│   └── stats.get.ts         # 站点统计 API
└── routes/
    └── atom.xml.get.ts       # Atom 订阅源生成
```
