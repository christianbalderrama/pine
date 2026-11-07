import { Series } from '../../../Series';
/**
 * The source of `ta.linreg` / `ta.rci` as TradingView reads it: `length + 1` slots indexed by bar index, written only when the function is
 * called. Inside a local block, a bar the block skipped still holds what was written in its slot
 * `length + 1` (or a multiple of it) bars earlier, or 0 if nothing was.
 *
 * Before the first call PineTS fills the slots of the bars behind it from the source history (the
 * backfill of the other window functions, so a function first called on the last bar sees those bars).
 * Such a value is read only for its own bar; for a later bar it reads 0, like a slot never written.
 */
export declare class BarRing {
    readonly length: number;
    readonly size: number;
    private vals;
    private bars;
    private byCall;
    constructor(length: number);
    slot(bar: number): number;
    write(bar: number, v: number): void;
    /** Fills the slots of the `length` bars before `bar` from the source history. */
    prefill(bar: number, series: Series): void;
    /** The value read for `bar`; na before the first bar of the chart. */
    read(bar: number): number;
    /** Value held by slot `s` as read for `bar` (a bar of that slot). */
    readSlot(s: number, bar: number): number;
    /** Whether slot `s` holds a backfilled value read as 0 for `bar`. */
    stalePrefill(s: number, bar: number): boolean;
    valueOf(s: number): number;
}
/** A window length the functions accept (an int >= 1); any other gives na. */
export declare const validLength: (length: number) => boolean;
/**
 * The window of ta.linreg as TradingView reads it (BarRing), with its sum S and weighted sum N (newest
 * weight `length`). After a call on the previous bar they move in O(1): the value leaving is the one
 * read for bar idx - length. Otherwise (and every `length` calls, to bound the float drift) they are
 * summed over the window.
 */
export declare class TvWeightedRing {
    private ring;
    private lastCall;
    private S;
    private N;
    private ok;
    private steps;
    private savedFor;
    private saved;
    /** [S, N] of the window of the call on bar `idx`, undefined when it holds na. */
    step(idx: number, x: number, length: number, series: Series): [number, number] | undefined;
}
/** ta.linreg: [S, N] (N weighing the newest value `length`) in the slot form, or the series form. */
export declare class LinregCall {
    private slots;
    private carry;
    private firstLength;
    private seriesForm;
    private committedLine;
    line: [number, number] | null;
    step(idx: number, x: number, length: number, series: Series): [number, number] | undefined;
}
