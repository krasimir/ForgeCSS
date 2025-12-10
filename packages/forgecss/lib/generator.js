import { getUsages } from "./processor.js";
import mediaQueryTransformer from "./transformers/mediaQuery.js";
import pseudoClassTransformer from "./transformers/pseudo.js";

export async function generateOutputCSS(config) {
  const bucket = {};
  const usages = getUsages();
  Object.keys(usages).map((file) => {
    Object.keys(usages[file]).forEach(async (label) => {
      try {
        if (mediaQueryTransformer(config, label, usages[file][label], bucket)) {
          return;
        } else if (pseudoClassTransformer(label, usages[file][label], bucket)) {
          return;
        }
      } catch (err) {
        console.error(
          `forgecss: Error generating media query for label "${label}" (found in file ${file.replace(
            process.cwd(),
            ""
          )})`,
          err
        );
      }
    });
  });
  return Object.keys(bucket)
    .map((key) => {
      if (bucket[key].rules) {
        return bucket[key].rules.toString();
      }
      return bucket[key].toString();
    })
    .filter(Boolean)
    .join("\n");
}

