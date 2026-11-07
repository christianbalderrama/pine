/**
 * Offset (<= 0) of the highest (lowest) of the last `length` non-na values, the newest bar among equal
 * values: TradingView's ta.highestbars / ta.lowestbars (since 2026-10-09). In a local block the values
 * are those of the calls, and the offset is the number of bars back to the call holding the extreme.
 * As ta.highest, a value from bar_index `length - 1` on, over the fewer non-na values seen until then;
 * NaN while there are none.
 */
export declare function extremeBarsOffset(context: any, key: string | undefined, series: any, length: number, max: boolean): number;
/** The same, scanning the series (no state). */
export declare function extremeBarsScan(series: any, length: number, max: boolean, idx: number): number;
