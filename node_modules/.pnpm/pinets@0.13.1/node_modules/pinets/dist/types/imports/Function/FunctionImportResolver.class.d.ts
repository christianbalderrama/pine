import { BaseImportResolver } from '../BaseImportResolver';
import type { IImportResolver, ImportInfo, ImportResolverFn } from '../IImportResolver';
/**
 * A plain function `(path, info) => source | null` as an import resolver, with
 * the caching of `BaseImportResolver`. `PineTS.setImportResolver` wraps a
 * function it is given in one of these.
 *
 * ```typescript
 * pineTS.setImportResolver(async (path, { name }) => {
 *     const res = await fetch(`https://my-server/libraries/${name}`);
 *     return res.ok ? res.text() : null;
 * });
 * ```
 */
export declare class FunctionImportResolver extends BaseImportResolver {
    private readonly _fn;
    constructor(_fn: ImportResolverFn);
    protected _resolveNative(info: ImportInfo): string | Promise<string>;
}
/** An import resolver, or a plain function wrapped as one. */
export declare function toImportResolver(resolver: IImportResolver | ImportResolverFn): IImportResolver;
