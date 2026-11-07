/**
 * Pine Script na-aware "greater than" (`>`).
 *
 * - If either operand is `na`, the result is `na` (matching TradingView).
 * - Values equal within an absolute 1e-10 tolerance are treated as equal, so
 *   `>` is false — matching TradingView's relational tolerance.
 */
export declare function __gt(context: any): (a: any, b: any) => number | boolean;
