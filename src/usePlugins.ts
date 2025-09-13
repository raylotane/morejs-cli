import { boundlerOptions } from "./types";
import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import virtualEntry from "./plugins/rollup-plugin-virtual-entry";
import html from "@rollup/plugin-html";
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import postcss from "rollup-plugin-postcss";
import path from "path";


export default function usePlugins(boundlerOptions: boundlerOptions) {

    const { pageName, pageDir } = boundlerOptions;

    const entryFile = path.resolve(pageDir, "index.tsx");

    const plugins = [
        virtualEntry({
            realEntry: entryFile, // Pass the real entry file to the virtual entry plugin
        }),
        nodeResolve({
            preferBuiltins: false, // For React components, don't prefer built-ins
            browser: true
        }), // 解析 node_modules 中的模块
        postcss({
            extensions: ['.css'],
            extract: false, // 内联到 JS 中
            minimize: boundlerOptions.buildOptions.mode === 'production',
            sourceMap: boundlerOptions.buildOptions.mode === 'development',
            modules: {
                // 启用 CSS 模块
                generateScopedName: '[name]__[local]___[hash:base64:5]',
            },
            autoModules: true, // 自动检测 .module.css 文件
            config: false, // 这里不开启，会报错
        }),
        typescript({
            tsconfig: path.resolve(process.cwd(), "tsconfig.json"),
            jsx: "react", // Use the new JSX transform
            compilerOptions: {
                module: "esnext", // 保持 ES 模块格式给 Rollup 处理
                target: "es5", // 编译目标
                moduleResolution: "node",
                jsx: "react", // Enable new JSX transform
                skipLibCheck: true,
                esModuleInterop: true, // 允许 ES 模块和 CommonJS 互操作
                allowSyntheticDefaultImports: true // 允许合成默认导入
            },
            include: [path.resolve(pageDir, "**", "*.ts"), path.resolve(pageDir, "**", "*.tsx")],
            exclude: ["node_modules", "**/*.spec.ts", "**/*.test.ts", "**/*.spec.tsx", "**/*.test.tsx"],
        }),
        babel({
            babelHelpers: "bundled",
            presets: [
                ["@babel/preset-react", {
                    runtime: "automatic" // Use automatic JSX runtime
                }]
            ],
            extensions: ['.js', '.jsx', '.ts', '.tsx']
        }),
        commonjs({
            include: /node_modules/,
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
            transformMixedEsModules: true,
            requireReturnsDefault: false,
            ignoreDynamicRequires: true, // 忽略动态 require
            dynamicRequireTargets: [
                // 允许动态 require 这些文件模式
                '**/package.json',
                'node_modules/**/*.json'
            ]
        }),
        html({
            title: `${pageName} - My App`,
            fileName: `${pageName}.html`,
            template: ({ attributes, files, meta, publicPath, title }) => {
                const cssLinks = files.css ? files.css.map(({ fileName }) => `<link rel="stylesheet" href="${publicPath}${fileName}">`).join('\n    ') : '';
                return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    ${cssLinks}
  </head>
  <body>
    <div id="root"></div>
    <script
      crossorigin
      src="https://unpkg.com/react@18/umd/react.development.js"
    ></script>
    <script
      crossorigin
      src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"
    ></script>
    <script src="./${pageName}.js"></script>
  </body>
</html>`;
            }
        }),
    ];

    if (boundlerOptions.buildOptions.mode === 'production') {
        // plugins.push(terser()); // Minify the output in production mode
    } else {
        plugins.push(
            serve({
                contentBase: path.resolve(process.cwd(), "dist"),
                port: boundlerOptions.buildOptions.port,
                verbose: false,
            }),
            livereload({
                watch: path.resolve(process.cwd(), "dist"),
                verbose: false,
                delay: 1000,
            })
        );
    }

    return {
        plugins
    };
}