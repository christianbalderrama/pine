import { SOURCE_BUILTINS } from '../../../namespaces/input/utils';
/**
 * Compile-time evaluation of Pine expressions over the pine2js AST.
 *
 * Pine evaluates every `input*()` argument at compile time: the defaults shown
 * in the settings dialog are the folded values (`input(2 + 2)` → 4,
 * `input.time(timestamp("2024-01-01 00:00 +0000"))` → 1704067200000), and
 * branches whose condition folds to `false` are dropped together with the
 * inputs they declare. This module implements that folding for the subset of
 * the language allowed in a `const` context.
 */
export type ConstType = 'int' | 'float' | 'bool' | 'string' | 'color' | 'source' | 'enum' | 'other';
export interface ConstValue {
    value: unknown;
    type: ConstType;
    /**
     * True when the folded value is exactly what the runtime would compute for
     * the same expression on any symbol. False for context-dependent values
     * (e.g. `timestamp()` without a timezone uses the exchange timezone) and for
     * names kept symbolically (sources, colors, enum fields, namespace constants).
     */
    exact: boolean;
}
export interface ConstEnv {
    /** Resolve a user identifier to its folded value, or undefined when it is not constant. */
    lookup(name: string): ConstValue | undefined;
    /** `"E.a"` → enum field title. */
    enums: Map<string, unknown>;
    /** Pine v5 truncates `const int / const int`; v6 divides fractionally. */
    truncatingIntDivision: boolean;
}
export { SOURCE_BUILTINS };
export declare const COLOR_LITERAL: RegExp;
/**
 * The value an `int`-typed expression produces once consumed. Division inside an
 * int expression is computed fractionally and the result is truncated at the
 * end: `input(1 / 2 * 4)` is 2 and `input(7 / 2)` is 3 on TradingView.
 */
export declare function finalizeConst(cv: ConstValue): unknown;
/** Dotted name of a non-computed member chain (`color.red`), or null. */
export declare function dottedName(node: any): string | null;
export declare function evalConst(node: any, env: ConstEnv): ConstValue | undefined;
