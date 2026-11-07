import { Token } from './tokens';
import { Program, VariableDeclaration, FunctionDeclaration, TypeDefinition, IfStatement, ForStatement, WhileStatement, BlockStatement, CallExpression, ArrayExpression, SwitchExpression } from './ast';
export declare class Parser {
    private tokens;
    private pos;
    private functionNames;
    private typeNames;
    private typeVariableNames;
    private paramScopes;
    private loopValueCounter;
    private onceCounter;
    private functionTupleArity;
    private functionParamNames;
    private tupleLiteralStart;
    private forLoopCount;
    constructor(tokens: Token[]);
    peek(offset?: number): Token;
    private isCurrentFunctionParam;
    advance(): Token;
    match(type: any, value?: any): boolean;
    expect(type: any, value?: any): Token;
    /**
     * Error for a token that cannot start / continue what is being parsed.
     * Two layout situations are baffling without context and get a specific
     * message: an INDENT where a statement was expected (the line is indented
     * as a local block, but nothing opened one), and a token the lexer joined
     * onto the previous line because of Pine's line-wrapping rule.
     */
    private unexpected;
    /** Suffix explaining that `token` starts a line the lexer joined onto the previous one. */
    private layoutHint;
    /**
     * After a complete statement, the next token must start a new line. The
     * only way it cannot is when the lexer joined the following line onto
     * this one (indentation not a multiple of four) and the statement did not
     * absorb it: `    v := 1` followed by `      v := 2`. TradingView rejects
     * that ("Syntax error at input 'v'"); so do we, with the reason.
     *
     * A wrapped COMMA is left alone: `a = 0, b = 1` ⏎ ` , c = 2` continues the
     * statement sequence, which the caller consumes. Where a comma is not
     * valid it fails on its own, with the same layout hint.
     */
    private rejectDanglingWrappedLine;
    /**
     * True when the current token is the first token of a new logical line:
     * the previous token (looking past DEDENTs) is a NEWLINE, or sits on an
     * earlier physical line without the current token being a lexer-joined
     * wrapped line.
     */
    private startsNewLine;
    /**
     * TradingView's error for a keyword or reserved word used where a new name
     * is declared (variable, function, parameter, UDT field, type or enum
     * name). `text`, `range`, `return`, ... carry no syntax of their own but
     * are still rejected here; `type`/`method`/`enum` never reach this point
     * because the lexer already downgraded them to identifiers outside their
     * declaration position.
     */
    private reservedNameError;
    private isReservedName;
    /**
     * Consume the name being declared. Rejects keywords and reserved words
     * with TradingView's message; the lexer has already turned contextual
     * keywords (`type`, `method`, `enum`) into identifiers here.
     *
     * Not used for tuple destructuring targets (`[text, b] = f()`), which
     * TradingView accepts unchecked.
     */
    expectName(): Token;
    /**
     * Same check for a declaration recognised only after its target was parsed
     * as an expression (`text = close` → VariableDeclaration). `startToken` is
     * the first token of the statement, where TradingView reports the error.
     */
    private assertDeclarableName;
    /**
     * A function parameter's default must be a literal or a built-in variable:
     * TradingView rejects calls (`a = input(14)`, `a = math.max(1, 2)`) and
     * calculations (`a = 2 + 2`). `startToken` is the parameter's first token,
     * where TradingView reports the error.
     */
    private assertParamDefault;
    /** `line:column` of a token's first character (tokens carry the column just past their end). */
    private startOf;
    /** `ta.sma` for a callee built from identifiers only, otherwise null. */
    private dottedName;
    /** Tuple size returned by a call to a user function, when statically known. */
    private tupleArityOf;
    /** Pine has no tuple literals outside a local block's return value: `u = [a, b]`, `[u, v] = [a, b]`. */
    private assertNotTupleLiteral;
    /** `u = f()` where `f` returns a tuple, or `u = [a, b]`: TradingView rejects the declaration. */
    private assertNotTupleAssignment;
    /**
     * `keyword = expr` at statement start (`in = close`, `import = 1`): the
     * expression parser would only report a generic unexpected-token error;
     * TradingView reports the reserved-name error instead.
     */
    private rejectReservedAssignmentTarget;
    /**
     * IDENTIFIER, or a keyword sitting where a declared name belongs (so the
     * declaration parser can reject it with the reserved-name error). Keywords
     * that open their own statement are excluded so lookaheads never mistake
     * `if (...)` / `switch (...)` for a declaration.
     */
    private isNameSlot;
    private static readonly STATEMENT_KEYWORDS;
    peekOperatorEx(validOps: string[]): any;
    isLayoutToken(): boolean;
    skipNewlines(allowIndent?: boolean): void;
    parse(): Program;
    private parseTopLevelStatement;
    private isImportStatement;
    private isExportStatement;
    private collectTopLevelFunctionNames;
    private variableName;
    private isTypeMemberAccess;
    private isOnceStatement;
    private parseOnceStatement;
    parseStatement(handleCommas?: boolean): any;
    isFunctionDeclaration(): boolean;
    parseTypeExpression(): any;
    parseEnumDefinition(): any;
    parseTypeDefinition(): TypeDefinition;
    /** Type of an untyped UDT field, from its default value. */
    inferFieldType(expr: any): string;
    parseVarDeclaration(): VariableDeclaration;
    isTypedVarDeclaration(): boolean;
    parseTypedVarDeclaration(): VariableDeclaration;
    parseFunctionDeclaration(): FunctionDeclaration;
    private isDottedParamType;
    parseMethodDeclaration(): FunctionDeclaration;
    parseFunctionBody(): BlockStatement;
    /**
     * Recursively convert the last statement in a statement list to a ReturnStatement.
     *
     * A Pine function evaluates to the value of its last statement, whatever kind of
     * statement that is — not just a bare expression. `f(a) =>\n    b = a * 2` returns
     * `a * 2` on TradingView, and a trailing loop returns whatever its body produced on
     * the final iteration. Handles if/else chains by adding a return to each branch.
     */
    private _addImplicitReturn;
    /**
     * Give a trailing loop a value: Pine yields whatever the loop body's last statement
     * produced on its final iteration, or na when the body never ran (or the final
     * iteration skipped it). Captures that into a temp reset at the top of each iteration
     * and returns the temp's name, or null when the loop body has no value.
     */
    private _captureLoopValue;
    /** A block used as a value (switch arm, if-expression branch) that ends in a loop takes the loop's value. */
    private _valueOfTrailingLoop;
    /**
     * Rewrite the last statement of `statements` so its value flows into `emit`
     * (a `return`, or an assignment to a temp). Recurses into if/else branches and
     * trailing loops. Returns false when the last statement has no usable value (`break`, …).
     */
    private _emitLastValue;
    private continueSequence;
    parseStatementOrSequence(): any;
    parseIfStatement(): IfStatement;
    parseForStatement(): ForStatement;
    parseWhileStatement(): WhileStatement;
    parseBlock(): BlockStatement;
    isTupleDestructuring(): boolean;
    parseTupleDestructuring(): VariableDeclaration;
    parseExpression(): any;
    parseTernary(): any;
    parseLogicalOr(): any;
    parseLogicalAnd(): any;
    parseEquality(): any;
    parseComparison(): any;
    parseAdditive(): any;
    parseMultiplicative(): any;
    parseUnary(): any;
    parsePostfix(): any;
    parseCallExpression(callee: any): CallExpression;
    parsePrimary(): any;
    parseArrayLiteral(): ArrayExpression;
    parseIfExpression(): any;
    needsIIFE(consequentStmts: any, alternateStmts: any): any;
    parseSwitchExpression(): SwitchExpression;
    parseForExpression(): ForStatement;
    parseWhileExpression(): WhileStatement;
    getBlockValue(statements: any): any;
}
