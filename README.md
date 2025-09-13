# morejs-cli

`morejs-cli` 是一个基于 Rollup 的 React 多页面应用（MPA）构建工具，支持 TypeScript、CSS Modules、PostCSS 等现代前端特性。它通过命令行工具快速启动和构建多页面项目，适合中大型 React 项目开发。

## 特性

- 支持多页面（MPA）结构
- 内置 TypeScript、CSS Modules、PostCSS 支持
- 基于 Rollup，插件灵活可扩展
- 一键开发/构建，零配置上手

## 安装

> 当前未发布到 npm，请使用 `npm link` 方式本地全局安装：

```bash
git clone <本仓库地址>
cd morejs-cli
npm install
npm link
```

这样即可在全局使用 `morejs-cli` 命令。

如已发布 npm 包，可用以下方式安装：

```bash
npm install -g morejs-cli
```

或在项目中作为 devDependency 安装：

```bash
npm install --save-dev morejs-cli
```

## CLI 参数

- `--entry` 入口页面目录
- `--port` 开发服务器端口（默认 3000）
- `--mode` 构建模式（development 或 production，默认 development）

## 示例项目

本仓库下 `example/morejs-demo` 提供了完整的多页面 React 示例，可参考其目录结构和用法。

本仓库下 `packages/morejs-lite` 提供了一个轻量级的 React 多页面脚手架，适合快速了解和使用 `morejs-cli`

---

如需自定义插件或扩展构建流程，可参考 `src/usePlugins.ts` 进行二次开发。
