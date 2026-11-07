/**
 * Pine Script na-aware "less than" (`<`).
 *
 * - If either operand is `na`, the result is `na` (matching TradingView:
 *   `na(na < 1)` is `true`). na is falsy, so branch/ternary outcomes are
 *   unchanged.
 * - Values equal within an absolute 1e-10 tolerance are treated as equal, so
 *   `<` is false — matching TradingView's relational tolerance.
 */
export declare function __lt(context: any): (a: any, b: any) => number | boolean;
