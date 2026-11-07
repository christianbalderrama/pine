export declare const DEFAULT_TIME_FORMAT = "yyyy-MM-dd'T'HH:mm:ssZ";
interface Zone {
    id?: string;
    fixedMs?: number;
    names: string[];
}
/** The zone of a timezone argument, or null when str.format_time() rejects it. */
export declare function resolveTimeZone(timezone: string): Zone | null;
/** Whether Java counts the instant as daylight time (tzdata's isdst flag), which picks the daylight names. */
export declare function isDaylightTime(id: string, t: number): boolean;
/** Daylight time as Intl shows it; DAYLIGHT_EXCEPTIONS lists where Java differs from exactly this estimate. */
export declare function estimateDaylight(id: string, t: number): boolean;
/**
 * Format a UNIX millisecond time as str.format_time() does. An invalid format or time zone is a
 * runtime error with TradingView's message (the format is checked first).
 */
export declare function formatTime(time: number, format: string, timezone: string): string;
export {};
