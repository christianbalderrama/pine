/**
 * TradingView rounds to `2 * precision` decimals first, then to `precision`
 * (math.round(1.00499, 2) = 1.01, math.round(1.0049, 2) = 1). The second step
 * divides the integer from the first so it is exact (1.005 * 100 = 100.49999999999999).
 */
export declare function round(context: any): (source: any, precision?: any) => number;
