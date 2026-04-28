[根目录](../CLAUDE.md) > **content/**

# content/ — 内容层

> 变更记录 (Changelog)
>
> | 日期 | 变更内容 | 作者 |
> |------|----------|------|
> | 2026-04-29 | 初始化模块文档 | Claude (架构师) |

## 模块职责

管理博客的全部 Markdown 内容，包括技术文章、预览草稿、主题配置页面和友链页面。所有文章使用 YAML front matter 定义元数据，通过 `content.config.ts` 中的 Zod schema 进行校验。

## 入口与启动

| 文件 | 用途 |
|------|------|
| `theme.md` | 博客主题介绍/配置页面内容 |
| `link.md` | 友链页面内容（Markdown 正文 + front matter） |

内容由 `@nuxt/content` v3 模块自动发现和加载，无需手动注册。文件路径即为路由路径（可通过 front matter 中的 `permalink` 自定义）。

## 对外接口

内容通过 Nuxt Content 的 `queryCollection()` API 在应用层消费：

- **文章列表**：`queryCollection('content').where('stem', 'LIKE', 'posts/%').order('date', 'DESC')`
- **单篇文章**：`queryCollection('content').path(route.path).first()`
- **预览文章**：`queryCollection('content').where('stem', 'LIKE', 'previews/%')`

## 关键依赖与配置

- **@nuxt/content** v3：内容管理核心（SQLite connector）
- **Zod**：Front matter schema 校验
- **remark-math** + **rehype-katex**：数学公式渲染
- **remark-reading-time**：阅读时间估算

## 数据模型

### Front Matter Schema (`content.config.ts`)

每篇文章的 front matter 通过 Zod schema 校验，核心字段：

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `title` | `string` | 否 | 文章标题 |
| `description` | `string` | 否 | 文章摘要/描述 |
| `date` | `string` | 否 | 创建日期 |
| `updated` | `string` | 否 | 更新日期 |
| `published` | `string` | 否 | 发布日期 |
| `categories` | `string[]` | 否 | 分类列表，默认 `['未分类']` |
| `tags` | `string[]` | 否 | 标签列表 |
| `type` | `enum` | 否 | 文章版式（tech/story），默认 `tech` |
| `image` | `string` | 否 | 封面图片 URL |
| `recommend` | `number` | 否 | 推荐指数 |
| `references` | `array` | 否 | 参考文献列表 |
| `draft` | `boolean` | 否 | 是否草稿，默认 `false` |
| `permalink` | `string` | 否 | 自定义文章链接 |
| `readingTime` | `object` | 是 | 阅读时间（由 remark-reading-time 自动生成） |

### 分类系统 (`blog.config.ts`)

| 分类 | 图标 | 说明 |
|------|------|------|
| 技术 | `ph:mouse-bold` | 实践可复用操作经验 |
| 开发 | `ph:code-bold` | 编程/代码实现/工程实践 |
| 安全 | `ph:bug-beetle-bold` | 漏洞/CTF/安全分析 |
| 杂谈 | `ph:chat-bold` | 观点讨论/复盘反思 |
| 生活 | `ph:shooting-star-bold` | 记录叙事/个人经历 |
| 未分类 | `ph:folder-dotted-bold` | 默认分类 |

## 测试与质量

**当前状态：无测试框架。** 内容质量保障依赖：
- Front matter Zod schema 校验（构建时自动执行）
- `content/` 目录有宽松 ESLint 规则（不检查引号、分号、缩进等）
- `pnpm check:feed` 验证 Atom 订阅源输出

## 常见问题 (FAQ)

**Q: 如何新建文章？**
A: 运行 `pnpm new`，按交互式提示输入文件名、标题、分类、标签、版式。脚本会自动在 `content/posts/{year}/` 下创建 Markdown 文件并填充 front matter 模板。

**Q: 如何设置自定义文章链接？**
A: 在 front matter 中设置 `permalink` 字段，Nuxt Content 的 `content:file:afterParse` hook 会自动替换默认路径。

**Q: content/ 目录为什么有特殊的 lint 规则？**
A: Markdown 文件中的代码块和文本内容通常不符合 JavaScript 的代码规范，因此在 `eslint.config.mjs` 中对 `content/**` 文件放宽了引号、分号等规则。

## 相关文件清单

```
content/
├── posts/
│   ├── 2020/
│   │   └── ubuntu-server-static-ip-2020-guide.md
│   ├── 2022/
│   │   ├── intel-iommu-igpu-passthrough-proxmox-7x-vm-guide.md
│   │   └── pve-remove-default-lvm-guide.md
│   ├── 2023/
│   │   └── nvidia-vgpu-unlock.md
│   ├── 2024/
│   │   ├── pve-amd-gpu-passthrough-windows-display-guide.md
│   │   └── rhel-add-disk-partition-mount-guide.md
│   ├── 2025/
│   │   ├── 1panel-waf-modern-blocking-page.md
│   │   ├── akile-jpiij-one-5g-iij-backhaul-review.md
│   │   ├── deploy-new-generation-probe-komari.md
│   │   ├── easy-pve9-configuration-script.md
│   │   ├── pve-tools.md
│   │   ├── pve-vgpu-principle-deployment-guide.md
│   │   ├── pve8-cloud-init-cloud-image-template.md
│   │   ├── pve8-snapshots-restore-guide.md
│   │   ├── qwen-code-newbie-rant.md
│   │   ├── star-rail-story-reaction.md
│   │   ├── trae-aliyun-bailian-unexpected-bill.md
│   │   └── vps-scripts.md
│   └── 2026/
│       ├── china-dev-mirror-sources-ultimate-categorization-guide.md
│       ├── my-static-blog-ddos-vercel-to-cloudflare-migration.md
│       └── oracle-cloud-registration-cmb-mastercard.md
├── previews/
│   ├── apps-websites-preference-2023.md
│   └── example.md
├── link.md
└── theme.md
```
