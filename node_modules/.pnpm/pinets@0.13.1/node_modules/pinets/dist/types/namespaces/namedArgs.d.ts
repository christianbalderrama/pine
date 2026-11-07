/**
 * `args` with a trailing named-arguments bag moved onto the positions of `params`.
 * `skip` is the number of leading parameters not in `args` (1 for a method's receiver).
 * Calls without a bag, or whose bag names none of `params`, are returned unchanged.
 */
export declare function spreadNamedArgs(args: any[], params: readonly string[] | undefined, skip?: number): any[];
/** `fn` with a trailing named-arguments bag spread onto `params` positions. */
export declare function withNamedArgs(fn: (...args: any[]) => any, params: readonly string[] | undefined): (...args: any[]) => any;
