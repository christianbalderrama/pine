export declare class PineTypeObject {
    private _definition;
    context: any;
    get __def__(): Record<string, string>;
    /**
     * Back-reference to the UDT factory that produced this instance.
     * Used by `request.security_lower_tf`'s pure-builtin fast path to
     * detect UDTs whose field defaults are all bare price builtins
     * (e.g. `type candle { float o = open; float h = high; … }`) — when
     * detected, the secondary's per-LTF-bar values can be synthesised
     * directly from the candle stream without running any user script.
     * Optional and nullable: instances created outside `Type().new` (or
     * for legacy / direct constructions) leave this undefined and the
     * fast path simply doesn't engage.
     */
    _udt?: any;
    constructor(_definition: Record<string, string>, context: any, _udt?: any);
    copy(): PineTypeObject;
    _fieldValues(): Record<string, any>;
    toString(): string;
}
