/**
 * Returns the qty that would be used for an entry at the given fill price,
 * given the strategy's `default_qty_type` and `default_qty_value`. Mirrors
 * `calculateOrderQty()` without a specified qty (always uses the default).
 *
 * Pine signature: strategy.default_entry_qty(fill_price) → series float
 */
export declare function default_entry_qty(context: any): (fillPrice: number) => number;
