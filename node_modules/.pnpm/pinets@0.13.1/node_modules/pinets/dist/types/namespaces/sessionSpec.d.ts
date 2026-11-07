/**
 * Pine Script session-string parsing and matching.
 *
 * Session string syntax (see TradingView docs, "Sessions"):
 *
 *     <time_period>[,<time_period>...][:<days>]
 *
 * - <time_period> is "HHmm-HHmm" in 24-hour exchange time. Multiple
 *   comma-separated periods describe a session with breaks.
 * - <days> is a set of digits 1-7 (1 = Sunday ... 7 = Saturday). When
 *   omitted, the session applies to all days ("1234567").
 * - "24x7" is a special string equivalent to "0000-0000:1234567".
 * - An end time of "0000" means end-of-day midnight, so "0000-0000" is a
 *   full 24-hour session on each applicable day.
 * - When the start time is at or after the end time the session spans
 *   midnight; per TradingView, such an overnight session belongs to the
 *   day it ENDS on (e.g. "1700-1700:2" starts Sunday 17:00 and ends
 *   Monday 17:00 — the Monday trading day).
 */
interface SessionWindow {
    /** Minutes from midnight, inclusive. */
    start: number;
    /** Minutes from midnight, exclusive. End-of-day midnight is 1440. */
    end: number;
}
export interface SessionSpec {
    windows: SessionWindow[];
    /** Pine day numbers the session applies to: 1 = Sunday ... 7 = Saturday. */
    days: Set<number>;
}
/**
 * Parse a Pine session string. Returns null when the string is malformed
 * (callers decide whether that is a runtime error).
 */
export declare function parseSessionSpec(spec: string): SessionSpec | null;
/**
 * Test whether a bar time (already decomposed in the session's timezone)
 * falls inside the session.
 *
 * @param minutesOfDay minutes since midnight in the session timezone
 * @param jsDayOfWeek  JS day-of-week convention (0 = Sunday ... 6 = Saturday)
 */
export declare function isInSessionSpec(spec: SessionSpec, minutesOfDay: number, jsDayOfWeek: number): boolean;
export {};
