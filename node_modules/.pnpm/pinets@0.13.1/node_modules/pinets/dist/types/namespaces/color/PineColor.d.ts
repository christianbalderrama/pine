/**
 * Resolve any static color value to its `[r, g, b, a]` components (a in
 * 0..1). Accepts:
 *   - `#RRGGBB` / `#RRGGBBAA` hex
 *   - `rgb(r,g,b)` / `rgba(r,g,b,a)` strings
 *   - a named constant, with or without the namespace: `color.red` / `red`
 * Returns null for anything it can't parse as a color.
 */
export declare function resolveColorToRgba(value: unknown): [number, number, number, number] | null;
/**
 * Format `[r, g, b, a]` (a in 0..1) as a canonical 8-digit RGBA hex string
 * `#RRGGBBAA` (uppercase, alpha byte ALWAYS present — `FF` = fully opaque).
 */
export declare function rgbaToHex8(r: number, g: number, b: number, a: number): string;
/**
 * Normalize any color value to a canonical 8-digit RGBA hex string
 * `#RRGGBBAA` (see {@link rgbaToHex8}). Accepts every shape a color input
 * can carry (hex, rgb()/rgba(), named constant). Values it can't parse as
 * a color are returned unchanged, so non-color data passes through
 * untouched. Used by `Indicator.getInputsMeta()` to present color-input
 * defaults in a single canonical form.
 */
export declare function normalizeColorToRgbaHex(value: unknown): unknown;
/**
 * PineColor implements the Pine Script `color` namespace.
 *
 * Supports:
 * - color(na)                          → type-cast (via any())
 * - color.new(color, alpha)            → apply transparency
 * - color.rgb(r, g, b, a?)            → create from components
 * - color.from_gradient(...)           → interpolate between two colors
 * - color.r/g/b/t(color)              → extract individual components
 * - color.red, color.blue, ...        → named constants
 */
export declare class PineColor {
    private context;
    constructor(context: any);
    any(value: any): any;
    param(source: any, index?: number): any;
    new(color: any, a?: number): any;
    rgb(r: number, g: number, b: number, a?: number): string;
    from_gradient(value: any, bottom_value: any, top_value: any, bottom_color: any, top_color: any): any;
    /** Extract red component (0-255). Returns na if the value is not a color. */
    r(color: any): number;
    /** Extract green component (0-255). Returns na if the value is not a color. */
    g(color: any): number;
    /** Extract blue component (0-255). Returns na if the value is not a color. */
    b(color: any): number;
    /** Extract transparency (0-100, Pine scale), rounded from the alpha byte. Returns na if the value is not a color. */
    t(color: any): number;
    aqua(): "#00BCD4";
    black(): "#363A45";
    blue(): "#2962FF";
    fuchsia(): "#E040FB";
    gray(): "#787B86";
    green(): "#4CAF50";
    lime(): "#00E676";
    maroon(): "#880E4F";
    navy(): "#311B92";
    olive(): "#808000";
    orange(): "#FF9800";
    purple(): "#9C27B0";
    red(): "#F23645";
    silver(): "#B2B5BE";
    teal(): "#089981";
    white(): "#FFFFFF";
    yellow(): "#FDD835";
}
