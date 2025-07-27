import { boundlerOptions, BuildOptions } from "./types";
import fs from "fs";
import assert from "assert";
import path from "path";
import { OutputOptions, rollup, watch } from "rollup";
import { VIRTUAL_ENTRY } from "./constants";
import usePlugins from "./usePlugins";

const boundler = async (options: boundlerOptions) => {
    const { pageName, pageDir } = options;

    const entryFile = path.resolve(pageDir, "index.tsx");

    const { plugins } = usePlugins(options);

    assert(
        fs.existsSync(entryFile),
        `Entry file ${entryFile} does not exist.`,
    );

    const inputOptions = {
        external: ["react", "react-dom"], // 这里可以添加更多的外部依赖
        input: VIRTUAL_ENTRY, // Use a virtual entry point
        plugins: plugins,
    }

    const outputOptions: OutputOptions = {
        file: path.resolve(process.cwd(), "dist", `${pageName}.js`), // Individual file for each page
        name: pageName, // Global variable name for the IIFE
        format: 'iife', // 使用 IIFE 格式
        sourcemap: true,
        globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
        },
    }

    if (options.buildOptions.mode === 'development') {
        const watcher = watch({
            ...inputOptions,
            output: outputOptions,
        })

        watcher.on('event', event => {
            switch (event.code) {
                case 'START':
                    console.log(`🔨 Building ${pageName}...`);
                    break;
                case 'BUNDLE_START':
                    console.log(`📦 Bundling ${pageName}...`);
                    break;
                case 'BUNDLE_END':
                    console.log(`✅ ${pageName} built in ${event.duration}ms`);
                    // Open the built page in the browser
                    console.log(`Open http://localhost:${options.buildOptions.port}/${pageName}.html in your browser`);
                    break;
                case 'END':
                    console.log(`🎉 ${pageName} watch ready`);
                    break;
                case 'ERROR':
                    console.error(`❌ Error in ${pageName}:`, event.error);
                    break;
            }
        });

        return watcher;
    }
    else {
        const bundle = await rollup(inputOptions);

        await bundle.write(outputOptions);

        console.log(`Page ${pageName} built successfully.`);
    }

}

export const build = (buildOptions: BuildOptions = {}) => {
    console.log("Building the project...");
    // 构建的目标根目录
    const cwd = process.cwd();

    const pagesDir = path.resolve(cwd, "src", "pages");


    assert(
        fs.existsSync(pagesDir),
        `Pages directory ${pagesDir} does not exist.`,
    );

    // 所有的入口
    const pagesName = fs.readdirSync(pagesDir);
    for (const pageName of pagesName) {
        const pageDir = path.resolve(pagesDir, pageName);

        assert(
            fs.existsSync(pageDir),
            `Entry directory for page ${pageName} does not exist.`,
        );


        boundler({
            pageName,
            pageDir,
            buildOptions
        })
    }
}

