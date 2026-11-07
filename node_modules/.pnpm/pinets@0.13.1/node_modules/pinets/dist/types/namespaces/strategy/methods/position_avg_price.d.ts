/**
 * Weighted-average entry price of the current open position.
 * Returns NaN when flat — matches Pine's strategy.position_avg_price semantics.
 */
export declare function position_avg_price(context: any): () => any;
