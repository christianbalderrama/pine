import type { IPineInput } from './types';
/**
 * Build the live `.input` view exposed on an `Indicator` instance.
 *
 * Keyed by **varId** (the assigned variable name) as the canonical, primary
 * override key, with the input's **title** and declaration **id** (`in_N`)
 * registered as aliases. `.input['Title']` keeps working for the common case
 * (unique, non-empty titles). When two inputs share a title, the title
 * aliases the first. An input without a free varId or title (untitled
 * argument inputs, a variable assigned from several inputs) is keyed by its
 * id, which is always unique.
 *
 * Backing machinery lives in `keyedProxy.ts` and is shared with `.prop`.
 */
export declare function buildInputProxy(metas: IPineInput[], onSet?: (key: string) => void): {
    proxy: Record<string, unknown>;
    values: Record<string, unknown>;
    metaByKey: Map<string, IPineInput>;
};
