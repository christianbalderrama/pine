import type { BaseImportResolverConfig, IImportResolver, ImportInfo } from './IImportResolver';
/**
 * Abstract base class for import resolvers.
 *
 * Provides shared logic: caching, the fail-early configuration check, and
 * the extension lookup of file-based resolvers.
 *
 * ## Caching
 *
 * `resolve()` asks `_resolveNative()` for each import path once and keeps the
 * result — the source, or `null` for a library the resolver does not know —
 * for `cacheDuration` milliseconds (by default, for as long as the resolver
 * lives), so libraries are not fetched again on every run, nor by the
 * secondary contexts of `request.security`. Concurrent requests for one path
 * share one call. An error is not kept: the next request tries again.
 * `configure()` and `clearCache()` empty the cache.
 *
 * ## Usage
 *
 * ```typescript
 * class MyImportResolver extends BaseImportResolver {
 *     constructor() {
 *         super({ requiresConfig: false, resolverName: 'My' });
 *     }
 *     protected async _resolveNative(info: ImportInfo) {
 *         const res = await fetch(`https://my-server/libraries/${info.name}`);
 *         return res.ok ? res.text() : null;
 *     }
 * }
 * ```
 */
export declare abstract class BaseImportResolver<TConfig extends BaseImportResolverConfig = BaseImportResolverConfig> implements IImportResolver {
    private _configured;
    private _resolverName;
    private _cached;
    private _cacheDuration;
    private _cache;
    constructor(options: {
        requiresConfig: boolean;
        resolverName: string;
        cached?: boolean;
    });
    /** Fail-early check, run before every `_resolveNative()` call. */
    protected ensureConfigured(): void;
    /**
     * Base configure — marks the resolver as configured and empties its cache.
     * Subclasses override to store their specific config, and must call `super.configure(config)`.
     */
    configure(config: TConfig): void;
    /** Whether this resolver has been configured (always true for resolvers without required config). */
    get isConfigured(): boolean;
    /** The library source for `path`, from the cache or `_resolveNative()`. */
    resolve(path: string, info: ImportInfo): Promise<string | null>;
    /** Forget every resolved library. */
    clearCache(): void;
    /**
     * Fetch a library's source. Subclasses MUST implement this. Return `null`
     * (or `undefined`) for a library this resolver does not know; throw for a
     * failure worth retrying (network error, invalid credentials).
     */
    protected abstract _resolveNative(info: ImportInfo): Promise<string | null | undefined> | string | null | undefined;
    /** The first of `base + extension`, for each extension in turn, that `read` finds. */
    protected firstFound(base: string, extensions: string[], read: (location: string) => Promise<string | null>): Promise<string | null>;
    private _resolveUncached;
}
