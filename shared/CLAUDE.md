[根目录](../CLAUDE.md) > **shared/**

# shared/ — 共享工具

> 变更记录 (Changelog)
>
> | 日期 | 变更内容 | 作者 |
> |------|----------|------|
> | 2026-04-29 | 初始化模块文档 | Claude (架构师) |

## 模块职责

存放客户端和服务端共享的工具函数，避免重复代码。主要包括字符串处理、时间格式化、图标处理、链接处理等通用工具。

## 入口与启动

工具函数在需要处手动导入。服务端路由（`server/`）、Nuxt 配置（`nuxt.config.ts`）、插件等均可引用。

## 对外接口

| 文件 | 导出 | 功能 |
|------|------|------|
| `utils/str.ts` | 字符串处理函数 | 字符串截断、格式化、转换等 |
| `utils/time.ts` | `toZonedTemporal()` | Temporal 时区日期转换（服务端和 RSS 生成中使用） |
| `utils/icon.ts` | 图标处理函数 | SVG 图标处理、动态图标 URL 生成 |
| `utils/link.ts` | 链接处理函数 | URL 格式化、域名解析辅助 |

## 关键依赖

- **temporal-polyfill**：日期时间处理（`utils/time.ts`）
- 纯 TypeScript 函数，无额外运行时依赖

## 测试与质量

**当前状态：无测试框架。**

## 常见问题 (FAQ)

**Q: `shared/` 和 `app/utils/` 的区别是什么？**
A: `shared/` 是客户端和服务端都能使用的工具函数，`app/utils/` 仅用于客户端（如动画、图片处理等浏览器 API 相关功能）。

**Q: `toZonedTemporal()` 的作用？**
A: 将日期字符串转换为带时区（Asia/Shanghai）的 Temporal 对象，确保服务端和客户端使用一致的时区处理逻辑。

## 相关文件清单

```
shared/
└── utils/
    ├── str.ts       # 字符串处理
    ├── time.ts      # 时间/时区处理
    ├── icon.ts      # 图标处理
    └── link.ts      # 链接处理
```
