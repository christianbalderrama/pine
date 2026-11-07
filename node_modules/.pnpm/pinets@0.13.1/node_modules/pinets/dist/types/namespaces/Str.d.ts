import { Context } from '..';
import { PineArrayObject } from './array/PineArrayObject';
export declare class Str {
    private context;
    constructor(context: Context);
    param(source: any, index?: number, name?: string): any;
    tostring(value: any, formatStr?: string): string;
    tonumber(value: any): number;
    lower(value: string): string;
    upper(value: string): string;
    trim(value: string): string;
    repeat(source: string, repeat: number, separator?: string): string;
    replace_all(source: string, target: string, replacement: string): string;
    replace(source: string, target: string, replacement: string, occurrence?: number): string;
    contains(source: string, target: string): boolean;
    endswith(source: string, target: string): boolean;
    startswith(source: string, target: string): boolean;
    pos(source: string, target: string): number;
    length(source: string): number;
    match(source: string, pattern: string): string;
    split(source: string, separator: string): PineArrayObject;
    substring(source: string, begin_pos: number, end_pos: number): string;
    /**
     * Format a UNIX millisecond time with a java.text.SimpleDateFormat pattern in a time zone
     * (see formatTime.ts). `time`, `format` and `timezone` can be passed by name.
     */
    format_time(...args: any[]): string;
    /**
     * Java MessageFormat, as TradingView runs it: `{0}`, `{0,number}`,
     * `{0,number,integer|percent|currency|<pattern>}`, `''` for a quote and `'...'` for literal
     * text. A placeholder without an argument stays `{n}`; a malformed placeholder is a runtime
     * error with Java's message. Date, time and choice placeholders are left as written.
     */
    format(message: string, ...args: any[]): string;
    private _formatArgument;
}
