import ScopeManager from '../analysis/ScopeManager';
export declare function createScopedVariableReference(name: string, scopeManager: ScopeManager): any;
export declare function createScopedVariableAccess(name: string, scopeManager: ScopeManager): any;
export declare function transformArrayIndex(node: any, scopeManager: ScopeManager): void;
export declare function addArrayAccess(node: any, scopeManager: ScopeManager): void;
export declare function transformIdentifier(node: any, scopeManager: ScopeManager): void;
export declare const HISTORY_VALUE_OBJECT_TYPES: string[];
/** A built-in variable implemented as a namespace function: `ta.nvi`, `strategy.closedtrades`. */
export declare function isNamespaceVariable(node: any, scopeManager: ScopeManager): boolean;
/**
 * Lowers the offset of a `$.get(<series>, offset)` produced from a history
 * reference, for positions no later identifier walker visits (return values).
 */
export declare function transformHistoryOffset(offset: any, scopeManager: ScopeManager): any;
export declare function transformMemberExpression(memberNode: any, originalParamName: string, scopeManager: ScopeManager): void;
export declare function transformFunctionArgument(arg: any, namespace: string, scopeManager: ScopeManager): any;
/**
 * True when `transformCallExpression` kept a lazy-operand call inline (see
 * LazyOperandPass). Such a node is fully transformed — callee and arguments
 * included — and, unlike an eager call, was NOT replaced by a hoisted
 * `temp_N` identifier. Expression walkers that descend into a call's callee /
 * arguments after transforming it must stop here, otherwise they re-run
 * `transformMemberExpression` on `ns.method` / `ns.param` callees and turn
 * them into bogus `ns.method()(...)` auto-calls.
 */
export declare function isInlinedLazyCall(node: any): boolean;
export declare function transformCallExpression(node: any, scopeManager: ScopeManager, namespace?: string): void;
