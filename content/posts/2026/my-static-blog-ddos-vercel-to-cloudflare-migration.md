---
title: "[复盘] 关于我的小博客遭遇了开站以来最大的一次攻击——20万请求、1Gbps峰值瞬发"
description: "本文您将看到：国宾待遇、赛博拆迁、移形换影、嘲讽拉满。……难道这就是黑暗森林？"
date: 2026-01-04 00:00:00
updated: 2026-01-04 00:00:00
categories: [技术]
tags: [运维, 杂谈, DDoS, Vercel, EdgeOne]
recommend: 5
---
本站建站之初坚持使用 **静态 (Static)** 架构，就是为了防这一手。
你想啊，一个静态网站，没有数据库，没有后端计算。所有的攻击流量本质上都是打在 **CDN 的边缘节点** 上。
换句话说，攻击者不是在打我，是在打 **整个 CDN 厂商**。
理论上这不仅难打死，而且没必要——毕竟静态站背后没有利益，纯粹是白打。

但我万万没想到，2026 年的第 3 天，真的有人花钱给我看了个赛博烟花。

## 起因

2026 年的第 3 天，原本以为是个平静的元旦假期，我照惯例优化了一下图床，把主站域名 `oowo.cc` 迁移到 `华为云` 做根据地域的 Cloudflare 优选。

就在愉快的Coding时，Outlook弹出的通知打破了宁静。

## 第一章：初现端倪
![](/assets/images/my-static-blog-ddos-vercel-to-cloudflare-migration/IMG-my-static-blog-ddos-vercel-to-cloudflare-migration-20260104202654346.png)

**“Your site is growing!”**
看到这条邮件时，我还在想：哇奥，博客流量见长啊？是不是哪篇文章火了？
我一开始真没当回事，一直专心在调整手上的新DNS。

结果第二条出现了

![](/assets/images/my-static-blog-ddos-vercel-to-cloudflare-migration/IMG-my-static-blog-ddos-vercel-to-cloudflare-migration-20260104202720202.png)

> **Vercel Hobby Plan 的 100GB 流量已耗尽。**

众所周知，Vercel 还是比较良心的，**但是到额之后不会立刻停机，通常可以跑到300%倍流量才会 Pause 项目**
我心想：这得多大的流量才能瞬间秒杀 100G？

事实证明，我还是太年轻了。

![](/assets/images/my-static-blog-ddos-vercel-to-cloudflare-migration/IMG-my-static-blog-ddos-vercel-to-cloudflare-migration-20260104202734694.png)
很快啊，我很快就注意到这条 标题带Emoji的通知了。
这时我意识到不对劲，于是就前往Vercel控制台看了一眼。

## 第二章：被打死了
好嘛，真是被刷了

![IMG-my-static-blog-ddos-vercel-to-cloudflare-migration-20260104180545889.png](/assets/images/my-static-blog-ddos-vercel-to-cloudflare-migration/IMG-my-static-blog-ddos-vercel-to-cloudflare-migration-20260104180545889.png)
流量曲线不是“增长”，是**垂直起飞**。
由于超出3倍允许用量，被 Vercel 直接给 **pause**了。

### 看眼流量详细
![IMG-my-static-blog-ddos-vercel-to-cloudflare-migration-20260104174017440.png](/assets/images/my-static-blog-ddos-vercel-to-cloudflare-migration/IMG-my-static-blog-ddos-vercel-to-cloudflare-migration-20260104174017440.png)
可以看到Vercel也是燃尽了，没配置过防火强，默认的流量明细内能看到Vercel被请求了**14.6 万** 次请求。
主要的攻击请求都被 Vercel 的防火强识别命中，命中的规则也是 **DDoS Mitigation**，命中次数就到到了 **15.9M**。
但还是有不少漏网之鱼是真正打进去了，漏进来的 2% 足以致命。

## 第三章：谁在打我？

我扒了一下日志，给我气笑了。

这些肉鸡没有去刷我的 HTML 首页，而是死盯着我的一张图片素材( `/assets/home/home.png`)

没错，这张图片就是本站的 favicon，这张 favicon 是用于**交换友链**专用的站点 Logo 。

这张图片大小是十分标准的496KB，分辨率 1024x1024 的 png 图片。

