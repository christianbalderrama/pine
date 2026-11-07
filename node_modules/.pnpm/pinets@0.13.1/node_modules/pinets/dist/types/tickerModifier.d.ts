/**
 * Session / adjustment modifiers of a ticker id, keyed as in TradingView's encoded form
 * `={"adjustment":"splits","session":"extended","symbol":"BINANCE:BTCUSDT"}`.
 */
export type TickerModifiers = Record<string, string | boolean>;
/** Split TradingView's encoded ticker id into its symbol and modifiers. Plain ids have no modifiers. */
export declare function decodeTickerId(tickerId: string): {
    symbol: string;
    modifiers: TickerModifiers;
};
/** TradingView's ticker id for `symbol` with `modifiers`: the plain symbol, or `={...}` with sorted keys. */
export declare function encodeTickerId(symbol: string, modifiers: TickerModifiers): string;
/**
 * Split `"SYM;modifier"` into its parts. Plain symbols yield `modifier: null`. The symbol is always
 * plain: session / adjustment modifiers of an encoded id (`={"session":…,"symbol":"SYM"}`) are dropped.
 */
export declare function splitTickerModifier(tickerId: string): {
    symbol: string;
    modifier: string | null;
};
/**
 * The ticker id a data source can serve: an encoded id's symbol, keeping a chart-type suffix
 * (`={"session":"extended","symbol":"SYM"};heikinashi` → `SYM;heikinashi`). Session and
 * adjustment modifiers are dropped: no bundled provider serves them.
 */
export declare function plainTickerId(tickerId: string): string;
/** The plain symbol with any chart-type modifier removed. */
export declare function stripTickerModifier(tickerId: string): string;
/**
 * Append a chart-type modifier (replacing any existing one; idempotent). Session / adjustment
 * modifiers of an encoded id are kept, so the order of `ticker.heikinashi` / `ticker.modify` does not matter.
 */
export declare function withTickerModifier(tickerId: string, modifier: string): string;
