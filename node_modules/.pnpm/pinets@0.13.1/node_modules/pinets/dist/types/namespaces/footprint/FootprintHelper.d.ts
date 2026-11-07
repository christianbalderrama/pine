import { VolumeRowObject } from './VolumeRowObject';
/**
 * The `footprint.*` namespace: read-only accessors over the `footprint` object a
 * `request.footprint()` call returns. As on TradingView, an `na` id is a runtime
 * error, so scripts guard with `not na(fp)` on bars without footprint data.
 */
export declare class FootprintHelper {
    private context;
    constructor(context: any);
    param(source: any, index?: number, _name?: string): any;
    /** `footprint(x)` — unlike `line(x)` or `box(x)`, Pine has no `footprint` cast function. */
    any(): never;
    buy_volume(id: any): number;
    sell_volume(id: any): number;
    total_volume(id: any): number;
    delta(id: any): number;
    poc(id: any): VolumeRowObject;
    vah(id: any): VolumeRowObject;
    val(id: any): VolumeRowObject;
    rows(id: any): import("../array/PineArrayObject").PineArrayObject;
    get_row_by_price(id: any, price: any): VolumeRowObject | number;
}
