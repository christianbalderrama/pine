/**
 * Range
 *
 * Returns the difference between the highest and lowest values of a series over a given length.
 *
 * Not `ta.highest - ta.lowest`: TradingView's range keeps the last `length` non-na values
 * (an na bar is skipped, so the result repeats), returns na until `length` of them have
 * been seen, and starts its maximum from the smallest positive double, so a window of
 * negative values measures down from 0 (tests/namespaces/ta/range-na.test.ts).
 */
export declare function range(context: any): (source: any, _length: any, _callId?: string) => any;
