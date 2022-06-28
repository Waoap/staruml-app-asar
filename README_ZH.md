# app.asar File for StarUML

[**StarUML**](https://staruml.io/) 程序的 `app.asar` 文件的定制版。

## 说明

这是 StarUML 程序的 `app.asar` 文件的定制版，仅供学习使用。

## 使用

### 1. 使用构建好的版本

假设您已经安装好对应版本的 StarUML 程序：

1. 下载 [最新发布的 `app.asar` 文件](https://github.com/Waoap/staruml-app-asar/releases)，并且替换掉原有的。

2. 在这之前，推荐 **为原有的文件做好备份**。

### 2. 自行构建

1. 配置 **node.js** 环境，通过执行命令 `npm install -g asar` 来安装 **asar**.

2. 下载源代码并且带文件夹解压。

3. 现在执行以下代码来将文件夹打包成新鲜的 app.asar 文件：

   ```shell
   cd <FOLDER_PARENT_PATH>
   asar p <FOLDER_NAME> app.asar
   ```

## 较原版的不同之处（此版本：v502.0.1, 原版本：v5.0.2）

1. 添加 [`霞鹜文楷等宽`](https://github.com/lxgw/LxgwWenKai/) 字体到 `src/static/` 目录中（字体文件被保存在 `src/static/xw-font/` 目录中），并且将 `霞鹜文楷等宽` 作为程序的字体。

2. 修改一些默认设置：

   - 将设置（`Preference -> General -> Auto load working file`）从 `false` 修改为 `true`。

   - 将设置（`Preference -> General -> Default View Style -> Font Face`）从 `“Arial”` 修改为 `“霞鹜文楷等宽”`。

   - 为设置（`Preference -> General -> Default View Sytle -> Font Size`）添加更多可选项。

   - 将设置（`UML -> Interface -> Stereotype Display`）从 `“icon”` 修改为 `“label”`。

   - 将设置（`UML -> Interface -> Suppress Operation`）从 `true` 修改为 `false`。

3. 将程序的 package 说明从 `“A sophisticated software modeler.”` 修改为 `“A sophisticated software modeler, self-use version customized by Waoap.”`。

4. 无需许可证。

5. 无自动更新。

## TODO

- [ ] 创建一个 `original` 分支来保存原版的 `app.asar` 文件。
