import { parseClassValue } from "../../../lib/forge-lang/Parser.js";
import { compileAST } from "../../../lib/forge-lang/Compiler.js";
import { invalidateInvetory } from "../../../lib/inventory.js";

const mockGetStyleByClassName = (_) => [{ prop: "foo", value: "bar", important: false }];

export default function test() {
  const parserCases = [
    {
      input: 'btn primary hover:red',
      expected: [
        { type: 'token', value: 'btn' },
        { type: 'token', value: 'primary' },
        {
          type: "variant",
          selector: "hover",
          payload: {
            type: "token",
            value: "red"
          }
        }
      ]
    },
    {
      input: 'text [.dark &]:text-white mt1',
      expected: [
        { type: 'token', value: 'text' },
        {
          type: 'variant',
          selector: '.dark &',
          payload: { type: 'token', value: 'text-white' }
        },
        { type: 'token', value: 'mt1' }
      ]
    },
    {
      input: 'foo layout(px4 rounded)',
      expected: [
        {
          type: "token",
          value: "foo"
        },
        {
          type: "call",
          name: "layout",
          args: [
            {
              type: "token",
              value: "px4"
            },
            {
              type: "token",
              value: "rounded"
            }
          ]
        }
      ]
    },
    {
      input: `
        btn
        text(text-sm font-semibold)
        disabled:opacity-50
        desktop:layout(px6 py3)
        [.dark &[type='password']]:bg-black
        [&:has(.desc[title="a[b] c"])]:text(underline)
        theme(
          [.dark &]:text(text-white),
          hover:layout(bg-blue-700),
        )
      `,
      expected: [
        {
          "type": "token",
          "value": "btn"
        },
        {
          "type": "call",
          "name": "text",
          "args": [
            {
              "type": "token",
              "value": "text-sm"
            },
            {
              "type": "token",
              "value": "font-semibold"
            }
          ]
        },
        {
          "type": "variant",
          "selector": "disabled",
          "payload": {
            "type": "token",
            "value": "opacity-50"
          }
        },
        {
          "type": "variant",
          "selector": "desktop",
          "payload": {
            "type": "call",
            "name": "layout",
            "args": [
              {
                "type": "token",
                "value": "px6"
              },
              {
                "type": "token",
                "value": "py3"
              }
            ]
          }
        },
        {
          "type": "variant",
          "selector": ".dark &[type='password']",
          "payload": {
            "type": "token",
            "value": "bg-black"
          }
        },
        {
          "type": "variant",
          "selector": "&:has(.desc[title=\"a[b] c\"])",
          "payload": {
            "type": "call",
            "name": "text",
            "args": [
              {
                "type": "token",
                "value": "underline"
              }
            ]
          }
        },
        {
          "type": "call",
          "name": "theme",
          "args": [
            {
              "type": "variant",
              "selector": ".dark &",
              "payload": {
                "type": "call",
                "name": "text",
                "args": [
                  {
                    "type": "token",
                    "value": "text-white"
                  }
                ]
              }
            },
            {
              "type": "variant",
              "selector": "hover",
              "payload": {
                "type": "call",
                "name": "layout",
                "args": [
                  {
                    "type": "token",
                    "value": "bg-blue-700"
                  }
                ]
              }
            }
          ]
        }
      ]
    }
  ];
  // testing the parser
  for (let i = 0; i < parserCases.length; i++) {
    const testCase = parserCases[i];
    const result = parseClassValue(testCase.input);
    if (JSON.stringify(result) !== JSON.stringify(testCase.expected)) {
      console.error(`#${i+1} Test failed for input:`, testCase.input);
      console.error("Expected:", testCase.expected);
      console.error("Got     :", JSON.stringify(result, null, 2));
      return false;
    }
  }
  // testing the compiler
  const compilerCases = [
    // {
    //   usage: "hover:mt1 fz2 active:mt1,fz2,fz3",
    //   classValue: "hover_mt1 fz2 active_mt1 active_fz2 active_fz3",
    //   expectedCSS: "hover_mt1:hover{foo:bar}active_mt1:active{foo:bar}active_fz2:active{foo:bar}active_fz3:active{foo:bar}"
    // },
    {
      usage: "desktop:mt1 fz2 ",
      classValue: "desktop_mt1 fz2",
      expectedCSS: "@media all and (min-width:1024px){desktop_mt1{foo:bar}}"
    }
  ];
  for (let i=0; i<compilerCases.length; i++) {
    const testCase = compilerCases[i];
    invalidateInvetory();
    const ast = parseClassValue(testCase.usage);
    const result = compileAST(ast, {
      getStylesByClassName: mockGetStyleByClassName,
      breakpoints: {
        desktop: "(min-width: 1024px)",
        mobile: "(max-width: 1023px)",
        portrait: "(orientation: portrait)"
      }
    });
    if (result.classes.join(' ') !== testCase.classValue) {
      console.error(`${i + 1}# Compiler Test failed (classValue):`);
      console.error("Expected:\n", testCase.classValue);
      console.error("Got:\n", result.classes.join(" "));
      return false;
    }
    if (result.css !== testCase.expectedCSS) {
      console.error(`${i + 1}# Compiler Test failed (expectedCSS):`);
      console.error("Expected:\n", testCase.expectedCSS);
      console.error("Got:\n", result.css);
      return false;
    }
  }
  return true;
}