/**
 * The `volume_row.*` namespace: read-only accessors over one footprint row. As
 * with `footprint.*`, an `na` id is a runtime error (TradingView's behavior) —
 * e.g. the `na` that `footprint.get_row_by_price()` returns outside the footprint.
 */
export declare class VolumeRowHelper {
    private context;
    constructor(context: any);
    param(source: any, index?: number, _name?: string): any;
    /** `volume_row(x)` — unlike `line(x)` or `box(x)`, Pine has no `volume_row` cast function. */
    any(): never;
    up_price(id: any): number;
    down_price(id: any): number;
    buy_volume(id: any): number;
    sell_volume(id: any): number;
    total_volume(id: any): number;
    delta(id: any): number;
    has_buy_imbalance(id: any): boolean;
    has_sell_imbalance(id: any): boolean;
}
