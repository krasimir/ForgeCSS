import { getUsages } from "./usages.js";
import arbitraryTransformer from "./transformers/arbitrary.js";
import mediaQueryTransformer from "./transformers/mediaQuery.js";
import pseudoClassTransformer from "./transformers/pseudo.js";
import { resolveApplys } from "./inventory.js";
import { toAST } from "./forge-lang/Parser.js";
import { astToRules, rulesToCSS } from "./forge-lang/Compiler.js";
import { getStylesByClassName } from "./inventory.js";

export async function generateOutputCSS(config) {
  const cache = {};
  const usages = getUsages();
  const ast = toAST(
    Object.values(usages).reduce((acc, i) => {
      return acc.concat(i);
    }, [])
  );
  let rules = astToRules(ast, {
    getStylesByClassName,
    cache,
    config
  });
  rules.push(resolveApplys());
  return rulesToCSS(rules.filter(Boolean), config);
  // Object.keys(usages).map((file) => {
  //   Object.keys(usages[file]).forEach(async (label) => {
  //     try {
  //       if (mediaQueryTransformer(config, label, usages[file][label], bucket)) {
  //         return;
  //       } else if (pseudoClassTransformer(label, usages[file][label], bucket)) {
  //         return;
  //       } else if (arbitraryTransformer(label, usages[file][label], bucket)) {
  //         return;
  //       }
  //     } catch (err) {
  //       console.error(
  //         `forgecss: Error generating media query for label "${label}" (found in file ${file.replace(
  //           process.cwd(),
  //           ""
  //         )})`,
  //         err
  //       );
  //     }
  //   });
  // });
  // resolveApplys(bucket);
  // return Object.keys(bucket)
  //   .map((key) => {
  //     if (bucket[key].rules) {
  //       return bucket[key].rules.toString();
  //     }
  //     return bucket[key].toString();
  //   })
  //   .filter(Boolean)
  //   .join("\n");
}

