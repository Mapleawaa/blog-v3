[根目录](../CLAUDE.md) > **modules/**

# modules/ — 自定义 Nuxt 模块

> 变更记录 (Changelog)
>
> | 日期 | 变更内容 | 作者 |
> |------|----------|------|
> | 2026-04-29 | 初始化模块文档 | Claude (架构师) |

## 模块索引

| 子模块 | 路径 | 职责 | 文档 |
|--------|------|------|------|
| anti-mirror | `anti-mirror/` | 恶意镜像站检测与自动跳转 | [anti-mirror/CLAUDE.md](anti-mirror/CLAUDE.md) |

## 关键依赖

- **nuxt/kit**：Nuxt 模块开发工具包（`defineNuxtModule`）
- **oxc-minify**：代码压缩（用于生成内联脚本）
