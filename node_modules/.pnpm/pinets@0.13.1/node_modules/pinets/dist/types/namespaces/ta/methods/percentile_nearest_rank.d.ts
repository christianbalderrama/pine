/**
 * Percentile Nearest Rank
 *
 * Calculates percentile using method of Nearest Rank.
 * A percentile calculated using the Nearest Rank method will always be a member of the input data set.
 *
 * The values are kept in TradingView's order (PercentileArray: ascending without na), so a bar costs
 * a binary search instead of a sort. In a local block they are the values of the last `length` calls,
 * as on TradingView.
 */
export declare function percentile_nearest_rank(context: any): (source: any, _length: any, _percentage: any, _callId?: string) => any;
