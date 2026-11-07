/**
 * Detect whether a script is a `strategy()` or `indicator()`, and extract
 * the actual values passed to that call from source so they can seed
 * `.prop` defaults.
 *
 * Both source kinds are handled:
 *   - Pine string  → pineToJS() AST → walk for the top-level CallExpression
 *   - JS function  → acorn.parse(fn.toString()) → walk for CallExpression with
 *                    callee Identifier matching 'indicator' / 'strategy'
 *
 * Enum-typed args are resolved by the "rightmost-identifier rule": for any
 * `MemberExpression` the rightmost `Identifier` name is the runtime string.
 * Holds for every Pine-namespace constant accepted by indicator()/strategy()
 * (format.percent → "percent", currency.USD → "USD",
 *  strategy.percent_of_equity → "percent_of_equity",
 *  strategy.commission.percent → "percent").
 *
 * Returns `{ type, args }`:
 *   - type   = 'indicator' | 'strategy' | null
 *   - args   = name → resolved value extracted from the source call
 *
 * If the declaration call isn't found, returns `{ type: null, args: {} }`.
 * The Indicator class falls back to the indicator schema in that case.
 */
export interface ScannedDeclaration {
    type: 'indicator' | 'strategy' | null;
    args: Record<string, unknown>;
}
export declare function scanDeclaration(source: unknown): ScannedDeclaration;
