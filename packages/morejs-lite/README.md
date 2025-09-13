# morejs-lite

一个基于 Rollup 打包的 React 多页面前端项目模板，支持 TypeScript、Less、CSS Modules、热更新和本地开发服务器。

## 目录结构

```
.
├── package.json
├── README.md
├── tsconfig.json
├── .vscode/
│   └── settings.json
├── script/
│   ├── morejs-lite.js
│   └── rollup-plugin-virtual-entry.js
├── src/
│   ├── pages/
│   │   ├── about/
│   │   │   ├── Header.tsx
│   │   │   ├── index.less
│   │   │   ├── index.module.less
│   │   │   └── index.tsx
│   │   └── home/
│   │       ├── index.less
│   │       └── index.tsx
│   └── types/
│       └── modules.d.ts
```

## 特性

- 支持 React 18 + TypeScript
- 支持 Less 及 CSS Modules
- 多页面自动打包，自动生成 HTML
- 本地开发服务器，支持热更新
- 代码分离，自动清理输出目录

## 快速开始

### 安装依赖

```sh
npm install
```

### 启动开发服务器

```sh
node script/morejs-lite.js
```

或 link 全局使用

```sh
npm link
morejs-lite
```

默认会监听 `src/pages` 下的所有页面，每个页面会生成对应的 HTML 和 JS 文件，并在 `dist/` 目录下输出。

访问地址（默认端口 3000）：

- [http://localhost:3000/home.html](http://localhost:3000/home.html)
- [http://localhost:3000/about.html](http://localhost:3000/about.html)

### 构建生产包

目前脚本默认以 watch 模式运行，如需构建生产包可自行修改 `script/morejs-lite.js`，将 `buildAll(true)` 改为 `buildAll(false)`。

## 页面开发

每个页面放在 `src/pages/{pageName}/index.tsx`，支持引入 Less/CSS/图片等资源。

示例：

```tsx
import React from "react";
import "./index.less";

export default () => (
  <div className="container">
    <div className="title">Home Page</div>
    <div className="content">Welcome to the home page!</div>
  </div>
);
```

## 类型支持

全局类型声明已在 [`src/types/modules.d.ts`](src/types/modules.d.ts) 提供，支持 Less/CSS/SCSS/SASS 模块导入。

## 自定义配置

- 修改端口：在 [`script/morejs-lite.js`](script/morejs-lite.js) 的 `server` 插件配置中调整 `port`。
- 新增页面：在 `src/pages` 下新建文件夹并添加 `index.tsx` 即可自动识别。

## 依赖

- [React](https://react.dev/)
- [Rollup](https://rollupjs.org/)
- [Less](https://lesscss.org/)
- [rollup-plugin-postcss](https://github.com/egoist/rollup-plugin-postcss)
- [@rollup/plugin-typescript](https://github.com/rollup/plugins/tree/master/packages/typescript)

##