/**
 * Average per-trade return as a percent: the mean of each closed trade's
 * strategy.closedtrades.profit_percent (profit over entry notional plus the
 * trade's entry commission). NaN when no trades have closed.
 */
export declare function avg_trade_percent(context: any): () => number;
