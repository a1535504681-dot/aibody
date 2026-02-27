# woniu-element-ai

<div align="center">

  [![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://github.com/element-plus-x/woniu-element-ai/blob/main/LICENSE)&emsp;[![Vue 3.5](https://img.shields.io/badge/Vue-3.5-4FC08D?logo=vue.js)](https://vuejs.org/)&emsp;[![Vite 5](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)](https://vitejs.dev/)&emsp;[![TypeScript 5.8](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)](https://www.typescriptlang.org/)

## 🧸 目前功能 

- [x]  登录和邮箱注册
- [x]  会话管理
- [x]  发送消息
- [x]  md 渲染
- [ ]  编辑输入框
- [x]  文件上传
- [ ]  RAG前端管理
- [ ]  语音录入
- [ ]  语音播放

## 🚀 项目亮点

**woniu-element-ai** 是基于 **Vue3.5** + **Element-Plus-X** + **hook-fetch** + **TypeScript** + **Eslint9** 开发的企业级AI应用模板，搭配 **woniu-ai** 后端，快速构建仿豆包的全栈AI项目。

## 💡 核心优势
- 最新技术栈：Vue3.5+/Vite6/Pinia3/TypeScript5
- 流式交互：Hook-Fetch支持Server-Sent Events，插件化写法
- 企业级规范：ESLint/Stylelint/husky/commitlint全链路校验
- 全栈项目：集成 woniu-ai 后端服务，快速开发
- 开箱即用：内置动态路由、状态管理、组件库封装、hooks封装

## 🎯 开发文档

待完成

## 🧰 核心功能

- 使用 Vue3.5+ 各种新特性的支持，让开发更有效率
- 采用 Vite6.3+ 作为项目开发、打包工具
- 使用 Pinia3.0+ 作为全局状态管理库，轻量、优雅、易用，集成 Pinia 持久化插件
- 使用 TypeScript5.8+ 增强项目的代码规范和可读性
- 使用 Unocss 预设样式，更快书写简单的样式
- 弃用 Axios (不支持流式请求) 改用 Hook-Fetch (支持流模式，插件化封装，写法极度优雅) 进行全局的请求封装
- 使用 VueRouter 配置动态路由权限拦截、路由懒加载
- 使用 KeepAlive 对页面进行缓存
- 封装了一些好用的组件和Hooks，增强用户交互体验
- 使用   ESLint9+、Stylelint16+ 代码校验规范、同时统一保存格式化代码
- 使用 husky、lint-staged、commitlint、cz-git 规范提交信息

## 📦 安装与运行

```bash
# 克隆项目
# Gitee
git clone https://gitee.com/wasp_nest/woniu-element-ai.git

# 安装依赖（推荐pnpm 避免幻影依赖）
pnpm install

# 开发模式
pnpm run dev

# 生产构建
pnpm build

# 代码校验
pnpm lint          # ESLint检测
pnpm lint:stylelint # 样式格式化
pnpm cz            # 规范提交（自动执行lint）
```

## 



