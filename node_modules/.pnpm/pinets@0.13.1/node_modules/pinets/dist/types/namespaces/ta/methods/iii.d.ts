/**
 * Intraday Intensity Index (III)
 *
 * Formula (as TradingView computes it; its reference manual shows a division by volume):
 * (2 * close - high - low) / (high - low) * volume
 */
export declare function iii(context: any): (_callId?: string) => any;
