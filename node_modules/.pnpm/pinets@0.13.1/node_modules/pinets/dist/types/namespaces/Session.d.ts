/**
 * Pine Script `session` namespace.
 *
 * Constants:
 * - session.regular / session.extended — session-type strings for ticker.new()/ticker.modify().
 *
 * Variables:
 * - session.isfirstbar / session.islastbar — first/last bar of the trading session.
 * - session.isfirstbar_regular / session.islastbar_regular — same, for the regular session.
 * - session.ismarket / session.ispremarket / session.ispostmarket — intra-session location.
 *
 * PineTS providers serve continuous (regular-session) data, and the reference
 * providers are 24/7 crypto markets where a trading session is a calendar day
 * in the exchange timezone. Session boundaries are therefore detected as
 * trading-day changes between consecutive bars in `syminfo.timezone`. All bars
 * belong to the market session, so `ismarket` is always true and the
 * pre/post-market flags are always false.
 */
export declare class Session {
    private context;
    readonly regular = "regular";
    readonly extended = "extended";
    constructor(context: any);
    private get _timezone();
    /** Calendar-day key ("Y-M-D" in exchange timezone) of a bar's open time. */
    private _dayKey;
    get isfirstbar(): boolean;
    get islastbar(): boolean;
    get isfirstbar_regular(): boolean;
    get islastbar_regular(): boolean;
    get ismarket(): boolean;
    get ispremarket(): boolean;
    get ispostmarket(): boolean;
}
