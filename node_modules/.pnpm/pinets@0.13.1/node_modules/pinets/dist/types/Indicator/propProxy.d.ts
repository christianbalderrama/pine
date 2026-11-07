import type { IPineProp } from './types';
/**
 * Build the live `.prop` view exposed on an `Indicator` instance.
 * Name-keyed; non-mutable entries (`title`, `shorttitle`) are excluded.
 *
 * `sourceArgs` seeds source-code defaults on top of spec defaults so the
 * read view matches what TradingView's runtime would see before any user
 * override. Layer order: spec.defval ← sourceArgs ← user `.prop` writes.
 *
 * Backing machinery lives in `keyedProxy.ts` and is shared with `.input`.
 */
export declare function buildPropProxy(props: IPineProp[], sourceArgs: Record<string, unknown>, onSet?: (name: string) => void): {
    proxy: Record<string, unknown>;
    values: Record<string, unknown>;
    propByName: Map<string, IPineProp>;
};
