---
title: "PVE系统下的AMD独立显卡直通Windows并输出画面教程"
description: "本教程介绍如何在PVE系统下实现AMD独立显卡直通Windows并输出画面，包括主机配置、PVE配置、Windows配置等。"
date: 2024-11-08 00:00:00
updated: 2024-11-08 00:00:00
categories: [技术]
tags: [PVE, AMD, 显卡直通, Windows]
---
PVE 做显卡直通经常出现错误代码 43 的情况，不出意外我也碰上了，下面是我的所有配置和操作步骤，也是折腾了半天，扒了很多论坛。虽然不知道哪个地方解决了问题，但是现在是能够稳定工作，所以发出来供参考。

## 主机配置
    主板：ASUS B460M Pro
    
    CPU：Intel i7-10700
    
    显卡：AMD RX6600XT
    
    PVE版本：6.4

PVE内核： 5.4.140-1-pve

:::note
直通无需确定内核版本 建议统一升级到 **PVE 8.2** 以上版本
:::

## 配置步骤
首先需要更新主板的 BIOS 到最新版本，然后开启主板的虚拟化功能，包括 VT-d、IOMMU、CPU 虚拟化，关闭 CSM，然后最好将主板的首选显卡改为 PEG。

然后按照 PVE 官方的教程配置到 Verify IOMMU Isolation 这一步，在 PVE 中使用下面脚本检查是否显卡在一个单独的 IOMMU 组里
```terminal
shopt -s nullglob
for g in `find /sys/kernel/iommu_groups/* -maxdepth 0 -type d | sort -V`; do
    echo "IOMMU Group ${g##*/}:"
    for d in $g/devices/*; do
        echo -e "\t$(lspci -nns ${d##*/})"
    done;
done;
```

如果有类似下面的输出，就代表显卡在一个单独的 IOMMU 组里面。
![](http://kilomaple.test.upcdn.net/20241108175623.webp)

如果 在一个IOMMU组中存在多个设备，就说明需要开启 ACS 补丁。
这个补丁需要 CPU 支持，具体参考 PVE 官方教程里面的介绍，一般比较新的 CPU 都支持。
PVE 自带 ACS 补丁，只需要在 `/etc/default/grub` 里的 `GRUB_CMDLINE_LINUX_DEFAULT` 项里面添加 `"pcie_acs_override=downstream,multifunction"`

:::note
添加步骤
1. 打开 `/etc/default/grub` 文件
    - 命令行输入 `nano /etc/default/grub` 
2. 找到 `GRUB_CMDLINE_LINUX_DEFAULT=` 这一行
3. 在这一行后面添加 `"pcie_acs_override=downstream,multifunction"`
4. 保存并关闭文件
5. 运行 `sudo update-grub` 更新 GRUB 配置
6. 重启系统使更改生效
然后重启即可看到 IOMMU 中每个 PCIE 设备都在单独一个分组里面。
:::

## 虚拟机内打 vendor-reset 补丁
官方教程里 RX系列会存在复位不正确的 bug，需要打这个 vendor-reset 补丁。

:::warning
此项目issue已经许久未更新，最后 Release 的版本为 2020年8月22日，
目前判断已经**停止更新**，请谨慎使用！
:::

:::note
补丁本身使用非常方便，仅需下载后放到虚拟机的C盘目录下，右键以管理员身份运行即可。

[Github仓库](https://github.com/gnif/vendor-reset)
:::

## 创建 WIN10 虚拟机
参照 PVE 官方的 win10 best practice ，并且在选择 BIOS 的时候要选 OVMF，即使用 UEFI 启动，机型推荐选择 pc-q35-5.2，然后继续按照官方教程的 GPU Passthrough 一节中的指导，使用 GPU OVMF PCI Passthrough 的方式。


## 提取显卡 ROM
依次输入如下命令：
```
    cd /sys/bus/pci/devices/0000:01:00.0/
    echo 1 > rom
    cat rom > /tmp/image.rom
    echo 0 > rom
