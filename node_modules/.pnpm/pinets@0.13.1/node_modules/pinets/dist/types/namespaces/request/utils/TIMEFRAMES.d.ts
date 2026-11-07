export declare const TIMEFRAMES: string[];
/**
 * Normalize a timeframe string to its canonical Pine Script form ('1h' -> '60', '1D' -> 'D',
 * '2d' -> '2D'). Strings that are not timeframes are returned as-is.
 */
export declare function normalizeTimeframe(tf: string): string;
