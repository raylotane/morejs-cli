
import typescript from '@rollup/plugin-typescript';
import resolveNodeModule from "@rollup/plugin-node-resolve";
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';


const LIB_NAME = 'superPoint'

// ---cut-start---
/** @type {import('rollup').RollupOptions} */
// ---cut-end---
export default {
    input: 'src/cli.ts', // 入口文件
    // 指定外部依赖
    // 这些依赖不会被打包到输出文件中，而是通过 require/import 引入
    // 这里需要排除 Node.js 内置模块和一些可能导致问题
    // 的原生模块
    // 以及 Rollup 本身和其他插件
    // 这些依赖会在运行时动态加载
    // 这可以避免打包时的循环依赖问题
    external: [
        // Exclude Node.js built-in modules
        'fs', 'path', 'assert', 'util', 'events', 'buffer', 'stream', 'commander',
        // Exclude problematic native modules
        'fsevents',
        // Exclude rollup itself since it's used dynamically in your code
        'rollup',
        // Exclude other dependencies that should remain external
        '@rollup/plugin-node-resolve',
        '@rollup/plugin-typescript',
        '@rollup/plugin-commonjs',
        '@rollup/plugin-babel',
        '@rollup/plugin-json',
        '@babel/preset-react',
        '@rollup/plugin-html',

        'rollup-plugin-livereload',
        // 'rollup-plugin-serve', // 这个包依赖 Mime.js, 在构建 cli 时可能会导致问题
        // 'rollup-plugin-terser',
        // Note: less, sass, stylus are NOT external - they should be bundled
    ],
    // context: 'window', // Set the context to 'window' for browser compatibility
    output: [
        {
            file: `dist/cli.js`,
            format: 'cjs',
            name: LIB_NAME,
            sourcemap: true,
            banner: '#!/usr/bin/env node', // Add shebang for CLI
        },
    ],
    plugins: [
        typescript({
            tsconfig: './tsconfig.json', // 指定 tsconfig 文件
        }),
        resolveNodeModule({
            preferBuiltins: true, // Prefer Node.js built-ins over npm packages
        }),
        commonjs(),
        json()
    ],
};