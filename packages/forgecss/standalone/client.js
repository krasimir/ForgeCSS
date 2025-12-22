import fxFn from "../lib/fx.js";

function forgecss(root) {
  var rootNode = root || document;

  // Query only nodes that actually have "class" attributes
  var nodes = rootNode.querySelectorAll('[class]');

  for (var i = 0; i < nodes.length; i++) {
    var el = nodes[i];
    var original = el.getAttribute('class');
    if (!original) continue;

    var transformed = fxFn(original);

    if (typeof transformed === 'string' && transformed !== original) {
      el.setAttribute('class', transformed);
    }
  }
}

window.fx = fxFn;
window.forgecss = forgecss;

if (document.readyState !== 'loading') {
  forgecss();
} else {
  document.addEventListener('DOMContentLoaded', function () {
    forgecss();
  });
}
window.addEventListener('load', function () {
  forgecss();
});