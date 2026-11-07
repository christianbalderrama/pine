import { Context } from '..';
/**
 * Pine Script `runtime` namespace.
 *
 * `runtime.error(message)` halts script execution with a runtime error,
 * mirroring TradingView behavior. The thrown PineRuntimeError propagates
 * out of the run loop so consumers can catch it (see PineRuntimeError docs).
 */
export declare class Runtime {
    private context;
    constructor(context: Context);
    param(source: any, index?: number, _name?: string): any;
    error(message: any): never;
}
