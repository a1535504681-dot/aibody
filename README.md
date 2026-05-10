# 蜗牛学苑 项目介绍

## 项目概述

woniu-element-ai 是一个基于 Vue 3 + Element Plus 构建的 AI 聊天应用模板，提供了完整的聊天功能、知识库管理和 RAG（检索增强生成）能力。

## 项目预览

目前就AI对话和AI对话选择向量库，还有AI-知识库可以用。

![image-20260310144115665](https://woniumd.oss-cn-hangzhou.aliyuncs.com/security/mayuhang/202603101441963.png)

![image-20260310144216030](https://woniumd.oss-cn-hangzhou.aliyuncs.com/security/mayuhang/202603101442278.png)

![image-20260310144313535](https://woniumd.oss-cn-hangzhou.aliyuncs.com/security/mayuhang/202603101443779.png)

![image-20260310144401715](https://woniumd.oss-cn-hangzhou.aliyuncs.com/security/mayuhang/202603101444979.png)

![image-20260310145755151](https://woniumd.oss-cn-hangzhou.aliyuncs.com/security/mayuhang/202603101457407.png)

## 项目结构

### 目录结构

```
woniu-element-ai/
├── .build/                           # 构建配置
│   └── plugins/                      # 构建插件
├── .husky/                           # Git 钩子
├── .vite/                            # Vite 缓存
├── .vscode/                          # VS Code 配置
├── public/                           # 静态资源
│   └── favicon.ico
├── src/                              # 源代码
│   ├── api/                          # API 接口定义
│   │   ├── auth/                     # 认证相关接口（登录、注册、验证码）
│   │   │   ├── index.ts              # 认证接口实现
│   │   │   └── types.ts              # 认证类型定义
│   │   ├── chat/                     # 聊天相关接口
│   │   │   ├── index.ts              # 聊天接口实现
│   │   │   └── types.ts              # 聊天类型定义
│   │   ├── files/                    # 文件相关接口
│   │   │   └── index.ts
│   │   ├── knowledge/                # 知识库相关接口
│   │   │   ├── index.ts
│   │   │   └── types.ts
│   │   ├── model/                    # 模型相关接口
│   │   │   ├── index.ts
│   │   │   └── types.ts
│   │   ├── pendingApproval/          # 待审批相关接口
│   │   │   └── index.ts
│   │   ├── session/                  # 会话相关接口
│   │   │   ├── index.ts
│   │   │   └── types.ts
│   │   ├── vectorStore/              # 向量存储相关接口
│   │   │   └── index.ts
│   │   └── index.ts                  # API 统一导出
│   ├── assets/                       # 资源文件
│   │   ├── icons/                    # SVG 图标库
│   │   │   ├── Buildings/             # 建筑类图标
│   │   │   ├── Business/              # 商业类图标
│   │   │   ├── System/                # 系统类图标
│   │   │   └── User/                  # 用户类图标
│   │   ├── images/                    # 图片资源
│   │   │   ├── error/                 # 错误页面图片
│   │   │   └── logo.svg
│   │   └── vue.svg
│   ├── components/                   # 公共组件
│   │   ├── DeepThinking/             # 深度思考组件
│   │   │   └── index.vue
│   │   ├── FilesSelect/               # 文件选择组件
│   │   │   └── index.vue
│   │   ├── IconSelect/                # 图标选择器
│   │   │   ├── index.vue
│   │   │   └── requireIcons.ts
│   │   ├── KnowLedgeBase/             # 知识库组件
│   │   │   └── index.vue
│   │   ├── LoginDialog/               # 登录弹窗组件
│   │   │   ├── index.vue
│   │   │   └── components/
│   │   │       ├── FormLogin/         # 表单登录
│   │   │       │   ├── AccountPassword.vue     # 账号密码登录
│   │   │       │   ├── RegistrationForm.vue    # 注册表单
│   │   │       │   └── VerificationCode.vue    # 验证码登录
│   │   │       └── QrCodeLogin/       # 二维码登录
│   │   │           └── index.vue
│   │   ├── ModelSelect/               # 模型选择组件
│   │   │   └── index.vue
│   │   ├── Popover/                   # 气泡提示组件
│   │   │   └── index.vue
│   │   ├── SvgIcon/                   # SVG 图标组件
│   │   │   └── index.vue
│   │   └── WelecomeText/              # 欢迎文字组件
│   │       └── index.vue
│   ├── config/                        # 全局配置
│   │   ├── darkMode.ts                # 暗黑模式配置
│   │   ├── design.ts                  # 设计配置
│   │   └── index.ts                   # 入口配置
│   ├── layouts/                       # 布局组件
│   │   ├── index.vue                  # 根布局
│   │   ├── LayoutMobile/              # 移动端布局
│   │   │   └── index.vue
│   │   ├── LayoutVertical/            # 垂直布局
│   │   │   └── index.vue
│   │   └── components/                # 布局内部组件
│   │       ├── Aside/                  # 侧边栏
│   │       │   └── index.vue
│   │       ├── DesignConfig/          # 主题配置
│   │       │   └── index.vue
│   │       ├── Header/                 # 头部
│   │       │   ├── index.vue
│   │       │   └── components/
│   │       │       ├── Avatar.vue             # 头像组件
│   │       │       ├── Collapse.vue           # 折叠组件
│   │       │       ├── CreateChat.vue        # 创建聊天组件
│   │       │       ├── LoginBtn.vue          # 登录按钮组件
│   │       │       └── TitleEditing.vue      # 标题编辑组件
│   │       ├── Logo/                   # Logo
│   │       │   └── index.vue
│   │       ├── Main/                   # 主内容区
│   │       │   └── index.vue
│   │       └── Rag/                    # RAG 相关组件
│   │           ├── knowledge/          # 知识库管理
│   │           │   ├── index.vue
│   │           │   ├── ApprovedKnowledge/     # 已审批知识
│   │           │   │   └── index.vue
│   │           │   ├── FilesDoc/               # 文档管理
│   │           │   │   └── index.vue
│   │           │   └── FilesUpload/            # 文件上传
│   │           │       └── index.vue
│   │           └── ragMenus/            # RAG 菜单
│   │               └── index.vue
│   ├── pages/                         # 页面组件
│   │   ├── chat/                       # 聊天页面
│   │   │   ├── index.vue               # 聊天主页面
│   │   │   └── layouts/                # 聊天布局
│   │   │       ├── chatDefaul/         # 默认聊天布局
│   │   │       │   └── index.vue
│   │   │       └── chatWithId/         # 带 ID 的聊天布局
│   │   │           └── index.vue
│   │   ├── error/                      # 错误页面
│   │   │   ├── 403.vue                 # 403 页面
│   │   │   └── 404.vue                 # 404 页面
│   │   └── rag/                        # RAG 页面
│   │       ├── index.vue               # RAG 主页面
│   │       └── create/                 # 创建 RAG
│   │           └── index.vue
│   ├── routers/                       # 路由配置
│   │   ├── index.ts                    # 路由入口
│   │   ├── types.ts                    # 路由类型
│   │   └── modules/                    # 路由模块
│   │       ├── staticRouter.ts         # 静态路由
│   │       └── dynamicRouter.ts        # 动态路由
│   ├── stores/                         # 状态管理
│   │   ├── index.ts                    # store 入口
│   │   └── modules/                    # store 模块
│   │       ├── auth.ts                 # 认证状态
│   │       ├── chat.ts                 # 聊天状态
│   │       ├── design.ts                # 主题状态
│   │       ├── files.ts                # 文件状态
│   │       ├── keepAlive.ts            # 缓存状态
│   │       ├── knowledge.ts            # 知识库状态
│   │       ├── loginForm.ts             # 登录表单状态
│   │       ├── model.ts                # 模型状态
│   │       ├── session.ts              # 会话状态
│   │       └── user.ts                 # 用户状态
│   ├── styles/                        # 样式文件
│   │   ├── btn-style.scss              # 按钮样式
│   │   ├── darkMode.scss               # 暗黑模式样式
│   │   ├── element-plus.scss           # Element Plus 样式覆盖
│   │   ├── elx.scss                    # 扩展样式
│   │   ├── index.scss                  # 入口样式
│   │   ├── markdown.scss               # Markdown 样式
│   │   ├── media.scss                  # 媒体查询样式
│   │   └── var.scss                    # 变量定义
│   ├── utils/                          # 工具函数
│   │   └── request.ts                  # 请求封装
│   ├── App.vue                         # 根组件
│   └── main.ts                         # 入口文件
├── .commitlintrc.cjs                   # Commit 规范配置
├── .editorconfig                       # 编辑器配置
├── .env.development                    # 开发环境变量
├── .env.production                     # 生产环境变量
├── .eslintrc-auto-import.json          # ESLint 自动导入配置
├── .gitignore                          # Git 忽略文件
├── .lintstagedrc                       # 提交前检查配置
├── .stylelintignore                    # StyleLint 忽略文件
├── .stylelintrc.cjs                    # StyleLint 配置
├── LICENSE                             # 许可证
├── README.en.md                        # 英文 README
├── README.md                           # 中文 README
├── eslint.config.js                    # ESLint 配置
├── index.html                          # HTML 入口
├── package.json                        # 项目配置
└── pnpm-lock.yaml                      # 依赖锁文件
```



## 未来规划

1. **AI 能力扩展**
   - 支持更多 AI 模型集成
   - 多模态图像生成功能
   - AI 翻译功能
   - 知识图谱构建与应用

2. **功能增强**
   - PPT 制作功能
   - 支持对话文件下载
   - 业务系统跳转集成
   - 增强文件处理能力，支持更多文件格式

3. **性能优化**
   - 优化向量存储性能，支持更大规模的知识库
   - 提升系统响应速度和并发处理能力

4. **系统完善**
   - 增加用户权限管理
   - 提供更丰富的前端交互界面

5. **教育功能集成**
   - 学习计划管理
   - 考试系统
   - 刷题测试功能
   - 学习进度跟踪

未来，我们将持续进行技术探索，不断提升系统的智能化水平和用户体验。


## 技术栈

### 核心框架

| 技术/框架  | 版本    | 用途     |
| ---------- | ------- | -------- |
| Vue        | ^3.5.17 | 前端框架 |
| Vue Router | 4       | 路由管理 |
| Pinia      | ^3.0.3  | 状态管理 |
| TypeScript | ~5.8.3  | 类型系统 |

### UI 与样式

| 技术/框架               | 版本    | 用途         |
| ----------------------- | ------- | ------------ |
| Element Plus            | ^2.13.2 | UI 组件库    |
| SCSS                    | ^1.89.2 | CSS 预处理器 |
| @element-plus/icons-vue | ^2.13.2 | 图标组件库   |

### 构建与开发

| 技术/框架 | 版本     | 用途         |
| --------- | -------- | ------------ |
| Vite      | 6.0.0    | 构建工具     |
| ESLint    | ^9.31.0  | 代码质量检查 |
| StyleLint | ^16.21.1 | 样式检查     |

### 核心依赖

| 依赖                        | 版本         | 用途                  |
| --------------------------- | ------------ | --------------------- |
| @vueuse/core                | ^13.5.0      | Vue 组合式 API 工具集 |
| pinia-plugin-persistedstate | ^4.4.1       | Pinia 持久化插件      |
| nprogress                   | ^0.2.0       | 页面加载进度条        |
| qrcode                      | ^1.5.4       | 二维码生成            |
| radash                      | ^12.1.1      | 实用工具库            |
| reset-css                   | ^5.0.2       | CSS 重置              |
| unplugin-auto-import        | ^19.3.0      | 自动导入插件          |
| unplugin-vue-components     | ^28.8.0      | 组件自动导入插件      |
| unocss                      | 66.3.3       | 原子化 CSS 引擎       |
| @floating-ui/vue            | ^1.1.7       | 浮动 UI 组件          |
| @jsonlee_12138/enum         | ^1.0.4       | 枚举工具              |
| hook-fetch                  | 2.0.4-beta.1 | 请求 Hook 封装        |

### 项目启动核心配置

项目启动需要配置以下核心内容：

1. **环境变量配置**（.env.development / .env.production）
   - `VITE_WEB_TITLE`: 网站标题
   - `VITE_APP_BASE_API`: 基础 API 地址
   - 其他业务相关配置

2. **路由白名单**（src/config/index.ts）
   - `ROUTER_WHITE_LIST`: 不需要登录即可访问的路由
   - `HOME_URL`: 首页地址

3. **API 请求封装**（src/utils/request.ts）
   - 统一请求拦截器
   - 统一响应拦截器
   - Token 管理
   - 错误处理

4. **状态管理**（src/stores/）
   - 用户状态（user.ts）
   - 认证状态（auth.ts）
   - 聊天状态（chat.ts）
   - 会话状态（session.ts）
   - 知识库状态（knowledge.ts）
   - 模型状态（model.ts）

## 页面与路由关系

### 路由配置结构

项目采用静态路由 + 动态路由的混合模式，主要路由配置如下：

```
/                           # 根路由，重定向到 HOME_URL
├── /chat                   # 聊天主页（默认聊天页面）
├── /chat/:id               # 带 ID 的聊天页面（具体会话）
├── /rag                    # RAG 管理页
│   ├── /rag/create         # 创建知识库
│   └── /rag/detail/:id     # 知识库详情/审批页
├── /403                    # 403 错误页
├── /404                    # 404 错误页
└── /:pathMatch(.*)*        # 未知路由重定向到 404
```

### 页面与路由对应关系

| 路由路径          | 页面文件                                       | 页面名称   | 说明                     |
| ----------------- | ---------------------------------------------- | ---------- | ------------------------ |
| `/chat`           | src/pages/chat/index.vue                       | chat       | 通用聊天页面（默认）     |
| `/chat/:id`       | src/pages/chat/index.vue                       | chatWithId | 带会话ID的聊天页面       |
| `/rag`            | src/pages/rag/index.vue                        | ragManager | RAG 管理页（知识库列表） |
| `/rag/create`     | src/pages/rag/create/index.vue                 | createRag  | 创建/编辑知识库          |
| `/rag/detail/:id` | src/layouts/components/Rag/knowledge/index.vue | rag        | 知识库详情/审批          |
| `/403`            | src/pages/error/403.vue                        | 403        | 403 权限错误页面         |
| `/404`            | src/pages/error/404.vue                        | 404        | 404 未找到页面           |

### 页面访问流程

1. **默认访问** → `/chat` → 显示通用聊天页面（无会话ID）
2. **选择会话** → `/chat/:id` → 显示带会话ID的聊天页面
3. **知识库管理** → `/rag` → 显示知识库列表页面
4. **创建知识库** → `/rag/create` → 显示创建知识库页面
5. **知识库详情** → `/rag/detail/:id` → 显示知识库详情和审批页面

### 路由守卫

项目在 `src/routers/index.ts` 中实现了以下路由守卫逻辑：

1. **NProgress 开始**：页面切换时显示加载进度条
2. **标题设置**：根据路由 meta.title 设置页面标题
3. **白名单检查**：访问白名单路由直接放行
4. **Token 验证**：无 Token 时重定向到登录页面

## 组件介绍

### 公共组件

#### 1. LoginDialog（登录弹窗组件）

- **位置**：src/components/LoginDialog/
- **功能**：用户登录/注册的弹窗组件
- **子组件**：
  - `AccountPassword.vue`: 账号密码登录
  - `RegistrationForm.vue`: 注册表单
  - `VerificationCode.vue`: 验证码登录
  - `QrCodeLogin.vue`: 二维码登录

#### 2. ModelSelect（模型选择组件）

- **位置**：src/components/ModelSelect/
- **功能**：选择 AI 模型的下拉选择器
- **用途**：聊天时选择不同的 AI 模型

#### 3. FilesSelect（文件选择组件）

- **位置**：src/components/FilesSelect/
- **功能**：选择上传文件的组件
- **用途**：上传聊天附件或知识库文档

#### 4. IconSelect（图标选择器）

- **位置**：src/components/IconSelect/
- **功能**：选择图标的选择器组件
- **用途**：知识库或菜单图标选择

#### 5. SvgIcon（SVG 图标组件）

- **位置**：src/components/SvgIcon/
- **功能**：渲染 SVG 图标的组件
- **用途**：项目中的图标渲染

#### 6. DeepThinking（深度思考组件）

- **位置**：src/components/DeepThinking/
- **功能**：显示 AI 深度思考过程的组件
- **用途**：展示大模型的推理过程

#### 7. KnowLedgeBase（知识库组件）

- **位置**：src/components/KnowLedgeBase/
- **功能**：知识库展示和操作组件
- **用途**：在聊天中引用知识库

#### 8. WelecomeText（欢迎文字组件）

- **位置**：src/components/WelecomeText/
- **功能**：显示欢迎文字和引导语
- **用途**：新用户欢迎页面

#### 9. Popover（气泡提示组件）

- **位置**：src/components/Popover/
- **功能**：自定义气泡提示
- **用途**：自定义提示信息

### 布局组件

#### 1. layouts/index.vue

- **功能**：根布局组件，根据条件渲染不同布局

#### 2. LayoutVertical（垂直布局）

- **位置**：src/layouts/LayoutVertical/
- **功能**：左侧边栏 + 顶部Header + 主内容区的经典布局

#### 3. LayoutMobile（移动端布局）

- **位置**：src/layouts/LayoutMobile/
- **功能**：适配移动端的布局

#### 4. Header（头部组件）

- **位置**：src/layouts/components/Header/
- **子组件**：
  - Avatar.vue: 用户头像和下拉菜单
  - Collapse.vue: 侧边栏折叠按钮
  - CreateChat.vue: 新建聊天按钮
  - LoginBtn.vue: 登录按钮
  - TitleEditing.vue: 标题编辑

#### 5. Aside（侧边栏组件）

- **位置**：src/layouts/components/Aside/
- **功能**：会话列表展示和管理

#### 6. Rag 相关组件

- **位置**：src/layouts/components/Rag/
- **功能**：知识库管理和审批
- **子组件**：
  - knowledge/index.vue: 知识库管理主组件
  - knowledge/ApprovedKnowledge/index.vue: 已审批知识列表
  - knowledge/FilesDoc/index.vue: 文档管理
  - knowledge/FilesUpload/index.vue: 文件上传
  - ragMenus/index.vue: RAG 菜单

### 页面组件

#### 1. 聊天页面

- **chat/index.vue**: 聊天主页面（路由入口）
- **chat/layouts/chatDefaul/index.vue**: 默认聊天布局（新建会话）
- **chat/layouts/chatWithId/index.vue**: 带ID聊天布局（历史会话）

#### 2. RAG 页面

- **rag/index.vue**: RAG 管理主页
- **rag/create/index.vue**: 创建知识库

#### 3. 错误页面

- **error/403.vue**: 403 权限错误页面
- **error/404.vue**: 404 未找到页面

## 功能特性

1. **用户认证**：支持登录、注册、邮箱验证码、二维码登录
2. **聊天功能**：支持与 AI 模型的实时对话、SSE 流式响应
3. **会话管理**：创建、更新、删除和查看历史会话
4. **知识库管理**：创建、更新、删除知识库，文档上传和管理
5. **RAG 能力**：基于知识库的问答、文档审批流程
6. **文件管理**：支持文件上传和附件管理
7. **模型选择**：支持多模型切换
8. **主题配置**：支持主题颜色定制和暗黑模式

## 接口文档

详细的接口文档请查看 [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)



```
## 未来规划

1. **AI 能力扩展**
   - 支持更多 AI 模型集成
   - 多模态图像生成功能
   - AI 翻译功能
   - 知识图谱构建与应用

2. **功能增强**
   - PPT 制作功能
   - 支持对话文件下载
   - 业务系统跳转集成
   - 增强文件处理能力，支持更多文件格式

3. **性能优化**
   - 优化向量存储性能，支持更大规模的知识库
   - 提升系统响应速度和并发处理能力

4. **系统完善**
   - 增加用户权限管理
   - 提供更丰富的前端交互界面

5. **教育功能集成**
   - 学习计划管理
   - 考试系统
   - 刷题测试功能
   - 学习进度跟踪

未来，我们将持续进行技术探索，不断提升系统的智能化水平和用户体验。
```

## 开发指南

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
pnpm run dev
```

### 构建

```bash
pnpm build
```

### 代码检查

```bash
pnpm lint
```

### 样式检查

```bash
pnpm lint:stylelint
```

## 许可证

MIT License





**成都蜗牛学苑 © 2026** - 专注于高端IT人才培养，引领技术创新"
