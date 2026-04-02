---
title: "RHEL Linux下新增硬盘，分区并挂载教程"
description: "''"
date: 2024-06-09 00:00:00
updated: 2024-06-09 00:00:00
categories: [技术]
tags: [Linux, 硬盘, 分区, 挂载, 教程]
---

在 CentOS 中将一个全新的硬盘（例如 `/dev/sdb`）挂载到 `/home/hdd` 目录下，你需要经历以下几个步骤：

1. **检查硬盘**：首先，使用 `lsblk` 或 `fdisk -l` 命令确认硬盘 `/dev/sdb` 是否已被系统识别。

2. **分区硬盘**：如果硬盘没有分区，你需要进行分区操作。可以使用 `fdisk` 或 `parted` 工具。这里以 `parted` 为例：

   ```bash
   sudo parted /dev/sdb mklabel gpt
   sudo parted /dev/sdb mkpart primary 0% 100%
   ```

   这里我们创建了一个 GPT 分区表，并创建了一个占用全部空间的主分区。

3. **格式化分区**：创建分区后，你需要将其格式化为一个文件系统，例如 `ext4`：

   ```bash
   sudo mkfs.ext4 /dev/sdb1
   ```

   确保替换 `sdb1` 为实际的分区名。

4. **创建挂载点**：在 `/home` 目录下创建挂载点 `hdd`：

   ```bash
   sudo mkdir /home/hdd
   ```

5. **临时挂载**：为了测试，你可以先临时挂载分区：

   ```bash
   sudo mount /dev/sdb1 /home/hdd
   ```

   现在你可以检查 `/home/hdd` 是否已成功挂载，并进行读写测试。

6. **永久挂载**：为了让系统启动时自动挂载，需要编辑 `/etc/fstab` 文件：

   ```bash
   sudo nano /etc/fstab
   ```

   在文件末尾添加一行，内容如下（确保使用实际的UUID替换`<UUID>`）：

   ```
   UUID=<UUID> /home/hdd ext4 defaults 0 2
   ```

   你可以通过 `blkid /dev/sdb1` 获取分区的UUID。

7. **验证挂载配置**：执行以下命令检查 `/etc/fstab` 中的条目是否正确，避免重启后出现挂载问题：

   ```bash
   sudo mount -a
   ```

8. **重启测试**：如果一切正常，可以重启系统以检验设置是否生效：

   ```bash
   sudo reboot
   ```

重启后，你应该能在 `/home/hdd` 目录下看到挂载的硬盘。


使用 `fdisk` 对硬盘进行格式化和分区的基本步骤如下。这里以在Linux环境下操作为例，因为Windows环境下现在已经较少直接使用 `fdisk`，而是更多采用图形界面的磁盘管理工具或 `diskpart` 命令行工具。以下是在Linux（例如CentOS、Ubuntu等）中使用 `fdisk` 的步骤：

### 1. 打开终端并获取超级用户权限

```bash
sudo su
```

### 2. 使用fdisk选择磁盘

确定你要分区的磁盘设备名，例如 `/dev/sdb`（注意不要选错，以免丢失数据）。然后运行 `fdisk` 命令：

```bash
fdisk /dev/sdb
```

### 3. 进入fdisk交互模式

- 输入 `m` 查看所有可用的命令。
- 要创建新分区，输入 `n`。
  - 接着选择分区类型，`p` 表示主分区，`e` 表示扩展分区。通常选择 `p` 创建主分区。
  - 输入分区号，如果你是第一次创建分区，通常选择 `1`。
  - 输入起始扇区，默认通常是第一个扇区。
  - 输入结束扇区或+大小，如 `+10G` 表示创建一个10GB的分区，或者直接回车使用默认值直到磁盘末端。

### 4. 设置分区类型

- 输入 `t` 来改变分区类型，通常对于Linux文件系统，保持默认的83（Linux）即可，除非你有特殊需求。
- 输入分区号，例如 `1`，然后回车。

### 5. 激活分区（如果是引导分区）

- 如果这个分区是要作为引导分区（通常是第一个分区），输入 `a`，然后输入分区号激活。

### 6. 写入并退出

- 输入 `w` 保存更改并退出 `fdisk`。这一步操作会立即对磁盘进行修改。

### 7. 格式化分区

格式化新创建的分区，比如刚创建的 `/dev/sdb1`，可以使用以下命令：

```bash
mkfs.ext4 /dev/sdb1
```

这里使用 `ext4` 文件系统作为示例，你可以根据需要选择其他文件系统，如 `xfs`、`btrfs` 等。

### 8. 挂载分区

创建一个挂载点，并挂载新分区：

```bash
mkdir /mnt/mydata
mount /dev/sdb1 /mnt/mydata
```

### 9. 设置开机自动挂载（可选）

为了使分区在系统启动时自动挂载，需要编辑 `/etc/fstab` 文件：

```bash
echo '/dev/sdb1 /mnt/mydata ext4 defaults 0 2' | sudo tee -a /etc/fstab
```

确保替换命令中的路径和文件系统类型与实际情况相符。

完成上述步骤后，你就成功地使用 `fdisk` 对硬盘进行了分区，并对分区进行了格式化。记得在进行这些操作时格外小心，特别是在写入更改(`w`)之前，确保操作无误，以防数据丢失。
