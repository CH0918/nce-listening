# NCE Listening - 新概念英语听力学习应用

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-06B6D4)

NCE Listening 是一个现代化的新概念英语听力学习应用，专注于提供优质的听力学习体验。该应用采用最新的 Web 技术构建，提供流畅的用户界面和丰富的学习功能。

## ✨ 特性

- 🎯 **精准的音频同步** - 使用 Howler.js 实现精确的音频控制和时间同步
- 📝 **实时字幕显示** - 支持 LRC 歌词格式，实现音频与文本的精确同步
- 🎨 **现代化 UI** - 采用 TailwindCSS 和 shadcn/ui 构建的美观界面
  - 磨砂玻璃效果设计
  - 平滑过渡动画
  - 渐变背景和阴影效果
- 🔄 **多种学习模式**
  - 中英对照学习
  - 盲听练习
  - 课文循环播放
  - 单句循环播放
- 🎚️ **个性化学习设置**
  - 播放速度调节 (0.5x - 2.0x)
  - 字体大小调整
  - 循环模式自定义
- 📱 **响应式设计** - 完美支持移动端和桌面端
- 🚀 **高性能** - 基于 Next.js 15 构建，支持 App Router 和 Turbopack

## 🛠️ 技术栈

- **框架**: Next.js 15, React 19
- **语言**: TypeScript 5
- **样式**: TailwindCSS 3
- **UI 组件**: shadcn/ui, Radix UI
- **音频处理**: Howler.js
- **状态管理**: Zustand
- **动画**: Framer Motion
- **通知**: Sonner
- **图标**: Lucide React

## 🚀 快速开始

### 前置要求

- Node.js 18.0 或更高版本
- pnpm 8.0 或更高版本（推荐）

### 安装

1. 克隆仓库
```bash
git clone git@github.com:CH0918/nce-listening.git
cd nce-listening
```

2. 安装依赖
```bash
pnpm install
```

3. 启动开发服务器
```bash
pnpm dev
```

现在你可以访问 http://localhost:3000 查看应用。

## 📦 项目结构

```
nce-listening/
├── src/
│   ├── app/               # Next.js App Router 目录
│   │   ├── books/        # 书籍相关页面
│   │   ├── lesson/       # 课程播放页面
│   │   ├── profile/      # 用户档案页面
│   │   └── training/     # 训练模式页面
│   ├── components/       # 可复用组件
│   │   ├── ui/          # UI 基础组件
│   │   └── ...          # 其他业务组件
│   ├── hooks/           # React Hooks
│   ├── lib/             # 工具函数和通用逻辑
│   ├── types/           # TypeScript 类型定义
│   └── assets/          # 项目资源文件
├── public/              # 静态资源
└── ...                  # 配置文件
```

> 主要目录说明：
- `src/app/`: Next.js App Router 目录，包含所有页面路由
  - `books/`: 书籍相关页面，包含不同级别的教材列表
  - `lesson/`: 课程播放页面，包含音频播放器和课文显示
  - `profile/`: 用户档案页面，包含用户信息、学习记录等
  - `training/`: 训练模式页面，包含各种学习模式
- `src/components/`: 可复用组件目录
  - `ui/`: UI 基础组件，如按钮、输入框等
  - `...`: 其他业务组件，如课程卡片、播放器等
- `src/hooks/`: React Hooks 目录，包含自定义 hooks
- `src/lib/`: 工具函数和通用逻辑
- `src/types/`: TypeScript 类型定义
- `src/assets/`: 项目资源文件
- `public/`: 静态资源目录，包含图片、音频等
- 配置文件: 包含各种项目配置文件，如 next.config.js、tailwind.config.js 等

## 🎯 主要功能

### 播放器增强功能
- 精确的音频控制与文本同步
- 实时字幕高亮显示
- 平滑的进度条拖拽控制
- 多级播放速度调节
- 优化的加载状态处理

### 学习模式
- 中英对照学习模式
- 盲听练习模式
- 课文循环播放
- 单句循环播放模式

### 用户体验优化
- 磨砂玻璃效果设计
- 平滑过渡动画
- 渐变背景和阴影效果
- 响应式布局适配多种设备
- 优化的加载状态提示

## 🖼️ 最新 UI 改进

最近的 UI 更新专注于提升用户视觉体验和交互流畅度：

- **磨砂玻璃效果** - 顶部导航栏和控制面板采用现代磨砂玻璃效果
- **动态过渡动画** - 添加了平滑的状态过渡和悬停效果
- **优化的播放控制** - 重新设计的进度条和播放控制按钮
- **改进的加载状态** - 专业的加载指示器，提供更好的用户反馈
- **字幕高亮效果** - 当前播放句子的增强视觉突出显示
- **布局优化** - 更合理的间距和对齐，提高可读性

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 📝 开发计划

- [x] 优化 UI 设计和用户体验
- [x] 实现单句循环播放功能
- [x] 添加字体大小调整功能
- [x] 优化加载状态处理
- [ ] 添加用户认证系统
- [ ] 实现学习进度追踪
- [ ] 添加生词本功能
- [ ] 支持自定义课程
- [ ] 添加学习数据统计
- [ ] 支持社区讨论功能

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 👥 作者

- [@CH0918](https://github.com/CH0918)

## 🙏 致谢

感谢以下开源项目：

- [Next.js](https://nextjs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Howler.js](https://howlerjs.com/)
- [Framer Motion](https://www.framer.com/motion/)
