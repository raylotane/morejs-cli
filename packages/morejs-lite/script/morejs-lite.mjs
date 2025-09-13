#!/usr/bin/env node

import * as rollup from "rollup";
import { nodeResolve } from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-node-resolve"
import typescript from "@rollup/plugin-typescript"
import { babel } from "@rollup/plugin-babel";

import html from "@rollup/plugin-html";
import postcss from "rollup-plugin-postcss";
import virtualEntry from "./rollup-plugin-virtual-entry.mjs";
import server from 'rollup-plugin-serve';
import livereload from "rollup-plugin-livereload";
import path from "path";
import fs from "fs";


const pwd = process.cwd();

const pages = path.join(pwd, "src", "pages");

const build = async (input, output, entryName, watch = false) => {
    const inputOptions = {
        external: ['react', 'react-dom'],
        input: 'virtual:entry',
        plugins: [
            virtualEntry({ realEntry: input }),
            postcss({
                extensions: ['.css', '.less', '.scss', '.sass'],
                use: ['less'],
                extract: true,
                minimize: false,
                sourceMap: true,
                autoModules: true,
            }),
            nodeResolve({
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
            }),
            commonjs(),
            typescript({
                tsconfig: path.join(pwd, "tsconfig.json"),
            }),
            babel({
                babelHelpers: "bundled",
                presets: ["@babel/preset-react"],
            }),
            html({
                title: `${entryName} - My App`,
                fileName: `${entryName}.html`,
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
    <script src="./${entryName}.js"></script>
  </body>
</html>`;
                }
            }),
            server({
                // open: true,
                contentBase: path.join(pwd, "dist"),
                port: 3000,
                historyApiFallback: true,
            }),
            livereload({
                watch: path.join(pwd, "dist"),
                verbose: true,
                delay: 100,
            }),
        ]
    };

    const outputOptions = {
        dir: path.dirname(output),
        entryFileNames: path.basename(output),
        format: 'iife',
        sourcemap: true,
        globals: {
            react: 'React',
            'react-dom': 'ReactDOM'
        }
    };

    if (watch) {
        const watchOptions = {
            ...inputOptions,
            output: outputOptions,
        };

        const watcher = rollup.watch(watchOptions);

        watcher.on('event', event => {
            switch (event.code) {
                case 'START':
                    console.log(`🔨 Building ${entryName}...`);
                    break;
                case 'BUNDLE_START':
                    console.log(`📦 Bundling ${entryName}...`);
                    break;
                case 'BUNDLE_END':
                    console.log(`✅ ${entryName} built in ${event.duration}ms`);
                    break;
                case 'END':
                    console.log(`🎉 ${entryName} watch ready`);
                    break;
                case 'ERROR':
                    console.error(`❌ Error in ${entryName}:`, event.error);
                    break;
            }
        });

        return watcher;
    } else {
        const bundle = await rollup.rollup(inputOptions);
        await bundle.write(outputOptions);
        return bundle;
    }
}

const buildAll = async (watchMode = true) => {
    // 清理输出目录
    const distDir = path.join(pwd, "dist");
    if (fs.existsSync(distDir)) {
        fs.rmSync(distDir, { recursive: true, force: true });
    }

    const entries = fs.readdirSync(pages);
    const watchers = [];

    for (const entry of entries) {
        const input = path.join(pages, path.join(entry, "index.tsx"));
        const output = path.join(pwd, "dist", `${entry}.js`);

        if (watchMode) {
            const watcher = await build(input, output, entry, true);
            watchers.push(watcher);
        } else {
            await build(input, output, entry, false);
        }
    }

    if (watchMode) {
        console.log('\n👀 Watching for file changes...');
        console.log('Press Ctrl+C to stop watching\n');

        // 处理进程退出
        process.on('SIGINT', () => {
            console.log('\n🛑 Stopping watchers...');
            watchers.forEach(watcher => watcher.close());
            process.exit(0);
        });
    } else {
        console.log('\n🎉 Build completed!');
    }
}

// 检查命令行参数
const args = process.argv.slice(2);
const watchMode = args.includes('--watch') || args.includes('-w');

buildAll(true);