```

:::note 
或使用下方的一键命令
```
cd /sys/bus/pci/devices/0000:01:00.0/ && echo 1 > rom && cat rom > /tmp/image.rom && echo 0 > rom
```
注意上面的 `0000:01:00.0` 要换成自己的显卡的 pci 地址，使用 lspci -v | grep VGA 可以看到。
可能显示的数值是 02:00.0，但是实际地址前要加入`0000:`，所以要改一下。
然后可以使用 rom-parser 校验一下显卡固件是否支持 UEFI 启动，即输出的解析内容里面有 type 3 即可。
rom-parser 的仓库地址 https://github.com/awilliam/rom-parser
:::

![](http://kilomaple.test.upcdn.net/20241108194352.webp)
然后将提取出来的rom（在上面代码的路径是 /tmp/image.rom）放到 /usr/share/kvm 路径下，我的显卡是 RX6600XT，所以就改名成 RX6600XT.rom。

```terminal
cp /tmp/image.rom /usr/share/kvm/RX6600XT.rom
```
然后在 win10 虚拟机的配置文件中的显卡 pci 配置项中加入 rom 文件。

在虚拟机conf中完整的配置项如下：
```100.conf
...       ↓你的显卡地址|↓PCIE|↓显卡的 rom 文件名|↓设置为虚拟机的输出
hostpci0: 0000:03:00,pcie=1,romfile=RX6600XT.rom,x-vga=1
...省略
```
## 设置 cpu 选项
在虚拟机配置文件中添加 CPU 选项
```
cpu: host,hidden=1,flags=+pcid
```
## 设置虚拟机显示输出
将 WIN10 虚拟机的自带显示输出为 none，只通过显卡进行输出。
![](http://kilomaple.test.upcdn.net/20241108195007.webp)


## 如果不出意外的话直通就应该能成功了！

## 排障
### 设备管理器中出现代码43错误
    安装 AMD 的驱动即可，安装完成在设备管理器里就能看到不带黄色感叹号的显卡了！
### 设备管理器显示设备没有正常启动（代码51）
    根据 ## 虚拟机内打 vendor-reset 补丁 中的提示，安装补丁即可！

## 最后所有相关配置文件（附注释）
### 虚拟机配置文件
```100.conf
agent: 1    # Guest Agent选项 虚拟机互联所需 类似于VM Tools
bios: ovmf      # 虚拟机启动模式
boot: order=scsi0;ide2;net0     # 启动顺序
cores: 8        # CPU核心数
cpu: host,hidden=1,flags=+pcid   # CPU选项
efidisk0: disk-img:100/vm-100-disk-1.qcow2,size=128K    # 虚拟机磁盘文件
hostpci0: 0000:03:00,pcie=1,romfile=RX6600XT.rom,x-vga=1    # 显卡直通配置
ide0: local:iso/virtio-win-0.1.185.iso,media=cdrom,size=402812K # Vitrio驱动镜像 半虚拟化硬件所需
ide2: local:iso/SW_DVD9_Win_Pro_10_20H2_64BIT_ChnSimp_Pro_Ent_EDU_N_MLF_-2_X22-41514.ISO,media=cdrom # 安装系统镜像 
machine: pc-q35-5.2     # 虚拟机机型
memory: 16384       # 内存大小
name: Win10     # 虚拟机名称
net0: virtio=02:F7:CD:B6:9A:56,bridge=vmbr1,firewall=1      # 网卡配置
numa: 0     # NUMA配置 默认为0 表示关闭 这个选项非必要一般不需要开启 
onboot: 1       # 是否开机启动
ostype: win10   # 操作系统类型
scsi0: disk-img:100/vm-100-disk-0.qcow2,cache=writeback,discard=on,size=200G    # 虚拟机磁盘文件
scsihw: virtio-scsi-pci     # SCSI控制器
smbios1: uuid=ced7dbb9-bc4f-473b-804e-f9720a6ce54b      # SMBIOS UUID
sockets: 1      # CPU核心数
usb0: host=046d:c53f,usb3=1     # USB设备
usb1: host=0483:522a,usb3=1     # 鼠标
usb2: host=2-5,usb3=1          # 键盘
vga: none       # 虚拟机显示输出
vmgenid: d0749618-e1e9-4a4c-8b51-162eac4f26a4       # 虚拟机UUID
```
### GRUB 配置文件
```grub
GRUB_DEFAULT=0
GRUB_TIMEOUT=5
GRUB_DISTRIBUTOR="Proxmox Virtual Environment"
GRUB_CMDLINE_LINUX_DEFAULT="quiet nomodeset intel_iommu=on iommu=pt video=efifb:off,vesafb:off pcie_acs_override=downstream,multifunction"      
# GRUB启动参数,分别代表:不显示启动画面、不显示内核信息、开启 IOMMU、开启 IOMMU、关闭 efifb、关闭 vesafb、关闭 pcie_acs_override、关闭 multifunction功能
GRUB_CMDLINE_LINUX=""
blacklist
blacklist radeon        # 禁用radeon驱动
blacklist nouveau       # 禁用N卡开源驱动
blacklist nvidia        # 禁用官方N卡驱动
vfio.conf
options vfio-pci ids=1002:73ff,1002:ab28 disable_vga=1      # 直通显卡的 pci 地址和类型，禁用虚拟化显卡的显示
```
