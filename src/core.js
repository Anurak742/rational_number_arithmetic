// core.js
//
// Core rational arithmetic primitives. The public API is built on top of
// these functions. Keeping the core separate makes the invariants explicit:
// every Rational here is a frozen object { n, d } with d > 0 and gcd(|n|, d)
// equal to 1. No function in this module ever returns a non-reduced fraction.

const gcd = (a, b) => {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a === 0 ? 1 : a;
};

/**
 * Build a normalized rational from a numerator and denominator.
 *
 * WHY normalize eagerly: every other operation assumes the invariant that
 * d > 0 and gcd(|n|, d) === 1. Normalizing here means callers never have to
 * remember to call a separate reduce function, and equality checks can be
 * implemented as simple field comparisons.
 *
 * @param {number} n numerator
 * @param {number} d denominator, must not be zero
 * @returns {{n: number, d: number}}
 */
export function makeRational(n, d) {
  if (!Number.isInteger(n) || !Number.isInteger(d)) {
    throw new TypeError('numerator and denominator must be integers');
  }
  if (d === 0) {
    throw new RangeError('denominator must not be zero');
  }

  if (d < 0) {
    n = -n;
    d = -d;
  }

  const divisor = gcd(n, d);
  return Object.freeze({ n: n / divisor, d: d / divisor });
}

/**
 * Add two rationals.
 * @param {{n: number, d: number}} a
 * @param {{n: number, d: number}} b
 * @returns {{n: number, d: number}}
 */
export function add(a, b) {
  // Using the standard cross-multiplication formula. The gcd in
  // makeRational handles reduction, including cases where the numerator or
  // denominator becomes large.
  return makeRational(a.n * b.d + b.n * a.d, a.d * b.d);
}

/**
 * Subtract b from a.
 * @param {{n: number, d: number}} a
 * @param {{n: number, d: number}} b
 * @returns {{n: number, d: number}}
 */
export function subtract(a, b) {
  return makeRational(a.n * b.d - b.n * a.d, a.d * b.d);
}

/**
 * Multiply two rationals.
 * @param {{n: number, d: number}} a
 * @param {{n: number, d: number}} b
 * @returns {{n: number, d: number}}
 */
export function multiply(a, b) {
  return makeRational(a.n * b.n, a.d * b.d);
}

/**
 * Divide a by b.
 * @param {{n: number, d: number}} a
 * @param {{n: number, d: number}} b
 * @returns {{n: number, d: number}}
 */
export function divide(a, b) {
  if (b.n === 0) {
    throw new RangeError('cannot divide by zero');
  }
  return makeRational(a.n * b.d, a.d * b.n);
}

/**
 * Compare two rationals.
 * @param {{n: number, d: number}} a
 * @param {{n: number, d: number}} b
 * @returns {-1|0|1}
 */
export function compare(a, b) {
  // Cross-multiply to avoid floating point division. Both denominators are
  // positive by construction, so this is safe.
  const lhs = a.n * b.d;
  const rhs = b.n * a.d;
  if (lhs < rhs) return -1;
  if (lhs > rhs) return 1;
  return 0;
}

/**
 * Return a rational with value equal to the absolute value of x.
 * @param {{n: number, d: number}} x
 * @returns {{n: number, d: number}}
 */
export function abs(x) {
  return makeRational(Math.abs(x.n), x.d);
}

/**
 * Return a rational with the sign of x reversed.
 * @param {{n: number, d: number}} x
 * @returns {{n: number, d: number}}
 */
export function negate(x) {
  return makeRational(-x.n, x.d);
}

/**
 * Format a rational as a plain string "n/d". If the denominator is 1,
 * return just "n".
 * @param {{n: number, d: number}} x
 * @returns {string}
 */
export function toString(x) {
  return x.d === 1 ? String(x.n) : `${x.n}/${x.d}`;
}

/**
 * Parse a string of the form "n" or "n/d" into a rational.
 *
 * WHY not accept decimals: the library is explicitly exact arithmetic on
 * fractions. Accepting decimal strings would introduce ambiguity about
 * floating-point representation and violates the exactness goal.
 *
 * @param {string} s
 * @returns {{n: number, d: number}}
 */
export function parse(s) {
  if (typeof s !== 'string') {
    throw new TypeError('input must be a string');
  }
  const parts = s.split('/');
  if (parts.length === 1) {
    if (!/^-?\d+$/.test(parts[0])) {
      throw new SyntaxError(`invalid rational: "${s}"`);
    }
    return makeRational(Number(parts[0]), 1);
  }
  if (parts.length === 2) {
    if (!/^-?\d+$/.test(parts[0]) || !/^-?\d+$/.test(parts[1])) {
      throw new SyntaxError(`invalid rational: "${s}"`);
    }
    return makeRational(Number(parts[0]), Number(parts[1]));
  }
  throw new SyntaxError(`invalid rational: "${s}"`);
}

/**
 * Test whether two rationals represent the same number.
 * @param {{n: number, d: number}} a
 * @param {{n: number, d: number}} b
 * @returns {boolean}
 */
export function equals(a, b) {
  return a.n === b.n && a.d === b.d;
}
