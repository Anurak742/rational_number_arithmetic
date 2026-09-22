import test from 'node:test';
import assert from 'node:assert/strict';

import {
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
} from '../src/core.js';

const r = (n, d) => makeRational(n, d);

test('makeRational reduces fractions', () => {
  assert.deepEqual(r(2, 4), { n: 1, d: 2 });
  assert.deepEqual(r(6, 3), { n: 2, d: 1 });
  assert.deepEqual(r(0, 5), { n: 0, d: 1 });
  assert.deepEqual(r(-8, 12), { n: -2, d: 3 });
});

test('makeRational normalizes denominator sign', () => {
  assert.deepEqual(r(1, -2), { n: -1, d: 2 });
  assert.deepEqual(r(-1, -2), { n: 1, d: 2 });
});

test('makeRational rejects zero denominator', () => {
  assert.throws(() => r(1, 0), RangeError);
});

test('makeRational rejects non-integer arguments', () => {
  assert.throws(() => r(1.5, 2), TypeError);
  assert.throws(() => r(1, 2.5), TypeError);
});

test('add, subtract, multiply, divide produce reduced results', () => {
  assert.deepEqual(add(r(1, 6), r(1, 3)), r(1, 2));
  assert.deepEqual(subtract(r(1, 2), r(1, 6)), r(1, 3));
  assert.deepEqual(multiply(r(2, 3), r(3, 4)), r(1, 2));
  assert.deepEqual(divide(r(1, 2), r(3, 4)), r(2, 3));
});

test('divide by zero throws', () => {
  assert.throws(() => divide(r(1, 2), r(0, 1)), RangeError);
});

test('compare orders rationals correctly', () => {
  assert.equal(compare(r(1, 2), r(2, 4)), 0);
  assert.equal(compare(r(1, 3), r(1, 2)), -1);
  assert.equal(compare(r(3, 4), r(2, 3)), 1);
  assert.equal(compare(r(-1, 2), r(1, 2)), -1);
});

test('abs and negate', () => {
  assert.deepEqual(abs(r(-3, 4)), r(3, 4));
  assert.deepEqual(abs(r(3, 4)), r(3, 4));
  assert.deepEqual(negate(r(3, 4)), r(-3, 4));
  assert.deepEqual(negate(r(-3, 4)), r(3, 4));
});

test('toString formats fractions and integers', () => {
  assert.equal(toString(r(3, 4)), '3/4');
  assert.equal(toString(r(4, 2)), '2');
  assert.equal(toString(r(-1, 2)), '-1/2');
  assert.equal(toString(r(0, 5)), '0');
});

test('parse handles valid strings', () => {
  assert.deepEqual(parse('3/4'), r(3, 4));
  assert.deepEqual(parse('2'), r(2, 1));
  assert.deepEqual(parse('-1/2'), r(-1, 2));
  assert.deepEqual(parse('4/-8'), r(-1, 2));
});

test('parse rejects malformed input', () => {
  assert.throws(() => parse('3.5'), SyntaxError);
  assert.throws(() => parse('1/2/3'), SyntaxError);
  assert.throws(() => parse('abc'), SyntaxError);
  assert.throws(() => parse('1/0'), RangeError);
});

test('equals checks numeric equality via normalized fields', () => {
  assert.equal(equals(r(1, 2), r(2, 4)), true);
  assert.equal(equals(r(1, 2), r(1, 3)), false);
  assert.equal(equals(r(0, 1), r(0, 5)), true);
});

test('all arithmetic results are frozen like makeRational', () => {
  const a = r(1, 2);
  const b = r(1, 3);
  for (const result of [add(a, b), subtract(a, b), multiply(a, b), divide(a, b)]) {
    assert.ok(Object.isFrozen(result));
  }
});