| IP              | 纯净度 | 公共代理 | 代理类型        | 使用场景                | ASN                     |
| --------------- | --- | ---- | ----------- | ------------------- | ----------------------- |
| 20.80.217.164   | 17  | 是    | 匿名VPN服务     | 数据中心 \| VPN \| 云厂商  | 微软                      |
| 52.156.152.157  | 1   | 是    | 公共代理        | 数据中心 \| 公共代理 \| 云厂商 | 微软                      |
| 48.222.214.47   | 32  | 是    | 公共代理        | 数据中心 \| 公共代理 \| 云厂商 | BHS                     |

没有 Referer，没有浏览器特征，对着我的 Favicon 也就是那张 `home.png` 狂薅。

那你都打我了，我只能老实了。

## 第四章：老实了，你打我我跑就是了
既然都被打Vercel懵逼了的同时流量还很大，那就不得不迁移平台了，需要一个流量刷光不会被pause的平台，并且对中国大陆的访问不至于很炸裂的平台。

已经有的可以优先加速的平台就那么几个，既然这回被攻击之后，选平台就不能只看“好不好用”，得看“耐不耐操”。
对于一个面向大陆访问、偶有 DDoS 风险的静态博客，各大平台的表现如下：

| 平台                 | 线路质量 (大陆) | 底层/CDN厂家          | 抗D能力    | 可选？ | 辣评                                                         |
| :------------------- | :-------------- | :-------------------- | :--------- | :----- | :----------------------------------------------------------- |
| **Vercel**           | A               | Amazon/CF             | ⚠️ **一般** | ❌      | **本次受害者**。开发者体验满分，软限制，但是跑超了还得死     |
| **Netlify**          | B               | Amazon/Fastly         | 💀 **差**   | ❌      | CI/CD是真好用，但是100G流量是硬限制，到了就死                |
| **Render**           | B-              | Cloudflare            | ⚠️ **一般** | ❌      | Vercel 的平替，速度平平无奇。用来跑后端还行，静态博客没必要选它。100G限制，超了就停 |
| **Zeabur**           | A               | AWS/GCP/腾讯云/火山云 | 💸按量计费  | ❌      | 国产之光，线路和体验极佳。但它是**按流量计费**的！遇到 DDoS 就是“一夜一套房”。 |
| **ClawCloud**        | B               | 阿里云                | 💸按量计费  | ❌      | 就美国绑定自定义域名可以签发ssl证书，其它地区全炸了。亚太地区好像是被墙了，tcping只有香港和tw是绿的，大陆地区全红 |
| **GitHub Pages**     | F               | Fastly                | 🛡️ **强**   | ❌      | **众生平等**。虽然免费且抗揍，但在国内的访问速度约等于 404，不仅防住了黑客，也防住了访客。 |
| **Cloudflare Pages** | B-              | Cloudflare            | God 神    | ✅      | **最后防线**。来，往这打！<br>优选后线路高度可用。           |
| **Tencent EdgeOne**  | S               | 腾讯云                | 🛡️ **S**    | ✅      | 免费版套餐无限流量，缺点就是eopages还是对有些函数支持不太行，备案之后访问是神。 |
| **Aliyun ESA**       | A               | 阿里云                | ⚠️ **一般** | ✅      | **腾讯的死对头**。阿里云和 EdgeOne 属于卧龙凤雏。<br>备案之后免费套餐就是国内访问的神，不备案？那就是屎。 |

最终综合考量维护复杂度和国内用户的访问体验，选择了 **Tencent EdgeOne** 作为国内的Pages加速，国际段则使用 **Cloudflare Pages**，使用 华为云 的 DNS 做 *GeoDNS*。

## 第五张：迁移之后...真的安全了吗?

进行了一个光速的迁移，由于是直接部署编译并且更换了CNAME到 EO 给的地址，所以攻击路径直接被我引到腾讯云上了。

![IMG-my-static-blog-ddos-vercel-to-cloudflare-migration-20260104182956266.png](/assets/images/my-static-blog-ddos-vercel-to-cloudflare-migration/IMG-my-static-blog-ddos-vercel-to-cloudflare-migration-20260104182956266.png)

正当我以为没事情了，一切交给腾讯云的WAF了，我就去改博客被攻击的文件名了。

刚切到腾讯云 EdgeOne 不到五分钟，警报拉响。 

请求量瞬间从 **400** 飙升到 **几万**，峰值带宽直接干到了 **1.0 Gbps**。

![IMG-my-static-blog-ddos-vercel-to-cloudflare-migration-20260104183536610.png](/assets/images/my-static-blog-ddos-vercel-to-cloudflare-migration/IMG-my-static-blog-ddos-vercel-to-cloudflare-migration-20260104183536610.png)

