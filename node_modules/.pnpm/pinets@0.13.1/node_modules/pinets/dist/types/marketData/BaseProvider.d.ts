import { IProvider, ISymbolInfo, BaseProviderConfig } from './IProvider';
import { Kline } from './types';
/**
 * Abstract base class for market data providers.
 *
 * Provides shared logic: closeTime normalization, fail-early API key
 * validation, and **automatic candle aggregation** for unsupported
 * timeframes.
 *
 * ## Aggregation
 *
 * When a provider doesn't natively support a timeframe, `getMarketData()`
 * automatically:
 * 1. Selects the best sub-timeframe the provider supports
 * 2. Fetches sub-candles via `_getMarketDataNative()`
 * 3. Aggregates them into the requested timeframe
 *
 * Providers declare native support via `getSupportedTimeframes()` and
 * implement `_getMarketDataNative()` for the actual API call.
 *
 * ## Usage
 *
 * ```typescript
 * class MyProvider extends BaseProvider<MyConfig> {
 *     protected getSupportedTimeframes() {
 *         return new Set(['1', '5', '15', '60', 'D']);
 *     }
 *     protected async _getMarketDataNative(...) { ... }
 * }
 * ```
 */
export declare abstract class BaseProvider<TConfig extends BaseProviderConfig = BaseProviderConfig> implements IProvider {
    private _configured;
    private _requiresApiKey;
    private _providerName;
    private _aggregationSubTimeframe;
    constructor(options: {
        requiresApiKey: boolean;
        providerName: string;
    });
    /**
     * Fail-early check — call at the top of `_getMarketDataNative()` / `getSymbolInfo()`
     * in providers that require an API key.
     */
    protected ensureConfigured(): void;
    /**
     * Base configure — marks the provider as configured.
     * Subclasses override to store their specific config, and must call `super.configure(config)`.
     */
    configure(config: TConfig): void;
    /** Whether this provider has been configured (always true for keyless providers). */
    get isConfigured(): boolean;
    /**
     * Shared closeTime normalization utility.
     * Delegates to the standalone `normalizeCloseTime()` from `types.ts`.
     */
    protected normalizeCloseTime(data: Kline[]): void;
    /**
     * Override the sub-timeframe used for aggregation.
     * When set, this timeframe is used instead of auto-selecting the best divisor.
     * Set to `null` to re-enable automatic selection.
     */
    setAggregationSubTimeframe(subTimeframe: string | null): void;
    /**
     * Return the set of timeframes this provider supports natively.
     *
     * Override in subclasses. Default: all canonical timeframes (no aggregation).
     * Use canonical keys: '1','3','5','15','30','45','60','120','180','240','D','W','M'
     * and optionally second-based: '1S','5S','10S','15S','30S'.
     */
    protected getSupportedTimeframes(): Set<string>;
    /**
     * Whether aggregated bars follow TradingView's UTC calendar grid (see `aggregateCandles`).
     * Override to return true in providers of UTC 24/7 markets.
     */
    protected aggregatesOnCalendarGrid(): boolean;
    /**
     * Fetch market data — delegates to native fetch or aggregates from sub-candles.
     *
     * 1. If the timeframe is natively supported, delegates to `_getMarketDataNative()`.
     * 2. Otherwise, selects the best sub-timeframe, fetches sub-candles, and aggregates.
     */
    getMarketData(tickerId: string, timeframe: string, limit?: number, sDate?: number, eDate?: number): Promise<Kline[]>;
    /**
     * Fetch market data natively from the provider's API.
     *
     * Subclasses MUST implement this. It is called by the BaseProvider
     * orchestrator either for the requested timeframe (if natively supported)
     * or for a sub-candle timeframe (if aggregation is needed).
     */
    protected abstract _getMarketDataNative(tickerId: string, timeframe: string, limit?: number, sDate?: number, eDate?: number): Promise<Kline[]>;
    abstract getSymbolInfo(tickerId: string): Promise<ISymbolInfo>;
    /**
     * Compute how many sub-candles to fetch to produce `limit` aggregated candles.
     */
    private _computeSubLimit;
}
