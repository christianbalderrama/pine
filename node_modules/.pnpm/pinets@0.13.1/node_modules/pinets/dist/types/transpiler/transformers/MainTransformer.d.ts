import ScopeManager from '../analysis/ScopeManager';
/**
 * Post-pass: propagate async/await through user-defined function call chains.
 *
 * When request.security() is used inside a user-defined function, the transpiler
 * injects `await` but doesn't mark the function as `async` or propagate await
 * to callers via $.call(). This pass:
 * 1. Finds all FunctionDeclarations containing AwaitExpression (directly, not in nested functions)
 * 2. Marks them as async
 * 3. Wraps $.call(fn, ...) invocations of those functions in AwaitExpression
 * 4. Repeats until stable (handles transitive async infection: A calls B calls request.security)
 */
export declare function propagateAsyncAwait(ast: any): void;
export declare function transformEqualityChecks(ast: any): void;
export declare function transformStrictLogicalOperators(ast: any): void;
export declare function transformDisplayArithmetic(ast: any): void;
export declare function runTransformationPass(ast: any, scopeManager: ScopeManager, originalParamName: string, options?: {
    debug: boolean;
    ln?: boolean;
}, sourceLines?: string[]): void;
