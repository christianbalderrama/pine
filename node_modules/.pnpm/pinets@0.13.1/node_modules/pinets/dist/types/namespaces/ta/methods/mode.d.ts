/**
 * Mode
 *
 * Returns the mode of the series. If there are several values with the same frequency, returns the smallest value.
 *
 * As on TradingView, over the last `length` non-na values (na values are skipped, like `ta.median`);
 * in a local block, the values of the calls.
 */
export declare function mode(context: any): (source: any, _length: any, _callId?: string) => number;
