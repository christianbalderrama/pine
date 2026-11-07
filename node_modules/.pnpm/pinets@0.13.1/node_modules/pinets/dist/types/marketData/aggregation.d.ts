import { Kline } from './types';
export interface AggregationOptions {
    /**
     * Group sub-candles on TradingView's UTC calendar grid ({@link timeframeBarStart}) and stamp
     * each bar with its grid open / close time. Right for UTC 24/7 sources (crypto). When false,
     * intraday targets group by count and session gaps, and bars keep their first sub-candle's
     * open time and last sub-candle's close time.
     */
    calendarGrid?: boolean;
}
/**
 * Given a target timeframe and a set of supported timeframes, select the
 * best sub-timeframe to aggregate from.
 *
 * Strategy:
 * - **W / M units and multi-day targets**: always `'D'` (calendar-based grouping).
 * - **All others** (including `'D'`): pick the largest supported intraday timeframe whose duration
 *   evenly divides the target duration.
 *
 * @returns The best sub-timeframe, or `null` if none found.
 */
export declare function selectSubTimeframe(targetTimeframe: string, supportedTimeframes: Set<string>): string | null;
/**
 * Compute how many sub-candles fit into one aggregated candle.
 *
 * For fixed-duration aggregation: `targetSeconds / subSeconds`.
 * For calendar-based targets (W / M units, multi-day): returns `Infinity` to signal variable grouping.
 */
export declare function getAggregationRatio(targetTimeframe: string, subTimeframe: string): number;
/** Approximate number of sub-candles per aggregated candle, finite for every pair (for fetch limits). */
export declare function getApproximateRatio(targetTimeframe: string, subTimeframe: string): number;
/**
 * Aggregate sub-candles into higher-timeframe candles.
 *
 * - **Calendar targets** (W / M units, multi-day) group by the calendar bar each sub-candle opens
 *   in: N days from January 1, N weeks from the first Monday of the year, N months from January.
 * - **Intraday and 1D targets** group on the UTC calendar grid with `calendarGrid`, otherwise
 *   every N consecutive sub-candles with session-boundary detection (no cross-session merging).
 *
 * OHLCV merge:
 * - `open` = first sub-candle's open
 * - `high` = max of all highs
 * - `low`  = min of all lows
 * - `close` = last sub-candle's close
 * - `volume` = sum
 */
export declare function aggregateCandles(subCandles: Kline[], targetTimeframe: string, subTimeframe: string, options?: AggregationOptions): Kline[];
