import { NODE_TYPE, ALLOWED_PSEUDO_CLASSES } from "./constants.js";

export function compileClassAST(ast, getStylesByClassName) {
  console.log(ast);
  let resultClasses = [];
  let css = {};

  function visitor(node, context = {}) {
    if (Array.isArray(node)) {
      return ast.forEach((n) => visitor(n, context));
    }
    if (node.type === NODE_TYPE.TOKEN && !context.parent) {
      resultClasses.push(node.value);
    } else if (node.type === NODE_TYPE.VARIANT) {
      const nodeClassName = generateClass(node);
      resultClasses.push(nodeClassName);
      if (ALLOWED_PSEUDO_CLASSES.includes(node.selector)){
        const styles = getStylesByClassName(node.payload.value);
        css[`${nodeClassName}:${node.selector}`] = styles;
      }
    }
  }

  visitor(ast);
  return { classValue: resultClasses.join(" "), css };
}

function generateClass(node) {
  if (node.type === NODE_TYPE.VARIANT) {
    return `${node.selector.replace(/[: ]/g, '_')}${generateClass(node.payload)}`;
  } else if (node.type === NODE_TYPE.TOKEN) {
    return `_${node.value}`;
  }
  return '----';
}