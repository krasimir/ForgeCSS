import { minifyCSS, expect } from "../../helpers.js";
import ForgeCSS from '../../../index.js'

const CASES = [
  {
    styles: ".red { color: red }",
    usage: '<div class="hover:red"></div>',
    expected: ".hover_red:hover{color:red}"
  },
  {
    styles: ".red { color: red }",
    usage: '<div class="focus:red"></div>',
    expected: ".focus_red:focus{color:red}"
  }
];

export default async function test() {
  for (let testCase of CASES) {
    const css = await ForgeCSS().parse(testCase.styles, testCase.usage);
    if (!expect.toBe(minifyCSS(css), testCase.expected)) {
      return false;
    }
  }
  return true;
}