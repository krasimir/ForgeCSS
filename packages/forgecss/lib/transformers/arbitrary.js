import postcss from "postcss";
import { getStylesByClassName } from "../inventory.js";
import { normalizeLabel } from "../../client/fx.js";

export default function arbitraryTransformer(label, selectors, bucket) {
  if (label.startsWith("[") && label.endsWith("]")) {
    const arbitrarySelector = label.slice(1, -1).trim();
    selectors.forEach((selector) => {
      const key = `${normalizeLabel(label)}_${selector}`;
      let transformedSelector = `.${arbitrarySelector.replace(/[&]/g, key)}`;
      if (transformedSelector === '.true?') {
        return;
      }
      const root = postcss.root();
      if (bucket[transformedSelector]) {
        // already have that
        return;
      }
      const rule = postcss.rule({
        selector: transformedSelector
      });
      const decls = getStylesByClassName(selector);
      if (decls.length === 0) {
        console.warn(`forgecss: no styles found for class ".${selector}" used in pseudo class "${label}"`);
        return;
      }
      decls.forEach((d) => {
        rule.append(
          postcss.decl({
            prop: d.prop,
            value: d.value,
            important: d.important
          })
        );
      });
      root.append(rule);
      bucket[transformedSelector] = root;
    });
    return true;
  }
  return false;
}
