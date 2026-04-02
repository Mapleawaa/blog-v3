---
title: "移除PVE的默认LVM分区释放安装硬盘空间"
description: "在PVE中，默认会将安装硬盘的空间全部分配给local-lvm分区，导致安装硬盘空间不足。本教程将介绍如何移除默认LVM分区并释放安装硬盘空间。"
date: 2022-06-16 00:00:00
updated: 2022-06-16 00:00:00
categories: [技术]
tags: [PVE, LVM, 硬盘, 分区, 挂载, 教程]
---
## 安装过程中移除
### 1. 到硬盘选择步骤时，选择硬盘后，点击Options按钮

### 2. 找到LV Disk部分输入框，手动填上0

### 3. 点击Apply按钮，继续安装步骤。

---
## 已经安装完成系统

### 1. 把local-lvm的空间全部分配给local

#### 1.打开自带的shell窗口，输入后以下内容后回车 
```shell
lvremove pve/data
```
#### 2.继续输入，然后回车
```shell
lvextend -l +100%FREE -r pve/root
```
#### 3.在数据中心-存储中删除local-lvm分区，并编辑local，在内容一项中勾选所有可选项。
