import { ConstType } from './constEval';
/**
 * Input declaration analysis over the pine2js AST (runs before code generation).
 *
 * TradingView declares inputs at compile time, wherever the `input*()` call
 * sits: global or local scope, `if`/`switch`/loop bodies, function bodies,
 * or directly as an argument (`ta.sma(close, input(14))`). This pass mirrors
 * that model:
 *
 *   - Every reachable input call site gets a sequential id `in_0`, `in_1`, …
 *     in source order — the same ids TradingView uses. Call sites in branches
 *     whose condition folds to a constant are skipped (`if false`, a
 *     `const` false variable, `false and …`, constant ternaries and switches).
 *   - Each input is labelled like the settings dialog: the `title` argument
 *     when given, else the variable it is assigned to (`k = …`, `k := …`,
 *     `k += …`, even deep inside the expression), else the enclosing
 *     function's name, else "untitled".
 *   - Arguments are folded at compile time (see constEval). A folded default
 *     that does not depend on the chart replaces the original expression, so
 *     the runtime value matches the declared one (`input(7 / 2)` is 3).
 *   - Arguments may only reference constants: a loop counter or a function
 *     parameter is an undeclared identifier there, and a variable holding
 *     another input is rejected.
 *
 * The call is tagged with a trailing `{ __inputId, __varId }` argument; the
 * runtime pops it (input/utils.parseInputOptions) and uses the id as the
 * primary override key.
 */
export interface InputSite {
    /** `in_N`, in declaration order. */
    id: string;
    /** `''` for the bare `input()` wrapper, else the `input.<fn>` name. */
    fn: string;
    /** Label shown in the settings dialog. */
    name: string;
    /** Variable the input value is assigned to, when there is one. */
    varId?: string;
    /** Folded argument values keyed by parameter name. */
    args: Record<string, unknown>;
    /** Static type of the folded `defval` (drives the bare `input()` auto-typing). */
    defvalType?: ConstType;
}
export interface AnalyzeInputsOptions {
    /** Pine version of the script — v5 truncates `const int / const int`. */
    version?: number | null;
}
export declare function analyzeInputs(ast: any, options?: AnalyzeInputsOptions): InputSite[];
/** `"input"` → `''`, `"input.int"` → `'int'`, anything else → null. */
export declare function inputFnName(call: any): string | null;
