/**
 * Lazy-operand marking pass.
 *
 * Pine evaluates some operands lazily, and PineTS must not execute them when
 * TradingView would not:
 *
 *   - `cond ? a : b`  — only the taken branch is evaluated (every Pine version).
 *   - `a and b`, `a or b` — the right operand is skipped once the result is
 *     known in Pine v6+ (and in JavaScript). Pine v5 evaluates both operands
 *     strictly, so for v5 sources `lazyLogical` must be `false`.
 *
 * Reference: TradingView, "To Pine Script version 6" migration guide,
 * "Lazy evaluation of conditions".
 *
 * The transformation pass normally hoists every namespace call it meets into
 * a `const temp_N = ...` statement emitted *before* the enclosing statement.
 * That is fine for eager positions, but for a lazy operand it turns
 * `size(a) > 0 ? array.get(a, 0) : na` into an unconditional `array.get`
 * that throws on an empty array, and makes stateful `ta.*` calls in an
 * untaken branch run on every bar.
 *
 * This pass runs on the clean AST (before transformation) and tags every node
 * that sits inside a lazy operand with `_lazyOperand = true`. The call
 * transformer then keeps such calls inline (hoisting suppressed) so they are
 * evaluated exactly when the surrounding JS expression evaluates them.
 *
 * Function bodies (IIFEs generated for Pine `if`/`switch` expressions) reset
 * the flag: statements inside them get their own hoisting scope, which is
 * already lazy because the IIFE itself only runs when its branch is taken.
 *
 * Two refinements, both verified against TradingView output:
 *   - `request.*` calls are never lazy (see `isRequestCall` below).
 *   - For Pine v5 sources, an `and` / `or` sitting inside a lazy operand is
 *     tagged `_strictLogical` so that both of its operands still run when the
 *     branch is taken (v5 `and`/`or` are strict in every position).
 */
export interface LazyOperandOptions {
    /** Treat the right operand of `&&` / `||` / `??` as lazy. */
    lazyLogical: boolean;
}
export declare function markLazyOperands(ast: any, opts: LazyOperandOptions): void;
