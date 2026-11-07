/**
 * Pine's `strategy.closedtrades` serves a dual role:
 *   - As a scalar: a series int count of closed trades.
 *   - As a namespace: `strategy.closedtrades.profit(idx)` etc.
 *
 * Our transpiler renders the bare access as a CALL (`strategy.closedtrades()`),
 * and the chained access as a CHAINED CALL (`strategy.closedtrades().profit(0)`).
 * Both must work. The trick: the call returns a hybrid object that:
 *   - has `valueOf()` returning the count (so it behaves like an int in
 *     arithmetic/comparison contexts, e.g. `_ct > 0`),
 *   - has the per-trade methods (`profit`, `size`, ...) attached.
 *
 * This pattern keeps the transpiler unchanged while supporting both shapes.
 */
export declare function closedtrades(context: any): () => any;
