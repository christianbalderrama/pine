export type RoundingMode = 'halfUp' | 'halfEven';
/**
 * Integer and fraction digits of a non-negative number, from its shortest round-trip
 * representation, with the decimal point moved right by `shift` places (exact % scaling).
 */
export declare function plainDecimal(abs: number, shift?: number): [string, string];
/**
 * Rounds the decimal digits `int.frac` of `abs` to `maxFrac` fraction digits.
 * - halfUp: on the shortest decimal digits, ties away from zero (str.tostring with a pattern).
 * - halfEven: on the exact binary value, as Java's DecimalFormat does (str.format, default
 *   str.tostring): a decimal tie rounds by the value the double really holds (2.345 is
 *   2.34500000000000019... -> 2.35, 1.005 is 1.00499999999999989... -> 1), and an exact tie
 *   rounds to even. A tie whose kept digits are all zero (0.0005 to 3 places) rounds down.
 */
export declare function roundDecimal(abs: number, int: string, frac: string, maxFrac: number, mode: RoundingMode): [string, string];
/**
 * Formats a number with a DecimalFormat-style pattern: literal prefix and suffix, `0` / `#`
 * digits, `,` grouping, `.` fraction and `%` (×100). A value that rounds to zero is printed
 * without its sign in halfUp mode (str.tostring) and with it in halfEven mode (str.format).
 * A pattern without any digit placeholder is a literal prefix to the rounded integer
 * (`str.tostring(2.5, "abc")` is `abc3`).
 */
export declare function formatNumberPattern(value: number, pattern: string, mode: RoundingMode): string;
/**
 * `str.tostring(float)` without a format: at most 10 fraction digits (rounded like
 * DecimalFormat), no exponent below 1e21, `1.2345678901E29` above, no sign on zero.
 */
export declare function formatFloat(value: number): string;
/** Java's `Double.toString`: `5.0`, `0.001`, `1.0E7`, `9.9E-4` (float array elements in joins). */
export declare function javaDoubleToString(value: number): string;
/** `format.volume`: `1.235M`, `2.5B`, `999`, `12` (3 decimals with a unit, none without). */
export declare function formatVolume(value: number): string;
