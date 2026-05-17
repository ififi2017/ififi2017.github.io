---
title: 下班倒计时：一个看着时间走的小工具
date: 2026-05-17
updated: 2026-05-17
category: 项目
tags: [Next.js, PWA, i18n, TypeScript]
excerpt: 一个用 Next.js 写的下班倒计时网页。设定上下班时间，看一个圆形进度条把今天剩下的工时一点点磨完。支持 PWA 离线、多语言、动画渐变背景与可选的下班前 15 分钟提醒。
slug: off-work-countdown
---

## 项目地址

源码：[https://github.com/ififi2017/Off-Work-Countdown](https://github.com/ififi2017/Off-Work-Countdown)

在线体验：[https://off.rainif.com/zh-CN](https://off.rainif.com/zh-CN)


![主界面截图](/images/posts/off-work-countdown/hero.jpg)

## 为什么写这个

每天上班最熬人的不是工作本身，而是你不知道还有多久才能下班。盯着系统时钟看不出"还剩多少"，要心算；做日程的 App 又太重，只想要一个开着不打扰、抬眼就能看见的小窗口。

所以做了「下班倒计时」。打开一个网页、设好上下班时间，让一个进度条把今天剩下的工时一点点磨完。

## 主要功能

- **自定义上下班时间**：用下拉选择，不需要点日历
- **实时倒计时**：剩余时间精确到秒
- **可视化进度条**：一眼知道今天过了多少
- **下班前 15 分钟提醒**：可选，到点弹通知
- **动画渐变背景**：可选，纯视觉
- **PWA 离线支持**：装到桌面 / 主屏后断网也能用
- **多语言**：i18n 框架，目前内置中英文，欢迎贡献其他语言
- **响应式**：手机、平板、桌面都能看

![运行中的倒计时](/images/posts/off-work-countdown/running.jpg)


## 技术栈

| 层 | 选型 |
|----|------|
| 框架 | Next.js 14（App Router）|
| 语言 | TypeScript |
| 样式 | Tailwind CSS |
| 动画 | Framer Motion |
| 离线 | next-pwa |
| 国际化 | i18next |

整体偏轻量，没有后端服务，全部计算在浏览器里完成；不依赖账号体系，也不存储任何个人数据。

## 本地跑起来

```bash
git clone https://github.com/ififi2017/Off-Work-Countdown.git
cd Off-Work-Countdown
npm install
npm run dev
```

打开 `http://localhost:3000` 即可。生产构建用 `npm run build && npm start`。

## 贡献多语言

如果想加你熟悉的语言，复制 `public/locales/zh-CN/` 目录改文件名，把里面的字符串翻译一遍，提一个 PR 就行。需要翻译的部分包括：

- UI 文案（按钮、提示、状态）
- SEO 元数据（页面 title、description、og:* 之类）

文件结构很扁平，照着英文版翻就好。

## 后话

这个项目最初只是想试试 v0.dev + Framer Motion + Next.js App Router 的组合，写完发现自己每天都在用，就顺手部署成了公开服务。

如果你也有"想要一个简单到不能再简单"的小工具念头，建议直接动手写——比逛 App Store 找现成的快。
