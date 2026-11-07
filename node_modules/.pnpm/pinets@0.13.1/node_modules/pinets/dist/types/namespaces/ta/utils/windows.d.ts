/**
 * Building blocks for the rolling windows of the ta functions: each one is updated in O(1)
 * (amortized) or O(log n) per value, so a window function costs the same per bar whatever its length.
 */
/** Values in arrival order; `at(0)` is the newest. O(1) push / shift. */
export declare class Ring<T = number> {
    private buf;
    private head;
    private mask;
    size: number;
    constructor(capacity?: number);
    /** A ring holding `newestFirst` (index 0 = newest). */
    static from<T>(newestFirst: T[]): Ring<T>;
    push(v: T): void;
    /** Removes and returns the oldest value. */
    shift(): T;
    /** The `i`-th newest value (0 = newest). */
    at(i: number): T;
    oldest(): T;
    /** Newest first. */
    toArray(): T[];
    private grow;
}
/**
 * Monotonic queue of (seq, value) pairs for a rolling maximum (or minimum): the front holds the best
 * value of the queued range and, among equal values, the oldest one.
 */
export declare class MonoDeque {
    private readonly max;
    private seqs;
    private vals;
    private head;
    constructor(max: boolean);
    push(seq: number, v: number): void;
    /** Drops the values pushed with a seq below `from`. */
    expire(from: number): void;
    clear(): void;
    /** Position of the best entry with seq >= `from`, or -1. Does not modify the queue. */
    first(from: number): number;
    seqAt(pos: number): number;
    valAt(pos: number): number;
}
/** Number of values of the sorted array `a` that are < `x`. */
export declare function lowerBound(a: number[], x: number): number;
/** Number of values of the sorted array `a` that are <= `x`. */
export declare function upperBound(a: number[], x: number): number;
export declare function sortedInsert(a: number[], x: number): void;
/** Removes one value equal to `x` (which must be present). */
export declare function sortedRemove(a: number[], x: number): void;
/** Count of each value of a window, grouped by count, for its mode in O(log n) per change. */
export declare class ValueCounts {
    private counts;
    private byCount;
    private maxCount;
    add(v: number): void;
    /** Removes one `v` (which must be counted). */
    remove(v: number): void;
    /** The most frequent value, the smallest among equally frequent ones; NaN when empty. */
    mode(): number;
}
/** The current call's change: `x` added (dropping the oldest value when `evict`), or `values` replacing the window. */
interface CallTentative {
    rebuilt: boolean;
    x?: any;
    evict?: boolean;
    values?: any[];
    cap: number;
}
/** Per-function constants (no allocation per call): `src` is the argument passed to `push`. */
export interface PushOptions {
    /** Completes a window short of `cap` values from the source history (newest first). */
    backfill?: (values: any[], win: CallWindow, src: any, cap: number) => void;
    /** Drop at most one value beyond `cap` (the window of a few functions shrinks by one value per call). */
    trimOnce?: boolean;
    /** Called with each value dropped from the window, oldest first, before `backfill`. */
    dropped?: (v: any, win: CallWindow) => void;
}
/** Backfill with the source values of the bars behind the window (`src`: the source argument). */
export declare const BACKFILL_FROM_SOURCE: PushOptions;
/**
 * The values of the last calls of a function (newest first), committed / tentative: the window
 * committed on the previous bar is never copied; the current call's value is kept aside and only added
 * when the next bar starts, so a bar evaluated again (live bar) starts from the same window.
 *
 * `push` adds a value and drops the oldest beyond `cap`. A window still short of `cap` values, on a call
 * made once the function has been called `cap` times or the chart has `cap` bars, is completed by
 * `backfill` (reading the source history): a function called inside an `if` or only on the last bar
 * needs that. Such a call, like one with a `cap` smaller than the window, rebuilds the window
 * (O(cap)); every other call is O(1).
 *
 * With `carry`, the window holds one value per bar rather than per call: a bar on which the function
 * was not called (the call is in a local block that did not run) repeats the value of the last call.
 * That is TradingView's history of `source[i]` inside most ta functions (`ta.wma`, `ta.change`,
 * `ta.stoch`, ...), while others (`ta.sma`, `ta.median`, `math.sum`, ...) only see their calls.
 *
 * Subclasses keep aggregates of the committed values up to date in `pushed` / `rebuilt`; a caller can
 * also carry its own running values in `agg` (committed) / `tAgg` (current call): the two are swapped
 * on commit, so a caller writing every field of `tAgg` on each call allocates nothing.
 */
export declare class CallWindow {
    readonly carry: boolean;
    lastIdx: number;
    ring: Ring<any>;
    calls: number;
    /** `cap` of the committed window. */
    cap: number;
    t: CallTentative | null;
    agg: any;
    tAgg: any;
    private tCalls;
    private fast;
    constructor(carry?: boolean);
    /** Commits the previous bar's call when `idx` starts a new bar. */
    begin(idx: number): void;
    /** Tentatively adds `x` for the current call, dropping the oldest values beyond `cap`. */
    push(idx: number, x: any, cap: number, opts?: PushOptions, src?: any): void;
    /** Sets the current call's window to `newestFirst` (a rebuild from the source history). */
    set(newestFirst: any[], cap: number): void;
    /** Number of values in the current call's window. */
    get size(): number;
    /** `i`-th newest value of the current call's window. */
    at(i: number): any;
    /** The value the current call drops from the committed window (when `t.evict`). */
    evicted(): any;
    private scratch;
    /**
     * The first `n` values (newest first) of the current call's window, in an array reused by every
     * call: for functions that loop over the whole window.
     */
    values(n: number): any[];
    /** `x` was added (and `y` dropped when `evict`); `sameCap`: the committed `cap` did not change. */
    protected pushed(_x: any, _evict: boolean, _y: any, _sameCap: boolean): void;
    /** The ring was replaced. */
    protected rebuilt(): void;
}
export {};
