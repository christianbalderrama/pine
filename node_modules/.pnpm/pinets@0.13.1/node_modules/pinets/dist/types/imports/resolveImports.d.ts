import type { IImportResolver, ImportResolverFn } from './IImportResolver';
/**
 * Fetch the libraries a Pine Script source imports, and theirs, through
 * `resolver`. Returns `{ [path]: source }`, ready for the `libraries` option
 * of `transpile`.
 *
 * Every import of the script itself must resolve. A library's own import that
 * the resolver does not know is left out: transpiling fails only if the script
 * uses code of that library which needs it.
 */
export declare function resolveImports(source: string, resolver: IImportResolver | ImportResolverFn | null | undefined): Promise<Record<string, string>>;
