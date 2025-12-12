import { minifyCSS, expect } from "../../helpers.js";
import fx from "../../../client/fx.js";
import ForgeCSS from "../../../index.js";

const CASES = [
  {
    styles: `
      .red { color: red }
    `,
    usage: "[&:hover]:red",
    expectedClass: "I-hover--red",
    expectedCSS: ".I-hover--red:hover{color:red}",
    type: "html"
  },
  {
    styles: `
      .red { color: red }
      .fz2 { font-size: 2rem }
      .mt2 { margin-top: 2rem }
    `,
    usage: `[&:hover]:red,fz2 [&:hover]:mt2`,
    expectedClass: "I-hover--red I-hover--fz2 I-hover--mt2",
    expectedCSS:
      ".I-hover--red:hover{color:red}.I-hover--fz2:hover{font-size:2rem}.I-hover--mt2:hover{margin-top:2rem}",
    type: "html"
  },
  {
    styles: `
      .red { color: red }
      .fz2 { font-size: 2rem }
    `,
    usage: `[&:required:disabled]:red,fz2`,
    expectedClass: "I-required-disabled--red I-required-disabled--fz2",
    expectedCSS:
      ".I-required-disabled--red:required:disabled{color:red}.I-required-disabled--fz2:required:disabled{font-size:2rem}",
    type: "html"
  },
  {
    styles: `
      .red { color: red }
    `,
    usage: `[.dark &]:red`,
    expectedClass: "dark-I--red",
    expectedCSS: ".dark .dark-I--red{color:red}",
    type: "html"
  },
  {
    styles: `
      .red { color: red }
    `,
    usage: "[true]:red",
    expectedClass: "red",
    expectedCSS: "",
    type: "jsx"
  }
];

export default async function test() {
  for (let testCase of CASES) {
    const css = await ForgeCSS().parse({
      css: testCase.styles,
      [testCase.type || "html"]:
        testCase.type === "html"
          ? `<div class="${testCase.usage}"></div>`
          : `function Component() { return <div className={fx("${testCase.usage}")}></div> }`
    });
    if (!expect.toBe(fx(testCase.usage), testCase.expectedClass)) {
      return false;
    }
    if (!expect.toBe(minifyCSS(css), testCase.expectedCSS)) {
      return false;
    }
  }
  return true;
}