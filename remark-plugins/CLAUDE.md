[根目录](../CLAUDE.md) > **remark-plugins/**

# remark-plugins/ — 内容处理插件

> 变更记录 (Changelog)
>
> | 日期 | 变更内容 | 作者 |
> |------|----------|------|
> | 2026-04-29 | 初始化模块文档 | Claude (架构师) |

## 模块职责

自定义 Remark/Rehype 插件，扩展 Markdown 渲染能力。在 `nuxt.config.ts` 的 `content.build.markdown` 中注册使用。

## 入口与启动

插件通过 `nuxt.config.ts` 中的路径引用注册：

```typescript
content: {
  build: {
    markdown: {
      remarkPlugins: {
        [pluginPath('remark-music')]: {},
        'remark-math': {},
        'remark-reading-time': {},
      },
      rehypePlugins: {
        [pluginPath('rehype-meta-slots')]: {},
        'rehype-katex': {},
      },
    },
  },
}
```

## 对外接口

### remark-music.ts

| 功能 | 说明 |
|------|------|
| 触发条件 | Markdown 代码块语言标记为 `music-abc` |
| 处理逻辑 | 遍历 AST，将 `code` 节点替换为自定义 `musicScoreCodeBlock` 节点 |
| 渲染输出 | 生成 `<music-score abc="...">` 自定义元素，由前端 `MusicScore.vue` 组件渲染 |

### rehype-meta-slots.ts

| 功能 | 说明 |
|------|------|
| 触发条件 | HTML 元素标签名以 `meta-` 开头（如 `<meta-cover>`、`<meta-hero>`） |
| 处理逻辑 | 将 `meta-*` 元素从 DOM 树中提取到 `file.data.slots` 对象 |
| 渲染输出 | 在 Vue 组件中通过 `post.meta.slots` 访问这些自定义区块 |

## 关键依赖与配置

- **unist-util-visit**：AST 节点遍历
- **mdast**：Markdown AST 类型定义
- **hast**：HTML AST 类型定义
- **minimark**：轻量级 Markdown AST 中间表示
- **vfile**：虚拟文件类型（`file.data` 存储）

## 测试与质量

**当前状态：无测试框架。** 插件逻辑通过文章渲染效果手动验证。

## 常见问题 (FAQ)

**Q: 如何添加新的 remark/rehype 插件？**
A: 在 `remark-plugins/` 下创建插件文件，然后在 `nuxt.config.ts` 的 `content.build.markdown.remarkPlugins` 或 `rehypePlugins` 中注册。

**Q: `pluginPath()` 函数的作用是什么？**
A: 将相对路径转换为 `file://` URL，确保插件在 Nuxt 的模块解析系统中正确加载。

**Q: meta slots 的典型用途是什么？**
A: 在文章中嵌入自定义区块（如封面区域、hero 横幅、嵌入表单等），这些区块不在最终渲染的 DOM 中直接显示，而是在 Vue 模板中作为独立数据使用。

## 相关文件清单

```
remark-plugins/
├── remark-music.ts        # ABC 乐谱标记支持
└── rehype-meta-slots.ts   # 自定义 meta 区块提取
```
