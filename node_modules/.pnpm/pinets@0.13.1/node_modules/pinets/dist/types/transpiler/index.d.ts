/**
 * `libraries` maps the import paths (`user/library/version`) of the libraries a
 * Pine Script source imports, its libraries' own imports included, to their
 * sources. See `resolveImports` to collect them with an import resolver.
 */
export declare function transpile(source: string | Function, options?: {
    debug: boolean;
    ln?: boolean;
    verify?: boolean;
    pineOnly?: boolean;
    libraries?: Record<string, string>;
}): Function;
