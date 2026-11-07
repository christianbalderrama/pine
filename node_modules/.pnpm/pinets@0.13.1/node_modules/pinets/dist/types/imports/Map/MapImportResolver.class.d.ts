import { BaseImportResolver } from '../BaseImportResolver';
import type { BaseImportResolverConfig, ImportInfo } from '../IImportResolver';
/** Configuration for MapImportResolver. */
export interface MapImportResolverConfig extends BaseImportResolverConfig {
    /**
     * Library sources, keyed by full import path (`user/library/version`),
     * `user/library` (any version) or library name alone, looked up in that order.
     */
    libraries?: Record<string, string> | Map<string, string>;
}
/**
 * Library sources held in memory.
 *
 * ## Usage
 *
 * ### Direct instantiation:
 * ```typescript
 * pineTS.setImportResolver(new MapImportResolver({ libraries: { 'PineCoders/AllTimeHighLow/1': athSource, ta: taSource } }));
 * ```
 *
 * ### Via ImportResolver registry:
 * ```typescript
 * ImportResolver.Map.configure({ libraries: { 'PineCoders/AllTimeHighLow/1': athSource } });
 * pineTS.setImportResolver(ImportResolver.Map);
 * ```
 *
 * Lookups are not cached: a source added to the `libraries` object later is found.
 */
export declare class MapImportResolver extends BaseImportResolver<MapImportResolverConfig> {
    private _libraries;
    constructor(config?: MapImportResolverConfig);
    configure(config: MapImportResolverConfig): void;
    protected _resolveNative(info: ImportInfo): string | null;
    private _get;
}
