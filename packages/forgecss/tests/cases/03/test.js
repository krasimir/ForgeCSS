import ForgeCSS from '../../../index.js';
import { getPath, expect } from '../../helpers.js';

export default async function test() {
  const forgecss = ForgeCSS({
    source: getPath("/cases/03/src"),
    mapping: {
      queries: {
        desktop: {
          query: "(min-width: 1024px)",
        },
        mobile: {
          query: "(max-width: 1023px)",
        }
      }
    }
  });
  const result = await forgecss.parse();
  return expect.toEqualFile(result, "/cases/03/expected.css");
}