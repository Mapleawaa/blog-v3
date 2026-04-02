---
title: "PVE系统下vGPU原理与部署全指南"
description: "本文章适合初次接触Proxmox VE（PVE）虚拟化技术，希望了解vGPU概念并完成基础部署的用户。"
date: 2025-03-25 00:00:00
updated: 2025-03-25 00:00:00
categories: [技术]
tags: []
image: "/assets/images/pve-vgpu-principle-deployment-guide-images/vgpu_.webp"
---
## 壹、vGPU技术核心原理与架构解析
### 1.1 什么是vGPU？  
vGPU（虚拟图形处理单元）是一种通过**硬件虚拟化技术**，将物理GPU分割为多个虚拟GPU实例的技术。它通过硬件调度器和专用驱动程序实现GPU资源的细粒度划分与调度管理。

- **核心优势**：  
  - ✅ **资源隔离**：每个虚拟机独享独立显存与算力，确保工作负载互不干扰
  - ✅ **性能保障**：通过NVIDIA vGPU或Intel GVT-g等技术实现接近物理GPU的性能（95%以上性能保持）
  - ✅ **灵活分配**：按需动态调整虚拟机显存大小，支持热插拔
  - ✅ **资源监控**：提供细粒度的性能监控和调优能力
  - ✅ **成本优化**：提高GPU硬件利用率，降低总体拥有成本（TCO）

### 1.2 vGPU技术架构
![mermaid](/assets/images/pve-vgpu-principle-deployment-guide-images/mermaid-1.png)

### 1.3 vGPU与直通（Passthrough）的区别  
| 特性                | vGPU                     | GPU直通               |  
|---------------------|--------------------------|-----------------------|  
| **硬件利用率**      | ✅ 支持多虚拟机共享GPU   | ❌ 单虚拟机独占GPU     |  
| **配置复杂度**      | ⚠️ 需特定驱动和授权      | ⚠️ 需IOMMU/VT-d支持   |  
| **性能损耗**        | ⚠️ 5%-15%（取决于负载） | ✅ 几乎无损耗          |  
| **灵活性**          | ✅ 支持动态资源调整      | ❌ 固定分配           |
| **成本效益**        | ✅ 单卡多用户共享        | ❌ 需配置多卡         |
| **应用场景**        | 云桌面/轻量AI训练        | 重负载图形工作站      |


## 贰、部署前准备  
### 2.1 硬件兼容性检查  
- **GPU型号要求**：  
  - NVIDIA：Tesla/Quadro系列（需购买vGPU授权）  
<a href = "https://mcyre.cc/posts/nvidia-vgpu-unlock/">这里查看支持的型号</a>
  - Intel：支持GVT-g的CPU+核显（如第11代酷睿处理器）  
- **主板要求**：  
  - 启用BIOS中的**Intel VT-d**或**AMD-Vi**（IOMMU）功能  
  - 确认GPU已正确安装且未被宿主机占用  


### 2.2 软件环境  
- PVE版本：**7.0或更高版本**（内核需5.11+）

***注意！请不要无脑使用PVE最新系统，请根据驱动支持的最大内核版本进行选择！！！***
***注意！PVE系统内核版本过低或过高均可能导致vGPU无法正常工作！！！***

---

## 叁、开始部署vGPU
> 注意此处的解锁方法仅适用于家用显卡，对于专业显卡请跳转至*3.2*安装驱动步骤。

