import fx from '../../../client/fx.js';
import { expect } from '../../helpers.js';

const transformations = [
  [ '', '' ],
  [ 'a b', 'a b' ],
  [ 'a d:x y', 'a d_x y' ],
  [ 'a d:x,y', 'a d_x d_y' ],
]

export default async function test() {
  for(let [input, expected] of transformations) {
    return expect.toBe(fx(input), expected);
  }
}