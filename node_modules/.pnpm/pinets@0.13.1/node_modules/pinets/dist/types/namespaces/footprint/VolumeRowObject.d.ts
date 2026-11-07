export interface VolumeRowData {
    /** Lower price boundary of the row. */
    downPrice: number;
    /** Upper price boundary of the row. */
    upPrice: number;
    /** "Buy" volume executed inside the row. */
    buyVolume: number;
    /** "Sell" volume executed inside the row. */
    sellVolume: number;
    /** `buyVolume + sellVolume`, already rounded to Pine precision. */
    totalVolume: number;
    /** `buyVolume - sellVolume`, already rounded to Pine precision. */
    delta: number;
    /** Buy volume exceeds the sell volume of the row BELOW by the imbalance ratio. */
    buyImbalance: boolean;
    /** Sell volume exceeds the buy volume of the row ABOVE by the imbalance ratio. */
    sellImbalance: boolean;
}
/**
 * One row of a bar's volume footprint (Pine's `volume_row` type). Rows are
 * immutable snapshots: every value is fixed when the owning footprint is built,
 * including the imbalance flags, which depend on the NEIGHBOURING rows and on
 * the `imbalance_percent` of the `request.footprint()` call that produced them.
 *
 * Instance methods mirror the `volume_row.*` namespace functions so both Pine
 * call styles work: `volume_row.delta(row)` and `row.delta()`.
 */
export declare class VolumeRowObject {
    readonly downPrice: number;
    readonly upPrice: number;
    readonly buyVolume: number;
    readonly sellVolume: number;
    readonly totalVolume: number;
    readonly deltaVolume: number;
    readonly buyImbalance: boolean;
    readonly sellImbalance: boolean;
    constructor(data: VolumeRowData);
    up_price(): number;
    down_price(): number;
    buy_volume(): number;
    sell_volume(): number;
    total_volume(): number;
    delta(): number;
    has_buy_imbalance(): boolean;
    has_sell_imbalance(): boolean;
}
