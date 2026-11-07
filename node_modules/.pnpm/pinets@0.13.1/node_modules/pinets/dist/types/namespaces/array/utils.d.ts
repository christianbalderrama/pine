import { PineArrayType } from './PineArrayObject';
export declare function isNa(value: any): boolean;
/** A color literal (`#RRGGBB`, `#RRGGBBAA`, `rgb()`, `rgba()`) in its canonical `#RRGGBBAA` form, or null. */
export declare function colorKey(value: any): string | null;
/**
 * Equality of two non-na elements: numbers are equal within an absolute 1e-10, and the same color written in
 * two forms (`color.red`, `color.new(color.red, 0)`, `color.rgb(242, 54, 69)`) is one value.
 */
export declare function pineValuesEqual(a: any, b: any): boolean;
/**
 * Element test of `array.includes` / `indexof` / `lastindexof` for `value`. How na compares depends on the
 * element type on TradingView: a numeric na matches nothing, an na string is the empty string, and an na
 * color matches an na color up to Pine v5 only.
 */
export declare function elementMatcher(id: {
    type: PineArrayType;
    context: any;
}, value: any): (v: any) => boolean;
/**
 * Reader for the value an element is sorted / searched by. Elements of a user-defined type are read through
 * `sortField`: a field name, or a field index in declaration order; the default is the first field.
 */
export declare function sortValueReader(values: ArrayLike<any>, sortField?: string | number): ((v: any) => any) | null;
/** Ascending comparison of sort keys: numbers with na last, strings in ordinal order with na first. */
export declare function compareAscending(a: any, b: any, strings: boolean): number;
/**
 * Indices of `keys` in sort order. TradingView sorts ascending (stable) and reverses the result for
 * `order.descending`, so equal keys also come out reversed.
 */
export declare function sortedIndices(keys: any[], _order?: any): number[];
/** `values` sorted in place like {@link sortedIndices}, for plain values where equal elements are interchangeable. */
export declare function sortPlainValues(values: any[], _order?: any): any[];
/** Throws TradingView's out-of-bounds runtime error. */
export declare function outOfBounds(index: number, size: number, method: string): never;
/** Throws TradingView's runtime error for `first()` / `last()` / `pop()` / `shift()` on an empty array. */
export declare function emptyArray(fn: string): never;
/** Throws TradingView's runtime error for a percentile outside [0..100]. */
export declare function checkPercentage(percentage: number, method: string): void;
export declare function inferArrayType(values: any[]): PineArrayType;
export declare function inferValueType(value: any): PineArrayType;
export declare function isArrayOfType(array: any[], type: PineArrayType): boolean;
export declare function isValueOfType(value: any, type: PineArrayType): boolean;
