import { IProvider } from './marketData/IProvider';
import { PineArray } from './namespaces/array/array.index';
import { Input } from './namespaces/input/input.index';
import PineMath from './namespaces/math/math.index';
import { PineRequest } from './namespaces/request/request.index';
import TechnicalAnalysis from './namespaces/ta/ta.index';
import { StrategyState } from './namespaces/strategy/strategy.index';
import { Series } from './Series';
import type { IImportResolver } from './imports/IImportResolver';
import type { IndicatorOptions } from './types/PineTypes';
export declare class Context {
    data: any;
    indicator: IndicatorOptions;
    cache: any;
    taState: any;
    strategy?: StrategyState;
    isSecondaryContext: boolean;
    chartTimezone: string | null;
    chartStyle: string;
    dataVersion: number;
    __maxLoops: number;
    NA: any;
    /** Runtime warnings (OOB access, etc.) — non-blocking, script continues. */
    warnings: {
        message: string;
        method?: string;
        bar: number;
    }[];
    /** Alert events emitted by alert() and alertcondition() calls. */
    alerts: {
        type: string;
        id: string;
        message: string;
        title?: string;
        freq?: string;
        bar_index: number;
        time: number;
    }[];
    /** Alert mode: 'realtime' = only fire on live bars (TV behavior), 'all' = fire on every bar (backtest). */
    _alertMode: 'realtime' | 'all';
    /** The strategy broker trades on the tick grid (see PineTS.setFillsOnTickGrid). */
    _fillsOnTickGrid: boolean;
    /** Resolver of `import`ed libraries (see PineTS.setImportResolver), inherited by request.* secondary contexts. */
    importResolver: IImportResolver | null;
    /** The current bar's raw prices while the broker works on its tick-grid copy. */
    _rawBar?: {
        open: number;
        high: number;
        low: number;
        close: number;
    };
    /** Name-keyed map of declaration-prop overrides from `Indicator.prop`. Layered on top of
     *  the source's `indicator()`/`strategy()` call args inside the per-bar handlers
     *  (see Core.indicator and initializeStrategy). Empty object when no overrides are set. */
    _propOverrides: Record<string, unknown>;
    /** Monotonically increasing counter, incremented each time a bar starts executing.
     *  Used by alertcondition/AlertHelper to detect re-execution of the same bar. */
    _execTick: number;
    /** Emit a runtime warning. The script continues execution (returns na/no-op). */
    warn(message: string, method?: string): void;
    lang: any;
    length: number;
    /** References to drawing helpers for streaming rollback and plot sync */
    _drawingHelpers: {
        rollbackFromBar(barIdx: number): void;
        syncToPlot?(): void;
    }[];
    pine: {
        [key: string]: any;
    };
    private static _deprecationWarningsShown;
    idx: number;
    params: any;
    const: any;
    var: any;
    let: any;
    lctx: Map<string, any>;
    result: any;
    plots: any;
    marketData: any;
    source: IProvider | any[];
    tickerId: string;
    timeframe: string;
    /** `//@version=` of the running Pine Script source; null for PineTS syntax. */
    pineVersion: number | null;
    limit: number;
    sDate: number;
    eDate: number;
    fullContext: Context;
    viewportLeft: number | undefined;
    viewportRight: number | undefined;
    pineTSCode: Function | String;
    /** The transpiled function this context runs (what request.security
     *  secondaries run when their call site has no slice). */
    transpiledFn: Function | null;
    inputs: Record<string, any>;
    constructor({ marketData, source, tickerId, timeframe, limit, sDate, eDate, fullContext, inputs, }: {
        marketData: any;
        source: IProvider | any[];
        tickerId?: string;
        timeframe?: string;
        limit?: number;
        sDate?: number;
        eDate?: number;
        fullContext?: Context;
        inputs?: Record<string, any>;
    });
    /**
     * Roll back all drawing objects created at or after the given bar index.
     * Called during streaming updates to prevent accumulation when bars are re-processed.
     */
    rollbackDrawings(fromBarIdx: number): void;
    private bindContextObject;
    /**
     * Normalizes the right-hand side of a tuple declaration (`[a, b] = ...`) to the
     * double-bracket tuple convention `[[a, b]]` expected by `init()`.
     *
     * Function returns and request.* results are already double-bracketed, but a
     * tuple produced by an if / switch / loop expression arrives flat (`[a, b]`),
     * and a local block that returned nothing (an `if` without `else`, a loop that
     * never ran) arrives as na: Pine yields na for every item in that case.
     * No Pine value is a JS array (Pine arrays, maps, UDTs are objects), so a flat
     * array here is always a single-bracket tuple, never a series.
     */
    toTuple(value: any, arity: number): any[][];
    /**
     * this function is used to initialize the target variable with the source array
     * this array will represent a time series and its values will be shifted at runtime in order to mimic Pine script behavior
     * @param trg - the target variable name : used internally to maintain the series in the execution context
     * @param src - the source data, can be Series, array, or a single value
     * @param idx - the index of the source array, used to get a sub-series of the source data
     * @returns Series object
     */
    init(trg: any, src: any, idx?: number): Series;
    /** A Series over `data`; a Pine v6 bool series reads `false` before its first bar. */
    private typedSeries;
    /**
     * Initializes a 'var' variable.
     * - First bar: uses the initial value.
     * - Subsequent bars: maintains the previous value (state).
     * @param trg - The target variable
     * @param src - The source initializer value
     * @param varip - true for a `varip` declaration (exempt from the per-bar rollback)
     * @returns Series object
     */
    initVar(trg: any, src: any, varip?: boolean): Series;
    /**
     * this function is used to set the floating point precision of a number
     * by default it is set to 10 decimals which is the same as pine script
     * @param n - the number to be precision
     * @param decimals - the number of decimals to precision to
     * @returns the precision number
     */
    private static readonly PRECISION_EPSILON;
    precision(value: number, decimals?: number): number;
    /**
     * This function is used to apply special transformation to internal PineTS parameters and handle them as time-series
     * @param source - the source data, can be an array or a single value
     * @param index - the index of the source array, used to get a sub-series of the source data
     * @param name - the name of the parameter, used as a unique identifier in the current execution context, this allows us to properly handle the param as a series
     * @returns the current value of the param
     */
    param(source: any, index: any, name?: string): any;
    /**
     * Access a series value with Pine Script semantics (reverse order)
     * @param source - The source series or array
     * @param index - The lookback index (0 = current value)
     */
    get(source: any, index: number): any;
    /**
     * Set the current value of a series (index 0)
     * @param target - The target series or array
     * @param value - The value to set
     */
    set(target: any, value: any): void;
    /**
     * Resolve an iterable for `for x in collection` codegen.
     * Handles PineArrayObject (unwrap to inner JS array) and plain JS arrays uniformly.
     * Returns the value itself if it's already iterable (Map, Set, etc.).
     *
     * Centralizing this here means the transpiler can emit a uniform shape regardless of
     * whether the iterable is a built-in returning a plain array (e.g. box.all) or a UDT
     * field holding a PineArrayObject — and future collection types only need to update
     * this helper, not the codegen.
     */
    iter(source: any): any;
    /** A matrix iterates its rows, each a copy as returned by `matrix.row()`. */
    private _matrixRows;
    /**
     * Resolve an iterable yielding [key, value] tuples for `for [k, v] in collection`
     * destructuring codegen. PineArrayObject's [Symbol.iterator] yields scalar values, so
     * we must explicitly call `.entries()` on the underlying array. PineMapObject stores
     * its data on `.map` (a JS Map) — without this branch the fallthrough returned an
     * empty iterator and `for [k,v] in map` silently iterated 0 times.
     */
    entries(source: any): IterableIterator<[any, any]>;
    private _callStack;
    /**
     * Cumulative call-path stack. Each entry is the full path from the root to
     * the current call, formed by joining the syntactic call-site ids with '|'.
     *
     * Pine semantics is per-call-PATH (not per-syntactic-call-site): a function
     * with internal `var` state, called via two distinct paths through a wrapper,
     * must keep state independent per path. Keying lctx by the path (rather than
     * the immediate site id) makes `$$.var.*` slots and `$$.id + '_taN'` ta
     * callsite ids correctly path-scoped without any transpiler changes.
     */
    private _pathStack;
    /**
     * Pushes a call ID onto the stack
     * @param id - The call ID
     */
    pushId(id: string): void;
    /**
     * Pops a call ID from the stack
     */
    popId(): void;
    /**
     * Returns the current call PATH (cumulative ids joined by '|') from the top
     * of the stack. Used as the lctx key for the current function call.
     */
    peekId(): string;
    /**
     * Returns the local context object for the current call ID.
     * Creates it if it doesn't exist.
     */
    peekCtx(): any;
    /**
     * Receiver of a drawing getter / setter call (`b.get_left()`, `t.box.set_right(x)`): the
     * drawing itself, or for an na drawing a stand-in whose getters return na (`get_text` the
     * na string) and whose setters do nothing, as on TradingView.
     */
    /**
     * Halt the script with a loop-limit runtime error. The transpiler's loop
     * guard calls this (`$.loopError(...)`) instead of `throw new Error(...)` so
     * the fault is a `PineRuntimeError` — a host can tell a script-level loop-limit
     * kill from a general engine error by `instanceof`, as the docs promise.
     */
    loopError(message: string): never;
    drawingOrNa(receiver: any): any;
    /**
     * Calls a function with a specific call ID context
     * @param fn - The function to call
     * @param id - The call ID to use
     * @param args - Arguments to pass to the function
     */
    call(fn: Function, id: string, ...args: any[]): any;
    /**
     * `receiver.name(args)` where a user `method` of that name may or may not apply, decided from
     * the receiver's runtime type (see `receiverMatchesMethod`). No match runs the built-in member
     * instead; calling any method on `na` is a no-op, like everywhere else in Pine.
     * @param name - the Pine method name
     * @param id - the call ID for the user method's local context
     * @param candidates - `[userFunction, udtName | null]` per overload, in declaration order
     * @param receiver - the receiver, wrapped like any user-function argument
     */
    callMethod(name: string, id: string, candidates: any[][], receiver: any, ...args: any[]): any;
    /**
     * @deprecated Use context.pine.math instead. This will be removed in a future version.
     */
    get math(): PineMath;
    /**
     * @deprecated Use context.pine.ta instead. This will be removed in a future version.
     */
    get ta(): TechnicalAnalysis;
    /**
     * @deprecated Use context.pine.input instead. This will be removed in a future version.
     */
    get input(): Input;
    /**
     * @deprecated Use context.pine.request instead. This will be removed in a future version.
     */
    get request(): PineRequest;
    /**
     * @deprecated Use context.pine.array instead. This will be removed in a future version.
     */
    get array(): PineArray;
    /**
     * @deprecated Use context.pine.* (e.g., context.pine.na, context.pine.plot) instead. This will be removed in a future version.
     */
    get core(): any;
    /**
     * Shows a deprecation warning once per property access pattern
     */
    private _showDeprecationWarning;
}
export default Context;