### 3.1 配置vGPU_Unlock
#### 3.1.1 安装依赖 
**创建vgpu_unlock文件夹**
```bash
mkdir /etc/vgpu_unlock
```
**创建profile_override.toml文件**
```bash
touch /etc/vgpu_unlock/profile_override.toml
```
**创建`nvidia-vgpud.service.d,nvidia-vgpu-mgr.service.d`服务文件**
```bash
mkdir /etc/systemd/system/{nvidia-vgpud.service.d,nvidia-vgpu-mgr.service.d}
```
**写入路径信息**
```bash
echo -e "[Service]\nEnvironment=LD_PRELOAD=/opt/vgpu_unlock-rs/target/release/libvgpu_unlock_rs.so" > /etc/systemd/system/nvidia-vgpud.service.d/vgpu_unlock.conf
echo -e "[Service]\nEnvironment=LD_PRELOAD=/opt/vgpu_unlock-rs/target/release/libvgpu_unlock_rs.so" > /etc/systemd/system/nvidia-vgpu-mgr.service.d/vgpu_unlock.conf
```
**重新加载服务**
```bash
systemctl daemon-reload
```
**执行完成后，cat下查看服务配置是否与输出内容一致**
```bash
cat /etc/systemd/system/{nvidia-vgpud.service.d,nvidia-vgpu-mgr.service.d}/*
```
**输出内容**
```bash
[Service]
Environment=LD_PRELOAD=/opt/vgpu_unlock-rs/target/release/libvgpu_unlock_rs.so
[Service]
Environment=LD_PRELOAD=/opt/vgpu_unlock-rs/target/release/libvgpu_unlock_rs.so
```
#### 3.1.2 安装vGPU_Unlock

**下载预编译好的libvgpu_unlock_rs.so文件**
```bash
mkdir -p /opt/vgpu_unlock-rs/target/release
cd /opt/vgpu_unlock-rs/target/release
wget -O libvgpu_unlock_rs.so https://raw.githubusercontent.com/Mapleawaa/IceDocument/refs/heads/main/libvgpu_unlock_rs_20230207_44d5bb3.so
```
> 如文件失效或无法下载，请更换为以下链接：
> JulyBlog提供：https://yangwenqing.com/files/pve/vgpu/vgpu_unlock/rust/libvgpu_unlock_rs_20230207_44d5bb3.so
> OneDrive链接下载：https://1drv.ms/u/s!AgklE145BxGdmdtPAwysOPsp2sB5Mw?e=m5dls3
> 第二个备份网盘：https://pan.huang1111.cn/s/8QvnxFQ

### 3.2 安装vGPU驱动
**安装显卡驱动需要用到的依赖**
```bash
apt install build-essential dkms mdevctl pve-headers-$(uname -r)
```
**下载显卡驱动**
注意这里的驱动版本为GRID16.2版本。
```bash
wget "https://yun.yangwenqing.com/NVIDIA/vGPU/NVIDIA/16.2/NVIDIA-Linux-x86_64-535.129.03-vgpu-kvm-patched.run"
```
如需要其他版本，请前往[佛西大佬的博客网盘](https://alist.homelabproject.cc/foxipan/vGPU)，下载对应可以使用的版本驱动。

**赋予执行权限**
```bash
chmod +x NVIDIA-Linux-x86_64-535.129.03-vgpu-kvm-patched.run
```
**安装驱动(默认回车直至安装完成即可)**
```bash
/NVIDIA-Linux-x86_64-535.129.03-vgpu-kvm-patched.run
```
**重启**
```shell
reboot
```
#### 3.2.1 其他补充提示：
1) 如之前安装过了显卡驱动，则需要先卸载，再安装
**卸载显卡驱动**
```bash
/NVIDIA-Linux-x86_64-535.129.03-vgpu-kvm-patched.run --uninstall
```
**移除显卡相关程序**
```bash
sudo apt-get remove --purge nvidia-*
```
**安装驱动(默认回车直至安装完成即可)**
```bash
/NVIDIA-Linux-x86_64-535.129.03-vgpu-kvm-patched.run
```

