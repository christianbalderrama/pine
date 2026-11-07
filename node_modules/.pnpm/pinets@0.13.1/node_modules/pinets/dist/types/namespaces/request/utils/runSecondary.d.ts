/**
 * Run the script of a request.security / request.security_lower_tf secondary
 * context (`pineTS`, already built on the requested symbol + timeframe).
 *
 * It runs the transpile-time slice for this call site when there is one
 * (`context._ltfTruncatedBodies`, keyed by the bare static `pN`; for
 * fn-nested calls the runtime `expressionName` is the path-prefixed
 * `${$$.id}pN`, so the trailing `pN` is the key), else the parent's own
 * transpiled function (`context.transpiledFn`) — never a re-transpile of
 * the source, which a `runPretranspiled()` caller doesn't even have
 * (`context.pineTSCode` is null there). Either way the secondary gets the
 * parent's inputs, so input overrides reach the requested expression.
 */
export declare function runSecondary(context: any, pineTS: any, expressionName: unknown): Promise<any>;
