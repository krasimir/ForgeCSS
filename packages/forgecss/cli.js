#!/usr/bin/env node

import fs from 'fs';
import path from "node:path";
import { pathToFileURL } from "node:url";
import { program } from "commander";
import ForgeCSS from './index.js';
import chokidar from "chokidar";

program.option("-c, --config <string>,", "Path to forgecss config file", process.cwd() + "/forgecss.config.js");
program.option("-w, --watch", "Enable watch mode", false);
program.option("-v, --verbose", "Enable watch mode", false);
program.parse();

const options = program.opts();
let config = null;

if (!fs.existsSync(options.config)) {
  throw new Error(`forgecss: Config file not found at ${options.config}. Check the --config option.`);
}

async function loadConfig(configPath) {
  const abs = path.resolve(configPath);
  const fileUrl = pathToFileURL(abs).href;

  const mod = await import(fileUrl);
  return mod.default ?? mod;
}
async function runForgeCSS(lookAtPath = null) {
  if (!config) {
    // The very first run
    config = await loadConfig(options.config);
    if (options.watch) {
      if (!config.source) {
        throw new Error('forgecss: missing "source" in configuration.');
      }
      const watcher = chokidar.watch(config.source, {
        persistent: true,
        ignoreInitial: true,
        ignored: (p, stats) => path.resolve(p) === path.resolve(config.output)
      });
      watcher.on("change", async (filePath) => {
        if (options.verbose) {
          console.log(`forgecss: Detected change in ${filePath}`);
        }
        runForgeCSS(filePath);
      });
      if (options.verbose) {
        console.log("forgecss: Watch mode enabled. Listening for file changes...");
      }
    }
  }
  await ForgeCSS(config).parse(lookAtPath);
  if (options.verbose) {
    console.log(`forgecss: CSS generation at ${config.output} completed.`);
  }
}

runForgeCSS();

