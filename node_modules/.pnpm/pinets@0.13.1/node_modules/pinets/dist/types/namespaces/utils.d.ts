import { Series } from '../Series';
export declare function isScalarHelper(arg: any): boolean;
export type PineTypeMap<T> = {
    [K in keyof T]-?: T[K] extends number ? 'number' : T[K] extends string ? 'string' : T[K] extends boolean ? 'boolean' : T[K] extends Series ? 'series' : T[K] extends Array<any> ? 'array' : never;
};
/** True for the trailing named-arguments object the transpiler emits (`f(a, title="x")` → `f(a, {title: "x"})`). */
export declare function isNamedArgsBag(arg: any): boolean;
/**
 * Extract a transpiler-injected callsite ID from the end of an arguments array.
 * The transpiler appends { __callsiteId: "_pN" } as the last argument for
 * plot/hline/fill calls to uniquely identify each call-site.
 * Returns the ID string and removes the sentinel object from the array.
 */
export declare function extractCallsiteId(args: any[]): string | undefined;
/**
 * This function is used to parse the arguments for a Pine params.
 * @param args - The arguments to parse.
 * @param signatures - The signatures to parse, each signature is an array of argument names.
 * @param types - The types to parse, each type is a string representing the type of the argument.
 * @returns The parsed arguments, the arguments are parsed according to the signatures and types.
 */
export declare function parseArgsForPineParams<T>(args: any[], signatures: any[], types: Record<string, string>, override?: Record<string, any>): T & Partial<T> & Record<string, any>;
