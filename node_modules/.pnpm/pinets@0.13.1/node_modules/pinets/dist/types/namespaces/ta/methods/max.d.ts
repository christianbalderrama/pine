/**
 * Trailing Maximum (ta.max)
 *
 * Returns the all-time high value of `source` from the first bar of the
 * chart up to the current bar.
 *
 * - `na` is returned until the first non-na `source` value is seen.
 * - Later `na` values are ignored (the previous maximum is carried forward)
 *   so a single missing value cannot poison the running result.
 *
 * State is committed per bar (keyed by `context.idx`) so re-evaluations of
 * the still-forming live bar do not corrupt history.
 *
 * @param source - The series to track
 * @returns The trailing maximum up to the current bar
 */
export declare function max(context: any): (source: any, _callId?: string) => any;
