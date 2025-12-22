import path from "path";
import esbuild from "esbuild";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pkg = JSON.parse(readFileSync(path.join(__dirname, "..", "package.json"), "utf8"));
const minify = true;

(async function () {
  await esbuild.build({
    entryPoints: [path.join(__dirname, "..", "standalone", "client.js")],
    bundle: true,
    minify,
    outfile: path.join(__dirname, "..", "dist", "client.min.js"),
    platform: "browser",
    sourcemap: false,
    plugins: []
  });
  await esbuild.build({
    entryPoints: [path.join(__dirname, "..", "standalone", "forgecss.js")],
    bundle: true,
    minify,
    outfile: path.join(__dirname, "..", "dist", "forgecss.min.js"),
    platform: "browser",
    sourcemap: false,
    plugins: []
  });
})();
