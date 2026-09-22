// index.js
//
// Public entry point for the rational-arithmetic package. It re-exports the
// core API so consumers can import from the package root.

export {
  makeRational,
  add,
  subtract,
  multiply,
  divide,
  compare,
  abs,
  negate,
  toString,
  parse,
  equals,
} from './core.js';
