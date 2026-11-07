import type { ImportSpec } from './imports';
export interface LinkResult {
    /** The script's own `import` statements. */
    imports: ImportSpec[];
    /** Those of `imports` whose library source was not provided. */
    unresolved: ImportSpec[];
}
/**
 * Link the libraries `ast` imports, in place. `libraries` maps import paths
 * (`user/library/version`, nested imports included) to Pine Script sources.
 * Without it, nothing is linked and every import is reported unresolved.
 */
export declare function linkLibraries(ast: any, libraries?: Record<string, string>): LinkResult;
