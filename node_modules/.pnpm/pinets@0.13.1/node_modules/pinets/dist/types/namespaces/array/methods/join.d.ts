import { PineArrayObject } from '../PineArrayObject';
/**
 * Joins the elements of the array into a string, separated by the separator (default: none).
 * Float elements are printed like Java's Double.toString (`5.0`, `1.0E8`), as on TradingView.
 * @param context - The context of the array.
 * @returns The string of the joined elements.
 */
export declare function join(context: any): (id: PineArrayObject, separator?: string) => string;
