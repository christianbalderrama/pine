/**
 * math.random(min = 0, max = 1, seed): a value in [min, max). With a seed (non-zero), each
 * call site draws the next value of its own seeded sequence on every call.
 */
export declare function random(context: any): (...args: any[]) => any;
