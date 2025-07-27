export type BuildOptions = {
    /**
     * Path to the entry file for the build process.
     */
    entry?: string;
    /**
     * 开发服务器
     */
    port?: number;

    /**
     * Build mode
     * @default 'development'
     */
    mode?: 'development' | 'production';
}

export type boundlerOptions = {
    /**
     * 每个页面的名称
     * @example：xx/xx/src/pages/home/index.tsx 中的 home
     */
    pageName: string;
    /**
     * 每个页面的目录
     * @example xx/xx/src/pages/home
     */
    pageDir: string;

    buildOptions: BuildOptions;
}