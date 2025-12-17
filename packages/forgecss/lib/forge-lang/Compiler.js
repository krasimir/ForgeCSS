import postcss from "postcss";
import { NODE_TYPE, ALLOWED_PSEUDO_CLASSES } from "./constants.js";
import { minifyCSS } from './utils.js'

export function compileAST(ast, { getStylesByClassName, breakpoints }) {
  let classes = [];
  let rules = [];
  console.log(ast);

  for(let node of ast) {
    switch(node.type) {
      case NODE_TYPE.TOKEN:
        classes.push(node.value)
      break;
      case NODE_TYPE.VARIANT:
        const variant = node.selector;
        node.payload.value.split(',').map(c => c.trim()).filter(Boolean).forEach(cls => {
          const selector = `${variant}_${cls}`;
          classes.push(selector);
          if (ALLOWED_PSEUDO_CLASSES.includes(variant)) {
            rules.push(createRule(`${selector}:${variant}`, cls));
          } else if (breakpoints[variant]) {
            const mediaRule = postcss.atRule({
              name: "media",
              params: `all and ${breakpoints[variant]}`
            });
            mediaRule.append(createRule(selector, cls));
            rules.push(mediaRule)
          }
        })
      break;
    }
  }

  return {
    classes,
    rules,
    css: minifyCSS(rules.map((r) => r.toString()).join(""))
  };

  function createRule(selector, pickStylesFrom) {
    pickStylesFrom = pickStylesFrom.split(',').map(c => c.trim()).filter(Boolean);
    const newRule = postcss.rule({ selector: selector });
    pickStylesFrom.forEach((className) => {
      const styles = getStylesByClassName(className);
      styles.forEach((style) => {
        newRule.append({
          prop: style.prop,
          value: style.value,
          important: style.important
        });
      });
    });
    return newRule;
  }
}

function generateClass(node) {
  if (node.type === NODE_TYPE.VARIANT) {
    return `${node.selector.replace(/[: ]/g, '_')}${generateClass(node.payload)}`;
  } else if (node.type === NODE_TYPE.TOKEN) {
    return `_${node.value.replace(/[,]/g, '-')}`;
  }
  return '----';
}