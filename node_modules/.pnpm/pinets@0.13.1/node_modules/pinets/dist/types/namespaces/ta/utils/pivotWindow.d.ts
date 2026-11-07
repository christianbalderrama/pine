/**
 * Pivot high (low) confirmed at index `i` of `source` (oldest first), as on TradingView (since
 * 2026-10-09): the value `rightbars` bars before `i`, when it is the highest (lowest) of the last
 * `leftbars + rightbars + 1` non-na values, and no newer one equals it (an older equal value does not
 * disqualify it). An na value is skipped, so the window then reaches further back. From bar `i =
 * leftbars + rightbars` on the window may hold fewer values (as ta.highest). NaN otherwise.
 */
export declare function pivotAt(source: number[], i: number, leftbars: number, rightbars: number, high: boolean): number;
/**
 * Pivot high (low) confirmed on the current bar. With a key, over the last `leftbars + rightbars + 1`
 * non-na values of the calls (nonNaWindow, fewer of them from bar_index `leftbars + rightbars` on, as
 * ta.highest): the call `rightbars` bars back is the pivot when it holds the window's extreme, the
 * newest among equal values. Without one the source series is read.
 */
export declare function pivot(context: any, key: string | undefined, source: any, leftbars: number, rightbars: number, high: boolean): number | undefined;
