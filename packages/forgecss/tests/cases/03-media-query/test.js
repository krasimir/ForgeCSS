import ForgeCSS from '../../../index.js';
import { getPath, expect } from '../../helpers.js';

const __dirname = '/cases/03-media-query';

export default async function test() {
  const forgecss = ForgeCSS({
    breakpoints: {
      desktop: "(min-width: 1024px)",
      mobile: "(max-width: 1023px)",
      portrait: "(orientation: portrait)"
    }
  });
  const result = await forgecss.parseDirectory({ dir: getPath(__dirname + "/src") });
  return expect.toEqualFile(result, __dirname + "/expected.css");
}