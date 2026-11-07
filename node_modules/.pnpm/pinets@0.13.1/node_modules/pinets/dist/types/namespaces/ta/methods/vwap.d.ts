/**
 * VWAP - Volume Weighted Average Price
 *
 * Forms:
 * - `ta.vwap` (built-in variable): VWAP of hlc3
 * - `ta.vwap(source)`: resets at the start of each trading day (exchange timezone)
 * - `ta.vwap(source, anchor)`: resets on every bar where `anchor` is true; na until the first reset
 * - `ta.vwap(source, anchor, stdev_mult)`: tuple [vwap, upper band, lower band]
 *
 * Formula: VWAP = Σ(Price × Volume) / Σ(Volume)
 * Bands: VWAP ± stdev_mult × sqrt(Σ(Price² × Volume) / Σ(Volume) − VWAP²)
 */
export declare function vwap(context: any): (...args: any[]) => any;
