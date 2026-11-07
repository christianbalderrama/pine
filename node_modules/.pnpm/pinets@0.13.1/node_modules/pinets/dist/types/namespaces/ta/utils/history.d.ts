import { ValueCounts } from './windows';
/**
 * Values in order (oldest first) with exact window sums: prefix sums of x (and of j * x, j the entry
 * number) kept in double-double, so the sum of any number of newest values costs O(1) and is as
 * accurate as summing them one by one. An na value counts 0 in the sums and is counted apart.
 *
 * Entries are numbered from the first push (`start` to `end`); the oldest beyond the lookback kept
 * (`keepFor`) are dropped by `compact`, called only between bars so that a bar evaluated again can
 * `truncate` back to where it started.
 */
export declare class History {
    private v;
    private nan;
    private ph;
    private pl;
    private qh;
    private ql;
    /** Physical index of entry `start`. */
    private off;
    start: number;
    end: number;
    private keep;
    constructor(sums?: 0 | 1 | 2);
    get size(): number;
    /** Keeps at least `n` entries (and the default lookback). */
    keepFor(n: number): void;
    private grow;
    push(x: number): void;
    /** Drops the entries pushed after the first `end`. */
    truncate(end: number): void;
    /** Drops the entries older than the lookback kept. */
    compact(): void;
    /** Entry number `j` (start <= j < end). */
    get(j: number): number;
    /** `i`-th newest entry (0 = newest), NaN beyond the entries kept. */
    at(i: number): number;
    /** The newest `n` entries, oldest first (a view, valid until the next push). */
    view(n: number): Float64Array;
    /** Number of na among the newest `n` entries. */
    nas(n: number): number;
    private diff;
    /** Sum of the newest `n` entries (na counted 0). */
    sum(n: number): number;
    /** Σ (n - i) * at(i) for i < n: the newest entry weighs n, the oldest 1 (na counted 0). */
    wsum(n: number): number;
}
/**
 * A multiset of the newest `n` entries of a History (`n` may change from call to call), kept sorted
 * or counted. `sync` brings it to the current window; `commit` (a new bar) / `rollback` (the same bar
 * computed again) bound the changes of one bar.
 */
declare abstract class TailTracker {
    /** The tracked window: entries lo .. hi - 1. */
    lo: number;
    hi: number;
    private savedLo;
    private savedHi;
    private log;
    protected abstract add(v: number): void;
    protected abstract remove(v: number): void;
    commit(): void;
    rollback(): void;
    private doAdd;
    private doRemove;
    /** Tracks the `n` entries before the newest `skip` ones (fewer if the history is shorter). */
    sync(h: History, n: number, skip?: number): void;
}
export declare class SortedTail extends TailTracker {
    sorted: number[];
    protected add(v: number): void;
    protected remove(v: number): void;
}
export declare class CountsTail extends TailTracker {
    counts: ValueCounts;
    protected add(v: number): void;
    protected remove(v: number): void;
}
/**
 * Maximum (minimum) of the newest `n` entries of a History, for any `n`: the entries greater (smaller)
 * than every later one, oldest first, so the extreme of a window is the first of them inside it (the
 * oldest among equal values, or with `newest` the newest). Only the entries after the most recent na
 * take part. O(log n) a query, O(1) amortized a push; `commit` / `rollback` as for the trackers.
 */
export declare class ExtremeTail {
    private readonly max;
    private readonly newest;
    private idx;
    private val;
    private head;
    /** Entry number of the most recent na (-1: none). */
    lastNa: number;
    private synced;
    private popped;
    private pushedCount;
    private saved;
    constructor(max: boolean, newest?: boolean);
    commit(h: History): void;
    rollback(): void;
    /** Adds the entries pushed to `h` since the last sync. */
    sync(h: History): void;
    /** Entry number of the extreme of the newest `n` entries of `h` (after the last na), -1 if none. */
    find(h: History, n: number): number;
}
/**
 * The history of `source[i]` inside a function called in a local block, as TradingView keeps it: one
 * entry per bar, a bar on which the function was not called repeating the last call's value, and the
 * bars before the first call read from the source (PineTS's backfill). `fill` (when given) replaces the
 * value written for a bar from the previous entry (e.g. na filled forward).
 */
export declare class CarryHistory {
    private readonly fill?;
    private readonly backfill;
    readonly h: History;
    private lastIdx;
    private savedEnd;
    /** Whether the last call started a new bar (false: the same bar computed again). */
    newBar: boolean;
    constructor(sums?: 0 | 1 | 2, fill?: (x: number, prev: number) => number, backfill?: boolean);
    private write;
    /** Adds the value `x` of the call on bar `idx` (`series`: the source, for the first call's backfill). */
    push(idx: number, x: any, length: number, series?: {
        get(k: number): any;
    }): void;
    /** Starts the call on bar `idx` without adding a value (the bar is then not in the history). */
    visit(idx: number, length: number, series?: {
        get(k: number): any;
    }): void;
}
export {};
