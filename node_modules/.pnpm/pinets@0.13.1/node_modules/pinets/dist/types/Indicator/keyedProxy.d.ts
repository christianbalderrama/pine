/**
 * Generic title/name-keyed Proxy with per-key validation. Shared backend for
 * both `Indicator.input` (keyed by input title) and `Indicator.prop` (keyed
 * by declaration arg name).
 *
 * Contract:
 *   - Read:    returns current value (default OR user-overridden) at the key.
 *   - Write:   validates against the entry's meta — type, options, minval,
 *              maxval — and stores the override. Invalid writes THROW with
 *              a tailored message.
 *   - Delete:  throws.
 *   - Unknown key write: throws, listing the known keys.
 *   - Object.keys() / spread / console.log show real keys with current values.
 */
export type KeyedType = 'int' | 'float' | 'bool' | 'string' | 'source' | 'color' | 'enum' | 'price' | 'time' | 'session' | 'symbol' | 'timeframe' | 'text_area';
export interface KeyedSchemaEntry {
    key: string;
    type: KeyedType;
    defval: unknown;
    options?: unknown[];
    minval?: number;
    maxval?: number;
    /**
     * Secondary keys that also resolve to this entry (e.g. an input's title
     * aliasing its varId). The canonical `key` always takes priority; an alias
     * is registered only if not already claimed by a canonical key or an
     * earlier entry. Values/overrides are stored under the canonical key, so
     * reading or writing via an alias hits the same slot.
     */
    aliases?: string[];
}
export interface BuildKeyedProxyResult {
    proxy: Record<string, unknown>;
    values: Record<string, unknown>;
    entryByKey: Map<string, KeyedSchemaEntry>;
}
/**
 * Build a keyed proxy view.
 *
 * @param entries  schema entries — defaults seeded into `values`
 * @param label    display label for error messages, e.g. 'Indicator.input' or 'Indicator.prop'
 * @param onSet    optional callback fired after a successful write (for explicit-override tracking)
 * @param seedValues  optional initial values overriding entry defvals (used by .prop to seed
 *                    source-code defaults on top of spec defaults)
 * @param keyNoun  noun for the unknown-key message, defaults to 'key'. Inputs use 'input title'.
 */
export declare function buildKeyedProxy(entries: KeyedSchemaEntry[], label: string, onSet?: (key: string) => void, seedValues?: Record<string, unknown>, keyNoun?: string): BuildKeyedProxyResult;
/**
 * Per-entry write validation. Throws on any rule violation.
 */
export declare function validate(entry: KeyedSchemaEntry, value: unknown, label: string): void;
