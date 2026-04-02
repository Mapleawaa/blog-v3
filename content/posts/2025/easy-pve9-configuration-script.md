---
title: "你的下一个简单好用，简洁易用的 PVE9 配置脚本"
description: "PVE Tools 9 是专为 Proxmox VE 9.0 设计的一键配置工具，基于 Debian 13 (Trixie) 系统。本工具旨在简化 PVE 的初始配置过程，提供友好的用户界面和安全的操作体验。"
date: 2025-10-12 00:00:00
updated: 2025-10-12 00:00:00
categories: [技术]
tags: [脚本]
draft: true
---
## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=Mapleawaa/PVE-Tools-9&type=date&legend=top-left)](https://www.star-history.com/#Mapleawaa/PVE-Tools-9&type=date&legend=top-left)

没想到一个随手写的小脚本 就这么逐渐发展到现在这个完全体了。
感慨万分，第一个开源项目 😭
那就在这边再发一遍吧 Ciallo～(∠・ω<)⌒★

### 🚪 开门见山
#### 中国大陆网络
```
bash <(curl -sSL https://ghfast.top/github.com/Mapleawaa/PVE-Tools-9/blob/main/PVE-Tools.sh)
```
#### 国际网络
```
bash <(curl -sSL https://github.com/Mapleawaa/PVE-Tools-9/blob/main/PVE-Tools.sh)
```
> [!WARNING]
> 请不要多次拉取文件，无论镜像站还是源站。否则会被服务器拒绝导致影响心情。

## ⚡ **主要功能模块**

### 1. **镜像源管理**

- 更换Debian 13和PVE源为中科大/清华镜像，提升国内访问速度
    
- 自动配置CT模板源和Ceph源
    

### 2. **系统优化**

- **移除订阅弹窗**：消除Web界面无订阅警告
    
- **硬盘管理**：合并local+lvm存储、删除Swap释放空间
    
- **内核管理**：查看/安装/切换/清理内核，支持同步更新到最新版
    

### 3. **硬件直通**

- **CPU/PCIe直通**：一键开启/关闭IOMMU和VFIO
    
- **核显虚拟化**：
    
    - **SR-IOV模式**（Intel 11-15代）：最高7个虚拟核显
        
    - **GVT-g模式**（Intel 6-10代）：支持Mdev类型虚拟化
        
- **GRUB配置管理**：备份、恢复、查看配置历史
    

### 4. **监控增强**

- **温度/频率显示**：在Web界面展示CPU、NVMe/SATA硬盘温度、功耗、频率
    
- **UPS监控**：可选显示不间断电源状态
    

### 5. **CPU性能调优**

- 可切换5种电源策略（performance/powersave等）
    
- 通过crontab实现开机自动应用
    

### 6. **附加工具**

- **FastPVE集成**：快速下载预配置虚拟机模板
    
- **Ceph源管理**：为PVE 8/9添加不同版本Ceph存储源
    
- **PVE8→9升级**：一键升级系统版本（高危操作）
    

---

## 🔧 **技术特性**

- ✅ **彩色日志输出**：清晰的操作反馈
    
- ✅ **自动备份**：所有关键文件修改前自动备份
    
- ✅ **网络检测**：国内环境自动使用镜像加速
    
- ✅ **版本兼容**：专为PVE 9.0（Debian 13 Trixie）优化
    
- ✅ **安全机制**：高危操作需二次确认
    

---

## 💡 **适用场景**

- 新装PVE 9.0系统的快速初始化
    
- NAS/虚拟化环境优化配置
    
- 硬件直通（核显、PCIe设备）配置
    
- 国内用户镜像加速需求

## 📄 开源协议

本项目采用 MIT 协议发布

```
MIT License

Copyright (c) 2025 昔云

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```


### 🌟 如果这个项目对你有帮助，请给个 Star ⭐

**用 ❤️ 由 AI 联合打造**

[**Gemini**](https://gemini.google.com) - Google 推出的大语言模型

[**CodeX**](https://openai.com/) - 先进的 GPT 模型驱动

[**Claude Code**](https://claude.ai/code) - Anthropic 官方 AI 编程助手




