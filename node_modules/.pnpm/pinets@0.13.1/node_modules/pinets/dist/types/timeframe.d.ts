/**
 * Timeframe strings — the single parser behind `request.security*`, `timeframe.*`,
 * `time()` and the market-data providers.
 *
 * Pine timeframe strings: minutes as plain integers ("1", "60", "360", "1440"), seconds
 * as "NS", and calendar units "ND", "NW", "NM" with the multiplier optional when it is 1
 * ("D" = "1D"). PineTS also accepts the provider-style aliases used for chart timeframes
 * ("1m", "15m", "1h", "4H", "1d", "1w", lowercase "d" / "w" / "m"); TradingView itself
 * rejects those in scripts.
 */
export type TimeframeUnit = 'S' | '' | 'D' | 'W' | 'M';
export interface ParsedTimeframe {
    /** '' = minutes */
    unit: TimeframeUnit;
    multiplier: number;
}
/** TradingView's month length in timeframe arithmetic: 365 / 12 days (2628003 s). */
export declare const MONTH_SECONDS = 2628003;
/** Parse a timeframe string. Returns `null` for anything that is not a timeframe (including ""). */
export declare function parseTimeframe(timeframe: unknown): ParsedTimeframe | null;
/**
 * Pine string form of a timeframe. Calendar units with a multiplier of 1 are written
 * without it ("D", "W", "M") unless `withUnitMultiplier` is set, which is how Pine v6
 * reports `timeframe.period` and how `timeframe.from_seconds` always answers ("1D").
 */
export declare function formatTimeframe(tf: ParsedTimeframe, withUnitMultiplier?: boolean): string;
/** Canonical key of a timeframe string ("1h" -> "60", "1D" -> "D", "2d" -> "2D"), or `null` when invalid. */
export declare function canonicalTimeframe(timeframe: unknown): string | null;
/** Length in seconds, as `timeframe.in_seconds` computes it (a month is {@link MONTH_SECONDS}). */
export declare function timeframeSeconds(tf: ParsedTimeframe): number;
/** Timeframe string for a number of seconds, rounded up to the next valid timeframe (`timeframe.from_seconds`). */
export declare function timeframeFromSeconds(seconds: number): string;
/**
 * Open time of the bar of `tf` that contains `timestamp` (UTC calendar, as TradingView
 * builds bars for a UTC 24/7 symbol). Every grid restarts at a calendar boundary, so the
 * bar before a restart is shorter:
 * - seconds / minutes: every N from 00:00 of the day;
 * - ND: every N days from January 1;
 * - NW: every N weeks from the first Monday of the year;
 * - NM: every N months from January.
 */
export declare function timeframeBarStart(timestamp: number, tf: ParsedTimeframe): number;
/** Close time of the bar of `tf` that opens at `barStart` (see {@link timeframeBarStart}). */
export declare function timeframeBarEnd(barStart: number, tf: ParsedTimeframe): number;
