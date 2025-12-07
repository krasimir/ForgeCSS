import fs from "fs";
import path from "path";
import express from "express";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import ForgeCSS from '../../packages/forgecss/index.js';

const ForgeCSSClient = fs.readFileSync(path.join(__dirname, "../../packages/forgecss/dist/forgecss.min.js"), "utf-8");

const PORT = 5203;
const app = express();

ForgeCSS({
  styles: {
    sourceDir: path.join(__dirname, "public")
  },
  ui: {
    sourceDir: path.join(__dirname, "public")
  },
  mapping: {
    queries: {
      desktop: { query: "min-width: 768px" }, // desktop
      mobile: { query: "max-width: 768px" } // mobile
    }
  },
  output: path.join(__dirname, "public/forgecss-output.css")
})
  .parse()
  .then(() => {
    console.log("ForgeCSS parsing completed.");
  });

app.use(express.static("public"));
app.get("/forgecss.min.js", (req, res) => {
  res.type("application/javascript");
  res.send(ForgeCSSClient);
});

app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
});
