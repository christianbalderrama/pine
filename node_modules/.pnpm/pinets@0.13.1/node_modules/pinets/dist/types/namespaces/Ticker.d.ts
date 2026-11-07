/**
 * Pine Script `ticker.*` namespace.
 *
 * The methods here construct "ticker ID" strings that are passed to
 * `request.security` / `request.security_lower_tf` to fetch data for a
 * specific symbol — potentially with extra modifiers (session,
 * adjustment, non-standard chart type).
 *
 * CHART-TYPE modifiers travel as an EXTENDED-TICKER suffix
 * (`"BINANCE:BTCUSDT;heikinashi"` — see `tickerModifier.ts`):
 * `ticker.heikinashi()` appends it, `ticker.standard()` strips it, and
 * `request.security` passes it through to the data source untouched. An
 * embedding host that owns the transform honors it; PineTS' own bundled
 * providers serve standard candles only and strip it at their boundary
 * (documented no-op for standalone use). The other non-standard types
 * (Renko, Kagi, Line Break, Point & Figure) remain plain-symbol stubs —
 * no data source we route to can construct those bars.
 *
 * SESSION / ADJUSTMENT modifiers (`ticker.new` / `ticker.modify` / `ticker.inherit`)
 * produce TradingView's encoded form `={"adjustment":"…","session":"…","symbol":"…"}`,
 * so the strings match TradingView's. The data sources don't honor them:
 * `request.security` and the providers decode the symbol and serve the
 * standard session. Combined with a chart-type modifier, the chart type
 * stays a `;heikinashi` suffix after the encoded id (TradingView nests both
 * in one encoded object).
 */
export declare class Ticker {
    private context;
    constructor(context: any);
    /**
     * Type B param wrapper — extract scalar from series/primitive.
     * Used by the transpiler to wrap ticker.* arguments.
     */
    param(source: any, index?: number, _name?: string): any;
    /**
     * ticker.inherit(from_tickerid, symbol) → string
     *
     * Returns a ticker ID that uses `symbol` and inherits modifier settings from
     * `from_tickerid`. The CHART-TYPE modifier is honored: inheriting from a
     * `";heikinashi"` ticker (e.g. `syminfo.tickerid` on a Heikin-Ashi chart)
     * yields `"symbol;heikinashi"`, so the derived request keeps the chart type.
     * The other modifier kinds (session, currency, adjustment) can't be honored
     * without a TV datafeed and are dropped, as before.
     */
    inherit(_from_tickerid: any, symbol: any): string;
    /**
     * ticker.new(prefix, ticker, session?, adjustment?, backadjustment?, settlement_as_close?) → simple string
     *
     * Returns "prefix:ticker", or TradingView's encoded form
     * `={"session":"extended","symbol":"prefix:ticker"}` when a modifier is set. Returns
     * the other part if either prefix or ticker is empty.
     */
    new(prefix: any, ticker: any, ...rest: any[]): string;
    /**
     * ticker.modify(tickerid, session?, adjustment?, backadjustment?, settlement_as_close?) → simple string
     *
     * Sets the given modifiers on `tickerid` (plain or encoded), keeping the others.
     */
    modify(tickerid: any, ...rest: any[]): string;
    /**
     * Apply session / adjustment arguments to `modifiers` as TradingView encodes them:
     * `session.regular` and `backadjustment.off` remove the key, `backadjustment.on` is
     * `"default"`, `settlement_as_close.on/off` are `true` / `false`, and `inherit` or an
     * omitted argument keeps the current value.
     */
    private _applyModifiers;
    /**
     * ticker.standard(symbol?) → simple string
     *
     * Returns the symbol stripped of any chart-type modifier suffix —
     * on a Heikin-Ashi chart, `ticker.standard(syminfo.tickerid)` turns
     * `"BINANCE:BTCUSDT;heikinashi"` back into `"BINANCE:BTCUSDT"`, so a
     * `request.security` call on the result fetches STANDARD candles.
     * If `symbol` is undefined, falls back to `syminfo.tickerid`.
     */
    standard(symbol?: any): string;
    /**
     * ticker.heikinashi(symbol) → extended-ticker string
     *
     * Returns the symbol with the Heikin-Ashi chart-type modifier
     * appended (`"BINANCE:BTCUSDT;heikinashi"`). `request.security`
     * passes it through to the data source: an embedding host that owns
     * the Heikin-Ashi transform serves derived bars; PineTS' own bundled
     * providers strip the modifier and serve standard candles (documented
     * standalone limitation). Idempotent on already-modified tickers.
     */
    heikinashi(symbol: any): string;
    /**
     * ticker.renko(symbol, style?, param?, request_wicks?, source?) → simple string
     *
     * Stub: returns the plain symbol. See heikinashi() note.
     */
    renko(symbol: any, _style?: any, _param?: any, _request_wicks?: any, _source?: any): string;
    /**
     * ticker.kagi(symbol, reversal) → simple string
     *
     * Stub: returns the plain symbol. See heikinashi() note.
     */
    kagi(symbol: any, _reversal?: any): string;
    /**
     * ticker.linebreak(symbol, number_of_lines) → simple string
     *
     * Stub: returns the plain symbol. See heikinashi() note.
     */
    linebreak(symbol: any, _number_of_lines?: any): string;
    /**
     * ticker.pointfigure(symbol, source, style, param, reversal) → simple string
     *
     * Stub: returns the plain symbol. See heikinashi() note.
     */
    pointfigure(symbol: any, _source?: any, _style?: any, _param?: any, _reversal?: any): string;
    /**
     * Coerce a runtime value to a plain string. Handles Series wrappers
     * (used by the transpiler), `na`/null/undefined, and primitives.
     */
    private _coerce;
}