你没有看错，从 **2026-1-3 22:00 - 2026-1-3 22:55** 这个时间段，总共被请求了 **224.29万** 次CDN，也就是攻击者还在疯狂的刷我的 `head.png` 这张图
查看攻击者排行，发现集中在香港、**中国大陆**、美国、新加坡 这几个地区发起的请求。
甚至有人用中国联通的家宽攻击我，还有Cloudflare也上来了。

| IP信息            | 威胁  | VPN? | 代理详细                           | 分类          | AS                                     |
| --------------- | --- | ---- | ------------------------------ | ----------- | -------------------------------------- |
| 188.253.12.1    | 48  | 是    | 匿名VPN服务                        | 数据中心 \| VPN | Akari                                  |
| 103.151.172.86  | 68  | 否    | 无                              | 数据中心        | KIDC Limit                             |
| 154.92.130.36   | 88  | 是    | 匿名VPN服务                        | 数据中心 \| VPN | Stacks Inc.                            |
| 212.135.214.5   | 38  | 是    | Skyline VPN                    | 数据中心 \| VPN | CYBERVERSE JP                          |
| 203.198.248.246 | 1   | 否    | 无                              | 家宽          | HKT                                    |
| 103.156.242.229 | 65  | 否    | 无                              | 数据中心        | Raid Networks Co., Ltd.                |
| 185.220.238.121 | 63  | 否    | 匿名VPN服务                        | 数据中心 \| VPN | Akari                                  |
| 39.64.20.174    | 0   | 否    | 无                              | 家宽          | China Unicom Shandong Province Network |
| 46.3.240.103    | 80  | 是    | 匿名VPN服务                        | 数据中心 \| VPN | Akari                                  |
| 104.28.211.105  | 93  | 是    | (CPN) Consumer Privacy Network | 数据中心 \| CPN | Cloudflare                             |

---
### 小打小闹该结束了。

不想跟他们玩了，直接修改 `head.png` 改到别的地方和文件名，push！结果效果嘛……？
![Pasted_image 20260104184435.png](/assets/images/my-static-blog-ddos-vercel-to-cloudflare-migration/Pasted_image_20260104184435.png)
修改文件名之后，攻击依旧没有停止，但是状态码返回了200万次 404 是怎么回事呀？好难猜呀！

它们还在傻傻地请求旧链接。

![Pasted_image 20260104184504.png](/assets/images/my-static-blog-ddos-vercel-to-cloudflare-migration/Pasted_image_20260104184504.png)

看着后台日志里那 **200多万次** 的 `404 Not Found`，我甚至有点想笑。你们继续刷吧，这点 404 流量，跟挠痒一样。

---
## 第五章：赛后总结
第二天之后很显然流量比昨天少不少了，命中的次数也少很多了。估计是对面发现打了一晚上全是 404，或者那个买来的 DDoS 攻击时间到了。
![Pasted_image 20260104190504.png](/assets/images/my-static-blog-ddos-vercel-to-cloudflare-migration/Pasted_image_20260104190504.png)
![Pasted_image 20260104190244.png](/assets/images/my-static-blog-ddos-vercel-to-cloudflare-migration/Pasted_image_20260104190244.png)
虽然流量还在跑，但 404 页面只有几 KB，相比之前的大图，流量消耗直接降低了 99%。
就是截止目前还是有莫名其妙的东西在扫我改过名字的favicon文件，状态码200已经达到了20.6万次。

---
## 番外篇：乐子来了
被打的第二天中午，群友的静态站也被打了
![Pasted_image 20260104190244.png](/assets/images/my-static-blog-ddos-vercel-to-cloudflare-migration/7cf756f8f787326b870195af99f7c0f4.png)
该群友也是使用的Vercel，也是静态站。表示被打爆了切CF了。

---

我人还在，站还活着，不仅白嫖了腾讯的带宽，还水了这篇博文。 **这波啊，这波是双赢（我赢两次）。** 😎

其实Edgeone Page 无备案也不那么难用嘛~
![IMG-my-static-blog-ddos-vercel-to-cloudflare-migration-20260104194031307.jpeg](/assets/images/my-static-blog-ddos-vercel-to-cloudflare-migration/IMG-my-static-blog-ddos-vercel-to-cloudflare-migration-20260104194031307.jpeg)
