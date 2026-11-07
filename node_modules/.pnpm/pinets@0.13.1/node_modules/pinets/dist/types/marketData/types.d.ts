/**
 * Standardized candlestick / kline data shape used by all providers.
 */
export interface Kline {
    openTime: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    closeTime: number;
    quoteAssetVolume: number;
    numberOfTrades: number;
    takerBuyBaseAssetVolume: number;
    takerBuyQuoteAssetVolume: number;
    ignore: number | string;
}
/**
 * Executed volume at one price level of a bar's volume footprint, split by
 * aggressor side. How volume is attributed to "buy" vs "sell" is the data
 * source's decision (taker side, intrabar direction, ...) — PineTS only sums.
 */
export interface FootprintLevel {
    /** Level price — the LOW edge of the price bucket this level covers. */
    price: number;
    /** Volume executed by buy-aggressors (ask lifts) at this level. */
    buyVolume: number;
    /** Volume executed by sell-aggressors (bid hits) at this level. */
    sellVolume: number;
}
/**
 * The volume footprint of ONE bar — a sidecar to the bar's {@link Kline}, keyed by
 * the same `openTime`. Levels may sit on any price grid: `request.footprint()`
 * re-bins them into rows of `ticks_per_row × syminfo.mintick` itself, so a source
 * serves its finest available granularity and never needs to know the row size.
 */
export interface FootprintBar {
    /** Bar open time (epoch ms) — matches the corresponding kline's `openTime`. */
    openTime: number;
    /** Price step the levels were bucketed on. Informational only. */
    tick?: number;
    /** Price levels, in any order. Levels with no volume may be omitted. */
    levels: FootprintLevel[];
}
/**
 * Interval duration in milliseconds, keyed by normalized interval strings.
 * Used by providers for pagination and date-range estimation.
 *
 * These use Binance-style interval keys ('1m', '1h', '1d', etc.)
 * which are also the de-facto standard across most market data APIs.
 */
export declare const INTERVAL_DURATION_MS: Record<string, number>;
/**
 * Period types for timeframe-aware date arithmetic.
 */
export type PeriodType = 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month';
/**
 * Duration in seconds for each canonical timeframe.
 *
 * Uses seconds (not minutes) to naturally accommodate TradingView's
 * sub-minute timeframes ('1S', '5S', etc.) without fractional values.
 * D/W/M values are approximate — used for ratio math, not calendar grouping.
 */
export declare const TIMEFRAME_SECONDS: Record<string, number>;
/**
 * Map from canonical timeframe to { periodType, multiplier }.
 * Used by aggregation to determine grouping strategy.
 */
export declare const TIMEFRAME_PERIOD_INFO: Record<string, {
    periodType: PeriodType;
    multiplier: number;
}>;
/**
 * Compute the start of the next period given an openTime (fixed duration math).
 *
 * For intraday / daily / weekly: adds fixed duration.
 * For monthly: uses calendar math to land on the 1st of the next month.
 *
 * **Suitable for 24/7 crypto markets** where there are no session gaps.
 * For stock/regulated markets, prefer `computeSessionClose()` or
 * the Alpaca Calendar API which account for session boundaries,
 * early closes, and holidays.
 *
 * @param openTimeMs - The bar's open time in epoch milliseconds
 * @param periodType - The period unit ('minute', 'hour', 'day', 'week', 'month')
 * @param multiplier - How many units per bar (e.g., 3 for 3Min, 4 for 4Hour). Default: 1
 */
export declare function computeNextPeriodStart(openTimeMs: number, periodType: PeriodType, multiplier?: number): number;
/**
 * Convert a local date + time string in a given IANA timezone to UTC milliseconds.
 *
 * Uses `Intl.DateTimeFormat` for DST-correct conversion — no external dependencies.
 *
 * @param dateStr - Date in "YYYY-MM-DD" format
 * @param timeStr - Time in "HH:MM" format (24h)
 * @param timezone - IANA timezone name (e.g. "America/New_York", "Etc/UTC")
 * @returns UTC epoch milliseconds
 */
export declare function localTimeToUTC(dateStr: string, timeStr: string, timezone: string): number;
/**
 * Compute the session close time for a bar.
 *
 * For providers without a per-day calendar API (like FMP), this computes
 * closeTime from the session string and exchange timezone.
 *
 * Logic by period type:
 * - **24x7 session**: closeTime = openTime + barDuration (no gaps)
 * - **Intraday** (minute, hour): min(openTime + barDuration, sessionEndOnThatDay)
 * - **Daily** (day): same date at session end time in timezone
 * - **Weekly** (week): Friday of that week at session end (approximation: no holiday calendar)
 * - **Monthly** (month): last weekday of month at session end (approximation: no holiday calendar)
 *
 * @param openTimeMs - Bar open time in UTC epoch milliseconds
 * @param session - Session string, e.g. "0930-1600" or "24x7"
 * @param timezone - IANA timezone name, e.g. "America/New_York"
 * @param periodType - The period unit
 * @param multiplier - How many units per bar (default: 1)
 */
export declare function computeSessionClose(openTimeMs: number, session: string, timezone: string, periodType: PeriodType, multiplier?: number): number;
/**
 * Normalize closeTime for 24/7 crypto providers (Binance, Mock).
 *
 * Many crypto APIs (e.g. Binance) return closeTime as `nextBarOpen - 1ms`.
 * For 24/7 markets, `nextBar.openTime == sessionClose`, so this is correct:
 * - For bars 0..N-2: closeTime = next bar's openTime (exact for 24/7)
 * - For the last bar: closeTime = raw closeTime + 1ms (best estimate)
 *
 * **Not suitable for stock/regulated market providers** — those must use
 * `computeSessionClose()` or the Alpaca Calendar API for session-aware close times.
 *
 * Mutates the array in place.
 */
export declare function normalizeCloseTime(data: Kline[]): void;
