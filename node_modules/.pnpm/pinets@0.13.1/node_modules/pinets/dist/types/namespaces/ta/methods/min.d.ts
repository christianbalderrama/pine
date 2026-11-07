/**
 * Trailing Minimum (ta.min)
 *
 * Returns the all-time low value of `source` from the first bar of the
 * chart up to the current bar.
 *
 * - `na` is returned until the first non-na `source` value is seen.
 * - Later `na` values are ignored (the previous minimum is carried forward)
 *   so a single missing value cannot poison the running result.
 *
 * State is committed per bar (keyed by `context.idx`) so re-evaluations of
 * the still-forming live bar do not corrupt history.
 *
 * @param source - The series to track
 * @returns The trailing minimum up to the current bar
 */
export declare function min(context: any): (source: any, _callId?: string) => any;
