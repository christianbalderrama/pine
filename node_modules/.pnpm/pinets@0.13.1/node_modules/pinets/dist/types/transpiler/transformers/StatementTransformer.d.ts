import ScopeManager from '../analysis/ScopeManager';
/**
 * Creates the AST nodes for a loop guard:
 * 1. A counter declaration: `let __lgN = 0;` (to be hoisted before the loop)
 * 2. A guard check: `if (++__lgN > __maxLoops) $.loopError("Loop exceeded maximum iterations (__lgN)");`
 *    (to be prepended to the loop body). `$.loopError` throws a PineRuntimeError
 *    so a host can tell a loop-limit kill from a general engine error.
 */
export declare function createLoopGuardNodes(guardName: string): {
    counterDecl: any;
    guardCheck: any;
};
export declare function transformAssignmentExpression(node: any, scopeManager: ScopeManager): void;
/**
 * Transform the identifiers, calls and IIFEs (switch / multi-line `if` expressions) of an initializer
 * expression in place. Also used for the right side of `:=` when it holds an IIFE.
 */
export declare function walkInitExpression(expr: any, scopeManager: ScopeManager): void;
export declare function transformVariableDeclaration(varNode: any, scopeManager: ScopeManager): void;
export declare function transformForStatement(node: any, scopeManager: ScopeManager, c: any): void;
export declare function transformWhileStatement(node: any, scopeManager: ScopeManager, c: any): void;
export declare function transformExpression(node: any, scopeManager: ScopeManager): void;
export declare function transformIfStatement(node: any, scopeManager: ScopeManager, c: any): void;
export declare function transformReturnStatement(node: any, scopeManager: ScopeManager): void;
export declare function transformFunctionDeclaration(node: any, scopeManager: ScopeManager, c: any): void;
