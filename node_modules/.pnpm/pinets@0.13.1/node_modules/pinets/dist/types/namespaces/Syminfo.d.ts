/**
 * The `syminfo` namespace: the provider's symbol info (`syminfo.ticker`, `syminfo.mintick`, …) plus
 * the function forms `syminfo.ticker(symbol)` / `syminfo.prefix(symbol)`, which the transpiler emits
 * as `syminfo.__ticker` / `syminfo.__prefix` since the variables of the same name are strings.
 */
export declare function createSyminfo(info: any): any;
