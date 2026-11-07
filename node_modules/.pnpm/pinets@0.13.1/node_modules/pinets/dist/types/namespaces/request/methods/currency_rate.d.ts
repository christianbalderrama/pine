/**
 * request.currency_rate(from, to, ignore_invalid_currency): 1 for a currency
 * to itself (as on TradingView); otherwise there is no exchange-rate source,
 * so na with a warning (see unsupportedRequest).
 */
export declare function currency_rate(context: any): (...args: any[]) => number;
