export declare class Timeframe {
    private context;
    private _chart;
    constructor(context: any);
    param(source: any, index?: number, name?: string): any;
    /** Parsed chart timeframe (cached); null when the context timeframe is not a valid timeframe string. */
    private get chart();
    /** A timeframe argument; "" / na means the chart timeframe. Throws like TradingView on anything else. */
    private resolve;
    private get periodString();
    get main_period(): string;
    get period(): string;
    get multiplier(): number;
    get isdwm(): boolean;
    get isdaily(): boolean;
    get isweekly(): boolean;
    get ismonthly(): boolean;
    get isticks(): boolean;
    get isseconds(): boolean;
    get isminutes(): boolean;
    get isintraday(): boolean;
    /**
     * True on the first bar of a new `timeframe` period: the current and previous bar
     * opens fall in different bars of that timeframe.
     */
    change(timeframe: any): boolean;
    from_seconds(seconds: any): string | number;
    in_seconds(timeframe?: any): number;
}
