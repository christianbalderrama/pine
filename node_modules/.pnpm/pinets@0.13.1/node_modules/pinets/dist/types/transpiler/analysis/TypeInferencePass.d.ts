/**
 * TypeInferencePass — Pine v5 const-int division inference, and the element type
 * of `array.from()` (int when every argument is int-typed, for every Pine version).
 *
 * Runs BEFORE the main lowering pass, on the clean AST (operands are still bare
 * identifiers and literals — not yet `$.get(...)`), for Pine sources only; the
 * division rewrite is enabled for v5 only (`options.intDivision`).
 *
 * Purpose: replicate Pine v5's `const int / const int → int` truncation.
 * Per TradingView's v6 migration guide ("Fractional division of constants"):
 *
 *   - In v5, `int / int` truncates toward zero ONLY when BOTH operands are
 *     qualified as 'const' (compile-time constants): `5 / 2 === 2`.
 *   - If at least one operand is 'input', 'simple', or 'series' — loop counters,
 *     mutable (`:=`-reassigned) variables, `var` declarations, `input.int(...)`,
 *     int builtins like `bar_index` — the fractional remainder is PRESERVED
 *     even in v5: `i / 4 === 0.75`.
 *   - In v6, `int / int` NEVER truncates, regardless of qualifiers. (v6 scripts
 *     never reach this pass.)
 *
 * When a `/` BinaryExpression has BOTH operands provably const int, it is
 * rewritten in place to `$.pine.math.__idiv(left, right)`; the main pass then
 * lowers the operand subtrees inside the call args. Anything not provably
 * const-int keeps native `/`, so partial coverage never corrupts a genuine
 * fractional division — the worst case is a missed truncation.
 *
 * Lattice: `constint` (compile-time int constant) → `int` (int-typed but
 * input/simple/series-qualified) → `notint` (float / string / bool / na /
 * unknown). Only `constint / constint` triggers the rewrite; the `int` tier
 * exists so int-ness still propagates through arithmetic without ever
 * upgrading a non-const operand to const.
 */
import ScopeManager from './ScopeManager';
export interface TypeInferenceOptions {
    /** Rewrite `const int / const int` to a truncating division (Pine v5 only). */
    intDivision: boolean;
}
export declare function runTypeInferencePass(ast: any, _scopeManager: ScopeManager, options?: TypeInferenceOptions): void;
