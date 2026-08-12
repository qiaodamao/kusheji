<div align="center">

# 酷设计 Kusheji

> 基于 VitePress 打造的适合图文资源分享的博客主题

[![Version](https://img.shields.io/badge/version-1.1.0-blue.svg)](https://github.com/qiaodamao/kusheji)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Vue](https://img.shields.io/badge/Vue-3.x-4fc08d.svg)](https://vuejs.org)
[![VitePress](https://img.shields.io/badge/VitePress-1.6.x-3eaf7c.svg)](https://vitepress.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6.svg)](https://www.typescriptlang.org)

[官网预览](https://kusheji.com) · [素材站](https://sucai.kusheji.com) · [报告问题](https://github.com/qiaodamao/kusheji/issues)

</div>

---

## ✨ 特性

- 🎨 **精美博客主题** - 专为设计资源、图文分享场景打造
- 📝 **Markdown 写作** - 专注内容创作，支持丰富的 frontmatter 配置
- 🔍 **全站搜索** - 集成 Pagefind 本地搜索引擎，支持中文优化
- 📡 **RSS 订阅** - 自动生成 `feed.rss` 订阅源
- 🎵 **音乐播放器** - 内置 Pinia 状态管理的音乐播放组件
- 🖼️ **图片灯箱** - 集成 Fancybox 实现图片放大浏览
- 🏷️ **分类标签** - 支持文章分类、标签、品牌多维度筛选
- 📱 **响应式设计** - 完美适配桌面端与移动端
- 🌓 **暗黑模式** - 支持明暗主题无缝切换
- 🎆 **节日特效** - 雪花、烟花、灯笼等多种节日挂件可配置
- 📊 **访问统计** - 内置百度统计代码接入
- 🔗 **友链系统** - 独立的友情链接页面
- 🛠️ **工具导航** - 可配置的在线工具合集页面
- 📚 **归档/专辑** - 文章归档页与专辑合集页

---

## 🚀 快速开始

### 环境要求

- Node.js >= 18
- npm 或 pnpm 或 yarn

### 安装

```bash
# 克隆项目
git clone https://github.com/qiaodamao/kusheji.git

# 进入目录
cd kusheji

# 安装依赖
npm install
```

### 本地开发

```bash
npm run dev
```

启动后访问 http://localhost:5173

### 构建生产版本

```bash
npm run build
```

构建产物位于 `docs/.vitepress/dist` 目录。

### 预览生产构建

```bash
npm run serve
```

---

## 📁 项目结构

```
kusheji/
├── docs/
│   ├── .vitepress/
│   │   ├── cache/                 # Vite 缓存目录
│   │   ├── models/                # 数据模型（数据库/访问量等）
│   │   │   ├── db.ts
│   │   │   └── views.ts
│   │   ├── store/                 # Pinia 状态管理
│   │   │   ├── player.ts          # 音乐播放器状态
│   │   │   └── settings.ts        # 全局设置
│   │   ├── theme/
│   │   │   ├── components/        # 主题组件（40+ Vue 组件）
│   │   │   │   ├── Home.vue       # 首页组件
│   │   │   │   ├── ArticleList.vue # 文章列表
│   │   │   │   ├── ArticlePage.vue # 文章详情页
│   │   │   │   ├── HeroBanner.vue # 首页大图轮播
│   │   │   │   ├── Player.vue     # 音乐播放器
│   │   │   │   ├── SearchPage.vue # 搜索页面
│   │   │   │   ├── Tags.vue       # 标签云
│   │   │   │   ├── Brands.vue     # 品牌合集
│   │   │   │   ├── Archives.vue   # 归档页
│   │   │   │   ├── AlbumPage.vue  # 专辑页
│   │   │   │   ├── Links.vue      # 友情链接
│   │   │   │   ├── Tools.vue      # 工具导航
│   │   │   │   ├── Firework.vue   # 烟花特效
│   │   │   │   ├── Lantern.vue    # 灯笼挂件
│   │   │   │   ├── Welcome.vue    # 欢迎弹窗
│   │   │   │   └── ...
│   │   │   ├── genFeed.ts         # RSS 生成脚本
│   │   │   ├── head.ts            # 全局 Head 配置（统计/样式/脚本）
│   │   │   ├── index.ts           # 主题入口文件
│   │   │   ├── types.ts           # TypeScript 类型定义
│   │   │   ├── toolsdata.ts       # 工具导航数据
│   │   │   └── functions.ts       # 通用工具函数
│   │   └── config.ts              # VitePress 主配置文件
│   ├── pages/                     # 独立页面（MD格式）
│   │   ├── about.md               # 关于页
│   │   ├── album.md               # 专辑页
│   │   ├── archives.md            # 归档页
│   │   ├── brands.md              # 品牌页
│   │   ├── brandfilter.md         # 品牌筛选
│   │   ├── feed.md                # RSS 订阅页
│   │   ├── links.md               # 友链页
│   │   ├── search.md              # 搜索页
│   │   ├── tags.md                # 标签页
│   │   └── tools.md               # 工具导航
│   ├── posts/                     # 文章目录（按 年/月 组织）
│   │   └── 2026/
│   │       ├── 02/
│   │       ├── 03/
│   │       └── ...
│   ├── public/                    # 静态资源
│   │   ├── static/
│   │   │   ├── css/
│   │   │   ├── font/
│   │   │   ├── img/
│   │   │   ├── js/
│   │   │   └── voice/
│   │   ├── favicon.ico
│   │   ├── favicon.png
│   │   ├── logo.svg
│   │   └── logo.png
│   └── index.md                   # 首页入口
├── .editorconfig
├── .gitignore
├── .npmrc
├── .prettierrc.json
├── eslint.config.js
├── package.json
├── tsconfig.json
├── vercel.json
├── shims-vue.d.ts
├── LICENSE
└── README.md
```

---

## 📝 文章撰写

### 文件位置

文章存放在 `docs/posts/YYYY/MM/` 目录下，使用 Markdown 格式。

### Frontmatter 配置

```markdown
---
post: true                    # 标记为文章（必填）
title: 文章标题                # 文章标题
date: 2026-08-10              # 发布日期
cover: https://.../cover.jpg  # 封面图
categories:                   # 分类（数组）
 - 中文字体
tags:                         # 标签（数组）
 - 宋体
brand:                        # 所属品牌
 - 
description: 文章摘要描述      # 文章简介
externalLink: https://...     # 外链下载地址
externalLinkText: 直接下载     # 外链按钮文字
---

这里是文章正文内容，支持标准 Markdown 语法。

![图片描述](图片地址)
```

### 在文章中嵌入下载卡片

使用内置的 `ArticleLink` 组件：

```html
<ArticleLink via="post" :work="{
    title: '资源标题',
    view: '下载地址',
    github: 'GitHub地址',
    via: '来源地址',
    linkpan: '网盘地址',
    coveross: '',
    beecode: '',
    viewtit: '下载按钮文字',
    wxwords: '',
}" />
```

---

## ⚙️ 主题配置

所有配置集中在 [docs/.vitepress/config.ts](docs/.vitepress/config.ts) 中，主要配置项：

### 网站基础配置

```typescript
export default defineConfig<ThemeConfig>({
    lang: 'zh-cn',
    title: '酷设计',
    description: '网站描述...',
    base: '/',
    // ...
})
```

### 功能开关（website 节点）

```typescript
themeConfig: {
    website: {
        title: '酷设计',                  // 首页大图标题
        description: '设计学习交流平台',    // 首页大图描述
        copyadd: true,                    // 复制内容追加版权
        perpage: 32,                      // 列表每页数量
        showHeroBanner: true,             // 显示首页全屏大图
        homeBanner: false,                // 显示首页小轮播
        bannerHeight: 200,                // 小轮播高度
        showWelcome: false,               // 显示欢迎弹窗
        showSnow: false,                  // 雪花特效
        showUserCard: false,              // 列表博主名片
        cardPosition: 3,                  // 名片位置
        cardMusic: true,                  // 名片音乐播放器
        cardCoffee: true,                 // 名片打赏二维码
        showLantern: false,               // 灯笼挂件
        lanternText: ['新', '年'],        // 灯笼文字
        showFirework: false,              // 侧栏烟花
        fireworkTitle: '🧨烟花许愿🧨',     // 烟花标题
        fireworkWords: [...],             // 烟花关键词数组
        showFooter: true,                 // 底部信息
        showArticleModal: true,           // 文章卡片弹窗预览
        icpRecordCode: '酷设计',          // 备案号
        publicSecurityRecordCode: 'kusheji.com',
        link: 'https://kusheji.com/'
    }
}
```

### 导航菜单

```typescript
themeConfig: {
    nav: [
        { text: '素材站', link: 'https://sucai.kusheji.com' },
        { text: '网址导航', link: 'https://dsxdh.com' },
        { text: '专辑', link: '/pages/album' },
        { text: '搜索', link: '/pages/search' }
    ]
}
```

### 音乐播放器

```typescript
themeConfig: {
    music: [
        {
            "id": 1,
            "title": "歌曲名",
            "author": "歌手",
            "url": "音频地址",
            "pic": "封面图片",
            "lrc": "歌词"
        }
    ]
}
```

### 首页大图 / 轮播 Banner

```typescript
// 首页全屏大图（showHeroBanner: 'custom' 时生效）
heroBgImage: [
    { link: '跳转链接', image: '图片地址', title: '图片标题' }
],

// 首页小轮播（homeBanner: true 时生效）
banner: [
    { link: '跳转链接', image: '图片地址', title: '图片标题' }
],
```

---

## 🧰 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| [VitePress](https://vitepress.dev) | 1.6.x | 静态站点生成器 |
| [Vue 3](https://vuejs.org) | 3.x | 前端框架 |
| [TypeScript](https://www.typescriptlang.org) | 5.x | 类型安全 |
| [Pinia](https://pinia.vuejs.org) | 3.x | 状态管理 |
| [Swiper](https://swiperjs.com) | 12.x | 轮播图组件 |
| [Pagefind](https://pagefind.app) | 1.x | 静态搜索 |
| [vitepress-plugin-pagefind](https://www.npmjs.com/package/vitepress-plugin-pagefind) | 0.4.x | 搜索插件 |
| [feed](https://www.npmjs.com/package/feed) | 5.x | RSS 生成 |
| [Floating Vue](https://floating-vue.starpad.dev) | 5.x | Tooltip 悬浮提示 |
| [vue3-toastify](https://vue3-toastify.js-bridge.com) | 0.2.x | Toast 提示 |
| [dayjs](https://day.js.org) | 1.x | 日期处理 |
| [markdown-it-custom-attrs](https://www.npmjs.com/package/markdown-it-custom-attrs) | 1.x | Markdown 属性扩展 |
| [ESLint](https://eslint.org) | 8.x | 代码检查 |
| [Prettier](https://prettier.io) | 3.x | 代码格式化 |

---

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支：`git checkout -b feature/AmazingFeature`
3. 提交更改：`git commit -m 'Add some AmazingFeature'`
4. 推送分支：`git push origin feature/AmazingFeature`
5. 提交 Pull Request

提交前请确保代码通过 ESLint 和 Prettier 检查。

---

## 📄 开源协议

本项目采用 [MIT 协议](LICENSE) 开源。

---

## 👤 作者信息

- **作者**：乔同学
- **官网**：[酷设计](https://kusheji.com)
- **GitHub**：[@qiaodamao](https://github.com/qiaodamao)
- **素材站**：[素材酷设计](https://sucai.kusheji.com)
- **Logo站**：[矢量LOGO下载](https://logo.kusheji.com/)

---

<div align="center">

如果这个项目对你有帮助，欢迎点个 ⭐ Star 支持一下！

Made with ❤️ by 乔同学

</div>
