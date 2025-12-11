import { minifyCSS, expect } from "../../helpers.js";
import ForgeCSS from "../../../index.js";

const CASES = [
  {
    styles: `
      .red { color: red }
      .fz2 { font-size: 2rem }
      .mt2 { margin-top: 2rem }
    `,
    usage: `
      <div class="[&:hover]:red"></div>
      <div class="[&:hover]:red,fz2 [&:hover]:mt2"></div>
      <div class="[&:required:disabled]:red,fz2"></div>
    `,
    expected:
      ".__hover_red:hover{color:red}.__hover_fz2:hover{font-size:2rem}.__hover_mt2:hover{margin-top:2rem}.__required_disabled_red:required:disabled{color:red}.__required_disabled_fz2:required:disabled{font-size:2rem}"
  }
];

export default async function test() {
  for (let testCase of CASES) {
    const css = await ForgeCSS().parse({ css: testCase.styles, html: testCase.usage });
    // console.log(css);
    if (!expect.toBe(minifyCSS(css), testCase.expected)) {
      return false;
    }
  }
  return true;
}