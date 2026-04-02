---
title: "把 N5105/N100 的核显直进虚拟机，让 HDMI 直接点亮物理显示器"
description: "理论上可用所有 Intel 核显，不保证所有型号都成功。"
date: 2022-06-30 00:00:00
updated: 2022-06-30 00:00:00
categories: [技术]
tags: [Intel, 核显, 直通, Proxmox, PVE, 核显直通]
---

> Proxmox VE 7-8 实测可行；Windows / Linux 客户端都适用。
> 下文默认宿主机为 PVE，VMID 以 `199` 举例，核显为 `00:02.0`，按需替换。

---

## 1. BIOS 点亮开关
重启按 **DEL / F2** → **Advanced** → 打开 **Intel VT-d**（有的 BIOS 叫 “IOMMU” 或 “Direct I/O”）→ 保存退出。

---

## 2. 宿主机打开 IOMMU

编辑启动参数：

```bash
nano /etc/default/grub
```

把这一行改成：

```text
GRUB_CMDLINE_LINUX_DEFAULT="quiet intel_iommu=on iommu=pt"
```

```bash
update-grub
reboot
```

重启后确认：

```bash
dmesg | grep -i "iommu.*enabled"
```

---

## 3. 核显独占 IOMMU 分组

```bash
find /sys/kernel/iommu_groups/ -type l | grep 00:02.0
```

输出中核显一个组即可，否则要去 `GRUB` 里加 `pcie_acs_override=downstream,multifunction` 再重启（略）。

---

## 4. 进 VM 直通核显

```bash
nano /etc/pve/qemu-server/199.conf
```

**追加三行**，位置随意，不用粘贴其他重复字段：

```text
hostpci0: 00:02.0,pcie=1,x-vga=1,rombar=0
args: -set device.hostpci0.addr=02.0 -set device.hostpci0.x-vga=on
vga: none
```

最后一行关掉虚拟显卡，避免冲突。

---

## 5. 装好客户端驱动

| 操作系统 | 该做的事 |
|---|---|
| Windows 10/11 | Intel 官网抓 **UHD Graphics** 驱动，一口气装完，重启。 |
| Ubuntu 22.04+ | 开箱即用，如果黑屏跑：<br>`sudo apt install xserver-xorg-video-intel` |

---

## 6. 接显示器 + 开机测试

1. 把宿主 HDMI/DP 插上物理显示器。
2. PVE 里启动 VM。
3. **10 秒内** 显示器应能看到 BIOS Logo → 直接进入系统桌面。

> 没出画面？
> * VM 控制台里看有没有设备 → 重新装驱动。
> * PVE 版本太旧就升到 8.x，顺带升级内核。

---

一条命令验证：

```bash
watch -n1 'lspci -vnnk -s 00:02.0 | grep -i driver'
```

在 `Kernel driver in use:` 一栏应显示 `vfio-pci`，说明核显正被 `vfio` 抓到，无重叠。

搞定，收工 🍺
