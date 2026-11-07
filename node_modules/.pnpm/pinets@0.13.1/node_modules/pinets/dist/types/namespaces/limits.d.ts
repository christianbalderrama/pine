/**
 * TradingView caps collection sizes: a script that asks for more is stopped with
 * a runtime error rather than allowed to exhaust host memory. 100,000 is
 * TradingView's documented element limit for arrays and matrices; the same bound
 * is applied to the other size-driven built-ins (`str.repeat`, `table.new`) so a
 * single call cannot trigger an unbounded allocation on the host.
 *
 * `footprint` keeps its own, lower cap (`MAX_ROWS`); this is the general ceiling
 * for the collection built-ins that previously had none.
 */
export declare const MAX_COLLECTION_ELEMENTS = 100000;
/**
 * Throw a Pine runtime error when a requested element count exceeds the cap.
 * `method` names the Pine built-in (`array.new`, `matrix.new`, …) so a host can
 * attribute the error. A non-finite count (e.g. Infinity) is also rejected.
 */
export declare function assertElementCount(count: number, method: string): void;
/**
 * Maximum number of distinct secondary contexts (one per unique
 * symbol/timeframe/expression) a single run may create through `request.*()`.
 * Each one is a real data-provider fetch on the host's API key, so an uncapped
 * fan-out — e.g. a `request.security()` whose symbol varies every bar — would
 * drain the host operator's provider quota. TradingView limits a script to 40
 * `request.*()` calls; the same ceiling bounds the fetches here.
 */
export declare const MAX_REQUEST_CONTEXTS = 40;
/**
 * Count one newly created `request.*()` secondary context against the per-run
 * budget and stop the script once it is exceeded. Mirrors the single-call guard
 * on `request.footprint`. Only the primary context creates secondaries (a
 * secondary returns early), so the counter it carries is the run-wide total.
 */
export declare function trackRequestContext(context: any, method: string): void;
/**
 * Upper bound for `calc_bars_count`. The value is the secondary's historical
 * depth; on a paginating provider an unbounded value amplifies one call into
 * many fetches. Clamp it to a generous but finite ceiling.
 */
export declare const MAX_CALC_BARS = 100000;
