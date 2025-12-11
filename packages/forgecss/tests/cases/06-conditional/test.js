import { minifyCSS, expect } from "../../helpers.js";
import ForgeCSS from "../../../index.js";

const component = `
  import React from "react";
  import { fx } from "forgecss/fx";

  export default function App({ className }: { className?: string }) {
    const flagA = true;
    const flagB = false;

    return (
      <main>
        <p className={fx(\`mt2 [\${flagA}?]:mt1,blue [\${flagB}?]:red\`)}></p>
      </main>
    );
  }`;

const CASES = [
  {
    styles: `
      .red { color: red }
      .blue { color: blue }
      .mt1 { margin-top: 1rem }
      .mt2 { margin-top: 2rem }
    `,
    usage: component,
    expected: ""
  }
];

export default async function test() {
  for (let testCase of CASES) {
    const css = await ForgeCSS().parse({ css: testCase.styles, jsx: testCase.usage });
    // console.log(css);
    if (!expect.toBe(minifyCSS(css), testCase.expected)) {
      return false;
    }
  }
  return true;
}
