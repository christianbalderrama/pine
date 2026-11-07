import { BaseImportResolver } from '../BaseImportResolver';
import type { BaseImportResolverConfig, ImportInfo } from '../IImportResolver';
/** Configuration for FileImportResolver. */
export interface FileImportResolverConfig extends BaseImportResolverConfig {
    /**
     * Folder holding one file per library, named after the library, or a path
     * template with `{user}`, `{name}`, `{version}` and `{path}` placeholders.
     */
    dir: string;
    /** Suffixes tried in turn after the path. Default `['', '.pine', '.txt']`. */
    extensions?: string[];
}
/**
 * Library sources read from local files. Node.js only: excluded from browser
 * builds, where a stub throws instead.
 *
 * ## Usage
 *
 * ### Direct instantiation:
 * ```typescript
 * pineTS.setImportResolver(new FileImportResolver({ dir: './pine/libraries' }));
 * ```
 *
 * ### Via ImportResolver registry:
 * ```typescript
 * ImportResolver.File.configure({ dir: './pine/{user}/{name}-v{version}.pine', extensions: [''] });
 * pineTS.setImportResolver(ImportResolver.File);
 * ```
 */
export declare class FileImportResolver extends BaseImportResolver<FileImportResolverConfig> {
    private _dir;
    private _extensions;
    constructor(config?: FileImportResolverConfig);
    configure(config: FileImportResolverConfig): void;
    protected _resolveNative(info: ImportInfo): Promise<string | null>;
}
