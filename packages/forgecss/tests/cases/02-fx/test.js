import fx from '../../../client/fx.js';
import { expect } from '../../helpers.js';

const transformations = [
  ["", ""],
  ["a b", "a b"],
  ["a d:x y", "a d_x y"],
  ["a d:x,z m:y", "a d_x d_z m_y"],
  ["hover:red a", "hover_red a"],
  ["[&:hover]:a b", "__hover_a b"],
  ["[&:required:disabled]:red", "__required_disabled_red"]
];

export default async function test() {
  for(let [input, expected] of transformations) {
    if (!expect.toBe(fx(input), expected)) {
      return false;
    }
  }
  return true;
}