import { findUsages, getUsages, invalidateUsageCache } from "../../../lib/processor.js";
import { getPath, expect } from "../../helpers.js";

export default async function test() {
  const cases = [
    {
      file: getPath("/cases/01/src/page.html"),
      expected: {
        [getPath("/cases/01/src/page.html")]: {
          desktop: ["mt2"],
          mobile: ["fz2", "red"],
          tablet: ["mt3", "blue"]
        }
      }
    },
    {
      file: getPath("/cases/01/src/page.tsx"),
      expected: {
        [getPath("/cases/01/src/page.tsx")]: {
          desktop: ["mt1"],
          mobile: ["my1"]
        }
      }
    }
  ];
  for (let i=0; i<cases.length; i++) {
    const { file, expected } = cases[i];
    invalidateUsageCache();
    await findUsages(file);
    if (!expect.deepEqual(getUsages(), expected)) {
      return false;
    }
  }
  return true;
}
