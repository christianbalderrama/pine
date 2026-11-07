/**
 * Percent Rank
 *
 * Returns the percentage of values in the last length previous bars that are less than or equal to the current value.
 *
 * The previous values are kept sorted, so a bar costs a binary search. In a local block, as on
 * TradingView, they are the last `length` bars, a skipped bar repeating the last call's value.
 */
export declare function percentrank(context: any): (source: any, _length: any, _callId?: string) => any;
