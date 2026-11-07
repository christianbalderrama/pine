/**
 * Price at which the current position would be force-liquidated.
 * Returns NaN when flat, without a margin model, and for a long at 100% margin.
 *
 * Official TV formula, documented at
 * https://www.tradingview.com/support/solutions/43000717375/ :
 *
 *   MarginLiquidationPriceRaw =
 *       ((InitialCapital + NetProfit) / (PointValue * AbsPositionSize)
 *        − Direction * EntryPrice)
 *     / (MarginPercent / 100 − Direction)
 *
 * Where:
 *   InitialCapital + NetProfit = realized account equity (initial cash
 *                                 plus closed-trade P&L; excludes openprofit)
 *   PointValue                 = syminfo.pointvalue (1 for crypto, varies
 *                                 for futures contracts)
 *   AbsPositionSize            = |strategy.position_size|
 *   Direction                  = +1 for long, −1 for short
 *   EntryPrice                 = strategy.position_avg_price
 *   MarginPercent              = margin_long for longs, margin_short for shorts
 */
export declare function margin_liquidation_price(context: any): () => number;
