---
title: "VPS常用脚本"
description: "收集的常用脚本包括快捷配置脚本~"
date: 2025-12-07 00:00:00
updated: 2025-12-07 00:00:00
categories: [技术]
tags: [脚本, VPS]
---

MJJ你们好，这个地方会放上我开始MJJ以来用过的所有脚本和网站，会给脚本做简单的分类和介绍，同时给出项目原地址，方便大家溯源查找，当你想不起来某个脚本的时候，可以来这里看看哦。
### 初始化脚本
#### 新机到手初始化密码&新建用户
```
bash <(curl -sSL https://raw.githubusercontent.com/Mapleawaa/VPS-Init-Tools/refs/heads/main/init-cn.sh)
```
### 融合脚本

#### [融合怪](https://github.com/spiritLHLS)

```
curl -L https://gitlab.com/spiritysdx/za/-/raw/main/ecs.sh -o ecs.sh && chmod +x ecs.sh && bash ecs.sh
```

![image](https://pic1.imgdb.cn/item/692ef5387313ea6c250ea0b2.png)

最强大的一键脚本之一，顺序测试和单项测试覆盖极为广泛，基本一键完成。

#### [NodeQuality](https://www.nodeseek.com/post-297125-1)

```
bash <(curl -sL https://run.NodeQuality.com)
```

![image](https://pic1.imgdb.cn/item/692ef6067313ea6c250ea390.png)

MJJ最喜爱的一键脚本，也是最方便的，买机卖机都是默认看这个作为测试结果

#### [脚本工具箱](https://kejilion.sh/index-zh-CN.html)

```
bash <(curl -sL kejilion.sh)
```

![image](https://pic1.imgdb.cn/item/692f07457313ea6c250f36a9.png)

超多功能，一键开启linux管理之旅

### ip质量

#### [IP质量体检脚本](https://github.com/xykt/IPQuality)

```
bash <(curl -Ls https://IP.Check.Place)
//指定检测网卡
bash <(curl -Ls https://IP.Check.Place) -i eth0
//指定代理服务器
bash <(curl -Ls https://IP.Check.Place) -x http://username:password@proxyserver:port
bash <(curl -Ls https://IP.Check.Place) -x https://username:password@proxyserver:port
bash <(curl -Ls https://IP.Check.Place) -x socks5://username:password@socksproxy:port
```

![image](https://pic1.imgdb.cn/item/692ef6d67313ea6c250ea633.png)

#### [ipdata](https://ipdata.co/)

![image](https://pic1.imgdb.cn/item/692efb597313ea6c250eb79f.png)

### 网络质量

#### [网络质量体检脚本](https://github.com/xykt/NetQualit)

```
bash <(curl -Ls https://Net.Check.Place)
```

![image](https://pic1.imgdb.cn/item/692ef76f7313ea6c250ea80d.png)

#### [nexttrace](https://github.com/nxtrace/NTrace-core)

```
curl -sL nxtrace.org/nt |bash
nexttrace 1.0.0.1
```

![image](https://pic1.imgdb.cn/item/692f107d7e390957debc06d5.png)

#### [pingpe](https://ping.pe/)

![image](https://pic1.imgdb.cn/item/692efad77313ea6c250eb5e7.png)

#### [itdog](https://www.itdog.cn/)

![image](https://pic1.imgdb.cn/item/692efb0a7313ea6c250eb691.png)

#### [BGPTOOLS](https://bgp.tools/)

![image](https://pic1.imgdb.cn/item/692efbc37313ea6c250eb9a0.png)

### 流媒体测试

#### [流媒体测试](https://github.com/lmc999/RegionRestrictionCheck)

```
bash <(curl -L -s check.unlock.media)
```

![image](https://pic1.imgdb.cn/item/692ef7dc7313ea6c250ea98c.png)

最全的流媒体测试平台，常见不常见的基本全都有

### 性能测试

#### bench

```
wget -qO- bench.sh | bash
```

![image](https://pic1.imgdb.cn/item/692ef9b67313ea6c250eb240.png)

#### [yabs](https://github.com/masonr/yet-another-bench-script)

```
curl -sL https://yabs.sh | bash
或者
wget -qO- yabs.sh | bash
```

![image](https://pic1.imgdb.cn/item/692f01d37313ea6c250f2486.png)

### 网络调优(BBR/TCP)

#### [BBR](https://blog.ylx.me/)

```
wget http://sh.xdmb.xyz/tcp.sh && bash tcp.sh
```

![image](https://pic1.imgdb.cn/item/692efa157313ea6c250eb368.png)

#### [TCP](https://xdmb.xyz/)

```
wget sh.xdmb.xyz/d11.sh && bash d11.sh
```

一般不太用，这个参数太暴力

### 大杂烩

#### [DDNS脚本](https://github.com/kkkgo/UE-DDNS)

```
curl -skLo ue-ddns.sh ddns.03k.org  
sh ue-ddns.sh
然后根据提示完成操作
最后设置定时任务
sudo apt-get update
sudo apt-get install cron
crontab -e
*/10 * * * * /root/(你脚本的名字)@cloudflare_IPV4_URL.sh
```
