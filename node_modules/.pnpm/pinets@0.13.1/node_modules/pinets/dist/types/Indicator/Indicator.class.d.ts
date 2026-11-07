import type { IImportResolver } from '../imports/IImportResolver';
import type { IPineInput, IPineProp, PreparedScript } from './types';
/**
 * The single owner of every per-script artifact. Holds the source, lazily
 * transpiles + scans inputs on first `prepare()`, and caches the result so
 * the same Indicator instance can be passed to multiple `pine.run()` calls
 * without re-transpiling.
 *
 * Roles:
 *   - `source`            — the original Pine string or JS callback.
 *   - `input`             — live, title-keyed view of input values. Read or
 *                            mutate per key; the container itself is frozen.
 *   - `inputs`            — LEGACY title-keyed override map (constructor
 *                            arg). Kept for back-compat; merged into the
 *                            prepared inputs by `prepare()`.
 *   - `prepare(opts?)`    — idempotent: transpiles, scans inputs, runs
 *                            visible-range static analysis. Caches result.
 *   - `usesVisibleRange()`— derived from the cached prepare() result.
 *
 * For JS-function source the AST scan returns `[]`, so `input` is empty and
 * per-key writes throw "unknown title". The legacy `inputs` field still
 * works for that path.
 */
export declare class Indicator {
    readonly source: Function | string;
    inputs: Record<string, unknown>;
    readonly input: Record<string, unknown>;
    readonly prop: Record<string, unknown>;
    private _prepared;
    private _libraries;
    private _librariesResolver;
    private _inputMeta;
    private _inputValues;
    private _explicitOverrides;
    private _inputProxy;
    private _inputMetaByKey;
    private _propMeta;
    private _propValues;
    private _propProxy;
    private _declarationType;
    private _sourcePropArgs;
    private _explicitPropOverrides;
    constructor(source: Function | string, inputs?: Record<string, unknown>);
    /**
     * Normalize ANY accepted run() argument into an Indicator. Raw functions
     * and strings get wrapped in a throwaway Indicator; existing Indicators
     * pass through. This is the single entry point used by PineTS's run /
     * stream / update so the rest of the engine only deals with Indicators.
     */
    static from(arg: Indicator | Function | string): Indicator;
    /**
     * Idempotent transpile + scan + viewport detection. The result is cached
     * on the instance, so passing the same Indicator to multiple `pine.run()`
     * calls produces a single transpilation pass.
     *
     * NB: cache is keyed by *instance identity*, not by options. If you need
     * different debug settings, create a new Indicator.
     */
    prepare(opts?: {
        debug?: boolean;
        ln?: boolean;
    }): PreparedScript;
    /**
     * Fetch the sources of the libraries the script imports (and theirs)
     * through `resolver`, for `prepare()` to link. `PineTS.run()` calls it with
     * the resolver set by `setImportResolver`. Run with another resolver, the
     * Indicator is transpiled again if that resolver serves other sources.
     * Throws when the script imports a library the resolver does not know.
     */
    resolveImports(resolver: IImportResolver | null): Promise<void>;
    /** True iff the script references any built-in in `VIEWPORT_DEPENDENT_BUILTINS`. */
    usesVisibleRange(): boolean;
    /**
     * Input override map used by the runtime (read by
     * `input.utils.resolveInput`). Composed at call time so live mutations
     * to `.input` between `pine.run()` calls are picked up automatically.
     *
     * Keys are mixed by design and resolved in this precedence by the runtime
     * (inputId → varId → title):
     *   1. Legacy constructor `inputs` map        — any key (title, varId, `in_N`)
     *   2. Explicit `.input[...]` writes          — forwarded under the input's
     *      id (`in_N`, exact) and under its canonical key when no other input
     *      answers to that name (back-compat for readers of this map).
     *
     * Defaults are NOT included — the runtime falls back to `defval` when no
     * override key matches.
     */
    getRuntimeInputs(): Record<string, unknown>;
    /**
     * AST-parsed input metadata. Lazy. Empty array for JS-function source.
     */
    getInputsMeta(): IPineInput[];
    /**
     * Schema metadata for declaration props applicable to this script's type.
     * Includes non-mutable entries (`title`, `shorttitle`) for completeness —
     * UI builders can render them; writes to those keys via `.prop` still throw.
     */
    getPropsMeta(): IPineProp[];
    /**
     * Name-keyed map of user-overridden props for the runtime to merge on top
     * of the source-code's indicator()/strategy() call args. Only explicit
     * writes via `.prop` are included — source-code values flow through the
     * normal Pine call path.
     */
    getRuntimePropOverrides(): Record<string, unknown>;
    /**
     * Detected declaration type, or null if the source code has neither call.
     * `.prop` falls back to the indicator schema in the null case.
     */
    getDeclarationType(): 'indicator' | 'strategy' | null;
    private _ensureInputsScanned;
    private _getInputProxy;
    private _ensurePropsScanned;
    private _getPropProxy;
}
