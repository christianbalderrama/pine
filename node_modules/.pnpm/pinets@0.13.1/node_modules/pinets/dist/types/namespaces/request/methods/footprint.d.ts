import { FootprintObject } from '../../footprint/FootprintObject';
/**
 * `request.footprint(ticks_per_row, va_percent = 70, imbalance_percent = 300) → footprint`
 *
 * The volume footprint of the CURRENT bar, or `na` when the data source has none
 * for it. Footprint data comes from the provider's optional `getFootprintData`
 * surface (see `IFootprintProvider`); the row binning, POC, value area and
 * imbalance flags are computed here so every source shares one set of Pine
 * semantics. Inside `request.security()` the call runs in the secondary context
 * and describes that context's own bars (its symbol and timeframe).
 *
 * Argument rules follow TradingView: a negative argument is a runtime error;
 * `ticks_per_row` of 0 or `na` yields `na`; `va_percent` is capped at 100 and an
 * `na` one reduces the value area to the POC row; `na` for `imbalance_percent`
 * flags no row. An omitted optional argument takes its default (70 / 300).
 */
export declare function footprint(context: any): (...rawArgs: any[]) => Promise<number | FootprintObject>;
