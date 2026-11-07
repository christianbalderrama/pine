export declare const isNa: (v: any) => boolean;
/** The window of one call: `length` values, newest first, their sum and (when kept) their order. */
export interface NonNaView {
    sum: number;
    /** `i`-th newest value. */
    at(i: number): number;
    /** The `length` values, newest first (an array reused by the next call). */
    values(): number[];
    /** `k`-th smallest value (0-based); only for a window created with `'sorted'`. */
    kth(k: number): number;
    /** Most frequent value, the smallest among equally frequent ones; only for `'counts'`. */
    mode(): number;
    /** Largest / smallest value (the newest among equal ones); only for `'extremes'`. */
    max(): number;
    min(): number;
    /** Bar index of that value. */
    maxBar(): number;
    minBar(): number;
}
/** What a window keeps besides its values and sum. */
export type Track = 'sorted' | 'counts' | 'extremes' | false;
/**
 * When a window has a value: `'values'` once `length` non-na values have been seen; `'bars'` from
 * bar_index `length - 1` on, over the non-na values seen so far when there are fewer than `length`
 * (none: no value).
 */
export type Gate = 'values' | 'bars';
/** The source of a window: a series, or a function of the offset (0 = current bar). */
export type ValueSource = {
    get(k: number): any;
} | ((k: number) => number);
/**
 * The last `length` non-na values of a source, newest first, and their sum: the window TradingView's
 * `ta.sma`, `ta.variance`, `ta.stdev`, `ta.median`, `ta.vwma` and `ta.correlation` use. An na value is
 * skipped, not counted, so a bar whose value is na leaves the window as it was. `undefined` while
 * fewer than `length` non-na values have been seen. With `gate = 'bars'` (TradingView's ta.highest,
 * ta.lowest, *bars, ta.stoch, ta.wpr and the pivots) the window instead has a value from bar_index
 * `length - 1` on, holding the fewer non-na values seen until then (`length` of the view is their count).
 *
 * In a local block the values are those of the calls, as on TradingView; `length` may change from call
 * to call (a series length), the window then reaching further back into the earlier calls. The values
 * before the first call are read from the source (PineTS's backfill, for a function first called on a
 * later bar, e.g. on the last bar only).
 *
 * `valueAt` reads the source `k` bars back (0 = current): a series or a function; `current`, when given,
 * is the current value (`valueAt` is then only read for the backfill). State lives in
 * `context.taState[key]`; a bar evaluated again (live bar) starts from the values of the previous bars.
 *
 * The values are kept with prefix sums (History), so the sum of any window costs O(1); `'sorted'` /
 * `'counts'` keep the window ordered / counted, O(log length) a value; `'extremes'` its maximum and
 * minimum (and their bars), O(log length) a query.
 */
export declare function nonNaWindow(context: any, key: string, valueAt: ValueSource, length: number, track?: Track, current?: number, gate?: Gate): NonNaView | undefined;
