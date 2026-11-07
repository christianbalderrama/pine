import { Token } from './tokens';
export interface ImportSpec {
    /** `user/library/version`, the key a library source is resolved by. */
    path: string;
    user: string;
    name: string;
    version: number;
    /** Namespace the importing script uses; the library name when `as` is omitted. */
    alias: string;
}
/** Split `user/library/version`; throws on any other shape. */
export declare function parseImportPath(path: string): {
    user: string;
    name: string;
    version: number;
};
/**
 * Read the import statement whose `import` keyword is `tokens[start]`.
 * Returns the spec and the index of the first token after the statement.
 *
 * The path is rebuilt from the token texts: it holds no whitespace, and user
 * names may contain characters that lex as operators (`-`, `.`).
 */
export declare function readImportStatement(tokens: Token[], start: number): {
    spec: ImportSpec;
    next: number;
};
/**
 * The imports of a Pine Script source, read from its tokens alone so that
 * resolving a library's own imports does not need a full parse.
 */
export declare function scanImports(source: string): ImportSpec[];
