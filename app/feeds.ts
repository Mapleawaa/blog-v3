import type { FeedGroup } from '../app/types/feed'
// 友链检测 CLI 需要使用显式导入和相对路径
import { myFeed } from '../blog.config'
// eslint-disable-next-line unused-imports/no-unused-imports
import { getFavicon, getGithubAvatar, getGithubIcon, getOciqGroupAvatar, getOicqAvatar, OicqAvatarSize } from './utils/img'

export default [
	// #region 朋友们
	{
		name: '朋友们',
		desc: '哔——啵——电波通讯中，欢迎常来串门。',
		// @keep-sorted { "keys": ["date"] }
		entries: [
			myFeed,
			{
				author: '二叉树树',
				desc: 'Protect What You Love.',
				link: 'https://2x.nz/',
				icon: 'https://q2.qlogo.cn/headimg_dl?dst_uin=2726730791&spec=0',
				avatar: 'https://q2.qlogo.cn/headimg_dl?dst_uin=2726730791&spec=0',
				date: '2025-08-01',
			},
			{
				author: '青序栈',
				desc: '青序成栈·向简而生',
				link: 'https://qxzhan.cn/',
				icon: 'https://qxzhan.cn/favicon.png',
				avatar: 'https://qxzhan.cn/favicon.png',
				date: '2025-08-01',
			},
			{
				author: 'fishcpy',
				desc: '人生漫长，不妨多解锁些鲜活体验',
				link: 'https://blog.fis.ink',
				icon: 'https://file.fis.ink/img/fishcpy/logo.png',
				avatar: 'https://file.fis.ink/img/fishcpy/logo.png',
				date: '2025-08-01',
			},
			{
				author: '鈴奈咲桜',
				desc: '愛することを忘れないで',
				link: 'https://blog.sakura.ink',
				icon: 'https://q2.qlogo.cn/headimg_dl?dst_uin=2731443459&spec=5',
				avatar: 'https://q2.qlogo.cn/headimg_dl?dst_uin=2731443459&spec=5',
				date: '2025-08-01',
			},
			{
				author: 'Tavre',
				desc: '茫茫大海 我与你相遇',
				link: 'https://blog.tsd.my',
				icon: 'https://q1.qlogo.cn/g?b=qq&nk=2987304764&s=640',
				avatar: 'https://q1.qlogo.cn/g?b=qq&nk=2987304764&s=640',
				date: '2025-08-01',
			},
			{
				author: '云晓晨',
				desc: '未来路远 • 勿忘初心',
				link: 'https://blog.kaiqi.wang',
				icon: 'https://cdn.kaiqi.wang/favicon.svg',
				avatar: 'https://cdn.kaiqi.wang/favicon.svg',
				date: '2025-08-01',
			},
			{
				author: 'yunsen2025',
				desc: '纯粹的计算机爱好者',
				link: 'https://blog.imysen.com',
				icon: 'https://img.alicdn.com/bao/uploaded/i4/O1CN01TWOpM42DSyY5nC0hM_!!0-mtopupload.jpg',
				avatar: 'https://img.alicdn.com/bao/uploaded/i4/O1CN01TWOpM42DSyY5nC0hM_!!0-mtopupload.jpg',
				date: '2025-08-01',
			},
			{
				author: '百里',
				desc: '一个高中生的博客',
				link: 'https://blog.my0811.cn',
				icon: 'https://blog.my0811.cn/favicon.ico',
				avatar: 'https://blog.my0811.cn/favicon.ico',
				date: '2025-08-01',
			},
			{
				author: '夜轻',
				desc: '一个人',
				link: 'http://blog.yeqing.net/',
				icon: 'https://list.yppp.net/d/cos/yeqing.jpeg',
				avatar: 'https://list.yppp.net/d/cos/yeqing.jpeg',
				date: '2025-08-01',
			},
		],
	},
	// #endregion
	// #region 常用服务
	{
		name: '常用服务',
		desc: '网上冲浪时发现的精彩内容与常读订阅，与君共享。',
		// @keep-sorted { "keys": ["date"] }
		entries: [
			{
				author: 'Vercel',
				desc: '开发、预览、部署。',
				link: 'https://vercel.com',
				icon: 'https://avatars.githubusercontent.com/u/14985020?v=4&s=640',
				avatar: 'https://avatars.githubusercontent.com/u/14985020?v=4&s=640',
				date: '2025-08-01',
			},
			{
				author: 'Cloudflare',
				desc: '一家提供互联网服务和产品的全球性公司',
				link: 'https://www.cloudflare.com',
				icon: 'https://avatars.githubusercontent.com/u/314135?v=4&s=640',
				avatar: 'https://avatars.githubusercontent.com/u/314135?v=4&s=640',
				date: '2025-08-01',
			},
			{
				author: 'Linux.do',
				desc: '一个新的理想型社区。',
				link: 'https://linux.do',
				icon: 'https://avatars.githubusercontent.com/u/160804563',
				avatar: 'https://avatars.githubusercontent.com/u/160804563',
				date: '2025-08-01',
			},
			{
				author: 'Nodeseek',
				desc: '为主机爱好者打造的高品质社区。',
				link: 'https://www.nodeseek.com',
				icon: 'https://www.nodeseek.com/static/image/favicon/android-chrome-192x192.png',
				avatar: 'https://www.nodeseek.com/static/image/favicon/android-chrome-192x192.png',
				date: '2025-08-01',
			},
		],
	},
	// #endregion
] satisfies FeedGroup[]
