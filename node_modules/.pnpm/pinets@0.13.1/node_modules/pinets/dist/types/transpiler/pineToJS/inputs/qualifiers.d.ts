/**
 * Minimal Pine type-qualifier inference, used to reject runtime values in
 * input arguments. Only expressions built from known pieces are classified;
 * anything else is `undefined` and never reported, so an incomplete table can
 * only miss an error, not invent one.
 */
export type Qualifier = 'const' | 'input' | 'simple' | 'series';
export type ValueType = 'int' | 'float' | 'bool' | 'string' | 'color';
export interface Qualified {
    qual: Qualifier;
    type: ValueType;
}
export interface QualifierEnv {
    /**
     * Qualified type of a user variable; `null` for a user variable whose type
     * is unknown (it still shadows built-ins); `undefined` when no user
     * variable has that name.
     */
    lookup(name: string): Qualified | null | undefined;
}
export declare function inferQualified(node: any, env: QualifierEnv): Qualified | undefined;
/** How TradingView names an argument expression in qualifier errors. */
export declare function describeArgument(node: any, q: Qualified): string;
/** Source position of the first token of an expression, when the parser recorded it. */
export declare function startPos(node: any): string | undefined;
