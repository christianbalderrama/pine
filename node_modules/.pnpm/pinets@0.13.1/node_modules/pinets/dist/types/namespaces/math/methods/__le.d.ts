/**
 * Pine Script na-aware "less than or equal" (`<=`).
 *
 * - If either operand is `na`, the result is `na` (matching TradingView).
 * - Values equal within an absolute 1e-10 tolerance are treated as equal, so
 *   `<=` is true — matching TradingView's relational tolerance.
 */
export declare function __le(context: any): (a: any, b: any) => number | boolean;
