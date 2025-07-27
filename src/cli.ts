import { build } from ".";
import { BuildOptions } from "./types";
import { Command } from "commander";

const program = new Command();

program
    .name("morejs-cli")
    .description("A CLI tool for building MoreJS applications")
    .version("1.0.0")
    .option("-p, --port <number>", "Port for the development server", "3000")
    .option("-e, --entry <path>", "Path to the entry file for the build process")
    .option("-m, --mode <mode>", "Build mode (development or production)", "development")
    .parse(process.argv)


const buildOptions: BuildOptions = {
    port: parseInt(program.opts().port, 10),
    entry: program.opts().entry,
    mode: program.opts().mode
};

build(buildOptions);