[根目录](../CLAUDE.md) > **scripts/**

# scripts/ — 脚本工具

> 变更记录 (Changelog)
>
> | 日期 | 变更内容 | 作者 |
> |------|----------|------|
> | 2026-04-29 | 初始化模块文档 | Claude (架构师) |

## 模块职责

提供开发辅助 CLI 脚本，包括交互式新建文章、项目初始化、Atom 订阅源验证等功能。

## 入口与启动

所有脚本通过 `tsx` 运行器执行，在 `package.json` 中定义快捷命令：

| 命令 | 脚本文件 | 功能 |
|------|----------|------|
| `pnpm new` | `scripts/new-blog.ts` | 交互式新建博客文章 |
| `pnpm init-project` | `scripts/init-project.ts` | 初始化/重置项目配置和内容 |
| `pnpm check:feed` | `scripts/framework/get-feed.ts` | 验证 Atom 订阅源 |
| `pnpm check:feed/all` | `scripts/framework/check-all-feeds.ts` | 验证所有友链的订阅源 |

## 对外接口

### new-blog.ts

交互式 CLI，分步骤引导用户输入：

1. **文件名**：输入 Markdown 文件名（可选，通过命令行参数传入）
2. **标题**：文章标题（用于 front matter 和正文）
3. **分类**：从 `blog.config.ts` 的分类列表中选择，或输入自定义分类
4. **标签**：输入标签，用中英文逗号或空格分隔
5. **版式**：选择 `tech`（技术）或 `story`（故事），或自定义

自动生成的文件路径：`content/posts/{year}/{filename}.md`

生成内容包括：
- YAML front matter（title, description, date, categories, tags, type, image, permalink）
- 模板正文（## 从{title}说起 + 大纲代码块）
- 自动打开 VS Code 编辑

### init-project.ts

初始化/重置项目，操作包括：
- 清空 `content/` 目录（保留 `link.md` 和示例文章）
- 重置 `app/app.config.ts` 中的个人信息（头像、ICP 备案等）
- 重置 `blog.config.ts` 中的站点名称
- 重置 `redirects.json`

`@clack/prompts` 密码确认

## 关键依赖与配置

- **tsx**：TypeScript 执行器
- **@clack/prompts**：交互式 CLI 提示
- **temporal-polyfill**：日期时间处理
- **fast-xml-builder**：XML 解析（feed 检查）

## 数据模型

### new-blog.ts

生成的 front matter 字段与 `content.config.ts` 中定义的 `ArticleSchema` 一致。分类、标签、版式均从 `blog.config.ts` 读取可用选项。

### framework/check-all-feeds.ts / get-feed.ts

订阅源验证脚本，从 `app/feeds.ts` 读取友链数据，逐个请求 Atom/RSS 订阅源验证可访问性。

## 测试与质量

**当前状态：无测试框架。** 脚本工具为一次性运行，通过直接执行验证。

## 常见问题 (FAQ)

**Q: `pnpm new` 创建的文章链接格式是什么？**
A: 默认使用基于文件路径的路由。如果 `blogConfig.article.useRandomPremalink` 为 `true`，则会生成随机 hex 字符串作为 `permalink`。

**Q: `pnpm init-project` 会删除哪些内容？**
A: 会递归删除整个 `content/` 目录，然后重建。`link.md` 内容会被保留。`app.config.ts` 和 `blog.config.ts` 中的个人信息会被替换为占位符。

## 相关文件清单

```
scripts/
├── new-blog.ts                    # 交互式新建文章
├── init-project.ts                # 项目初始化/重置
└── framework/
    ├── check-all-feeds.ts         # 批量验证友链订阅源
    ├── get-feed.ts                # 单个订阅源验证
    └── utils.ts                   # 订阅源检查工具函数
```
