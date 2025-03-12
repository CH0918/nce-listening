# NCE Listening - 新概念英语听力学习应用

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-06B6D4)

NCE Listening 是一个现代化的新概念英语听力学习应用，专注于提供优质的听力学习体验。该应用采用最新的 Web 技术构建，提供流畅的用户界面和丰富的学习功能。

## ✨ 特性

- 🎯 **精准的音频同步** - 使用 Howler.js 实现精确的音频控制和时间同步
- 📝 **实时字幕显示** - 支持 LRC 歌词格式，实现音频与文本的精确同步
- 🎨 **现代化 UI** - 采用 TailwindCSS 和 shadcn/ui 构建的美观界面
- 🔄 **多种学习模式**
  - 中英对照学习
  - 盲听练习
  - 课文循环播放
- 📱 **响应式设计** - 完美支持移动端和桌面端
- 🚀 **高性能** - 基于 Next.js 14 构建，支持 App Router 和 Server Components

## 🛠️ 技术栈

- **框架**: Next.js 14, React 19
- **语言**: TypeScript
- **样式**: TailwindCSS
- **UI 组件**: shadcn/ui, Radix UI
- **音频处理**: Howler.js
- **状态管理**: Zustand
- **工具库**: lucide-react (图标)

## 🚀 快速开始

### 前置要求

- Node.js 18.0 或更高版本
- pnpm 8.0 或更高版本（推荐）

### 安装

1. 克隆仓库
\`\`\`bash
git clone git@github.com:CH0918/nce-listening.git
cd nce-listening
\`\`\`

2. 安装依赖
\`\`\`bash
pnpm install
\`\`\`

3. 启动开发服务器
\`\`\`bash
pnpm dev
\`\`\`

现在你可以访问 http://localhost:3000 查看应用。

## 📦 项目结构

```
nce-listening/
├── src/
│   ├── app/               # Next.js App Router 目录
│   │   ├── lessons/      # 课程相关页面
│   │   ├── profile/      # 用户档案页面
│   │   └── training/     # 训练模式页面
│   ├── components/       # 可复用组件
│   │   ├── ui/          # UI 基础组件
│   │   └── ...          # 其他业务组件
│   └── lib/             # 工具函数和通用逻辑
├── public/              # 静态资源
└── ...                  # 配置文件
```

> 主要目录说明：
- `src/app/`: Next.js App Router 目录，包含所有页面路由
  - `lessons/`: 课程相关页面，包含课程列表、课程详情等
  - `profile/`: 用户档案页面，包含用户信息、学习记录等
  - `training/`: 训练模式页面，包含各种学习模式
- `src/components/`: 可复用组件目录
  - `ui/`: UI 基础组件，如按钮、输入框等
  - `...`: 其他业务组件，如课程卡片、播放器等
- `src/lib/`: 工具函数和通用逻辑
- `public/`: 静态资源目录，包含图片、音频等
- 配置文件: 包含各种项目配置文件，如 next.config.js、tailwind.config.js 等

## 🎯 主要功能

### 课程播放器
- 精确的音频控制
- 实时字幕显示
- 进度条拖拽控制
- 播放速度调节

### 学习模式
- 中英对照学习模式
- 盲听练习模式
- 课文循环播放

### 用户体验
- 响应式设计
- 流畅的动画效果
- 直观的操作界面

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建你的特性分支 (\`git checkout -b feature/AmazingFeature\`)
3. 提交你的更改 (\`git commit -m 'Add some AmazingFeature'\`)
4. 推送到分支 (\`git push origin feature/AmazingFeature\`)
5. 开启一个 Pull Request

## 📝 开发计划

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
