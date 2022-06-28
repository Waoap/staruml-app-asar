# app.asar File for StarUML (version: v502.0.1)

A customized version of `app.asar` file for [**StarUML**](https://staruml.io/) program.

[中文说明](README_ZH.md)

## Description

This is a customized version of `app.asar` file for StarUML program, it's for study only.

## Usage

### 1. Use a built version

Suppose you have installed the corresponding version of the StarUML program:

1. Download [the latest release `app.asar` file](https://github.com/Waoap/staruml-app-asar/releases), and replace the original one.

2. Before this, it's recommend to **backup the original one**.

### 2. Build on your own

1. Configure the **node.js** environment, install **asar** by executing command `npm install -g asar`.

2. Download source code and extract with folder.

3. Now execute the command below to package this folder into an fresh app.asar file:

   ```shell
   cd <FOLDER_PARENT_PATH>
   asar p <FOLDER_NAME> app.asar
   ```

## Changes compared to the original version (This version: v502.0.1, Original version: v5.0.2)

1. Add a font [`霞鹜文楷等宽`](https://github.com/lxgw/LxgwWenKai/) into `src/static/` folder (font files are saved in `src/static/xw-font/` folder) and use `霞鹜文楷等宽` as program font.

2. Change some default settings:

   - Change the default setting (`Preference -> General -> Auto load working file`) from `false` to `true`.

   - Change the default setting (`Preference -> General -> Default View Style -> Font Face`) from `"Arial"` to `"霞鹜文楷等宽"`.

   - Add more options for setting (`Preference -> General -> Default View Sytle -> Font Size`) .

   - Change the default setting (`UML -> Interface -> Stereotype Display`) from `"icon"` to `"label"`.

   - Change the default setting (`UML -> Interface -> Suppress Operation`) from `true` to `false`.

3. Change programmed package description from `"A sophisticated software modeler."` to `"A sophisticated software modeler, self-use version customized by Waoap."`.

4. No license required.

5. No auto update.

## TODO

- [ ] Create an `original` brach to save the original version of `app.asar` file.
