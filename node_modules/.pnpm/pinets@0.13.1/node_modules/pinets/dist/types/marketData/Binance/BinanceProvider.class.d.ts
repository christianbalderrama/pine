import { ISymbolInfo } from '@pinets/marketData/IProvider';
import { BaseProvider } from '@pinets/marketData/BaseProvider';
import { Kline } from '@pinets/marketData/types';
/** Config for BinanceProvider (no API key needed). */
export interface BinanceProviderConfig {
}
export declare class BinanceProvider extends BaseProvider<BinanceProviderConfig> {
    private cacheManager;
    private activeApiUrl;
    constructor();
    /**
     * Resolves the working Binance API endpoint.
     * Tries default first, then falls back to US endpoint.
     * Caches the working endpoint for future calls.
     */
    private getBaseUrl;
    /**
     * Fetch a single chunk of raw kline data from the Binance API (no closeTime normalization).
     * Used internally by pagination methods that assemble chunks before normalizing.
     */
    private _fetchRawChunk;
    getMarketDataInterval(tickerId: string, timeframe: string, sDate: number, eDate: number): Promise<Kline[]>;
    private getMarketDataBackwards;
    protected getSupportedTimeframes(): Set<string>;
    protected aggregatesOnCalendarGrid(): boolean;
    protected _getMarketDataNative(tickerId: string, timeframe: string, limit?: number, sDate?: number, eDate?: number): Promise<Kline[]>;
    /**
     * Determines if pagination is needed based on the parameters
     */
    private shouldPaginate;
    getSymbolInfo(tickerId: string): Promise<ISymbolInfo>;
}
