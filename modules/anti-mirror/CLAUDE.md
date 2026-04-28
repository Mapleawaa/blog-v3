[根目录](../../CLAUDE.md) > [modules/](../CLAUDE.md) > **anti-mirror/**

# modules/anti-mirror/ — 反镜像模块

> 变更记录 (Changelog)
>
> | 日期 | 变更内容 | 作者 |
> |------|----------|------|
> | 2026-04-29 | 初始化模块文档 | Claude (架构师) |

## 模块职责

自定义 Nuxt 模块，在客户端运行时检测当前页面是否运行在恶意镜像站点（黑名单域名），如果是则自动将 `canonical` 链接和 `location.host` 跳回原始域名。

## 入口与启动

| 文件 | 用途 |
|------|------|
| `index.ts` | 模块定义入口，使用 `defineNuxtModule` 注册，inject 客户端脚本 |
| `runtime/client.ts` | 客户端运行时脚本，执行域名检测与跳转逻辑 |

模块通过 `nuxt/kit` 的 `defineNuxtModule` 注册，在 Nuxt 构建时自动向 `<head>` 注入内联脚本。

## 对外接口

模块无对外 API。它在页面加载时自动执行以下逻辑：

1. 读取 Base64 编码的黑名单域名和目标域名
2. 检测 `location.hostname` 是否匹配任一黑名单域名
3. 如果匹配：
   - 更新 `<link rel="canonical">` 的 `href` 为目标域名
   - 设置 `location.host` 为目标域名（触发跳转）

## 关键依赖与配置

- **nuxt/kit**：`defineNuxtModule` 模块定义 API
- **oxc-minify**：压缩注入的内联 JavaScript 代码

### 黑名单配置

在 `index.ts` 中硬编码黑名单域名数组：

```typescript
const blacklist = [
  'dgjlx.com',  // blog.revincx.icu
  'dgvhqt.com', // blog.zhilu.cyou
  'hcmsla.com', // thyuu.com
  'wmlop.com',  // xaoxuu.com
  'yswjxs.com', // blog.zhilu.cyou
]
```

## 数据模型

- 输入：`sourcesEncoded: string[]`（Base64 编码的黑名单域名列表）、`targetEncoded: string`（Base64 编码的目标域名）
- 函数 `toIifeString` 将客户端函数转为 IIFE 字符串并通过 `oxc-minify` 压缩

## 测试与质量

**当前状态：无测试框架。** 模块逻辑简单，主要通过手动验证。

## 常见问题 (FAQ)

**Q: 如何添加新的黑名单域名？**
A: 在 `modules/anti-mirror/index.ts` 的 `blacklist` 数组中添加新的域名字符串。

**Q: 模块在何时执行？**
A: 客户端页面加载时，作为内联 `<script>` 标签在 `<head>` 中同步执行。

## 相关文件清单

```
modules/anti-mirror/
├── index.ts              # 模块定义（Nuxt Module 注册 + 脚本注入）
└── runtime/
    └── client.ts         # 客户端运行时逻辑
```
