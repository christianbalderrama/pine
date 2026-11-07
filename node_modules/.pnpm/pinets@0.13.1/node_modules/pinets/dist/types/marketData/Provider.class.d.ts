import { IProvider } from './IProvider';
export { BinanceProvider } from './Binance/BinanceProvider.class';
export { FMPProvider } from './FMP/FMPProvider.class';
export { AlpacaProvider } from './Alpaca/AlpacaProvider.class';
export { BaseProvider } from './BaseProvider';
type TProvider = {
    [key: string]: IProvider;
};
export declare const Provider: TProvider;
export declare function registerProvider(name: string, provider: IProvider): void;
