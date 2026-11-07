import { BaseImportResolver } from '../BaseImportResolver';
import type { BaseImportResolverConfig, IImportResolver, ImportInfo, ImportResolverFn } from '../IImportResolver';
/** Configuration for ChainImportResolver. */
export interface ChainImportResolverConfig extends BaseImportResolverConfig {
    /** Resolvers asked in turn; the first source found wins. */
    resolvers?: (IImportResolver | ImportResolverFn)[];
}
/**
 * Asks several resolvers in turn; the first source found wins. Each resolver
 * keeps its own cache, so the chain itself does not cache.
 *
 * ```typescript
 * pineTS.setImportResolver(
 *     new ChainImportResolver({
 *         resolvers: [
 *             new MapImportResolver({ libraries: { 'PineCoders/AllTimeHighLow/1': athSource } }),
 *             new GitHubImportResolver({ url: 'https://github.com/acme/pine-libraries/tree/main/libraries', token }),
 *         ],
 *     })
 * );
 * ```
 */
export declare class ChainImportResolver extends BaseImportResolver<ChainImportResolverConfig> {
    private _resolvers;
    constructor(config?: ChainImportResolverConfig);
    configure(config: ChainImportResolverConfig): void;
    protected _resolveNative(info: ImportInfo): Promise<string | null>;
}
