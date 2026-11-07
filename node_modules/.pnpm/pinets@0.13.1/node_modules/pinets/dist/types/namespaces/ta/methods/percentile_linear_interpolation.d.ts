/**
 * Percentile Linear Interpolation
 *
 * Calculates percentile using method of linear interpolation between the two nearest ranks.
 *
 * The values are kept in TradingView's order (PercentileArray: ascending without na), so a bar costs
 * a binary search instead of a sort. In a local block they are the values of the last `length` calls,
 * as on TradingView.
 */
export declare function percentile_linear_interpolation(context: any): (source: any, _length: any, _percentage: any, _callId?: string) => any;
