export declare const TokenType: {
    NUMBER: string;
    STRING: string;
    BOOLEAN: string;
    IDENTIFIER: string;
    KEYWORD: string;
    OPERATOR: string;
    LPAREN: string;
    RPAREN: string;
    LBRACKET: string;
    RBRACKET: string;
    LBRACE: string;
    RBRACE: string;
    COMMA: string;
    DOT: string;
    COLON: string;
    SEMICOLON: string;
    INDENT: string;
    DEDENT: string;
    NEWLINE: string;
    COMMENT: string;
    EOF: string;
};
export declare const Keywords: Set<string>;
export declare const ContextualKeywords: Set<string>;
export declare const ReservedWords: Set<string>;
export declare const MultiCharOperators: string[];
export declare class Token {
    type: string;
    value: any;
    line: number;
    column: number;
    indent: number;
    raw: string;
    /**
     * Present on the first token of a line that the lexer joined onto the
     * previous line because its indentation is not a multiple of four
     * (Pine line wrapping). `width` is the measured indentation in columns,
     * `fromLine` the line it was joined to, `column` where the token starts.
     */
    wrapped: {
        width: number;
        fromLine: number | null;
        column: number;
    } | null;
    /**
     * Set on a `[` lexed inside ( ) / [ ] / { }, where newlines are not
     * emitted: whatever line it sits on, it cannot open a new statement.
     */
    grouped: boolean;
    /** Column of the opening quote of a single-line string literal (`column` is past the closing one). */
    startColumn?: number;
    constructor(type: string, value: any, line: number, column: number, indent?: number, raw?: string);
}
