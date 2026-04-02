---
title: "在 Ubuntu Server 22.04 / 20.04 上把网卡配置成静态 IP"
description: "蛮荒时期的博文，仅适合老版本"
date: 2020-06-03 00:00:00
updated: 2020-06-03 00:00:00
categories: [技术]
tags: [Ubuntu, linux, 静态 IP, 网络配置]
---

> 适用于 Ubuntu Server 22.04 及其 Netplan 时代（18.04+）的所有版本。

### 1. 先看看网卡配置

```bash
$ ip -br addr
lo               UNKNOWN        127.0.0.1/8
enp0s3           UP             192.168.122.184/24
```

确认要改的是 `enp0s3`，记住名字。

---

### 2. Netplan 文件在哪儿？

```bash
$ cd /etc/netplan
$ ls
01-netcfg.yaml
```

---

### 3. 备份 + 修改

```bash
sudo cp 01-netcfg.yaml 01-netcfg.yaml.bak
sudo nano 01-netcfg.yaml
```

改成下面这样（自行替换 IP、网关、DNS）：

```yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    enp0s3:
      dhcp4: no
      addresses: [192.168.122.50/24]
      nameservers:
        addresses: [8.8.8.8, 1.1.1.1]
      routes:
        - to: default
          via: 192.168.122.1
```

---

### 4. 应用 & 验证

```bash
sudo netplan apply   # 有语法错误会高亮行号
```

```bash
# 查看 IP
$ ip -4 addr show enp0s3
2: enp0s3: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 ...
    inet 192.168.122.50/24 brd 192.168.122.255 scope global enp0s3
       valid_lft forever preferred_lft forever

# 查看路由
$ ip route
default via 192.168.122.1 dev enp0s3 proto static
192.168.122.0/24 dev enp0s3 proto kernel scope link src 192.168.122.50

# DNS 检查
$ resolvectl status | grep 'Current DNS Server'
    Current DNS Server: 8.8.8.8
```

## 输出如上就代表一次成功 🎉。

---

### 小贴士

- YAML 里**缩进必须用空格，不能 TAB**，空两格就够。
- 真想恢复 DHCP，只需把 `dhcp4: no` 改成 `yes`，然后 `sudo netplan apply` 即可。
- Netplan 会先生成临时配置，再自动回滚。写错不用担心把 SSH 锁死——实在连不上直接重启更省事。
