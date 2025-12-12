import postcss from "postcss";

import { normalizeLabel } from "../../client/fx.js";
import { setDeclarations } from "../helpers.js";

export default function arbitraryTransformer(label, classes, bucket) {
  if (label.startsWith("[") && label.endsWith("]")) {
    let arbitrarySelector = label.slice(1, -1).trim();
    if (['', 'true'].includes(arbitrarySelector)) {
      return true;
    }
    classes.forEach((cls) => {
      const I = normalizeLabel(label) + "--" + cls;
      const selector = evaluateArbitrary(arbitrarySelector, I);
      const root = postcss.root();
      if (bucket[I]) {
        return;
      }
      const rule = postcss.rule({ selector });
      setDeclarations(cls, rule);
      root.append(rule);
      bucket[I] = root;
    });
    return true;
  }
  return false;
}

function evaluateArbitrary(label, I) {
  label = label.replace(/[&]/g, `.${I}`);
  return label;
}