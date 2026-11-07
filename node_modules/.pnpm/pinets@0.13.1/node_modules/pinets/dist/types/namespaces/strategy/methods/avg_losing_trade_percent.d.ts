/**
 * Average return of the losing closed trades as a percent: the mean of their
 * strategy.closedtrades.profit_percent. NaN when no losers yet.
 */
export declare function avg_losing_trade_percent(context: any): () => number;
