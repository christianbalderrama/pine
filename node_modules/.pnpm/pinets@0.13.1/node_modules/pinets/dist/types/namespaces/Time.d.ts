import { Series } from '../Series';
interface DateParts {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
    dayOfWeek: number;
}
/**
 * Decompose a UTC-millisecond timestamp into calendar parts
 * interpreted in the given timezone.
 */
export declare function getDatePartsInTimezone(timestamp: number, timezone: string): DateParts;
/**
 * ISO 8601 week number (1-53). Monday-start, week containing Jan 4th is week 1.
 */
export declare function getISOWeekNumber(year: number, month: number, day: number): number;
/**
 * TimeHelper implements the dual-use `time` / `time_close` identifiers.
 * - Bare `time` → `time.__value` → openTime Series
 * - `time[1]` → `$.get(time.__value, 1)` → previous bar's time
 * - `time(timeframe)` → `time.any(timeframe)` → time function
 */
export declare class TimeHelper {
    private context;
    private dataField;
    constructor(context: any, dataField?: string);
    get __value(): any;
    param(source: any, index?: number): any;
    any(...args: any[]): number;
    /**
     * Session check: parses a full Pine session string — comma-separated
     * "HHMM-HHMM" windows with an optional ":days" suffix (1=Sunday..7=Saturday)
     * — and tests whether the timestamp falls within the session.
     * Malformed session strings halt the script, mirroring TradingView.
     */
    private _isInSession;
}
/**
 * Single parameterized class for all 8 dual-use time component identifiers:
 * dayofmonth, dayofweek, hour, minute, month, second, weekofyear, year.
 *
 * - Bare `dayofmonth` → `$.get(dayofmonth.__value, 0)` → current bar's value
 * - `dayofmonth[1]` → `$.get(dayofmonth.__value, 1)` → previous bar's value
 * - `dayofmonth(time)` → extract from given timestamp
 * - `dayofmonth(time, timezone)` → extract from timestamp in given timezone
 *
 * `__value` MUST be a Series (same shape as TimeHelper.__value): these
 * identifiers are series in Pine, so history indexing has to reach previous
 * bars. A scalar here would make `$.get(hour.__value, 1)` ignore the offset
 * and `param(...)` fall into its one-element scalar buffer — `hour[1]` would
 * be na on every bar and `hour != hour[1]` would never fire.
 */
export declare class TimeComponentHelper {
    private context;
    private extractor;
    /** Extracted component per bar, kept in lockstep with data.openTime. */
    private _cache;
    private _cacheTimezone;
    constructor(context: any, extractor: (parts: DateParts) => number);
    get __value(): Series;
    param(source: any, index?: number): any;
    any(...args: any[]): any;
}
export declare const EXTRACTORS: {
    dayofmonth: (parts: DateParts) => number;
    dayofweek: (parts: DateParts) => number;
    hour: (parts: DateParts) => number;
    minute: (parts: DateParts) => number;
    month: (parts: DateParts) => number;
    second: (parts: DateParts) => number;
    weekofyear: (parts: DateParts) => number;
    year: (parts: DateParts) => number;
};
export {};
