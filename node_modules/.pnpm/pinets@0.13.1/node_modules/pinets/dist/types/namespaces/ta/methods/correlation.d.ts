/**
 * Correlation Coefficient
 *
 * Describes the degree to which two series tend to deviate from their ta.sma() values.
 * r = (sma(x*y) - sma(x)*sma(y)) / sqrt((sma(x^2) - sma(x)^2) * (sma(y^2) - sma(y)^2))
 *
 * Each of the five averages skips its own na values, as TradingView computes it. When one series
 * has an na inside the window the averages cover different bars, so the result can fall outside
 * [-1, 1]; that is TradingView's value too.
 */
export declare function correlation(context: any): (source1: any, source2: any, _length: any, _callId?: string) => any;
