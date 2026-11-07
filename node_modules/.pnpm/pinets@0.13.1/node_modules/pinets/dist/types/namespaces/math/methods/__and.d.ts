/**
 * Strict Pine v5 `and`. Emitted by the transpiler for an `and` that sits inside
 * a lazy `?:` branch of a v5 script (see LazyOperandPass / transformStrictLogicalOperators):
 * a call evaluates both arguments, so the right operand runs even when the left
 * is false — exactly what TradingView does for v5 — while the enclosing branch
 * still decides whether the expression runs at all. The result mirrors native `&&`.
 */
export declare function __and(_context: any): (a: any, b: any) => any;
