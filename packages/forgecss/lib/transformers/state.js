import postcss from "postcss";
import { getStylesByClassName } from "../inventory.js";

function stateTransformer(state, selectors, bucket) {
  const root = postcss.root();
  selectors.forEach((selector) => {
    const key = state + "_" + selector;
    if (bucket[key]) {
      // already have that
      return;
    }
    const rule = postcss.rule({ selector: `.${key}:${state}` });
    const decls = getStylesByClassName(selector);
    if (decls.length === 0) {
      console.warn(`forgecss: no styles found for class ".${selector}" used in state class "${state}"`);
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
    bucket[key] = root;
  });
}

const stateTransformers = {
  hover: stateTransformer,
  active: stateTransformer,
  focus: stateTransformer,
  disabled: stateTransformer
};

export default stateTransformers;
