import type { IndicatorOptions } from '../types/PineTypes';
export declare function parseIndicatorOptions(args: any[]): Partial<IndicatorOptions>;
/**
 * NAHelper implements the dual-use `na` identifier.
 * - Bare `na` → `na.__value` → NaN
 * - `na(x)` → `na.any(x)` → checks if x is NaN
 */
export declare class NAHelper {
    get __value(): number;
    param(source: any, index?: number): any;
    any(series: any): boolean;
}
/**
 * Alert frequency constants (Pine Script alert.freq_* values, as TradingView prints them).
 */
export declare const ALERT_FREQ: {
    freq_all: string;
    freq_once_per_bar: string;
    freq_once_per_bar_close: string;
};
/**
 * AlertHelper implements the dual-use `alert` identifier.
 * - `alert(msg, freq)` → `alert.any(msg, freq, {__callsiteId})` — fires an alert event
 * - `alert.freq_once_per_bar` → frequency constant
 *
 * Each `alert()` call site gets a stable ID (`alert_0`, `alert_1`, ...)
 * injected by the transpiler at compile time via `__callsiteId`. This ensures
 * per-callsite frequency gating works correctly even when live bars are
 * re-executed or when alert() calls are inside conditional branches.
 */
export declare class AlertHelper {
    private context;
    /**
     * Per-callsite, per-bar frequency gating.
     * Key: `${callsiteId}:${barIdx}`, tracks which (callsite, bar) pairs have fired.
     */
    private _firedKeys;
    /** Fallback counter for PineTS-syntax (non-transpiled) calls without __callsiteId. */
    private _fallbackCounter;
    private _fallbackLastExecTick;
    constructor(context: any);
    get freq_all(): string;
    get freq_once_per_bar(): string;
    get freq_once_per_bar_close(): string;
    param(source: any, _index?: number, _id?: string): any;
    any(...args: any[]): void;
}
export declare class Core {
    private context;
    constructor(context: any);
    private extractPlotOptions;
    indicator(...args: any[]): any;
    library(...args: any[]): any;
    get bar_index(): any;
    na(series: any): boolean;
    nz(series: any, replacement?: number): any;
    fixnan(series: any): any;
    private _acCounter;
    private _acLastExecTick;
    /** Per-callsite, per-bar dedup for alertcondition (prevents duplicate fires on live re-execution). */
    private _acFiredKeys;
    alertcondition(...args: any[]): void;
    error(...args: any[]): void;
    max_bars_back(series?: any, length?: any): void;
    /**
     * Converts date/time components to a UNIX timestamp in milliseconds.
     * Supports multiple signatures:
     *   timestamp(dateString)                                     — RFC 2822 / ISO 8601 string
     *   timestamp(year, month, day, hour?, minute?, second?)      — components, exchange timezone
     *   timestamp(timezone, year, month, day, hour?, minute?, second?) — components, explicit timezone
     */
    timestamp(...args: any[]): number;
    /**
     * Build a UNIX timestamp (ms) from calendar components interpreted in a given timezone.
     * Supports IANA timezone names ("America/New_York") and UTC offset strings ("UTC+5", "GMT-03:30").
     */
    private _timestampFromComponents;
    /**
     * Convert calendar components in an IANA timezone to a UTC timestamp.
     * Uses Intl.DateTimeFormat to determine the timezone offset.
     */
    private _timestampFromIANA;
    bool(series: any): boolean;
    int(series: any): number;
    float(series: any): number;
    string(series: any): any;
    Type(definition: Record<string, string | [string, any]>, typeName?: string): any;
}
