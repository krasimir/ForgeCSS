import { invalidateInvetory } from "../../../lib/inventory.js";
import { findUsages, getUsages, invalidateUsageCache } from "../../../lib/usages.js";
import { getPath, expect } from "../../helpers.js";

export default async function test() {
  const cases = [
    {
      file: getPath("/cases/01-usages/src/page.html"),
      expected: {
        [getPath("/cases/01-usages/src/page.html")]: {
          desktop: ["red"],
          "[.dark &:hover]": ["red"]
        }
      }
    },
    {
      file: getPath("/cases/01-usages/src/page.tsx"),
      expected: {
        [getPath("/cases/01-usages/src/page.tsx")]: {
          "desktop": ["b", "b2"],
          "mobile": ["d"],
          "[&:hover]": ["a"],
          "[.dark &]": ["b"],
          "[.dark desktop:b]": ["c"],
          "[.dark &:has(.desc)]": ["c"],
          "[.dark &[type='password']]": ["c"]
        }
      }
    }
  ];
  for (let i=0; i<cases.length; i++) {
    const { file, expected } = cases[i];
    invalidateUsageCache();
    invalidateInvetory();
    await findUsages(file);
    if (!expect.deepEqual(getUsages(), expected)) {
      return false;
    }
  }
  return true;
}
