/**
 * Unwrap a transpiler-delivered argument to a plain value. Namespace calls get
 * their arguments `param`-wrapped, but instance-method calls (`fp.get_row_by_price(close)`)
 * hand over whatever the script referenced: a Series, a `var` thunk, or the `na` helper.
 */
export declare function resolveArg(value: any): any;
