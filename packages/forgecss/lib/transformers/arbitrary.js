import postcss from "postcss";

import { normalizeLabel } from "../../client/fx.js";
import { setDeclarations } from "../helpers.js";

export default function arbitraryTransformer(label, selectors, bucket) {
  if (label.startsWith("[") && label.endsWith("]")) {
    const arbitrarySelector = label.slice(1, -1).trim();
    if (arbitrarySelector === '') {
      return true;
    }
    selectors.forEach((selector) => {
      const key = "." + normalizeLabel(label + ":" + selector);
      let transformedSelector = arbitrarySelector.replace(/[&]/g, key);
      const root = postcss.root();
      if (bucket[transformedSelector]) {
        return;
      }
      const rule = postcss.rule({
        selector: transformedSelector
      });
      setDeclarations(selector, rule);
      root.append(rule);
      bucket[transformedSelector] = root;
    });
    return true;
  }
  return false;
}
