import { ISymbolInfo, ApiKeyProviderConfig } from '@pinets/marketData/IProvider';
import { BaseProvider } from '@pinets/marketData/BaseProvider';
import { Kline } from '@pinets/marketData/types';
/** Configuration for FMPProvider — requires an API key. */
export interface FMPProviderConfig extends ApiKeyProviderConfig {
    /** Optional: override the base URL (e.g. for proxy or self-hosted). */
    baseUrl?: string;
}
/**
 * Financial Modeling Prep (FMP) market data provider.
 *
 * Supports stocks, ETFs, crypto, and forex via FMP's stable API.
 *
 * ## Usage
 *
 * ### Direct instantiation:
 * ```typescript
 * const fmp = new FMPProvider({ apiKey: 'your-key' });
 * const pineTS = new PineTS(fmp, 'AAPL', 'D', null, sDate, eDate);
 * ```
 *
 * ### Via Provider registry:
 * ```typescript
 * Provider.FMP.configure({ apiKey: 'your-key' });
 * const pineTS = new PineTS(Provider.FMP, 'AAPL', 'D', null, sDate, eDate);
 * ```
 *
 * ## API Key
 * Get a free API key (250 req/day) at https://financialmodelingprep.com/
 * Intraday data (1min, 5min, 15min, 30min, 1h, 4h) requires a paid plan.
 *
 * ## Symbol Format
 * Use standard ticker symbols: `AAPL`, `MSFT`, `SPY`, `BTCUSD`, `EURUSD`
 */
export declare class FMPProvider extends BaseProvider<FMPProviderConfig> {
    private _apiKey;
    private _baseUrl;
    private _profileCache;
    private _symbolInfoCache;
    private _mintickCache;
    constructor(config?: FMPProviderConfig);
    configure(config: FMPProviderConfig): void;
    protected getSupportedTimeframes(): Set<string>;
    protected _getMarketDataNative(tickerId: string, timeframe: string, limit?: number, sDate?: number, eDate?: number): Promise<Kline[]>;
    /**
     * Fetch daily EOD data from FMP and convert to Kline format.
     */
    private _fetchDailyData;
    /**
     * Fetch intraday chart data from FMP and convert to Kline format.
     * Note: Requires a paid FMP plan.
     */
    private _fetchIntradayData;
    getSymbolInfo(tickerId: string): Promise<ISymbolInfo>;
    /**
     * Estimate mintick from historical OHLC data.
     * Computes the smallest non-zero |close - open| and |high - low| diff,
     * then rounds to the nearest power-of-10 bucket.
     * Returns undefined if no valid diffs found.
     */
    private _estimateMintick;
    private _fetchProfile;
    /**
     * Resolve session string and timezone for a ticker by fetching its profile.
     * Falls back to NYSE defaults if profile is unavailable.
     */
    private _resolveSessionInfo;
    /** Convert ms timestamp to FMP date string "YYYY-MM-DD". */
    private _msToDateStr;
    /** Convert FMP date string "YYYY-MM-DD" to ms timestamp (UTC midnight). */
    private _dateStrToMs;
    /** Convert FMP datetime string "YYYY-MM-DD HH:MM:SS" to ms timestamp. */
    private _dateTimeStrToMs;
    /** Heuristic: forex pairs are exactly 6 uppercase chars (two 3-letter currency codes). */
    private _isForex;
    /** Heuristic: crypto tickers end with USD/USDT/BTC/ETH and are not forex pairs. */
    private _isCrypto;
}
