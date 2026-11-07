/**
 * The key under which `map` stores `key`. Colors are keys by value on TradingView, so a color written in
 * another form (`color.new(color.red, 0)` for `color.red`) finds the entry stored under the first form.
 */
export declare function resolveMapKey(map: Map<any, any>, key: any): any;
