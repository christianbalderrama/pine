import { Series } from '../../../Series';
/**
 * The values of the last `length` calls of ta.percentile_linear_interpolation /
 * ta.percentile_nearest_rank, in the order TradingView keeps them: a call inserts its value before the
 * first one it is smaller than, scanning from the start, then the oldest values are removed (their
 * first occurrence) while more than `length` are held. An na is smaller than nothing, so it goes to
 * the end, but a value inserted later goes after it as well: the array is sorted only while it holds
 * no na, and the result read from it can then be na. With fewer than `length` values (a series length
 * that grew), the array is completed from `source[count]`, the history inside the function (in a local
 * block, a skipped bar repeating the last call's value). Verified against TradingView with synthetic
 * na patterns and lengths.
 *
 * Without na, the insert and the removal are binary searches. A first call on a later bar is completed
 * from the source history, like the other window functions' backfill.
 */
export declare class PercentileArray {
    readonly arr: number[];
    private nan;
    private held;
    private head;
    private carry;
    private undoLog;
    private lastTick;
    /**
     * The array after the call on bar `idx`; undefined while fewer than `length` values are held. `tick`
     * identifies the script's execution: a second call in the same one (a loop) adds its value too, as on
     * TradingView, while a new execution of the same bar (live bar) starts from the previous bars.
     */
    step(idx: number, x: any, length: number, series: Series, tick?: unknown): number[] | undefined;
    private commit;
    private rollback;
    private insert;
    private removeValue;
    private insertAt;
    private indexOf;
}
/** ta.percentile_nearest_rank of the array (index from its length, na if it points at an na). */
export declare function nearestRank(a: number[], percentage: number): number;
/** ta.percentile_linear_interpolation of the array: between an entry and the next (na if one is na). */
export declare function linearInterpolation(a: number[], percentage: number): number;
