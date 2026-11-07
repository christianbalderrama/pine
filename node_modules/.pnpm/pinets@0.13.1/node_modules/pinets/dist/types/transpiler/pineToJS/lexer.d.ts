import { Token } from './tokens';
export declare class Lexer {
    static readonly TAB_WIDTH = 4;
    private source;
    private pos;
    private line;
    private column;
    private tokens;
    private indentStack;
    private atLineStart;
    private parenDepth;
    private bracketDepth;
    private braceDepth;
    private pendingWrap;
    constructor(source: string);
    tokenize(): Token[];
    /**
     * `type`, `method` and `enum` are keywords only where they introduce a
     * declaration: first token of a logical line (optionally after `export`)
     * and followed by a name — `type Foo`, `method float f(`, `enum E`.
     * Anywhere else TradingView treats them as plain identifiers:
     * `type = close`, `method(x) => x`, `var enum = 0`, `int type = 0`,
     * `t.type`, `switch method`. Downgrade those occurrences to IDENTIFIER so
     * the parser only ever sees the keyword form in declaration position.
     *
     * NEWLINE/INDENT/DEDENT and comment-only lines are layout. A token the
     * lexer joined onto the previous line (`wrapped`) is never a line start.
     */
    private resolveContextualKeywords;
    handleNewline(): void;
    /**
     * Handle indentation at start of line.
     *
     * TradingView measures a line's indentation in columns, a tab counting as
     * four (verified: `  \t` and `\t  ` both behave as six columns, not as a
     * tab stop). What the width means:
     *
     *   - A multiple of four is a block level. One level deeper than the
     *     enclosing block opens a local block; the same level is a sibling
     *     statement; shallower closes blocks. Jumping more than one level
     *     deeper is a compile error on TradingView ("Mismatched input ...
     *     expecting 'end of line without line continuation'").
     *   - Anything else is LINE WRAPPING: the line continues the previous
     *     logical line, whatever it starts with (`- r2`, `.size()`, `2`,
     *     `? a`). Whether the joined line parses is then the parser's call —
     *     `if x` + `  y := 1` is rejected by TradingView as a syntax error,
     *     not as an indentation error.
     *
     * Wrapped lines are joined here by dropping the NEWLINE (and trailing
     * comment) tokens that separated them from the previous line, so the
     * parser only ever sees NEWLINE between real statements and never has to
     * guess whether a leading `-` is a binary continuation or a new unary
     * statement (TradingView: new statement).
     */
    handleIndentation(): void;
    /**
     * Splice the line about to be lexed onto the previous logical line by
     * removing the NEWLINE / COMMENT tokens that separate them. Blank and
     * comment-only lines in between are layout and go too. INDENT / DEDENT
     * tokens are never removed: they belong to the previous real statement.
     *
     * The first token of the wrapped line is tagged with `wrapped` so the
     * parser can explain a syntax error caused by the join (TradingView says
     * "Syntax error at input 'v'" for `    v := 1` + `      v := 2`, which is
     * baffling without knowing the second line was treated as wrapping).
     */
    private joinWithPreviousLine;
    /**
     * True when the most recently emitted token (skipping NEWLINE / COMMENT
     * — those are layout, not content) is a token that requires a right-
     * hand-side and therefore implies the next non-blank line is a
     * continuation, not a new block.
     */
    private isContinuationFromPrevToken;
    readComment(): void;
    readString(): void;
    private readEscape;
    /**
     * Triple-quoted multiline string (`"""..."""` or `'''...'''`). The text
     * keeps its layout — newlines and the leading spaces of each line are part
     * of the value — while backslash escapes are processed as in a normal
     * string (verified against TradingView with str.length: `"""a\nb"""` is 3
     * characters). The lines inside the string never reach handleIndentation,
     * so their indentation carries no block structure.
     */
    private readMultilineString;
    readColorLiteral(): void;
    readNumber(): void;
    readIdentifier(): void;
    readOperatorOrPunctuation(): boolean;
    peek(offset?: number): string;
    advance(): string;
    skipWhitespaceInline(): void;
    isDigit(ch: any): boolean;
    isIdentifierStart(ch: any): boolean;
    isIdentifierChar(ch: any): boolean;
    getCurrentIndent(): number;
    addToken(type: any, value: any, indent?: any, raw?: any): void;
}
