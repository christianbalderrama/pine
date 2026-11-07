import type { ImportInfo } from './IImportResolver';
/** The subset of `fetch` the URL-based resolvers use; pass your own to run without a global `fetch`. */
export type FetchFn = (url: string, init?: {
    headers?: Record<string, string>;
}) => Promise<{
    ok: boolean;
    status: number;
    statusText?: string;
    text(): Promise<string>;
}>;
/** Replace the `{path}`, `{user}`, `{name}` and `{version}` placeholders with the import's values. */
export declare function fillTemplate(template: string, info: ImportInfo): string;
/** Body of a successful response, `null` on 404; other statuses throw. */
export declare function fetchText(fetchFn: FetchFn | undefined, url: string, headers?: Record<string, string>): Promise<string | null>;
