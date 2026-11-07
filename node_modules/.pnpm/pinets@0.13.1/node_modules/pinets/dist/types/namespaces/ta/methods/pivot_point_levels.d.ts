import { PineArrayObject } from '../../array/PineArrayObject';
/**
 * ta.pivot_point_levels(type, anchor, developing) → array<float> of 11 levels [P, R1, S1, …, R5, S5].
 * When `anchor` is true a new period starts: with `developing = false` the levels are computed from
 * the period that just ended and stay until the next anchor; with `developing = true` they follow the
 * current period bar by bar. Levels a type does not define are na.
 */
export declare function pivot_point_levels(context: any): (_type: any, _anchor: any, ...rest: any[]) => PineArrayObject;
