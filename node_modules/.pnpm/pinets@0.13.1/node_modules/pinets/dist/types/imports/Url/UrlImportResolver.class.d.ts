import { BaseImportResolver } from '../BaseImportResolver';
import type { BaseImportResolverConfig, ImportInfo } from '../IImportResolver';
import { type FetchFn } from '../utils';
/** Configuration for UrlImportResolver. */
export interface UrlImportResolverConfig extends BaseImportResolverConfig {
    /** URL of a library, with `{user}`, `{name}`, `{version}` and `{path}` placeholders, or a function building it. */
    url: string | ((info: ImportInfo) => string);
    /** Request headers (authorization, ...). */
    headers?: Record<string, string>;
    /** `fetch` implementation; the global one by default. */
    fetch?: FetchFn;
}
/**
 * Library sources fetched over HTTP. A 404 response means "unknown library";
 * other error statuses throw.
 *
 * ## Usage
 *
 * ### Direct instantiation:
 * ```typescript
 * pineTS.setImportResolver(new UrlImportResolver({ url: 'https://example.com/pine/{user}/{name}/{version}.pine' }));
 * ```
 *
 * ### Via ImportResolver registry:
 * ```typescript
 * ImportResolver.Url.configure({ url: 'https://example.com/pine/{name}.pine', headers: { Authorization: `Bearer ${token}` } });
 * pineTS.setImportResolver(ImportResolver.Url);
 * ```
 */
export declare class UrlImportResolver extends BaseImportResolver<UrlImportResolverConfig> {
    private _url;
    private _headers;
    private _fetch;
    constructor(config?: UrlImportResolverConfig);
    configure(config: UrlImportResolverConfig): void;
    protected _resolveNative(info: ImportInfo): Promise<string | null>;
}
