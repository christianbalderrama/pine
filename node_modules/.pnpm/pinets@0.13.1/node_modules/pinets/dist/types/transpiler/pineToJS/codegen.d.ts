interface ParamList {
    names: string[];
    defaults: any[];
}
export declare class CodeGenerator {
    private indent;
    private indentStr;
    private output;
    private sourceCode;
    private sourceLines;
    private lastCommentedLine;
    private includeSourceComments;
    private paramRenameCounter;
    private functionParams;
    private methodParams;
    private userFunctionCollisions;
    private userFunctionRenames;
    private renamedTypeNames;
    private methodNameCounts;
    private stringVarScopes;
    constructor(options?: {
        indentStr?: string;
        sourceCode?: string;
        includeSourceComments?: boolean;
    });
    /**
     * Pine Script treats `_` as a write-only discard identifier: it may be
     * declared any number of times, in any scope, including several times in
     * the same scope (`[_, s, _] = ...` followed by `[_, t, _] = ...`, or a
     * plain `_ = expr` repeated). JavaScript forbids re-declaring a `let`/`var`
     * binding in one scope, so every `_` declaration target is renamed to a
     * fresh `_$N` placeholder. `$` is not a legal Pine identifier character,
     * so the placeholders can never collide with user variables.
     *
     * Non-`_` duplicates inside one tuple (invalid Pine, but tolerated) fall
     * back to a numeric suffix so the generated destructuring stays valid JS.
     */
    private renameDiscardTargets;
    private freshDiscardName;
    generate(ast: any): string;
    private preProcessAST;
    /**
     * Pine keeps UDTs and functions in separate namespaces (`type level` next
     * to `level(...) => line.new(...)`), but both become bindings in one JS
     * scope. The function is renamed with the collision-proof `_$N` suffix:
     * it is only ever referenced as a bare callee, while the type name also
     * lives in annotation strings (`array<level>`, `level l`).
     * Methods are skipped — their `$M_` prefix already avoids the clash.
     */
    private renameFunctionsSharingTypeNames;
    /**
     * Scan the program body for declarations whose names would collide with
     * either Pine namespaces or JavaScript reserved keywords. Rename them
     * with a `_$N` suffix.
     *
     * Two collision classes, one rename pass:
     *
     *  1. Pine namespace collisions (NAMESPACE_COLLISION_NAMES — e.g. `fill`,
     *     `size`, `color`, `line`): user variable would shadow the namespace
     *     destructured from `$.pine`. The CALL SITE `fill(...)` is the
     *     namespace, NOT the renamed variable, so callees are NOT renamed —
     *     UNLESS the user declared a FUNCTION with that name
     *     (`position(x) => close + x`, valid Pine): then a bare call
     *     `position(14)` can only be the user function and its callees ARE
     *     renamed (tracked in `userFunctionCollisions`).
     *
     *  2. JS reserved keyword collisions (JS_RESERVED_WORDS — e.g. `delete`,
     *     `super`, `static`): the generated JS would fail to parse
     *     (`function delete()` → "Unexpected keyword 'delete'"). The CALL SITE
     *     `delete(arg)` IS the user function, so callees MUST be renamed.
     *
     * The walker checks the original name's source list at each call site to
     * pick the right behavior.
     *
     * Renaming rules (common):
     * - Variable declaration target (let fill = ...)  → renamed
     * - Function declaration name (function delete()) → renamed (class 2 only)
     * - UDT type name (type new → const new = Type)   → renamed (class 2 only),
     *   together with every type annotation naming it (`new n = ...`,
     *   `array<new>`, field types, `__pineUdtVar` markers)
     * - Assignment target (fill := ...)               → renamed
     * - Bare identifier read (return fill)            → renamed
     * - MemberExpression object (size.tiny)           → NOT renamed (class 1:
     *   a namespace access) / renamed (class 2: `new.new()`, `delete.x` can
     *   only be the user's UDT or variable — no Pine namespace has that name)
     * - MemberExpression property (obj.delete)        → NOT renamed
     * - Object property key ({size: ...})             → NOT renamed
     *
     * Function parameters shadow a renamed global of the same name inside
     * their function: the body is walked with that name removed from the map.
     * Parameters themselves are renamed later, per function, in
     * `generateFunctionDeclaration`.
     */
    private renameConflictingVariables;
    /**
     * Rewrite a Pine type annotation string (`new`, `array<new>`, `new[]`,
     * `series new`) so renamed UDT names are followed. Only names collected as
     * renamed TYPES are substituted — a variable that shares its name with a
     * built-in type never appears in an annotation.
     */
    private renameTypeString;
    /**
     * True if `name` requires renaming — either a Pine namespace collision
     * or a JS reserved keyword (which would make the generated JS invalid).
     */
    private isReservedName;
    /**
     * Walk the AST and collect declarations whose names conflict with either
     * Pine namespaces (NAMESPACE_COLLISION_NAMES) or JS reserved keywords
     * (JS_RESERVED_WORDS). Both collision classes are renamed with the same
     * `_$N` suffix scheme.
     */
    private collectConflictingVarNames;
    /**
     * Context-aware variable reference renaming.
     * Renames Identifiers that are user-variable references, but skips:
     * - CallExpression callees (namespace function calls)
     * - MemberExpression objects with non-computed property (namespace.member)
     * - MemberExpression non-computed properties (obj.namespace)
     * - Object property keys ({namespace: value})
     */
    private renameVariableRefsInAST;
    private collectFunctionParams;
    writeSourceComment(startLine: any, endLine?: any): void;
    write(str: any): void;
    writeLine(str?: string): void;
    increaseIndent(): void;
    decreaseIndent(): void;
    generateProgram(node: any): void;
    generateStatement(node: any): void;
    generateTypeDefinition(node: any): void;
    private renameIdentifiersInAST;
    private renameParamRefsInBody;
    generateFunctionDeclaration(node: any): void;
    generateVariableDeclaration(node: any): void;
    generateExpressionStatement(node: any): void;
    generateIfStatement(node: any): void;
    generateIfStatementWithAssignment(condExpr: any, varName: any): void;
    generateNestedIfWithAssignments(node: any, varName: any): void;
    generateNestedIfAlternatesWithAssignments(alternate: any, varName: any): void;
    generateForStatement(node: any): void;
    generateWhileStatement(node: any): void;
    generateReturnStatement(node: any): void;
    generateBlockStatement(node: any, addIndent?: boolean): void;
    generateExpression(node: any): void;
    generateLiteral(node: any): void;
    generateBinaryExpression(node: any): void;
    generateUnaryExpression(node: any): void;
    generateAssignmentExpression(node: any): void;
    private isStringVariable;
    generateUpdateExpression(node: any): void;
    /**
     * Overloads (parameters after the receiver) of the user method `obj.name(...)`,
     * or null. A name a built-in method also has, or a namespace receiver
     * (`label.new(...)`), may be a built-in call taking its named arguments as
     * an object, so those are left alone.
     */
    private userMethodParams;
    generateCallExpression(node: any): void;
    calleePath(callee: any): any;
    namedParamsFor(callee: any, positionalCount: any, namedArgs: any): ParamList | null;
    pickOverload(overloads: ParamList[], positionalCount: any, namedArgs: any): ParamList | null;
    generateMemberExpression(node: any): void;
    generateConditionalExpression(node: any): void;
    generateIIFEConditional(node: any): void;
    generateIIFEIfBlock(node: any): void;
    generateNestedIfWithReturns(node: any): void;
    generateNestedIfAlternates(alternate: any): void;
    generateIfWithReturns(node: any): void;
    generateBlockWithReturn(block: any): void;
    generateNestedIfAsExpression(node: any): void;
    generateArrayExpression(node: any): void;
    generateObjectExpression(node: any): void;
    generateSwitchExpression(node: any): void;
    generateSwitchAsIfElseIIFE(node: any): void;
    writeNaForMissingDefault(node: any): void;
    generateSwitchAsIfElse(node: any): void;
    generateLoopAsExpression(node: any, loopType: any): void;
    generateSequenceExpression(node: any): void;
    getPrecedence(node: any): 3 | 5 | 15 | 2 | 4 | 1 | 10 | 0 | 9 | 12 | 13 | 20 | 19;
}
export {};
