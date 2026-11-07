/**
 * Stochastic Oscillator (STOCH)
 *
 * The Stochastic Oscillator is a momentum indicator that shows the location of the close
 * relative to the high-low range over a set number of periods.
 *
 * Formula:
 * STOCH = 100 * (close - lowest(low, length)) / (highest(high, length) - lowest(low, length))
 *
 * @param source - Source series (typically close price)
 * @param high - Series of high prices
 * @param low - Series of low prices
 * @param length - Number of bars back (lookback period)
 * @returns Stochastic value (0-100)
 *
 * @remarks
 * - Returns NaN during initialization period (when not enough data)
 * - A bar whose value would be NaN because of an na input (source, high, low) repeats the previous value
 * - A flat range (highest equal to lowest) repeats the previous value when the source equals it and
 *   is NaN otherwise
 * - The highs and lows are the last `length` non-na values (in a local block, of the calls), as
 *   ta.highest / ta.lowest; `length` may change from call to call
 */
export declare function stoch(context: any): (source: any, high: any, low: any, _length: any, _callId?: string) => number;
