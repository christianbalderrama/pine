import type { FootprintLevel } from '../../marketData/types';
import { PineArrayObject } from '../array/PineArrayObject';
import { VolumeRowObject } from './VolumeRowObject';
/** Parameters of the `request.footprint()` call a footprint was built for. */
export interface FootprintParams {
    /** Row height in ticks (`ticks_per_row`). */
    ticksPerRow: number;
    /** `syminfo.mintick` — the size of one tick in price units. */
    mintick: number;
    /** Share of the total volume the value area must contain (`va_percent`). */
    vaPercent: number;
    /** Ratio (in percent) one side must reach against its diagonal neighbour (`imbalance_percent`). */
    imbalancePercent: number;
}
/** The bar's price range, used to extend the footprint's rows over the whole candle. */
export interface FootprintRange {
    low: number;
    high: number;
}
/**
 * A bar's volume footprint (Pine's `footprint` type): contiguous rows covering the
 * bar's whole `low..high` range (and every priced level), each
 * `ticks_per_row × mintick` high, plus the bar-level aggregates derived from them.
 * Built once per bar and parameter set; immutable afterwards.
 *
 * The derived values follow TradingView's footprint, verified row-for-row against
 * its `request.footprint()` output: rows sit on a grid anchored at price 0; the
 * POC is the row with the largest total volume, a tie going to the row closest to
 * the middle of the footprint (the lower one when equidistant); the value area
 * grows from the POC by the larger adjacent row (a tie going to the row closer to
 * the POC, then upward) and stops BEFORE the row that would carry it past
 * `va_percent`; imbalances are diagonal at `imbalance_percent / 100`.
 *
 * Instance methods mirror the `footprint.*` namespace functions so both Pine
 * call styles work: `footprint.poc(fp)` and `fp.poc()`.
 */
export declare class FootprintObject {
    /** Rows ascending by price — index 0 is the lowest row. */
    readonly rowList: readonly VolumeRowObject[];
    readonly buyVolume: number;
    readonly sellVolume: number;
    readonly totalVolume: number;
    readonly deltaVolume: number;
    /** Index (into `rowList`) of the Point of Control row. */
    readonly pocIndex: number;
    /** Index of the highest row inside the value area. */
    readonly vahIndex: number;
    /** Index of the lowest row inside the value area. */
    readonly valIndex: number;
    private readonly _rowSize;
    private readonly _firstRowIndex;
    private readonly _context;
    private constructor();
    /**
     * Build the footprint of one bar from its price levels. `range` (the bar's
     * `low`/`high`) extends the rows over the whole candle, so a wick that traded
     * nothing on the source's grid still gets its (empty) row, as on the chart.
     *
     * Returns `null` (Pine `na`) when the bar has no usable level or would need
     * more than 2000 rows.
     */
    static build(context: any, levels: readonly FootprintLevel[], params: FootprintParams, range?: FootprintRange): FootprintObject | null;
    buy_volume(): number;
    sell_volume(): number;
    total_volume(): number;
    delta(): number;
    poc(): VolumeRowObject;
    vah(): VolumeRowObject;
    val(): VolumeRowObject;
    /** A NEW Pine array of the rows, lowest first — callers may mutate it freely. */
    rows(): PineArrayObject;
    /** The row whose `[down_price, up_price)` range contains `price`; `na` outside the footprint. */
    get_row_by_price(...args: any[]): VolumeRowObject | number;
}