### 3.3 检查服务状态
**查看相关服务状态**
```bash
systemctl status {nvidia-vgpud.service,nvidia-vgpu-mgr.service}
```
![检查服务状态](https://yangwenqing.com/usr/uploads/2024/02/3104229423.png)
如果出现 `Active: failed` 字样，则需要手动启动相关服务。或者有步骤配置错误，请检查。

**重新启动相关服务**
```bash
systemctl restart {nvidia-vgpud.service,nvidia-vgpu-mgr.service}
```
**停止相关服务**
```bash
systemctl stop {nvidia-vgpud.service,nvidia-vgpu-mgr.service}
```
**查看相关服务状态**
```bash
nvidia-smi  
```
![nvidia-smi](https://yangwenqing.com/usr/uploads/2024/02/3159478274.png)
以及mdevctl types查看
```bash
mdevctl types
```
![mdevctl types](https://yangwenqing.com/usr/uploads/2024/02/1406127646.png)


## 肆、配置vGPU授权服务
**为什么要配置授权服务器？**、
NVIDIA VGPU并非免费产品，需要对VGPU驱动购买许可才能正常使用VGPU。然而家用客户无法直接购买授权，这里我们使用一个取巧的方式，即通过一个**授权服务器**来获取授权。
这里使用[FastAPI-dls](https://hub.docker.com/r/collinwebdesigns/fastapi-dls)作为授权服务器，通过`FastAPI-dls`提供的接口，获取授权码，再通过`vgpu_unlock`提供的接口，将授权码写入显卡驱动，即可实现授权。
- - -

下载部分代码请直接复制，避免出错。
**感谢July's Blog提供的配置好的LXC容器。**
**感谢他们的贡献！**

### 4.1 下载LXC容器备份包
**进入pve备份文件夹**
```bash
cd /var/lib/vz/dump/
```
**使用wget命令下载lxc docker 容器备份包**
这里使用的是July's Blog提供的备份包，因为他们的容器已经配置好了授权服务器。
下载源是国际版OneDrive网盘，并非世纪互联版，下载慢请使用多线程下载。
```bash
wget https://yun.yangwenqing.com/Proxmox/LXC/FASTAPI-DLS/vzdump-lxc-100-2023_11_14-15_docker.tar.zst
```
**或者使用aria2c命令多线程下载lxc docker 容器备份包**
```bash
aria2c -s 8 -x 8 -j 10 'https://yun.yangwenqing.com/Proxmox/LXC/FASTAPI-DLS/vzdump-lxc-100-2023_11_14-15_docker.tar.zst'
```
> LXC容器信息：
> 默认IP地址：192.168.2.99
> 账号：root
> 密码：123123

### 4.2 还原LXC容器并修改IP

**将下载下来的LXC容器进行还原**
![还原LXC容器](https://yangwenqing.com/usr/uploads/2024/02/701573596.png)

**并将原来的IP改为自己内网的IP**
![修改IP](https://yangwenqing.com/usr/uploads/2025/02/82240125.png)

**3）登录LXC容器并创建授权服务：**
![创建授权服务](https://yangwenqing.com/usr/uploads/2025/02/3610659870.png)
**创建授权服务,注意下边的<IP>,一定要改为刚刚自己修改好的**
```bash
docker run --restart always -d -e DLS_URL=192.168.2.99 -e DLS_PORT=443 -p 443:443  makedie/fastapi-dls
```
## 伍、创建虚拟机
### 5.1 创建Ubuntu虚拟机
> 此处使用 Ubuntu 24.04 LTS 版本，不同版本的操作方法大同小异。

#### 5.1.1 创建虚拟机

步骤省略，总结关键信息如下：

>名称：自定义
>光驱挂载：Ubuntu安装ISO镜像
>系统中显卡：默认
>机型：q35
>BIOS：默认 (SeaBIOS)
>磁盘：SCSI 大小60G（按需设置，或硬盘直通）
>CPU：host 核心数量4（按需设置）
>内存：4G及以上
>网络：virtIO（半虚拟化或网卡直通）网卡
>添加PCI设备：nvidia显卡（勾选ROM-Bar和PCIE在Mdev类型中选择vgpu设备）

经过安装步骤，安装完成进入系统。

#### 5.1.2 配置Ubuntu虚拟机
##### 查看IP地址
```bash
ip addr show | grep inet | awk '{print $2}' | sed 's/://g'
```
![image-20250325161752554](/assets/images/pve-vgpu-principle-deployment-guide-images/image-20250325161752554.png)
到这一步，确认自己在安装步骤中勾选安装了OpenSSH工具，否则无法使用SSH工具连接到Ubuntu主机。
如果没有安装OpenSSH工具，则需要安装。
##### 安装Openssh
```bash
sudo apt-get update
sudo apt-get install openssh-server -y
sudo systemctl enable ssh.service
sudo systemctl restart ssh.service
```
**得到IP之后，使用SSH工具，配置好IP地址和密码信息，即可连接到Ubuntu主机。**
这里推荐使用 Tabby | MobaXterm，或者使用其他SSH工具。
##### 更换镜像源
```bash
sudo -i
# 注意这里切换到root用户
wget https://linuxmirrors.cn/main.sh
chmod +x main.sh
/main.sh
```
![image-20250325162929588](/assets/images/pve-vgpu-principle-deployment-guide-images/image-20250325162929588.png)
根据提示，选择离自己物理距离近的镜像源，然后选择安装。


##### 安装需要所需依赖
```bash
sudo apt install build-essential linux-headers-generic libglvnd-dev pkg-config -y
```
##### 安装dkms
```bash
sudo apt install dkms -y
```
##### 安装32位兼容库
```bash
sudo dpkg --add-architecture i386
sudo apt update
sudo apt install libc6:i386 -y
```
##### 屏蔽自带的显卡驱动
**创建blacklist-nouveau.conf文件**
```bash
sudo nano /etc/modprobe.d/blacklist-nouveau.conf
```
**在blacklist-nouveau.conf文件添加如下内容：**
```bash
blacklist nouveau
options nouveau modeset=0
```
**重载内核initramfs**
```bash
sudo update-initramfs -u
```
##### 重启Ubuntu
```bash
sudo reboot
```
##### 重启完成后检查nouveau是否已禁用，没有任何输出说明已经禁用
```bash
lsmod | grep nouveau
```

##### 切换到文本命令行控制台关闭显示服务
如果没有安装图形界面，跳过这一步。
```bash
sudo chvt 3
# 关闭图形界面服务
sudo service gdm stop
```
##### 安装显卡驱动
**使用aria2c命令多线程下载 NVIDIA Guest驱动**
```
aria2c -s 4 -x 4 -j 10 'https://yun.yangwenqing.com/NVIDIA/vGPU/NVIDIA/16.2/NVIDIA-GRID-Linux-KVM-535.129.03-537.70/Guest_Drivers/NVIDIA-Linux-x86_64-535.129.03-grid.run'
```
注意这里安装的是535.129.03-537.70版本，如果要安装其他版本的驱动，请前往佛西大佬的博客网盘，下载对应可以使用的版本驱动，可用驱动为run结尾的文件。

##### 给可执行权限
```bash
chmod +x NVIDIA-Linux-x86_64-535.129.03-grid.run
```
##### 安装驱动（默认回车直至安装完成即可）
```bash
/NVIDIA-Linux-x86_64-535.129.03-grid.run
```
##### 安装完成重启Ubuntu
```bash
reboot
```
##### 重启完成后，使用nvidia-smi验证
```bash
root@Ubuntu23:~# nvidia-smi
Tue Feb 20 16:22:12 2024
+---------------------------------------------------------------------------------------+
| NVIDIA-SMI 535.129.03             Driver Version: 535.129.03   CUDA Version: 12.2     |
|-----------------------------------------+----------------------+----------------------+
| GPU  Name                 Persistence-M | Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp   Perf          Pwr:Usage/Cap |         Memory-Usage | GPU-Util  Compute M. |
|                                         |                      |               MIG M. |
|=========================================+======================+======================|
|   0  GRID P40-1Q                    On  | 00000000:01:00.0 Off |                  N/A |
| N/A   N/A    P8              N/A /  N/A |      7MiB /  1024MiB |      0%      Default |
|                                         |                      |             Disabled |
+-----------------------------------------+----------------------+----------------------+

+---------------------------------------------------------------------------------------+
| Processes:                                                                            |
|  GPU   GI   CI        PID   Type   Process name                            GPU Memory |
|        ID   ID                                                             Usage      |
|=======================================================================================|
|    0   N/A  N/A       801      G   /usr/lib/xorg/Xorg                            6MiB |
+---------------------------------------------------------------------------------------+
```
#### 5.1.3 启用授权
##### 获取授权文件
```bash
wget --no-check-certificate -O /etc/nvidia/ClientConfigToken/client_configuration_token_$(date '+%d-%m-%Y-%H-%M-%S').tok https://192.168.2.99/-/client-token
# 或者
curl --insecure -L -X GET https://192.168.2.99/-/client-token -o /etc/nvidia/ClientConfigToken/client_configuration_token_$(date '+%d-%m-%Y-%H-%M-%S').tok
```
##### 验证授权
```bash
sudo service nvidia-gridd restart
```
##### 验证授权获取情况
```bash
nvidia-smi -q | grep License
```
**看到有Licensed字样，就授权好了。**
```bash
root@Ubuntu23:~# nvidia-smi -q | grep License
    vGPU Software Licensed Product
        License Status                    : Licensed (Expiry: 2024-5-20 9:40:22 GMT)
```

### 5.2 创建Windows虚拟机
> 此处使用Windows10 22H2版本，不同版本的操作方法大同小异。
#### 5.2.1 创建虚拟机

步骤省略，总结关键信息如下：

> 名称：自定义
> 光驱挂载：Win安装ISO镜像
> 系统中显卡：默认
> 机型：q35
> BIOS：OVMF（如果采用SeaBIOS引导，机型q35版本要选7.2及以下，否则无法正常授权驱动）
> EFI分区：UEFI（OVMF）需要
> 磁盘：SCSI 大小60G（按需设置，或硬盘直通）
> CPU：host 核心数量4（按需设置）
> 内存：4G及以上
> 网络：virtIO（半虚拟化或网卡直通）网卡
> 建立好虚拟机后
> 添加CD/DVD设备1个，挂载virtIO驱动ISO镜像

![创建win10虚拟机](https://yangwenqing.com/usr/uploads/2024/03/1898555321.png)

##### 添加你的显卡
勾选ROM-Bar和PCIE在Mdev类型中选择vgpu设备
![勾选ROM-Bar和PCIE在Mdev类型中选择vgpu设备](https://yangwenqing.com/usr/uploads/2024/03/3935107902.png)

>其中 GRID P40-1Q 是 mdev 的名字，P40--显卡名，1--1G 显存，Q 代表 vWS
>关于最后一位字母，如下
>A = Virtual Applications (vApps)
>B = Virtual Desktops (vPC)
>C = AI/Machine Learning/Training (vCS or vWS)
>Q = Virtual Workstations (vWS)（性能最佳）
>在配置vgpu的时候，选择正确的型号型号即可。

#### 5.2.2 配置Windows虚拟机

##### 确保远程可以连接到虚拟机

在系统设置中开启远程功能。

如有需求，可以用下载todesk，vnc，向日葵，parsec等远程软件。

##### 安装NVIDIA Guest驱动

##### 启用授权
1）在浏览器访问fastapi-dls授权服务：https://<HereIsYourIP>/-/client-token会自动下载好授权文件
![下载授权文件](https://yangwenqing.com/usr/uploads/2024/02/3339204735.png)

2）下载后放入C:\Program Files\NVIDIA Corporation\vGPU Licensing\ClientConfigToken\这个目录下

![将授权文件放到指定路径](https://yangwenqing.com/usr/uploads/2024/02/2303419304.png)

重启NVIDIA Display Container Ls服务，即可获得授权也可以在cmd窗口使用nvidia-smi -q命令查看授权情况
如授权失败，需要检查电脑时间是否对得上授权服务器时间
##### 测试调用
4）使用Todesk远程工具连接上虚拟机
打开OpenGL测试网页https://openprocessing.org/sketch/418877/
随便找一个测试项目，测试显卡有没有正常启动。

##### 解锁帧数限制
由于默认的vGPU是有帧数限制的，部分场景需要使用到高刷新率，可以在这里修改帧数限制。
5）使用nano命令编辑文件
编辑nano /etc/vgpu_unlock/profile_override.toml文件，加入以下信息关闭虚拟机重新开机生效。
```toml
[profile.nvidia-46]
num_displays = 1
display_width = 1920
display_height = 1080
max_pixels = 2073600
cuda_enabled = 1
frl_enabled = 0
framebuffer = 939524096
```
参数说明：
```toml
[profile.nvidia-46]nvidia-46 为vgpu型号的参数。如选的不是46则改成自己选的那个型号。
num_displays 最大显示器数量
display_width = 1920
display_height = 1080
max_pixels = 2073600 这3个是虚拟显示器的分辨率，max_pixels是长宽的乘积
cuda_enabled = 1是否开启cuda
frl_enabled = 0 是否限制帧数，0为不限制
framebuffer = 939524096 1GB显存，设定vgpu的显存
```

##### 自定义显存大小
如要自定义修改显卡的显存大小，只需要修改framebuffer的值就好了,显存不建议低于1GB，官方说低于1GB将会禁用NVENC视频编解码器.

**注意：vgpu会默认占用128M，所以如果要改显存，请将结果减去128M再去换算，旧版是减去64M**

例如，你期望显存为1GB，所以就用1024M-64M=960M/1024M-128M=896M

![换算结果](https://yangwenqing.com/usr/uploads/2024/10/1293451713.png)[在线大小换算平台](https://www.bejson.com/convert/filesize/)




## 六、注意事项与进阶技巧  
⚠️ 如果希望使用虚拟的显卡打游戏，那就需要绕过虚拟化检测。本文不会介绍方法。

## END
到此为止，你已经掌握了PVE环境下vGPU的完整部署流程。从理论到实践，我们已经完成了：

- ✅ vGPU技术原理与架构的深入理解
- ✅ 硬件环境与软件依赖的准备工作
- ✅ vGPU驱动的安装与解锁配置
- ✅ 授权服务器的搭建与使用
- ✅ Ubuntu和Windows虚拟机的完整部署

希望本教程能够帮助你在虚拟化环境中更好地利用GPU资源。
记住，授人以鱼不如授人以渔，掌握了这些知识，你不仅能够搭建出高性能的虚拟化环境，更能够根据实际需求进行灵活调整和优化。
希望你也可以把自己的技能和经验分享给更多人，共同成长和进步。

祝你在GPU虚拟化的道路上一帆风顺！如有问题，欢迎参与社区讨论，共同进步。
- - -

## 本文参考资料
感谢前人的付出，让我们一起分享知识，共同进步！
### 技术文档
1. NVIDIA Corporation. (2024). *NVIDIA Virtual GPU Software Documentation*. NVIDIA. 
   https://docs.nvidia.com/grid/latest/
   访问日期: 2024-03-25

### 社区教程与博客
1. Yang, W. Q. (2024). PVE8.1 NVIDIA显卡虚拟化多开VGPU16.2--基于1050Ti. *July's Blog*.
   https://yangwenqing.com/archives/1766/
   访问日期: 2024-03-25

2. 国光. (2024). PVE 环境搭建教程. *国光的博客*.
   https://pve.sqlsec.com/4/5/
   访问日期: 2024-03-25

3. PVE中文社区. (2024). Proxmox VE Nvidia-vGPU 中文教程. *ReadTheDocs*.
   https://pve-doc-cn.readthedocs.io/zh-cn/pve-nvidia-vgpu/
   访问日期: 2024-03-25

4. 佛西. (2024). PVE虚拟化专题. *佛西博客*.
   https://foxi.buduanwang.vip/virtualization/pve/
   访问日期: 2024-03-25

### 开源项目
1. DualSpark. (2024). FastAPI-dls [Computer software].
   https://hub.docker.com/r/collinwebdesigns/fastapi-dls
   访问日期: 2024-03-25

---

> 📝 本文档采用 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh) 许可协议。转载请注明出处。
