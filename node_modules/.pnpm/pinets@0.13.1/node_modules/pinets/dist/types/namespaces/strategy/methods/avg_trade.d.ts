/**
 * Average profit/loss across all closed trades (post-commission).
 * NaN when no trades have closed. Matches Pine's strategy.avg_trade.
 */
export declare function avg_trade(context: any): () => number;
