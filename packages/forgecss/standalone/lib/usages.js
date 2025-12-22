import { fromHtml } from "hast-util-from-html";
import { visit } from "unist-util-visit";

let USAGES = {};

export async function findUsages(filePath, fileContent = null) {
  try {
    if (USAGES[filePath]) {
      // already processed
      return;
    }
    USAGES[filePath] = [];
    const content = fileContent;

    const ast = fromHtml(content);
    visit(ast, "element", (node) => {
      if (node.properties.className) {
        USAGES[filePath].push(node.properties.className.join(" "));
      }
    });
  } catch (err) {
    console.error(`forgecss: error processing file ${filePath}`, err);
  }
}
export function invalidateUsageCache() {
  USAGES = {};
}
export function getUsages() {
  return USAGES;
}