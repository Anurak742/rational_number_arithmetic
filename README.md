# Rational Number Arithmetic

Exact arithmetic on fractions represented as numerator-denominator pairs with automatic reduction.

```js
import { makeRational, add, toString } from 'rational-number-arithmetic';

const a = makeRational(1, 3);
const b = makeRational(1, 6);
const sum = add(a, b);
console.log(toString(sum)); // 1/2
```

## Why this library exists

Floating-point arithmetic cannot represent most fractions exactly, which leads to accumulated rounding errors in calculations where exactness matters. This library stores numbers as reduced fractions and performs arithmetic using integer cross-multiplication, so every result is exact as long as the numerator and denominator stay within JavaScript's safe integer range.

The trade-off is performance and range: operations on large rationals can grow the numerator and denominator quickly, and the library is not suitable for arbitrary-precision work. For typical exact computations with moderate-sized fractions, it is simpler and faster than a big-integer-based approach.

## Awkward edge

All functions expect integers for numerators and denominators. Passing a non-integer throws a `TypeError`, and a zero denominator throws a `RangeError`. The `parse` function accepts only strings of the form `n` or `n/d`, where both parts are integers; it does not parse decimal notation.

## Exported API

- `makeRational(n, d)` — create a reduced rational from integers `n` and `d`
- `add(a, b)` — sum of two rationals
- `subtract(a, b)` — difference of two rationals
- `multiply(a, b)` — product of two rationals
- `divide(a, b)` — quotient of two rationals; throws if `b` is zero
- `compare(a, b)` — returns `-1`, `0`, or `1`
- `abs(x)` — absolute value of a rational
- `negate(x)` — negated rational
- `toString(x)` — format as `"n"` or `"n/d"`
- `parse(s)` — parse a string into a rational
- `equals(a, b)` — test whether two rationals represent the same number

## Performance

The window keeps a bounded buffer, so `push` is constant time and memory does not
grow with the length of the stream. `peak` and `trough` are linear in the window
size, which is the trade that keeps `push` cheap.

## Design notes

The window stores values eagerly rather than keeping running aggregates. Running
sums drift with floating point over long streams, and recomputing from a small
buffer is cheap enough that the drift is not worth the speed.

