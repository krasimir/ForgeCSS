import ForgeCSS from '../../../index.js';
import { getPath, expect } from '../../helpers.js';

const __dirname = '/cases/04-state';

export default async function test() {
  const forgecss = ForgeCSS({
    source: getPath(__dirname + "/src"),
    mapping: {
      queries: {
        desktop: {
          query: "(min-width: 1024px)"
        }
      }
    }
  });
  const result = await forgecss.parse();
  return expect.toEqualFile(result, __dirname + "/expected.css");
}