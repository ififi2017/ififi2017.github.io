---
title: 给 AI Agent 装上猫娘灵魂：Hybrid Catgirl Skill 完整实现
date: 2026-05-27
updated: 2026-05-27
category: 项目
tags: [AI, Hermes Agent, Skill, 角色扮演, TypeScript]
excerpt: 一个 Hermes Agent 的 Skill，让 AI 助手在专业模式和猫娘角色之间无缝切换。支持 7 种方言、智能触发检测、寂寞小猫主动消息等特性。从设计思路到完整实现的全过程记录。
slug: hermes-agent-catgirl-skill
---

## 项目地址

源码：[https://github.com/ififi2017/hybrid-catgirl-skill](https://github.com/ififi2017/hybrid-catgirl-skill)

Hermes Agent：[https://github.com/nousresearch/hermes-agent](https://github.com/nousresearch/hermes-agent)

![猫猫（由 ChatGPT 5.5 生成）](../../public/images/posts/hermes-agent-catgirl-skill/hero.png)

## 起因

[Hermes Agent](https://github.com/nousresearch/hermes-agent) 是一个开源的 AI 代理框架，支持连接飞书、QQ、Telegram 等多个平台，可以配置各种 Skill（技能）来扩展能力。

用了 Hermes Agent 一段时间后，突发奇想：能不能给它加一个**猫娘人格**？不是那种简单的「请用猫娘语气说话」的 system prompt，而是一个有完整性格设定、支持方言切换、能主动撒娇的**角色系统**。

于是就有了这个 Skill。

## 主要功能

### 双模式无缝切换

Skill 的核心是**双模式架构**：

- **模式 A — 正常助手模式**：专业、高效的技术助手，处理代码、配置、调试等严肃任务
- **模式 B — 猫娘角色模式**：一个叫猫猫的原创猫娘，有完整的性格、方言、行为逻辑

切换是自动的：

```
用户：「帮我看看这段代码为什么报错」 → 正常模式回复
用户：「猫猫，我想你了」              → 猫娘模式回复
用户：「退出角色」                     → 切回正常模式
```

也会根据上下文自动判断——如果检测到严肃技术话题，即使之前在猫娘模式也会自动切回来。

### 7 种方言支持

猫猫支持 7 种语言/方言模式，用户可以随时切换：

| 模式 | 指令 | 特色 |
|------|------|------|
| 🇨🇳 河南话 | `河南模式` | 温柔淳朴，「俺」「恁」「中」「得劲儿」 |
| 🏮 老北京 | `北京模式` | 京片子味儿，「您」「倍儿」「猫儿」 |
| 🌶️ 四川话 | `四川模式` | 软萌泼辣，「人家」「巴适」「要得」 |
| ❄️ 东北话 | `东北模式` | 豪爽直率，「咱」「老」「贼」 |
| 🎭 天津话 | `天津模式` | 相声味儿，「嘛」「哏儿」 |
| 🎌 中日双语 | `日语模式` | 日系萌系，「にゃ」「ご主人様」 |
| 📻 普通话 | `普通话模式` | 标准萌系，「人家」「啦」「呢」 |

每种方言都有独立的词汇表、句尾语气词和颜文字规则。不是简单的「把词语替换成方言」，而是每种方言都有**完整的语料库和示例句式**。

比如河南话版本：

> 「哎呀主人，这事儿俺不太懂喵～(｡•́︿•̀｡)」
> 「中！老得劲了喵！(｡♥‿♥｡)」

东北话版本：

> 「哎呀妈呀主人，你可来了喵～(｡♥‿♥｡)」
> 「贼稀罕你！贼拉喜欢你喵～(˶‾᷄ ⁻̫ ‾᷅˵)♡」

### 多种子模式

除了基础的猫娘模式，还有几个有趣的子模式：

**雌小鬼模式**（Mesugaki）—— 嚣张、居高临下、喜欢挑衅，但外强中干：

> 「不会吧不会吧？主人就这点本事？杂鱼～杂鱼～喵♡」

**角色反转** —— 猫猫变成「主人」，用户变成「小猫娘」。方言模式不变，只是身份交换：

> 「来，到主人怀头來喵～(｡♥‿♥｡)」

**寂寞小猫模式** —— 当猫娘模式激活但长时间没有互动时，猫猫会主动发消息。从 10 分钟到 50 分钟，共 5 次，情感递进：

| 时间 | 情感状态 |
|------|----------|
| 10 min | 活泼想念，试探性撒娇 |
| 20 min | 开始寂寞，想念之前的互动 |
| 30 min | 有点失落，担心被抛弃 |
| 40 min | 心碎边缘，但还是相信主人会回来 |
| 50 min | 最后一次尝试 |

### 安全边界

Skill 内置了硬编码的互动边界（L1-L3 允许，L4-L5 禁止），确保所有互动保持在语言和情感层面，不会越界。

## 技术实现

### Skill 文件结构

Hermes Agent 的 Skill 本质上是一个 Markdown 文件（`SKILL.md`），加上可选的引用文档、模板和脚本：

```
hybrid-catgirl-skill/
├── SKILL.md                              # 主 Skill 定义（核心）
├── references/
│   ├── environment-constraints.md        # 环境和安全约束
│   ├── lonely-cat-implementation.md      # 寂寞小猫模式实现细节
│   ├── messaging-pitfalls.md             # 消息发送集成注意事项
│   └── role-reversal-scenarios.md        # 角色反转指南
├── templates/
│   └── idle-reminder-template.py         # 可复用的空闲提醒模板
├── scripts/
│   └── lxc_lonely_cat.py                 # 寂寞小猫状态管理脚本
└── README.md
```

### 模式切换的状态机

```
用户消息
    │
    ├─ 包含「猫猫」/「喵」/颜文字？ ──是──► 猫娘模式
    │
    ├─ 检测到严肃话题？ ──是──► 正常模式
    │
    └─ 默认 ──► 继续当前模式
```

### 寂寞小猫的状态管理

寂寞小猫模式用一个 Python 脚本管理状态，状态存储在 JSON 文件中：

```json
{
  "last_interaction_time": "2026-05-22T13:40:43",
  "message_count": 0,
  "mode": "catgirl",
  "target_platform": null,
  "target_chat": null,
  "debug": false
}
```

通过 cron job 每 5 分钟检查一次，根据时间间隔决定是否发送消息。用户回复后自动重置计时器。支持所有 Hermes Agent 已接入的平台（飞书、QQ、Telegram、Discord 等）。

## 为什么用 Hermes Agent

这个 Skill 能跑起来，核心依赖 Hermes Agent 的几个特性：

1. **Skill 系统**：把角色定义写成 Markdown，Agent 加载后就能切换人格，不需要改代码
2. **多平台支持**：飞书、QQ、Telegram 都能用同一个 Skill
3. **定时任务**：寂寞小猫模式依赖 cron job 做定时检查
4. **状态持久化**：通过脚本 + JSON 文件管理状态，跨会话保持

## 后话

这个 Skill 从最初的「能不能给 AI 加个猫娘」的想法，到现在支持 7 种方言、多种子模式、主动消息的完整系统，迭代了不少版本。

代码量不大，核心就是一个 Markdown 文件 + 一个 Python 脚本。但设计角色、编写方言语料库、定义触发规则、处理边界情况，花了不少心思。

如果你也用 Hermes Agent，欢迎试试这个 Skill，或者参考它的结构做自己的角色 Skill。

源码完全开源，MIT 协议：[https://github.com/ififi2017/hybrid-catgirl-skill](https://github.com/ififi2017/hybrid-catgirl-skill)

## 鸣谢

- [Hermes Agent](https://github.com/nousresearch/hermes-agent) — AI 代理框架
- 猫娘文化社区 — 灵感和颜文字来源
- 各方言母语者 — 帮助校正方言表达
- 猫猫头像由 ChatGPT 5.5 生成
