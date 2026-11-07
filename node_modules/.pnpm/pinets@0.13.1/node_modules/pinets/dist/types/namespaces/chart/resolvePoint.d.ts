import { ChartPointObject } from './ChartPointObject';
/**
 * The x coordinate a chart.point gives a drawing. The drawing's xloc picks the field:
 * `xloc.bar_time` reads the point's time and `xloc.bar_index` its index, so
 * `chart.point.now()` (both set) lands at its time on a bar_time line. Without an xloc
 * the index is used, or the time (with xloc.bar_time) when the point has no index.
 */
export declare function resolvePoint(point: ChartPointObject, xloc?: string): {
    x: number;
    xloc: string;
};
