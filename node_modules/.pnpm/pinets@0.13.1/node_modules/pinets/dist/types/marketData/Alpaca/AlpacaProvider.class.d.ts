import { ISymbolInfo, ApiKeyProviderConfig } from '@pinets/marketData/IProvider';
import { BaseProvider } from '@pinets/marketData/BaseProvider';
import { Kline } from '@pinets/marketData/types';
/**
 * Configuration for AlpacaProvider.
 *
 * @property apiKey    - Alpaca API Key ID
 * @property apiSecret - Alpaca API Secret Key
 * @property paper     - Use paper trading endpoint for asset info (default: true)
 * @property feed      - Market data feed: 'sip' (paid, full market) or 'iex' (free tier). Default: 'sip'
 * @property dataUrl   - Override the market data base URL
 * @property tradingUrl - Override the trading/asset API base URL
 */
export interface AlpacaProviderConfig extends ApiKeyProviderConfig {
    apiSecret: string;
    paper?: boolean;
    feed?: 'sip' | 'iex';
    dataUrl?: string;
    tradingUrl?: string;
}
/**
 * Alpaca Markets data provider.
 *
 * Supports US stocks and crypto via Alpaca's Market Data API v2.
 * All timeframes (1Min through 1Month) are natively supported.
 *
 * ## Usage
 *
 * ### Direct instantiation:
 * ```typescript
 * const alpaca = new AlpacaProvider({
 *     apiKey: 'PK...',
 *     apiSecret: '...',
 * });
 * const pineTS = new PineTS(alpaca, 'AAPL', 'D', null, sDate, eDate);
 * ```
 *
 * ### Via Provider registry:
 * ```typescript
 * Provider.Alpaca.configure({ apiKey: 'PK...', apiSecret: '...' });
 * const pineTS = new PineTS(Provider.Alpaca, 'AAPL', 'D', null, sDate, eDate);
 * ```
 *
 * ## API Keys
 * Get free API keys at https://alpaca.markets/
 * Free tier provides IEX data; paid plan adds SIP (full market) data.
 *
 * ## Symbol Format
 * - Stocks: `AAPL`, `MSFT`, `SPY`
 * - Crypto: `BTC/USD`, `ETH/USD` (slash notation)
 */
export declare class AlpacaProvider extends BaseProvider<AlpacaProviderConfig> {
    private _apiKey;
    private _apiSecret;
    private _dataUrl;
    private _tradingUrl;
    private _feed;
    private _assetCache;
    /** Calendar cache: date string "YYYY-MM-DD" → { open, close } times. */
    private _calendarCache;
    constructor(config?: AlpacaProviderConfig);
    configure(config: AlpacaProviderConfig): void;
    private _headers;
    protected getSupportedTimeframes(): Set<string>;
    protected _getMarketDataNative(tickerId: string, timeframe: string, limit?: number, sDate?: number, eDate?: number): Promise<Kline[]>;
    /**
     * Fetch all bars with automatic pagination.
     */
    private _fetchAllBars;
    /**
     * Build the bars URL for stocks or crypto.
     */
    private _buildBarsUrl;
    getSymbolInfo(tickerId: string): Promise<ISymbolInfo>;
    /**
     * Convert bars for crypto (24/7 — no session boundaries).
     * closeTime = next bar's openTime, or openTime + period for last bar.
     */
    private _convertBarsCrypto;
    /**
     * Convert bars for stocks using the Alpaca trading calendar.
     * closeTime = exact session close from the calendar (handles early closes, DST).
     */
    private _convertBarsStock;
    /** Build a Kline from an AlpacaBar + computed times. */
    private _toKline;
    /**
     * Find the last trading day of the week containing `barDate` and return
     * its session close time in UTC ms.
     */
    private _weeklyCloseFromCalendar;
    /**
     * Find the last trading day of the month containing `barDate` and return
     * its session close time in UTC ms.
     */
    private _monthlyCloseFromCalendar;
    /**
     * Ensure the calendar cache covers the given date range.
     * Fetches from Alpaca's `GET /v2/calendar` endpoint, which returns
     * per-day trading hours including early closes (data from 1970-2029).
     */
    private _ensureCalendar;
    private _fetchAsset;
    /**
     * Parse an Alpaca timeframe string (e.g., '1Min', '4Hour', '1Month')
     * into a PeriodType and multiplier for calendar-aware date math.
     */
    private _parseAlpacaTimeframe;
    /** Resolve PineTS timeframe to Alpaca timeframe string. */
    private _resolveTimeframe;
    /** Heuristic: crypto tickers contain '/'. */
    private _isCrypto;
    /** Add N days to a "YYYY-MM-DD" date string. */
    private _addDaysToDate;
}
