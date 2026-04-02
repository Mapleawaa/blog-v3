import type { Nav, NavItem } from '~/types/nav'
import { pascalCase } from 'es-toolkit/string'
import { Temporal } from 'temporal-polyfill'
import blogConfig from '~~/blog.config'
import { name, version } from '~~/package.json'

// 图标查询：https://yesicon.app/ph?s=bold
// 图标插件：https://marketplace.visualstudio.com/items?itemName=antfu.iconify

// @keep-sorted
export default defineAppConfig({
	// 将 blog.config 中的配置项复制到 appConfig，方便调用
	...blogConfig,

	component: {
		alert: {
			/** 默认使用卡片风格还是扁平风格 */
			defaultStyle: 'card' as 'card' | 'flat',
		},

		codeblock: {
			/** 代码块触发折叠的行数 */
			triggerRows: 32,
			/** 代码块折叠后的行数 */
			collapsedRows: 16,
			/** 启用代码块缩进导航会关闭空格渲染 */
			enableIndentGuide: true,
			/** 代码块缩进导航(Indent Guige)竖线匹配空格数 */
			indent: 4,
			/** tab渲染宽度 */
			tabSize: 3,
		},

		/** 文章开头摘要 */
		excerpt: {
			animation: true,
			caret: '_',
		},

		/** 精选文章 Slide */
		slide: {
			/** 适合封面图无字时启用 */
			showTitle: true,
		},

		stats: {
			/** 归档页面每年标题对应的年龄 */
			birthYear: 2007,
			/** blog-stats widget 的预置文本 */
			wordCount: '约10万',
		},

		/** 社区/联系方式挂件 */
		comm: {
			/** 是否显示纸网接入点(QQ群) Banner */
			show: false,
		},
	},

	// @keep-sorted
	footer: {
		/** 页脚版权信息，支持 <br> 换行等 HTML 标签 */
		copyright: `© ${Temporal.Now.plainDateISO().year.toString()} ${blogConfig.title} · <a href="https://github.com/Mapleawaa/blog-v3" target="_blank" rel="noopener noreferrer">主题: ${pascalCase(name)} ${version}</a>`,
		/** 侧边栏底部图标导航 */
		iconNav: [
			{ icon: 'ph:house-bold', text: '博客首页', url: blogConfig.url },
			{ icon: 'ph:github-logo-bold', text: 'GitHub', url: 'https://github.com/Mapleawaa' },
			{ icon: 'simple-icons:gitee', text: 'Gitee', url: 'https://gitee.com/Mapleawaa' },
			{ icon: 'simple-icons:telegram', text: 'Telegram', url: 'https://t.me/Omphalos2_bot' },
			{ icon: 'ph:rss-simple-bold', text: 'Atom订阅', url: '/atom.xml' },
			{ icon: 'ph:subway-bold', text: '开往', url: 'https://www.travellings.cn/go.html' },
		] satisfies NavItem[],
		/** 页脚站点地图 */
		nav: [
			{
				title: '探索',
				items: [
					{ icon: 'ph:rss-simple-bold', text: 'Atom订阅', url: '/atom.xml' },
					{ icon: 'ph:chart-bar-bold', text: '站点统计', url: 'https://cloud.umami.is/share/MMyogXhfs1LNyQd0' },
					{ icon: 'ph:subway-bold', text: '开往?', url: 'https://www.travellings.cn/go.html' },
					{ icon: 'ph:monitor-bold', text: '状态监控', url: 'https://status.oowo.cc' },
				],
			},
			{
				title: '社交',
				items: [
					{ icon: 'ph:github-logo-bold', text: 'Github', url: 'https://github.com/Mapleawaa' },
					{ icon: 'simple-icons:telegram', text: 'Telegram', url: 'https://t.me/Omphalos2_bot' },
					{ icon: 'ph:envelope-simple-bold', text: blogConfig.author.email, url: `mailto:${blogConfig.author.email}` },
				],
			},
			{
				title: '信息',
				items: [
					{ icon: 'ph:certificate-bold', text: '萌ICP备20265520号', url: 'https://icp.gov.moe/?keyword=20265520' },
					{ icon: 'ph:globe-hemisphere-west-bold', text: '博客域名', url: blogConfig.url },
					{ icon: 'zi:tencentcloud', text: 'EdgeOne', url: 'https://edgeone.ai' },
					{ icon: 'simple-icons:cloudflare', text: 'Cloudflare', url: 'https://www.cloudflare.com' },
				],
			},
			{
				title: '小工具集',
				items: [
					{ icon: 'ph:image-bold', text: '封面图生成', url: 'https://cover.oowo.cc' },
					{ icon: 'ph:network-bold', text: '测试NAT类型', url: 'https://nat.oowo.cc' },
					{ icon: 'ph:link-bold', text: '短链', url: 'https://url.oowo.cc' },
					{ icon: 'ph:list-dashes-bold', text: 'OpenList', url: 'https://list.oowo.cc' },
					{ icon: 'ph:plug-bold', text: 'API开放平台', url: 'https://api.oowo.cc' },
				],
			},
		] satisfies Nav,
	},

	/** 左侧栏顶部 Logo */
	header: {
		logo: '/assets/avatar.gif',
		/** 展示标题文本，否则展示纯 Logo */
		showTitle: true,
		subtitle: blogConfig.subtitle,
		emojiTail: ['☁️', '🌇', '🌙', '🐱', '🚀'],
	},

	/** 友链页面 */
	link: {
		/** 无订阅源展示静音图标 */
		remindNoFeed: true,
		/** 友链分组内随机排序 */
		randomInGroup: true,
	},

	/** 左侧栏导航 */
	nav: [
		{
			title: '',
			items: [
				{ icon: 'ph:files-bold', text: '文章', url: '/' },
				{ icon: 'ph:link-bold', text: '友链', url: '/link' },
				{ icon: 'ph:archive-bold', text: '归档', url: '/archive' },
				{ icon: 'ph:chart-bar-bold', text: '统计', url: 'https://cloud.umami.is/share/MMyogXhfs1LNyQd0' },
				{ icon: 'ph:monitor-bold', text: '状态', url: 'https://status.oowo.cc' },
			],
		},
	] satisfies Nav,

	pagination: {
		perPage: 10,
		/** 默认排序方式，需要是 this.article.order 中的键名 */
		sortOrder: 'date' as keyof typeof blogConfig.article.order,
		/** 允许（普通/预览/归档）文章列表正序，开启后排序方式左侧图标可切换顺序 */
		allowAscending: false,
	},

	themes: {
		light: {
			icon: 'ph:sun-bold',
			tip: '浅色模式',
		},
		system: {
			icon: 'ph:monitor-bold',
			tip: '跟随系统',
		},
		dark: {
			icon: 'ph:moon-bold',
			tip: '深色模式',
		},
	},
})
