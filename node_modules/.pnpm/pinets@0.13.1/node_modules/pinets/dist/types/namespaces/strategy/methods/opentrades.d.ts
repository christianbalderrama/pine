/**
 * Pine's `strategy.opentrades` mirrors strategy.closedtrades' dual-role
 * pattern — see that file's header for the rationale.
 *
 *   strategy.opentrades            → scalar count via valueOf
 *   strategy.opentrades.profit(0)  → per-trade unrealized P&L
 *   strategy.opentrades.capital_held → property (sum of held capital)
 */
export declare function opentrades(context: any): () => any;
