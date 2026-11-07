/**
 * Average loss of the losing closed trades, as a POSITIVE number. TradingView
 * reports strategy.grossloss / strategy.losstrades (grossloss then includes the
 * entry commission of a trade still open). NaN when no losers yet.
 */
export declare function avg_losing_trade(context: any): () => number;
