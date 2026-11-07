import { BaseImportResolver } from '../BaseImportResolver';
import type { BaseImportResolverConfig, ImportInfo } from '../IImportResolver';
import { type FetchFn } from '../utils';
/** Configuration for GitHubImportResolver. */
export interface GitHubImportResolverConfig extends BaseImportResolverConfig {
    /**
     * Where the libraries are: a repository URL, a folder URL (`/tree/<ref>/<folder>`),
     * or a file URL (`/blob/<ref>/<file>`, or raw.githubusercontent.com) serving the
     * library named after the file. Alternatively, give `owner` / `repo` / `ref` / `path`.
     */
    url?: string;
    owner?: string;
    repo?: string;
    /** Branch, tag or commit; the default branch when omitted. */
    ref?: string;
    /**
     * Where a library's file is in the repository: a folder (the file being the
     * library name) or a template with `{user}`, `{name}`, `{version}` and `{path}`
     * placeholders (`pine/{name}/v{version}.pine`). The repository root by default.
     */
    path?: string;
    /** Access token, for private repositories (and GitHub's higher API rate limit). */
    token?: string;
    /** Suffixes tried in turn after a folder / template path. Default `['', '.pine']`. */
    extensions?: string[];
    /** `fetch` implementation; the global one by default. */
    fetch?: FetchFn;
}
/**
 * Library sources read from a GitHub repository. Public repositories are read
 * from raw.githubusercontent.com; with a `token`, the GitHub contents API is
 * used, which also serves private repositories. A 404 means "unknown library".
 *
 * Library versions are not part of the default file path: a repository usually
 * holds the latest version of each library only. Use a `path` template with
 * `{version}`, or a `ref`, to serve older ones.
 *
 * ## Usage
 *
 * ### Direct instantiation:
 * ```typescript
 * const github = new GitHubImportResolver({ url: 'https://github.com/acme/pine-libraries/tree/main/libraries', token });
 * pineTS.setImportResolver(github);
 * ```
 *
 * ### Via ImportResolver registry:
 * ```typescript
 * ImportResolver.GitHub.configure({ url: 'https://github.com/acme/pine-libraries/tree/main/libraries', token });
 * pineTS.setImportResolver(ImportResolver.GitHub);
 * ```
 */
export declare class GitHubImportResolver extends BaseImportResolver<GitHubImportResolverConfig> {
    private _location;
    private _token;
    private _extensions;
    private _fetch;
    constructor(config?: GitHubImportResolverConfig);
    configure(config: GitHubImportResolverConfig): void;
    protected _resolveNative(info: ImportInfo): Promise<string | null>;
    private _get;
}
