/**
 * A JS array that is a window `[start, start + length)` onto `parent` (which may itself be a view), as
 * `array.slice()` returns on TradingView: reads and writes go to the parent, and growing or shrinking the
 * view inserts into / removes from the parent at the end of the window. Every Array.prototype method works on
 * it, since they only use index access and `length`.
 *
 * Structural changes made to the parent directly do not move the window: it keeps its start and length.
 */
export declare function createSliceView(parent: any[], start: number, length: number): any[];
